import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Search, Filter, BookOpen, Video, Link as LinkIcon } from 'lucide-react';
import { Resource } from '@shared/types';

const Resources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock resources data
  const resources: Resource[] = [
    {
      id: '1',
      title: 'PMBOK Guide (7th Edition) - Resumen Ejecutivo',
      type: 'pdf',
      url: '#',
      description: 'Resumen de los principales cambios y conceptos del PMBOK 7ma edición'
    },
    {
      id: '2',
      title: 'Plantilla WBS Excel',
      type: 'link',
      url: '#',
      description: 'Plantilla prediseñada para crear Work Breakdown Structure'
    },
    {
      id: '3',
      title: 'Calculadora de Puntos de Función',
      type: 'tool',
      url: '#',
      description: 'Herramienta online para estimar esfuerzo de proyectos de software'
    },
    {
      id: '4',
      title: 'Video: Gestión de Riesgos en la Práctica',
      type: 'video',
      url: '#',
      description: 'Webinar de 45 minutos sobre identificación y mitigación de riesgos'
    },
    {
      id: '5',
      title: 'Checklist de Cierre de Proyecto',
      type: 'pdf',
      url: '#',
      description: 'Lista de verificación completa para el cierre formal de proyectos'
    },
    {
      id: '6',
      title: 'Agile Project Charter Template',
      type: 'link',
      url: '#',
      description: 'Plantilla de Acta de Constitución para proyectos ágiles'
    },
    {
      id: '7',
      title: 'PMI-ACP Study Guide',
      type: 'pdf',
      url: '#',
      description: 'Guía de estudio completa para la certificación PMI-ACP'
    },
    {
      id: '8',
      title: 'Matriz de Trazabilidad de Requisitos',
      type: 'link',
      url: '#',
      description: 'Plantilla Excel para gestionar la trazabilidad de requisitos'
    },
    {
      id: '9',
      title: 'Video: Liderazgo en Equipos Remotos',
      type: 'video',
      url: '#',
      description: 'Estrategias efectivas para liderar equipos distribuidos geográficamente'
    },
    {
      id: '10',
      title: 'Simulador de Examen PMP',
      type: 'tool',
      url: '#',
      description: 'Pruebas de práctica con 200 preguntas actualizadas del PMP'
    }
  ];

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'templates', label: 'Plantillas' },
    { value: 'guides', label: 'Guías de Estudio' },
    { value: 'tools', label: 'Herramientas' },
    { value: 'certification', label: 'Certificación' },
    { value: 'agile', label: 'Metodologías Ágiles' }
  ];

  const types = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'pdf', label: 'Documentos PDF' },
    { value: 'link', label: 'Enlaces y Plantillas' },
    { value: 'video', label: 'Videos' },
    { value: 'tool', label: 'Herramientas Online' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    // For demo purposes, we'll match categories based on keywords in title/description
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'templates' && (resource.title.toLowerCase().includes('template') || resource.title.toLowerCase().includes('plantilla'))) ||
                           (selectedCategory === 'certification' && (resource.title.toLowerCase().includes('pmp') || resource.title.toLowerCase().includes('acp'))) ||
                           (selectedCategory === 'agile' && resource.title.toLowerCase().includes('agile')) ||
                           (selectedCategory === 'tools' && resource.type === 'tool') ||
                           (selectedCategory === 'guides' && (resource.title.toLowerCase().includes('guide') || resource.title.toLowerCase().includes('guía')));
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'tool': return LinkIcon;
      default: return ExternalLink;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'text-red-600 bg-red-50';
      case 'video': return 'text-blue-600 bg-blue-50';
      case 'tool': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'video': return 'Video';
      case 'tool': return 'Herramienta';
      case 'link': return 'Enlace';
      default: return 'Recurso';
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Recursos Premium
        </h1>
        <p className="text-xl text-gray-600">
          Documentos, plantillas, videos y herramientas para potenciar tu desarrollo profesional
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="label">Buscar recursos</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="input pl-10"
                placeholder="Buscar por título o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="label">Tipo</label>
            <select 
              className="input"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {types.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="label">Categoría</label>
            <select 
              className="input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">{filteredResources.length}</div>
          <div className="text-gray-600">Recursos encontrados</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">
            {filteredResources.filter(r => r.type === 'pdf').length}
          </div>
          <div className="text-gray-600">Documentos PDF</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {filteredResources.filter(r => r.type === 'video').length}
          </div>
          <div className="text-gray-600">Videos</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {filteredResources.filter(r => r.type === 'tool').length}
          </div>
          <div className="text-gray-600">Herramientas</div>
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {filteredResources.map((resource) => {
          const Icon = getResourceIcon(resource.type);
          const colorClasses = getResourceColor(resource.type);
          
          return (
            <div key={resource.id} className="resource-link">
              <div className={`p-3 rounded-lg ${colorClasses} mr-4`}>
                <Icon className="h-6 w-6" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {resource.description}
                    </p>
                    <div className="flex items-center space-x-3">
                      <span className="badge category text-xs">
                        {getTypeLabel(resource.type)}
                      </span>
                      <span className="text-gray-400 text-xs">
                        Disponible para descarga
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <ExternalLink className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BookOpen className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No se encontraron recursos
          </h3>
          <p className="text-gray-600 mb-4">
            No hay recursos que coincidan con los filtros seleccionados.
          </p>
          <button 
            className="btn-outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedCategory('all');
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Featured Collections */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Colecciones Destacadas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Kit de Inicio PMP',
              description: 'Todo lo que necesitas para comenzar tu preparación PMP',
              resources: 12,
              color: 'bg-blue-50 border-blue-200'
            },
            {
              title: 'Plantillas Esenciales',
              description: 'Plantillas más utilizadas por gestores de proyectos',
              resources: 8,
              color: 'bg-green-50 border-green-200'
            },
            {
              title: 'Metodologías Ágiles',
              description: 'Recursos especializados en Scrum, Kanban y SAFe',
              resources: 15,
              color: 'bg-purple-50 border-purple-200'
            }
          ].map((collection, index) => (
            <div key={index} className={`card ${collection.color}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {collection.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {collection.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {collection.resources} recursos
                </span>
                <button className="btn-primary text-sm">
                  Ver colección
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Access CTA */}
      <div className="card mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Acceso Premium Completo
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Desbloquea todos los recursos, plantillas exclusivas, videos premium y 
            herramientas avanzadas para potenciar tu carrera en gestión de proyectos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn bg-white text-blue-600 hover:bg-gray-100">
              Obtener Acceso Premium
            </button>
            <button className="btn border-white text-white hover:bg-white hover:text-blue-600">
              Ver planes y precios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;