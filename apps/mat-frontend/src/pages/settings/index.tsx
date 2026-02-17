import Layout from '@/components/Layout';

export default function UserSettingsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">User Settings</h2>
          <p className="text-muted-foreground">Settings interface will be implemented here.</p>
        </div>
      </div>
    </Layout>
  );
}
