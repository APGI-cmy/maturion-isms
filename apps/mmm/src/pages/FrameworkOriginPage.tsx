import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const ORIGIN_OPTIONS: { value: 'VERBATIM' | 'GENERATED' | 'HYBRID'; label: string; description: string }[] = [
  {
    value: 'VERBATIM',
    label: 'VERBATIM',
    description: 'Use a standard framework exactly as defined, without modification.',
  },
  {
    value: 'GENERATED',
    label: 'GENERATED',
    description: 'Let Maturion AI generate a tailored framework based on your organisation profile.',
  },
  {
    value: 'HYBRID',
    label: 'HYBRID',
    description: 'Start with a standard framework and customise it to suit your specific needs.',
  },
];

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
    <main className="setup-page">
      <div className="container">
        <div className="setup-card">
          <h1 className="setup-card__title">How do you want to create your framework?</h1>
          <p className="setup-card__subtitle">
            Choose the approach that best matches your organisation&rsquo;s needs.
          </p>
          <div className="origin-options">
            {ORIGIN_OPTIONS.map(opt => (
              <label key={opt.value} className="origin-option">
                <input
                  type="radio"
                  name="origin"
                  value={opt.value}
                  checked={mode === opt.value}
                  onChange={() => setMode(opt.value)}
                />
                <div>
                  <span className="origin-option__label">{opt.label}</span>
                  <span className="origin-option__desc">{opt.description}</span>
                </div>
              </label>
            ))}
          </div>
          <button className="btn btn-primary w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Starting…' : 'Start'}
          </button>
        </div>
      </div>
    </main>
  );
}

