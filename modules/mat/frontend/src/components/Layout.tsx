import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { EmbeddedAIAssistant } from './common/EmbeddedAIAssistant';

export function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Audits', path: '/audits', icon: '📋' },
    { name: 'Criteria', path: '/criteria', icon: '📝' },
    { name: 'Evidence', path: '/evidence', icon: '📁' },
    { name: 'Scoring', path: '/scoring', icon: '⭐' },
    { name: 'Reports', path: '/reports', icon: '📄' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        aria-label="Main navigation"
      >
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-primary-600">MAT</h1>
          <p className="text-sm text-gray-600">Manual Audit Tool</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle navigation menu"
            aria-expanded={sidebarOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-primary-600">MAT</h1>
        </header>

        <main id="main-content" className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Embedded AI Assistant — Platform Standard LL-031 */}
      <EmbeddedAIAssistant />
    </div>
  );
}
