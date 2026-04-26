import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FoodItemCard from '../components/FoodItemCard'
import { useCart } from '../context/CartContext'
import { getApiErrorMessage } from '../services/api'
import { getRestaurant } from '../services/customerApi'
import AuthedLayout from './AuthedLayout'

export default function RestaurantDetailPage() {
  const { id } = useParams()
  const cart = useCart()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getRestaurant(id)
      .then((data) => {
        if (active) setRestaurant(data)
      })
      .catch((err) => {
        if (active) setError(getApiErrorMessage(err))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  const categories = useMemo(() => {
    const grouped = new Map()
    for (const item of restaurant?.menuItems ?? []) {
      const key = item.category || 'Food'
      grouped.set(key, [...(grouped.get(key) ?? []), item])
    }
    return [...grouped.entries()]
  }, [restaurant])

  return (
    <AuthedLayout title="Restaurant">
      {loading ? <div className="muted">Loading menu...</div> : null}
      {error ? <div className="error">{error}</div> : null}
      {restaurant ? (
        <div className="space-y-5">
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="m-0 text-2xl font-bold text-slate-950">{restaurant.name}</h1>
              <p className="mt-1 text-sm text-slate-600">
                Chef-owned storefront with strict order status controls.
              </p>
            </div>
            <Link className="btn" to="/cart">
              Cart ({cart.count})
            </Link>
          </div>

          {categories.map(([categoryName, items]) => (
            <section key={categoryName} className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-950">{categoryName}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <FoodItemCard
                    key={item.id}
                    item={item}
                    onAdd={(selected) =>
                      cart.addItem({ id: restaurant.id, name: restaurant.name }, selected)
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </AuthedLayout>
  )
}
