import React from 'react';

const Tools: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Herramientas PMI</h1>
        <p className="mt-2 text-lg text-gray-600">
          Calculadoras y herramientas prácticas para gestión de proyectos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-4">📈</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Calculadora de Valor Ganado</h3>
          <p className="text-gray-600 mb-4">EV, PV, AC, CPI, SPI y más métricas</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Usar Herramienta
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Matriz de Riesgos</h3>
          <p className="text-gray-600 mb-4">Evaluación de probabilidad e impacto</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Usar Herramienta
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-4">⏱️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Estimador PERT</h3>
          <p className="text-gray-600 mb-4">Estimación de tiempo con técnica PERT</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Usar Herramienta
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-4">💵</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ROI y Payback</h3>
          <p className="text-gray-600 mb-4">Cálculo de retorno de inversión</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Usar Herramienta
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Matriz de Stakeholders</h3>
          <p className="text-gray-600 mb-4">Análisis de poder e interés</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Usar Herramienta
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Generador de WBS</h3>
          <p className="text-gray-600 mb-4">Estructura de desglose del trabajo</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Usar Herramienta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tools;