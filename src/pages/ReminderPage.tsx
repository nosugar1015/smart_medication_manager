import { Link } from 'react-router-dom'
import { useApp } from '../store/useApp'

export const ReminderPage = () => {
  const { state, hasActiveMedicationPlan, pendingReminders, markReminderDone, snoozeReminder, growthTree } = useApp()
  const nextReminder = pendingReminders[0]

  if (!hasActiveMedicationPlan) {
    return (
      <div className="page-stack page-stack-accent page-stack-reminder">
        <section className="hero-card">
          <div className="hero-copy">
            <span className="warning-badge orange">请先问诊</span>
            <h2>当前暂无正在管理的用药</h2>
            <p>请先完成问诊、确认方案并购药，之后系统才会开始提醒您按时服药。</p>
          </div>
          <Link className="primary-button" to="/consultation">
            去问诊生成方案
          </Link>
        </section>

        <section className="metric-grid">
          <div className="metric-card metric-card-mode">
            <span>当前状态</span>
            <strong>尚未开始用药管理</strong>
          </div>
          <div className="metric-card metric-card-action">
            <span>下一步</span>
            <strong>先完成问诊与方案确认</strong>
          </div>
        </section>

        <article className="panel empty-card">
          <p>完成问诊后，系统会生成方案、激活提醒，并在这里显示今天需要处理的用药事项。</p>
        </article>
      </div>
    )
  }

  return (
    <div className="page-stack page-stack-accent page-stack-reminder">
      <section className="hero-card reminder-hero-card">
        <div className="hero-copy">
          <span className={`status-pill ${nextReminder?.status ?? 'pending'}`}>
            {nextReminder ? (nextReminder.status === 'snoozed' ? '已延后，稍后提醒' : '今日有待确认') : '今日已完成'}
          </span>
          <h2>{nextReminder ? `下一次提醒：${nextReminder.scheduledTime}` : '今日提醒已全部完成'}</h2>
          <p>
            {nextReminder
              ? `${nextReminder.medicationName}需要您确认是否已服用。请核对药名、剂量和服用时机后再操作。完成今日确认，有助于树继续成长。`
              : '今天的计划内用药都已确认完成，您可以查看看板或种树成长反馈。'}
          </p>
          <div className="reminder-hero-tags">
            <span className="chip consultation-tag-chip">优先看下一次提醒</span>
            <span className="chip consultation-tag-chip">确认后继续成长</span>
          </div>
        </div>
        {nextReminder ? (
          <button type="button" className="primary-button" onClick={() => markReminderDone(nextReminder.id)}>
            确认已服用
          </button>
        ) : (
          <Link className="primary-button" to="/dashboard">
            查看用药看板
          </Link>
        )}
      </section>

      <section className="metric-grid">
        <div className="metric-card metric-card-risk">
          <span>今日待确认</span>
          <strong>{pendingReminders.length} 项</strong>
        </div>
        <div className="metric-card metric-card-mode">
          <span>当前方案</span>
          <strong>{state.plan?.diseaseType}</strong>
        </div>
        <div className="metric-card metric-card-action">
          <span>树成长状态</span>
          <strong>{growthTree.stageName}</strong>
          <p>连续记录 {state.growth.streakDays} 天</p>
        </div>
      </section>

      {pendingReminders.length === 0 ? (
        <article className="panel empty-card">
          <p>今日计划内用药已全部确认。</p>
          <div className="button-row">
            <Link className="secondary-button" to="/settings">
              查看我的成长
            </Link>
            <Link className="secondary-button" to="/dashboard">
              查看用药看板
            </Link>
          </div>
        </article>
      ) : (
        <section className="card-list">
          {pendingReminders.map((reminder) => (
            <article key={reminder.id} className="panel reminder-card">
              <div className="section-header">
                <div>
                  <h3>{reminder.medicationName}</h3>
                  <p>{reminder.scheduledTime} 用药时点</p>
                </div>
                <span className={`status-pill ${reminder.status}`}>{reminder.status === 'snoozed' ? '已延后' : '待确认'}</span>
              </div>
              <div className="detail-grid reminder-meta">
                <div>
                  <span>执行状态</span>
                  <strong>{reminder.status === 'snoozed' ? '等待再次提醒' : '请现在确认'}</strong>
                </div>
                <div>
                  <span>提醒说明</span>
                  <strong>{reminder.status === 'snoozed' ? '延后后也会记录成长，但速度较慢' : '确认已服用会让树成长更快'}</strong>
                </div>
              </div>
              <p className="encouragement">{reminder.encouragement}</p>
              <div className="button-row">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => markReminderDone(reminder.id)}
                >
                  确认已服用
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => snoozeReminder(reminder.id)}
                >
                  延后 10 分钟
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
