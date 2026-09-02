import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, TrendingUp, ArrowRight, PlayCircle } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Módulos Educativos',
      description: 'Contenido estructurado sobre gestión de proyectos basado en estándares PMI',
      link: '/modules',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Herramientas Interactivas',
      description: 'Calculadoras, matrices y herramientas prácticas para gestores de proyectos',
      link: '/tools',
      color: 'text-purple-600'
    },
    {
      icon: Award,
      title: 'Recursos Premium',
      description: 'Documentos, plantillas y recursos adicionales para certificaciones',
      link: '/resources',
      color: 'text-green-600'
    },
    {
      icon: TrendingUp,
      title: 'Progreso Personal',
      description: 'Seguimiento de tu avance y logros en el aprendizaje',
      link: '/login',
      color: 'text-orange-600'
    }
  ];

  const stats = [
    { value: '12+', label: 'Módulos Educativos' },
    { value: '8', label: 'Herramientas Interactivas' },
    { value: '50+', label: 'Recursos Descargables' },
    { value: '24/7', label: 'Acceso Disponible' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-background text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 animate-slide-up">
              PMI-DataHelp
            </h1>
            <p className="text-xl mb-8 text-blue-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Portal educativo especializado en gestión de proyectos y certificaciones PMI. 
              Aprende, practica y certifícate con contenido de alta calidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link 
                to="/modules" 
                className="btn-primary text-lg px-8 py-3 inline-flex items-center"
              >
                Comenzar Aprendizaje
                <PlayCircle className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/tools" 
                className="btn-outline border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 inline-flex items-center"
              >
                Explorar Herramientas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Qué encontrarás en PMI-DataHelp?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una plataforma completa de aprendizaje diseñada para profesionales que buscan 
              dominar la gestión de proyectos y obtener certificaciones reconocidas.
            </p>
          </div>

          <div className="modules-grid">
            {features.map((feature, index) => (
              <Link 
                key={index}
                to={feature.link}
                className="card-hover text-decoration-none"
              >
                <div className="p-6">
                  <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
                    Explorar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tu Ruta de Aprendizaje
            </h2>
            <p className="text-xl text-gray-600">
              Progresa paso a paso hacia el dominio de la gestión de proyectos
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: '01',
                  title: 'Fundamentos PMI',
                  description: 'Comprende los conceptos básicos y el marco de trabajo PMI',
                  duration: '2-3 horas',
                  difficulty: 'Principiante'
                },
                {
                  step: '02',
                  title: 'Dominios de Conocimiento',
                  description: 'Profundiza en las 10 áreas de conocimiento del PMBOK',
                  duration: '8-12 horas',
                  difficulty: 'Intermedio'
                },
                {
                  step: '03',
                  title: 'Herramientas Prácticas',
                  description: 'Aplica técnicas y herramientas en casos reales',
                  duration: '4-6 horas',
                  difficulty: 'Intermedio'
                },
                {
                  step: '04',
                  title: 'Preparación PMP',
                  description: 'Prepárate para la certificación con simulacros',
                  duration: '6-8 horas',
                  difficulty: 'Avanzado'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {item.description}
                    </p>
                    <div className="flex space-x-4 text-sm">
                      <span className="badge category">{item.difficulty}</span>
                      <span className="text-gray-500">{item.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar tu journey profesional?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de profesionales que han transformado sus carreras 
            con PMI-DataHelp. El conocimiento que necesitas está aquí.
          </p>
          <Link 
            to="/modules" 
            className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 inline-flex items-center"
          >
            Comenzar Ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;