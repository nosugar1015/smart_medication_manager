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
    <div className="page-stack">
      <section className="panel">
        <p className="eyebrow">用药计划单</p>
        <h2>{state.plan.diseaseType} 用药方案已生成</h2>
        <p>
          本次{state.latestConsultation.mode === 'first-visit' ? '首次咨询' : '复诊购药'}共生成 {state.plan.medications.length}{' '}
          种药品，请确认后进入购药环节。
        </p>
      </section>

      <section className="card-list">
        {state.plan.medications.map((medication) => {
          const remainingDays = calculateRemainingDays(medication)
          const warningLevel = getWarningLevel(remainingDays)
          return (
            <article key={medication.id} className="medication-card">
              <div className="medication-header">
                <div>
                  <p className="emoji-avatar">{medication.image}</p>
                  <div>
                    <h3>{medication.name}</h3>
                    <p>{medication.genericName}</p>
                  </div>
                </div>
                <span className={`warning-badge ${warningLevel}`}>剩余 {remainingDays} 天</span>
              </div>
              <div className="detail-grid">
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
        已知晓并确认
      </button>
    </div>
  )
}
