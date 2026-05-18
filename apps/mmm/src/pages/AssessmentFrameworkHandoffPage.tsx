import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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

export default function AssessmentFrameworkHandoffPage() {
  const [searchParams] = useSearchParams();
  const frameworkId = searchParams.get('framework_id');

  const { data: framework, isLoading, isError } = useQuery({
    queryKey: ['framework-handoff', frameworkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mmm_frameworks')
        .select('*')
        .eq('id', frameworkId!)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!frameworkId,
  });

  const { data: domains } = useQuery({
    queryKey: ['framework-handoff-domains', frameworkId],
    queryFn: async () => {
      const { data } = await supabase
        .from('mmm_domains')
        .select('id, name, code, status')
        .eq('framework_id', frameworkId!)
        .order('code');
      return data ?? [];
    },
    enabled: !!frameworkId && !!framework,
  });

  if (!frameworkId) {
    return (
      <div className="app-shell">
        <AppNav />
        <main className="assessment-framework-handoff-page">
          <div className="container">
            <div
              className="alert alert-error"
              role="alert"
              data-testid="handoff-missing-framework-id"
            >
              No framework ID provided. Please navigate from the framework compile workflow.
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="app-shell">
        <AppNav />
        <main className="assessment-framework-handoff-page">
          <div className="container">
            <p className="handoff-loading" data-testid="handoff-loading">
              Loading framework workspace…
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !framework) {
    return (
      <div className="app-shell">
        <AppNav />
        <main className="assessment-framework-handoff-page">
          <div className="container">
            <div
              className="alert alert-error"
              role="alert"
              data-testid="handoff-framework-not-found"
            >
              Framework not found. The framework ID may be invalid or you may not have access.{' '}
              <Link to="/frameworks">View all frameworks</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppNav />
      <main className="assessment-framework-handoff-page" data-testid="handoff-workspace">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-header__title" data-testid="handoff-framework-name">
                {framework.name}
              </h1>
              <p className="page-header__subtitle">Framework Workspace</p>
            </div>
            <span
              className={`framework-item__badge framework-item__badge--${framework.status?.toLowerCase() ?? 'unknown'}`}
              data-testid="handoff-framework-status"
            >
              {framework.status ?? 'Unknown'}
            </span>
          </div>

          <section
            className="handoff-domains"
            aria-label="Framework domains"
            data-testid="handoff-domains"
          >
            <h2>Domains</h2>
            {domains && (domains as any[]).length > 0 ? (
              <ul className="handoff-domain-list">
                {(domains as any[]).map((d) => (
                  <li key={d.id} className="handoff-domain-item">
                    <span className="handoff-domain-item__code">{d.code}</span>
                    <span className="handoff-domain-item__name">{d.name}</span>
                    <span className="handoff-domain-item__status">{d.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="handoff-domains-empty">No domains configured yet.</p>
            )}
          </section>

          <div className="handoff-actions">
            <Link className="btn btn-outline" to="/frameworks" data-testid="handoff-back-link">
              Back to Frameworks
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
