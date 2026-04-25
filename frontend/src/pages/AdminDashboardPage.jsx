import AuthedLayout from './AuthedLayout'

export default function AdminDashboardPage() {
  return (
    <AuthedLayout title="Admin Dashboard">
      <div className="card">
        <h1 className="title">Admin Dashboard</h1>
        <p className="muted">You are authorized as an admin.</p>
      </div>
    </AuthedLayout>
  )
}

