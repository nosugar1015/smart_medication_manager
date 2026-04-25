import { Link } from 'react-router-dom'
import { useApp } from '../store/useApp'

const warningText = {
  none: '库存充足',
  yellow: '剩余 3 天内，请留意续方',
  orange: '剩余 1 天，建议尽快续方',
  red: '药品耗尽，请立即续方',
}

export const DashboardPage = () => {
  const { state, reminderOverview, pendingReminders } = useApp()

  return (
    <div className="page-stack">
      <section className="panel">
        <p className="eyebrow">正在服用清单</p>
        <h2>当前用药看板</h2>
        <p>
          {state.plan?.purchaseStatus === 'purchased'
            ? '药品已购买，提醒已自动激活。'
            : '尚未完成购药，建议先去购药页激活提醒。'}
        </p>
      </section>

      <section className="metric-grid">
        <div className="metric-card">
          <span>待处理提醒</span>
          <strong>{pendingReminders.length}</strong>
        </div>
        <div className="metric-card">
          <span>已激活药品</span>
          <strong>{reminderOverview.length}</strong>
        </div>
        <div className="metric-card">
          <span>成长阶段</span>
          <strong>{state.growth.stage}</strong>
        </div>
      </section>

      <section className="card-list">
        {reminderOverview.length === 0 ? (
          <article className="panel empty-card">
            <p>当前还没有已激活药品，请先完成问诊和购药。</p>
            <Link className="primary-button" to="/consultation">
              去生成计划
            </Link>
          </article>
        ) : (
          reminderOverview.map((medication) => (
            <article key={medication.id} className="medication-card">
              <div className="medication-header">
                <div>
                  <p className="emoji-avatar">{medication.image}</p>
                  <div>
                    <h3>{medication.name}</h3>
                    <p>
                      {medication.dose} · 每日 {medication.frequencyPerDay} 次 · {medication.timing}
                    </p>
                  </div>
                </div>
                <span className={`warning-badge ${medication.warningLevel}`}>
                  {warningText[medication.warningLevel]}
                </span>
              </div>

              <div className="detail-grid">
                <div>
                  <span>服用进度</span>
                  <strong>
                    {medication.takenQuantity} / {medication.totalQuantity}
                  </strong>
                </div>
                <div>
                  <span>疗程</span>
                  <strong>{medication.cycleDays} 天</strong>
                </div>
                <div>
                  <span>剩余天数</span>
                  <strong>{medication.remainingDays} 天</strong>
                </div>
                <div>
                  <span>今日状态</span>
                  <strong>{pendingReminders.some((item) => item.medicationId === medication.id) ? '待确认' : '已完成'}</strong>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  )
}
