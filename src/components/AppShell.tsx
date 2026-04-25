import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: '首页' },
  { to: '/dashboard', label: '用药看板' },
  { to: '/reminders', label: '提醒' },
  { to: '/refill', label: '续方' },
  { to: '/settings', label: '设置' },
]

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">慢病用药小管家</p>
          <h1>问诊、购药、用药、续方一站式管理</h1>
        </div>
        <div className="topbar-card">
          <span>本地演示版</span>
          <strong>适合手机浏览</strong>
        </div>
      </header>

      <main className="page-container">{children}</main>

      <nav className="bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
