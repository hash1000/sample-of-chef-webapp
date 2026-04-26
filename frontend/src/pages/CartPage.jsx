import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'
import { useCart } from '../context/CartContext'
import AuthedLayout from './AuthedLayout'

function money(cents) {
  return `$${(Number(cents || 0) / 100).toFixed(2)}`
}

export default function CartPage() {
  const cart = useCart()

  return (
    <AuthedLayout title="Cart">
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          <h1 className="m-0 text-2xl font-bold text-slate-950">Your cart</h1>
          {cart.items.length ? (
            cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onDec={cart.decrement}
                onInc={cart.increment}
                onRemove={cart.removeItem}
              />
            ))
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
              Your cart is empty.
            </div>
          )}
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Restaurant</div>
          <div className="mt-1 font-semibold text-slate-950">{cart.restaurant?.name || 'None selected'}</div>
          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>{money(cart.subtotal)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <strong>{money(cart.deliveryFee)}</strong>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
              <span>Total</span>
              <strong>{money(cart.total)}</strong>
            </div>
          </div>
          <Link
            className={`btn mt-5 inline-flex w-full justify-center ${cart.items.length ? '' : 'pointer-events-none opacity-60'}`}
            to="/checkout"
          >
            Checkout
          </Link>
        </aside>
      </div>
    </AuthedLayout>
  )
}
