import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../pages/ui.css'

const nav = [
  { to: '/home', label: 'Public Home' },
  { to: '/chef-dashboard', label: 'Dashboard' },
  { to: '/chef/restaurant', label: 'Restaurant' },
  { to: '/chef/orders', label: 'Orders' },
  { to: '/chef/menu', label: 'Menu' },
]

export default function ChefLayout({ title, subtitle, right, children }) {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  function onLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="adminShell">
      <aside className="adminSidebar">
        <div className="adminBrand">
          <div className="adminBrandTitle">AmericanDemoFood</div>
          <div className="adminBrandSubtitle">Chef Dashboard</div>
        </div>

        <nav className="adminNav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              <span>{item.label}</span>
            </NavLink>
          ))}

          <button type="button" onClick={onLogout}>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className="adminMain">
        <div className="adminTopbar">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <strong>{title}</strong>
            <span className="pill">{role || 'unknown role'}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className="muted" style={{ fontSize: 14 }}>
              {user?.email || user?.name || 'Signed in'}
            </span>
            {right}
          </div>
        </div>

        <div className="adminContent">
          <h1 className="adminPageTitle">{title}</h1>
          {subtitle ? <p className="adminPageSubtitle">{subtitle}</p> : null}
          {children}
        </div>
      </main>
    </div>
  )
}

