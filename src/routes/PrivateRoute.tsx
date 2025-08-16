import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactElement;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = /* your auth logic here, e.g., from context or Zustand */ null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
