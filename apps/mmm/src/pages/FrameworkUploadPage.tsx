import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { supabase, getEdgeInvokeHeaders } from '@/lib/supabase';

function AppNav() {
  return (
    <header className="app-shell__header">
      <div className="container">
        <nav className="app-nav" aria-label="Main navigation">
          <span className="app-nav__logo">Maturion <span>MMM</span></span>
          <Link className="app-nav__link" to="/dashboard">Dashboard</Link>
          <Link className="app-nav__link" to="/frameworks">Frameworks</Link>
          <Link className="app-nav__link" to="/dmc">DMC</Link>
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
      'Upload a source document for AI-assisted hybrid framework generation. The system will parse your document and use AI to extend or restructure it into a custom maturity framework.',
    icon: '🔀',
  },
];

function resolveModeFromQuery(modeParam: string | null): 'A' | 'B' | 'C' {
  const normalized = (modeParam ?? '').trim().toUpperCase();
  if (normalized === 'A' || normalized === 'VERBATIM') return 'A';
  if (normalized === 'C' || normalized === 'HYBRID') return 'C';
  return 'B';
}

export default function FrameworkUploadPage() {
  const [searchParams] = useSearchParams();
  const requestedMode = resolveModeFromQuery(searchParams.get('mode'));
  const [mode, setMode] = useState<'A'|'B'|'C'>(requestedMode);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [started, setStarted] = useState(false);
  const [modeAValidationError, setModeAValidationError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    setMode(requestedMode);
  }, [requestedMode]);

  const mutation = useMutation({
    mutationFn: async () => {
      const initFramework = async (name: string, sourceType: 'GENERATED' | 'HYBRID' | 'VERBATIM') => {
        const { data, error } = await supabase.functions.invoke('mmm-framework-init', {
          headers: await getEdgeInvokeHeaders(),
          body: { name, source_type: sourceType },
        });
        if (error) throw new Error(error.message || `Failed to init framework for ${name}`);
        const frameworkId = data?.framework?.id;
        if (!frameworkId) throw new Error(`Framework init returned no id for ${name}`);
        return frameworkId as string;
      };

      if (mode==='A') {
        if (!sourceFile) throw new Error('Please select a source file before starting Mode A.');
        const frameworkId = await initFramework('Uploaded Framework', 'VERBATIM');
        const formData = new FormData();
        formData.append('file', sourceFile);
        formData.append('source_type', 'VERBATIM');
        formData.append('mode', mode);
        formData.append('metadata', JSON.stringify({ source_type: 'VERBATIM', mode, framework_id: frameworkId }));

        const { data, error } = await supabase.functions.invoke('mmm-upload-framework-source', {
          headers: await getEdgeInvokeHeaders(),
          body: formData,
        });
        if (error) throw new Error(error.message || 'Failed to upload framework source');
        return { frameworkId, responseData: data };
      } else if (mode==='B') {
        const frameworkId = await initFramework('New Framework', 'GENERATED');
        const { data, error } = await supabase.functions.invoke('mmm-ai-framework-generate', {
          headers: await getEdgeInvokeHeaders(),
          body: { name: 'New Framework', mode, framework_id: frameworkId },
        });
        if (error) throw new Error(error.message || 'Failed to generate framework');
        return { frameworkId, responseData: data };
      } else if (mode==='C') {
        if (!sourceFile) throw new Error('Please select a source file before starting Mode C.');
        const frameworkId = await initFramework('Hybrid Framework', 'HYBRID');
        const formData = new FormData();
        formData.append('file', sourceFile);
        formData.append('source_type', 'HYBRID');
        formData.append('mode', mode);
        formData.append('metadata', JSON.stringify({ source_type: 'HYBRID', mode, framework_id: frameworkId }));

        const { data, error } = await supabase.functions.invoke('mmm-upload-framework-source', {
          headers: await getEdgeInvokeHeaders(),
          body: formData,
        });
        if (error) throw new Error(error.message || 'Failed to upload hybrid framework source');
        return { frameworkId, responseData: data };
      }
      throw new Error(`Unsupported framework mode: ${mode}`);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['frameworks'] }); // NBR-001
      const fwId = result?.frameworkId;
      // All modes navigate to the review page:
      // Mode A/C: polls parse job until proposed domains are ready, then enables Compile
      // Mode B: proposed domains are created synchronously by mmm-ai-framework-generate, Compile is available immediately
      if (fwId) {
        navigate(`/frameworks/${fwId}/review`);
      } else {
        navigate('/frameworks');
      }
    },
  });

  const selectedMode = MODES.find(m => m.id === mode)!;

  const handleStart = () => {
    setModeAValidationError(null);
    if ((mode === 'A' || mode === 'C') && !sourceFile) {
      setStarted(true);
      setModeAValidationError(`Please select a framework source file to continue with ${mode === 'C' ? 'Mode C' : 'Mode A'}.`);
      return;
    }
    setStarted(true);
    mutation.mutate();
  };

  return (
    <div className="app-shell">
      <AppNav />
      <main className="upload-page">
        <div className="container">
          <div className="upload-page__back">
            <Link className="upload-page__back-link" to="/framework-origin">← Back to Criteria Mode</Link>
          </div>

          <div className="page-header">
            <h1 className="page-header__title">Upload Framework Source</h1>
            <p className="page-header__subtitle">
              Step 2 of 3: choose your build route, then start generation to continue into the domain workspace.
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
            {(mode === 'A' || mode === 'C') && (
              <div className="upload-page__file-input">
                <label htmlFor="framework-source-file" className="upload-page__next-state-label">
                  Framework source file
                </label>
                <input
                  id="framework-source-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={(e) => setSourceFile(e.target.files?.[0] ?? null)}
                />
              </div>
            )}
            <button
              className="btn btn-primary"
              onClick={handleStart}
              disabled={mutation.isPending || ((mode === 'A' || mode === 'C') && !sourceFile)}
            >
              {mutation.isPending ? 'Starting…' : 'Start'}
            </button>
          </div>

          {started && (
            <div className="upload-page__next-state" role="status" aria-live="polite">
              {modeAValidationError && (
                <div className="upload-page__next-state-panel">
                  <p className="upload-page__next-state-label">Mode selected: {selectedMode.title}</p>
                  <p className="upload-page__next-state-note">{modeAValidationError}</p>
                </div>
              )}
              {mutation.isPending && (
                <p className="upload-page__next-state-text">
                  {(mode === 'A' || mode === 'C')
                    ? '⏳ Initializing framework and uploading source document — please wait…'
                    : '⏳ Creating framework — please wait…'}
                </p>
              )}
              {mutation.isError && (
                <div className="upload-page__next-state-panel">
                  <p className="upload-page__next-state-label">Mode selected: {selectedMode.title}</p>
                  <p className="upload-page__next-state-text">
                    Next step: {selectedMode.description}
                  </p>
                  <p className="upload-page__next-state-note">
                    {(mode === 'A' || mode === 'C')
                      ? `We couldn\u2019t initialize or upload your ${mode === 'C' ? 'Mode C' : 'Mode A'} framework source right now.`
                      : 'We couldn\u2019t complete this framework action right now.'}{' '}
                    {(mutation.error as Error | null)?.message ? `${(mutation.error as Error).message} ` : ''}
                    Please try again or{' '}
                    <Link to="/frameworks">Return to Frameworks</Link>.
                  </p>
                </div>
              )}
              {mutation.isSuccess && (
                <p className="upload-page__next-state-text upload-page__next-state-text--success">
                  {(mode === 'A' || mode === 'C')
                    ? `✅ ${mode === 'C' ? 'Mode C' : 'Mode A'} framework initialized and source uploaded. Redirecting to review…`
                    : '✅ Framework created. Redirecting to review…'}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
