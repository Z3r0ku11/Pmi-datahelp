import React from 'react';
import { AlertTriangle, Shield, TrendingDown } from 'lucide-react';

const Risks: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Matriz de Riesgos</h1>
        <p className="text-gray-600 mt-1">Análisis y monitoreo de riesgos del portfolio</p>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="dashboard-card text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">16</div>
          <div className="text-sm text-gray-600">Riesgos Totales</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">4</div>
          <div className="text-sm text-gray-600">Riesgos Altos</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-2">6</div>
          <div className="text-sm text-gray-600">Riesgos Medios</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">6</div>
          <div className="text-sm text-gray-600">Riesgos Bajos</div>
        </div>
      </div>

      <div className="dashboard-card text-center py-12">
        <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Matriz de Riesgos
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          El análisis detallado de riesgos y la matriz interactiva estarán disponibles próximamente.
          Incluirá impacto vs probabilidad y planes de mitigación.
        </p>
      </div>
    </div>
  );
};

export default Risks;