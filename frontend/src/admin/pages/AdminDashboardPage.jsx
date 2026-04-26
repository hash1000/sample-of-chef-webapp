import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import DataState from '../components/DataState'
import StatCard from '../components/StatCard'
import { fetchAdminSummary, toErrorMessage } from '../api/adminApi'
import '../../pages/ui.css'

function formatCents(cents) {
  if (typeof cents !== 'number') return '—'
  return `$${(cents / 100).toFixed(2)}`
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const summary = await fetchAdminSummary()
        if (!alive) return
        setData(summary)
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

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="High-level metrics and recent activity (admin-only)"
    >
      <DataState loading={loading} error={error} empty={!loading && !error && !data}>
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="grid4">
            <StatCard label="Total Users" value={data?.totalUsers ?? '—'} />
            <StatCard label="Total Restaurants" value={data?.totalRestaurants ?? '—'} />
            <StatCard label="Total Orders" value={String(data?.totalOrders ?? 0)} />
            <StatCard label="Total Revenue" value={formatCents(data?.totalRevenue)} />
          </div>

          <div>
            <div className="toolbar">
              <div className="toolbarLeft">
                <strong>Recent orders</strong>
                <span className="badge">latest</span>
              </div>
            </div>

            <div className="tableWrap">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.recentOrders || []).map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>
                        <span className="badge">{o.status}</span>
                      </td>
                      <td>{formatCents(o.total)}</td>
                      <td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}</td>
                    </tr>
                  ))}
                  {!data?.recentOrders?.length ? (
                    <tr>
                      <td colSpan={4} className="muted">
                        No recent orders yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <p className="muted" style={{ marginTop: 10, fontSize: 13 }}>
              Revenue is calculated from order totals and updates as new demo orders are placed.
            </p>
          </div>
        </div>
      </DataState>
    </AdminLayout>
  )
}

