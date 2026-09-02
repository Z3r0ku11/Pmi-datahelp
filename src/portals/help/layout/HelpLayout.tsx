import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';

interface HelpLayoutProps {
  children: React.ReactNode;
}

const HelpLayout: React.FC<HelpLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { authState, logout } = useAuth();

  const navigation = [
    { name: 'Inicio', href: '/help', icon: '🏠' },
    { name: 'Recursos', href: '/help/resources', icon: '📚' },
    { name: 'Herramientas', href: '/help/tools', icon: '🛠️' },
    { name: 'Guías', href: '/help/guides', icon: '📖' },
    { name: 'Cursos', href: '/help/courses', icon: '🎓' },
    { name: 'Plantillas', href: '/help/templates', icon: '📋' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/help') {
      return location.pathname === '/help' || location.pathname === '/help/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-900 mr-2">PMI-DataHelp</span>
                <span className="text-sm text-gray-500">/</span>
                <span className="text-lg font-semibold text-green-600 ml-2">Portal de Ayuda</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {authState.isAuthenticated ? (
                <>
                  {(authState.user?.role === 'admin' || authState.user?.role === 'pmo' || authState.user?.role === 'executive') && (
                    <Link
                      to="/pmo"
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Portal PMO
                    </Link>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">
                      {authState.user?.name || authState.user?.email}
                    </span>
                    <button
                      onClick={logout}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Salir
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-4 text-sm font-medium whitespace-nowrap ${
                  isActiveLink(item.href)
                    ? 'text-white border-b-2 border-white'
                    : 'text-green-100 hover:text-white hover:border-b-2 hover:border-green-200'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2026 PMI-DataHelp - Portal de Ayuda | Recursos Educativos de Gestión de Proyectos</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelpLayout;