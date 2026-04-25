import { Link } from 'react-router-dom'
import './ui.css'

export default function UnauthorizedPage() {
  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Unauthorized</h1>
        <p className="muted">You don’t have permission to access that page.</p>
        <div className="row">
          <Link className="link" to="/login">
            Go to login
          </Link>
        </div>
      </div>
    </div>
  )
}

