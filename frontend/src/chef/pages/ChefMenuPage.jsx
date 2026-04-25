import { useEffect, useMemo, useState } from 'react'
import ChefLayout from '../components/ChefLayout'
import DataState from '../../admin/components/DataState'
import { fetchChefMenu, toErrorMessage } from '../api/chefApi'
import '../../pages/ui.css'

function centsToDollars(cents) {
  if (typeof cents !== 'number') return '—'
  return `$${(cents / 100).toFixed(2)}`
}

export default function ChefMenuPage() {
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])

  // local-only form state (until backend endpoints exist)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    priceCents: 0,
    category: '',
    description: '',
    available: true,
    imageUrl: '',
  })

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchChefMenu()
        if (!alive) return
        const rows = Array.isArray(data) ? data : data?.items || []
        setItems(rows)
      } catch (e) {
        if (!alive) return
        setError(
          toErrorMessage(e) ||
            'Chef menu endpoint not available yet (expected: GET /chef/menu).',
        )
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

  function onOpenAdd() {
    setForm({
      name: '',
      priceCents: 0,
      category: '',
      description: '',
      available: true,
      imageUrl: '',
    })
    setShowForm(true)
  }

  function onSaveLocal() {
    const name = form.name.trim()
    if (!name) return
    setItems((prev) => [
      { id: `local-${Date.now()}`, ...form, name, priceCents: Number(form.priceCents) || 0 },
      ...prev,
    ])
    setShowForm(false)
  }

  return (
    <ChefLayout title="Menu" subtitle="Manage menu items (CRUD + availability)">
      <div className="toolbar">
        <div className="toolbarLeft">
          <input
            className="input"
            placeholder="Search name/category…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="badge">{filtered.length} items</span>
        </div>
        <div className="toolbarRight">
          <button className="btn" type="button" onClick={onOpenAdd}>
            Add item
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="statCard" style={{ marginBottom: 12 }}>
          <strong>Add / Edit food item</strong>
          <div className="grid2" style={{ marginTop: 12 }}>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Price (cents)</label>
              <input
                className="input"
                type="number"
                value={form.priceCents}
                onChange={(e) => setForm((p) => ({ ...p, priceCents: e.target.value }))}
              />
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Category</label>
              <input
                className="input"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              />
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Image URL (optional)</label>
              <input
                className="input"
                value={form.imageUrl}
                onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              />
            </div>
          </div>

          <div className="field">
            <label>Description</label>
            <input
              className="input"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="row">
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm((p) => ({ ...p, available: e.target.checked }))}
              />
              Available
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btnSecondary" type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="btn" type="button" onClick={onSaveLocal}>
                Save (local)
              </button>
            </div>
          </div>

          <p className="muted" style={{ marginTop: 10, fontSize: 13 }}>
            Hook this form to backend endpoints like `POST /chef/menu` and `PATCH /chef/menu/:id`.
          </p>
        </div>
      ) : null}

      <DataState loading={loading} error={error} empty={!loading && !error && filtered.length === 0}>
        <div className="tableWrap">
          <table className="adminTable">
            <thead>
              <tr>
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
                  <td>{it.name || '—'}</td>
                  <td>{it.category || '—'}</td>
                  <td>{centsToDollars(it.priceCents ?? it.price ?? it.unitPrice)}</td>
                  <td>
                    <span className={it.available === false ? 'badge bad' : 'badge ok'}>
                      {it.available === false ? 'unavailable' : 'available'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button className="btnSecondary" type="button">
                        Edit
                      </button>
                      <button className="btnSecondary" type="button">
                        Toggle
                      </button>
                      <button className="btnDanger" type="button">
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

