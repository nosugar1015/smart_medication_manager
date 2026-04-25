import { useMemo, useState } from 'react'
import { useApp } from '../store/useApp'

export const SettingsPage = () => {
  const { state, updateReminderPreset } = useApp()
  const [preMeal, setPreMeal] = useState(state.profile.reminderPreset.preMeal.join(','))
  const [postMeal, setPostMeal] = useState(state.profile.reminderPreset.postMeal.join(','))

  const summary = useMemo(
    () => [
      { label: '基础病史', value: state.profile.medicalHistory.join('；') },
      { label: '过敏史', value: state.profile.allergies.join('、') },
      { label: '家人手机号', value: state.profile.familyPhone },
      { label: '血压趋势', value: state.profile.healthMetrics.bloodPressure.join(' → ') },
      { label: '血糖趋势', value: state.profile.healthMetrics.bloodSugar.join(' → ') },
    ],
    [state.profile],
  )

  return (
    <div className="page-stack">
      <section className="panel">
        <p className="eyebrow">我的设置</p>
        <h2>提醒时间、病史档案与家人协同</h2>
        <p>在这里统一调整提醒基准时间，并查看结构化健康记录。</p>
      </section>

      <section className="panel form-panel">
        <label>
          饭前提醒时间（逗号分隔）
          <input value={preMeal} onChange={(event) => setPreMeal(event.target.value)} />
        </label>
        <label>
          饭后提醒时间（逗号分隔）
          <input value={postMeal} onChange={(event) => setPostMeal(event.target.value)} />
        </label>
        <button
          type="button"
          className="primary-button"
          onClick={() =>
            updateReminderPreset(
              preMeal.split(',').map((item) => item.trim()),
              postMeal.split(',').map((item) => item.trim()),
            )
          }
        >
          保存提醒时间
        </button>
      </section>

      <section className="card-list compact">
        {summary.map((item) => (
          <article key={item.label} className="list-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>
    </div>
  )
}
