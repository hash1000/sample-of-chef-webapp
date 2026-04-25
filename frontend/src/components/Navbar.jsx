import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinkClass = ({ isActive }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100',
  ].join(' ')

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function onLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/home" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
            AF
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">
              AmricanFood
            </div>
            <div className="text-xs text-slate-500">Delivery</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/home" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/restaurants" className={navLinkClass}>
            Restaurants
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            Cart
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium text-slate-900">
              {user?.name || 'Customer'}
            </div>
            <div className="text-xs text-slate-500">{user?.email}</div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

