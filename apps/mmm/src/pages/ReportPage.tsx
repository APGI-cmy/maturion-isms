import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
export default function ReportPage() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const { data: scores } = useQuery({
    queryKey: ['report-scores', assessmentId],
    queryFn: async () => {
      const { data } = await supabase.from('mmm_maturity_scores').select('*, mmm_domains:entity_id(name)').eq('assessment_id', assessmentId!).eq('entity_type', 'DOMAIN');
      return data ?? [];
    },
  });
  return (
    <main>
      <h1>Maturity Report</h1>
      <section><h2>Domain Scores</h2>
        {scores?.map((s: any) => <div key={s.id}>{s.score?.toFixed(1)} / 5.0</div>)}
      </section>
      <section><h2>Recommendations</h2><p>AI recommendations pending.</p></section>
      <button onClick={() => window.print()}>Export PDF</button>
    </main>
  );
}
