import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginForm } from '@/components/auth/LoginForm';
import { ROUTES } from '@/lib/routes';
import Index from './pages/Index';
import ModulesOverview from './pages/ModulesOverview';
import Journey from './pages/Journey';
import FreeAssessment from './pages/FreeAssessment';
import Subscribe from './pages/Subscribe';
import SubscribeCheckout from './pages/SubscribeCheckout';
import RiskManagementInfo from './pages/RiskManagementInfo';
import PITInfo from './pages/PITInfo';
import DataAnalyticsInfo from './pages/DataAnalyticsInfo';
import DataExtractionInfo from './pages/DataExtractionInfo';
import SkillsDevelopmentInfo from './pages/SkillsDevelopmentInfo';
import IncidentManagementInfo from './pages/IncidentManagementInfo';
import MaturityRoadmapInfo from './pages/MaturityRoadmapInfo';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const PrivatePlaceholder = ({ title }: { title: string }) => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-muted-foreground mt-2">
      This private workspace will be implemented in a later ISMS build wave.
    </p>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public landing pages — no authentication required */}
              <Route path={ROUTES.HOME} element={<Index />} />
              <Route path={ROUTES.AUTH} element={<LoginForm />} />
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

              {/* Protected route placeholders — authentication required */}
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute>
                    <PrivatePlaceholder title="Dashboard" />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ASSESSMENT}
                element={
                  <ProtectedRoute>
                    <PrivatePlaceholder title="Assessment Workspace" />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.MATURITY_SETUP}
                element={
                  <ProtectedRoute>
                    <PrivatePlaceholder title="Maturity Setup" />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
