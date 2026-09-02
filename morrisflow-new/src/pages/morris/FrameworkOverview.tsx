import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Target, 
  Workflow, 
  GitBranch, 
  CheckSquare,
  BarChart3,
  ArrowRight,
  Clock,
  Users,
  Zap,
  Award,
  BookOpen,
  Settings
} from 'lucide-react'
import { MORRIS_FRAMEWORK_CONFIG } from '@utils/config'

const FrameworkOverview: React.FC = () => {
  const methodologies = [
    {
      name: 'Metodología Tradicional',
      description: 'Enfoque secuencial con fases claramente definidas',
      usage: '40%',
      color: '#1E40AF',
      characteristics: ['Planificación detallada', 'Control riguroso', 'Documentación extensa', 'Procesos estructurados']
    },
    {
      name: 'Metodología Ágil',
      description: 'Iterativo e incremental con adaptabilidad continua',
      usage: '35%',
      color: '#059669',
      characteristics: ['Sprints cortos', 'Feedback continuo', 'Adaptabilidad', 'Entrega temprana']
    },
    {
      name: 'Metodología Híbrida',
      description: 'Combinación optimizada de enfoques tradicionales y ágiles',
      usage: '25%',
      color: '#DC2626',
      characteristics: ['Flexibilidad controlada', 'Adaptación contextual', 'Lo mejor de ambos', 'Decisión por proyecto']
    }
  ]

  const frameworkBenefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Enfoque Centrado en Resultados',
      description: 'Optimizado para la entrega de valor medible y alineado con objetivos estratégicos.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Roles Claramente Definidos',
      description: 'Estructura organizacional clara con responsabilidades específicas para cada rol.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Adaptabilidad Contextual',
      description: 'Capacidad de adaptarse a diferentes tipos de proyectos y contextos organizacionales.'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Métricas Integradas',
      description: 'Sistema de medición continuo con KPIs específicos por fase y tipo de proyecto.'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Estándares PMI Compatible',
      description: 'Totalmente alineado con estándares PMI y mejores prácticas internacionales.'
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Herramientas Integradas',
      description: 'Conjunto completo de plantillas, checklists y herramientas de soporte.'
    }
  ]

  const implementationSteps = [
    {
      phase: 1,
      title: 'Evaluación Organizacional',
      description: 'Análisis del contexto actual y definición de necesidades específicas',
      duration: '2-3 semanas',
      deliverables: ['Assessment organizacional', 'Gap analysis', 'Roadmap de implementación']
    },
    {
      phase: 2,
      title: 'Configuración del Framework',
      description: 'Adaptación del framework a la realidad organizacional específica',
      duration: '3-4 semanas',
      deliverables: ['Framework customizado', 'Plantillas adaptadas', 'Procesos definidos']
    },
    {
      phase: 3,
      title: 'Piloto y Validación',
      description: 'Implementación piloto en proyectos seleccionados para validar efectividad',
      duration: '6-8 semanas',
      deliverables: ['Proyectos piloto', 'Métricas de validación', 'Ajustes al framework']
    },
    {
      phase: 4,
      title: 'Rollout Organizacional',
      description: 'Despliegue completo con capacitación y acompañamiento',
      duration: '8-12 semanas',
      deliverables: ['Capacitación completa', 'Soporte continuo', 'Métricas de adopción']
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
              Resumen General del Framework
            </p>
            <p className="text-white/80 leading-relaxed max-w-4xl">
              {MORRIS_FRAMEWORK_CONFIG.description} El framework está diseñado para organizaciones 
              corporativas que buscan optimizar la gestión de proyectos mediante un enfoque híbrido y adaptativo.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Framework Phases */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-morris-gray-900 mb-6">
          Fases del Framework
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MORRIS_FRAMEWORK_CONFIG.phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              className="morris-card p-6 hover:shadow-morris transition-shadow border-l-4"
              style={{ borderLeftColor: phase.color }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-4xl">{phase.icon}</span>
                <span 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: phase.color }}
                />
              </div>
              <h3 className="font-semibold text-morris-gray-900 mb-3">
                {phase.name}
              </h3>
              <p className="text-sm text-morris-gray-600 leading-relaxed">
                Fase {index + 1} del Framework Morris - Componente fundamental para 
                la gestión efectiva de proyectos.
              </p>
              <div className="mt-4 pt-4 border-t border-morris-gray-100">
                <span className="text-xs font-medium" style={{ color: phase.color }}>
                  FASE {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Methodologies */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-morris-gray-900 mb-6">
          Enfoques Metodológicos
        </h2>
        <div className="space-y-6">
          {methodologies.map((methodology, index) => (
            <motion.div
              key={methodology.name}
              className="morris-card p-6 hover:shadow-morris transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.2 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: methodology.color }}
                    />
                    <h3 className="text-xl font-semibold text-morris-gray-900">
                      {methodology.name}
                    </h3>
                    <span className="morris-badge morris-badge-primary">
                      {methodology.usage} uso
                    </span>
                  </div>
                  
                  <p className="text-morris-gray-600 leading-relaxed mb-4">
                    {methodology.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {methodology.characteristics.map(characteristic => (
                      <span 
                        key={characteristic}
                        className="morris-badge morris-badge-secondary"
                      >
                        {characteristic}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 lg:mt-0 lg:ml-8">
                  <div className="text-center">
                    <div 
                      className="text-3xl font-bold mb-2"
                      style={{ color: methodology.color }}
                    >
                      {methodology.usage}
                    </div>
                    <div className="text-sm text-morris-gray-500">
                      Uso en organizaciones
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Framework Benefits */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-morris-gray-900 mb-6">
          Beneficios del Framework
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frameworkBenefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="morris-card p-6 hover:shadow-morris transition-shadow text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <div className="text-morris-primary mb-4 flex justify-center">
                {benefit.icon}
              </div>
              <h3 className="font-semibold text-morris-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-morris-gray-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Implementation Steps */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-morris-gray-900 mb-6">
          Proceso de Implementación
        </h2>
        <div className="space-y-6">
          {implementationSteps.map((step, index) => (
            <motion.div
              key={step.phase}
              className="morris-card p-6 hover:shadow-morris transition-shadow"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                  <div className="w-12 h-12 bg-morris-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.phase}
                  </div>
                  <div className="flex-1 lg:flex-initial">
                    <h3 className="text-lg font-semibold text-morris-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-morris-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {step.duration}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-morris-gray-600 leading-relaxed mb-4">
                    {step.description}
                  </p>
                  
                  <div>
                    <h4 className="font-medium text-morris-gray-900 mb-2">Entregables:</h4>
                    <ul className="space-y-1">
                      {step.deliverables.map(deliverable => (
                        <li key={deliverable} className="text-sm text-morris-gray-600 flex items-start">
                          <CheckSquare className="w-3 h-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Related Resources */}
      <motion.section
        className="bg-morris-gray-50 -mx-6 -mb-6 p-6 rounded-t-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <h2 className="text-xl font-bold text-morris-gray-900 mb-6">
          Recursos Relacionados
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Link 
            to="/morris/workflow" 
            className="bg-white p-6 rounded-lg hover:shadow-sm transition-shadow group"
          >
            <GitBranch className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-semibold text-morris-gray-900 group-hover:text-blue-600 transition-colors mb-2">
              Workflow End-to-End
            </h3>
            <p className="text-sm text-morris-gray-600 leading-relaxed mb-4">
              Proceso corporativo completo desde ingreso hasta cierre formal
            </p>
            <div className="flex items-center text-blue-600 group-hover:text-blue-800 transition-colors">
              <span className="text-sm font-medium">Ver Workflow</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>
          
          <Link 
            to="/morris/project-flow" 
            className="bg-white p-6 rounded-lg hover:shadow-sm transition-shadow group"
          >
            <Workflow className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="font-semibold text-morris-gray-900 group-hover:text-green-600 transition-colors mb-2">
              Flujo Proyectos v2
            </h3>
            <p className="text-sm text-morris-gray-600 leading-relaxed mb-4">
              Gestión ágil de proyectos superiores a 6 semanas con PMO tradicional
            </p>
            <div className="flex items-center text-green-600 group-hover:text-green-800 transition-colors">
              <span className="text-sm font-medium">Ver Flujo</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>
          
          <Link 
            to="/morris/assessment" 
            className="bg-white p-6 rounded-lg hover:shadow-sm transition-shadow group"
          >
            <CheckSquare className="w-8 h-8 text-red-600 mb-4" />
            <h3 className="font-semibold text-morris-gray-900 group-hover:text-red-600 transition-colors mb-2">
              Flujo Assessment v5
            </h3>
            <p className="text-sm text-morris-gray-600 leading-relaxed mb-4">
              Evaluación integral para proyectos de 4-6 semanas con PMO ágil
            </p>
            <div className="flex items-center text-red-600 group-hover:text-red-800 transition-colors">
              <span className="text-sm font-medium">Ver Assessment</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>
        </div>

        {/* PMI Integration */}
        <div className="mt-8 pt-6 border-t border-morris-gray-200">
          <h3 className="font-semibold text-morris-gray-900 mb-4">
            Integración con Estándares PMI
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <BookOpen className="w-6 h-6 text-morris-primary" />
                <span className="font-medium text-morris-gray-900">PMBOK® Guide Compliance</span>
              </div>
              <p className="text-sm text-morris-gray-600 leading-relaxed">
                Framework totalmente alineado con la 7ª edición del PMBOK® Guide y estándares PMI actualizados.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Award className="w-6 h-6 text-morris-secondary" />
                <span className="font-medium text-morris-gray-900">Certification Ready</span>
              </div>
              <p className="text-sm text-morris-gray-600 leading-relaxed">
                Diseñado para facilitar la preparación y mantenimiento de certificaciones profesionales PMI.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default FrameworkOverview