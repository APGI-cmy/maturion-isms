import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

function AppNav() {
  return (
    <header className="app-shell__header">
      <div className="container">
        <nav className="app-nav" aria-label="Main navigation">
          <span className="app-nav__logo">Maturion <span>MMM</span></span>
          <Link className="app-nav__link" to="/dashboard">Dashboard</Link>
          <Link className="app-nav__link" to="/frameworks">Frameworks</Link>
          <Link className="app-nav__link" to="/frameworks/upload">Upload</Link>
          <Link className="app-nav__link" to="/onboarding">Onboarding</Link>
        </nav>
      </div>
    </header>
  );
}

const MODES = [
  {
    id: 'A' as const,
    title: 'Mode A — Upload existing document',
    description:
      'Upload a PDF, Word, or text document of an existing standards framework. The system will parse and structure it for assessment use.',
    icon: '📄',
  },
  {
    id: 'B' as const,
    title: 'Mode B — AI generate new framework',
    description:
      'Describe the framework you need and let AI generate a structured maturity model with domains and criteria automatically.',
    icon: '🤖',
  },
  {
    id: 'C' as const,
    title: 'Mode C — Hybrid',
    description:
      'Upload a source document and use AI to extend, refine, or restructure it into a custom maturity framework.',
    icon: '🔀',
  },
];

export default function FrameworkUploadPage() {
  const [mode, setMode] = useState<'A'|'B'|'C'>('B');
  const [started, setStarted] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async () => {
      const initFramework = async (name: string, sourceType: 'GENERATED' | 'HYBRID') => {
        const { data, error } = await supabase.functions.invoke('mmm-framework-init', {
          body: { name, source_type: sourceType },
        });
        if (error) throw new Error(error.message || 'Failed to init framework');
        const frameworkId = data?.framework?.id;
        if (!frameworkId) throw new Error('Failed to resolve framework id');
        return frameworkId as string;
      };

      if (mode==='A') {
        const { data, error } = await supabase.functions.invoke('mmm-upload-framework-source', {
          body: { source_type: 'VERBATIM', mode },
        });
        if (error) throw new Error(error.message || 'Failed to upload framework source');
        return data;
      } else if (mode==='B') {
        const frameworkId = await initFramework('New Framework', 'GENERATED');
        const { data, error } = await supabase.functions.invoke('mmm-ai-framework-generate', {
          body: { name: 'New Framework', mode, framework_id: frameworkId },
        });
        if (error) throw new Error(error.message || 'Failed to generate framework');
        return data;
      } else if (mode==='C') {
        const frameworkId = await initFramework('Hybrid Framework', 'HYBRID');
        const { data, error } = await supabase.functions.invoke('mmm-ai-framework-generate', {
          body: { name: 'Hybrid Framework', hybrid: true, mode, framework_id: frameworkId },
        });
        if (error) throw new Error(error.message || 'Failed to generate hybrid framework');
        return data;
      }
      throw new Error(`Unsupported framework mode: ${mode}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frameworks'] }); // NBR-001
      navigate('/frameworks');
    },
  });

  const selectedMode = MODES.find(m => m.id === mode)!;

  const handleStart = () => {
    setStarted(true);
    mutation.mutate();
  };

  return (
    <div className="app-shell">
      <AppNav />
      <main className="upload-page">
        <div className="container">
          <div className="upload-page__back">
            <Link className="upload-page__back-link" to="/frameworks">← Back to Frameworks</Link>
          </div>

          <div className="page-header">
            <h1 className="page-header__title">Upload Framework Source</h1>
            <p className="page-header__subtitle">
              Choose how you want to create your maturity framework. Select a mode below and press Start.
            </p>
          </div>

          <div className="upload-page__modes" role="radiogroup" aria-label="Framework creation mode">
            {MODES.map((m) => (
              <label
                key={m.id}
                className={`mode-card${mode === m.id ? ' mode-card--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="framework-mode"
                  value={m.id}
                  checked={mode === m.id}
                  onChange={() => setMode(m.id)}
                  className="sr-only"
                />
                <span className="mode-card__icon" aria-hidden="true">{m.icon}</span>
                <span className="mode-card__content">
                  <span className="mode-card__title">{m.title}</span>
                  <span className="mode-card__desc">{m.description}</span>
                </span>
                {mode === m.id && (
                  <span className="mode-card__check" aria-hidden="true">✓</span>
                )}
              </label>
            ))}
          </div>

          <div className="upload-page__actions">
            <button
              className="btn btn-primary"
              onClick={handleStart}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Starting…' : 'Start'}
            </button>
          </div>

          {started && (
            <div className="upload-page__next-state" role="status" aria-live="polite">
              {mutation.isPending && (
                <p className="upload-page__next-state-text">
                  ⏳ Creating framework — please wait…
                </p>
              )}
              {mutation.isError && (
                <div className="upload-page__next-state-panel">
                  <p className="upload-page__next-state-label">Mode selected: {selectedMode.title}</p>
                  <p className="upload-page__next-state-text">
                    Next step: {selectedMode.description}
                  </p>
                  <p className="upload-page__next-state-note">
                    We couldn&rsquo;t complete this framework action right now. Please try again or{' '}
                    <Link to="/frameworks">Return to Frameworks</Link>.
                  </p>
                </div>
              )}
              {mutation.isSuccess && (
                <p className="upload-page__next-state-text upload-page__next-state-text--success">
                  ✅ Framework created. Redirecting…
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
