import { useParams, useSearchParams, Link } from 'react-router-dom';

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

  // Prefer the canonical domain label passed as a query param.
  // This ensures the workspace always shows "Process Integrity" etc.,
  // never an internal slug or placeholder identifier.
  const domainLabel = searchParams.get('domain_name') ?? domainId ?? '';

  const backPath = frameworkId
    ? `/assessment/framework?framework_id=${frameworkId}`
    : '/frameworks';

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

          <section
            className="domain-workspace__actions"
            aria-label="Domain next actions"
            data-testid="domain-workspace-actions"
          >
            <h2>Next Operational Actions</h2>
            <p className="domain-workspace__actions-intro">
              The following layers are the declared next operational steps for this domain:
            </p>
            <ul className="domain-workspace__action-list">
              <li className="domain-workspace__action-item">
                <strong>Compile MPSs</strong>
                <span className="domain-workspace__action-tag">Declared next operational layer</span>
              </li>
              <li className="domain-workspace__action-item">
                <strong>Compile intent statements</strong>
                <span className="domain-workspace__action-tag">Declared next operational layer</span>
              </li>
              <li className="domain-workspace__action-item">
                <strong>Compile criteria</strong>
                <span className="domain-workspace__action-tag">Declared next operational layer</span>
              </li>
            </ul>
          </section>

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
