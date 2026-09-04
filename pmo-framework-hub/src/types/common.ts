// Common types used across the application

export interface SourceReference {
  document: string;
  version?: string;
  page?: string;
  section?: string;
  evidenceType?: 'EXPLICIT' | 'DERIVED' | 'INFERRED';
  code?: string;
  author?: string;
  pages?: number;
  sections?: number;
}

export interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  source?: SourceReference;
}

export type EntityType = 
  | 'framework' 
  | 'phase' 
  | 'process' 
  | 'role' 
  | 'artifact' 
  | 'control' 
  | 'gate' 
  | 'tool'
  | 'gap'
  | 'decision';

export type Priority = 'P0' | 'P1' | 'P2' | 'P3';
export type Status = 'READY' | 'PARTIALLY_READY' | 'BLOCKED' | 'PENDING_PMO';
export type MandatoryStatus = 'OBLIGATORIO' | 'OPCIONAL' | 'NO_DETERMINADO';
export type FrameworkType = 'CORPORATIVO' | 'AGIL';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
