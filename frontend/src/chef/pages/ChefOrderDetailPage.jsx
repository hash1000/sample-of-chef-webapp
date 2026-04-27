import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ChefLayout from '../components/ChefLayout'
import DataState from '../../admin/components/DataState'
import { fetchChefOrder, toErrorMessage, updateChefOrderStatus } from '../api/chefApi'
import '../../pages/ui.css'

function money(cents) {
  if (typeof cents !== 'number') return '—'
  return `$${(cents / 100).toFixed(2)}`
}

function statusLabel(status) {
  if (status === 'ready') return 'dispatched'
  if (status === 'delivered') return 'completed'
  return status || '—'
}

export default function ChefOrderDetailPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchChefOrder(id)
        if (!alive) return
        setOrder(data)
      } catch (e) {
        if (!alive) return
        setError(
          toErrorMessage(e) ||
            'Chef order detail endpoint not available yet (expected: GET /chef/orders/:id).',
        )
      } finally {
        if (!alive) return
        setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [id])

  const items = useMemo(() => order?.items || [], [order])

  async function updateStatus(status) {
    setUpdating(true)
    setError('')
    try {
      const updated = await updateChefOrderStatus(id, status)
      setOrder(updated)
    } catch (e) {
      setError(toErrorMessage(e))
    } finally {
      setUpdating(false)
    }
  }

  return (
    <ChefLayout
      title="Order details"
      subtitle="Review items and update status fast"
      right={
        <Link className="btnSecondary" to="/chef/orders">
          Back to orders
        </Link>
      }
    >
      <DataState loading={loading} error={error} empty={!loading && !error && !order}>
        <div className="grid2">
          <div className="statCard">
            <div className="statLabel">Order</div>
            <div className="statValue" style={{ fontSize: 16 }}>
              {order?.id || '—'}
            </div>
            <div style={{ height: 10 }} />
            <div className="muted" style={{ fontSize: 13 }}>
              Customer: {order?.user?.name || order?.customerName || '—'}
              <br />
              Status: <span className="badge">{statusLabel(order?.status)}</span>
              <br />
              Created: {order?.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
            </div>
          </div>

          <div className="statCard">
            <strong>Actions</strong>
            <p className="muted" style={{ marginTop: 8, fontSize: 13 }}>
              Move the order from preparing to dispatched, then mark it completed.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              <button
                className="btnSecondary"
                type="button"
                disabled={updating || order?.status !== 'pending'}
                onClick={() => updateStatus('accepted')}
              >
                Accept
              </button>
              <button
                className="btnSecondary"
                type="button"
                disabled={updating || order?.status !== 'accepted'}
                onClick={() => updateStatus('preparing')}
              >
                Preparing
              </button>
              <button
                className="btnSecondary"
                type="button"
                disabled={updating || order?.status !== 'preparing'}
                onClick={() => updateStatus('dispatched')}
              >
                Dispatched
              </button>
              <button
                className="btnSecondary"
                type="button"
                disabled={updating || order?.status !== 'ready'}
                onClick={() => updateStatus('completed')}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        <div style={{ height: 12 }} />

        <div className="tableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Line</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id || it.name}>
                  <td>{it.name}</td>
                  <td>{it.quantity}</td>
                  <td>{money(it.unitPrice)}</td>
                  <td>{money(it.lineTotal)}</td>
                </tr>
              ))}
              {!items.length ? (
                <tr>
                  <td colSpan={4} className="muted">
                    No items found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div style={{ height: 12 }} />

        <div className="statCard">
          <strong>Totals</strong>
          <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>
            Subtotal: {money(order?.subtotal)}
            <br />
            Delivery fee: {money(order?.deliveryFee)}
            <br />
            <strong>Total: {money(order?.total)}</strong>
          </div>
        </div>
      </DataState>
    </ChefLayout>
  )
}

