import React, { useState } from 'react';

const ProjectFramework: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState('initiation');

  const frameworkPhases = [
    {
      id: 'initiation',
      name: 'Iniciación',
      icon: '🎯',
      color: 'blue',
      description: 'Definición y autorización del proyecto',
      deliverables: [
        'Project Charter',
        'Identificación de Stakeholders',
        'Business Case',
        'Registro de Riesgos Inicial'
      ],
      activities: [
        'Definir objetivos y alcance',
        'Identificar stakeholders clave',
        'Evaluar viabilidad',
        'Asignar Project Manager'
      ]
    },
    {
      id: 'planning',
      name: 'Planificación',
      icon: '📋',
      color: 'green',
      description: 'Desarrollo detallado del plan de proyecto',
      deliverables: [
        'Plan de Gestión del Proyecto',
        'WBS (Work Breakdown Structure)',
        'Cronograma del Proyecto',
        'Plan de Gestión de Riesgos',
        'Plan de Comunicaciones'
      ],
      activities: [
        'Desarrollar WBS',
        'Estimar recursos y duración',
        'Crear cronograma',
        'Planificar gestión de riesgos',
        'Definir métricas de calidad'
      ]
    },
    {
      id: 'execution',
      name: 'Ejecución',
      icon: '⚙️',
      color: 'orange',
      description: 'Implementación del plan de proyecto',
      deliverables: [
        'Entregables del Proyecto',
        'Reportes de Estado',
        'Documentación de Cambios',
        'Registros de Calidad'
      ],
      activities: [
        'Dirigir y gestionar el trabajo',
        'Implementar respuestas a riesgos',
        'Ejecutar control de calidad',
        'Desarrollar el equipo'
      ]
    },
    {
      id: 'monitoring',
      name: 'Monitoreo y Control',
      icon: '📊',
      color: 'purple',
      description: 'Seguimiento y control del progreso',
      deliverables: [
        'Reportes de Performance',
        'Solicitudes de Cambio',
        'Actualizaciones del Plan',
        'Métricas de Calidad'
      ],
      activities: [
        'Monitorear trabajo del proyecto',
        'Controlar cambios',
        'Validar alcance',
        'Gestionar comunicaciones'
      ]
    },
    {
      id: 'closure',
      name: 'Cierre',
      icon: '✅',
      color: 'red',
      description: 'Finalización formal del proyecto',
      deliverables: [
        'Producto Final',
        'Documentación de Lecciones Aprendidas',
        'Archivo del Proyecto',
        'Reporte Final'
      ],
      activities: [
        'Cerrar procuraciones',
        'Liberar recursos del equipo',
        'Documentar lecciones aprendidas',
        'Celebrar éxitos'
      ]
    }
  ];

  const selectedPhaseData = frameworkPhases.find(phase => phase.id === selectedPhase);

  const getColorClasses = (color: string, active: boolean = false) => {
    const colors: { [key: string]: { bg: string, text: string, border: string, activeBg: string } } = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', activeBg: 'bg-blue-200' },
      green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', activeBg: 'bg-green-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', activeBg: 'bg-orange-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', activeBg: 'bg-purple-200' },
      red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', activeBg: 'bg-red-200' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Framework de Proyectos Morris</h1>
        <p className="mt-2 text-lg text-gray-600">
          Metodología estándar basada en PMI para gestión de proyectos
        </p>
      </div>

      {/* Phase Navigation */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {frameworkPhases.map((phase) => {
            const colors = getColorClasses(phase.color, phase.id === selectedPhase);
            const isActive = phase.id === selectedPhase;
            
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                  isActive 
                    ? `${colors.activeBg} ${colors.border} ${colors.text} border-opacity-100` 
                    : `${colors.bg} ${colors.text} border-gray-200 hover:${colors.activeBg}`
                }`}
              >
                <div className="text-2xl mb-2">{phase.icon}</div>
                <div className="font-medium text-sm">{phase.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Phase Details */}
      {selectedPhaseData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Phase Overview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{selectedPhaseData.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedPhaseData.name}</h2>
                <p className="text-gray-600">{selectedPhaseData.description}</p>
              </div>
            </div>

            {/* Key Activities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Actividades Clave</h3>
              <div className="space-y-2">
                {selectedPhaseData.activities.map((activity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Flow Indicators */}
            <div className="flex items-center justify-between text-sm text-gray-500 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                  📥
                </div>
                <span>Entradas</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-4"></div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mb-1">
                  ⚙️
                </div>
                <span>Proceso</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-4"></div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                  📤
                </div>
                <span>Salidas</span>
              </div>
            </div>
          </div>

          {/* Deliverables */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Entregables Principales</h3>
            <div className="space-y-3">
              {selectedPhaseData.deliverables.map((deliverable, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="font-medium text-gray-900">{deliverable}</span>
                    </div>
                    <button className="text-purple-600 hover:text-purple-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Templates & Tools */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium text-gray-900 mb-3">Plantillas & Herramientas</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-100">
                  📋 Plantillas
                </button>
                <button className="bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm hover:bg-green-100">
                  🛠️ Herramientas
                </button>
                <button className="bg-purple-50 text-purple-700 px-3 py-2 rounded-md text-sm hover:bg-purple-100">
                  📚 Guías
                </button>
                <button className="bg-orange-50 text-orange-700 px-3 py-2 rounded-md text-sm hover:bg-orange-100">
                  ✅ Checklists
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Framework Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">5</div>
          <div className="text-sm text-gray-600">Fases del Framework</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-green-600">23</div>
          <div className="text-sm text-gray-600">Entregables Totales</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">47</div>
          <div className="text-sm text-gray-600">Procesos PMI</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-orange-600">10</div>
          <div className="text-sm text-gray-600">Áreas de Conocimiento</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            🚀 Iniciar Nuevo Proyecto
          </button>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            📋 Ver Plantillas
          </button>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            📊 Ir a Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFramework;