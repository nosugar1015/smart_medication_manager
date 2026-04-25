import { useApp } from '../store/useApp'

export const GrowthPage = () => {
  const { state } = useApp()

  return (
    <div className="page-stack">
      <section className="panel">
        <p className="eyebrow">植物成长系统</p>
        <h2>把坚持用药变成看得见的成长</h2>
        <p>按时打卡会获得养料，漏服或断药则会影响植物状态。</p>
      </section>

      <section className="growth-card">
        <div className="plant-stage">🌷</div>
        <h3>{state.growth.stage}</h3>
        <p>当前成长值 {state.growth.points}，连续坚持 {state.growth.streakDays} 天。</p>
      </section>

      <section className="metric-grid">
        <div className="metric-card">
          <span>今日建议</span>
          <strong>完成全部提醒 +10 分</strong>
        </div>
        <div className="metric-card">
          <span>延后提醒</span>
          <strong>完成后 +1 分</strong>
        </div>
        <div className="metric-card">
          <span>按时服药</span>
          <strong>每次 +3 分</strong>
        </div>
      </section>
    </div>
  )
}
