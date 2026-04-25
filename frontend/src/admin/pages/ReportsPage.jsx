import AdminLayout from '../components/AdminLayout'
import '../../pages/ui.css'

export default function ReportsPage() {
  return (
    <AdminLayout
      title="Reports"
      subtitle="Analytics overview (connect to backend/reporting later)"
    >
      <div className="grid2">
        <div className="statCard">
          <strong>Sales</strong>
          <p className="muted" style={{ margin: '8px 0 0' }}>
            Add charts for revenue, orders/day, and conversion.
          </p>
        </div>
        <div className="statCard">
          <strong>Operations</strong>
          <p className="muted" style={{ margin: '8px 0 0' }}>
            Track acceptance time, prep time, and delivery SLA.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}

