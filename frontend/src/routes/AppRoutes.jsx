import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { ROLES } from '../auth/roles'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import HomePage from '../pages/HomePage'
import ChefDashboardPage from '../pages/ChefDashboardPage'
import RiderDashboardPage from '../pages/RiderDashboardPage'
import AdminDashboardPage from '../admin/pages/AdminDashboardPage'
import ChefOrdersPage from '../chef/pages/ChefOrdersPage'
import ChefOrderDetailPage from '../chef/pages/ChefOrderDetailPage'
import ChefMenuPage from '../chef/pages/ChefMenuPage'
import UsersPage from '../admin/pages/UsersPage'
import RestaurantsPage from '../admin/pages/RestaurantsPage'
import OrdersPage from '../admin/pages/OrdersPage'
import RidersPage from '../admin/pages/RidersPage'
import RolesPage from '../admin/pages/RolesPage'
import PaymentsPage from '../admin/pages/PaymentsPage'
import ReportsPage from '../admin/pages/ReportsPage'
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
        <Route path="/chef/orders" element={<ChefOrdersPage />} />
        <Route path="/chef/orders/:id" element={<ChefOrderDetailPage />} />
        <Route path="/chef/menu" element={<ChefMenuPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.rider]} />}>
        <Route path="/rider-dashboard" element={<RiderDashboardPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.admin]} />}>
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/riders" element={<RidersPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

