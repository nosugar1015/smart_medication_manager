import { Navigate, useNavigate } from 'react-router-dom'
import { calculateRemainingDays, getWarningLevel } from '../data/mockData'
import { useApp } from '../store/useApp'

export const PlanPage = () => {
  const navigate = useNavigate()
  const { state, confirmPlan } = useApp()

  if (!state.plan || !state.latestConsultation) {
    return <Navigate to="/consultation" replace />
  }

  return (
    <div className="page-stack page-stack-accent page-stack-plan">
      <section className="hero-card plan-hero-card">
        <div className="hero-copy">
          <span className="chip consultation-tag-chip">已生成用药建议</span>
          <h2>医生建议已整理完成，请先确认后继续购药</h2>
          <p>
            本次问诊已为您整理出 {state.plan.medications.length} 种建议药品。请重点查看剩余天数、剂量和服用时机，确认后继续进入购药流程并准备激活提醒。
          </p>
          <div className="plan-hero-tags">
            <span className="chip consultation-tag-chip">先核对剂量频次</span>
            <span className="chip consultation-tag-chip">确认后继续购药</span>
          </div>
        </div>
      </section>

      <section className="panel plan-summary-panel">
        <div className="section-header">
          <div>
            <h3>本次建议摘要</h3>
            <p>问诊建议已经按当前病情整理，确认后将进入购药并激活后续提醒。</p>
          </div>
          <span className="warning-badge yellow">{state.plan.diseaseType}</span>
        </div>
        <div className="detail-grid">
          <div>
            <span>建议药品数</span>
            <strong>{state.plan.medications.length} 种</strong>
          </div>
          <div>
            <span>当前流程</span>
            <strong>问诊后待确认</strong>
          </div>
        </div>
      </section>

      <section className="card-list">
        {state.plan.medications.map((medication) => {
          const remainingDays = calculateRemainingDays(medication)
          const warningLevel = getWarningLevel(remainingDays)
          return (
            <article key={medication.id} className={`medication-card medication-card-${warningLevel} plan-medication-card`}>
              <div className="medication-header">
                <div>
                  <p className="emoji-avatar">{medication.image}</p>
                  <div>
                    <h3>{medication.name}</h3>
                    <p>{medication.genericName}</p>
                  </div>
                </div>
                <span className={`warning-badge ${warningLevel}`}>预计可维持 {remainingDays} 天</span>
              </div>
              <div className="detail-grid plan-detail-grid">
                <div>
                  <span>单次剂量</span>
                  <strong>{medication.dose}</strong>
                </div>
                <div>
                  <span>频次</span>
                  <strong>每日 {medication.frequencyPerDay} 次</strong>
                </div>
                <div>
                  <span>服用时机</span>
                  <strong>{medication.timing}</strong>
                </div>
                <div>
                  <span>周期</span>
                  <strong>{medication.cycleDays} 天</strong>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <button
        type="button"
        className="primary-button"
        onClick={() => {
          confirmPlan()
          navigate('/purchase')
        }}
      >
        确认方案并继续
      </button>
    </div>
  )
}
