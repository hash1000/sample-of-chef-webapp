import { useEffect, useState } from 'react'
import RestaurantCard from '../components/RestaurantCard'
import { getApiErrorMessage } from '../services/api'
import { listRestaurants } from '../services/customerApi'
import AuthedLayout from './AuthedLayout'

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    listRestaurants({ q, category, limit: 24 })
      .then((data) => {
        if (active) setRestaurants(data.items ?? [])
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
  }, [q, category])

  return (
    <AuthedLayout title="AmericanDemoFood">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="m-0 text-2xl font-bold text-slate-950">Restaurants</h1>
            <p className="mt-1 text-sm text-slate-600">Search menus and place a controlled demo order.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="input"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search restaurants or food"
            />
            <input
              className="input"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Category"
            />
          </div>
        </div>

        {error ? <div className="error">{error}</div> : null}

        {loading ? (
          <div className="muted">Loading restaurants...</div>
        ) : restaurants.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            No restaurants match your filters.
          </div>
        )}
      </div>
    </AuthedLayout>
  )
}

