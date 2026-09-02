import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Award, 
  FileText, 
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Globe,
  Download,
  ExternalLink
} from 'lucide-react'

const PMIHelpPortal: React.FC = () => {
  const pmiResources = [
    {
      id: 'certifications',
      title: 'Certificaciones PMI',
      description: 'Guías completas para obtener certificaciones profesionales en gestión de proyectos',
      icon: <Award className="w-8 h-8" />,
      link: '/pmi/certifications',
      color: '#DC2626',
      stats: '6+ certificaciones',
      features: [
        'PMP® - Project Management Professional',
        'CAPM® - Certified Associate in PM',
        'PMI-ACP® - Agile Certified Practitioner',
        'PfMP® - Portfolio Management Professional'
      ]
    },
    {
      id: 'resources',
      title: 'Recursos PMI',
      description: 'Biblioteca completa de documentos, estándares y mejores prácticas del PMI',
      icon: <FileText className="w-8 h-8" />,
      link: '/pmi/resources',
      color: '#059669',
      stats: '50+ recursos',
      features: [
        'PMBOK® Guide 7th Edition',
        'Standard for Project Management',
        'Agile Practice Guide',
        'Templates y Herramientas'
      ]
    },
    {
      id: 'guides',
      title: 'Guías y Templates',
      description: 'Plantillas profesionales y guías paso a paso para implementación inmediata',
      icon: <BookOpen className="w-8 h-8" />,
      link: '/pmi/guides',
      color: '#1E40AF',
      stats: '30+ guías',
      features: [
        'Templates de Documentos',
        'Checklists de Procesos',
        'Guías de Implementación',
        'Frameworks Híbridos'
      ]
    }
  ]

  const quickStats = [
    { label: 'Certificaciones PMI', value: '6+', icon: <Award className="w-5 h-5" /> },
    { label: 'Recursos Disponibles', value: '50+', icon: <FileText className="w-5 h-5" /> },
    { label: 'Templates y Guías', value: '30+', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Actualizaciones', value: 'Mensual', icon: <Clock className="w-5 h-5" /> }
  ]

  const featuredContent = [
    {
      title: 'PMBOK® Guide 7th Edition',
      type: 'Estándar Principal',
      description: 'Guía fundamental del cuerpo de conocimiento en gestión de proyectos',
      status: 'Actualizado 2021',
      link: '/pmi/resources/pmbok-7',
      badge: 'Esencial'
    },
    {
      title: 'PMP® Certification Guide',
      type: 'Certificación',
      description: 'Ruta completa para obtener la certificación PMP más reconocida mundialmente',
      status: 'Examen Actualizado',
      link: '/pmi/certifications/pmp',
      badge: 'Popular'
    },
    {
      title: 'Agile Hybrid Framework',
      type: 'Template',
      description: 'Framework híbrido que combina metodologías tradicionales y ágiles',
      status: 'Morris Integration',
      link: '/pmi/guides/hybrid-framework',
      badge: 'Morris'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">
              Portal de Ayuda PMI
            </h1>
            <p className="text-xl text-white/90 mb-4">
              Project Management Institute - Recursos Profesionales
            </p>
            <p className="text-white/80 leading-relaxed max-w-3xl">
              Centro completo de recursos, certificaciones y guías del PMI para profesionales 
              en gestión de proyectos. Integrado con Framework Morris para máxima compatibilidad.
            </p>
          </div>
          
          <motion.div 
            className="mt-6 lg:mt-0 lg:ml-8 flex flex-col space-y-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <a 
              href="https://www.pmi.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center"
            >
              <Globe className="w-5 h-5 mr-2" />
              Sitio Oficial PMI
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            <span className="text-white/70 text-sm text-center">
              Recursos actualizados 2024
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="morris-card p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="flex justify-center mb-3 text-blue-600">
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

      {/* Featured Content */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-morris-gray-900 mb-6">
          Contenido Destacado
        </h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {featuredContent.map((content, index) => (
            <motion.div
              key={content.title}
              className="morris-card p-6 hover:shadow-morris transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="morris-badge morris-badge-primary">
                  {content.badge}
                </span>
                <span className="text-xs text-morris-gray-500">
                  {content.type}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-morris-gray-900 mb-2">
                {content.title}
              </h3>
              
              <p className="text-morris-gray-600 text-sm mb-4 leading-relaxed">
                {content.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-morris-gray-500 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  {content.status}
                </span>
                <Link 
                  to={content.link}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors inline-flex items-center"
                >
                  Ver más
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Main Resources */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-morris-gray-900 mb-6">
          Recursos Principales
        </h2>
        <div className="space-y-6">
          {pmiResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              className="morris-card hover:shadow-morris transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.2 }}
            >
              <Link to={resource.link} className="block p-8 group">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div 
                        className="p-3 rounded-lg text-white"
                        style={{ backgroundColor: resource.color }}
                      >
                        {resource.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-morris-gray-900 group-hover:text-blue-600 transition-colors">
                          {resource.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-morris-gray-500 mt-1">
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            {resource.stats}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Profesional
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-morris-gray-600 leading-relaxed mb-4">
                      {resource.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {resource.features.map((feature) => (
                        <span 
                          key={feature}
                          className="morris-badge morris-badge-secondary"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 lg:mt-0 lg:ml-8">
                    <div className="flex items-center text-blue-600 group-hover:text-blue-800 transition-colors">
                      <span className="font-medium">Explorar</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* PMI Integration with Morris */}
      <motion.section
        className="bg-morris-gray-50 -mx-6 -mb-6 p-6 rounded-t-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <h2 className="text-xl font-bold text-morris-gray-900 mb-6">
          Integración PMI + Morris Framework
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-morris rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <div>
                <h3 className="font-semibold text-morris-gray-900">Framework Morris</h3>
                <p className="text-sm text-morris-gray-600">Metodología corporativa</p>
              </div>
            </div>
            <p className="text-sm text-morris-gray-600 leading-relaxed">
              Framework específicamente diseñado para entornos corporativos que integra 
              las mejores prácticas del PMI con metodologías ágiles e híbridas.
            </p>
            <Link to="/morris" className="morris-button-outline mt-4 text-sm">
              Ver Framework Morris
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="w-10 h-10 text-blue-600" />
              <div>
                <h3 className="font-semibold text-morris-gray-900">Estándares PMI</h3>
                <p className="text-sm text-morris-gray-600">Certificaciones globales</p>
              </div>
            </div>
            <p className="text-sm text-morris-gray-600 leading-relaxed">
              Recursos actualizados basados en los últimos estándares del Project 
              Management Institute para certificaciones profesionales reconocidas globalmente.
            </p>
            <a 
              href="https://www.pmi.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="morris-button-outline mt-4 text-sm inline-flex items-center"
            >
              Sitio PMI
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default PMIHelpPortal