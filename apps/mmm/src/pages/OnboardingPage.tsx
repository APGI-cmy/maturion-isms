import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
export default function OnboardingPage() {
  const [name, setName] = useState(''); const [tier, setTier] = useState('STARTER');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/organisations', { method: 'POST', headers: {'Content-Type':'application/json','Authorization':`Bearer ${session?.access_token}`}, body: JSON.stringify({ name, tier }) });
      if (!res.ok) throw new Error('Failed to create org');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisations'] }); // NBR-001: invalidate org cache
      navigate('/framework-origin');
    },
  });
  return (
    <main>
      <h1>Set Up Your Organisation</h1>
      <input placeholder="Organisation name" value={name} onChange={e=>setName(e.target.value)} />
      <select value={tier} onChange={e=>setTier(e.target.value)}>
        <option value="STARTER">Starter</option><option value="PROFESSIONAL">Professional</option><option value="ENTERPRISE">Enterprise</option>
      </select>
      <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>Continue</button>
    </main>
  );
}
