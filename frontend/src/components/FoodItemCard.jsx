export default function FoodItemCard({ item, onAdd }) {
  const price = Number(item.priceCents ?? 0) / 100

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-slate-900">
            {item.name}
          </div>
          {item.description ? (
            <div className="mt-1 text-sm text-slate-500">{item.description}</div>
          ) : null}
        </div>
        <div className="text-sm font-semibold text-slate-900">
          ${price.toFixed(2)}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {item.category || 'Food'}
        </div>
        <button
          type="button"
          onClick={() => onAdd(item)}
          disabled={!item.isAvailable}
          className="rounded-xl bg-brand-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-primaryHover disabled:opacity-60"
        >
          {item.isAvailable ? 'Add to cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  )
}

