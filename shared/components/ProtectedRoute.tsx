import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRoles?: string[];
  requiredPermissions?: { resource: string; action: string }[];
  phase?: '1' | '2';
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = false,
  requiredRoles = [],
  requiredPermissions = [],
  phase,
  fallbackPath = '/login',
}) => {
  const { authState, hasRole, hasPermission, canAccessPhase } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-900">Verificando acceso...</div>
          <div className="text-sm text-gray-500">Un momento por favor</div>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !authState.isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check phase access
  if (phase && !canAccessPhase(phase)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
            <p className="text-gray-600 mb-6">
              {phase === '2' 
                ? 'No tienes permisos para acceder al Dashboard Ejecutivo. Este módulo está restringido a personal PMO autorizado.'
                : 'No tienes permisos para acceder a esta sección.'
              }
            </p>
            {!authState.isAuthenticated ? (
              <button 
                onClick={() => window.location.href = fallbackPath}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Iniciar Sesión
              </button>
            ) : (
              <button 
                onClick={() => window.location.href = phase === '2' ? '/' : '/phase1'}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Volver al Inicio
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Rol Insuficiente</h2>
            <p className="text-gray-600 mb-6">
              Tu rol actual ({authState.user?.role}) no tiene permisos para acceder a esta sección.
              <br />
              Roles requeridos: {requiredRoles.join(', ')}
            </p>
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check specific permissions
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(({ resource, action }) =>
      hasPermission(resource, action)
    );

    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Permisos Insuficientes</h2>
              <p className="text-gray-600 mb-6">
                No tienes los permisos específicos necesarios para realizar esta acción.
              </p>
              <button 
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // All checks passed, render children
  return <>{children}</>;
};

// Higher-order component for protecting components
export const withProtection = (
  WrappedComponent: React.ComponentType<any>,
  protectionConfig: Omit<ProtectedRouteProps, 'children'>
) => {
  return (props: any) => (
    <ProtectedRoute {...protectionConfig}>
      <WrappedComponent {...props} />
    </ProtectedRoute>
  );
};

// Hook for checking permissions in components
export const usePermissions = () => {
  const { hasRole, hasPermission, canAccessPhase, authState } = useAuth();

  const can = (action: string, resource: string): boolean => {
    return hasPermission(resource, action);
  };

  const canEdit = (resource: string): boolean => {
    return hasPermission(resource, 'write');
  };

  const canView = (resource: string): boolean => {
    return hasPermission(resource, 'read');
  };

  const canDelete = (resource: string): boolean => {
    return hasPermission(resource, 'delete');
  };

  const canAdmin = (resource: string): boolean => {
    return hasPermission(resource, 'admin');
  };

  const isAdmin = (): boolean => {
    return hasRole(['admin']);
  };

  const isPMO = (): boolean => {
    return hasRole(['admin', 'pmo']);
  };

  const isExecutive = (): boolean => {
    return hasRole(['admin', 'pmo', 'executive']);
  };

  return {
    can,
    canEdit,
    canView,
    canDelete,
    canAdmin,
    isAdmin,
    isPMO,
    isExecutive,
    canAccessPhase,
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
  };
};