import React from 'react';
import { useMVPTools, useGovernanceGap } from '@/app/providers/TraceabilityProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { StatusBadge, PriorityBadge } from '@/components/common/Badge';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Link } from 'react-router-dom';

const toolRoutes: Record<string, string> = {
  'TOOL-PMO-001': '/tools/project-information',
  'TOOL-PMO-003': '/tools/status-report',
  'TOOL-PMO-004': '/tools/governance-checklist',
  'TOOL-PMO-005': '/tools/minutes',
};

export function ToolsPage() {
  const mvpTools = useMVPTools();
  const governanceGap = useGovernanceGap();

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Herramientas', isActive: true }
  ];

  return (
    <div className="container py-8">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Herramientas PMO
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Generadores automáticos de documentos siguiendo los estándares corporativos Morris & Opazo.
        </p>
      </div>

      <div className="hub-notice"><div><p className="hub-eyebrow">Estado local</p><h3>Cuatro generadores están disponibles</h3><p>Los botones Abrir herramienta conducen a formularios funcionales con exportación. Las demás herramientas se muestran con su estado real de la matriz.</p></div></div>

      <div className="grid md:grid-cols-2 gap-6">
        {mvpTools.map((tool) => (
          <Card key={tool.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between mb-3">
                <StatusBadge status={tool.readiness} />
                <PriorityBadge priority={tool.priority} />
              </div>
              <CardTitle>{tool.name}</CardTitle>
              <CardDescription>
                {tool.description || 'Herramienta de generación automática de documentos PMO'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Formatos de exportación:</h4>
                  <div className="flex flex-wrap gap-1">
                    {tool.exportFormats.map((format) => (
                      <span key={format} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {format}
                      </span>
                    ))}
                  </div>
                </div>

                {tool.limitations && tool.limitations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Limitaciones:</h4>
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

                {governanceGap && tool.blockingGapIds.includes(governanceGap.id) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <div className="text-sm text-yellow-800">
                      <strong>GAP-GOV-001:</strong> Pendiente definición PMO para funcionalidades de aprobación
                    </div>
                  </div>
                )}
                {toolRoutes[tool.id] ? (
                  <Link className="hub-button hub-tool-link" to={toolRoutes[tool.id]}>Abrir herramienta</Link>
                ) : (
                  <span className="hub-unavailable">Generador aún no implementado</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
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
