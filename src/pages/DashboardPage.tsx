import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store/useApp'
import type { WarningLevel } from '../types'

const warningText = {
  none: '库存状态稳定',
  yellow: '续方关注：剩余 3 天内',
  orange: '续方预警：剩余 1 天',
  red: '断药高风险：库存已耗尽',
}

const riskGroupMeta: Record<WarningLevel, { title: string; description: string }> = {
  red: {
    title: '请先处理的药品',
    description: '这些药品已经存在断药风险，请优先查看。',
  },
  orange: {
    title: '需要尽快处理的药品',
    description: '这些药品仅剩 1 天，请尽快安排续方。',
  },
  yellow: {
    title: '近期要关注的药品',
    description: '这些药品将在 3 天内接近警戒线。',
  },
  none: {
    title: '当前较稳定的药品',
    description: '这些药品库存仍较稳定，可继续按计划服用。',
  },
}

const riskOrder: WarningLevel[] = ['red', 'orange', 'yellow', 'none']

export const DashboardPage = () => {
  const { state, hasActiveMedicationPlan, reminderOverview, pendingReminders, growthTree } = useApp()
  const [expandedMedicationIds, setExpandedMedicationIds] = useState<string[]>([])

  const highRiskCount = reminderOverview.filter((item) => item.warningLevel === 'red' || item.warningLevel === 'orange').length

  const toggleMedicationDetails = (medicationId: string) => {
    setExpandedMedicationIds((current) =>
      current.includes(medicationId) ? current.filter((id) => id !== medicationId) : [...current, medicationId],
    )
  }

  const groupedMedications = riskOrder
    .map((level) => ({
      level,
      ...riskGroupMeta[level],
      medications: reminderOverview
        .filter((item) => item.warningLevel === level)
        .sort((a, b) => a.remainingDays - b.remainingDays),
    }))
    .filter((group) => group.medications.length > 0)

  return (
    <div className="page-stack page-stack-accent page-stack-dashboard">
      <section className="metric-grid">
        <div className="metric-card metric-card-risk">
          <span>今日待确认</span>
          <strong>{pendingReminders.length}</strong>
        </div>
        <div className="metric-card metric-card-mode">
          <span>已激活药品</span>
          <strong>{reminderOverview.length}</strong>
        </div>
        <div className="metric-card metric-card-alert">
          <span>断药风险药品</span>
          <strong>{highRiskCount}</strong>
        </div>
        <div className="metric-card metric-card-action">
          <span>树成长中</span>
          <strong>{growthTree.stageName}</strong>
          <p>连续记录 {state.growth.streakDays} 天</p>
        </div>
      </section>

      <section className="card-list">
        {!hasActiveMedicationPlan ? (
          <article className="panel empty-card">
            <p>当前暂无正在管理的用药，请先完成问诊和购药。</p>
            <Link className="primary-button" to="/consultation">
              去问诊生成方案
            </Link>
          </article>
        ) : reminderOverview.length === 0 ? (
          <article className="panel empty-card">
            <p>当前还没有已激活药品，请先完成问诊和购药。</p>
            <Link className="primary-button" to="/consultation">
              去生成计划
            </Link>
          </article>
        ) : (
          groupedMedications.map((group) => (
            <section key={group.level} className="risk-group-section">
              <div className="section-header risk-group-header">
                <div>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </div>
                <span className={`warning-badge ${group.level}`}>{group.medications.length} 种药品</span>
              </div>

              <div className="card-list">
                {group.medications.map((medication) => {
                  const isExpanded = expandedMedicationIds.includes(medication.id)
                  const todayStatus = pendingReminders.some((item) => item.medicationId === medication.id) ? '待确认' : '已确认'

                  return (
                    <article key={medication.id} className={`medication-card medication-card-${medication.warningLevel} medication-card-compact`}>
                      <div className="medication-header">
                        <div>
                          <p className="emoji-avatar">{medication.image}</p>
                          <div>
                            <h3>{medication.name}</h3>
                            <p className="medication-summary-text">
                              {medication.dose} · 每日 {medication.frequencyPerDay} 次 · {medication.timing}
                            </p>
                          </div>
                        </div>
                        <span className={`warning-badge ${medication.warningLevel}`}>
                          {warningText[medication.warningLevel]}
                        </span>
                      </div>

                      <div className="medication-summary-grid">
                        <div>
                          <span>剩余天数</span>
                          <strong>{medication.remainingDays} 天</strong>
                        </div>
                        <div>
                          <span>今日状态</span>
                          <strong>{todayStatus}</strong>
                        </div>
                      </div>

                      {isExpanded ? (
                        <div className="detail-grid medication-detail-panel">
                          <div>
                            <span>当前进度</span>
                            <strong>
                              {medication.takenQuantity} / {medication.totalQuantity}
                            </strong>
                          </div>
                          <div>
                            <span>疗程周期</span>
                            <strong>{medication.cycleDays} 天</strong>
                          </div>
                          <div>
                            <span>剩余天数</span>
                            <strong>{medication.remainingDays} 天</strong>
                          </div>
                          <div>
                            <span>今日状态</span>
                            <strong>{todayStatus}</strong>
                          </div>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        className="medication-toggle-button"
                        onClick={() => toggleMedicationDetails(medication.id)}
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
    </div>
  )
}
