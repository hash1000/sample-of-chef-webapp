export function LoadingState({ title = 'Loading…', subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {subtitle ? <div className="mt-1 text-sm text-slate-500">{subtitle}</div> : null}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
      <div className="text-sm font-semibold text-rose-900">{title}</div>
      {message ? <div className="mt-1 text-sm text-rose-800">{message}</div> : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl bg-rose-900 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-800"
        >
          Retry
        </button>
      ) : null}
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {message ? <div className="mt-1 text-sm text-slate-500">{message}</div> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

