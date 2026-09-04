// Types for the traceability data structure
import { BaseEntity, Priority, Status, MandatoryStatus, FrameworkType } from './common';

export interface TraceabilityMetadata {
  schemaVersion: string;
  discoveryVersion: string;
  generatedDate: string;
  status: string;
  approvedForPhase2: boolean;
  traceabilityCoverage: {
    overall: number;
    corporativo: number;
    agil: number;
  };
  mvpStatus: {
    toolsCount: number;
    readyCount: number;
    partiallyReadyCount: number;
    status: string;
  };
}

export interface Framework extends BaseEntity {
  version: string;
  type: FrameworkType;
  traceabilityCoverage: number;
}

export interface Phase extends BaseEntity {
  frameworkId: string;
  sequence: number;
}

export interface Process extends BaseEntity {
  frameworkId: string;
  phaseId?: string;
  sequence?: number;
  objective?: string;
  trigger?: string;
  ownerRoleId?: string;
}

export interface Role extends BaseEntity {
  frameworkId: string;
  level?: string;
  purpose?: string;
  mandatory?: boolean;
  responsibilities?: string[];
}

export interface Artifact extends BaseEntity {
  frameworkId: string;
  phaseIds: string[];
  processIds: string[];
  type: string;
  ownerRoleIds: string[];
  mandatoryStatus: MandatoryStatus;
  templateCandidate: boolean;
  onlineGenerator: boolean;
  toolId?: string | null;
  officialFormat?: string | null;
  proposedFormat?: string | null;
  proposedFileName?: string;
  templatePriority?: Priority | null;
  external?: boolean;
  externalOwner?: string;
  gaps?: string[];
}

export interface Control extends BaseEntity {
  frameworkId: string;
  mandatory: boolean;
  processIds: string[];
  evidenceArtifactIds: string[];
  evidenceDescription?: string;
  ownerRoleId?: string;
  participantRoleIds: string[];
}

export interface Gate extends BaseEntity {
  frameworkId: string;
  processIds: string[];
  controlIds: string[];
  mandatory: boolean;
  ownerRoleId: string;
  approverRoleId?: string | null;
  evidenceArtifactIds: string[];
  criteria: string;
  gaps?: string[];
  pendingDecisions?: string[];
}

export interface Tool extends BaseEntity {
  priority: Priority;
  readiness: Status;
  exportFormats: string[];
  blockingGapIds: string[];
  mvpIncluded: boolean;
  limitations?: string[];
  artifactId?: string | null;
  artifactDescription?: string;
  ownerRoleIds?: string[];
  pendingDecisions?: string[];
  relatedControlIds?: string[];
  relatedGateIds?: string[];
  relatedProcessIds?: string[];
}

export interface Gap {
  id: string;
  title: string;
  type: string;
  description?: string;
  category?: string;
  severity?: string;
  affectedEntityIds: string[];
  status: string;
  frameworkIds?: string[];
  decisionIds?: string[];
  mvpBlocker?: boolean | string;
  source?: BaseEntity['source'];
}

export interface Decision {
  id: string;
  title: string;
  question: string;
  options: string[];
  recommendation?: string;
  recommendationEvidence?: string;
  affectedEntityIds: string[];
  urgency?: string;
  blockingMvp?: boolean | string;
  status: 'OPEN' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESOLVED';
  resolution?: string | null;
  resolvedBy?: string | null;
}

export interface TraceabilityRelation {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: string;
  evidenceType: 'EXPLICIT' | 'DERIVED' | 'INFERRED';
  status: string;
}

export interface TraceabilityData {
  metadata: TraceabilityMetadata;
  frameworks: Framework[];
  phases: Phase[];
  processes: Process[];
  roles: Role[];
  artifacts: Artifact[];
  controls: Control[];
  gates: Gate[];
  tools: Tool[];
  gaps: Gap[];
  decisions: Decision[];
  relations?: TraceabilityRelation[];
  validationResults?: Record<string, unknown>;
}

// Filter and query interfaces
export interface ArtifactFilters {
  frameworkId?: string;
  phaseId?: string;
  type?: string;
  mandatoryStatus?: MandatoryStatus;
  hasTemplate?: boolean;
  hasOnlineGenerator?: boolean;
}

export interface EntityFilters {
  frameworkId?: string;
  type?: string;
  status?: Status;
  priority?: Priority;
}

export interface RelationshipMap {
  [entityId: string]: string[];
}
