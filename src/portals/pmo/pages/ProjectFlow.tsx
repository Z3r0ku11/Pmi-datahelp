import React, { useState } from 'react';

const ProjectFlow: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState('example');

  const projectStages = [
    {
      id: 'concept',
      name: 'Concepto',
      icon: '💡',
      status: 'completed',
      description: 'Identificación de oportunidad o necesidad',
      duration: '2-4 semanas',
      gates: ['Business Case', 'Viabilidad Inicial']
    },
    {
      id: 'definition',
      name: 'Definición',
      icon: '📋',
      status: 'completed',
      description: 'Definición detallada del proyecto',
      duration: '4-6 semanas',
      gates: ['Project Charter', 'Plan Preliminar']
    },
    {
      id: 'planning',
      name: 'Planificación',
      icon: '🗺️',
      status: 'current',
      description: 'Desarrollo del plan detallado',
      duration: '6-8 semanas',
      gates: ['Plan Completo', 'Aprobación Budget']
    },
    {
      id: 'execution',
      name: 'Ejecución',
      icon: '⚙️',
      status: 'pending',
      description: 'Implementación del proyecto',
      duration: '12-24 semanas',
      gates: ['Entregables', 'Hitos Clave']
    },
    {
      id: 'closure',
      name: 'Cierre',
      icon: '🎯',
      status: 'pending',
      description: 'Finalización y entrega',
      duration: '2-3 semanas',
      gates: ['Entrega Final', 'Lecciones Aprendidas']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'current': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-gray-300 text-gray-600';
      default: return 'bg-gray-300 text-gray-600';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Flujo de Proyectos Morris</h1>
        <p className="mt-2 text-lg text-gray-600">
          Seguimiento del ciclo de vida y gates de aprobación
        </p>
      </div>

      {/* Project Selector */}
      <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Proyecto Actual</h2>
            <p className="text-gray-600">Sistema de Gestión de Inventario v2.0</p>
          </div>
          <select 
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="example">Sistema de Gestión de Inventario v2.0</option>
            <option value="crm">CRM Integration Project</option>
            <option value="analytics">Analytics Dashboard</option>
          </select>
        </div>
      </div>

      {/* Flow Visualization */}
      <div className="mb-8">
        <div className="flex items-center justify-between bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
          {projectStages.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              {/* Stage Circle */}
              <div className="flex flex-col items-center min-w-0">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${getStatusColor(stage.status)}`}>
                  {stage.icon}
                </div>
                <div className="mt-2 text-center">
                  <div className="font-medium text-sm text-gray-900">{stage.name}</div>
                  <div className="text-xs text-gray-500">{stage.duration}</div>
                </div>
              </div>
              
              {/* Connector Arrow */}
              {index < projectStages.length - 1 && (
                <div className="flex-shrink-0 mx-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Stage Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Etapa Actual: Planificación</h3>
          
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progreso General</span>
              <span>65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm">Definir WBS completa</span>
              <span className="ml-auto text-xs text-green-600 font-medium">Completado</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm">Estimar recursos y costos</span>
              <span className="ml-auto text-xs text-green-600 font-medium">Completado</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm">Desarrollar cronograma detallado</span>
              <span className="ml-auto text-xs text-blue-600 font-medium">En Progreso</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded-full mr-3"></div>
              <span className="text-sm">Plan de gestión de riesgos</span>
              <span className="ml-auto text-xs text-gray-500 font-medium">Pendiente</span>
            </div>
          </div>
        </div>

        {/* Gates & Approvals */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gates de Aprobación</h3>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Gate 2: Definición</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Aprobado</span>
              </div>
              <div className="text-sm text-gray-600">
                <div>✅ Business Case aprobado</div>
                <div>✅ Project Charter firmado</div>
                <div>✅ Sponsor asignado</div>
              </div>
              <div className="text-xs text-gray-500 mt-2">Aprobado: 15 Nov 2024</div>
            </div>

            <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Gate 3: Planificación</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">En Revisión</span>
              </div>
              <div className="text-sm text-gray-600">
                <div>✅ Plan de proyecto completo</div>
                <div>🔄 Aprobación de presupuesto</div>
                <div>⏳ Asignación de recursos</div>
              </div>
              <div className="text-xs text-gray-500 mt-2">Fecha estimada: 5 Dic 2024</div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Gate 4: Ejecución</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">Pendiente</span>
              </div>
              <div className="text-sm text-gray-600">
                <div>⏳ Kick-off meeting</div>
                <div>⏳ Equipo completo asignado</div>
                <div>⏳ Infraestructura preparada</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📅</div>
            <div>
              <div className="text-sm text-gray-600">Duración Total</div>
              <div className="text-xl font-bold text-gray-900">26 semanas</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">💰</div>
            <div>
              <div className="text-sm text-gray-600">Presupuesto</div>
              <div className="text-xl font-bold text-gray-900">$450K</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">👥</div>
            <div>
              <div className="text-sm text-gray-600">Equipo</div>
              <div className="text-xl font-bold text-gray-900">12 personas</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⚠️</div>
            <div>
              <div className="text-sm text-gray-600">Riesgos Activos</div>
              <div className="text-xl font-bold text-red-600">3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            📊 Ver Detalles del Proyecto
          </button>
          <button className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors">
            ✅ Aprobar Gate Actual
          </button>
          <button className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            📋 Generar Reporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFlow;