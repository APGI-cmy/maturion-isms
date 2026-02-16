import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Audits = React.lazy(() => import('./pages/audits/index'));
const AuditCreate = React.lazy(() => import('./pages/audits/create'));
const AuditDetail = React.lazy(() => import('./pages/audits/[id]'));
const Criteria = React.lazy(() => import('./pages/criteria/index'));
const Evidence = React.lazy(() => import('./pages/evidence/index'));
const Scoring = React.lazy(() => import('./pages/scoring/index'));
const Reports = React.lazy(() => import('./pages/reports/index'));
const Settings = React.lazy(() => import('./pages/settings/index'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const DomainDashboard = React.lazy(() => import('./pages/dashboard/domain'));
const MpsDashboard = React.lazy(() => import('./pages/dashboard/mps'));

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/audits" element={<Audits />} />
              <Route path="/audits/create" element={<AuditCreate />} />
              <Route path="/audits/:id" element={<AuditDetail />} />
              <Route path="/criteria" element={<Criteria />} />
              <Route path="/evidence" element={<Evidence />} />
              <Route path="/scoring" element={<Scoring />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard/domain" element={<DomainDashboard />} />
              <Route path="/dashboard/mps" element={<MpsDashboard />} />
            </Routes>
          </React.Suspense>
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
