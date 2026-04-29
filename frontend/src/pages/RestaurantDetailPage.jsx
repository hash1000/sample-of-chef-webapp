import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { imageForRestaurant } from '../assets/foodImages'
import FoodItemCard from '../components/FoodItemCard'
import { useCart } from '../context/CartContext'
import { getApiErrorMessage } from '../services/api'
import { getRestaurant } from '../services/customerApi'
import CustomerLayout from './CustomerLayout'

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
    <CustomerLayout>
      {loading ? <div className="muted">Loading menu...</div> : null}
      {error ? <div className="error">{error}</div> : null}
      {restaurant ? (
        <div className="space-y-5">
          <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
            <img
              src={imageForRestaurant(restaurant)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/10" />
            <div className="relative flex min-h-72 flex-col justify-end gap-5 px-5 py-6 sm:px-8 md:flex-row md:items-end md:justify-between md:py-8">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {restaurant.menuType || 'Restaurant'}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    ★ {restaurant.rating ?? '-'}
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">{restaurant.name}</h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                  {restaurant.description || restaurant.menuType || 'Chef-owned storefront with strict order status controls.'}
                </p>
              </div>
              <Link className="btn shrink-0" to="/cart">
                Cart ({cart.count})
              </Link>
            </div>
          </section>

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
    </CustomerLayout>
  )
}
