import { Link } from 'react-router-dom'

const CITY_LABELS = {
  islamabad: 'Islamabad',
  karachi: 'Karachi',
  lahore: 'Lahore',
}

export default function RestaurantCard({ restaurant, featured = false }) {
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
            {restaurant.menuType || restaurant.menuItems?.[0]?.category || 'Local favorites'}
          </div>
        </div>
        <div className="rounded-xl bg-brand-secondary px-2 py-1 text-xs font-semibold text-white">
          ★ {restaurant.rating ?? '—'}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>{CITY_LABELS[restaurant.city] || 'Selected city'}</span>
        {featured ? <span className="font-semibold text-slate-900">Featured</span> : null}
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
        <span>{restaurant.menuItems?.length ?? 0} menu previews</span>
        <span className="text-slate-900 group-hover:underline">View menu</span>
      </div>
    </Link>
  )
}

