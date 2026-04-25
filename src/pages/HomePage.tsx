import { Link } from 'react-router-dom'
import { useApp } from '../store/useApp'

export const HomePage = () => {
  const { state, reminderOverview, pendingReminders } = useApp()

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">欢迎回来，{state.profile.name}</p>
          <h2>今天继续把用药安排得明明白白</h2>
          <p>
            通过一个网页完成 AI 问诊、购药、提醒打卡和续方管理，帮助慢病患者减少漏服和断药。
          </p>
        </div>
        <div className="hero-actions">
          <Link className="primary-button" to="/consultation">
            开始问诊
          </Link>
          <Link className="secondary-button" to="/dashboard">
            查看用药看板
          </Link>
        </div>
      </section>

      <section className="grid two-columns">
        <article className="panel">
          <h3>准入分流</h3>
          <p>根据 PRD 支持首次咨询与复诊购药两种入口。</p>
          <div className="chip-row">
            <span className="chip">首次咨询</span>
            <span className="chip chip-muted">复诊购药</span>
          </div>
        </article>
        <article className="panel">
          <h3>今日提醒</h3>
          <p>{pendingReminders.length} 条待处理提醒，支持 10 分钟后再提醒。</p>
          <Link className="text-link" to="/reminders">
            立即查看
          </Link>
        </article>
      </section>

      <section className="panel">
        <div className="section-header">
          <div>
            <h3>当前用药摘要</h3>
            <p>购药成功后会自动激活提醒和库存预警。</p>
          </div>
          <Link className="text-link" to="/refill">
            查看续方风险
          </Link>
        </div>
        <div className="metric-grid">
          <div className="metric-card">
            <span>慢病档案</span>
            <strong>{state.profile.chronicDiseases.join(' / ')}</strong>
          </div>
          <div className="metric-card">
            <span>已激活药品</span>
            <strong>{reminderOverview.length} 种</strong>
          </div>
          <div className="metric-card">
            <span>家人协同</span>
            <strong>{state.profile.familyPhone}</strong>
          </div>
        </div>
      </section>
    </div>
  )
}
