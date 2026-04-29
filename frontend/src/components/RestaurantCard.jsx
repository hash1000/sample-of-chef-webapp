import { Link } from 'react-router-dom'
import { imageForRestaurant } from '../assets/foodImages'

const CITY_LABELS = {
  islamabad: 'Islamabad',
  karachi: 'Karachi',
  lahore: 'Lahore',
}

export default function RestaurantCard({ restaurant, featured = false }) {
  const image = imageForRestaurant(restaurant)

  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/15"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/60 to-transparent" />
        <div className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-950 shadow-sm">
          ★ {restaurant.rating ?? '-'}
        </div>
        {featured ? (
          <div className="absolute left-3 top-3 rounded-full bg-brand-secondary px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            Featured
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-slate-950">
              {restaurant.name}
            </div>
            <div className="mt-1 text-sm text-slate-500">
              {restaurant.menuType || restaurant.menuItems?.[0]?.category || 'Local favorites'}
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {CITY_LABELS[restaurant.city] || 'Selected city'}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>{restaurant.menuItems?.length ?? 0} menu previews</span>
          <span className="font-semibold text-brand-primary transition group-hover:translate-x-0.5">
            View menu
          </span>
        </div>
      </div>
    </Link>
  )
}

