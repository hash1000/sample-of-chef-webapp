import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import DataState from '../components/DataState'
import { fetchAdminOrders, toErrorMessage } from '../api/adminApi'
import '../../pages/ui.css'

export default function OrdersPage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchAdminOrders()
        if (!alive) return
        setRows(Array.isArray(data) ? data : data?.items || [])
      } catch (e) {
        if (!alive) return
        setError(
          toErrorMessage(e) ||
            'Admin orders endpoint not available yet (expected: GET /admin/orders).',
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
    if (!status) return rows
    return rows.filter((o) => String(o.status || '').toLowerCase() === status)
  }, [rows, status])

  return (
    <AdminLayout title="Orders" subtitle="Monitor order lifecycle and payment state">
      <div className="toolbar">
        <div className="toolbarLeft">
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="pending">pending</option>
            <option value="accepted">accepted</option>
            <option value="preparing">preparing</option>
            <option value="ready">ready</option>
            <option value="picked">picked</option>
            <option value="delivered">delivered</option>
          </select>
          <span className="badge">{filtered.length} orders</span>
        </div>
        <div className="toolbarRight">
          <button className="btnSecondary" type="button" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      </div>

      <DataState
        loading={loading}
        error={error}
        empty={!loading && !error && filtered.length === 0}
      >
        <div className="tableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Order</th>
                <th>User</th>
                <th>Restaurant</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.user?.email || o.userEmail || '—'}</td>
                  <td>{o.restaurant?.name || o.restaurantName || '—'}</td>
                  <td>
                    <span className="badge">{o.status || '—'}</span>
                  </td>
                  <td>
                    <span className="badge">{o.paymentStatus || '—'}</span>
                  </td>
                  <td>{typeof o.total === 'number' ? `$${(o.total / 100).toFixed(2)}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataState>
    </AdminLayout>
  )
}

