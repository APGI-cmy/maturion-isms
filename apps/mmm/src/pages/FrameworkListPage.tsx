import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

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

export default function FrameworkListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['frameworks'],
    queryFn: async () => {
      const { data } = await supabase.from('mmm_frameworks').select('*');
      return data ?? [];
    },
  });

  return (
    <div className="app-shell">
      <AppNav />
      <main className="frameworks-page">
        <div className="container">
          <div className="page-header frameworks-page__header">
            <div>
              <h1 className="page-header__title">Frameworks</h1>
              <p className="page-header__subtitle">
                Create, upload, and manage maturity frameworks used for assessments.
              </p>
            </div>
            <Link className="btn btn-primary" to="/frameworks/upload">Upload Framework Source</Link>
          </div>

          {isLoading ? (
            <p className="frameworks-loading">Loading frameworks…</p>
          ) : data && data.length > 0 ? (
            <section className="frameworks-list" aria-label="Framework list">
              {data.map((f: any) => (
                <div key={f.id} className="framework-item">
                  <strong className="framework-item__name">{f.name}</strong>
                  <span className={`framework-item__badge framework-item__badge--${f.status?.toLowerCase() ?? 'unknown'}`}>
                    {f.status ?? 'Unknown'}
                  </span>
                </div>
              ))}
            </section>
          ) : (
            <div className="frameworks-empty-state">
              <div className="frameworks-empty-state__icon" aria-hidden="true">📋</div>
              <h2 className="frameworks-empty-state__title">No frameworks yet</h2>
              <p className="frameworks-empty-state__body">
                Upload a source document or generate a framework to get started.
                Frameworks define the maturity domains and criteria used in assessments.
              </p>
              <Link className="btn btn-primary" to="/frameworks/upload">Upload Framework Source</Link>
            </div>
          )}

          <aside className="frameworks-info-panel">
            <h3 className="frameworks-info-panel__title">What is a framework?</h3>
            <p className="frameworks-info-panel__body">
              A maturity framework defines the domains, practices, and criteria used to assess your
              organisation's capabilities. You can upload an existing standards document or use AI
              to generate a new framework tailored to your context.
            </p>
            <div className="frameworks-info-panel__stats">
              <span className="frameworks-info-badge">
                <span className="frameworks-info-badge__label">Draft</span>
                <span className="frameworks-info-badge__value">
                  {data ? data.filter((f: any) => f.status === 'DRAFT').length : '—'}
                </span>
              </span>
              <span className="frameworks-info-badge">
                <span className="frameworks-info-badge__label">Published</span>
                <span className="frameworks-info-badge__value">
                  {data ? data.filter((f: any) => f.status === 'PUBLISHED').length : '—'}
                </span>
              </span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
