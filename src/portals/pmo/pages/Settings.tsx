import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
      <p className="mt-2 text-lg text-gray-600">Configuración y administración del Portal PMO</p>
      
      <div className="mt-8 bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">⚙️</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Panel de Configuración</h2>
        <p className="text-gray-600">Funcionalidad en desarrollo</p>
      </div>
    </div>
  );
};

export default Settings;