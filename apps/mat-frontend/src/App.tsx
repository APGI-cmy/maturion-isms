import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/audits" element={<div>Audits</div>} />
            <Route path="/criteria" element={<div>Criteria</div>} />
            <Route path="/evidence" element={<div>Evidence</div>} />
            <Route path="/scoring" element={<div>Scoring</div>} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
            <Route path="/reports" element={<div>Reports</div>} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}
