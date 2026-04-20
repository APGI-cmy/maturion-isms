import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useFreeAssessmentStore } from '@/store/freeAssessmentStore';
const DOMAINS = ['Governance','Risk Management','Compliance','Technology','People'];
type Response = 'YES' | 'NO' | 'PARTIAL';
export default function FreeAssessmentPage() {
  const navigate = useNavigate();
  const setResult = useFreeAssessmentStore((s) => s.setResult);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const mutation = useMutation({
    mutationFn: async () => {
      const domain_responses = DOMAINS.map(d => ({ domain_name: d, response: responses[d] ?? 'NO' }));
      const res = await fetch('/api/assessment/free/respond', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ domain_responses }) });
      if (!res.ok) throw new Error('Submission failed');
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data.session_token, data.baseline_result.baseline_maturity);
      navigate('/free-assessment/result');
    },
  });
  return (
    <main>
      <h1>Free Maturity Assessment</h1>
      {DOMAINS.map(d => (
        <div key={d}>
          <label>{d}</label>
          {(['YES','PARTIAL','NO'] as Response[]).map(r => (
            <label key={r}><input type="radio" name={d} value={r} onChange={() => setResponses(prev => ({...prev,[d]:r}))} />{r}</label>
          ))}
        </div>
      ))}
      <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>Submit</button>
    </main>
  );
}
