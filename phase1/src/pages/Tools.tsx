import React, { useState } from 'react';
import { Calculator, Grid3X3, Target, GitBranch, PieChart, CheckSquare, Users, Clock } from 'lucide-react';

const Tools: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  const tools = [
    {
      id: 'evm',
      icon: Calculator,
      title: 'Calculadora EVM',
      description: 'Análisis del Valor Ganado (Earned Value Management)',
      category: 'cost-management',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'raci',
      icon: Grid3X3,
      title: 'Matriz RACI',
      description: 'Responsible, Accountable, Consulted, Informed',
      category: 'stakeholder-management',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'risk',
      icon: Target,
      title: 'Matriz de Riesgos',
      description: 'Evaluación de probabilidad e impacto',
      category: 'risk-management',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'wbs',
      icon: GitBranch,
      title: 'Constructor WBS',
      description: 'Work Breakdown Structure interactivo',
      category: 'scope-management',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'gantt',
      icon: PieChart,
      title: 'Diagrama Gantt',
      description: 'Planificación temporal de proyectos',
      category: 'time-management',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'checklist',
      icon: CheckSquare,
      title: 'Checklist PMI',
      description: 'Verificación de procesos y entregables',
      category: 'quality-management',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'team',
      icon: Users,
      title: 'Evaluador de Equipos',
      description: 'Análisis de competencias del equipo',
      category: 'integration-management',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'burndown',
      icon: Clock,
      title: 'Burndown Chart',
      description: 'Seguimiento del progreso ágil',
      category: 'agile',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  const EVMCalculator = () => {
    const [pv, setPv] = useState('');
    const [ev, setEv] = useState('');
    const [ac, setAc] = useState('');

    const calculateMetrics = () => {
      const pvNum = parseFloat(pv) || 0;
      const evNum = parseFloat(ev) || 0;
      const acNum = parseFloat(ac) || 0;

      const cv = evNum - acNum; // Cost Variance
      const sv = evNum - pvNum; // Schedule Variance
      const cpi = acNum > 0 ? evNum / acNum : 0; // Cost Performance Index
      const spi = pvNum > 0 ? evNum / pvNum : 0; // Schedule Performance Index

      return { cv, sv, cpi, spi };
    };

    const metrics = calculateMetrics();

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Valor Planificado (PV)</label>
            <input
              type="number"
              className="input"
              value={pv}
              onChange={(e) => setPv(e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="label">Valor Ganado (EV)</label>
            <input
              type="number"
              className="input"
              value={ev}
              onChange={(e) => setEv(e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="label">Costo Real (AC)</label>
            <input
              type="number"
              className="input"
              value={ac}
              onChange={(e) => setAc(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className={`text-2xl font-bold mb-2 ${metrics.cv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${metrics.cv.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Varianza de Costo</div>
          </div>
          <div className="card text-center">
            <div className={`text-2xl font-bold mb-2 ${metrics.sv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${metrics.sv.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Varianza de Cronograma</div>
          </div>
          <div className="card text-center">
            <div className={`text-2xl font-bold mb-2 ${metrics.cpi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.cpi.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">CPI</div>
          </div>
          <div className="card text-center">
            <div className={`text-2xl font-bold mb-2 ${metrics.spi >= 1 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.spi.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">SPI</div>
          </div>
        </div>

        <div className="card bg-gray-50">
          <h4 className="font-semibold mb-3">Interpretación:</h4>
          <div className="space-y-2 text-sm">
            <p><strong>CPI:</strong> {metrics.cpi > 1 ? 'Proyecto bajo presupuesto' : metrics.cpi < 1 ? 'Proyecto sobre presupuesto' : 'Proyecto en presupuesto'}</p>
            <p><strong>SPI:</strong> {metrics.spi > 1 ? 'Proyecto adelantado' : metrics.spi < 1 ? 'Proyecto retrasado' : 'Proyecto en tiempo'}</p>
          </div>
        </div>
      </div>
    );
  };

  const RACIMatrix = () => {
    const [tasks, setTasks] = useState<string[]>(['Tarea 1', 'Tarea 2', 'Tarea 3']);
    const [roles, setRoles] = useState<string[]>(['PM', 'Desarrollador', 'Cliente']);
    const [matrix, setMatrix] = useState<Record<string, Record<string, string>>>({});

    const updateMatrix = (task: string, role: string, value: string) => {
      setMatrix(prev => ({
        ...prev,
        [task]: {
          ...prev[task],
          [role]: value
        }
      }));
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Tareas</label>
            {tasks.map((task, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  className="input flex-1"
                  value={task}
                  onChange={(e) => {
                    const newTasks = [...tasks];
                    newTasks[index] = e.target.value;
                    setTasks(newTasks);
                  }}
                />
                <button
                  className="ml-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
                  onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              className="btn-outline w-full"
              onClick={() => setTasks([...tasks, `Tarea ${tasks.length + 1}`])}
            >
              + Agregar Tarea
            </button>
          </div>
          
          <div>
            <label className="label">Roles</label>
            {roles.map((role, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  className="input flex-1"
                  value={role}
                  onChange={(e) => {
                    const newRoles = [...roles];
                    newRoles[index] = e.target.value;
                    setRoles(newRoles);
                  }}
                />
                <button
                  className="ml-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
                  onClick={() => setRoles(roles.filter((_, i) => i !== index))}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              className="btn-outline w-full"
              onClick={() => setRoles([...roles, `Rol ${roles.length + 1}`])}
            >
              + Agregar Rol
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2 text-left">Tareas / Roles</th>
                {roles.map(role => (
                  <th key={role} className="border border-gray-300 p-2 text-center">{role}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task}>
                  <td className="border border-gray-300 p-2 font-medium">{task}</td>
                  {roles.map(role => (
                    <td key={`${task}-${role}`} className="border border-gray-300 p-2 text-center">
                      <select
                        className="w-full text-center bg-transparent"
                        value={matrix[task]?.[role] || ''}
                        onChange={(e) => updateMatrix(task, role, e.target.value)}
                      >
                        <option value="">-</option>
                        <option value="R">R</option>
                        <option value="A">A</option>
                        <option value="C">C</option>
                        <option value="I">I</option>
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card bg-blue-50">
          <h4 className="font-semibold mb-3">Leyenda RACI:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><strong>R</strong> - Responsable (hace el trabajo)</div>
            <div><strong>A</strong> - Accountable (rinde cuentas)</div>
            <div><strong>C</strong> - Consultado (proporciona input)</div>
            <div><strong>I</strong> - Informado (mantiene informado)</div>
          </div>
        </div>
      </div>
    );
  };

  const renderTool = (toolId: string) => {
    switch (toolId) {
      case 'evm':
        return <EVMCalculator />;
      case 'raci':
        return <RACIMatrix />;
      default:
        return (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Calculator className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Herramienta en desarrollo
            </h3>
            <p className="text-gray-600">
              Esta herramienta estará disponible próximamente.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Herramientas Interactivas
        </h1>
        <p className="text-xl text-gray-600">
          Calculadoras y herramientas prácticas para gestores de proyectos
        </p>
      </div>

      {/* Tools Grid */}
      {!activeToolId ? (
        <div className="tools-grid">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              className="tool-card cursor-pointer"
              onClick={() => setActiveToolId(tool.id)}
            >
              <div className={`p-4 rounded-lg ${tool.bgColor} mb-4`}>
                <tool.icon className={`h-8 w-8 ${tool.color} mx-auto`} />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {tool.title}
              </h3>
              
              <p className="text-gray-600 mb-4 text-sm">
                {tool.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="badge category text-xs">
                  {tool.category.replace('-', ' ')}
                </span>
                <span className="text-blue-600 text-sm font-medium">
                  Usar herramienta →
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Active Tool View */
        <div className="max-w-6xl mx-auto">
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {(() => {
                  const tool = tools.find(t => t.id === activeToolId);
                  const Icon = tool?.icon || Calculator;
                  return (
                    <>
                      <Icon className={`h-6 w-6 ${tool?.color}`} />
                      <h2 className="text-2xl font-bold text-gray-900">
                        {tool?.title}
                      </h2>
                    </>
                  );
                })()}
              </div>
              <button
                className="btn-outline"
                onClick={() => setActiveToolId(null)}
              >
                ← Volver a herramientas
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              {tools.find(t => t.id === activeToolId)?.description}
            </p>
            
            {renderTool(activeToolId)}
          </div>
        </div>
      )}

      {/* Help Section */}
      {!activeToolId && (
        <div className="card mt-12 bg-purple-50 border-purple-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Calculator className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                ¿Necesitas ayuda con las herramientas?
              </h3>
              <p className="text-purple-700 mb-4">
                Cada herramienta incluye instrucciones paso a paso y ejemplos prácticos. 
                También puedes consultar los módulos educativos para contexto adicional.
              </p>
              <button className="btn-primary bg-purple-600 hover:bg-purple-700">
                Ver guías de uso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tools;