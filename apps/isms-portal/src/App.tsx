import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { IsmsProvider } from '@/context/IsmsContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginForm } from '@/components/auth/LoginForm';
import { PitErrorBoundary } from '@/components/PitErrorBoundary';
import { ROUTES } from '@/lib/routes';
import Index from './pages/Index';
import ModulesOverview from './pages/ModulesOverview';
import Journey from './pages/Journey';
import FreeAssessment from './pages/FreeAssessment';
import Subscribe from './pages/Subscribe';
import SubscribeCheckout from './pages/SubscribeCheckout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import MaturitySetup from './pages/MaturitySetup';
import RiskManagementInfo from './pages/RiskManagementInfo';
import PITInfo from './pages/PITInfo';
import DataAnalyticsInfo from './pages/DataAnalyticsInfo';
import DataExtractionInfo from './pages/DataExtractionInfo';
import SkillsDevelopmentInfo from './pages/SkillsDevelopmentInfo';
import IncidentManagementInfo from './pages/IncidentManagementInfo';
import MaturityRoadmapInfo from './pages/MaturityRoadmapInfo';
import NotFound from './pages/NotFound';
import { PitShell } from './pages/pit/PitShell';

const queryClient = new QueryClient();

const ADMIN_ROUTE_ROLES = ['org_admin', 'cs2_admin'] as const;
const QA_ROUTE_ROLES = ['cs2_admin'] as const;

const privateShellRoute = (title: string, description: string) => (
  <ProtectedRoute>
    <PitErrorBoundary>
      <PitShell title={title} description={description} />
    </PitErrorBoundary>
  </ProtectedRoute>
);

const protectedOnboardingRoute = (
  <ProtectedRoute>
    <PitErrorBoundary>
      <Onboarding />
    </PitErrorBoundary>
  </ProtectedRoute>
);

const protectedDashboardRoute = (
  <ProtectedRoute>
    <PitErrorBoundary>
      <Dashboard />
    </PitErrorBoundary>
  </ProtectedRoute>
);

const protectedMaturitySetupRoute = (
  <ProtectedRoute>
    <PitErrorBoundary>
      <MaturitySetup />
    </PitErrorBoundary>
  </ProtectedRoute>
);

const roleAwareShellRoute = (
  title: string,
  description: string,
  allowedRoles: ReadonlyArray<'org_admin' | 'cs2_admin'>,
  deniedDescription: string,
) => (
  <ProtectedRoute
    allowedRoles={[...allowedRoles]}
    deniedTitle="Access denied"
    deniedDescription={deniedDescription}
  >
    <PitErrorBoundary>
      <PitShell title={title} description={description} />
    </PitErrorBoundary>
  </ProtectedRoute>
);

const adminShellRoute = (title: string, description: string) =>
  roleAwareShellRoute(
    title,
    `${description} Access policy: org_admin or cs2_admin required.`,
    ADMIN_ROUTE_ROLES,
    'This W8.2 admin route requires the org_admin or cs2_admin mock role.',
  );

