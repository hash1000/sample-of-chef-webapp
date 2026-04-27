import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { registerRestaurant } from '../auth/authService'
import { roleHomePath } from '../auth/roles'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../services/api'
import './ui.css'

const CITIES = [
  { value: 'islamabad', label: 'Islamabad' },
  { value: 'karachi', label: 'Karachi' },
  { value: 'lahore', label: 'Lahore' },
]

export default function RegisterRestaurantPage() {
  const { isBootstrapping, isAuthenticated, role, loginSuccess } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    restaurantName: '',
    city: 'lahore',
    menuType: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isBootstrapping && isAuthenticated) {
    return <Navigate to={roleHomePath(role)} replace />
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const data = await registerRestaurant(form)
      if (!data?.token || !data?.user) throw new Error('Invalid server response')
      loginSuccess({ token: data.token, user: data.user })
      navigate('/chef-dashboard', { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Register Restaurant</h1>
        <p className="muted">Create a chef account and submit your restaurant for admin approval.</p>

        <form onSubmit={onSubmit}>
          <div className="grid2">
            <div className="field">
              <label htmlFor="name">Owner name</label>
              <input
                id="name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              minLength={8}
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
            />
          </div>

          <div className="grid2">
            <div className="field">
              <label htmlFor="restaurantName">Restaurant name</label>
              <input
                id="restaurantName"
                value={form.restaurantName}
                onChange={(e) => updateField('restaurantName', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <select id="city" value={form.city} onChange={(e) => updateField('city', e.target.value)}>
                {CITIES.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="menuType">Menu type</label>
            <input
              id="menuType"
              value={form.menuType}
              onChange={(e) => updateField('menuType', e.target.value)}
              placeholder="Pakistani, Seafood, Grill..."
              required
            />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          {error ? (
            <div className="error" role="alert">
              {error}
            </div>
          ) : null}

          <div className="row">
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit for approval'}
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
