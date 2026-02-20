import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
