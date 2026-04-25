import '../../pages/ui.css'

export default function StatCard({ label, value, hint }) {
  return (
    <div className="statCard">
      <div className="statLabel">{label}</div>
      <div className="statValue">{value}</div>
      {hint ? (
        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
          {hint}
        </div>
      ) : null}
    </div>
  )
}

