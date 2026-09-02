import React from 'react'
import { motion } from 'framer-motion'
import { 
  Award, 
  CheckCircle, 
  Clock, 
  Users,
  BookOpen,
  Target,
  ArrowRight,
  ExternalLink,
  Star,
  DollarSign,
  Calendar
} from 'lucide-react'

const PMICertifications: React.FC = () => {
  const certifications = [
    {
      id: 'pmp',
      title: 'PMP® - Project Management Professional',
      level: 'Avanzado',
      description: 'La certificación más reconocida mundialmente para profesionales en gestión de proyectos.',
      prerequisites: [
        '4-6 años de experiencia en gestión de proyectos',
        '35 horas de educación formal en PM',
        'Título universitario de 4 años (o equivalente)'
      ],
      examDetails: {
        questions: 180,
        duration: '230 minutos',
        passingScore: 'Por encima del Moderadamente Proficiente',
        domains: 3,
        cost: '$405 USD (miembros) / $555 USD (no miembros)'
      },
      benefits: [
        'Reconocimiento global',
        'Aumento salarial promedio 16%',
        'Acceso a red profesional PMI',
        'Validación de competencias'
      ],
      renewalCycle: '3 años (60 PDUs)',
      popularity: 95,
      jobGrowth: '+11% proyectado',
      color: '#DC2626'
    },
    {
      id: 'capm',
      title: 'CAPM® - Certified Associate in Project Management',
      level: 'Básico/Intermedio',
      description: 'Certificación de nivel básico ideal para quienes inician su carrera en gestión de proyectos.',
      prerequisites: [
        '23 horas de educación formal en PM',
        'Título de secundaria (o equivalente)',
        'No requiere experiencia previa'
      ],
      examDetails: {
        questions: 150,
        duration: '3 horas',
        passingScore: '~70%',
        domains: 5,
        cost: '$225 USD (miembros) / $300 USD (no miembros)'
      },
      benefits: [
        'Entrada al campo de PM',
        'Base sólida en PMBOK® Guide',
        'Preparación para PMP®',
        'Credibilidad profesional'
      ],
      renewalCycle: '5 años (15 PDUs)',
      popularity: 78,
      jobGrowth: '+15% proyectado',
      color: '#059669'
    },
    {
      id: 'pmi-acp',
      title: 'PMI-ACP® - Agile Certified Practitioner',
      level: 'Intermedio/Avanzado',
      description: 'Certificación especializada en metodologías ágiles y enfoques adaptativos.',
      prerequisites: [
        '2,000 horas de experiencia general en proyectos',
        '1,500 horas de experiencia en proyectos ágiles',
        '21 horas de educación formal en métodos ágiles'
      ],
      examDetails: {
        questions: 120,
        duration: '3 horas',
        passingScore: 'Criterio establecido por PMI',
        domains: 7,
        cost: '$405 USD (miembros) / $555 USD (no miembros)'
      },
      benefits: [
        'Especialización en metodologías ágiles',
        'Versatilidad en enfoques híbridos',
        'Demanda creciente en el mercado',
        'Complemento perfecto para PMP®'
      ],
      renewalCycle: '3 años (30 PDUs)',
      popularity: 67,
      jobGrowth: '+25% proyectado',
      color: '#1E40AF'
    },
    {
      id: 'pfmp',
      title: 'PfMP® - Portfolio Management Professional',
      level: 'Experto',
      description: 'Certificación de nivel ejecutivo para la gestión de portafolios de proyectos.',
      prerequisites: [
        '8 años de experiencia profesional',
        '4 años de experiencia en gestión de portafolios',
        'Título universitario de 4 años'
      ],
      examDetails: {
        questions: '170 (Panel) + Examen práctico',
        duration: 'Proceso de 2 fases',
        passingScore: 'Evaluación de panel + examen',
        domains: 5,
        cost: '$1,200 USD (Panel) + $800 USD (Examen)'
      },
      benefits: [
        'Posición ejecutiva en PMO',
        'Gestión estratégica de portafolios',
        'Mayor responsabilidad organizacional',
        'Salarios ejecutivos'
      ],
      renewalCycle: '3 años (60 PDUs)',
      popularity: 45,
      jobGrowth: '+8% proyectado',
      color: '#7C2D12'
    },
    {
      id: 'pgmp',
      title: 'PgMP® - Program Management Professional',
      level: 'Avanzado/Experto',
      description: 'Certificación para la gestión de programas complejos y múltiples proyectos relacionados.',
      prerequisites: [
        '6 años de experiencia en gestión de proyectos',
        '4 años de experiencia en gestión de programas',
        'Título universitario de 4 años'
      ],
      examDetails: {
        questions: '170 (Panel) + 170 (Examen)',
        duration: 'Proceso de 2 fases',
        passingScore: 'Evaluación de panel + examen',
        domains: 5,
        cost: '$1,000 USD (Panel) + $800 USD (Examen)'
      },
      benefits: [
        'Gestión de programas complejos',
        'Coordinación de múltiples proyectos',
        'Enfoque estratégico organizacional',
        'Liderazgo de alto nivel'
      ],
      renewalCycle: '3 años (60 PDUs)',
      popularity: 52,
      jobGrowth: '+12% proyectado',
      color: '#7C3AED'
    }
  ]

  const studyResources = [
    {
      title: 'PMBOK® Guide 7th Edition',
      type: 'Estándar Principal',
      description: 'Material base para todas las certificaciones PMI',
      link: '/pmi/resources/pmbok-7'
    },
    {
      title: 'Practice Standard for Project Management',
      type: 'Estándar Complementario',
      description: 'Procesos y mejores prácticas detalladas',
      link: '/pmi/resources/standard-pm'
    },
    {
      title: 'Agile Practice Guide',
      type: 'Guía Especializada',
      description: 'Esencial para PMI-ACP® y enfoques híbridos',
      link: '/pmi/resources/agile-guide'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-4">
          Certificaciones PMI
        </h1>
        <p className="text-xl text-white/90 mb-4">
          Guías Completas para Certificaciones Profesionales
        </p>
        <p className="text-white/80 leading-relaxed max-w-4xl">
          Descubre las certificaciones más reconocidas en gestión de proyectos a nivel mundial. 
          Desde el nivel básico CAPM® hasta certificaciones ejecutivas como PfMP®.
        </p>
      </motion.div>

      {/* Certification Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="morris-card p-6 text-center">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-morris-gray-900 mb-1">1.2M+</div>
            <div className="text-sm text-morris-gray-600">Profesionales Certificados PMP®</div>
          </div>
          <div className="morris-card p-6 text-center">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-morris-gray-900 mb-1">215+</div>
            <div className="text-sm text-morris-gray-600">Países Reconocen PMI</div>
          </div>
          <div className="morris-card p-6 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-morris-gray-900 mb-1">16%</div>
            <div className="text-sm text-morris-gray-600">Aumento Salarial Promedio</div>
          </div>
          <div className="morris-card p-6 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-morris-gray-900 mb-1">5</div>
            <div className="text-sm text-morris-gray-600">Certificaciones Principales</div>
          </div>
        </div>
      </motion.section>

      {/* Certifications */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-morris-gray-900 mb-6">
          Certificaciones Disponibles
        </h2>
        
        <div className="space-y-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              className="morris-card hover:shadow-morris transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.2 }}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div 
                        className="p-3 rounded-lg text-white"
                        style={{ backgroundColor: cert.color }}
                      >
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-morris-gray-900">
                          {cert.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-morris-gray-500 mt-1">
                          <span className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            {cert.level}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {cert.popularity}% popularidad
                          </span>
                          <span className="flex items-center">
                            <ArrowRight className="w-4 h-4 mr-1 text-green-500" />
                            {cert.jobGrowth}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-morris-gray-600 leading-relaxed">
                      {cert.description}
                    </p>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-8">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-sm text-morris-gray-500 mb-1">Renovación</div>
                      <div className="font-semibold text-morris-gray-900">{cert.renewalCycle}</div>
                    </div>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Prerequisites */}
                  <div>
                    <h4 className="font-semibold text-morris-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Requisitos
                    </h4>
                    <ul className="space-y-2">
                      {cert.prerequisites.map((req, idx) => (
                        <li key={idx} className="text-sm text-morris-gray-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-morris-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exam Details */}
                  <div>
                    <h4 className="font-semibold text-morris-gray-900 mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                      Examen
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-morris-gray-600">Preguntas:</span>
                        <span className="font-medium">{cert.examDetails.questions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-morris-gray-600">Duración:</span>
                        <span className="font-medium">{cert.examDetails.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-morris-gray-600">Dominios:</span>
                        <span className="font-medium">{cert.examDetails.domains}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-morris-gray-600">Costo:</span>
                        <span className="font-medium text-green-600">{cert.examDetails.cost}</span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold text-morris-gray-900 mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-500" />
                      Beneficios
                    </h4>
                    <ul className="space-y-2">
                      {cert.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm text-morris-gray-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-morris-gray-200">
                  <div className="text-sm text-morris-gray-500">
                    Información actualizada 2024
                  </div>
                  <div className="flex space-x-3">
                    <button className="morris-button-outline">
                      Guía de Estudio
                    </button>
                    <a 
                      href={`https://www.pmi.org/certifications/${cert.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="morris-button-primary inline-flex items-center"
                    >
                      Información Oficial
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Study Resources */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-morris-gray-900 mb-6">
          Recursos de Estudio
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {studyResources.map((resource, index) => (
            <motion.div
              key={resource.title}
              className="morris-card p-6 hover:shadow-morris transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <BookOpen className="w-8 h-8 text-morris-primary mb-4" />
              <h3 className="font-semibold text-morris-gray-900 mb-2">
                {resource.title}
              </h3>
              <p className="text-sm text-morris-gray-500 mb-3">
                {resource.type}
              </p>
              <p className="text-morris-gray-600 text-sm leading-relaxed mb-4">
                {resource.description}
              </p>
              <button className="morris-button-outline w-full">
                Ver Recurso
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Certification Path */}
      <motion.section
        className="bg-morris-gray-50 -mx-6 -mb-6 p-6 rounded-t-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <h2 className="text-xl font-bold text-morris-gray-900 mb-6">
          Ruta de Certificación Recomendada
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold text-morris-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-600" />
              Para Principiantes
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold text-sm mr-3">1</div>
                <span className="text-morris-gray-700">Comenzar con <strong>CAPM®</strong></span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm mr-3">2</div>
                <span className="text-morris-gray-700">Ganar experiencia práctica (2-4 años)</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold text-sm mr-3">3</div>
                <span className="text-morris-gray-700">Obtener certificación <strong>PMP®</strong></span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold text-morris-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              Para Profesionales Experimentados
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold text-sm mr-3">1</div>
                <span className="text-morris-gray-700">Obtener <strong>PMP®</strong> directamente</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm mr-3">2</div>
                <span className="text-morris-gray-700">Especializar con <strong>PMI-ACP®</strong></span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm mr-3">3</div>
                <span className="text-morris-gray-700">Avanzar a <strong>PgMP®</strong> o <strong>PfMP®</strong></span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default PMICertifications