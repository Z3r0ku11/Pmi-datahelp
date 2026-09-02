import React from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  CheckSquare,
  BookOpen,
  Workflow,
  Users,
  Star,
  Clock,
  Search,
  Filter,
  ExternalLink,
  ArrowRight
} from 'lucide-react'

const PMIGuides: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('all')

  const categories = [
    { id: 'all', name: 'Todos', count: 28 },
    { id: 'templates', name: 'Templates', count: 12 },
    { id: 'checklists', name: 'Checklists', count: 8 },
    { id: 'guides', name: 'Guías', count: 5 },
    { id: 'frameworks', name: 'Frameworks', count: 3 }
  ]

  const guides = [
    {
      id: 'project-charter-template',
      title: 'Project Charter Template',
      category: 'templates',
      type: 'Plantilla de Documento',
      description: 'Plantilla completa para crear actas de constitución de proyecto según estándares PMI.',
      difficulty: 'Básico',
      estimatedTime: '30 min',
      downloads: 4521,
      rating: 4.8,
      fileSize: '2.1 MB',
      format: 'Word + PDF',
      features: [
        'Secciones predefinidas PMBOK®',
        'Ejemplos incluidos',
        'Formato profesional',
        'Compatible Morris Framework'
      ],
      tags: ['Project Charter', 'Inicio', 'Documentación', 'PMI']
    },
    {
      id: 'wbs-templates-pack',
      title: 'WBS Templates Pack',
      category: 'templates',
      type: 'Paquete de Plantillas',
      description: 'Colección completa de plantillas WBS para diferentes tipos de proyectos e industrias.',
      difficulty: 'Intermedio',
      estimatedTime: '45 min',
      downloads: 3847,
      rating: 4.7,
      fileSize: '5.8 MB',
      format: 'Excel + Visio',
      features: [
        '15 plantillas WBS diferentes',
        'Múltiples industrias',
        'Niveles de descomposición',
        'Códigos de cuenta integrados'
      ],
      tags: ['WBS', 'Planificación', 'Estructura', 'Multi-industria']
    },
    {
      id: 'risk-register-template',
      title: 'Risk Register Template',
      category: 'templates',
      type: 'Plantilla de Gestión',
      description: 'Registro completo de riesgos con matriz de probabilidad/impacto y planes de respuesta.',
      difficulty: 'Intermedio',
      estimatedTime: '60 min',
      downloads: 2956,
      rating: 4.6,
      fileSize: '3.4 MB',
      format: 'Excel',
      features: [
        'Matriz probabilidad/impacto',
        'Cálculo automático de scores',
        'Planes de respuesta estructurados',
        'Dashboard de riesgos'
      ],
      tags: ['Riesgos', 'Registro', 'Matriz', 'Gestión']
    },
    {
      id: 'project-closure-checklist',
      title: 'Project Closure Checklist',
      category: 'checklists',
      type: 'Lista de Verificación',
      description: 'Checklist completo para el cierre formal de proyectos según mejores prácticas PMI.',
      difficulty: 'Básico',
      estimatedTime: '20 min',
      downloads: 3245,
      rating: 4.5,
      fileSize: '1.2 MB',
      format: 'PDF + Word',
      features: [
        'Actividades de cierre administrativo',
        'Verificación de entregables',
        'Documentación final',
        'Liberación de recursos'
      ],
      tags: ['Cierre', 'Checklist', 'Verificación', 'PMI']
    },
    {
      id: 'stakeholder-analysis-guide',
      title: 'Stakeholder Analysis Guide',
      category: 'guides',
      type: 'Guía Metodológica',
      description: 'Guía paso a paso para realizar análisis completo de interesados en proyectos.',
      difficulty: 'Intermedio',
      estimatedTime: '90 min',
      downloads: 2156,
      rating: 4.9,
      fileSize: '4.7 MB',
      format: 'PDF + Templates',
      features: [
        'Metodología de identificación',
        'Matriz poder/interés',
        'Estrategias de involucramiento',
        'Templates incluidos'
      ],
      tags: ['Stakeholders', 'Análisis', 'Metodología', 'Comunicación']
    },
    {
      id: 'agile-hybrid-framework',
      title: 'Agile-Hybrid Framework',
      category: 'frameworks',
      type: 'Framework Metodológico',
      description: 'Framework híbrido que combina metodologías tradicionales PMI con enfoques ágiles.',
      difficulty: 'Avanzado',
      estimatedTime: '3 horas',
      downloads: 1834,
      rating: 4.8,
      fileSize: '8.9 MB',
      format: 'PDF + Templates + Video',
      features: [
        'Integración PMI + Ágil',
        'Procesos adaptativos',
        'Templates personalizados',
        'Video explicativo incluido'
      ],
      tags: ['Híbrido', 'Ágil', 'Framework', 'Morris Compatible']
    },
    {
      id: 'earned-value-calculator',
      title: 'Earned Value Calculator',
      category: 'templates',
      type: 'Herramienta de Cálculo',
      description: 'Calculadora automática de valor ganado con todos los índices y métricas EVM.',
      difficulty: 'Avanzado',
      estimatedTime: '45 min',
      downloads: 2687,
      rating: 4.4,
      fileSize: '2.8 MB',
      format: 'Excel',
      features: [
        'Cálculos EVM automáticos',
        'Gráficos de tendencias',
        'Proyecciones de costos',
        'Dashboard ejecutivo'
      ],
      tags: ['EVM', 'Valor Ganado', 'Métricas', 'Control']
    },
    {
      id: 'quality-assurance-checklist',
      title: 'Quality Assurance Checklist',
      category: 'checklists',
      type: 'Lista de Verificación',
      description: 'Checklist completo para asegurar la calidad en todas las fases del proyecto.',
      difficulty: 'Intermedio',
      estimatedTime: '40 min',
      downloads: 2134,
      rating: 4.3,
      fileSize: '1.8 MB',
      format: 'PDF + Excel',
      features: [
        'Verificaciones por fase',
        'Criterios de aceptación',
        'Métricas de calidad',
        'Acciones correctivas'
      ],
      tags: ['Calidad', 'QA', 'Verificación', 'Estándares']
    }
  ]

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return 'text-green-600 bg-green-100'
      case 'Intermedio': return 'text-yellow-600 bg-yellow-100'
      case 'Avanzado': return 'text-red-600 bg-red-100'
      default: return 'text-morris-gray-600 bg-morris-gray-100'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-4">
          Guías y Templates PMI
        </h1>
        <p className="text-xl text-white/90 mb-4">
          Plantillas Profesionales y Guías de Implementación
        </p>
        <p className="text-white/80 leading-relaxed max-w-4xl">
          Colección completa de plantillas, checklists, guías y frameworks listos para usar. 
          Todos los recursos están basados en estándares PMI e integrados con Framework Morris.
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.section
        className="morris-card p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-morris-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar templates y guías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="morris-input pl-10 w-full"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-4">
            <Filter className="w-4 h-4 text-morris-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="morris-input"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-4 pt-4 border-t border-morris-gray-200">
          <p className="text-sm text-morris-gray-600">
            Mostrando {filteredGuides.length} de {guides.length} recursos
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>
      </motion.section>

      {/* Quick Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="morris-card p-6 text-center">
            <FileText className="w-8 h-8 text-teal-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-morris-gray-900 mb-1">28+</div>
            <div className="text-sm text-morris-gray-600">Templates y Guías</div>
          </div>
          <div className="morris-card p-6 text-center">
            <Download className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-morris-gray-900 mb-1">25K+</div>
            <div className="text-sm text-morris-gray-600">Descargas Totales</div>
          </div>
          <div className="morris-card p-6 text-center">
            <CheckSquare className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-morris-gray-900 mb-1">PMI</div>
            <div className="text-sm text-morris-gray-600">Estándares Certificados</div>
          </div>
          <div className="morris-card p-6 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-morris-gray-900 mb-1">4.6</div>
            <div className="text-sm text-morris-gray-600">Rating Promedio</div>
          </div>
        </div>
      </motion.section>

      {/* Category Tabs */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-morris-gray-100 text-morris-gray-700 hover:bg-morris-gray-200'
              }`}
            >
              {category.name}
              <span className="ml-2 text-xs opacity-75">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </motion.section>

      {/* Guides Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredGuides.map((guide, index) => (
            <motion.div
              key={guide.id}
              className="morris-card hover:shadow-morris transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-morris-gray-900 mb-2">
                      {guide.title}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-morris-gray-500">{guide.type}</span>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}
                      >
                        {guide.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-morris-gray-600">{guide.rating}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-morris-gray-600 text-sm leading-relaxed mb-4">
                  {guide.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {guide.features.slice(0, 2).map(feature => (
                    <div key={feature} className="flex items-center text-sm text-morris-gray-600">
                      <CheckSquare className="w-3 h-3 mr-2 text-green-500" />
                      {feature}
                    </div>
                  ))}
                  {guide.features.length > 2 && (
                    <div className="text-xs text-morris-gray-500">
                      +{guide.features.length - 2} características más
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {guide.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="morris-badge morris-badge-secondary text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-morris-gray-100 text-xs text-morris-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {guide.estimatedTime}
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    {guide.fileSize}
                  </div>
                  <div className="flex items-center">
                    <Download className="w-3 h-3 mr-1" />
                    {guide.downloads}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-morris-gray-100">
                  <div className="text-xs text-morris-gray-500">
                    {guide.format}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="morris-button-outline text-sm py-2 px-4">
                      <Download className="w-3 h-3 mr-1" />
                      Descargar
                    </button>
                    <button className="morris-button-primary text-sm py-2 px-4">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredGuides.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FileText className="w-12 h-12 text-morris-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-morris-gray-900 mb-2">
              No se encontraron recursos
            </h3>
            <p className="text-morris-gray-600 mb-4">
              Intenta con otros términos de búsqueda o selecciona una categoría diferente.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="morris-button-outline"
            >
              Limpiar filtros
            </button>
          </motion.div>
        )}
      </motion.section>

      {/* Featured Collections */}
      <motion.section
        className="bg-morris-gray-50 -mx-6 -mb-6 p-6 rounded-t-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-xl font-bold text-morris-gray-900 mb-6">
          Colecciones Destacadas
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Workflow className="w-8 h-8 text-teal-600" />
              <div>
                <h3 className="font-semibold text-morris-gray-900">Starter Pack PMI</h3>
                <p className="text-sm text-morris-gray-600">Templates esenciales</p>
              </div>
            </div>
            <p className="text-sm text-morris-gray-600 leading-relaxed mb-4">
              Conjunto básico de plantillas para iniciar cualquier proyecto siguiendo estándares PMI.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-morris-gray-500">8 templates incluidos</span>
              <button className="morris-button-outline text-sm">
                Descargar Pack
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-morris-gray-900">Morris Integration</h3>
                <p className="text-sm text-morris-gray-600">Templates híbridos</p>
              </div>
            </div>
            <p className="text-sm text-morris-gray-600 leading-relaxed mb-4">
              Plantillas específicamente adaptadas para integrar PMI con Framework Morris.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-morris-gray-500">5 frameworks híbridos</span>
              <button className="morris-button-outline text-sm">
                Ver Integración
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-morris-gray-900">Certification Ready</h3>
                <p className="text-sm text-morris-gray-600">Materiales de estudio</p>
              </div>
            </div>
            <p className="text-sm text-morris-gray-600 leading-relaxed mb-4">
              Recursos complementarios para preparación de certificaciones PMI.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-morris-gray-500">Todas las certificaciones</span>
              <button className="morris-button-outline text-sm">
                Ver Recursos
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default PMIGuides