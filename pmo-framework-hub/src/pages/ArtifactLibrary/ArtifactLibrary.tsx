import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useArtifacts, useFrameworks } from '@/app/providers/TraceabilityProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge, FrameworkBadge, MandatoryBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { EmptyState } from '@/components/common/ErrorBoundary';
import { MandatoryStatus } from '@/types';

export function ArtifactLibrary() {
  const artifacts = useArtifacts();
  const frameworks = useFrameworks();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [selectedMandatory, setSelectedMandatory] = useState<MandatoryStatus | ''>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Artefactos', isActive: true }
  ];

  const filteredArtifacts = useMemo(() => {
    return artifacts.filter(artifact => {
      const matchesSearch = !searchQuery || 
        artifact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artifact.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artifact.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFramework = !selectedFramework || artifact.frameworkId === selectedFramework;
      const matchesMandatory = !selectedMandatory || artifact.mandatoryStatus === selectedMandatory;
      
      return matchesSearch && matchesFramework && matchesMandatory;
    });
  }, [artifacts, searchQuery, selectedFramework, selectedMandatory]);

  const getArtifactTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'documento': '📄',
      'plantilla': '📋',
      'checklist': '✅', 
      'matriz': '📊',
      'plan': '📅',
      'reporte': '📈',
      'presentación': '📽️',
      'acta': '📝',
      'default': '📄'
    };
    return icons[type.toLowerCase()] || icons.default;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedFramework('');
    setSelectedMandatory('');
  };

  return (
    <div className="container py-8">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Biblioteca de Artefactos
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Explora todos los artefactos disponibles en los marcos de trabajo PMO. 
          Encuentra plantillas, documentos y herramientas para cada fase del proyecto.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nombre, descripción, tipo..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Framework Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Framework
            </label>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todos los frameworks</option>
              {frameworks.map(framework => (
                <option key={framework.id} value={framework.id}>
                  {framework.name} ({framework.version})
                </option>
              ))}
            </select>
          </div>

          {/* Mandatory Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Obligatoriedad
            </label>
            <select
              value={selectedMandatory}
              onChange={(e) => setSelectedMandatory(e.target.value as MandatoryStatus | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todas las prioridades</option>
              <option value="OBLIGATORIO">Obligatorio</option>
              <option value="NO_DETERMINADO">Por definir</option>
              <option value="OPCIONAL">Opcional</option>
            </select>
          </div>

          {/* View Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vista
            </label>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'cards' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                Tarjetas
              </Button>
              <Button
                variant={viewMode === 'table' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Tabla
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filteredArtifacts.length} de {artifacts.length} artefactos
          </div>
          
          {(searchQuery || selectedFramework || selectedMandatory) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {filteredArtifacts.length === 0 ? (
        <EmptyState 
          title="No hay artefactos"
          message="No se encontraron artefactos con los filtros aplicados"
          action={
            <Button onClick={clearFilters} variant="outline">
              Limpiar filtros
            </Button>
          }
        />
      ) : viewMode === 'cards' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtifacts.map(artifact => {
            const framework = frameworks.find(f => f.id === artifact.frameworkId);
            
            return (
              <Link key={artifact.id} to={`/artifacts/${artifact.id}`}>
                <Card hover className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getArtifactTypeIcon(artifact.type)}</span>
                        <MandatoryBadge mandatory={artifact.mandatoryStatus} />
                      </div>
                      {framework && (
                        <FrameworkBadge framework={framework.type} />
                      )}
                    </div>
                    
                    <CardTitle className="text-base">
                      {artifact.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {artifact.description && (
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {artifact.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="default" size="sm" value={artifact.type} />
                        {artifact.templateCandidate && (
                          <Badge variant="default" size="sm" value="Plantilla" />
                        )}
                        {artifact.onlineGenerator && (
                          <Badge variant="default" size="sm" value="Online" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artefacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Framework
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Obligatoriedad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredArtifacts.map(artifact => {
                  const framework = frameworks.find(f => f.id === artifact.frameworkId);
                  
                  return (
                    <tr key={artifact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link 
                          to={`/artifacts/${artifact.id}`}
                          className="flex items-center gap-3 hover:text-purple-600"
                        >
                          <span className="text-lg">{getArtifactTypeIcon(artifact.type)}</span>
                          <div>
                            <div className="font-medium text-gray-900">{artifact.name}</div>
                            {artifact.description && (
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {artifact.description}
                              </div>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {framework && (
                          <FrameworkBadge framework={framework.type} />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="default" size="sm" value={artifact.type} />
                      </td>
                      <td className="px-6 py-4">
                        <MandatoryBadge mandatory={artifact.mandatoryStatus} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {artifact.templateCandidate && (
                            <Badge variant="default" size="sm" value="Plantilla" />
                          )}
                          {artifact.onlineGenerator && (
                            <Badge variant="default" size="sm" value="Online" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
