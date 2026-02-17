import Layout from '@/components/Layout';

export default function EvidenceCollectionPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evidence Collection</h1>
          <p className="text-muted-foreground">Collect and manage audit evidence</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Evidence</h2>
          <p className="text-muted-foreground">Evidence collection interface will be implemented here.</p>
        </div>
      </div>
    </Layout>
  );
}
