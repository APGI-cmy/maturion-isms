import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase, getEdgeInvokeHeaders } from '@/lib/supabase';

const STATUS_BADGE_CLASSES: Record<string, string> = {
  complete: 'dashboard-pipeline__badge--complete',
  done: 'dashboard-pipeline__badge--done',
  pending: 'dashboard-pipeline__badge--pending',
  in_progress: 'dashboard-pipeline__badge--in_progress',
  failed: 'dashboard-pipeline__badge--failed',
  error: 'dashboard-pipeline__badge--error',
};

function pipelineStatusClass(status: string): string {
  return STATUS_BADGE_CLASSES[status.toLowerCase()] ?? '';
}

// Supabase function invoke errors can carry HTTP status in either error.status
// or error.context.status depending on error path/client shape.
function getInvokeStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const invokeError = error as { status?: unknown; context?: { status?: unknown } };
  const status = invokeError.context?.status ?? invokeError.status;
  return typeof status === 'number' ? status : undefined;
}

type WorkflowStage = 'LOGIN' | 'ONBOARDING' | 'MODE_SELECTION' | 'FRAMEWORK_BUILD' | 'DOMAIN_WORKSPACE';

interface WorkflowNextStep {
  href: string;
  label: string;
  description: string;
}

interface WorkflowSummary {
  stage: WorkflowStage;
  nextStep: WorkflowNextStep;
}

async function resolveWorkflowSummary(): Promise<WorkflowSummary> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;

  const userId = sessionData.session?.user?.id;
  if (!userId) {
    return {
      stage: 'LOGIN',
      nextStep: {
        href: '/login',
        label: 'Sign In',
        description: 'Sign in to resume your maturity workflow.',
      },
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from('mmm_profiles')
    .select('organisation_id,current_framework_id')
    .eq('id', userId)
    .maybeSingle();
  if (profileError) throw profileError;

  if (!profile?.organisation_id) {
    return {
      stage: 'ONBOARDING',
      nextStep: {
        href: '/onboarding',
        label: 'Click Here To Start',
        description: 'Complete Get To Know You onboarding so Maturion can tailor guidance to your organisation.',
      },
    };
  }

  const { data: organisation, error: orgError } = await supabase
    .from('mmm_organisations')
    .select('onboarding_complete')
    .eq('id', profile.organisation_id)
    .maybeSingle();
  if (orgError) throw orgError;

  if (!organisation?.onboarding_complete) {
    return {
      stage: 'ONBOARDING',
      nextStep: {
        href: '/onboarding',
        label: 'Continue Onboarding',
        description: 'Finish onboarding so criteria setup can be unlocked.',
      },
    };
  }

  const { data: frameworks, error: frameworksError } = await supabase
    .from('mmm_frameworks')
    .select('id,status,updated_at')
    .eq('organisation_id', profile.organisation_id)
    .order('updated_at', { ascending: false })
    .limit(1);
  if (frameworksError) throw frameworksError;

  const latestFramework = frameworks?.[0] ?? null;
  if (!latestFramework?.id) {
    return {
      stage: 'MODE_SELECTION',
      nextStep: {
        href: '/framework-origin',
        label: 'Choose Criteria Mode',
        description: 'Select Verbatim, New Generation, or Hybrid before building your first domain criteria set.',
      },
    };
  }

  const frameworkId = profile.current_framework_id ?? latestFramework.id;
  const status = String(latestFramework.status ?? '').toUpperCase();

  if (status === 'DRAFT') {
    return {
      stage: 'FRAMEWORK_BUILD',
      nextStep: {
        href: `/frameworks/${frameworkId}/review`,
        label: 'Continue Framework Build',
        description: 'Review, compile, and move your framework into the legacy domain workspace.',
      },
    };
  }

  return {
    stage: 'DOMAIN_WORKSPACE',
    nextStep: {
      href: `/assessment/framework?framework_id=${encodeURIComponent(frameworkId)}`,
      label: 'Open Domain Workspace',
      description: 'Enter the 5-domain maturity workspace to generate MPS, intent statements, and criteria.',
    },
  };
}

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

export default function DashboardPage() {
  const { data: dashboard, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('mmm-qiw-status', {
        headers: await getEdgeInvokeHeaders(),
      });
      const status = getInvokeStatus(error);
      if (status === 403) {
        const err = new Error('Permission denied') as Error & { status: number };
        err.status = 403;
        throw err;
      }
      if (error) {
        const err = new Error('Failed to load dashboard') as Error & { status: number };
        err.status = status ?? 500;
        throw err;
      }
      return data;
    },
    staleTime: 30_000, // TR-005: cache for dashboard render performance
  });

  const {
    data: workflow,
    isLoading: workflowLoading,
    isError: workflowError,
  } = useQuery({
    queryKey: ['dashboard-workflow'],
    queryFn: resolveWorkflowSummary,
    staleTime: 30_000,
  });

  if (isLoading || workflowLoading) {
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

  const dashboardStatus = isError ? (error as { status?: number } | undefined) : undefined;
  const isPermissionError = dashboardStatus?.status === 403;
  const pipelineStages: Array<{ id: string; status: string; count: number }> = isError ? [] : (dashboard?.pipeline_stages ?? []);
  const sevenDayTrend = isError ? null : dashboard?.seven_day_trend;
  const hasData = !isError && (pipelineStages.length > 0 || (sevenDayTrend?.assessments_started ?? 0) > 0);
  const nextStep = workflow?.nextStep ?? {
    href: '/onboarding',
    label: 'Click Here To Start',
    description: 'Complete onboarding to begin your maturity workflow.',
  };

  return (
    <div className="app-shell">
      <AppNav />
      <main className="dashboard-page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-header__title">Maturity Dashboard</h1>
            <p className="page-header__subtitle">Overview of your maturity programme status.</p>
          </div>
          {isError ? (
            <div
              className="alert alert-error"
              role="status"
              data-testid={isPermissionError ? 'dashboard-permission-error' : 'dashboard-error'}
            >
              {isPermissionError
                ? 'Telemetry is not available yet for this account role. You can still continue with setup below.'
                : 'Live dashboard telemetry is temporarily unavailable. You can still continue with setup below.'}
            </div>
          ) : null}

          {!hasData ? (
            <div className="dashboard-empty-state" data-testid="dashboard-empty-state">
              <div className="dashboard-empty-state__icon" aria-hidden="true">📁</div>
              <h2 className="dashboard-empty-state__title">Your dashboard is ready — let&apos;s start the workflow</h2>
              <p className="dashboard-empty-state__body">
                {nextStep.description}
              </p>
              <Link className="btn btn-primary" to={nextStep.href} data-testid="dashboard-upload-cta">
                {nextStep.label}
              </Link>
              {workflowError ? (
                <p className="dashboard-empty-state__body" role="status" style={{ marginTop: '0.75rem' }}>
                  We couldn&apos;t verify progress state exactly, so default guidance is shown.
                </p>
              ) : null}
            </div>
          ) : (
            <>
              <section className="dashboard-section">
                <h2>Pipeline Status</h2>
                <div className="dashboard-pipeline">
                  {pipelineStages.map((s) => (
                    <div key={s.id} className="dashboard-pipeline__stage">
                      <span className="dashboard-pipeline__label">{s.id}</span>
                      <span className={`dashboard-pipeline__badge ${pipelineStatusClass(s.status ?? '')}`}>
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
            <Link className="btn btn-outline" to={nextStep.href}>{nextStep.label}</Link>
            <Link className="btn btn-outline" to="/framework-origin">Criteria Mode</Link>
            <Link className="btn btn-outline" to="/frameworks">View Frameworks</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
