import { useEffect, useState } from 'react'
import { cuisineImages, heroBannerImage } from '../assets/foodImages'
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

        <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
          <img
            src={heroBannerImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/10" />
          <div className="relative max-w-2xl px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90 backdrop-blur">
              Fresh local kitchens
            </span>
            <h1 className="mt-4 max-w-xl text-3xl font-bold leading-tight sm:text-5xl">
              Order from trusted restaurants in {selectedCity?.label || 'your city'}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/80 sm:text-base">
              Browse chef-owned menus, compare cuisines, and place a clean demo order with a polished delivery flow.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="m-0 text-lg font-semibold text-slate-950">Popular cuisines</h2>
              <p className="mt-1 text-sm text-slate-600">Choose a cuisine with local bundled images.</p>
            </div>
            {category ? (
              <button type="button" className="btnSecondary" onClick={() => setCategory('')}>
                Clear cuisine
              </button>
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cuisineImages.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setCategory(item.key)}
                className={`group relative min-h-36 overflow-hidden rounded-2xl border text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/15 ${
                  category === item.key ? 'border-brand-primary' : 'border-slate-200'
                }`}
              >
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <span className="relative flex min-h-36 flex-col justify-end p-4 text-white">
                  <span className="text-base font-bold">{item.title}</span>
                  <span className="mt-1 text-xs text-white/80">{item.subtitle}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h2 className="m-0 text-2xl font-bold text-slate-950">
              Restaurants in {selectedCity?.label || 'your city'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">Search local menus and place a controlled demo order.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <select
              className="input w-full"
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
              className="input w-full"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search restaurants or food"
            />
            <input
              className="input w-full"
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

