import React from 'react';
import { Users, Clock, TrendingUp, AlertCircle } from 'lucide-react';

const Resources: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Recursos</h1>
        <p className="text-gray-600 mt-1">Asignación y utilización de recursos del portfolio</p>
      </div>

      <div className="dashboard-card text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Módulo en Desarrollo
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          La gestión de recursos estará disponible en la próxima versión del dashboard.
          Incluirá asignación de equipos, matriz de competencias y análisis de capacidad.
        </p>
      </div>
    </div>
  );
};

export default Resources;