import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Workflow, 
  GitBranch, 
  CheckSquare, 
  BarChart3,
  ArrowRight,
  Clock,
  Users,
  Target,
  Zap
} from 'lucide-react'
import { MORRIS_FRAMEWORK_CONFIG } from '@utils/config'

const MorrisFrameworkPortal: React.FC = () => {
  const workflows = [
    {
      id: 'workflow-end-to-end',
      title: 'Workflow End-to-End',
      description: 'Proceso corporativo completo desde la recepción comercial hasta el cierre formal',
      icon: <GitBranch className="w-8 h-8" />,
      phases: 13,
      duration: 'Variable',
      complexity: 'Alta',
      link: '/morris/workflow',
      color: '#1E40AF',
      features: [
        'Gobernanza Transversal',
        'Control de Calidad',
        'Gestión de Riesgos',
        'Documentación Completa'
      ]
    },
    {
      id: 'project-flow-v2',
      title: 'Flujo Proyectos v2',
      description: 'Gestión ágil de proyectos con metodología Morris superior a 6 semanas',
      icon: <Workflow className="w-8 h-8" />,
      phases: 6,
      duration: '6+ semanas',
      complexity: 'Media',
      link: '/morris/project-flow',
      color: '#059669',
      features: [
        'Gestión PMO Tradicional/Híbrida',
        'Roles Claramente Definidos',
        'Hitos de Validación',
        'Control de Avance'
      ]
    },
    {
      id: 'assessment-flow-v5',
      title: 'Flujo Assessment v5',
      description: 'Evaluación integral para proyectos entre 4 a 6 semanas con gestión PMO ágil',
      icon: <CheckSquare className="w-8 h-8" />,
      phases: 8,
      duration: '4-6 semanas',
      complexity: 'Media',
      link: '/morris/assessment',
      color: '#DC2626',
      features: [
        'Gestión PMO Ágil',
        'Assessment Rápido',
        'Metodología Híbrida',
        'Evaluación Continua'
      ]
    }
  ]

  const frameworkStats = [
    {
      label: 'Versión Framework',
      value: 'v3.1',
      icon: <Target className="w-5 h-5" />,
      color: 'text-morris-primary'
    },
    {
      label: 'Workflows Activos',
      value: '3',
      icon: <Workflow className="w-5 h-5" />,
      color: 'text-morris-secondary'
    },
    {
      label: 'Fases Principales',
      value: '4+',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-morris-accent'
    },
    {
      label: 'Metodología',
      value: 'Híbrida',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-morris-warning'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="bg-gradient-morris rounded-2xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">
              Framework Morris {MORRIS_FRAMEWORK_CONFIG.version}
            </h1>
            <p className="text-xl text-white/90 mb-4">
              {MORRIS_FRAMEWORK_CONFIG.description}
            </p>
            <p className="text-white/80 leading-relaxed max-w-3xl">
              Sistema integral de gestión de proyectos que combina metodologías tradicionales, 
              ágiles e híbridas para optimizar la entrega de valor en organizaciones corporativas.
            </p>
          </div>
          
          <motion.div 
            className="mt-6 lg:mt-0 lg:ml-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              to="/morris/framework" 
              className="morris-button bg-white text-morris-primary hover:bg-morris-gray-50 inline-flex items-center"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Resumen Framework
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Framework Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {frameworkStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="morris-card p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className={`flex justify-center mb-3 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-morris-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-morris-gray-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Framework Phases */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-morris-gray-900 mb-6">
          Fases del Framework Morris
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MORRIS_FRAMEWORK_CONFIG.phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              className="morris-card p-6 border-l-4 hover:shadow-morris transition-shadow"
              style={{ borderLeftColor: phase.color }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">{phase.icon}</span>
                <span 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: phase.color }}
                />
              </div>
              <h3 className="font-semibold text-morris-gray-900 mb-2">
                {phase.name}
              </h3>
              <p className="text-sm text-morris-gray-600">
                Fase {index + 1} - Componente fundamental del framework
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Workflows */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-morris-gray-900 mb-6">
          Workflows Disponibles
        </h2>
        <div className="space-y-6">
          {workflows.map((workflow, index) => (
            <motion.div
              key={workflow.id}
              className="morris-card hover:shadow-morris transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.2 }}
            >
              <Link to={workflow.link} className="block p-8 group">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div 
                        className="p-3 rounded-lg text-white"
                        style={{ backgroundColor: workflow.color }}
                      >
                        {workflow.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-morris-gray-900 group-hover:text-morris-primary transition-colors">
                          {workflow.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-morris-gray-500 mt-1">
                          <span className="flex items-center">
                            <BarChart3 className="w-4 h-4 mr-1" />
                            {workflow.phases} fases
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {workflow.duration}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Complejidad {workflow.complexity}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-morris-gray-600 leading-relaxed mb-4">
                      {workflow.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {workflow.features.map((feature) => (
                        <span 
                          key={feature}
                          className="morris-badge morris-badge-primary"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 lg:mt-0 lg:ml-8">
                    <div className="flex items-center text-morris-primary group-hover:text-morris-light transition-colors">
                      <span className="font-medium">Ver Workflow</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section
        className="bg-morris-gray-50 -mx-6 -mb-6 p-6 rounded-t-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <h2 className="text-xl font-bold text-morris-gray-900 mb-6">
          Acciones Rápidas
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link 
            to="/morris/framework" 
            className="bg-white p-4 rounded-lg hover:shadow-sm transition-shadow group"
          >
            <BarChart3 className="w-6 h-6 text-morris-primary mb-2" />
            <h3 className="font-medium text-morris-gray-900 group-hover:text-morris-primary transition-colors">
              Resumen Framework
            </h3>
            <p className="text-sm text-morris-gray-600 mt-1">
              Vista general de componentes y metodología
            </p>
          </Link>
          
          <Link 
            to="/pmi" 
            className="bg-white p-4 rounded-lg hover:shadow-sm transition-shadow group"
          >
            <Users className="w-6 h-6 text-morris-secondary mb-2" />
            <h3 className="font-medium text-morris-gray-900 group-hover:text-morris-secondary transition-colors">
              Portal PMI
            </h3>
            <p className="text-sm text-morris-gray-600 mt-1">
              Recursos y certificaciones PMI
            </p>
          </Link>
          
          <div className="bg-white p-4 rounded-lg">
            <Zap className="w-6 h-6 text-morris-warning mb-2" />
            <h3 className="font-medium text-morris-gray-900">
              Próximamente
            </h3>
            <p className="text-sm text-morris-gray-600 mt-1">
              Nuevas funcionalidades en desarrollo
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default MorrisFrameworkPortal