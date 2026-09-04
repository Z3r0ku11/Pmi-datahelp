import { describe, it, expect, beforeEach } from 'vitest';
import { SearchService } from '../SearchService';
import { TraceabilityData } from '@/types/traceability';

describe('SearchService', () => {
  let searchService: SearchService;
  let mockData: TraceabilityData;

  beforeEach(() => {
    mockData = {
      metadata: {
        schemaVersion: '1.0',
        discoveryVersion: 'FASE_1_COMPLETE',
        generatedDate: '2024-09-03T00:00:00Z',
        status: 'APPROVED_WITH_OPEN_GAPS'
      },
      frameworks: [
        {
          id: 'FRM-CORP-001',
          name: 'Framework Corporativo',
          description: 'Modelo integral de gestión de proyectos',
          version: 'v3.1',
          type: 'CORPORATIVO'
        }
      ],
      artifacts: [
        {
          id: 'ART-CORP-001',
          name: 'Información Base del Proyecto',
          description: 'Documento con información básica del proyecto',
          type: 'TEMPLATE',
          frameworkId: 'FRM-CORP-001',
          templateName: 'project-info-template.docx'
        }
      ],
      processes: [
        {
          id: 'PROC-CORP-001',
          name: 'Iniciación del Proyecto',
          description: 'Proceso de inicio formal del proyecto',
          phaseId: 'PHASE-CORP-001',
          frameworkId: 'FRM-CORP-001'
        }
      ],
      roles: [
        {
          id: 'ROL-CORP-001',
          name: 'Project Manager',
          description: 'Responsable de la gestión integral del proyecto',
          frameworkId: 'FRM-CORP-001',
          responsibilities: ['Planificar', 'Ejecutar', 'Controlar']
        }
      ],
      controls: [
        {
          id: 'CTRL-CORP-001',
          name: 'Control de Alcance',
          description: 'Verificación del cumplimiento del alcance',
          frameworkId: 'FRM-CORP-001'
        }
      ],
      gates: [
        {
          id: 'GATE-CORP-001',
          name: 'Gate de Iniciación',
          description: 'Revisión inicial del proyecto'
        }
      ],
      tools: [
        {
          id: 'TOOL-PMO-001',
          name: 'Información Base del Proyecto',
          description: 'Herramienta para capturar información del proyecto'
        }
      ],
      phases: [],
      gaps: [],
      decisions: [],
      traces: []
    };

    searchService = new SearchService(mockData);
  });

  describe('constructor', () => {
    it('should initialize with data', () => {
      expect(searchService).toBeDefined();
    });
  });

  describe('search', () => {
    it('should return empty array for empty query', () => {
      const results = searchService.search('');
      expect(results).toEqual([]);
    });

    it('should return empty array for whitespace query', () => {
      const results = searchService.search('   ');
      expect(results).toEqual([]);
    });

    it('should find frameworks by name', () => {
      const results = searchService.search('corporativo');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toContain('Corporativo');
      expect(results[0].type).toBe('framework');
    });

    it('should find artifacts by description', () => {
      const results = searchService.search('información básica');
      expect(results.length).toBeGreaterThan(0);
      const artifactResult = results.find(r => r.type === 'artifact');
      expect(artifactResult).toBeDefined();
      expect(artifactResult?.name).toContain('Información');
    });

    it('should find roles by responsibilities', () => {
      const results = searchService.search('planificar');
      expect(results.length).toBeGreaterThan(0);
      const roleResult = results.find(r => r.type === 'role');
      expect(roleResult).toBeDefined();
    });

    it('should return results with score and matches', () => {
      const results = searchService.search('proyecto');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('score');
      expect(results[0]).toHaveProperty('matches');
      expect(typeof results[0].score).toBe('number');
      expect(Array.isArray(results[0].matches)).toBe(true);
    });

    it('should handle case insensitive search', () => {
      const resultsLower = searchService.search('corporativo');
      const resultsUpper = searchService.search('CORPORATIVO');
      const resultsMixed = searchService.search('Corporativo');
      
      expect(resultsLower.length).toBeGreaterThan(0);
      expect(resultsUpper.length).toBeGreaterThan(0);
      expect(resultsMixed.length).toBeGreaterThan(0);
    });
  });

  describe('searchByType', () => {
    it('should filter results by type', () => {
      const results = searchService.searchByType('proyecto', 'framework');
      const frameworks = results.filter(r => r.type === 'framework');
      expect(frameworks.length).toBe(results.length);
    });

    it('should return empty array for non-matching type', () => {
      const results = searchService.searchByType('test', 'nonexistent' as any);
      expect(results).toEqual([]);
    });
  });

  describe('searchByCategory', () => {
    it('should filter results by category', () => {
      const results = searchService.searchByCategory('corporativo', 'CORPORATIVO');
      expect(results.length).toBeGreaterThan(0);
      results.forEach(result => {
        expect(result.category).toBe('CORPORATIVO');
      });
    });

    it('should return empty array for non-matching category', () => {
      const results = searchService.searchByCategory('test', 'NONEXISTENT');
      expect(results).toEqual([]);
    });
  });

  describe('buildSearchableEntities', () => {
    it('should include all entity types', () => {
      const allResults = searchService.search('proyecto framework información manager control gate tool');
      
      const types = new Set(allResults.map(r => r.type));
      expect(types.has('framework')).toBe(true);
      expect(types.has('artifact')).toBe(true);
      expect(types.has('process')).toBe(true);
      expect(types.has('role')).toBe(true);
      expect(types.has('control')).toBe(true);
      expect(types.has('gate')).toBe(true);
      expect(types.has('tool')).toBe(true);
    });

    it('should handle empty collections gracefully', () => {
      const emptyData: TraceabilityData = {
        metadata: mockData.metadata,
        frameworks: [],
        artifacts: [],
        processes: [],
        roles: [],
        controls: [],
        gates: [],
        tools: [],
        phases: [],
        gaps: [],
        decisions: [],
        traces: []
      };

      const emptySearchService = new SearchService(emptyData);
      const results = emptySearchService.search('anything');
      expect(results).toEqual([]);
    });

    it('should build searchable text correctly', () => {
      const results = searchService.search('v3.1');
      expect(results.length).toBeGreaterThan(0);
      
      const frameworkResult = results.find(r => r.type === 'framework');
      expect(frameworkResult).toBeDefined();
    });
  });
});