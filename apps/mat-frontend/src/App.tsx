import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';

const AuditManagementPage = lazy(() => import('./pages/audits'));
const CriteriaManagementPage = lazy(() => import('./pages/criteria'));
const EvidenceCollectionPage = lazy(() => import('./pages/evidence'));
const AIScoringReviewPage = lazy(() => import('./pages/scoring'));
const DashboardsPage = lazy(() => import('./pages/dashboard'));
const ReportGenerationPage = lazy(() => import('./pages/reports'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UserSettingsPage = lazy(() => import('./pages/settings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/audits" element={<AuditManagementPage />} />
            <Route path="/criteria" element={<CriteriaManagementPage />} />
            <Route path="/evidence" element={<EvidenceCollectionPage />} />
            <Route path="/scoring" element={<AIScoringReviewPage />} />
            <Route path="/dashboard" element={<DashboardsPage />} />
            <Route path="/reports" element={<ReportGenerationPage />} />
            <Route path="/settings" element={<UserSettingsPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
