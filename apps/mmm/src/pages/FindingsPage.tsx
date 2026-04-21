import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
export default function FindingsPage() {
  const { data: findings } = useQuery({
    queryKey: ['findings'],
    queryFn: async () => {
      const { data } = await supabase.from('mmm_findings').select('*, mmm_criteria(name, code)').order('maturity_position');
      return data ?? [];
    },
  });
  return (
    <main>
      <h1>Findings</h1>
      {findings?.map((f: any) => (
        <div key={f.id}>
          <strong>{f.mmm_criteria?.name}</strong> — Level {f.maturity_position} (Gap: {f.gap_to_next})
          <p>{f.finding_text}</p>
        </div>
      ))}
      <Link to="/reports/new">Generate Report</Link>
      <Link to="/pit-export/new">Export to PIT</Link>
    </main>
  );
}
