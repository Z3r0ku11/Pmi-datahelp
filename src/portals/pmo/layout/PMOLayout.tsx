import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';

interface PMOLayoutProps {
  children: React.ReactNode;
}

const PMOLayout: React.FC<PMOLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { authState, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/pmo', icon: '📊' },
    { name: 'Framework', href: '/pmo/framework', icon: '🏗️' },
    { name: 'Flujo de Proyectos', href: '/pmo/flow', icon: '🔄' },
    { name: 'Portafolio', href: '/pmo/portfolio', icon: '📁' },
    { name: 'Proyectos', href: '/pmo/projects', icon: '📋' },
    { name: 'Analytics', href: '/pmo/analytics', icon: '📈' },
    { name: 'Reportes', href: '/pmo/reports', icon: '📑' },
    { name: 'Configuración', href: '/pmo/settings', icon: '⚙️' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/pmo') {
      return location.pathname === '/pmo' || location.pathname === '/pmo/';
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
                <span className="text-lg font-semibold text-purple-600 ml-2">Portal PMO Morris</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/help"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Portal de Ayuda
              </Link>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">
                      {authState.user?.name?.charAt(0) || authState.user?.email?.charAt(0)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {authState.user?.name || authState.user?.email}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {authState.user?.role}
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-700 ml-4"
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="bg-purple-800 w-64 min-h-screen">
          <div className="p-4">
            <h3 className="text-white font-medium mb-4">Navegación PMO</h3>
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActiveLink(item.href)
                      ? 'bg-purple-700 text-white'
                      : 'text-purple-200 hover:bg-purple-700 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PMOLayout;