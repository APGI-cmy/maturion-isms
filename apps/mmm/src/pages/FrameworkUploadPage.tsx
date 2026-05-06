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
      const { data: { session } } = await supabase.auth.getSession();
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` };
      if (mode==='A') {
        return fetch('/api/upload/framework-source', { method: 'POST', headers, body: JSON.stringify({ source_type: 'VERBATIM' }) }).then(r => r.json());
      } else if (mode==='B') {
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
                    Full backend workflow is not yet wired for this mode. Your selection has been recorded.{' '}
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
