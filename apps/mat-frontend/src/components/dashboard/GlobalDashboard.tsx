export default function GlobalDashboard() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Global Overview</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Audits</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
