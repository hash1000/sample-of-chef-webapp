import '../../pages/ui.css'

export default function DataState({ loading, error, empty, children }) {
  if (loading) {
    return (
      <div className="card" style={{ maxWidth: 'none' }}>
        <div aria-busy="true" aria-live="polite">
          Loading…
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="error" role="alert" style={{ maxWidth: 'none' }}>
        {error}
      </div>
    )
  }
  if (empty) {
    return (
      <div className="card" style={{ maxWidth: 'none' }}>
        <p className="muted" style={{ margin: 0 }}>
          No data yet.
        </p>
      </div>
    )
  }
  return children
}

