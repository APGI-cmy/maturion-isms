import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

const queryClient = new QueryClient();

function ProtectedRoute() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div role="status" aria-live="polite" className="min-h-screen flex items-center justify-center">
        <span className="sr-only">Loading…</span>
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="audits" element={<AuditManagementPage />} />
                  <Route path="criteria" element={<CriteriaManagementPage />} />
                  <Route path="evidence" element={<EvidenceCollectionPage />} />
                  <Route path="scoring" element={<ScoringPage />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
