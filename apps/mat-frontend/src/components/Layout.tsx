import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import OfflineIndicator from './OfflineIndicator';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" role="application" aria-label="MAT Application">
      <header role="banner">
        <Navigation />
        <OfflineIndicator />
      </header>
      <main role="main" className="flex-1 p-4">
        {children}
      </main>
      <footer role="contentinfo" className="p-4 text-center text-sm text-gray-500">
        MAT - Manual Audit Tool
      </footer>
    </div>
  );
}
