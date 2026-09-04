import React, { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, Building } from 'lucide-react';
import { AuthService } from '@shared/utils/auth';
import { User } from '@shared/types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user } = await AuthService.login(email, password);
      
      // Verify user has appropriate role for Phase 2
      if (!['admin', 'pmo', 'executive'].includes(user.role)) {
        throw new Error('No tienes permisos para acceder al dashboard ejecutivo');
      }
      
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCorporateLogin = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      // Mock corporate authentication - in real implementation this would use corporate SSO
      const mockUser: User = {
        id: 'corp_' + Date.now().toString(),
        email: 'pmo.director@morrisopazo.com',
        name: 'Director PMO',
        role: 'executive',
        permissions: [
          { resource: 'portfolio', actions: ['read', 'write', 'admin'] },
          { resource: 'projects', actions: ['read', 'write', 'admin'] },
          { resource: 'reports', actions: ['read', 'write'] },
          { resource: 'settings', actions: ['read', 'write'] }
        ],
        createdAt: new Date().toISOString(),
        avatar: 'https://via.placeholder.com/40'
      };
      
      setTimeout(() => {
        onLogin(mockUser);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError('Error al autenticarse con credenciales corporativas');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-600 items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">PMO Dashboard</h1>
            <p className="text-purple-100 text-lg">
              Portal Ejecutivo de Gestión de Portfolio
            </p>
          </div>
          
          <div className="space-y-4 text-left bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Monitoreo en tiempo real</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm">Análisis predictivo de riesgos</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm">Reportería ejecutiva automática</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm">Dashboard personalizable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6 lg:hidden">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Acceso Ejecutivo
            </h2>
            <p className="text-gray-600">
              Ingresa con tus credenciales corporativas
            </p>
          </div>

          {/* Corporate Login */}
          <div className="mb-6">
            <button
              onClick={handleCorporateLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-purple-300 rounded-lg text-purple-700 font-medium hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-3"></div>
                  Autenticando...
                </div>
              ) : (
                <>
                  <Building className="w-5 h-5 mr-3" />
                  Acceso Corporativo Morris
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gray-50 text-gray-500">O ingresa manualmente</span>
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Corporativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.email@morrisopazo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Ingresando...
                </div>
              ) : (
                'Ingresar al Dashboard'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Credenciales Demo</h4>
            <p className="text-sm text-blue-700 mb-3">
              Para acceso de demostración, utiliza:
            </p>
            <div className="text-sm font-mono bg-white p-3 rounded border text-blue-800">
              <div>Email: pmo@morrisopazo.com</div>
              <div>Password: Morris2024!</div>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Conexión segura con encriptación SSL/TLS<br/>
              Acceso restringido a personal autorizado únicamente
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-400">
            <div>PMO Dashboard v{__VERSION__} | AWS us-east-1</div>
            <div className="mt-1">
              &copy; 2026 Proyectos Morris - Todos los derechos reservados
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;