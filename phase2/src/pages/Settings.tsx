import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Configuración del dashboard y preferencias de usuario</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Preferences */}
        <div className="dashboard-card">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Perfil de Usuario</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Gestiona tu información personal y preferencias del dashboard
          </p>
          <button className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
            Configurar Perfil
          </button>
        </div>

        {/* Notifications */}
        <div className="dashboard-card">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Configura alertas y notificaciones para eventos críticos del portfolio
          </p>
          <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Configurar Alertas
          </button>
        </div>

        {/* Security */}
        <div className="dashboard-card">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Gestiona contraseñas, autenticación de dos factores y sesiones activas
          </p>
          <button className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
            Configurar Seguridad
          </button>
        </div>

        {/* Data Management */}
        <div className="dashboard-card">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Gestión de Datos</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Configuración de sincronización, backups y retención de datos
          </p>
          <button className="px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
            Configurar Datos
          </button>
        </div>
      </div>

      <div className="dashboard-card text-center py-8">
        <SettingsIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">
          Configuración Avanzada
        </h4>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Las opciones de configuración avanzada del sistema estarán disponibles en versiones futuras.
        </p>
      </div>
    </div>
  );
};

export default Settings;