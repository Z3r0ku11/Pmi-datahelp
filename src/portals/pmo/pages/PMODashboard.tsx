import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';

const PMODashboard: React.FC = () => {
  const { authState } = useAuth();

  const projectStats = [
    { name: 'Proyectos Activos', value: '12', icon: '🚀', color: 'blue' },
    { name: 'En Planificación', value: '5', icon: '📋', color: 'orange' },
    { name: 'Completados', value: '28', icon: '✅', color: 'green' },
    { name: 'En Riesgo', value: '3', icon: '⚠️', color: 'red' }
  ];

  const recentProjects = [
    { name: 'Sistema de Inventario v2.0', status: 'En Ejecución', progress: 65, manager: 'Ana García' },
    { name: 'CRM Integration', status: 'Planificación', progress: 25, manager: 'Carlos López' },
    { name: 'Analytics Dashboard', status: 'Iniciación', progress: 10, manager: 'María Rodríguez' }
  ];

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {authState.user?.name || authState.user?.email}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Dashboard Ejecutivo PMO - Resumen de proyectos y métricas clave
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {projectStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Proyectos Recientes</h2>
            <Link to="/pmo/projects" className="text-blue-600 hover:text-blue-700 text-sm">
              Ver todos →
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentProjects.map((project, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.status === 'En Ejecución' ? 'bg-green-100 text-green-800' :
                    project.status === 'Planificación' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span>PM: {project.manager}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {project.progress}% completado
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/pmo/framework"
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">🏗️</div>
              <div className="font-medium text-blue-900">Framework</div>
              <div className="text-sm text-blue-600">Metodología PMI</div>
            </Link>
            
            <Link 
              to="/pmo/flow"
              className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-medium text-green-900">Flujo</div>
              <div className="text-sm text-green-600">Ciclo de Vida</div>
            </Link>
            
            <Link 
              to="/pmo/portfolio"
              className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">📁</div>
              <div className="font-medium text-purple-900">Portafolio</div>
              <div className="text-sm text-purple-600">Gestión</div>
            </Link>
            
            <Link 
              to="/pmo/reports"
              className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-4 text-center transition-colors"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium text-orange-900">Reportes</div>
              <div className="text-sm text-orange-600">Analytics</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Project Status Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Proyectos</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">En Ejecución</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm font-medium">12</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Planificación</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm font-medium">5</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">En Riesgo</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <span className="text-sm font-medium">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Allocation */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asignación de Recursos</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Desarrolladores</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Analistas</span>
                <span>70%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Project Managers</span>
                <span>95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMODashboard;