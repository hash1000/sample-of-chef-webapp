import { Link } from 'react-router-dom'

export default function RestaurantCard({ restaurant }) {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-slate-900">
            {restaurant.name}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {restaurant.cuisine || 'Various cuisines'}
          </div>
        </div>
        <div className="rounded-xl bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
          ★ {restaurant.rating ?? '—'}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>{restaurant.deliveryTimeMins ?? 30} mins</span>
        <span className="text-slate-900 group-hover:underline">View menu</span>
      </div>
    </Link>
  )
}

