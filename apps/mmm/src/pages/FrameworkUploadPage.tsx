import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
export default function FrameworkUploadPage() {
  const [mode, setMode] = useState<'A'|'B'|'C'>('B');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` };
      if (mode === 'A') {
        return fetch('/api/upload/framework-source', { method: 'POST', headers, body: JSON.stringify({ source_type: 'VERBATIM' }) }).then(r => r.json());
      } else if (mode === 'B') {
        return fetch('/api/ai/framework-generate', { method: 'POST', headers, body: JSON.stringify({ name: 'New Framework' }) }).then(r => r.json());
      } else {
        return fetch('/api/ai/framework-generate', { method: 'POST', headers, body: JSON.stringify({ name: 'Hybrid Framework', hybrid: true }) }).then(r => r.json());
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frameworks'] }); // NBR-001
      navigate('/frameworks');
    },
  });
  return (
    <main>
      <h1>Framework Source</h1>
      <div>
        <label><input type="radio" checked={mode==='A'} onChange={()=>setMode('A')} />Mode A: Upload existing document</label>
        <label><input type="radio" checked={mode==='B'} onChange={()=>setMode('B')} />Mode B: AI Generate new framework</label>
        <label><input type="radio" checked={mode==='C'} onChange={()=>setMode('C')} />Mode C: Hybrid</label>
      </div>
      <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>Start</button>
    </main>
  );
}
