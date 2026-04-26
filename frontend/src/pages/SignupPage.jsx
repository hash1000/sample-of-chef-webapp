import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { signup } from '../auth/authService'
import { ROLES, roleHomePath } from '../auth/roles'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../services/api'
import './ui.css'

export default function SignupPage() {
  const { isBootstrapping, isAuthenticated, role, loginSuccess } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState(ROLES.user)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isBootstrapping && isAuthenticated) {
    return <Navigate to={roleHomePath(role)} replace />
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const data = await signup({
        name,
        email,
        password,
        role: selectedRole,
      })
      if (!data?.token || !data?.user) {
        throw new Error('Invalid server response')
      }
      loginSuccess({ token: data.token, user: data.user })
      navigate(roleHomePath(data.user.role), { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Create account</h1>
        <p className="muted">Sign up with a role.</p>

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="!border-gray-500"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              minLength={6}
              className="!border-gray-500"
            />
          </div>

          <div className="field">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={isSubmitting}
            >
              <option value={ROLES.user}>user</option>
              <option value={ROLES.chef}>chef</option>
            </select>
          </div>

          {error ? (
            <div className="error" role="alert">
              {error}
            </div>
          ) : null}

          <div className="row">
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Sign up'}
            </button>
            <Link className="link" to="/login">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

