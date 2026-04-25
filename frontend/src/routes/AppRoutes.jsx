import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { ROLES } from '../auth/roles'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import HomePage from '../pages/HomePage'
import ChefDashboardPage from '../pages/ChefDashboardPage'
import RiderDashboardPage from '../pages/RiderDashboardPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import UnauthorizedPage from '../pages/UnauthorizedPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute allowedRoles={[ROLES.user]} />}>
        <Route path="/home" element={<HomePage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.chef]} />}>
        <Route path="/chef-dashboard" element={<ChefDashboardPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.rider]} />}>
        <Route path="/rider-dashboard" element={<RiderDashboardPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.admin]} />}>
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

