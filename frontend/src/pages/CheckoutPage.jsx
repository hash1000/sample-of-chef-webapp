import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getApiErrorMessage } from '../services/api'
import { createOrder } from '../services/customerApi'
import AuthedLayout from './AuthedLayout'

function money(cents) {
  return `$${(Number(cents || 0) / 100).toFixed(2)}`
}

export default function CheckoutPage() {
  const cart = useCart()
  const navigate = useNavigate()
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('mock')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const order = await createOrder({
        restaurantId: cart.restaurant?.id,
        deliveryAddress,
        paymentMethod,
        items: cart.items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      })
      cart.clearCart()
      navigate(`/orders/${order.id}`)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthedLayout title="Checkout">
      <form onSubmit={onSubmit} className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="m-0 text-2xl font-bold text-slate-950">Checkout</h1>
          <div className="field">
            <label htmlFor="address">Delivery address</label>
            <input
              id="address"
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
              required
              minLength={8}
              placeholder="Street, city, state, ZIP"
            />
          </div>
          <div className="field">
            <label htmlFor="payment">Payment</label>
            <select
              id="payment"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
            >
              <option value="mock">Mock payment</option>
              <option value="stripe">Stripe-ready mock</option>
            </select>
          </div>
          {error ? <div className="error">{error}</div> : null}
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="font-semibold text-slate-950">{cart.restaurant?.name || 'No restaurant'}</div>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-3">
                <span>{item.quantity}x {item.name}</span>
                <strong>{money(item.priceCents * item.quantity)}</strong>
              </div>
            ))}
            <div className="flex justify-between border-t border-slate-200 pt-3">
              <span>Total</span>
              <strong>{money(cart.total)}</strong>
            </div>
          </div>
          <button className="btn mt-5 w-full" type="submit" disabled={submitting || !cart.items.length}>
            {submitting ? 'Placing order...' : 'Place order'}
          </button>
        </aside>
      </form>
    </AuthedLayout>
  )
}
