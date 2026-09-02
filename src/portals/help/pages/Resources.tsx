import React from 'react';

const Resources: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recursos Educativos</h1>
        <p className="mt-2 text-lg text-gray-600">
          Biblioteca completa de recursos para gestión de proyectos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Fundamentos de PMI</h3>
          <p className="text-gray-600 mb-4">Conceptos básicos y metodologías estándar</p>
          <button className="text-green-600 hover:text-green-700 font-medium">
            Explorar →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Alcance</h3>
          <p className="text-gray-600 mb-4">Definición y control del alcance del proyecto</p>
          <button className="text-green-600 hover:text-green-700 font-medium">
            Explorar →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-4">⏰</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Tiempo</h3>
          <p className="text-gray-600 mb-4">Planificación y control de cronogramas</p>
          <button className="text-green-600 hover:text-green-700 font-medium">
            Explorar →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-4">💰</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Costos</h3>
          <p className="text-gray-600 mb-4">Control presupuestario y estimaciones</p>
          <button className="text-green-600 hover:text-green-700 font-medium">
            Explorar →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Riesgos</h3>
          <p className="text-gray-600 mb-4">Identificación y mitigación de riesgos</p>
          <button className="text-green-600 hover:text-green-700 font-medium">
            Explorar →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Equipos</h3>
          <p className="text-gray-600 mb-4">Liderazgo y desarrollo del equipo</p>
          <button className="text-green-600 hover:text-green-700 font-medium">
            Explorar →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resources;