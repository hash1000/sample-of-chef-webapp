export default function CartItem({ item, onDec, onInc, onRemove }) {
  const price = Number(item.priceCents ?? 0) / 100

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:border-brand-primary/20 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-900">
          {item.name}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          ${price.toFixed(2)} each
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onDec(item.id)}
          className="btnIcon"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <div className="w-10 text-center text-sm font-semibold text-slate-900">
          {item.quantity}
        </div>
        <button
          type="button"
          onClick={() => onInc(item.id)}
          className="btnIcon"
          aria-label="Increase quantity"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="btnSecondary ml-auto px-3 py-2 text-sm sm:ml-2"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

