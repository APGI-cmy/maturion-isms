import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ConnectivityIndicator } from '@/components/ConnectivityIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AuthenticatedAppShell from '@/components/AuthenticatedAppShell';
import LandingPage from '@/pages/LandingPage';
import TutorialPage from '@/pages/TutorialPage';
import FreeAssessmentPage from '@/pages/FreeAssessmentPage';
import FreeAssessmentResultPage from '@/pages/FreeAssessmentResultPage';
import SignUpPage from '@/pages/SignUpPage';
import LoginPage from '@/pages/LoginPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import OnboardingPage from '@/pages/OnboardingPage';
import FrameworkOriginPage from '@/pages/FrameworkOriginPage';
// B4 pages
import FrameworkListPage from '@/pages/FrameworkListPage';
import FrameworkUploadPage from '@/pages/FrameworkUploadPage';
import FrameworkReviewPage from '@/pages/FrameworkReviewPage';
// B5 pages
import AssessmentWorkbenchPage from '@/pages/AssessmentWorkbenchPage';
import EvidenceWorkspacePage from '@/pages/EvidenceWorkspacePage';
// B6 pages
import FindingsPage from '@/pages/FindingsPage';
import ReportPage from '@/pages/ReportPage';
import DashboardPage from '@/pages/DashboardPage';
import PitExportPage from '@/pages/PitExportPage';
import AssessmentFrameworkHandoffPage from '@/pages/AssessmentFrameworkHandoffPage';
import DomainWorkspacePage from '@/pages/DomainWorkspacePage';
import DocumentManagementCenterPage from '@/pages/DocumentManagementCenterPage';
import OrganisationContextPage from '@/pages/OrganisationContextPage';
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ConnectivityIndicator />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tutorial" element={<TutorialPage />} />
            <Route path="/free-assessment" element={<FreeAssessmentPage />} />
            <Route path="/free-assessment/result" element={<FreeAssessmentResultPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route element={<ProtectedRoute><AuthenticatedAppShell /></ProtectedRoute>}>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/organisation-context" element={<OrganisationContextPage />} />
              <Route path="/framework-origin" element={<FrameworkOriginPage />} />
              <Route path="/frameworks" element={<FrameworkListPage />} />
              <Route path="/frameworks/upload" element={<FrameworkUploadPage />} />
              <Route path="/dmc" element={<DocumentManagementCenterPage />} />
              <Route path="/frameworks/:id/review" element={<FrameworkReviewPage />} />
              <Route path="/assessments/:id/workbench" element={<AssessmentWorkbenchPage />} />
              <Route path="/assessments/:id/evidence/:criterionId" element={<EvidenceWorkspacePage />} />
              <Route path="/findings" element={<FindingsPage />} />
              <Route path="/reports/:assessmentId" element={<ReportPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/pit-export/:id" element={<PitExportPage />} />
              {/* ProtectedRoute */}
              <Route path="/assessment/framework" element={<AssessmentFrameworkHandoffPage />} />
              <Route path="/assessment/framework/domain/:domainId" element={<DomainWorkspacePage />} />
              <Route path="/assessment-framework" element={<AssessmentFrameworkHandoffPage />} />
              <Route path="/audit/domain/:domainId" element={<DomainWorkspacePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
