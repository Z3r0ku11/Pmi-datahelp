import React from 'react';
import { Link } from 'react-router-dom';
import { useMVPTools, useGovernanceGap } from '@/app/providers/TraceabilityProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { StatusBadge, PriorityBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

const toolRoutes = {
  'TOOL-PMO-001': '/tools/project-information',
  'TOOL-PMO-003': '/tools/status-report', 
  'TOOL-PMO-005': '/tools/minutes',
  'TOOL-PMO-004': '/tools/governance-checklist'
};

export function ToolsIndexPage() {
  const mvpTools = useMVPTools();
  const governanceGap = useGovernanceGap();

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Herramientas', isActive: true }
  ];

  const getToolIcon = (toolId: string) => {
    const icons = {
      'TOOL-PMO-001': '📋',
      'TOOL-PMO-003': '📊',
      'TOOL-PMO-005': '📝',
      'TOOL-PMO-004': '✅'
    };
    return icons[toolId as keyof typeof icons] || '🛠️';
  };

  return (
    <div className="container py-8">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Herramientas PMO
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Generadores automáticos de documentos siguiendo los estándares corporativos Morris & Opazo.
          Todas las herramientas integran el contexto del proyecto y permiten exportación a múltiples formatos.
        </p>
      </div>

      {/* MVP Tools Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {mvpTools.map((tool) => {
          const route = toolRoutes[tool.id as keyof typeof toolRoutes];
          const hasGapLimitation = governanceGap && tool.blockingGapIds.includes(governanceGap.id);
          
          return (
            <Card key={tool.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getToolIcon(tool.id)}</span>
                    <div className="flex gap-2">
                      <StatusBadge status={tool.readiness} />
                      <PriorityBadge priority={tool.priority} />
                    </div>
                  </div>
                </div>
                
                <CardTitle>{tool.name}</CardTitle>
                <CardDescription>
                  {tool.description || 'Herramienta de generación automática de documentos PMO'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Formatos de exportación:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tool.exportFormats.map((format) => (
                        <span key={format} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>

                  {hasGapLimitation && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <div className="text-sm text-yellow-800">
                        <strong>GAP-GOV-001:</strong> Algunas funcionalidades de aprobación están pendientes de definición PMO
                      </div>
                    </div>
                  )}

                  {tool.limitations && tool.limitations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Limitaciones:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {tool.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-500 mr-2">•</span>
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-2">
                    {route ? (
                      <Link to={route}>
                        <Button 
                          className="w-full" 
                          variant={tool.readiness === 'READY' ? 'primary' : 'outline'}
                        >
                          {tool.readiness === 'READY' ? 'Abrir Herramienta' : 'Ver Herramienta'}
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        Próximamente
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-blue-800 font-medium mb-2">
          Información de las Herramientas
        </h3>
        <div className="text-blue-700 text-sm space-y-2">
          <p>
            • Todas las herramientas permiten guardar borradores localmente en su navegador
          </p>
          <p>
            • Los documentos generados incluyen automáticamente la información del proyecto
          </p>
          <p>
            • Los formatos de exportación siguen los estándares corporativos Morris & Opazo
          </p>
          <p>
            • Para acceder a plantillas descargables, visite la <Link to="/artifacts" className="underline">Biblioteca de Artefactos</Link>
          </p>
        </div>
      </div>

      {mvpTools.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay herramientas disponibles</h3>
          <p className="text-gray-500">Las herramientas se cargarán desde los datos de trazabilidad</p>
        </div>
      )}
    </div>
  );
}