import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ChefLayout from '../components/ChefLayout'
import DataState from '../../admin/components/DataState'
import StatCard from '../../admin/components/StatCard'
import { fetchChefOrders, toErrorMessage } from '../api/chefApi'
import '../../pages/ui.css'

function statusBadge(status) {
  const s = String(status || '').toLowerCase()
  if (s === 'pending' || s === 'new') return 'badge warn'
  if (s === 'preparing') return 'badge warn'
  if (s === 'ready') return 'badge ok'
  if (s === 'delivered' || s === 'completed') return 'badge ok'
  return 'badge'
}

export default function ChefDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchChefOrders()
        if (!alive) return
        const items = Array.isArray(data) ? data : data?.items || []
        setOrders(items)
      } catch (e) {
        if (!alive) return
        setError(
          toErrorMessage(e) ||
            'Chef orders endpoint not available yet (expected: GET /chef/orders).',
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

  const summary = useMemo(() => {
    const total = orders.length
    const active = orders.filter((o) => ['pending', 'accepted', 'preparing', 'ready'].includes(o.status))
      .length
    const completed = orders.filter((o) => ['delivered', 'completed'].includes(o.status)).length
    return { total, active, completed }
  }, [orders])

  const recent = useMemo(() => orders.slice(0, 8), [orders])

  return (
    <ChefLayout
      title="Dashboard"
      subtitle="Quick overview and fast access to active orders (chef-only)"
      right={
        <Link className="btnSecondary" to="/chef/orders">
          View all orders
        </Link>
      }
    >
      <DataState loading={loading} error={error} empty={!loading && !error && orders.length === 0}>
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="grid4">
            <StatCard label="Total Orders" value={String(summary.total)} />
            <StatCard label="Active Orders" value={String(summary.active)} />
            <StatCard label="Completed Orders" value={String(summary.completed)} />
            <StatCard label="Today" value="—" hint="Add backend aggregation later" />
          </div>

          <div className="tableWrap">
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link className="link" to={`/chef/orders/${o.id}`}>
                        {o.id}
                      </Link>
                    </td>
                    <td>{o.user?.name || o.customerName || '—'}</td>
                    <td>{o.items?.length ? `${o.items.length} items` : '—'}</td>
                    <td>
                      <span className={statusBadge(o.status)}>{o.status || '—'}</span>
                    </td>
                    <td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}</td>
                  </tr>
                ))}
                {!recent.length ? (
                  <tr>
                    <td colSpan={5} className="muted">
                      No recent orders yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </DataState>
    </ChefLayout>
  )
}

