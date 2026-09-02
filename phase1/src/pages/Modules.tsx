import React, { useState, useEffect } from 'react';
import { Clock, Star, Play, CheckCircle, BookOpen } from 'lucide-react';
import { LearningModule } from '@shared/types';

const Modules: React.FC = () => {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - In production this would come from API
  useEffect(() => {
    const mockModules: LearningModule[] = [
      {
        id: '1',
        title: 'Fundamentos de Gestión de Proyectos',
        description: 'Introducción a los conceptos básicos de la gestión de proyectos según PMI',
        category: 'project-management',
        difficulty: 'beginner',
        estimatedTime: 120,
        content: [],
        resources: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '2',
        title: 'Gestión del Alcance del Proyecto',
        description: 'Planificación, definición y control del alcance del proyecto',
        category: 'scope-management',
        difficulty: 'intermediate',
        estimatedTime: 90,
        content: [],
        resources: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '3',
        title: 'Metodologías Ágiles y Scrum',
        description: 'Principios ágiles aplicados a la gestión de proyectos',
        category: 'agile',
        difficulty: 'intermediate',
        estimatedTime: 150,
        content: [],
        resources: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '4',
        title: 'Gestión de Riesgos Avanzada',
        description: 'Identificación, análisis y respuesta a riesgos del proyecto',
        category: 'risk-management',
        difficulty: 'advanced',
        estimatedTime: 180,
        content: [],
        resources: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '5',
        title: 'Gestión de Interesados',
        description: 'Identificación y gestión efectiva de stakeholders',
        category: 'stakeholder-management',
        difficulty: 'intermediate',
        estimatedTime: 100,
        content: [],
        resources: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '6',
        title: 'Control de Calidad en Proyectos',
        description: 'Aseguramiento y control de la calidad en entregables',
        category: 'quality-management',
        difficulty: 'advanced',
        estimatedTime: 160,
        content: [],
        resources: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ];

    setTimeout(() => {
      setModules(mockModules);
      setIsLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { value: 'all', label: 'Todos los módulos' },
    { value: 'project-management', label: 'Gestión de Proyectos' },
    { value: 'agile', label: 'Metodologías Ágiles' },
    { value: 'risk-management', label: 'Gestión de Riesgos' },
    { value: 'stakeholder-management', label: 'Gestión de Interesados' },
    { value: 'quality-management', label: 'Gestión de Calidad' },
    { value: 'scope-management', label: 'Gestión del Alcance' }
  ];

  const difficulties = [
    { value: 'all', label: 'Todos los niveles' },
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' }
  ];

  const filteredModules = modules.filter(module => {
    const categoryMatch = selectedCategory === 'all' || module.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <div className="skeleton h-8 w-64 mb-4"></div>
          <div className="skeleton h-4 w-96"></div>
        </div>
        <div className="modules-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-6 w-3/4 mb-3"></div>
              <div className="skeleton h-4 w-full mb-2"></div>
              <div className="skeleton h-4 w-2/3 mb-4"></div>
              <div className="flex justify-between">
                <div className="skeleton h-6 w-20"></div>
                <div className="skeleton h-6 w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Módulos Educativos
        </h1>
        <p className="text-xl text-gray-600">
          Aprende gestión de proyectos con contenido estructurado y casos prácticos
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
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
          <div className="flex-1">
            <label className="label">Dificultad</label>
            <select 
              className="input"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn-primary">
              Filtrar Módulos
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">{filteredModules.length}</div>
          <div className="text-gray-600">Módulos disponibles</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {Math.round(filteredModules.reduce((sum, m) => sum + m.estimatedTime, 0) / 60)}h
          </div>
          <div className="text-gray-600">Tiempo total estimado</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {filteredModules.filter(m => m.quiz).length}
          </div>
          <div className="text-gray-600">Con evaluación</div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="modules-grid">
        {filteredModules.map((module) => (
          <div 
            key={module.id} 
            className={`module-card ${module.difficulty}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span className={`badge ${module.difficulty}`}>
                  {module.difficulty}
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(module.estimatedTime)}
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {module.title}
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-3">
              {module.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {module.quiz && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Quiz incluido
                  </div>
                )}
              </div>
              <button className="btn-primary">
                <Play className="h-4 w-4 mr-2" />
                Comenzar
              </button>
            </div>

            {/* Progress indicator (if user is logged in and has progress) */}
            <div className="mt-4">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: '0%' }} // This would come from user progress
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Progreso: 0% completado
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BookOpen className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No hay módulos disponibles
          </h3>
          <p className="text-gray-600 mb-4">
            No se encontraron módulos que coincidan con los filtros seleccionados.
          </p>
          <button 
            className="btn-outline"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Learning Path Suggestion */}
      <div className="card mt-12 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Star className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              ¿No sabes por dónde empezar?
            </h3>
            <p className="text-blue-700 mb-4">
              Te recomendamos comenzar con los fundamentos y luego avanzar a módulos más específicos 
              según tus necesidades profesionales.
            </p>
            <button className="btn-primary bg-blue-600 hover:bg-blue-700">
              Ver ruta recomendada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modules;