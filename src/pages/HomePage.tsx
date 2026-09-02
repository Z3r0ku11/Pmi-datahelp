import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

const HomePage: React.FC = () => {
  const { authState, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">PMI-DataHelp</h1>
                <p className="text-sm text-gray-600">Portal Integral de Gestión de Proyectos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {authState.isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Bienvenido, {authState.user?.name || authState.user?.email}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl">
            <span className="block">Bienvenido a</span>
            <span className="block text-blue-600">PMI-DataHelp</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Tu plataforma integral para gestión de proyectos. Accede a recursos educativos 
            y herramientas ejecutivas en un solo lugar.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* Portal de Ayuda */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-lg leading-6 font-medium text-gray-900">
                        Portal de Ayuda
                      </dt>
                      <dd className="mt-1 text-base text-gray-500">
                        Recursos educativos, guías y herramientas de gestión de proyectos
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      ✅ Acceso público<br/>
                      📚 Contenido educativo<br/>
                      🛠️ Herramientas PMI<br/>
                      📖 Guías y recursos
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      to="/help"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Acceder al Portal de Ayuda
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Portal PMO Morris */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-lg leading-6 font-medium text-gray-900">
                        Portal PMO Morris
                      </dt>
                      <dd className="mt-1 text-base text-gray-500">
                        Dashboard ejecutivo con framework y flujo de proyectos
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      🔒 Acceso restringido<br/>
                      📊 Dashboard ejecutivo<br/>
                      🔄 Framework de proyectos<br/>
                      📈 Métricas y reportes
                    </div>
                  </div>
                  <div className="mt-6">
                    {authState.isAuthenticated && 
                     (authState.user?.role === 'admin' || authState.user?.role === 'pmo' || authState.user?.role === 'executive') ? (
                      <Link
                        to="/pmo"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        Acceder al Portal PMO
                      </Link>
                    ) : (
                      <Link
                        to="/login?redirect=/pmo"
                        className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        Iniciar Sesión para Acceder
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Características Principales
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Una plataforma completa para todas tus necesidades de gestión de proyectos
            </p>
          </div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Acceso Rápido</h3>
                <p className="mt-2 text-base text-gray-500">
                  Accede a todos los recursos desde una sola plataforma unificada
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Seguridad</h3>
                <p className="mt-2 text-base text-gray-500">
                  Control de acceso basado en roles con autenticación robusta
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Analytics</h3>
                <p className="mt-2 text-base text-gray-500">
                  Métricas y reportes avanzados para toma de decisiones
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              &copy; 2026 PMI-DataHelp - Portal Integral de Gestión de Proyectos
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Versión 2.0.0 | AWS Cloud Native | Región us-east-1
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;