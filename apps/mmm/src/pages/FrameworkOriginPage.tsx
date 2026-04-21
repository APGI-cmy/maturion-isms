import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
export default function FrameworkOriginPage() {
  const [mode, setMode] = useState<'VERBATIM'|'GENERATED'|'HYBRID'>('GENERATED');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/frameworks/init', { method: 'POST', headers: {'Content-Type':'application/json','Authorization':`Bearer ${session?.access_token}`}, body: JSON.stringify({ name: 'My Framework', source_type: mode, origin_mode: mode }) });
      if (!res.ok) throw new Error('Failed to init framework');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frameworks'] }); // NBR-001: invalidate frameworks cache
      navigate('/frameworks');
    },
  });
  return (
    <main>
      <h1>How do you want to create your framework?</h1>
      {(['VERBATIM','GENERATED','HYBRID'] as const).map(opt => (
        <label key={opt}><input type="radio" name="origin" value={opt} checked={mode===opt} onChange={()=>setMode(opt)} />{opt}</label>
      ))}
      <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>Start</button>
    </main>
  );
}
