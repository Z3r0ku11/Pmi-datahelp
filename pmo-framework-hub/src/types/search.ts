// Search related types
import { EntityType } from './common';

export interface SearchableEntity {
  id: string;
  type: EntityType;
  title: string;
  description: string;
  keywords: string[];
  frameworkId?: string;
  searchText: string;
  path: string;
}

export interface SearchResult {
  item: SearchableEntity;
  score: number;
  matches: SearchMatch[];
}

export interface SearchMatch {
  indices: [number, number][];
  value: string;
  key: string;
}

export interface SearchFilters {
  types?: EntityType[];
  frameworkId?: string;
  priority?: string;
  status?: string;
}

export interface SearchIndex {
  frameworks: SearchableEntity[];
  phases: SearchableEntity[];
  processes: SearchableEntity[];
  roles: SearchableEntity[];
  artifacts: SearchableEntity[];
  controls: SearchableEntity[];
  gates: SearchableEntity[];
  tools: SearchableEntity[];
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  includeScore?: boolean;
  includeMatches?: boolean;
}

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
}