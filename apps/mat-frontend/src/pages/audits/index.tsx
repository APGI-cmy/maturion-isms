import Layout from '@/components/Layout';

export default function AuditManagementPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Management</h1>
          <p className="text-muted-foreground">Create and manage audit projects</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Audits</h2>
          <p className="text-muted-foreground">Audit management interface will be implemented here.</p>
        </div>
      </div>
    </Layout>
  );
}
