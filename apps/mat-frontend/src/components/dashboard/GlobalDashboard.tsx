/**
 * Global Audit Dashboard Component
 * FRS: FR-039 (Global Dashboard)
 * TRS: TR-047, TR-033
 */
export function GlobalDashboard() {
  return (
    <div className="global-dashboard">
      <h2>Global Audit Dashboard</h2>
      <div className="metrics-grid">
        <div className="metric">
          <span>Total Audits</span>
          <strong>0</strong>
        </div>
        <div className="metric">
          <span>Completion Rate</span>
          <strong>0%</strong>
        </div>
        <div className="metric">
          <span>Average Maturity</span>
          <strong>0.0</strong>
        </div>
      </div>
    </div>
  );
}
