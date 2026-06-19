import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type MockRouteRole } from '@/context/AuthContext';
import { ROUTES } from '@/lib/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: MockRouteRole[];
  deniedTitle?: string;
  deniedDescription?: string;
}

type RouteLocationParts = {
  pathname: string;
  search: string;
  hash: string;
};

export const getAuthRedirectTarget = (parts: RouteLocationParts) => ({
  to: ROUTES.LOGIN,
  from: `${parts.pathname}${parts.search}${parts.hash}`,
});

const AccessDenied = ({ title, description }: { title: string; description: string }) => (
  <div className="min-h-screen bg-muted/30 px-4 py-16">
    <main className="mx-auto max-w-3xl rounded-2xl border bg-background p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        PIT Stage 12 W8.2 route authorization
      </p>
      <h1 className="mt-4 text-3xl font-bold">{title}</h1>
      <p className="mt-4 text-muted-foreground">{description}</p>
    </main>
  </div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  deniedTitle = 'Access denied',
  deniedDescription = 'Your current mock role is not authorized for this protected PIT route.',
}) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    const redirect = getAuthRedirectTarget(location);
    return <Navigate to={redirect.to} replace state={{ from: redirect.from }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <AccessDenied title={deniedTitle} description={deniedDescription} />;
  }

  return <>{children}</>;
};
