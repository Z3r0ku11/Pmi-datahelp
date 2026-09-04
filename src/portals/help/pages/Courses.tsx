import React from 'react';

const Courses: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cursos y Capacitación</h1>
        <p className="mt-2 text-lg text-gray-600">
          Contenido de aprendizaje estructurado para desarrollar tus competencias
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">🎓</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Fundamentos de Gestión de Proyectos</h3>
              <p className="text-sm text-gray-500">Nivel: Principiante</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Curso introductorio que cubre los conceptos básicos y las mejores prácticas de la gestión de proyectos según PMI.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-4">⏱️ 8 horas</span>
              <span className="mr-4">📚 12 módulos</span>
              <span>🏆 Certificado</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Iniciar Curso
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">📊</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Preparación PMP®</h3>
              <p className="text-sm text-gray-500">Nivel: Avanzado</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Preparación completa para el examen PMP® con ejercicios prácticos y simulacros.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-4">⏱️ 35 horas</span>
              <span className="mr-4">📚 25 módulos</span>
              <span>🎯 Simulacros</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Iniciar Curso
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">⚡</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Metodologías Ágiles</h3>
              <p className="text-sm text-gray-500">Nivel: Intermedio</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Scrum, Kanban y otras metodologías ágiles aplicadas a la gestión de proyectos.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-4">⏱️ 12 horas</span>
              <span className="mr-4">📚 8 módulos</span>
              <span>🛠️ Práctico</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
            Iniciar Curso
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">👥</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Liderazgo en Proyectos</h3>
              <p className="text-sm text-gray-500">Nivel: Intermedio</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Desarrollo de habilidades de liderazgo y gestión de equipos de proyecto.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-4">⏱️ 6 horas</span>
              <span className="mr-4">📚 8 módulos</span>
              <span>🎭 Casos</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
            Iniciar Curso
          </button>
        </div>
      </div>
    </div>
  );
};

export default Courses;