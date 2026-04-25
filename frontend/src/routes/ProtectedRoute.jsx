import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { roleHomePath } from '../auth/roles'

export default function ProtectedRoute({ allowedRoles }) {
  const { isBootstrapping, isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (isBootstrapping) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div aria-busy="true" aria-live="polite">
          Loading…
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(role)) {
      return <Navigate to={roleHomePath(role)} replace />
    }
  }

  return <Outlet />
}

