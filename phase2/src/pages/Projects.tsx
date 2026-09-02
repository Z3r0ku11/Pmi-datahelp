import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Calendar, 
  DollarSign, 
  User, 
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause
} from 'lucide-react';
import { Project, ProjectStatus, ProjectCategory } from '@shared/types';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock projects data based on the dashboard
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Actualización Core Financiero',
        description: 'Migración del sistema core bancario a nueva plataforma cloud-native',
        status: 'in-progress',
        priority: 'critical',
        manager: 'Juan Pérez',
        sponsor: 'CFO',
        client: 'Banco A',
        category: 'infrastructure',
        startDate: '2024-01-15',
        endDate: '2024-08-30',
        plannedEndDate: '2024-08-30',
        budget: {
          planned: 2160000,
          actual: 1850000,
          remaining: 310000,
          currency: 'USD'
        },
        progress: {
          percentage: 75,
          tasksCompleted: 340,
          tasksTotal: 453,
          milestonesCompleted: 6,
          milestonesTotal: 8
        },
        risks: [],
        team: [],
        timeline: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Implementación BPA Finanzas',
        description: 'Automatización de procesos de conciliación y reportería financiera',
        status: 'in-progress',
        priority: 'high',
        manager: 'María Gómez',
        sponsor: 'CEO',
        client: 'Retail B',
        category: 'software-development',
        startDate: '2024-02-01',
        endDate: '2024-09-15',
        plannedEndDate: '2024-09-15',
        budget: {
          planned: 2500000,
          actual: 1200000,
          remaining: 1300000,
          currency: 'USD'
        },
        progress: {
          percentage: 48,
          tasksCompleted: 156,
          tasksTotal: 325,
          milestonesCompleted: 3,
          milestonesTotal: 7
        },
        risks: [],
        team: [],
        timeline: [],
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20'
      },
      {
        id: '3',
        name: 'Integración API Marketplaces',
        description: 'Conectores para múltiples plataformas de e-commerce y marketplaces',
        status: 'at-risk',
        priority: 'medium',
        manager: 'Carlos Rojas',
        sponsor: 'COO',
        client: 'Gobierno C',
        category: 'digital-transformation',
        startDate: '2024-03-01',
        endDate: '2024-10-30',
        plannedEndDate: '2024-10-30',
        budget: {
          planned: 2500000,
          actual: 980000,
          remaining: 1520000,
          currency: 'USD'
        },
        progress: {
          percentage: 32,
          tasksCompleted: 89,
          tasksTotal: 278,
          milestonesCompleted: 2,
          milestonesTotal: 6
        },
        risks: [],
        team: [],
        timeline: [],
        createdAt: '2024-02-15',
        updatedAt: '2024-02-20'
      },
      {
        id: '4',
        name: 'Lanzamiento Producto X',
        description: 'Nueva línea de productos digitales para el mercado corporativo',
        status: 'delayed',
        priority: 'high',
        manager: 'Ana Torres',
        sponsor: 'CMO',
        client: 'Aseguradora D',
        category: 'digital-transformation',
        startDate: '2024-01-10',
        endDate: '2024-07-15',
        plannedEndDate: '2024-06-15',
        budget: {
          planned: 3000000,
          actual: 2100000,
          remaining: 900000,
          currency: 'USD'
        },
        progress: {
          percentage: 70,
          tasksCompleted: 210,
          tasksTotal: 300,
          milestonesCompleted: 4,
          milestonesTotal: 6
        },
        risks: [],
        team: [],
        timeline: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10'
      }
    ];

    setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'at-risk':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'delayed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'on-hold':
        return <Pause className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case 'planning': return 'Planificación';
      case 'in-progress': return 'En Curso';
      case 'at-risk': return 'En Riesgo';
      case 'delayed': return 'Con Retraso';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      case 'on-hold': return 'En Espera';
      default: return status;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="corporate-skeleton title w-64 h-8"></div>
        <div className="corporate-skeleton text w-96 h-4"></div>
        <div className="projects-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="dashboard-card">
              <div className="corporate-skeleton title w-48 h-6 mb-3"></div>
              <div className="corporate-skeleton text w-full h-4 mb-2"></div>
              <div className="corporate-skeleton text w-3/4 h-4 mb-4"></div>
              <div className="corporate-skeleton text w-32 h-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Proyectos</h1>
          <p className="text-gray-600 mt-1">Monitoreo y seguimiento detallado del portfolio</p>
        </div>
        
        <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Buscar proyectos, clientes, responsables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="planning">Planificación</option>
              <option value="in-progress">En Curso</option>
              <option value="at-risk">En Riesgo</option>
              <option value="delayed">Con Retraso</option>
              <option value="completed">Completado</option>
              <option value="on-hold">En Espera</option>
            </select>
          </div>
          
          <div>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              <option value="digital-transformation">Transformación Digital</option>
              <option value="software-development">Desarrollo Software</option>
              <option value="infrastructure">Infraestructura</option>
              <option value="data-analytics">Data & Analytics</option>
              <option value="other">Otros</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="dashboard-card text-center">
          <div className="text-2xl font-bold text-gray-900">{filteredProjects.length}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredProjects.filter(p => p.status === 'in-progress').length}
          </div>
          <div className="text-sm text-gray-600">En Curso</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredProjects.filter(p => p.status === 'at-risk').length}
          </div>
          <div className="text-sm text-gray-600">En Riesgo</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-2xl font-bold text-red-600">
            {filteredProjects.filter(p => p.status === 'delayed').length}
          </div>
          <div className="text-sm text-gray-600">Retrasados</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredProjects.filter(p => p.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Completados</div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div key={project.id} className={`project-card status-${project.status}`}>
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Status and Priority */}
            <div className="flex items-center space-x-3 mb-4">
              <div className={`status-indicator ${project.status}`}>
                {getStatusIcon(project.status)}
                <span className="ml-1">{getStatusText(project.status)}</span>
              </div>
              <div className={`priority-indicator ${project.priority}`}>
                {project.priority}
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Progreso</span>
                <span className="font-medium">{project.progress.percentage}%</span>
              </div>
              <div className="progress-bar-corporate">
                <div 
                  className={`progress-fill-corporate ${
                    project.progress.percentage >= 70 ? 'high' : 
                    project.progress.percentage >= 40 ? 'medium' : 'low'
                  }`}
                  style={{ width: `${project.progress.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {project.progress.tasksCompleted}/{project.progress.tasksTotal} tareas • {' '}
                {project.progress.milestonesCompleted}/{project.progress.milestonesTotal} hitos
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  <span>PM:</span>
                </div>
                <span className="font-medium text-gray-900">{project.manager}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <span>Cliente:</span>
                </div>
                <span className="font-medium text-gray-900">{project.client}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>Presupuesto:</span>
                </div>
                <span className="font-medium text-gray-900">
                  {formatCurrency(project.budget.planned, project.budget.currency)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Fin Planeado:</span>
                </div>
                <span className="font-medium text-gray-900">{formatDate(project.plannedEndDate)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
              <button className="flex-1 px-3 py-2 text-sm text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 transition-colors">
                Ver Detalle
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                Actualizar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No se encontraron proyectos
          </h3>
          <p className="text-gray-600 mb-4">
            No hay proyectos que coincidan con los filtros seleccionados.
          </p>
          <button 
            className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;