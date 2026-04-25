import { Link } from 'react-router-dom'
import { useApp } from '../store/useApp'

export const ReminderPage = () => {
  const { pendingReminders, markReminderDone, snoozeReminder } = useApp()

  return (
    <div className="page-stack">
      <section className="panel">
        <p className="eyebrow">智能提醒</p>
        <h2>按时、按量、准确服药</h2>
        <p>遵循 PRD 规则，支持本次已服用与隔 10 分钟再提醒。</p>
      </section>

      {pendingReminders.length === 0 ? (
        <article className="panel empty-card">
          <p>当前没有待处理提醒，说明今日用药已全部确认。</p>
          <Link className="secondary-button" to="/growth">
            查看植物成长
          </Link>
        </article>
      ) : (
        <section className="card-list">
          {pendingReminders.map((reminder) => (
            <article key={reminder.id} className="panel reminder-card">
              <div className="section-header">
                <div>
                  <h3>{reminder.medicationName}</h3>
                  <p>{reminder.scheduledTime} 提醒 · 药品实物图核对已开启（演示）</p>
                </div>
                <span className={`status-pill ${reminder.status}`}>{reminder.status === 'snoozed' ? '已延后' : '待服用'}</span>
              </div>
              <p className="encouragement">{reminder.encouragement}</p>
              <div className="button-row">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => markReminderDone(reminder.id)}
                >
                  本次已服用
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => snoozeReminder(reminder.id)}
                >
                  隔 10 分钟再提醒
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
