import React from 'react';
import { Link } from 'react-router-dom';
import { useFrameworks } from '@/app/providers/TraceabilityProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { FrameworkBadge, Badge } from '@/components/common/Badge';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { EmptyState } from '@/components/common/ErrorBoundary';

export function FrameworkExplorer() {
  const frameworks = useFrameworks();

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Frameworks', isActive: true }
  ];

  return (
    <div className="container py-8">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Framework Explorer
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Explora los marcos de trabajo disponibles para la gestión de proyectos. 
          Cada framework incluye metodologías, procesos, roles y artefactos específicos.
        </p>
      </div>

      {frameworks.length === 0 ? (
        <EmptyState 
          title="No hay frameworks disponibles"
          message="Los frameworks aparecerán aquí cuando estén cargados"
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {frameworks.map((framework) => (
            <Link key={framework.id} to={`/frameworks/${framework.id}`}>
              <Card hover className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <FrameworkBadge framework={framework.type} />
                    <Badge value={framework.version} />
                  </div>
                  <CardTitle>{framework.name}</CardTitle>
                  <CardDescription>
                    {framework.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Cobertura:</span>
                        <span className="font-medium">{framework.traceabilityCoverage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full"
                          style={{ width: `${framework.traceabilityCoverage}%` }}
                        />
                      </div>
                    </div>
                    
                    {framework.source && (
                      <div className="text-sm text-gray-500">
                        <div>Documento: {framework.source.document}</div>
                        {framework.source.pages && (
                          <div>Páginas: {framework.source.pages}</div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}