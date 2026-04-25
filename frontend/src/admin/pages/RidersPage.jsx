import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import DataState from '../components/DataState'
import { fetchAdminRiders, toErrorMessage } from '../api/adminApi'
import '../../pages/ui.css'

function statusClass(s) {
  const v = String(s || '').toLowerCase()
  if (v === 'online') return 'badge ok'
  if (v === 'offline') return 'badge bad'
  return 'badge'
}

export default function RidersPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchAdminRiders()
        if (!alive) return
        setRows(Array.isArray(data) ? data : data?.items || [])
      } catch (e) {
        if (!alive) return
        setError(
          toErrorMessage(e) ||
            'Admin riders endpoint not available yet (expected: GET /admin/riders).',
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
    <AdminLayout title="Riders" subtitle="Rider availability and assigned orders">
      <DataState loading={loading} error={error} empty={!loading && !error && rows.length === 0}>
        <div className="tableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Active orders</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id || r.email}>
                  <td>{r.name || '—'}</td>
                  <td>{r.email || '—'}</td>
                  <td>
                    <span className={statusClass(r.status)}>{r.status || '—'}</span>
                  </td>
                  <td>{r.activeOrders ?? r.assignedOrders?.length ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataState>
    </AdminLayout>
  )
}

