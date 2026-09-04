import React from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes Ejecutivos</h1>
        <p className="text-gray-600 mt-1">Generación de reportes y análisis del portfolio</p>
      </div>

      <div className="dashboard-card text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Centro de Reportes
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          La generación automática de reportes ejecutivos estará disponible próximamente.
          Incluirá dashboards personalizables y exportación a PDF/Excel.
        </p>
        <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Download className="w-4 h-4 inline mr-2" />
          Próximamente
        </button>
      </div>
    </div>
  );
};

export default Reports;