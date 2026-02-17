import Layout from '@/components/Layout';

export default function CriteriaManagementPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Criteria Management</h1>
          <p className="text-muted-foreground">Upload and manage ISO/IEC criteria</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Criteria Upload</h2>
          <p className="text-muted-foreground">Criteria management interface will be implemented here.</p>
        </div>
      </div>
    </Layout>
  );
}
