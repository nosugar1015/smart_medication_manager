import { Link } from 'react-router-dom'
import { useApp } from '../store/useApp'

export const HomePage = () => {
  const { state, reminderOverview, pendingReminders } = useApp()
  const highestRisk = reminderOverview.find((item) => item.warningLevel === 'red')
    ? '高风险'
    : reminderOverview.find((item) => item.warningLevel === 'orange')
      ? '中高风险'
      : reminderOverview.find((item) => item.warningLevel === 'yellow')
        ? '关注中'
        : '稳定'

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <h2>{state.profile.name}，请先处理今天最重要的事项</h2>
          <p>优先查看今日待确认用药、当前执行状态和续方风险。</p>
        </div>
        <div className="hero-actions">
          <Link className="primary-button" to="/reminders">
            进入今日执行中心
          </Link>
          <Link className="secondary-button" to="/consultation">
            发起问诊
          </Link>
        </div>
      </section>

      <section className="metric-grid">
        <div className="metric-card">
          <span>患者档案</span>
          <strong>{state.profile.age} 岁 · {state.profile.chronicDiseases.join(' / ')}</strong>
        </div>
        <div className="metric-card">
          <span>今日待确认</span>
          <strong>{pendingReminders.length} 项</strong>
        </div>
        <div className="metric-card">
          <span>已激活药品</span>
          <strong>{reminderOverview.length} 种</strong>
        </div>
        <div className="metric-card">
          <span>续方风险</span>
          <strong>{highestRisk}</strong>
        </div>
      </section>

      <section className="grid two-columns">
        <article className="panel">
          <div className="section-header">
            <div>
              <h3>今日待办</h3>
              <p>优先处理本日服药确认与续方事项。</p>
            </div>
            <Link className="text-link" to="/reminders">
              查看明细
            </Link>
          </div>
          <div className="card-list compact">
            <div className="list-card">
              <div>
                <span>服药执行</span>
                <strong>{pendingReminders.length > 0 ? `仍有 ${pendingReminders.length} 项待确认` : '今日服药已全部确认'}</strong>
              </div>
            </div>
            <div className="list-card">
              <div>
                <span>复诊续方</span>
                <strong>{highestRisk === '稳定' ? '当前库存状态平稳' : '建议尽快评估续方需求'}</strong>
              </div>
            </div>
          </div>
        </article>
        <article className="panel">
          <div className="section-header">
            <div>
              <h3>协同信息</h3>
              <p>用于提醒通知与家庭支持跟进。</p>
            </div>
            <Link className="text-link" to="/settings">
              管理档案
            </Link>
          </div>
          <div className="card-list compact">
            <div className="list-card">
              <div>
                <span>家属协同</span>
                <strong>{state.profile.familyPhone}</strong>
              </div>
            </div>
            <div className="list-card">
              <div>
                <span>近期指标</span>
                <strong>血压 {state.profile.healthMetrics.bloodPressure.at(-1)} · 血糖 {state.profile.healthMetrics.bloodSugar.at(-1)}</strong>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-header">
          <div>
            <h3>主要入口</h3>
            <p>保持问诊、用药、续方主链路连续可达。</p>
          </div>
          <Link className="text-link" to="/dashboard">
            查看用药看板
          </Link>
        </div>
        <div className="chip-row">
          <span className="chip">在线问诊</span>
          <span className="chip">用药看板</span>
          <span className="chip">执行提醒</span>
          <span className="chip chip-muted">续方管理</span>
        </div>
      </section>
    </div>
  )
}
