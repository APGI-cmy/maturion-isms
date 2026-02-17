import { Outlet, Link, useLocation } from 'react-router-dom';
import OfflineIndicator from './OfflineIndicator';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/audits', label: 'Audits', icon: '📋' },
    { path: '/criteria', label: 'Criteria', icon: '📝' },
    { path: '/evidence', label: 'Evidence', icon: '📁' },
    { path: '/scoring', label: 'Scoring', icon: '⭐' },
    { path: '/reports', label: 'Reports', icon: '📄' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <OfflineIndicator />
      
      {/* Sidebar Navigation */}
      <div className="flex">
        <aside 
          className="w-64 bg-white shadow-md min-h-screen"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold text-primary-600">MAT</h1>
            <p className="text-sm text-gray-600">Manual Audit Tool</p>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      location.pathname.startsWith(item.path)
                        ? 'bg-primary-100 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-current={location.pathname.startsWith(item.path) ? 'page' : undefined}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
