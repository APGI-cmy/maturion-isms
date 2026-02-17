import Layout from '@/components/Layout';

export default function AIScoringReviewPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Scoring Review</h1>
          <p className="text-muted-foreground">Review and confirm AI-generated scores</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Findings</h2>
          <p className="text-muted-foreground">AI scoring review interface will be implemented here.</p>
        </div>
      </div>
    </Layout>
  );
}
