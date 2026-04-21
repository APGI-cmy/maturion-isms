import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
export default function DashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/qiw/status', { headers: { 'Authorization': `Bearer ${session?.access_token}` } });
      return res.json();
    },
    staleTime: 30_000, // TR-005: cache for dashboard render performance
  });
  if (isLoading) return <div>Loading dashboard...</div>;
  return (
    <main>
      <h1>Maturity Dashboard</h1>
      <section>
        <h2>Pipeline Status</h2>
        {dashboard?.pipeline_stages?.map((s: any) => (
          <div key={s.id}>{s.id}: <strong>{s.status}</strong> ({s.count})</div>
        ))}
      </section>
      <section><h2>7-Day Trend</h2>
        <p>Assessments started: {dashboard?.seven_day_trend?.assessments_started}</p>
        <p>Assessments completed: {dashboard?.seven_day_trend?.assessments_completed}</p>
      </section>
    </main>
  );
}
