import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
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

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    const redirect = getAuthRedirectTarget(location);
    return <Navigate to={redirect.to} replace state={{ from: redirect.from }} />;
  }

  return <>{children}</>;
};
