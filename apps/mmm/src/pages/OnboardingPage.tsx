import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase, getEdgeInvokeHeaders } from '@/lib/supabase';
export default function OnboardingPage() {
  const [name, setName] = useState(''); const [tier, setTier] = useState('STARTER');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('mmm-org-create', {
        headers: await getEdgeInvokeHeaders(),
        body: { name, tier },
      });
      if (error) throw new Error(error.message || 'Failed to create org');
      return data;
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
          {mutation.isError ? (
            <p role="alert" className="text-sm text-red-600">
              We couldn&apos;t create your organisation. Please review your details and try again.
            </p>
          ) : null}
          <button className="btn btn-primary w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating…' : 'Continue'}
          </button>
        </div>
      </div>
    </main>
  );
}
