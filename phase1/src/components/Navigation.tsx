import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, BookOpen, Wrench, FileText, User } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Inicio', href: '/', icon: Home, current: location.pathname === '/' },
    { name: 'Módulos', href: '/modules', icon: BookOpen, current: location.pathname === '/modules' },
    { name: 'Herramientas', href: '/tools', icon: Wrench, current: location.pathname === '/tools' },
    { name: 'Recursos', href: '/resources', icon: FileText, current: location.pathname === '/resources' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  item.current
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* User menu (desktop) */}
          <div className="hidden md:flex md:items-center">
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <User className="h-4 w-4 mr-2" />
              Mi Cuenta
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={toggleMenu}
                className={`flex items-center px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  item.current
                    ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
            
            {/* Mobile user menu */}
            <div className="border-t border-gray-200 pt-3">
              <Link
                to="/login"
                onClick={toggleMenu}
                className="flex items-center px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <User className="h-5 w-5 mr-3" />
                Mi Cuenta
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;