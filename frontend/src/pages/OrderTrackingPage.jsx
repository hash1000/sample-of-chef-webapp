import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getApiErrorMessage } from '../services/api'
import { getOrder } from '../services/customerApi'
import AuthedLayout from './AuthedLayout'

const STATUSES = ['pending', 'accepted', 'preparing', 'ready', 'delivered']

function money(cents) {
  return `$${(Number(cents || 0) / 100).toFixed(2)}`
}

export default function OrderTrackingPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
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
    load()
    const timer = setInterval(load, 8000)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [id])

  const activeIndex = useMemo(() => STATUSES.indexOf(order?.status), [order?.status])

  return (
    <AuthedLayout title="Order tracking">
      {loading ? <div className="muted">Loading order...</div> : null}
      {error ? <div className="error">{error}</div> : null}
      {order ? (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Order #{order.id.slice(0, 8)}</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">{order.restaurant?.name}</h1>
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
                  {status}
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
