import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const ORIGIN_OPTIONS: { value: 'VERBATIM' | 'GENERATED' | 'HYBRID'; label: string; description: string }[] = [
  {
    value: 'VERBATIM',
    label: 'Verbatim',
    description: 'Use your existing criteria as-is and preserve the original wording.',
  },
  {
    value: 'GENERATED',
    label: 'New Generation',
    description: 'Generate brand-new criteria from your onboarding context.',
  },
  {
    value: 'HYBRID',
    label: 'Hybrid',
    description: 'Blend existing criteria with AI-generated enhancements.',
  },
];

function toUploadMode(mode: 'VERBATIM' | 'GENERATED' | 'HYBRID'): 'A' | 'B' | 'C' {
  if (mode === 'VERBATIM') return 'A';
  if (mode === 'GENERATED') return 'B';
  return 'C';
}

export default function FrameworkOriginPage() {
  const [mode, setMode] = useState<'VERBATIM'|'GENERATED'|'HYBRID'>('GENERATED');
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (selectedMode: 'VERBATIM' | 'GENERATED' | 'HYBRID') => {
      const { data, error } = await supabase.functions.invoke('mmm-framework-init', {
        body: {
          source_type: selectedMode,
        },
      });
      if (error) {
        throw new Error(error.message || 'Unable to initialise framework mode.');
      }
      return data as { framework_id?: string } | null;
    },
    onSuccess: (data) => {
      const uploadMode = toUploadMode(mode);
      const frameworkId = data?.framework_id;
      const suffix = frameworkId ? `&framework_id=${encodeURIComponent(frameworkId)}` : '';
      navigate(`/frameworks/upload?mode=${uploadMode}${suffix}`);
    },
  });

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
        // Fail closed if onboarding status cannot be verified
        console.error('[FrameworkOriginPage] onboarding check failed — redirecting to onboarding:', err);
        if (!cancelled) {
          navigate('/onboarding', { replace: true });
        }
      }
    }
    checkOnboarding();
    return () => { cancelled = true; };
  }, [navigate]);

  function handleContinue() {
    mutation.mutate(mode);
  }

  if (!onboardingChecked) return <div className="setup-page"><div className="container">Loading…</div></div>;

  return (
    <main className="setup-page">
      <div className="container">
        <div className="setup-card">
          <h1 className="setup-card__title">How should Maturion build your criteria?</h1>
          <p className="setup-card__subtitle">
            Choose your development mode, then continue into the domain build workflow.
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

          <p className="wizard-step__hint wizard-step__hint--info">
            Next step: you&apos;ll generate or upload framework content, then move directly into the domain workspace.
          </p>
          {mutation.isError ? (
            <p role="alert" className="wizard-step__hint wizard-step__hint--error">
              We could not initialise the selected framework mode. Please try again.
            </p>
          ) : null}
          <button className="btn btn-primary w-full" onClick={handleContinue}>
            {mutation.isPending ? 'Preparing...' : 'Continue'}
          </button>
        </div>
      </div>
    </main>
  );
}
