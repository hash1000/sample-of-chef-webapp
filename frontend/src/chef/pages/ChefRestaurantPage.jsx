import { useEffect, useState } from 'react'
import ChefLayout from '../components/ChefLayout'
import DataState from '../../admin/components/DataState'
import { imageForRestaurant } from '../../assets/foodImages'
import {
  fetchChefRestaurant,
  toErrorMessage,
  updateChefRestaurant,
  uploadChefRestaurantBanner,
} from '../api/chefApi'
import '../../pages/ui.css'

const CITIES = [
  { value: 'islamabad', label: 'Islamabad' },
  { value: 'karachi', label: 'Karachi' },
  { value: 'lahore', label: 'Lahore' },
]

function statusClass(status) {
  if (status === 'approved') return 'badge ok'
  if (status === 'pending') return 'badge warn'
  if (status === 'blocked' || status === 'rejected') return 'badge bad'
  return 'badge'
}

export default function ChefRestaurantPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [restaurant, setRestaurant] = useState(null)
  const [form, setForm] = useState({
    name: '',
    city: 'lahore',
    menuType: '',
    description: '',
  })

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchChefRestaurant()
        if (!alive) return
        setRestaurant(data)
        setForm({
          name: data?.name || '',
          city: data?.city || 'lahore',
          menuType: data?.menuType || '',
          description: data?.description || '',
        })
      } catch (e) {
        if (!alive) return
        setError(toErrorMessage(e))
      } finally {
        if (!alive) return
        setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const updated = await updateChefRestaurant(form)
      setRestaurant(updated)
      setMessage('Restaurant profile saved.')
    } catch (e) {
      setError(toErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  async function onBannerChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const updated = await uploadChefRestaurantBanner(file)
      setRestaurant(updated)
      setMessage('Banner image uploaded.')
    } catch (e) {
      setError(toErrorMessage(e))
    } finally {
      setSaving(false)
      event.target.value = ''
    }
  }

  return (
    <ChefLayout title="Restaurant" subtitle="Restaurant profile and approval status">
      <DataState loading={loading} error={error} empty={!loading && !error && !restaurant}>
        {restaurant ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <div className="grid4">
              <div className="statCard">
                <div className="statLabel">Status</div>
                <div style={{ marginTop: 8 }}>
                  <span className={statusClass(restaurant.status)}>{restaurant.status}</span>
                </div>
              </div>
              <div className="statCard">
                <div className="statLabel">Rating</div>
                <div className="statValue">{restaurant.rating ?? 0}</div>
              </div>
              <div className="statCard">
                <div className="statLabel">Active</div>
                <div className="statValue">{restaurant.isActive ? 'Yes' : 'No'}</div>
              </div>
              <div className="statCard">
                <div className="statLabel">City</div>
                <div className="statValue" style={{ fontSize: 18 }}>
                  {CITIES.find((city) => city.value === restaurant.city)?.label || restaurant.city}
                </div>
              </div>
            </div>

            {restaurant.status !== 'approved' ? (
              <div className="statCard">
                <strong>{restaurant.name}</strong>
                <p className="muted" style={{ marginTop: 8 }}>
                  Menu and order tools unlock after admin approval. You can still update your
                  restaurant profile here.
                </p>
              </div>
            ) : null}

            <div className="statCard">
              <strong>Banner image</strong>
              <div
                style={{
                  marginTop: 12,
                  overflow: 'hidden',
                  borderRadius: 14,
                  border: '1px solid var(--border)',
                  background: 'var(--code-bg)',
                }}
              >
                <img
                  src={imageForRestaurant(restaurant)}
                  alt=""
                  style={{ display: 'block', width: '100%', maxHeight: 280, objectFit: 'cover' }}
                />
              </div>
              <div className="field">
                <label htmlFor="restaurantBanner">Upload banner image</label>
                <input
                  id="restaurantBanner"
                  className="input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={onBannerChange}
                  disabled={saving || restaurant.status === 'blocked'}
                />
              </div>
              <p className="muted" style={{ marginTop: 8, fontSize: 13 }}>
                Images are saved locally in backend/uploads/restaurants and served from /uploads.
              </p>
            </div>

            <form className="statCard" onSubmit={onSubmit}>
              <strong>Profile</strong>
              <div className="grid2" style={{ marginTop: 12 }}>
                <div className="field" style={{ marginTop: 0 }}>
                  <label>Name</label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    required
                  />
                </div>
                <div className="field" style={{ marginTop: 0 }}>
                  <label>City</label>
                  <select
                    className="input"
                    value={form.city}
                    onChange={(event) => updateField('city', event.target.value)}
                  >
                    {CITIES.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Menu type</label>
                <input
                  className="input"
                  value={form.menuType}
                  onChange={(event) => updateField('menuType', event.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Description</label>
                <input
                  className="input"
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                />
              </div>
              {message ? <div className="badge ok">{message}</div> : null}
              <div className="row">
                <button className="btn" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save profile'}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </DataState>
    </ChefLayout>
  )
}
