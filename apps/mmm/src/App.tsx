import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ConnectivityIndicator } from '@/components/ConnectivityIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import TutorialPage from '@/pages/TutorialPage';
import FreeAssessmentPage from '@/pages/FreeAssessmentPage';
import FreeAssessmentResultPage from '@/pages/FreeAssessmentResultPage';
import SignUpPage from '@/pages/SignUpPage';
import LoginPage from '@/pages/LoginPage';
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
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            <Route path="/framework-origin" element={<ProtectedRoute><FrameworkOriginPage /></ProtectedRoute>} />
            <Route path="/frameworks" element={<ProtectedRoute><FrameworkListPage /></ProtectedRoute>} />
            <Route path="/frameworks/upload" element={<ProtectedRoute><FrameworkUploadPage /></ProtectedRoute>} />
            <Route path="/frameworks/:id/review" element={<ProtectedRoute><FrameworkReviewPage /></ProtectedRoute>} />
            <Route path="/assessments/:id/workbench" element={<ProtectedRoute><AssessmentWorkbenchPage /></ProtectedRoute>} />
            <Route path="/assessments/:id/evidence/:criterionId" element={<ProtectedRoute><EvidenceWorkspacePage /></ProtectedRoute>} />
            <Route path="/findings" element={<ProtectedRoute><FindingsPage /></ProtectedRoute>} />
            <Route path="/reports/:assessmentId" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/pit-export/:id" element={<ProtectedRoute><PitExportPage /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
