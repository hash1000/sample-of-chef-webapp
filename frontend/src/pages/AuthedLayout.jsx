import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { roleHomePath } from '../auth/roles'
import './ui.css'

export default function AuthedLayout({ children, title }) {
  const { user, role, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function onLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div>
      <div className="topbar">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <strong>{title}</strong>
          <span className="pill">{role || 'guest'}</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="muted" style={{ fontSize: 14 }}>
            {user?.email || user?.name || 'Guest customer'}
          </span>
          <button className="btn" type="button" onClick={() => navigate('/home')}>
            Home
          </button>
          <button className="btn" type="button" onClick={() => navigate('/cart')}>
            Cart
          </button>
          {isAuthenticated ? (
            <>
              <button className="btn" type="button" onClick={() => navigate(roleHomePath(role))}>
                Dashboard
              </button>
              <button className="btn" type="button" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn" to="/login">
                Login
              </Link>
              <Link className="btn" to="/register-restaurant">
                Register Restaurant
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="container">{children}</div>
    </div>
  )
}

