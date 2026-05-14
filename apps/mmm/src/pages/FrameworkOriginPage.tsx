import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase, getEdgeInvokeHeaders } from '@/lib/supabase';

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
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Guard: redirect to /onboarding if the user has not completed the wizard (maturion-isms#13)
  useEffect(() => {
    let cancelled = false;
    async function checkOnboarding() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) { navigate('/login', { replace: true }); return; }
        const { data: profile } = await supabase
          .from('mmm_profiles')
          .select('organisation_id')
          .eq('id', session.user.id)
          .maybeSingle();
        if (!profile?.organisation_id) { navigate('/onboarding', { replace: true }); return; }
        const { data: org } = await supabase
          .from('mmm_organisations')
          .select('onboarding_complete')
          .eq('id', profile.organisation_id)
          .maybeSingle();
        if (!cancelled) {
          if (!org?.onboarding_complete) {
            navigate('/onboarding', { replace: true });
          } else {
            setOnboardingChecked(true);
          }
        }
      } catch (err) {
        // On error, allow access (degraded mode) rather than blocking indefinitely
        console.error('[FrameworkOriginPage] onboarding check failed — allowing access in degraded mode:', err);
        if (!cancelled) setOnboardingChecked(true);
      }
    }
    checkOnboarding();
    return () => { cancelled = true; };
  }, [navigate]);
  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('mmm-framework-init', {
        headers: await getEdgeInvokeHeaders(),
        body: { name: 'My Framework', source_type: mode, origin_mode: mode },
      });
      if (error) throw new Error(error.message || 'Failed to init framework');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frameworks'] }); // NBR-001: invalidate frameworks cache
      navigate('/frameworks');
    },
  });
  if (!onboardingChecked) return <div className="setup-page"><div className="container">Loading…</div></div>;
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
          {mutation.isError ? (
            <p role="alert" className="text-sm text-red-600">
              We couldn&apos;t start your framework. Please try again.
            </p>
          ) : null}
          <button className="btn btn-primary w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Starting…' : 'Start'}
          </button>
        </div>
      </div>
    </main>
  );
}
