import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Workflow, 
  BookOpen, 
  BarChart3, 
  Users, 
  ArrowRight,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react'
import { APP_CONFIG, MORRIS_FRAMEWORK_CONFIG } from '@utils/config'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Workflow className="w-8 h-8 text-morris-primary" />,
      title: "Framework Morris 3.1",
      description: "Sistema completo de gestión de proyectos con metodologías ágiles e híbridas",
      link: "/morris",
      badge: "v3.1"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-morris-secondary" />,
      title: "Portal Ayuda PMI",
      description: "Recursos, guías y certificaciones para gestión profesional de proyectos",
      link: "/pmi",
      badge: "PMI"
    }
  ]

  const workflows = [
    {
      name: "Workflow End-to-End",
      description: "Proceso completo desde ingreso hasta cierre",
      phases: 13,
      link: "/morris/workflow"
    },
    {
      name: "Flujo Proyectos v2",
      description: "Gestión ágil con metodología Morris",
      phases: 6,
      link: "/morris/project-flow"
    },
    {
      name: "Flujo Assessment v5",
      description: "Evaluación integral de proyectos",
      phases: 8,
      link: "/morris/assessment"
    }
  ]

  const stats = [
    { label: "Fases del Framework", value: "4+", icon: <Target className="w-5 h-5" /> },
    { label: "Workflows Disponibles", value: "3", icon: <Workflow className="w-5 h-5" /> },
    { label: "Tiempo de Setup", value: "<30min", icon: <Clock className="w-5 h-5" /> },
    { label: "Metodologías", value: "Híbrida", icon: <CheckCircle className="w-5 h-5" /> }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-morris rounded-2xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Bienvenido a MorrisFlow
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-6">
              Framework de Gestión de Proyectos Morris v{APP_CONFIG.frameworkVersion}
            </p>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Sistema completo para la gestión profesional de proyectos con metodologías 
              ágiles, híbridas y tradicionales. Optimizado para PMOs corporativos.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/morris" className="bg-white text-morris-primary px-6 py-3 rounded-lg font-semibold hover:bg-morris-gray-50 transition-colors inline-flex items-center">
              Explorar Framework
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link to="/pmi" className="border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Portal PMI
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="morris-card p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className="flex justify-center mb-3 text-morris-primary">
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

      {/* Main Features */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-morris-gray-900 mb-8">
          Portales Principales
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.2 }}
            >
              <Link to={feature.link} className="block group">
                <div className="morris-card p-8 h-full hover:shadow-morris transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {feature.icon}
                      <span className="morris-badge morris-badge-primary">
                        {feature.badge}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-morris-gray-400 group-hover:text-morris-primary transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-morris-gray-900 mb-3 group-hover:text-morris-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-morris-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Workflows Overview */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-morris-gray-900">
            Workflows Disponibles
          </h2>
          <Link to="/morris" className="morris-button-outline">
            Ver Todos
          </Link>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {workflows.map((workflow, index) => (
            <motion.div
              key={workflow.name}
              className="morris-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-morris-gray-900 mb-2">
                {workflow.name}
              </h3>
              <p className="text-morris-gray-600 mb-4 text-sm leading-relaxed">
                {workflow.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-morris-gray-500">
                  {workflow.phases} fases
                </span>
                <Link 
                  to={workflow.link}
                  className="text-morris-primary hover:text-morris-light font-medium text-sm transition-colors"
                >
                  Ver Detalles →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Framework Phases Preview */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="bg-morris-gray-50 -mx-6 -mb-6 p-6 rounded-t-2xl"
      >
        <h2 className="text-2xl font-bold text-morris-gray-900 mb-6">
          Fases del Framework Morris 3.1
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MORRIS_FRAMEWORK_CONFIG.phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              className="bg-white rounded-lg p-4 border-l-4"
              style={{ borderLeftColor: phase.color }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{phase.icon}</span>
                <span 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: phase.color }}
                />
              </div>
              <h3 className="font-semibold text-morris-gray-900 text-sm mb-1">
                {phase.name}
              </h3>
              <p className="text-xs text-morris-gray-600">
                Fase {index + 1} del Framework
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}

export default HomePage