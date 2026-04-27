import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../services/api'
import { confirmOrderPayment, getOrder } from '../services/customerApi'
import AuthedLayout from './AuthedLayout'

const STATUSES = ['pending', 'accepted', 'preparing', 'ready', 'delivered']

function money(cents) {
  return `$${(Number(cents || 0) / 100).toFixed(2)}`
}

export default function OrderTrackingPage() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paymentMessage, setPaymentMessage] = useState('')

  useEffect(() => {
    let active = true
    const sessionId = searchParams.get('session_id')

    async function confirmIfNeeded() {
      if (!sessionId) return
      try {
        const updated = await confirmOrderPayment(id, sessionId)
        if (!active) return
        setOrder(updated)
        setPaymentMessage(updated?.payment?.status === 'succeeded' ? 'Payment completed.' : 'Payment is processing.')
        setSearchParams({}, { replace: true })
      } catch (err) {
        if (active) setError(getApiErrorMessage(err))
      }
    }

    const load = () => {
      getOrder(id)
        .then((data) => {
          if (active) setOrder(data)
        })
        .catch((err) => {
          if (active) setError(getApiErrorMessage(err))
        })
        .finally(() => {
          if (active) setLoading(false)
        })
    }
    confirmIfNeeded()
    load()
    const timer = setInterval(load, 8000)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [id, searchParams, setSearchParams])

  const activeIndex = useMemo(() => STATUSES.indexOf(order?.status), [order?.status])
  const customer = order
    ? [order.customerName, order.customerPhone, order.customerEmail].filter(Boolean).join(' • ')
    : ''

  function statusLabel(status) {
    if (status === 'ready') return 'dispatched'
    if (status === 'delivered') return 'completed'
    return status
  }

  return (
    <AuthedLayout title="Order tracking">
      {loading ? <div className="muted">Loading order...</div> : null}
      {error ? <div className="error">{error}</div> : null}
      {paymentMessage ? <div className="badge ok">{paymentMessage}</div> : null}
      {order ? (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Order #{order.id.slice(0, 8)}</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">{order.restaurant?.name}</h1>
            <p className="mt-1 text-sm text-slate-600">{customer}</p>
            <p className="mt-1 text-sm text-slate-600">
              Payment: <strong>{order.payment?.status || '—'}</strong>
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-5">
              {STATUSES.map((status, index) => (
                <div
                  key={status}
                  className={`rounded-xl border p-3 text-sm font-semibold ${
                    index <= activeIndex
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  {statusLabel(status)}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="m-0 text-lg font-semibold text-slate-950">Items</h2>
            <div className="mt-3 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <strong>{money(item.lineTotal)}</strong>
                </div>
              ))}
              <div className="flex justify-between border-t border-slate-200 pt-3">
                <span>Total</span>
                <strong>{money(order.total)}</strong>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AuthedLayout>
  )
}
