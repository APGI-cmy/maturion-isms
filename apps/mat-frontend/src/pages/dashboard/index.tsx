import Layout from '@/components/Layout';

export default function DashboardsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of audit progress and metrics</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold text-lg mb-2">Active Audits</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold text-lg mb-2">Completed Audits</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold text-lg mb-2">Evidence Collected</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
