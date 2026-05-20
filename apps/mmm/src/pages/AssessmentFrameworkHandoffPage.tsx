import { useSearchParams, Link } from 'react-router-dom';
import { useFrameworkHandoffContext, FrameworkHandoffDomain } from '@/lib/useFrameworkHandoffContext';

const CANONICAL_DOMAIN_NAMES: string[] = [
  'Leadership and Governance',
  'Process Integrity',
  'People and Culture',
  'Protection',
  'Proof It Works',
];

/**
 * Converts a canonical domain name to a URL-safe slug.
 * e.g. "Process Integrity" → "process-integrity"
 * This slug is used as the route key so the URL remains stable and
 * human-readable regardless of whether a DB domain record exists.
 */
function canonicalNameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

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

interface DomainCardProps {
  canonicalName: string;
  domain: FrameworkHandoffDomain | undefined;
  index: number;
  frameworkId: string;
}

function DomainCard({ canonicalName, domain, index, frameworkId }: DomainCardProps) {
  // Route by canonical slug so the URL is always stable and human-readable.
  // The actual DB domain ID (if present) is passed as source_domain_id for
  // future backend use, but it is never used as the primary route key.
  const domainSlug = canonicalNameToSlug(canonicalName);
  const sourceDomainParam = domain?.id ? `&source_domain_id=${encodeURIComponent(domain.id)}` : '';
  const domainPath =
    `/assessment/framework/domain/${domainSlug}` +
    `?framework_id=${encodeURIComponent(frameworkId)}` +
    `&domain_name=${encodeURIComponent(canonicalName)}` +
    sourceDomainParam;

  return (
    <div
      className="domain-card"
      data-testid="domain-card"
      data-index={index}
    >
      <div className="domain-card__header">
        <h3 className="domain-card__title">{canonicalName}</h3>
        {domain ? (
          <span className="domain-card__code">{domain.code}</span>
        ) : (
          <span className="domain-card__placeholder-badge">Pending</span>
        )}
      </div>

      <div className="domain-card__mini-dashboard">
        <div className="domain-card__stat">
          <span className="domain-card__stat-label">MPS Count</span>
          <span className="domain-card__stat-value" data-testid="domain-mps-count">—</span>
        </div>
        <div className="domain-card__stat">
          <span className="domain-card__stat-label">Criteria Count</span>
          <span className="domain-card__stat-value" data-testid="domain-criteria-count">—</span>
        </div>
        <div className="domain-card__stat">
          <span className="domain-card__stat-label">Maturity Level</span>
          <span className="domain-card__stat-value" data-testid="domain-maturity-level">—</span>
        </div>
        <div className="domain-card__stat">
          <span className="domain-card__stat-label">Evidence Upload</span>
          <span className="domain-card__stat-value" data-testid="domain-evidence-completion">—</span>
        </div>
        <div className="domain-card__stat">
          <span className="domain-card__stat-label">Approval Status</span>
          <span className="domain-card__stat-value" data-testid="domain-approval-status">—</span>
        </div>
        <div className="domain-card__stat">
          <span className="domain-card__stat-label">Compile Status</span>
          <span className="domain-card__stat-value" data-testid="domain-compile-status">—</span>
        </div>
      </div>

      <div className="domain-card__footer">
        <Link className="domain-card__cta btn btn-primary" to={domainPath}>
          Open Domain Workspace
        </Link>
      </div>
    </div>
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

  // Build canonical slot array: 5 slots backed by DB domains sorted by sort_order
  const sortedDomains = domains ? domains.slice().sort((a, b) => a.sort_order - b.sort_order) : [];
  const canonicalSlots = CANONICAL_DOMAIN_NAMES.map((name, i) => ({
    canonicalName: name,
    domain: sortedDomains[i] as FrameworkHandoffDomain | undefined,
    index: i + 1,
  }));

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
            ) : (
              <div className="handoff-domain-cards">
                {canonicalSlots.map((slot) => (
                  <DomainCard
                    key={slot.index}
                    canonicalName={slot.canonicalName}
                    domain={slot.domain}
                    index={slot.index}
                    frameworkId={frameworkId}
                  />
                ))}
              </div>
            )}
          </section>

          <div className="handoff-actions">
            <Link
              className="btn btn-outline"
              to={`/frameworks/${frameworkId}/review`}
              data-testid="handoff-back-link"
            >
              Back to Review Framework
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
