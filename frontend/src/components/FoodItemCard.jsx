import { imageForMenuItem } from '../assets/foodImages'

export default function FoodItemCard({ item, onAdd }) {
  const price = Number(item.priceCents ?? 0) / 100
  const image = imageForMenuItem(item)

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-primary/25 hover:shadow-lg sm:flex-row">
      <div className="aspect-[16/10] bg-slate-100 sm:aspect-auto sm:w-36 sm:shrink-0">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-base font-semibold text-slate-950">
              {item.name}
            </div>
            {item.description ? (
              <div className="mt-1 line-clamp-2 text-sm text-slate-500">{item.description}</div>
            ) : null}
          </div>
          <div className="shrink-0 text-sm font-bold text-slate-950">
            ${price.toFixed(2)}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {item.category || 'Food'}
          </div>
          <button
            type="button"
            onClick={() => onAdd(item)}
            disabled={!item.isAvailable}
            className="btn min-w-28 px-3 py-2 text-sm"
          >
            {item.isAvailable ? 'Add to cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  )
}

