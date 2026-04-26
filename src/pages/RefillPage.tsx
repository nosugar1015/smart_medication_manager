import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/useApp'
import type { WarningLevel } from '../types'

const levelText = {
  none: '库存状态稳定',
  yellow: '关注：剩余 3 天内',
  orange: '预警：仅剩 1 天',
  red: '高风险：药品已耗尽',
}

const riskGroupMeta: Record<Exclude<WarningLevel, 'none'>, { title: string; description: string }> = {
  red: {
    title: '请先续方的药品',
    description: '这些药品已经耗尽，请先处理。',
  },
  orange: {
    title: '需要尽快续方的药品',
    description: '这些药品仅剩 1 天，请尽快安排续方。',
  },
  yellow: {
    title: '近期要关注的药品',
    description: '这些药品将在 3 天内接近警戒线。',
  },
}

const refillRiskOrder: Array<Exclude<WarningLevel, 'none'>> = ['red', 'orange', 'yellow']

export const RefillPage = () => {
  const navigate = useNavigate()
  const { hasActiveMedicationPlan, reminderOverview, startRefill } = useApp()
  const [expandedMedicationIds, setExpandedMedicationIds] = useState<string[]>([])
  const riskList = reminderOverview.filter((item) => item.warningLevel !== 'none')

  const toggleMedicationDetails = (medicationId: string) => {
    setExpandedMedicationIds((current) =>
      current.includes(medicationId) ? current.filter((id) => id !== medicationId) : [...current, medicationId],
    )
  }
  const highestRisk = riskList.some((item) => item.warningLevel === 'red')
    ? '高风险'
    : riskList.some((item) => item.warningLevel === 'orange')
      ? '中高风险'
      : riskList.some((item) => item.warningLevel === 'yellow')
        ? '关注中'
        : '稳定'

  const groupedRiskList = refillRiskOrder
    .map((level) => ({
      level,
      ...riskGroupMeta[level],
      medications: riskList.filter((item) => item.warningLevel === level).sort((a, b) => a.remainingDays - b.remainingDays),
    }))
    .filter((group) => group.medications.length > 0)

  return (
    <div className="page-stack page-stack-accent page-stack-refill">
      <section className="metric-grid metric-grid-refill">
        <div className="metric-card metric-card-mode">
          <span>当前模式</span>
          <strong>{hasActiveMedicationPlan ? '续方检查中' : '尚未开始管理'}</strong>
        </div>
        <div className="metric-card metric-card-risk">
          <span>风险药品数</span>
          <strong>{riskList.length}</strong>
        </div>
        <div className="metric-card metric-card-alert">
          <span>最高风险等级</span>
          <strong>{highestRisk}</strong>
        </div>
        <div className="metric-card metric-card-action">
          <span>建议动作</span>
          <strong>{riskList.length > 0 ? '尽快发起续方' : '继续观察库存'}</strong>
        </div>
      </section>

      <section className="card-list">
        {!hasActiveMedicationPlan ? (
          <article className="panel empty-card">
            <p>当前暂无正在管理的用药，请先完成问诊并购药后再查看续方风险。</p>
          </article>
        ) : riskList.length === 0 ? (
          <article className="panel empty-card">
            <p>目前暂无断药风险，药品库存处于可维持状态。</p>
          </article>
        ) : (
          groupedRiskList.map((group) => (
            <section key={group.level} className="risk-group-section">
              <div className="section-header risk-group-header">
                <div>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </div>
                <span className={`warning-badge ${group.level}`}>{group.medications.length} 种药品</span>
              </div>

              <div className="card-list">
                {group.medications.map((item) => {
                  const isExpanded = expandedMedicationIds.includes(item.id)
                  const actionText = item.warningLevel === 'red' ? '立即续方' : '尽快复诊续方'
                  const statusText = item.warningLevel === 'red' ? '存在断药风险' : '库存接近警戒线'

                  return (
                    <article key={item.id} className={`medication-card medication-card-${item.warningLevel} medication-card-compact`}>
                      <div className="medication-header">
                        <div>
                          <p className="emoji-avatar">{item.image}</p>
                          <div>
                            <h3>{item.name}</h3>
                            <p className="medication-summary-text">
                              {item.dose} · 每日 {item.frequencyPerDay} 次 · {item.timing}
                            </p>
                          </div>
                        </div>
                        <span className={`warning-badge ${item.warningLevel}`}>{levelText[item.warningLevel]}</span>
                      </div>

                      <div className="medication-summary-grid">
                        <div>
                          <span>剩余天数</span>
                          <strong>{item.remainingDays} 天</strong>
                        </div>
                        <div>
                          <span>建议处理</span>
                          <strong>{actionText}</strong>
                        </div>
                      </div>

                      {isExpanded ? (
                        <div className="detail-grid medication-detail-panel">
                          <div>
                            <span>剩余天数</span>
                            <strong>{item.remainingDays} 天</strong>
                          </div>
                          <div>
                            <span>服药频次</span>
                            <strong>每日 {item.frequencyPerDay} 次</strong>
                          </div>
                          <div>
                            <span>建议处理</span>
                            <strong>{actionText}</strong>
                          </div>
                          <div>
                            <span>状态说明</span>
                            <strong>{statusText}</strong>
                          </div>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        className="medication-toggle-button"
                        onClick={() => toggleMedicationDetails(item.id)}
                      >
                        {isExpanded ? '收起详情' : '展开详情'}
                      </button>
                    </article>
                  )
                })}
              </div>
            </section>
          ))
        )}
      </section>

      {hasActiveMedicationPlan ? (
        <button
          type="button"
          className="primary-button"
          onClick={() => {
            startRefill()
            navigate('/consultation')
          }}
        >
          发起续方并带入历史记录
        </button>
      ) : (
        <button type="button" className="primary-button" onClick={() => navigate('/consultation')}>
          先去问诊
        </button>
      )}
    </div>
  )
}
