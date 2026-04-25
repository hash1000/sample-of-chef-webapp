import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import DataState from '../components/DataState'
import { fetchAdminPayments, toErrorMessage } from '../api/adminApi'
import '../../pages/ui.css'

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchAdminPayments()
        if (!alive) return
        setRows(Array.isArray(data) ? data : data?.items || [])
      } catch (e) {
        if (!alive) return
        setError(
          toErrorMessage(e) ||
            'Admin payments endpoint not available yet (expected: GET /admin/payments).',
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
    <AdminLayout title="Payments" subtitle="Stripe transactions and payment outcomes">
      <DataState loading={loading} error={error} empty={!loading && !error && rows.length === 0}>
        <div className="tableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Order</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id || p.stripeId}>
                  <td>{p.id || p.stripeId || '—'}</td>
                  <td>{p.orderId || '—'}</td>
                  <td>
                    <span className="badge">{p.status || '—'}</span>
                  </td>
                  <td>
                    {typeof p.amount === 'number' ? `$${(p.amount / 100).toFixed(2)}` : '—'}
                  </td>
                  <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataState>
    </AdminLayout>
  )
}

