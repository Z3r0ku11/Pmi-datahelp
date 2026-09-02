import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Users, 
  Target,
  Calendar,
  Filter
} from 'lucide-react';
import { PortfolioMetrics, Project } from '@shared/types';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [timeFilter, setTimeFilter] = useState('01/01/2024 - 31/12/2024');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data based on the dashboard image
  useEffect(() => {
    const mockMetrics: PortfolioMetrics = {
      totalProjects: 48,
      activeProjects: 48,
      completedProjects: 0, // Not visible in current period
      atRiskProjects: 8,
      delayedProjects: 5,
      totalBudget: 3800000, // US$ 3.8M
      budgetUtilized: 3800000,
      portfolioHealth: 92,
      plannedHours: 24650,
      activeClients: 18,
      activePMs: 9,
      pmUtilization: 82
    };

    setTimeout(() => {
      setMetrics(mockMetrics);
      setIsLoading(false);
    }, 1500);
  }, []);

  const getChangeIcon = (isPositive: boolean) => {
    return isPositive ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );
  };

  const getChangeClass = (isPositive: boolean) => {
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="corporate-skeleton title w-64 h-8 mb-2"></div>
            <div className="corporate-skeleton text w-96 h-4"></div>
          </div>
        </div>
        
        <div className="executive-summary">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="summary-card">
              <div className="corporate-skeleton metric w-16 h-8 mb-2 mx-auto"></div>
              <div className="corporate-skeleton text w-20 h-4 mx-auto"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Executive Summary</h1>
          <p className="text-gray-600 mt-1">Visión ejecutiva del portfolio de proyectos</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Filter */}
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select 
              className="text-sm border-none bg-transparent focus:outline-none"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="01/01/2024 - 31/12/2024">Todo 2024</option>
              <option value="01/10/2024 - 31/12/2024">Q4 2024</option>
              <option value="01/07/2024 - 30/09/2024">Q3 2024</option>
            </select>
          </div>
          
          <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="executive-summary">
        {/* Portfolio Health */}
        <div className="summary-card projects dashboard-card-appear">
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <div className="metric-value text-green-600">{metrics.portfolioHealth}%</div>
          <div className="metric-label">Salud del Portfolio</div>
          <div className="metric-change positive">
            {getChangeIcon(true)}
            <span className="ml-1">8% vs mes anterior</span>
          </div>
        </div>

        {/* Active Projects */}
        <div className="summary-card projects dashboard-card-appear" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-center mb-3">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <div className="metric-value text-blue-600">{metrics.activeProjects}</div>
          <div className="metric-label">Proyectos Activos</div>
          <div className="metric-change positive">
            {getChangeIcon(true)}
            <span className="ml-1">4 vs mes anterior</span>
          </div>
        </div>

        {/* At Risk Projects */}
        <div className="summary-card timeline dashboard-card-appear" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-center mb-3">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="metric-value text-yellow-600">{metrics.atRiskProjects}</div>
          <div className="metric-label">Proyectos en Riesgo</div>
          <div className="metric-change negative">
            {getChangeIcon(false)}
            <span className="ml-1">2 vs mes anterior</span>
          </div>
        </div>

        {/* Delayed Projects */}
        <div className="summary-card timeline dashboard-card-appear" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-center mb-3">
            <Clock className="w-8 h-8 text-red-600" />
          </div>
          <div className="metric-value text-red-600">{metrics.delayedProjects}</div>
          <div className="metric-label">Proyectos con Retraso</div>
          <div className="metric-change negative">
            {getChangeIcon(false)}
            <span className="ml-1">1 vs mes anterior</span>
          </div>
        </div>

        {/* Total Budget */}
        <div className="summary-card budget dashboard-card-appear" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-center mb-3">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <div className="metric-value text-green-600">US$ 3.8M</div>
          <div className="metric-label">Presupuesto Total</div>
          <div className="metric-change positive">
            {getChangeIcon(true)}
            <span className="ml-1">12% vs año anterior</span>
          </div>
        </div>

        {/* Planned Hours */}
        <div className="summary-card timeline dashboard-card-appear" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-center mb-3">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <div className="metric-value text-blue-600">24,650</div>
          <div className="metric-label">Horas Planificadas</div>
          <div className="metric-change positive">
            {getChangeIcon(true)}
            <span className="ml-1">6% vs año anterior</span>
          </div>
        </div>

        {/* Active Clients */}
        <div className="summary-card team dashboard-card-appear" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-center mb-3">
            <Users className="w-8 h-8 text-teal-600" />
          </div>
          <div className="metric-value text-teal-600">{metrics.activeClients}</div>
          <div className="metric-label">Clientes Activos</div>
          <div className="metric-change positive">
            {getChangeIcon(true)}
            <span className="ml-1">3 vs mes anterior</span>
          </div>
        </div>

        {/* PM Utilization */}
        <div className="summary-card team dashboard-card-appear" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-center justify-center mb-3">
            <Users className="w-8 h-8 text-orange-600" />
          </div>
          <div className="metric-value text-orange-600">{metrics.pmUtilization}%</div>
          <div className="metric-label">Utilización PM</div>
          <div className="metric-change neutral">
            <span className="text-gray-600">{metrics.activePMs} Responsables</span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Project Distribution */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">En Curso</span>
              </div>
              <div className="text-sm font-medium">28 (58%)</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">En Riesgo</span>
              </div>
              <div className="text-sm font-medium">8 (17%)</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Con Retraso</span>
              </div>
              <div className="text-sm font-medium">5 (10%)</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">En Espera</span>
              </div>
              <div className="text-sm font-medium">4 (8%)</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Finalizado</span>
              </div>
              <div className="text-sm font-medium">3 (7%)</div>
            </div>
          </div>
        </div>

        {/* Budget by Client */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Presupuesto por Cliente</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Banco A</span>
              <span className="text-sm font-medium">US$ 1.2M (32%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Retail B</span>
              <span className="text-sm font-medium">US$ 0.9M (24%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Gobierno C</span>
              <span className="text-sm font-medium">US$ 0.7M (18%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Aseguradora D</span>
              <span className="text-sm font-medium">US$ 0.5M (13%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Otros</span>
              <span className="text-sm font-medium">US$ 0.5M (13%)</span>
            </div>
          </div>
        </div>

        {/* Governance Indicators */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gobernanza</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-800 font-bold text-sm">98%</span>
                </div>
                <span className="text-sm text-gray-600">Proyectos con Sponsor</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-800 font-bold text-sm">100%</span>
                </div>
                <span className="text-sm text-gray-600">Proyectos con PM Asignado</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-800 font-bold text-sm">91%</span>
                </div>
                <span className="text-sm text-gray-600">Actualizados &lt; 7 días</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-800 font-bold text-sm">4</span>
                </div>
                <span className="text-sm text-gray-600">Sin actualización &gt; 15 días</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-800 font-bold text-sm">7</span>
                </div>
                <span className="text-sm text-gray-600">Próximos a vencer</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-800 font-bold text-sm">5</span>
                </div>
                <span className="text-sm text-gray-600">Con retraso</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
          Exportar Reporte
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default Dashboard;