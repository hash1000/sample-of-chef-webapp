import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import DataState from '../components/DataState'
import {
  approveAdminRestaurant,
  blockAdminRestaurant,
  createAdminRestaurant,
  fetchAdminRestaurants,
  rejectAdminRestaurant,
  toErrorMessage,
  unblockAdminRestaurant,
  updateAdminRestaurant,
} from '../api/adminApi'
import '../../pages/ui.css'

const CITIES = [
  { value: 'islamabad', label: 'Islamabad' },
  { value: 'karachi', label: 'Karachi' },
  { value: 'lahore', label: 'Lahore' },
]

const STATUSES = ['pending', 'approved', 'rejected', 'blocked']

const emptyForm = {
  id: '',
  name: '',
  city: 'lahore',
  status: 'approved',
  menuType: '',
  description: '',
  rating: 0,
  chefId: '',
}

function cityLabel(value) {
  return CITIES.find((city) => city.value === value)?.label || value || '—'
}

function statusClass(status) {
  if (status === 'approved') return 'badge ok'
  if (status === 'pending') return 'badge warn'
  if (status === 'blocked' || status === 'rejected') return 'badge bad'
  return 'badge'
}

export default function RestaurantsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  async function loadRestaurants() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAdminRestaurants()
      setRows(Array.isArray(data) ? data : data?.items || [])
    } catch (e) {
      setError(toErrorMessage(e) || 'Unable to load restaurants.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchAdminRestaurants()
        if (!alive) return
        setRows(Array.isArray(data) ? data : data?.items || [])
      } catch (e) {
        if (!alive) return
        setError(toErrorMessage(e) || 'Unable to load restaurants.')
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

  function openCreate() {
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(row) {
    setForm({
      id: row.id,
      name: row.name || '',
      city: row.city || 'lahore',
      status: row.status || 'approved',
      menuType: row.menuType || '',
      description: row.description || '',
      rating: row.rating ?? 0,
      chefId: row.chefId || '',
    })
    setShowForm(true)
  }

  async function submitForm(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      name: form.name,
      city: form.city,
      status: form.status,
      menuType: form.menuType,
      description: form.description,
      rating: Number(form.rating) || 0,
      chefId: form.chefId || null,
    }

    try {
      const saved = form.id
        ? await updateAdminRestaurant(form.id, payload)
        : await createAdminRestaurant(payload)
      setRows((current) => {
        if (!form.id) return [saved, ...current]
        return current.map((row) => (row.id === saved.id ? saved : row))
      })
      setShowForm(false)
    } catch (e) {
      setError(toErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  async function runAction(row, action) {
    setSaving(true)
    setError('')
    try {
      const updated = await action(row.id)
      setRows((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch (e) {
      setError(toErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Restaurants" subtitle="Approve registrations and manage restaurant visibility">
      <div className="toolbar">
        <div className="toolbarLeft">
          <span className="badge">{rows.length} restaurants</span>
          <span className="badge warn">{rows.filter((row) => row.status === 'pending').length} pending</span>
        </div>
        <div className="toolbarRight">
          <button className="btnSecondary" type="button" onClick={loadRestaurants}>
            Refresh
          </button>
          <button className="btn" type="button" onClick={openCreate}>
            Add Restaurant
          </button>
        </div>
      </div>

      {showForm ? (
        <form className="statCard" style={{ marginBottom: 12 }} onSubmit={submitForm}>
          <strong>{form.id ? 'Edit restaurant' : 'Add restaurant'}</strong>
          <div className="grid2" style={{ marginTop: 12 }}>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Name</label>
              <input className="input" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>City</label>
              <select className="input" value={form.city} onChange={(e) => updateField('city', e.target.value)}>
                {CITIES.map((city) => (
                  <option key={city.value} value={city.value}>{city.label}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Status</label>
              <select className="input" value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Rating</label>
              <input className="input" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => updateField('rating', e.target.value)} />
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Menu type</label>
              <input className="input" value={form.menuType} onChange={(e) => updateField('menuType', e.target.value)} />
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Chef ID</label>
              <input className="input" value={form.chefId} onChange={(e) => updateField('chefId', e.target.value)} placeholder="Optional" />
            </div>
          </div>
          <div className="field">
            <label>Description</label>
            <input className="input" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
          </div>
          <div className="row">
            <button className="btnSecondary" type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      ) : null}

      <DataState loading={loading} error={error} empty={!loading && !error && rows.length === 0}>
        <div className="tableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Chef</th>
                <th style={{ width: 360 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id || r.name}>
                  <td>
                    <strong>{r.name || '—'}</strong>
                    <div className="muted" style={{ fontSize: 12 }}>{r.menuType || r.description || '—'}</div>
                  </td>
                  <td>{cityLabel(r.city)}</td>
                  <td><span className={statusClass(r.status)}>{r.status || '—'}</span></td>
                  <td>{r.rating ?? '—'}</td>
                  <td>{r.chef?.email || r.chefName || 'Unassigned'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button className="btnSecondary" type="button" onClick={() => openEdit(r)}>
                        Edit
                      </button>
                      <button className="btnSecondary" type="button" disabled={saving || r.status === 'approved'} onClick={() => runAction(r, approveAdminRestaurant)}>
                        Approve
                      </button>
                      <button className="btnSecondary" type="button" disabled={saving || r.status === 'rejected'} onClick={() => runAction(r, rejectAdminRestaurant)}>
                        Reject
                      </button>
                      {r.status === 'blocked' ? (
                        <button className="btnSecondary" type="button" disabled={saving} onClick={() => runAction(r, unblockAdminRestaurant)}>
                          Unblock
                        </button>
                      ) : (
                        <button className="btnDanger" type="button" disabled={saving} onClick={() => runAction(r, blockAdminRestaurant)}>
                          Block
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataState>
    </AdminLayout>
  )
}
