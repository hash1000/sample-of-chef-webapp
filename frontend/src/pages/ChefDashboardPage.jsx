import AuthedLayout from './AuthedLayout'

export default function ChefDashboardPage() {
  return (
    <AuthedLayout title="Chef Dashboard">
      <div className="card">
        <h1 className="title">Chef Dashboard</h1>
        <p className="muted">You are authorized as a chef.</p>
      </div>
    </AuthedLayout>
  )
}

