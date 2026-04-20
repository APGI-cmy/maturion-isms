import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
export default function AssessmentWorkbenchPage() {
  const { id: assessmentId } = useParams<{ id: string }>();
  const { data: criteria } = useQuery({
    queryKey: ['assessment-criteria', assessmentId],
    queryFn: async () => {
      const { data } = await supabase.from('mmm_criteria').select('*, mmm_maturity_process_steps(name, mmm_domains(name))').limit(50);
      return data ?? [];
    },
  });
  const { data: scores } = useQuery({
    queryKey: ['scores', assessmentId],
    queryFn: async () => {
      const { data } = await supabase.from('mmm_maturity_scores').select('*').eq('assessment_id', assessmentId!);
      return data ?? [];
    },
  });
  return (
    <main>
      <h1>Assessment Workbench</h1>
      {criteria?.map((c: any) => (
        <div key={c.id}>
          <strong>{c.name}</strong>
          <Link to={`/assessments/${assessmentId}/evidence/${c.id}`}>Add Evidence</Link>
        </div>
      ))}
    </main>
  );
}
