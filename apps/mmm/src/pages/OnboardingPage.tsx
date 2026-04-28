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
    <main className="setup-page">
      <div className="container">
        <div className="setup-card">
          <h1 className="setup-card__title">Set Up Your Organisation</h1>
          <p className="setup-card__subtitle">
            Tell us about your organisation so we can personalise your maturity assessment.
          </p>
          <div className="form-group">
            <label htmlFor="org-name">Organisation name</label>
            <input
              id="org-name"
              className="form-control"
              placeholder="Acme Corporation"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="org-tier">Plan tier</label>
            <select
              id="org-tier"
              className="form-control"
              value={tier}
              onChange={e => setTier(e.target.value)}
            >
              <option value="STARTER">Starter</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>
          </div>
          <button className="btn btn-primary w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating…' : 'Continue'}
          </button>
        </div>
      </div>
    </main>
  );
}

