import React from 'react';

const Guides: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Guías Paso a Paso</h1>
        <p className="mt-2 text-lg text-gray-600">
          Tutoriales detallados y metodologías prácticas
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start">
            <div className="text-2xl mr-4">📋</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cómo crear un Project Charter efectivo
              </h3>
              <p className="text-gray-600 mb-4">
                Guía completa para definir y documentar la autorización formal del proyecto
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">Iniciación</span>
                <span>⏱️ 20 min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start">
            <div className="text-2xl mr-4">🗺️</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Desarrollo de cronograma con ruta crítica
              </h3>
              <p className="text-gray-600 mb-4">
                Metodología para crear cronogramas realistas y identificar la ruta crítica
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">Planificación</span>
                <span>⏱️ 35 min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start">
            <div className="text-2xl mr-4">💰</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Estimación de costos bottom-up vs top-down
              </h3>
              <p className="text-gray-600 mb-4">
                Técnicas de estimación y cuándo usar cada metodología
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded mr-2">Costos</span>
                <span>⏱️ 25 min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start">
            <div className="text-2xl mr-4">⚠️</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Implementación de gestión de riesgos
              </h3>
              <p className="text-gray-600 mb-4">
                Proceso completo desde identificación hasta respuesta a riesgos
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded mr-2">Riesgos</span>
                <span>⏱️ 30 min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start">
            <div className="text-2xl mr-4">📊</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Control del valor ganado en la práctica
              </h3>
              <p className="text-gray-600 mb-4">
                Implementación práctica del EVM para seguimiento de proyectos
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded mr-2">Control</span>
                <span>⏱️ 40 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guides;