import AuthedLayout from './AuthedLayout'

export default function HomePage() {
  return (
    <AuthedLayout title="Home (user)">
      <div className="card">
        <h1 className="title">User Home</h1>
        <p className="muted">You are authorized as a user.</p>
      </div>
    </AuthedLayout>
  )
}

