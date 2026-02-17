import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  // Simple stub - would check authentication state
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-4">Please log in to access this content.</p>
          <p className="text-sm text-gray-500">Redirect to /login or use authentication provider.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
