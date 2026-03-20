import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { AuditManagementPage } from './pages/AuditManagementPage';
import { CriteriaManagementPage } from './pages/CriteriaManagementPage';
import { EvidenceCollectionPage } from './pages/EvidenceCollectionPage';
import { ScoringPage } from './pages/ScoringPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReportsPage } from './pages/ReportsPage';
import { LoginPage } from './pages/LoginPage';
import { SettingsPage } from './pages/SettingsPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { FeedbackPage } from './pages/FeedbackPage';
import ArcPortalPage from './pages/arc/index';
import { KnowledgeUploadPage } from './pages/KnowledgeUploadPage';
import { AuthProvider } from './contexts/AuthContext';
import { AuditProvider } from './contexts/AuditContext';
import { useAuth } from './contexts/AuthContext';
import { useUserProfile } from './lib/hooks/useSettings';

function ProtectedRoute() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div role="status" aria-live="polite" aria-label="Loading…" className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" aria-hidden="true" />
        <span className="ml-3 text-gray-600">Loading…</span>
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function OnboardingGuard() {
  const { data: profile, isLoading, isFetching } = useUserProfile();
  if (isLoading || isFetching) {
    return (
      <div role="status" aria-live="polite" aria-label="Loading…" className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" aria-hidden="true" />
        <span className="ml-3 text-gray-600">Loading…</span>
      </div>
    );
  }
  if (!profile?.organisation_id) return <Navigate to="/onboarding" replace />;
  return (
    <>
      <span data-testid="onboarding-guard" style={{ display: 'none' }} aria-hidden="true" />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuditProvider>
      <ErrorBoundary>
          {/* GAP-008: Global toast notification provider (replaces all window.alert calls) */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { maxWidth: '420px' },
            }}
          />
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route element={<OnboardingGuard />}>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="audits" element={<AuditManagementPage />} />
                    <Route path="criteria" element={<CriteriaManagementPage />} />
                    <Route path="evidence" element={<EvidenceCollectionPage />} />
                    <Route path="scoring" element={<ScoringPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="feedback" element={<FeedbackPage />} />
                    <Route path="recommendations" element={<FeedbackPage />} />
                    <Route path="arc" element={<ArcPortalPage />} />
                    <Route path="knowledge" element={<KnowledgeUploadPage />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </Router>
        </ErrorBoundary>
      </AuditProvider>
    </AuthProvider>
  );
}

export default App;
