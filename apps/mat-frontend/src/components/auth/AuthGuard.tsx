import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: string;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  return <>{children}</>;
}
