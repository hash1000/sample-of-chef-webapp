import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import DataState from '../components/DataState'
import { fetchAdminUsers, toErrorMessage } from '../api/adminApi'
import '../../pages/ui.css'

function badgeForStatus(status) {
  if (!status) return 'badge'
  const s = String(status).toLowerCase()
  if (s === 'active') return 'badge ok'
  if (s === 'blocked') return 'badge bad'
  return 'badge'
}

export default function UsersPage() {
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchAdminUsers()
        if (!alive) return
        setRows(Array.isArray(data) ? data : data?.items || [])
      } catch (e) {
        if (!alive) return
        // Backend might not have admin endpoints yet; show a clear message.
        setError(
          toErrorMessage(e) ||
            'Admin users endpoint not available yet (expected: GET /admin/users).',
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
    if (!s) return rows
    return rows.filter((r) => {
      const hay = `${r?.name || ''} ${r?.email || ''} ${r?.role || ''}`.toLowerCase()
      return hay.includes(s)
    })
  }, [q, rows])

  return (
    <AdminLayout title="Users" subtitle="View and manage users (block/unblock/delete)">
      <div className="toolbar">
        <div className="toolbarLeft">
          <input
            className="input"
            placeholder="Search name/email/role…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="badge">{filtered.length} results</span>
        </div>
        <div className="toolbarRight">
          <button className="btnSecondary" type="button" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      </div>

      <DataState loading={loading} error={error} empty={!loading && !error && filtered.length === 0}>
        <div className="tableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ width: 260 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id || u.email}>
                  <td>{u.name || '—'}</td>
                  <td>{u.email || '—'}</td>
                  <td>
                    <span className="badge">{u.role || '—'}</span>
                  </td>
                  <td>
                    <span className={badgeForStatus(u.status || 'active')}>
                      {u.status || 'active'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button className="btnSecondary" type="button">
                        View
                      </button>
                      <button className="btnSecondary" type="button">
                        Block / Unblock
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

