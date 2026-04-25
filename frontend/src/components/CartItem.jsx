export default function CartItem({ item, onDec, onInc, onRemove }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-900">
          {item.name}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          ${Number(item.price).toFixed(2)} each
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onDec(item.id)}
          className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
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
          className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
          aria-label="Increase quantity"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="ml-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

