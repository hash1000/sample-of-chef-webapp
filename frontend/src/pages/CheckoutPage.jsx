import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getApiErrorMessage } from '../services/api'
import { createOrder } from '../services/customerApi'
import AuthedLayout from './AuthedLayout'

function money(cents) {
  return `$${(Number(cents || 0) / 100).toFixed(2)}`
}

export default function CheckoutPage() {
  const cart = useCart()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(
    searchParams.get('canceled') ? 'Stripe payment was canceled. You can try again.' : '',
  )

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const order = await createOrder({
        restaurantId: cart.restaurant?.id,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        deliveryAddress: form.deliveryAddress,
        paymentMethod: 'stripe',
        items: cart.items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      })

      if (order.checkoutUrl) {
        cart.clearCart()
        window.location.assign(order.checkoutUrl)
        return
      }

      cart.clearCart()
      window.location.assign(`/orders/${order.id}`)
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
          <p className="mt-1 text-sm text-slate-600">
            Enter your delivery details, then complete payment securely on Stripe.
          </p>

          <div className="grid2">
            <div className="field">
              <label htmlFor="customerName">Full name</label>
              <input
                id="customerName"
                value={form.customerName}
                onChange={(event) => updateField('customerName', event.target.value)}
                required
                minLength={2}
                placeholder="Your name"
              />
            </div>
            <div className="field">
              <label htmlFor="customerPhone">Phone number</label>
              <input
                id="customerPhone"
                value={form.customerPhone}
                onChange={(event) => updateField('customerPhone', event.target.value)}
                required
                minLength={7}
                placeholder="03001234567"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="customerEmail">Email</label>
            <input
              id="customerEmail"
              type="email"
              value={form.customerEmail}
              onChange={(event) => updateField('customerEmail', event.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="field">
            <label htmlFor="address">Delivery address</label>
            <input
              id="address"
              value={form.deliveryAddress}
              onChange={(event) => updateField('deliveryAddress', event.target.value)}
              required
              minLength={8}
              placeholder="House, street, area, city"
            />
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
          {cart.items.length ? (
            <button className="btn mt-5 w-full" type="submit" disabled={submitting}>
              {submitting ? 'Opening Stripe...' : 'Pay with Stripe'}
            </button>
          ) : (
            <Link className="btn mt-5 inline-flex w-full justify-center" to="/home">
              Browse restaurants
            </Link>
          )}
        </aside>
      </form>
    </AuthedLayout>
  )
}
