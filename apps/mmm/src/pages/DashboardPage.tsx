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
          <Link className="app-nav__link" to="/frameworks/upload">Upload</Link>
          <Link className="app-nav__link" to="/onboarding">Onboarding</Link>
        </nav>
      </div>
    </header>
  );
}

export default function DashboardPage() {
  const { data: dashboard, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/qiw/status', { headers: { 'Authorization': `Bearer ${session?.access_token}` } });
      if (res.status === 403) {
        const err = new Error('Permission denied') as Error & { status: number };
        err.status = 403;
        throw err;
      }
      if (!res.ok) {
        const err = new Error('Failed to load dashboard') as Error & { status: number };
        err.status = res.status;
        throw err;
      }
      return res.json();
    },
    staleTime: 30_000, // TR-005: cache for dashboard render performance
  });

  if (isLoading) {
    return (
      <div className="app-shell">
        <AppNav />
        <main className="dashboard-page">
          <div className="container">
            <p className="dashboard-loading">Loading dashboard…</p>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    const isPermissionError = (error as any)?.status === 403;
    return (
      <div className="app-shell">
        <AppNav />
        <main className="dashboard-page">
          <div className="container">
            <div className="page-header">
              <h1 className="page-header__title">Maturity Dashboard</h1>
            </div>
            {isPermissionError ? (
              <div className="alert alert-error" role="alert" data-testid="dashboard-permission-error">
                Your account does not have the required role (ADMIN or LEAD_AUDITOR) to view dashboard
                data. Contact your organisation administrator to request access.
              </div>
            ) : (
              <div className="alert alert-error" role="alert" data-testid="dashboard-error">
                Unable to load dashboard data. Please check your connection and try again.
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  const pipelineStages: Array<{ id: string; status: string; count: number }> = dashboard?.pipeline_stages ?? [];
  const sevenDayTrend = dashboard?.seven_day_trend;
  const hasData = pipelineStages.length > 0 || (sevenDayTrend?.assessments_started ?? 0) > 0;

  return (
    <div className="app-shell">
      <AppNav />
      <main className="dashboard-page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-header__title">Maturity Dashboard</h1>
            <p className="page-header__subtitle">Overview of your maturity programme status.</p>
          </div>

          {!hasData ? (
            <div className="dashboard-empty-state" data-testid="dashboard-empty-state">
              <div className="dashboard-empty-state__icon" aria-hidden="true">📁</div>
              <h2 className="dashboard-empty-state__title">No framework source-pack data has been uploaded yet</h2>
              <p className="dashboard-empty-state__body">
                To begin your maturity assessment, upload a framework source-pack document.
                Once uploaded, your pipeline status and trend data will appear here.
              </p>
              <Link className="btn btn-primary" to="/frameworks/upload" data-testid="dashboard-upload-cta">
                Upload Framework Source-Pack
              </Link>
            </div>
          ) : (
            <>
              <section className="dashboard-section">
                <h2>Pipeline Status</h2>
                <div className="dashboard-pipeline">
                  {pipelineStages.map((s) => (
                    <div key={s.id} className="dashboard-pipeline__stage">
                      <span className="dashboard-pipeline__label">{s.id}</span>
                      <span className={`dashboard-pipeline__badge dashboard-pipeline__badge--${(s.status ?? '').toLowerCase()}`}>
                        {s.status}
                      </span>
                      <span className="dashboard-pipeline__count">{s.count}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="dashboard-section">
                <h2>7-Day Trend</h2>
                <div className="dashboard-stats">
                  <div className="dashboard-stat">
                    <span className="dashboard-stat__label">Assessments started</span>
                    <span className="dashboard-stat__value">{sevenDayTrend?.assessments_started ?? 0}</span>
                  </div>
                  <div className="dashboard-stat">
                    <span className="dashboard-stat__label">Assessments completed</span>
                    <span className="dashboard-stat__value">{sevenDayTrend?.assessments_completed ?? 0}</span>
                  </div>
                </div>
              </section>
            </>
          )}

          <div className="dashboard-actions">
            <Link className="btn btn-outline" to="/frameworks/upload">Upload Framework Source-Pack</Link>
            <Link className="btn btn-outline" to="/frameworks">View Frameworks</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
