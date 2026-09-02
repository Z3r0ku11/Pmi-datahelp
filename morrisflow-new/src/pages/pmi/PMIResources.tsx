import React from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  ExternalLink, 
  BookOpen,
  CheckCircle,
  Clock,
  Users,
  Star,
  Search,
  Filter
} from 'lucide-react'

const PMIResources: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('all')

  const categories = [
    { id: 'all', name: 'Todos', count: 47 },
    { id: 'pmbok', name: 'PMBOK® Guide', count: 8 },
    { id: 'standards', name: 'Estándares', count: 12 },
    { id: 'templates', name: 'Templates', count: 15 },
    { id: 'guides', name: 'Guías', count: 12 }
  ]

  const resources = [
    {
      id: 'pmbok-7',
      title: 'PMBOK® Guide 7th Edition',
      category: 'pmbok',
      type: 'Estándar Principal',
      description: 'La guía fundamental del conocimiento en gestión de proyectos, completamente actualizada con enfoques adaptativos y ágiles.',
      size: '15.2 MB',
      pages: 284,
      language: 'Español/Inglés',
      updated: '2021-08-01',
      downloads: 2547,
      rating: 4.9,
      status: 'premium',
      tags: ['Fundamental', 'Actualizado 2021', 'Metodologías Ágiles', 'Enfoques Adaptativos']
    },
    {
      id: 'standard-pm',
      title: 'Standard for Project Management',
      category: 'standards',
      type: 'Estándar',
      description: 'Estándar que describe los procesos fundamentales considerados buenas prácticas en la mayoría de proyectos.',
      size: '8.7 MB',
      pages: 156,
      language: 'Español/Inglés',
      updated: '2021-08-01',
      downloads: 1832,
      rating: 4.7,
      status: 'free',
      tags: ['Procesos', 'Buenas Prácticas', 'Fundamentos', 'ANSI/PMI']
    },
    {
      id: 'agile-practice-guide',
      title: 'Agile Practice Guide',
      category: 'guides',
      type: 'Guía Práctica',
      description: 'Guía completa sobre prácticas ágiles y cómo integrarlas con enfoques tradicionales de gestión de proyectos.',
      size: '12.1 MB',
      pages: 194,
      language: 'Español/Inglés',
      updated: '2020-12-15',
      downloads: 2156,
      rating: 4.8,
      status: 'premium',
      tags: ['Metodologías Ágiles', 'Scrum', 'Kanban', 'Híbrido']
    },
    {
      id: 'risk-management-standard',
      title: 'Practice Standard for Project Risk Management',
      category: 'standards',
      type: 'Estándar de Práctica',
      description: 'Metodología completa para identificar, analizar y responder a riesgos en proyectos.',
      size: '6.3 MB',
      pages: 98,
      language: 'Español/Inglés',
      updated: '2020-09-30',
      downloads: 1456,
      rating: 4.6,
      status: 'free',
      tags: ['Gestión de Riesgos', 'Análisis', 'Metodología', 'Identificación']
    },
    {
      id: 'wbs-template',
      title: 'Work Breakdown Structure Templates',
      category: 'templates',
      type: 'Plantillas',
      description: 'Conjunto completo de plantillas WBS para diferentes tipos de proyectos y industrias.',
      size: '4.2 MB',
      pages: 45,
      language: 'Español/Inglés',
      updated: '2024-01-15',
      downloads: 3821,
      rating: 4.5,
      status: 'free',
      tags: ['WBS', 'Plantillas', 'Estructura', 'Múltiples Industrias']
    },
    {
      id: 'earned-value-guide',
      title: 'Practice Standard for Earned Value Management',
      category: 'standards',
      type: 'Estándar de Práctica',
      description: 'Guía detallada para implementar la gestión del valor ganado en proyectos de cualquier tamaño.',
      size: '5.8 MB',
      pages: 78,
      language: 'Español/Inglés',
      updated: '2020-11-20',
      downloads: 1287,
      rating: 4.4,
      status: 'premium',
      tags: ['Valor Ganado', 'EVM', 'Control de Costos', 'Cronograma']
    }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-br from-green-600 to-teal-700 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-4">
          Recursos PMI
        </h1>
        <p className="text-xl text-white/90 mb-4">
          Biblioteca Completa de Documentos y Estándares
        </p>
        <p className="text-white/80 leading-relaxed max-w-4xl">
          Accede a la colección más completa de recursos oficiales del PMI, incluyendo 
          el PMBOK® Guide 7th Edition, estándares de práctica, plantillas y guías especializadas.
        </p>
      </motion.div>

      {/* Search and Filters */}
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
                placeholder="Buscar recursos..."
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
            Mostrando {filteredResources.length} de {resources.length} recursos
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>
      </motion.section>

      {/* Category Tabs */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-morris-primary text-white'
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

      {/* Resources Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              className="morris-card hover:shadow-morris transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-morris-gray-900 leading-tight">
                        {resource.title}
                      </h3>
                      {resource.status === 'premium' && (
                        <span className="morris-badge morris-badge-warning text-xs">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-morris-gray-500 mb-2">
                      {resource.type}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-morris-gray-500">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{resource.rating}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-morris-gray-600 text-sm leading-relaxed mb-4">
                  {resource.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="morris-badge morris-badge-secondary text-xs">
                      {tag}
                    </span>
                  ))}
                  {resource.tags.length > 3 && (
                    <span className="text-xs text-morris-gray-500 px-2">
                      +{resource.tags.length - 3} más
                    </span>
                  )}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-morris-gray-100 text-xs text-morris-gray-500">
                  <div className="flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    {resource.pages} páginas
                  </div>
                  <div className="flex items-center">
                    <Download className="w-3 h-3 mr-1" />
                    {resource.size}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {resource.downloads} descargas
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-morris-gray-100">
                  <div className="flex items-center text-xs text-morris-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Actualizado {new Date(resource.updated).toLocaleDateString('es-ES')}
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
        {filteredResources.length === 0 && (
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

      {/* PMI Official Links */}
      <motion.section
        className="bg-morris-gray-50 -mx-6 -mb-6 p-6 rounded-t-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-xl font-bold text-morris-gray-900 mb-6">
          Enlaces Oficiales PMI
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <a 
            href="https://www.pmi.org/pmbok-guide-standards" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-lg hover:shadow-sm transition-shadow group"
          >
            <BookOpen className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-medium text-morris-gray-900 group-hover:text-green-600 transition-colors">
              PMBOK® Standards
            </h3>
            <p className="text-sm text-morris-gray-600 mt-1">
              Estándares oficiales y guías del PMI
            </p>
            <ExternalLink className="w-3 h-3 text-morris-gray-400 mt-2" />
          </a>
          
          <a 
            href="https://www.pmi.org/learning/library" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-lg hover:shadow-sm transition-shadow group"
          >
            <FileText className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium text-morris-gray-900 group-hover:text-blue-600 transition-colors">
              PMI Library
            </h3>
            <p className="text-sm text-morris-gray-600 mt-1">
              Biblioteca completa de recursos PMI
            </p>
            <ExternalLink className="w-3 h-3 text-morris-gray-400 mt-2" />
          </a>
          
          <a 
            href="https://www.pmi.org/certifications" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-lg hover:shadow-sm transition-shadow group"
          >
            <CheckCircle className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-morris-gray-900 group-hover:text-purple-600 transition-colors">
              Certificaciones
            </h3>
            <p className="text-sm text-morris-gray-600 mt-1">
              Información oficial de certificaciones
            </p>
            <ExternalLink className="w-3 h-3 text-morris-gray-400 mt-2" />
          </a>
        </div>
      </motion.section>
    </div>
  )
}

export default PMIResources