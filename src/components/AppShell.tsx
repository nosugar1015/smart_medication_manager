import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: '今日用药' },
  { to: '/dashboard', label: '用药看板' },
  { to: '/consultation', label: '问诊' },
  { to: '/refill', label: '续方' },
  { to: '/settings', label: '设置' },
]

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>慢病用药小管家</h1>
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
