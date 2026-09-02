import React from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { LoginForm } from '@shared/components/LoginForm';
import { useAuth } from '@shared/hooks/useAuth';

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { authState } = useAuth();
  const redirectTo = searchParams.get('redirect') || '/';

  // If already authenticated, redirect to intended destination
  if (authState.isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">PMI-DataHelp</h1>
              <span className="text-sm text-gray-500 ml-2">- Iniciar Sesión</span>
            </div>
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ← Volver al Inicio
            </a>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-screen py-12">
        <div className="max-w-md w-full">
          <LoginForm
            redirectTo={redirectTo}
            showGoogleAuth={true}
            phase={redirectTo.startsWith('/pmo') ? '2' : '1'}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;