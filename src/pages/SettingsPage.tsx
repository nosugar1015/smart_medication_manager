import { useMemo, useState } from 'react'
import { GrowthOverview } from '../components/GrowthOverview'
import { useApp } from '../store/useApp'

export const SettingsPage = () => {
  const { state, updateReminderPreset, growthTree, pendingReminders } = useApp()
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
    <div className="page-stack page-stack-accent page-stack-settings">
      <section className="hero-card settings-hero-card">
        <div className="hero-copy">
          <span className="chip consultation-tag-chip">我的设置</span>
          <h2>把提醒时间和健康档案整理清楚</h2>
          <p>统一管理提醒时点、家属联系方式和健康信息，后续问诊、提醒和续方会直接复用。</p>
        </div>
      </section>

      <GrowthOverview
        growth={state.growth}
        growthTree={growthTree}
        pendingCount={pendingReminders.length}
        variant="compact"
      />

      <section className="panel form-panel settings-panel-highlight">
        <div className="section-header">
          <div>
            <h3>提醒设置</h3>
            <p>统一配置饭前与饭后提醒时点，多个时间可用中文或英文逗号分隔。</p>
          </div>
        </div>
        <label>
          饭前提醒时间
          <input value={preMeal} onChange={(event) => setPreMeal(event.target.value)} />
        </label>
        <label>
          饭后提醒时间
          <input value={postMeal} onChange={(event) => setPostMeal(event.target.value)} />
        </label>
        <div className="detail-grid">
          <div>
            <span>输入示例</span>
            <strong>07:30,11:30,17:30</strong>
          </div>
          <div>
            <span>当前用途</span>
            <strong>用于后续提醒时间生成</strong>
          </div>
        </div>
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
          保存提醒设置
        </button>
      </section>

      <section className="panel settings-panel-highlight">
        <div className="section-header">
          <div>
            <h3>健康档案</h3>
            <p>用于问诊、购药与续方过程中的信息参考。</p>
          </div>
        </div>
        <div className="card-list compact">
          {summary.slice(0, 4).map((item) => (
            <article key={item.label} className="list-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="panel settings-panel-highlight">
        <div className="section-header">
          <div>
            <h3>家属协同</h3>
            <p>用于关键提醒通知与长期用药支持。</p>
          </div>
        </div>
        <div className="card-list compact">
          <article className="list-card">
            <span>家属联系方式</span>
            <strong>{state.profile.familyPhone}</strong>
          </article>
          <article className="list-card">
            <span>血糖趋势</span>
            <strong>{state.profile.healthMetrics.bloodSugar.join(' → ')}</strong>
          </article>
        </div>
      </section>
    </div>
  )
}
