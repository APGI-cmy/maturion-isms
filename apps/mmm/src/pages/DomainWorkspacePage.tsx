import { useParams, useSearchParams, Link } from 'react-router-dom';
import { DomainAuditBuilder } from '../components/assessment/DomainAuditBuilder';

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

export default function DomainWorkspacePage() {
  const { domainId } = useParams<{ domainId: string }>();
  const [searchParams] = useSearchParams();
  const frameworkId = searchParams.get('framework_id');
  const sourceDomainId = searchParams.get('source_domain_id');

  // Prefer the canonical domain label passed as a query param.
  // This ensures the workspace always shows "Process Integrity" etc.,
  // never an internal slug or placeholder identifier.
  const domainLabel = searchParams.get('domain_name') ?? domainId ?? '';

  const backPath = frameworkId
    ? `/assessment/framework?framework_id=${frameworkId}`
    : '/frameworks';

  if (!domainId) {
    return (
      <div className="app-shell">
        <AppNav />
        <main className="domain-workspace-page" data-testid="domain-workspace">
          <div className="container">
            <div
              className="alert alert-error"
              role="alert"
              data-testid="domain-workspace-missing-domain-id"
            >
              No domain ID provided. Please re-open the domain workspace from the framework handoff page.
            </div>
            <div className="domain-workspace__navigation">
              <Link className="btn btn-outline" to={backPath}>
                Back to Framework Workspace
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppNav />
      <main className="domain-workspace-page" data-testid="domain-workspace">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-header__title" data-testid="domain-workspace-title">
                {domainLabel || 'Domain Workspace'}
              </h1>
              <p className="page-header__subtitle">Configure this domain's content</p>
            </div>
          </div>

          {/*
            Domain workflow layers (legacy action labels preserved for traceability):
            Compile MPSs | Compile intent statements | Compile criteria
          */}
          {/* Delegate to current-app DomainAuditBuilder adaptation (legacy workflow) */}
          <DomainAuditBuilder
            domainId={domainId}
            frameworkId={frameworkId}
            domainName={domainLabel}
            sourceDomainId={sourceDomainId}
          />

          <div className="domain-workspace__navigation">
            <Link className="btn btn-outline" to={backPath}>
              Back to Framework Workspace
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
