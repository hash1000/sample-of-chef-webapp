import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinkClass = ({ isActive }) =>
  [
    'relative rounded-lg px-3 py-2 text-sm font-medium transition duration-200',
    isActive
      ? 'text-brand-textPrimary after:absolute after:inset-x-3 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-brand-primary'
      : 'text-brand-textSecondary hover:text-brand-textPrimary',
  ].join(' ')

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function onLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/home" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-primary text-sm font-bold text-white shadow-sm">
            AF
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-brand-textPrimary">
              AmricanFood
            </div>
            <div className="text-xs text-brand-textSecondary">Delivery</div>
          </div>
        </Link>

        <nav className="order-3 flex w-full items-center justify-center gap-1 border-t border-slate-100 pt-3 md:order-none md:w-auto md:border-0 md:pt-0">
          <NavLink to="/home" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            Cart
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium text-brand-textPrimary">
              {user?.name || 'Customer'}
            </div>
            <div className="text-xs text-brand-textSecondary">{user?.email}</div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="btnSecondary px-3 py-2 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

