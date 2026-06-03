import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    const intendedDestination = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: intendedDestination }} />;
  }

  return <>{children}</>;
};
