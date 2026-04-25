import AuthedLayout from './AuthedLayout'

export default function RiderDashboardPage() {
  return (
    <AuthedLayout title="Rider Dashboard">
      <div className="card">
        <h1 className="title">Rider Dashboard</h1>
        <p className="muted">You are authorized as a rider.</p>
      </div>
    </AuthedLayout>
  )
}

