import { useEffect, useState } from 'react'
import RestaurantCard from '../components/RestaurantCard'
import { getApiErrorMessage } from '../services/api'
import { listRestaurants } from '../services/customerApi'
import CustomerLayout from './CustomerLayout'

const CITIES = [
  { value: 'islamabad', label: 'Islamabad' },
  { value: 'karachi', label: 'Karachi' },
  { value: 'lahore', label: 'Lahore' },
]

const CITY_STORAGE_KEY = 'selectedCity'

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([])
  const [city, setCity] = useState(() => localStorage.getItem(CITY_STORAGE_KEY) || '')
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!city) {
      setRestaurants([])
      setLoading(false)
      return undefined
    }

    let active = true
    setLoading(true)
    setError('')

    listRestaurants({ city, q, category, limit: 24 })
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
  }, [city, q, category])

  function chooseCity(nextCity) {
    localStorage.setItem(CITY_STORAGE_KEY, nextCity)
    setCity(nextCity)
  }

  const selectedCity = CITIES.find((item) => item.value === city)
  const featured = restaurants.slice(0, 3)

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {!city ? (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h1 className="m-0 text-2xl font-bold text-slate-950">Select your city</h1>
              <p className="mt-2 text-sm text-slate-600">
                Restaurants and cuisines are filtered by your selected location.
              </p>
              <div className="mt-5 grid gap-3">
                {CITIES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className="btn w-full"
                    onClick={() => chooseCity(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="m-0 text-2xl font-bold text-slate-950">
              Restaurants in {selectedCity?.label || 'your city'}
            </h1>
            <p className="mt-1 text-sm text-slate-600">Search local menus and place a controlled demo order.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              className="input"
              value={city}
              onChange={(event) => chooseCity(event.target.value)}
              aria-label="Selected city"
            >
              <option value="" disabled>
                Select city
              </option>
              {CITIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
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
          <>
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="m-0 text-lg font-semibold text-slate-950">Featured restaurants</h2>
                <span className="badge">Top rated</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {featured.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} featured />
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="m-0 text-lg font-semibold text-slate-950">All restaurants</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            No restaurants match your filters.
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}

