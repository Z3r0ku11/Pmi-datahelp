import React from 'react';

const Templates: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Plantillas y Documentos</h1>
        <p className="mt-2 text-lg text-gray-600">
          Plantillas descargables para acelerar tu trabajo de gestión de proyectos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">📋</div>
            <div>
              <h3 className="font-semibold text-gray-900">Project Charter</h3>
              <p className="text-sm text-gray-500">Documento de autorización</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Plantilla completa para documentar la autorización formal del proyecto con todos los elementos requeridos.
          </p>
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700">
              📄 Word
            </button>
            <button className="flex-1 bg-green-600 text-white text-sm py-2 px-3 rounded hover:bg-green-700">
              📊 Excel
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">🗂️</div>
            <div>
              <h3 className="font-semibold text-gray-900">Plan de Gestión</h3>
              <p className="text-sm text-gray-500">Plan maestro del proyecto</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Plantilla integral que incluye todos los planes subsidiarios y documentos de gestión.
          </p>
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700">
              📄 Word
            </button>
            <button className="flex-1 bg-red-600 text-white text-sm py-2 px-3 rounded hover:bg-red-700">
              📑 PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">⚠️</div>
            <div>
              <h3 className="font-semibold text-gray-900">Registro de Riesgos</h3>
              <p className="text-sm text-gray-500">Matriz de riesgos</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Registro completo para identificar, analizar y gestionar los riesgos del proyecto.
          </p>
          <div className="flex space-x-2">
            <button className="flex-1 bg-green-600 text-white text-sm py-2 px-3 rounded hover:bg-green-700">
              📊 Excel
            </button>
            <button className="flex-1 bg-purple-600 text-white text-sm py-2 px-3 rounded hover:bg-purple-700">
              🔗 Online
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">👥</div>
            <div>
              <h3 className="font-semibold text-gray-900">Matriz de Stakeholders</h3>
              <p className="text-sm text-gray-500">Análisis de interesados</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Herramienta para mapear y analizar a todos los stakeholders del proyecto.
          </p>
          <div className="flex space-x-2">
            <button className="flex-1 bg-green-600 text-white text-sm py-2 px-3 rounded hover:bg-green-700">
              📊 Excel
            </button>
            <button className="flex-1 bg-orange-600 text-white text-sm py-2 px-3 rounded hover:bg-orange-700">
              🎨 PowerPoint
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">📈</div>
            <div>
              <h3 className="font-semibold text-gray-900">Dashboard de Control</h3>
              <p className="text-sm text-gray-500">Métricas de seguimiento</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Dashboard ejecutivo para el seguimiento de métricas clave del proyecto.
          </p>
          <div className="flex space-x-2">
            <button className="flex-1 bg-green-600 text-white text-sm py-2 px-3 rounded hover:bg-green-700">
              📊 Excel
            </button>
            <button className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700">
              📊 Power BI
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">📝</div>
            <div>
              <h3 className="font-semibold text-gray-900">Lecciones Aprendidas</h3>
              <p className="text-sm text-gray-500">Documentación de cierre</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Plantilla para capturar y documentar las lecciones aprendidas del proyecto.
          </p>
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700">
              📄 Word
            </button>
            <button className="flex-1 bg-purple-600 text-white text-sm py-2 px-3 rounded hover:bg-purple-700">
              📋 Formulario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;