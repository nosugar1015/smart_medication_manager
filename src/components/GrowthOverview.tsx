import type { GrowthTreeState, GrowthState } from '../types'

type GrowthOverviewProps = {
  growth: GrowthState
  growthTree: GrowthTreeState
  pendingCount: number
  variant?: 'compact' | 'detail'
}

const growthStages = ['种子期', '发芽期', '幼苗期', '小树期']

export const GrowthOverview = ({ growth, growthTree, pendingCount, variant = 'detail' }: GrowthOverviewProps) => {
  const isCompact = variant === 'compact'

  return (
    <section className={`panel growth-overview growth-overview-${variant}`}>
      <div className="growth-overview-shell">
        <div className="growth-visual-card">
          <div className="growth-visual-header">
            <span className="chip consultation-tag-chip">我的成长</span>
            <span className="warning-badge none">{growthTree.stageName}</span>
          </div>
          <div className={`growth-plant growth-plant-${growthTree.treeSymbol}`} aria-hidden="true">
            <div className="growth-plant-sky">
              <span className="growth-plant-sun" />
              <span className="growth-plant-glow growth-plant-glow-left" />
              <span className="growth-plant-glow growth-plant-glow-right" />
            </div>
            <div className="growth-plant-stage-area">
              <div className="growth-plant-canopy" />
              <div className="growth-plant-leaf growth-plant-leaf-left" />
              <div className="growth-plant-leaf growth-plant-leaf-right" />
              <div className="growth-plant-sprout growth-plant-sprout-left" />
              <div className="growth-plant-sprout growth-plant-sprout-right" />
              <div className="growth-plant-stem" />
              <div className="growth-plant-trunk" />
              <div className="growth-plant-seed" />
            </div>
            <div className="growth-pot">
              <div className="growth-pot-soil" />
              <div className="growth-pot-body" />
            </div>
          </div>
          <div className="growth-stage-copy">
            <h3>{growth.stage}</h3>
            <p>{growthTree.stageDescription}</p>
          </div>
        </div>

        <div className="growth-overview-main">
          <div className="section-header growth-overview-header">
            <div>
              <h3>{isCompact ? '今天的养成状态' : '成长进度'}</h3>
              <p>{growthTree.encouragement}</p>
            </div>
            <span className="chip chip-muted">
              {growthTree.nextStageName ? `下一阶段：${growthTree.nextStageName}` : '当前已进入最高阶段'}
            </span>
          </div>

          <div className="detail-grid growth-summary-grid">
            <div>
              <span>当前成长值</span>
              <strong>{growth.points} 分</strong>
            </div>
            <div>
              <span>连续记录</span>
              <strong>{growth.streakDays} 天</strong>
            </div>
            <div>
              <span>距离下一阶段</span>
              <strong>{growthTree.nextStagePoints ? `还差 ${growthTree.remainingPoints} 分` : '已达当前最高阶段'}</strong>
            </div>
            <div>
              <span>今天还要处理</span>
              <strong>{pendingCount > 0 ? `${pendingCount} 项待确认` : '今天已全部确认'}</strong>
            </div>
          </div>

          <div className="growth-progress-block">
            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${growthTree.progressPercent}%` }} />
            </div>
            <div className="growth-stage-timeline" aria-label="成长阶段">
              {growthStages.map((stage) => {
                const stateClass =
                  stage === growthTree.stageName ? 'current' : growthStages.indexOf(stage) < growthStages.indexOf(growthTree.stageName) ? 'passed' : ''

                return (
                  <div key={stage} className={`growth-stage-node ${stateClass}`.trim()}>
                    <span className="growth-stage-dot" />
                    <strong>{stage}</strong>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="metric-grid growth-tip-grid">
            <div className="metric-card metric-card-action">
              <span>今日建议</span>
              <strong>{growthTree.todayTip}</strong>
            </div>
            <div className="metric-card metric-card-mode">
              <span>当前进度</span>
              <strong>{growthTree.progressPercent}%</strong>
              <p>{growthTree.treeSymbol}正在继续成长</p>
            </div>
          </div>

          {!isCompact && (
            <div className="growth-rule-panel">
              <div className="section-header">
                <div>
                  <h3>成长规则</h3>
                  <p>说明保留在这里，主视觉先看植物成长状态。</p>
                </div>
              </div>
              <div className="card-list growth-rule-list">
                {growthTree.ruleSummary.map((item) => (
                  <article key={item} className="list-card growth-rule-card">
                    <strong>{item}</strong>
                  </article>
                ))}
                <article className="list-card growth-rule-card">
                  <strong>连续记录 {growth.streakDays} 天，说明您一直在坚持照护。</strong>
                </article>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
