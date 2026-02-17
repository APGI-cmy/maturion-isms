import { ReactNode } from 'react';

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
          <li><a href="/audits">Audits</a></li>
          <li><a href="/criteria">Criteria</a></li>
          <li><a href="/evidence">Evidence</a></li>
          <li><a href="/scoring">Scoring</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/reports">Reports</a></li>
        </ul>
      </nav>
      <main role="main" className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}
