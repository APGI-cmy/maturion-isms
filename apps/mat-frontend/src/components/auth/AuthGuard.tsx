import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  // Simple stub - would check authentication state
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <>{children}</>;
}
