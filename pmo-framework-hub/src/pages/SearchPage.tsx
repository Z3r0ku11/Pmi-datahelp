import React, { useState, useEffect } from 'react';
import { useSearchService } from '@/app/providers/TraceabilityProvider';
import { SearchResult } from '@/services/SearchService';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { StatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

export function SearchPage() {
  const searchService = useSearchService();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const breadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Búsqueda', isActive: true }
  ];

  const searchTypes = [
    { value: 'all', label: 'Todos' },
    { value: 'framework', label: 'Frameworks' },
    { value: 'artifact', label: 'Artefactos' },
    { value: 'process', label: 'Procesos' },
    { value: 'role', label: 'Roles' },
    { value: 'tool', label: 'Herramientas' },
    { value: 'control', label: 'Controles' },
    { value: 'gate', label: 'Gates' }
  ];

  const handleSearch = (searchQuery: string) => {
    if (!searchService || !searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = selectedType === 'all' 
        ? searchService.search(searchQuery)
        : searchService.searchByType(searchQuery, selectedType);
      
      setResults(searchResults.slice(0, 50)); // Limit results
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        handleSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, selectedType, searchService]);

  const getEntityUrl = (result: SearchResult) => {
    switch (result.type) {
      case 'framework':
        return `/frameworks/${result.id}`;
      case 'artifact':
        return `/artifacts/${result.id}`;
      case 'role':
        return `/roles/${result.id}`;
      case 'tool':
        return `/tools`;
      default:
        return '#';
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      framework: 'bg-purple-100 text-purple-800',
      artifact: 'bg-blue-100 text-blue-800',
      process: 'bg-green-100 text-green-800',
      role: 'bg-orange-100 text-orange-800',
      tool: 'bg-red-100 text-red-800',
      control: 'bg-yellow-100 text-yellow-800',
      gate: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (!searchService) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Servicio de búsqueda no disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Búsqueda en el Framework
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Busque en todos los elementos del framework: artefactos, procesos, roles, herramientas y más.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ingrese su búsqueda..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {searchTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        {query.length > 0 && query.length < 2 && (
          <p className="text-sm text-gray-500">
            Ingrese al menos 2 caracteres para buscar
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Buscando...</p>
        </div>
      )}

      {/* Results */}
      {!loading && query.length >= 2 && (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              {results.length} resultados encontrados para "{query}"
            </p>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-500">
                Intente con diferentes términos de búsqueda
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg">
                            {result.name}
                          </CardTitle>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(result.type)}`}>
                            {result.type}
                          </span>
                          {result.category && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {result.category}
                            </span>
                          )}
                        </div>
                        {result.description && (
                          <p className="text-gray-600 text-sm">
                            {result.description.length > 200
                              ? `${result.description.substring(0, 200)}...`
                              : result.description
                            }
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <a
                          href={getEntityUrl(result)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Ver Detalle
                        </a>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && query.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Búsqueda Avanzada
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Utilice el campo de búsqueda para encontrar artefactos, procesos, roles, herramientas y otros elementos del framework.
          </p>
        </div>
      )}
    </div>
  );
}