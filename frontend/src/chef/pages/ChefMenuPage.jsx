import { useEffect, useMemo, useState } from 'react'
import ChefLayout from '../components/ChefLayout'
import DataState from '../../admin/components/DataState'
import { imageForMenuItem } from '../../assets/foodImages'
import {
  createChefMenuItem,
  deleteChefMenuItem,
  fetchChefMenu,
  fetchChefRestaurant,
  toErrorMessage,
  toggleChefMenuAvailability,
  updateChefMenuItem,
  uploadChefMenuItemImage,
} from '../api/chefApi'
import '../../pages/ui.css'

function centsToDollars(cents) {
  if (typeof cents !== 'number') return '—'
  return `$${(cents / 100).toFixed(2)}`
}

const emptyForm = {
  id: '',
  name: '',
  priceCents: '',
  category: '',
  description: '',
  isAvailable: true,
  imageFile: null,
}

export default function ChefMenuPage() {
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  async function loadMenu() {
    setLoading(true)
    setError('')
    try {
      const mine = await fetchChefRestaurant()
      setRestaurant(mine)
      if (mine?.status !== 'approved' || mine?.isActive === false) {
        setItems([])
        return
      }

      const data = await fetchChefMenu()
      setItems(Array.isArray(data) ? data : data?.items || [])
    } catch (e) {
      setError(toErrorMessage(e) || 'Unable to load menu.')
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
        const mine = await fetchChefRestaurant()
        if (!alive) return
        setRestaurant(mine)
        if (mine?.status !== 'approved' || mine?.isActive === false) {
          setItems([])
          return
        }
        const data = await fetchChefMenu()
        if (!alive) return
        setItems(Array.isArray(data) ? data : data?.items || [])
      } catch (e) {
        if (!alive) return
        setError(toErrorMessage(e) || 'Unable to load menu.')
      } finally {
        if (!alive) return
        setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter((it) => {
      const hay = `${it?.name || ''} ${it?.category || ''}`.toLowerCase()
      return hay.includes(s)
    })
  }, [items, q])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function onOpenAdd() {
    setForm(emptyForm)
    setShowForm(true)
  }

  function onOpenEdit(item) {
    setForm({
      id: item.id,
      name: item.name || '',
      priceCents: String(item.priceCents ?? ''),
      category: item.category || '',
      description: item.description || '',
      isAvailable: item.isAvailable !== false,
      imageFile: null,
    })
    setShowForm(true)
  }

  async function onSave(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      name: form.name.trim(),
      priceCents: Number(form.priceCents) || 0,
      category: form.category.trim(),
      description: form.description.trim(),
    }

    try {
      let saved
      if (form.id) {
        saved = await updateChefMenuItem(form.id, {
          ...payload,
          isAvailable: form.isAvailable,
        })
      } else {
        saved = await createChefMenuItem(payload)
        if (!form.isAvailable) {
          saved = await toggleChefMenuAvailability(saved.id, false)
        }
      }
      if (form.imageFile) {
        saved = await uploadChefMenuItemImage(saved.id, form.imageFile)
      }
      setItems((current) => {
        const exists = current.some((item) => item.id === saved.id)
        if (exists) return current.map((item) => (item.id === saved.id ? saved : item))
        return [saved, ...current]
      })
      setShowForm(false)
      setForm(emptyForm)
    } catch (e) {
      setError(toErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  async function onToggle(item) {
    setSaving(true)
    setError('')
    try {
      const updated = await toggleChefMenuAvailability(item.id, item.isAvailable === false)
      setItems((current) => current.map((row) => (row.id === updated.id ? updated : row)))
    } catch (e) {
      setError(toErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(item) {
    if (!window.confirm(`Delete ${item.name}?`)) return
    setSaving(true)
    setError('')
    try {
      await deleteChefMenuItem(item.id)
      setItems((current) => current.filter((row) => row.id !== item.id))
    } catch (e) {
      setError(toErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  const locked = restaurant && (restaurant.status !== 'approved' || restaurant.isActive === false)

  return (
    <ChefLayout title="Menu" subtitle="Manage menu items and availability">
      {locked ? (
        <div className="statCard" style={{ marginBottom: 12 }}>
          <strong>{restaurant.name}</strong>
          <p className="muted" style={{ marginTop: 8 }}>
            Your restaurant is {restaurant.status}. Admin approval is required before menu items can
            be managed.
          </p>
        </div>
      ) : null}

      <div className="toolbar">
        <div className="toolbarLeft">
          <input
            className="input"
            placeholder="Search name/category..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="badge">{filtered.length} items</span>
        </div>
        <div className="toolbarRight">
          <button className="btnSecondary" type="button" onClick={loadMenu}>
            Refresh
          </button>
          <button className="btn" type="button" onClick={onOpenAdd} disabled={Boolean(locked)}>
            Add item
          </button>
        </div>
      </div>

      {showForm ? (
        <form className="statCard" style={{ marginBottom: 12 }} onSubmit={onSave}>
          <strong>{form.id ? 'Edit food item' : 'Add food item'}</strong>
          <div className="grid2" style={{ marginTop: 12 }}>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Price (cents)</label>
              <input
                className="input"
                type="number"
                min="0"
                value={form.priceCents}
                onChange={(e) => updateField('priceCents', e.target.value)}
                required
              />
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Category</label>
              <input
                className="input"
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                required
              />
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Availability</label>
              <select
                className="input"
                value={form.isAvailable ? 'yes' : 'no'}
                onChange={(e) => updateField('isAvailable', e.target.value === 'yes')}
              >
                <option value="yes">Available</option>
                <option value="no">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Description</label>
            <input
              className="input"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Menu item image</label>
            <input
              className="input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(e) => updateField('imageFile', e.target.files?.[0] || null)}
            />
          </div>

          <div className="row">
            <button className="btnSecondary" type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save item'}
            </button>
          </div>
        </form>
      ) : null}

      <DataState loading={loading} error={error} empty={!loading && !error && filtered.length === 0}>
        <div className="tableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Availability</th>
                <th style={{ width: 260 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it) => (
                <tr key={it.id || it.name}>
                  <td>
                    <img
                      src={imageForMenuItem(it)}
                      alt=""
                      style={{
                        width: 72,
                        height: 54,
                        objectFit: 'cover',
                        borderRadius: 10,
                        border: '1px solid var(--border)',
                      }}
                    />
                  </td>
                  <td>
                    <strong>{it.name || '—'}</strong>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {it.description || '—'}
                    </div>
                  </td>
                  <td>{it.category || '—'}</td>
                  <td>{centsToDollars(it.priceCents ?? it.price ?? it.unitPrice)}</td>
                  <td>
                    <span className={it.isAvailable === false ? 'badge bad' : 'badge ok'}>
                      {it.isAvailable === false ? 'unavailable' : 'available'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button className="btnSecondary" type="button" onClick={() => onOpenEdit(it)}>
                        Edit
                      </button>
                      <button className="btnSecondary" type="button" disabled={saving} onClick={() => onToggle(it)}>
                        {it.isAvailable === false ? 'Enable' : 'Disable'}
                      </button>
                      <button className="btnDanger" type="button" disabled={saving} onClick={() => onDelete(it)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataState>
    </ChefLayout>
  )
}
