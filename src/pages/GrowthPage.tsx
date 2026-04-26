import { GrowthOverview } from '../components/GrowthOverview'
import { useApp } from '../store/useApp'

export const GrowthPage = () => {
  const { state, growthTree, pendingReminders } = useApp()

  return (
    <div className="page-stack page-stack-accent">
      <GrowthOverview
        growth={state.growth}
        growthTree={growthTree}
        pendingCount={pendingReminders.length}
        variant="detail"
      />
    </div>
  )
}
