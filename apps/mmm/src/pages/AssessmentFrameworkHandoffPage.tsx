import { useSearchParams, Link } from 'react-router-dom';
import { useFrameworkHandoffContext } from '@/lib/useFrameworkHandoffContext';

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

  const { framework, isLoading, isError, domains, domainsLoading, domainsError } =
    useFrameworkHandoffContext(frameworkId);

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
              <p>No framework ID provided. Please navigate from the framework compile workflow.</p>
              <Link to="/frameworks">Back to Frameworks</Link>
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
              className={`handoff-framework-badge handoff-framework-badge--${framework.status?.toLowerCase() ?? 'unknown'}`}
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
            {domainsLoading ? (
              <p className="handoff-domains-loading">Loading domains…</p>
            ) : domainsError ? (
              <p className="handoff-domains-error">Could not load domains.</p>
            ) : domains && domains.length > 0 ? (
              <ul className="handoff-domain-list">
                {domains.map((d) => (
                  <li key={d.id} className="handoff-domain-item">
                    <span className="handoff-domain-item__code">{d.code}</span>
                    <span className="handoff-domain-item__name">{d.name}</span>
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
