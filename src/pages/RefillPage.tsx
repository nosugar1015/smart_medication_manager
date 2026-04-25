import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/useApp'

const levelText = {
  none: '库存充足',
  yellow: '黄色提醒：药品剩余 3 天内',
  orange: '橙色警告：药品仅剩 1 天',
  red: '红色预警：药品已耗尽',
}

export const RefillPage = () => {
  const navigate = useNavigate()
  const { reminderOverview, startRefill } = useApp()
  const riskList = reminderOverview.filter((item) => item.warningLevel !== 'none')

  return (
    <div className="page-stack">
      <section className="panel">
        <p className="eyebrow">续方管理</p>
        <h2>库存预警与一键续方</h2>
        <p>系统基于总药量与已服用量计算剩余天数，并自动提醒续方。</p>
      </section>

      <section className="card-list">
        {riskList.length === 0 ? (
          <article className="panel empty-card">
            <p>目前暂无断药风险，药品库存仍充足。</p>
          </article>
        ) : (
          riskList.map((item) => (
            <article key={item.id} className="medication-card">
              <div className="medication-header">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.dose}</p>
                </div>
                <span className={`warning-badge ${item.warningLevel}`}>{levelText[item.warningLevel]}</span>
              </div>
              <div className="detail-grid">
                <div>
                  <span>剩余天数</span>
                  <strong>{item.remainingDays}</strong>
                </div>
                <div>
                  <span>服药频次</span>
                  <strong>每日 {item.frequencyPerDay} 次</strong>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      <button
        type="button"
        className="primary-button"
        onClick={() => {
          startRefill()
          navigate('/consultation')
        }}
      >
        一键续方并带入历史记录
      </button>
    </div>
  )
}