const qaShellRoute = (title: string, description: string) =>
  roleAwareShellRoute(
    title,
    `${description} Access policy: cs2_admin required.`,
    QA_ROUTE_ROLES,
    'This W8.2 QA dashboard route requires the cs2_admin mock role.',
  );

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <IsmsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public landing pages — no authentication required */}
                <Route path={ROUTES.HOME} element={<Index />} />
                <Route path={ROUTES.AUTH} element={<LoginForm />} />
                <Route path={ROUTES.LOGIN} element={<LoginForm />} />
                <Route
                  path={ROUTES.SIGNUP}
                  element={
                    <PitShell
                      title="Create your Maturion account"
                      description="Public signup foundation for PIT Stage 12 Slice 1. Account creation behavior is completed in a later governed slice."
                    />
                  }
                />
                <Route
                  path={ROUTES.FORGOT_PASSWORD}
                  element={
                    <PitShell
                      title="Password recovery"
                      description="Public password recovery route foundation for PIT Stage 12 Slice 1."
                    />
                  }
                />
                <Route
                  path={ROUTES.RESET_PASSWORD}
                  element={
                    <PitShell
                      title="Reset password"
                      description="Public reset-password route foundation for PIT Stage 12 Slice 1."
                    />
                  }
                />
                <Route
                  path={ROUTES.INVITE}
                  element={
                    <PitShell
                      title="Accept invitation"
                      description="Public invitation acceptance route foundation for PIT Stage 12 Slice 1."
                    />
                  }
                />
                <Route path={ROUTES.MODULES} element={<ModulesOverview />} />
                <Route path={ROUTES.JOURNEY} element={<Journey />} />
                <Route path={ROUTES.FREE_ASSESSMENT} element={<FreeAssessment />} />
                <Route path={ROUTES.SUBSCRIBE} element={<Subscribe />} />
                <Route path={ROUTES.SUBSCRIBE_CHECKOUT} element={<SubscribeCheckout />} />

                {/* Canonical marketing routes */}
                <Route
                  path={ROUTES.MARKETING_MATURITY_ROADMAP}
                  element={<MaturityRoadmapInfo />}
                />
                <Route
                  path={ROUTES.MARKETING_RISK_MANAGEMENT}
                  element={<RiskManagementInfo />}
                />
                <Route
                  path={ROUTES.MARKETING_PROJECT_IMPLEMENTATION}
                  element={<PITInfo />}
                />
                <Route
                  path={ROUTES.MARKETING_DATA_ANALYTICS}
                  element={<DataAnalyticsInfo />}
                />
                <Route
                  path={ROUTES.MARKETING_SYSTEMS_INTEGRATION}
                  element={<DataExtractionInfo />}
                />
                <Route
                  path={ROUTES.MARKETING_SKILLS_DEVELOPMENT}
                  element={<SkillsDevelopmentInfo />}
                />
                <Route
                  path={ROUTES.MARKETING_INCIDENT_INTELLIGENCE}
                  element={<IncidentManagementInfo />}
                />

                {/* Legacy route redirects → canonical marketing paths */}
                <Route
                  path={ROUTES.RISK_MANAGEMENT_INFO}
                  element={<Navigate to={ROUTES.MARKETING_RISK_MANAGEMENT} replace />}
                />
                <Route
                  path={ROUTES.PIT_INFO}
                  element={<Navigate to={ROUTES.MARKETING_PROJECT_IMPLEMENTATION} replace />}
                />
                <Route
                  path={ROUTES.DATA_ANALYTICS_INFO}
                  element={<Navigate to={ROUTES.MARKETING_DATA_ANALYTICS} replace />}
                />
                <Route
                  path={ROUTES.SKILLS_DEVELOPMENT_INFO}
                  element={<Navigate to={ROUTES.MARKETING_SKILLS_DEVELOPMENT} replace />}
                />
                <Route
                  path={ROUTES.INCIDENT_MANAGEMENT_INFO}
                  element={<Navigate to={ROUTES.MARKETING_INCIDENT_INTELLIGENCE} replace />}
                />
                <Route
                  path={ROUTES.DATA_EXTRACTION_INFO}
                  element={<Navigate to={ROUTES.MARKETING_SYSTEMS_INTEGRATION} replace />}
                />

                {/* ISMS W4 protected workspace routes */}
                <Route path={ROUTES.DASHBOARD} element={protectedDashboardRoute} />
                <Route path={ROUTES.ONBOARDING} element={protectedOnboardingRoute} />
                <Route path={ROUTES.MATURITY_SETUP} element={protectedMaturitySetupRoute} />

                {/* PIT Stage 12 Slice 1 protected runtime routes */}
                <Route path={ROUTES.PIT} element={<Navigate to={ROUTES.PIT_TRACKER} replace />} />
                <Route
                  path={ROUTES.PIT_TRACKER}
                  element={privateShellRoute(
                    'PIT tracker',
                    'Protected Process Integrity Testing workspace entry for authenticated users.',
                  )}
                />
                <Route
                  path={ROUTES.PROJECTS}
                  element={privateShellRoute(
                    'PIT projects',
                    'Protected project list shell for the Project Implementation Tracker runtime foundation.',
                  )}
                />
                <Route
                  path={ROUTES.PROJECTS_NEW}
                  element={privateShellRoute(
                    'Create PIT project',
                    'Protected project creation shell for the Project Implementation Tracker runtime foundation.',
                  )}
                />

                {/* PIT Stage 12 W8.2 admin/RLS denied-path foundations */}
                <Route
                  path={ROUTES.ADMIN_ORG}
                  element={adminShellRoute(
                    'Organisation administration',
                    'Protected organisation administration shell for W8.2 access-control foundations.',
                  )}
                />
                <Route
                  path={ROUTES.ADMIN_USERS}
                  element={adminShellRoute(
                    'User administration',
                    'Protected user administration shell for W8.2 role and tenant access foundations.',
                  )}
                />
                <Route
                  path={ROUTES.ADMIN_SETTINGS}
                  element={adminShellRoute(
                    'Admin settings',
                    'Protected admin settings shell for W8.2 role-gated configuration foundations.',
                  )}
                />
                <Route
                  path={ROUTES.ADMIN_AUDIT_LOG}
                  element={adminShellRoute(
                    'Audit log',
                    'Protected audit log shell for W8.2 denied-path and audit-surface foundations.',
                  )}
                />
                <Route
                  path={ROUTES.QA_DASHBOARD}
                  element={qaShellRoute(
                    'QA dashboard',
                    'Protected QA dashboard shell for W8.2 admin visibility foundations.',
                  )}
                />

                {/* ISMS private assessment placeholder */}
                <Route
                  path={ROUTES.ASSESSMENT}
                  element={privateShellRoute(
                    'ISMS assessment',
                    'Protected assessment workspace placeholder for later governed ISMS execution.',
                  )}
                />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </IsmsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
