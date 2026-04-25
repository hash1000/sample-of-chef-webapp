import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import DataState from '../components/DataState'
import { fetchAdminRestaurants, toErrorMessage } from '../api/adminApi'
import '../../pages/ui.css'

export default function RestaurantsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])

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
        setError(
          toErrorMessage(e) ||
            'Admin restaurants endpoint not available yet (expected: GET /admin/restaurants).',
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

  return (
    <AdminLayout title="Restaurants" subtitle="Create/edit restaurants and assign chefs">
      <div className="toolbar">
        <div className="toolbarLeft">
          <span className="badge">{rows.length} restaurants</span>
        </div>
        <div className="toolbarRight">
          <button className="btn" type="button">
            Add Restaurant
          </button>
        </div>
      </div>

      <DataState loading={loading} error={error} empty={!loading && !error && rows.length === 0}>
        <div className="tableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Rating</th>
                <th>Chef</th>
                <th style={{ width: 260 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id || r.name}>
                  <td>{r.name || '—'}</td>
                  <td>{r.rating ?? '—'}</td>
                  <td>{r.chef?.email || r.chefName || 'Unassigned'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button className="btnSecondary" type="button">
                        Edit
                      </button>
                      <button className="btnSecondary" type="button">
                        Assign chef
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
    </AdminLayout>
  )
}

