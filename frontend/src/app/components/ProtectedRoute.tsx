import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/conference.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const getHomePathByRole = (role?: UserRole) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'speaker':
      return '/speaker/dashboard';
    case 'attendee':
      return '/attendee/dashboard';
    default:
      return '/login';
  }
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-10 h-10 border-4 border-blue-light border-t-blue-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Validando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: `${location.pathname}${location.search}`,
        }}
      />
    );
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to={getHomePathByRole(user?.role)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;