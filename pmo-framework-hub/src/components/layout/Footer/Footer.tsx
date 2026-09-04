import React from 'react';
import { useTraceabilityData } from '@/app/providers/TraceabilityProvider';

export function Footer() {
  const { data } = useTraceabilityData();
  const frameworkVersions = data?.frameworks || [];

  return (
    <footer className="site-footer mt-auto">
      <div className="container">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MO</span>
                </div>
                <span className="font-semibold">Morris & Opazo</span>
              </div>
              <p className="text-sm">
                Marco metodológico corporativo para la gestión integral de proyectos.
              </p>
            </div>

            {/* Framework versions */}
            <div>
              <h3 className="font-semibold mb-4">Frameworks Disponibles</h3>
              <div className="space-y-2">
                {frameworkVersions.map((framework) => (
                  <div key={framework.id} className="text-sm">
                    <span className="font-medium">{framework.name}</span>
                    <span className="ml-2">{framework.version}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <div className="space-y-2 text-sm">
                <a href="/governance" className="block">
                  Governance
                </a>
                <a href="/artifacts" className="block">
                  Biblioteca de Artefactos
                </a>
                <a href="/downloads" className="block">
                  Descargas
                </a>
                <a href="/tools" className="block">
                  Herramientas PMO
                </a>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="site-footer-bottom mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm">
              <div>
                © {new Date().getFullYear()} Morris & Opazo. Marco Metodológico PMO.
              </div>
              {data?.metadata && (
                <div className="mt-2 md:mt-0">
                  Schema v{data.metadata.schemaVersion} | 
                  Cobertura: {data.metadata.traceabilityCoverage.overall}%
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
