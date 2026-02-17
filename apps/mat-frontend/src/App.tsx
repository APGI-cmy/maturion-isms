import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/layout/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import AuditsPage from './pages/AuditsPage';
import CriteriaPage from './pages/CriteriaPage';
import EvidencePage from './pages/EvidencePage';
import ScoringPage from './pages/ScoringPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="audits/*" element={<AuditsPage />} />
            <Route path="criteria" element={<CriteriaPage />} />
            <Route path="evidence" element={<EvidencePage />} />
            <Route path="scoring" element={<ScoringPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
