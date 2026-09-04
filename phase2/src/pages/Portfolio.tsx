import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, Users, BarChart3, PieChart } from 'lucide-react';
import { PortfolioMetrics } from '@shared/types';

const Portfolio: React.FC = () => {
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mockMetrics: PortfolioMetrics = {
      totalProjects: 48,
      activeProjects: 48,
      completedProjects: 12,
      atRiskProjects: 8,
      delayedProjects: 5,
      totalBudget: 3800000,
      budgetUtilized: 2900000,
      portfolioHealth: 92,
      plannedHours: 24650,
      activeClients: 18,
      activePMs: 9,
      pmUtilization: 82
    };

    setTimeout(() => {
      setMetrics(mockMetrics);
      setIsLoading(false);
    }, 1200);
  }, [selectedPeriod]);

  const projectsByResponsible = [
    { name: 'Juan Pérez', projects: 12, utilization: 95 },
    { name: 'María Gómez', projects: 10, utilization: 88 },
    { name: 'Carlos Rojas', projects: 8, utilization: 92 },
    { name: 'Ana Torres', projects: 6, utilization: 85 },
    { name: 'Luis Hernández', projects: 4, utilization: 78 },
    { name: 'Otros', projects: 8, utilization: 75 }
  ];

  const projectsByClient = [
    { name: 'Banco A', projects: 10, budget: 1200000 },
    { name: 'Retail B', projects: 8, budget: 900000 },
    { name: 'Gobierno C', projects: 6, budget: 700000 },
    { name: 'Aseguradora D', projects: 5, budget: 500000 },
    { name: 'Manufactura E', projects: 4, budget: 400000 },
    { name: 'Otros', projects: 15, budget: 100000 }
  ];

  const projectsByType = [
    { name: 'Transformación Digital', count: 12, percentage: 29, color: 'bg-blue-500' },
    { name: 'Desarrollo de Software', count: 10, percentage: 25, color: 'bg-green-500' },
    { name: 'Infraestructura', count: 8, percentage: 17, color: 'bg-orange-500' },
    { name: 'Data & Analytics', count: 7, percentage: 15, color: 'bg-purple-500' },
    { name: 'Otros', count: 7, percentage: 14, color: 'bg-gray-500' }
  ];

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="corporate-skeleton title w-80 h-8 mb-4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="dashboard-card">
              <div className="corporate-skeleton title w-48 h-6 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="corporate-skeleton text w-full h-4"></div>
                ))}
              </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Análisis de Portfolio</h1>
          <p className="text-gray-600 mt-1">Vista estratégica del portfolio de proyectos</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="2024">Año 2024</option>
            <option value="Q4-2024">Q4 2024</option>
            <option value="Q3-2024">Q3 2024</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dashboard-card text-center">
          <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-blue-600 mb-2">{metrics.portfolioHealth}%</div>
          <div className="text-sm text-gray-600">Salud del Portfolio</div>
          <div className="text-xs text-green-600 mt-1">+5% vs mes anterior</div>
        </div>
        
        <div className="dashboard-card text-center">
          <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-green-600 mb-2">
            ${(metrics.totalBudget / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-gray-600">Inversión Total</div>
          <div className="text-xs text-blue-600 mt-1">
            ${(metrics.budgetUtilized / 1000000).toFixed(1)}M ejecutado
          </div>
        </div>
        
        <div className="dashboard-card text-center">
          <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {(metrics.plannedHours / 1000).toFixed(0)}K
          </div>
          <div className="text-sm text-gray-600">Horas Planificadas</div>
          <div className="text-xs text-gray-600 mt-1">24,650 horas totales</div>
        </div>
        
        <div className="dashboard-card text-center">
          <Users className="w-8 h-8 text-orange-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-orange-600 mb-2">{metrics.pmUtilization}%</div>
          <div className="text-sm text-gray-600">Utilización PM</div>
          <div className="text-xs text-gray-600 mt-1">{metrics.activePMs} responsables</div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Projects by Responsible */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Proyectos por Responsable</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {projectsByResponsible.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.projects} proyectos</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{item.utilization}%</div>
                  <div className="w-12 h-1 bg-gray-200 rounded-full mt-1">
                    <div 
                      className={`h-full rounded-full ${
                        item.utilization >= 90 ? 'bg-red-500' : 
                        item.utilization >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(item.utilization, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects by Client */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Proyectos por Cliente</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {projectsByClient.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.projects} proyectos</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    ${(item.budget / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-500">
                    {((item.budget / metrics.totalBudget) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects by Type */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Proyectos por Tipo</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {projectsByType.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.count}</div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">{item.percentage}% del total</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evolution Chart Placeholder */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Evolución de Proyectos</h3>
          <div className="text-sm text-gray-500">(Proyectos creados por mes)</div>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <div className="text-lg font-medium text-gray-900 mb-2">Gráfico de Tendencias</div>
            <div className="text-sm text-gray-500">
              Visualización de la evolución mensual del portfolio
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-4 text-center text-sm">
          {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'].map((month, index) => (
            <div key={month}>
              <div className="font-medium text-gray-900">{month}</div>
              <div className="text-blue-600">{10 + index + 2}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline and Milestones */}
      <div className="dashboard-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline de Proyectos</h3>
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Próximos hitos importantes del portfolio
          </div>
          
          {/* Sample timeline items */}
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Proyecto Alpha - Banco A</div>
                <div className="text-xs text-gray-500">05/ago/2024 - 9 días restantes</div>
              </div>
              <div className="text-sm text-green-600 font-medium">En Curso</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Proyecto Beta - Retail B</div>
                <div className="text-xs text-gray-500">12/ago/2024 - 16 días restantes</div>
              </div>
              <div className="text-sm text-yellow-600 font-medium">En Riesgo</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Proyecto Gamma - Gobierno C</div>
                <div className="text-xs text-gray-500">18/ago/2024 - 22 días restantes</div>
              </div>
              <div className="text-sm text-blue-600 font-medium">En Curso</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Proyecto Delta - Aseguradora D</div>
                <div className="text-xs text-gray-500">25/ago/2024 - 29 días restantes</div>
              </div>
              <div className="text-sm text-red-600 font-medium">En Curso</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Proyecto Epsilon - Manufactura E</div>
                <div className="text-xs text-gray-500">30/ago/2024 - 34 días restantes</div>
              </div>
              <div className="text-sm text-purple-600 font-medium">En Curso</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;