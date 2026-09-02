import React from 'react';
import { Link } from 'react-router-dom';

const HelpHome: React.FC = () => {
  const categories = [
    {
      title: 'Recursos Educativos',
      icon: '📚',
      description: 'Guías, artículos y contenido educativo sobre gestión de proyectos',
      link: '/help/resources',
      color: 'blue'
    },
    {
      title: 'Herramientas PMI',
      icon: '🛠️',
      description: 'Calculadoras, plantillas y herramientas prácticas',
      link: '/help/tools',
      color: 'green'
    },
    {
      title: 'Guías Paso a Paso',
      icon: '📖',
      description: 'Tutoriales detallados y metodologías',
      link: '/help/guides',
      color: 'purple'
    },
    {
      title: 'Cursos y Capacitación',
      icon: '🎓',
      description: 'Contenido de aprendizaje estructurado',
      link: '/help/courses',
      color: 'orange'
    }
  ];

  const featuredContent = [
    { title: 'Introducción a PMI', type: 'Guía', time: '15 min' },
    { title: 'Calculadora de Valor Ganado', type: 'Herramienta', time: '5 min' },
    { title: 'Gestión de Riesgos', type: 'Curso', time: '2 horas' },
    { title: 'Plantilla Project Charter', type: 'Template', time: '10 min' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Portal de Ayuda PMI-DataHelp</h1>
            <p className="text-xl mb-8 opacity-90">
              Tu centro de recursos para gestión de proyectos y metodologías PMI
            </p>
            <div className="max-w-md mx-auto">
              <input
                type="search"
                placeholder="Buscar recursos, herramientas o guías..."
                className="w-full px-4 py-3 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Explora por Categoría
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Content */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Contenido Destacado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredContent.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {item.type}
                  </span>
                  <span className="text-gray-500 text-xs">{item.time}</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  Acceder →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">150+</div>
            <div className="text-gray-600">Recursos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">25+</div>
            <div className="text-gray-600">Herramientas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">40+</div>
            <div className="text-gray-600">Guías</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">12</div>
            <div className="text-gray-600">Cursos</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Necesitas acceso al Dashboard Ejecutivo?
          </h2>
          <p className="text-gray-600 mb-6">
            El Portal PMO Morris ofrece herramientas avanzadas para gestión de portafolios y análisis ejecutivo
          </p>
          <Link
            to="/pmo"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center"
          >
            🏢 Acceder al Portal PMO
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HelpHome;