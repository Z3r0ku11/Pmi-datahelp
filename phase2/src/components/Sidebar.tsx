import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Target, 
  Users, 
  AlertTriangle, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Resumen Ejecutivo',
      href: '/',
      icon: LayoutDashboard,
      current: location.pathname === '/'
    },
    {
      name: 'Portafolio',
      href: '/portfolio',
      icon: TrendingUp,
      current: location.pathname === '/portfolio'
    },
    {
      name: 'Proyectos',
      href: '/projects',
      icon: FolderOpen,
      current: location.pathname === '/projects'
    },
    {
      name: 'Recursos',
      href: '/resources',
      icon: Users,
      current: location.pathname === '/resources'
    },
    {
      name: 'Riesgos',
      href: '/risks',
      icon: AlertTriangle,
      current: location.pathname === '/risks'
    },
    {
      name: 'Reportes',
      href: '/reports',
      icon: FileText,
      current: location.pathname === '/reports'
    }
  ];

  const secondaryNavigation = [
    {
      name: 'Configuración',
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings'
    }
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo and toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
          </div>
          {!isCollapsed && (
            <div>
              <div className="text-lg font-bold text-gray-900">PMO Office</div>
              <div className="text-xs text-gray-500">Proyectos Morris</div>
            </div>
          )}
        </div>
        
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          title={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        <div>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                item.current
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon
                className={`flex-shrink-0 w-5 h-5 ${
                  item.current
                    ? 'text-purple-600'
                    : 'text-gray-400 group-hover:text-gray-500'
                } ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
              />
              {!isCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Secondary Navigation */}
        <div>
          {secondaryNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                item.current
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon
                className={`flex-shrink-0 w-5 h-5 ${
                  item.current
                    ? 'text-purple-600'
                    : 'text-gray-400 group-hover:text-gray-500'
                } ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
              />
              {!isCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom section - Quick stats */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-600 mb-2">Estado del Portfolio</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Activos</span>
                <span className="font-medium text-green-600">48</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">En Riesgo</span>
                <span className="font-medium text-yellow-600">8</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Retrasados</span>
                <span className="font-medium text-red-600">5</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Salud General</span>
                <span className="font-medium text-blue-600">92%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed version - Status indicator */}
      {isCollapsed && (
        <div className="p-2 border-t border-gray-200">
          <div className="flex flex-col items-center space-y-1">
            <div className="w-8 h-2 bg-green-500 rounded-full"></div>
            <div className="text-xs font-bold text-green-600">92%</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;