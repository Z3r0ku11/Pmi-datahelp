import React from 'react';
import { Link } from 'react-router-dom';
import { useFrameworks, useMVPTools, useTraceabilityData } from '@/app/providers/TraceabilityProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge, FrameworkBadge, StatusBadge } from '@/components/common/Badge';
import { ErrorState, EmptyState } from '@/components/common/ErrorBoundary';

export function HomePage() {
  const { loading, error } = useTraceabilityData();
  const frameworks = useFrameworks();
  const mvpTools = useMVPTools();

  if (loading) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando marcos de trabajo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <ErrorState 
          title="Error al cargar datos"
          message={error}
        />
      </div>
    );
  }

  return (
    <div className="hub-home">
      {/* Hero Section */}
      <section className="container home-hero">
        <div className="home-hero-copy">
          <p className="home-kicker">PMO · PROJECT DELIVERY</p>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            PMO Framework Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Marco metodológico para gestionar proyectos
          </p>
          <p className="text-lg text-gray-500 mb-12">
            <span className="font-semibold">Morris & Opazo</span> - 
            Herramientas, plantillas y guías para la gestión integral de proyectos
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/lifecycle" className="home-cta home-cta-primary">Gestionar mi Proyecto <span>→</span></Link>
            <Link to="/frameworks" className="home-cta home-cta-secondary">Explorar Frameworks</Link>
          </div>
        </div>
      </section>

      {/* Framework Cards */}
      <section className="container home-frameworks pb-16">
        <div className="home-section-heading mb-12">
          <p className="home-kicker">MARCOS DE TRABAJO</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frameworks Disponibles
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Accede a nuestros marcos de trabajo corporativo y adaptativo, diseñados para 
            diferentes tipos de proyectos y contextos organizacionales.
          </p>
        </div>

        {frameworks.length === 0 ? (
          <EmptyState 
            title="No hay frameworks disponibles"
            message="Los frameworks se cargarán cuando los datos estén disponibles"
          />
        ) : (
          <div className="home-framework-grid grid md:grid-cols-2 gap-8">
            {frameworks.map((framework) => (
              <Card 
                key={framework.id} 
                hover 
                className="h-full"
                onClick={() => window.location.href = `/frameworks/${framework.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <FrameworkBadge framework={framework.type} />
                    <Badge value={framework.version} />
                  </div>
                  <CardTitle>{framework.name}</CardTitle>
                  <CardDescription>
                    {framework.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cobertura de trazabilidad:</span>
                      <span className="font-medium">{framework.traceabilityCoverage}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all"
                        style={{ width: `${framework.traceabilityCoverage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Quick Access Grid */}
      <section className="home-access py-16">
        <div className="container">
          <div className="home-section-heading mb-12">
            <p className="home-kicker">NAVEGACIÓN OPERATIVA</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Acceso Rápido
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Governance',
                description: 'Controles, gates y procesos de aprobación',
                icon: '🏛️',
                href: '/governance'
              },
              {
                title: 'Artefactos',
                description: 'Biblioteca completa de plantillas y documentos',
                icon: '📋',
                href: '/artifacts'
              },
              {
                title: 'Herramientas',
                description: 'Generadores automáticos de documentos PMO',
                icon: '🛠️',
                href: '/tools',
                badge: 'MVP'
              },
              {
                title: 'Descargas',
                description: 'Documentos, plantillas y recursos descargables',
                icon: '⬇️',
                href: '/downloads'
              }
            ].map((item) => (
              <Link key={item.title} to={item.href}>
                <Card hover className="home-access-card h-full p-6">
                  <div className="home-access-index">0{item.title === 'Governance' ? 1 : item.title === 'Artefactos' ? 2 : item.title === 'Herramientas' ? 3 : 4}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                    {item.badge && (
                      <Badge variant="status" value="READY" size="sm" className="ml-2" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MVP Tools Preview */}
      <section className="container home-tools py-16">
        <div className="home-section-heading mb-12">
          <p className="home-kicker">AUTOMATIZACIÓN</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Herramientas PMO
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Generadores automáticos para crear documentos profesionales siguiendo 
            los estándares corporativos.
          </p>
        </div>

        {mvpTools.length === 0 ? (
          <EmptyState 
            title="Herramientas en desarrollo"
            message="Las herramientas PMO se activarán en el siguiente bloque de implementación"
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mvpTools.slice(0, 4).map((tool) => (
              <Card key={tool.id} className="text-center p-6">
                <div className="mb-4">
                  <StatusBadge status={tool.readiness} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {tool.description || 'Herramienta PMO automática'}
                </p>
                <div className="text-xs text-gray-500">
                  Formatos: {tool.exportFormats.join(', ')}
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/tools">
            <Button variant="outline">
              Ver todas las herramientas
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
