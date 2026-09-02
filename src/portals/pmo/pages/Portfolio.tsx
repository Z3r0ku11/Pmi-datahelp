import React from 'react';

const Portfolio: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Gestión de Portafolio</h1>
      <p className="mt-2 text-lg text-gray-600">Vista consolidada del portafolio de proyectos</p>
      
      <div className="mt-8 bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">📁</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Portafolio de Proyectos</h2>
        <p className="text-gray-600">Funcionalidad en desarrollo</p>
      </div>
    </div>
  );
};

export default Portfolio;