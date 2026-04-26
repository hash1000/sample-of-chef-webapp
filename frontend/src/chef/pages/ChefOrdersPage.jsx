import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ChefLayout from '../components/ChefLayout'
import DataState from '../../admin/components/DataState'
import { fetchChefOrders, toErrorMessage, updateChefOrderStatus } from '../api/chefApi'
import '../../pages/ui.css'

const TABS = [
  { key: 'new', label: 'New Orders', statuses: ['pending', 'accepted'] },
  { key: 'preparing', label: 'Preparing', statuses: ['preparing', 'ready'] },
  { key: 'completed', label: 'Completed', statuses: ['delivered', 'completed'] },
]

function badgeClass(status) {
  const s = String(status || '').toLowerCase()
  if (s === 'pending') return 'badge warn'
  if (s === 'accepted') return 'badge warn'
  if (s === 'preparing') return 'badge warn'
  if (s === 'ready') return 'badge ok'
  if (s === 'delivered' || s === 'completed') return 'badge ok'
  return 'badge'
}

export default function ChefOrdersPage() {
  const [tab, setTab] = useState('new')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [updatingId, setUpdatingId] = useState('')

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchChefOrders()
      setRows(Array.isArray(data) ? data : data?.items || [])
    } catch (e) {
      setError(toErrorMessage(e) || 'Unable to load chef orders.')
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
        const data = await fetchChefOrders()
        if (!alive) return
        setRows(Array.isArray(data) ? data : data?.items || [])
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

  async function updateStatus(orderId, status) {
    setUpdatingId(orderId)
    setError('')
    try {
      const updated = await updateChefOrderStatus(orderId, status)
      setRows((current) => current.map((order) => (order.id === orderId ? updated : order)))
    } catch (e) {
      setError(toErrorMessage(e))
    } finally {
      setUpdatingId('')
    }
  }

  const filtered = useMemo(() => {
    const def = TABS.find((t) => t.key === tab) || TABS[0]
    return rows.filter((o) => def.statuses.includes(String(o.status || '').toLowerCase()))
  }, [rows, tab])

  return (
    <ChefLayout title="Orders" subtitle="Accept and update order status quickly">
      <div className="toolbar">
        <div className="toolbarLeft" style={{ gap: 8, flexWrap: 'wrap' }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={t.key === tab ? 'btn' : 'btnSecondary'}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
          <span className="badge">{filtered.length} orders</span>
        </div>
        <div className="toolbarRight">
          <button className="btnSecondary" type="button" onClick={refresh}>
            Refresh
          </button>
        </div>
      </div>

      <DataState loading={loading} error={error} empty={!loading && !error && filtered.length === 0}>
        <div className="tableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Status</th>
                <th>Time</th>
                <th style={{ width: 260 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link className="link" to={`/chef/orders/${o.id}`}>
                      {o.id}
                    </Link>
                  </td>
                  <td>{o.user?.name || o.customerName || '—'}</td>
                  <td>{o.items?.length ? `${o.items.length} items` : '—'}</td>
                  <td>
                    <span className={badgeClass(o.status)}>{o.status || '—'}</span>
                  </td>
                  <td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Link className="btnSecondary" to={`/chef/orders/${o.id}`}>
                        View
                      </Link>
                      <button
                        className="btnSecondary"
                        type="button"
                        disabled={updatingId === o.id || o.status !== 'pending'}
                        onClick={() => updateStatus(o.id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="btnSecondary"
                        type="button"
                        disabled={updatingId === o.id || o.status !== 'accepted'}
                        onClick={() => updateStatus(o.id, 'preparing')}
                      >
                        Preparing
                      </button>
                      <button
                        className="btnSecondary"
                        type="button"
                        disabled={updatingId === o.id || o.status !== 'preparing'}
                        onClick={() => updateStatus(o.id, 'ready')}
                      >
                        Ready
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

