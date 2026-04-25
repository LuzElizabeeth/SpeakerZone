import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/conference.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const getHomePathByRole = (role?: UserRole) => {
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
  const {
    user,
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const location = useLocation();

  /**
   * Paso 1:
   * Esperar a que AuthContext termine de restaurar sesión
   */
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <p className="text-gray-600">
            Verificando sesión...
          </p>
        </div>
      </div>
    );
  }

  /**
   * Paso 2:
   * Si ya terminó y no hay sesión → login
   */
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /**
   * Paso 3:
   * Validar permisos por rol
   */
  if (
    allowedRoles &&
    (!user || !allowedRoles.includes(user.role))
  ) {
    return (
      <Navigate
        to={getHomePathByRole(user?.role)}
        replace
      />
    );
  }

  /**
   * Paso 4:
   * Todo correcto → renderizar vista protegida
   */
  return <>{children}</>;
};

export default ProtectedRoute;

