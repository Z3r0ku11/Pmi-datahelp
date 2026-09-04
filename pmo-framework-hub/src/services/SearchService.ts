import Fuse from 'fuse.js';
import { TraceabilityData, Framework, Artifact, Process, Role, Control, Gate, Tool } from '@/types/traceability';

interface SearchableEntity {
  id: string;
  name: string;
  description?: string;
  type: 'framework' | 'artifact' | 'process' | 'role' | 'control' | 'gate' | 'tool';
  category?: string;
  searchableText: string;
}

export class SearchService {
  private fuse: Fuse<SearchableEntity>;
  private entities: SearchableEntity[] = [];

  constructor(data: TraceabilityData) {
    this.entities = this.buildSearchableEntities(data);
    this.fuse = new Fuse(this.entities, {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'searchableText', weight: 0.2 },
        { name: 'type', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    });
  }

  search(query: string): SearchResult[] {
    if (!query.trim()) return [];
    
    const results = this.fuse.search(query);
    return results.map(result => ({
      ...result.item,
      score: result.score || 0,
      matches: result.matches ? [...result.matches] : []
    }));
  }

  searchByType(query: string, type: string): SearchResult[] {
    const results = this.search(query);
    return results.filter(result => result.type === type);
  }

  searchByCategory(query: string, category: string): SearchResult[] {
    const results = this.search(query);
    return results.filter(result => result.category === category);
  }

  private buildSearchableEntities(data: TraceabilityData): SearchableEntity[] {
    const entities: SearchableEntity[] = [];

    // Frameworks
    data.frameworks?.forEach(framework => {
      entities.push({
        id: framework.id,
        name: framework.name,
        description: framework.description,
        type: 'framework',
        category: framework.type,
        searchableText: `${framework.name} ${framework.description || ''} ${framework.version || ''}`
      });
    });

    // Artifacts
    data.artifacts?.forEach(artifact => {
      entities.push({
        id: artifact.id,
        name: artifact.name,
        description: artifact.description,
        type: 'artifact',
        category: artifact.type,
        searchableText: `${artifact.name} ${artifact.description || ''}`
      });
    });

    // Processes
    data.processes?.forEach(process => {
      entities.push({
        id: process.id,
        name: process.name,
        description: process.description,
        type: 'process',
        category: process.phaseId || 'general',
        searchableText: `${process.name} ${process.description || ''}`
      });
    });

    // Roles
    data.roles?.forEach(role => {
      entities.push({
        id: role.id,
        name: role.name,
        description: role.description,
        type: 'role',
        category: role.frameworkId || 'general',
        searchableText: `${role.name} ${role.description || ''} ${role.responsibilities?.join(' ') || ''}`
      });
    });

    // Controls
    data.controls?.forEach(control => {
      entities.push({
        id: control.id,
        name: control.name,
        description: control.description,
        type: 'control',
        category: control.frameworkId || 'general',
        searchableText: `${control.name} ${control.description || ''}`
      });
    });

    // Gates
    data.gates?.forEach(gate => {
      entities.push({
        id: gate.id,
        name: gate.name,
        description: gate.description,
        type: 'gate',
        searchableText: `${gate.name} ${gate.description || ''}`
      });
    });

    // Tools
    data.tools?.forEach(tool => {
      entities.push({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        type: 'tool',
        searchableText: `${tool.name} ${tool.description || ''}`
      });
    });

    return entities;
  }
}

export interface SearchResult extends SearchableEntity {
  score: number;
  matches: any[];
}

export const createSearchService = (data: TraceabilityData) => {
  return new SearchService(data);
};