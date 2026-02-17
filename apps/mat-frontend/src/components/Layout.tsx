import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header role="banner" className="bg-blue-600 text-white p-4">
        <h1>MAT - Manual Audit Tool</h1>
      </header>
      <nav role="navigation" className="bg-gray-100 p-4">
        <ul className="flex gap-4">
          <li><Link to="/audits">Audits</Link></li>
          <li><Link to="/criteria">Criteria</Link></li>
          <li><Link to="/evidence">Evidence</Link></li>
          <li><Link to="/scoring">Scoring</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/reports">Reports</Link></li>
        </ul>
      </nav>
      <main role="main" className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}
