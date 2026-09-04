import { z } from 'zod';

// Source reference schema
const SourceReferenceSchema = z.object({
  document: z.string().optional(),
  version: z.string().optional(),
  page: z.string().optional(),
  section: z.string().optional(),
  evidenceType: z.enum(['EXPLICIT', 'DERIVED', 'INFERRED']).optional(),
  code: z.string().optional(),
  author: z.string().optional(),
  pages: z.number().optional(),
  sections: z.number().optional(),
});

// Metadata schema
const MetadataSchema = z.object({
  schemaVersion: z.string(),
  discoveryVersion: z.string(),
  generatedDate: z.string(),
  status: z.string(),
  approvedForPhase2: z.boolean(),
  traceabilityCoverage: z.object({
    overall: z.number(),
    corporativo: z.number(),
    agil: z.number(),
  }),
  mvpStatus: z.object({
    toolsCount: z.number(),
    readyCount: z.number(),
    partiallyReadyCount: z.number(),
    status: z.string(),
  }),
});

// Framework schema
const FrameworkSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  type: z.enum(['CORPORATIVO', 'AGIL']),
  description: z.string(),
  source: SourceReferenceSchema.optional(),
  traceabilityCoverage: z.number(),
});

// Phase schema
const PhaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  frameworkId: z.string(),
  sequence: z.number(),
  description: z.string().optional(),
  source: SourceReferenceSchema.optional(),
});

// Process schema
const ProcessSchema = z.object({
  id: z.string(),
  name: z.string(),
  frameworkId: z.string(),
  phaseId: z.string().optional(),
  sequence: z.number().optional(),
  description: z.string().optional(),
  objective: z.string().optional(),
  trigger: z.string().optional(),
  ownerRoleId: z.string().optional(),
  source: SourceReferenceSchema.optional(),
});

// Role schema
const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  frameworkId: z.string(),
  level: z.string().optional(),
  description: z.string().optional(),
  purpose: z.string().optional(),
  mandatory: z.boolean().optional(),
  responsibilities: z.array(z.string()).optional(),
  source: SourceReferenceSchema.optional(),
});

// Artifact schema
const ArtifactSchema = z.object({
  id: z.string(),
  name: z.string(),
  frameworkId: z.string(),
  phaseIds: z.array(z.string()).default([]),
  processIds: z.array(z.string()).default([]),
  type: z.string(),
  description: z.string().optional(),
  ownerRoleIds: z.array(z.string()),
  mandatoryStatus: z.enum(['OBLIGATORIO', 'OPCIONAL', 'NO_DETERMINADO']),
  templateCandidate: z.boolean(),
  onlineGenerator: z.boolean(),
  toolId: z.string().nullable().optional(),
  officialFormat: z.string().nullable().optional(),
  proposedFormat: z.string().nullable().optional(),
  proposedFileName: z.string().optional(),
  templatePriority: z.enum(['P0', 'P1', 'P2', 'P3']).nullable().optional(),
  external: z.boolean().optional(),
  externalOwner: z.string().optional(),
  gaps: z.array(z.string()).optional(),
  source: SourceReferenceSchema.optional(),
});

// Control schema
const ControlSchema = z.object({
  id: z.string(),
  name: z.string(),
  frameworkId: z.string(),
  description: z.string().optional(),
  mandatory: z.boolean(),
  processIds: z.array(z.string()).default([]),
  evidenceArtifactIds: z.array(z.string()).default([]),
  evidenceDescription: z.string().optional(),
  ownerRoleId: z.string().optional(),
  participantRoleIds: z.array(z.string()).default([]),
  source: SourceReferenceSchema.optional(),
});

// Gate schema
const GateSchema = z.object({
  id: z.string(),
  name: z.string(),
  frameworkId: z.string(),
  description: z.string().optional(),
  processIds: z.array(z.string()).default([]),
  controlIds: z.array(z.string()).default([]),
  mandatory: z.boolean(),
  ownerRoleId: z.string(),
  approverRoleId: z.string().nullable().optional(),
  evidenceArtifactIds: z.array(z.string()).default([]),
  criteria: z.string(),
  gaps: z.array(z.string()).optional(),
  pendingDecisions: z.array(z.string()).optional(),
  source: SourceReferenceSchema.optional(),
});

// Tool schema
const ToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  priority: z.enum(['P0', 'P1', 'P2', 'P3']),
  readiness: z.enum(['READY', 'PARTIALLY_READY', 'BLOCKED']),
  description: z.string().optional(),
  exportFormats: z.array(z.string()),
  blockingGapIds: z.array(z.string()),
  mvpIncluded: z.boolean(),
  limitations: z.array(z.string()).optional(),
  artifactId: z.string().nullable().optional(),
  artifactDescription: z.string().optional(),
  ownerRoleIds: z.array(z.string()).optional(),
  pendingDecisions: z.array(z.string()).optional(),
  relatedControlIds: z.array(z.string()).optional(),
  relatedGateIds: z.array(z.string()).optional(),
  relatedProcessIds: z.array(z.string()).optional(),
  source: SourceReferenceSchema.optional(),
});

// Gap schema
const GapSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  severity: z.string().optional(),
  affectedEntityIds: z.array(z.string()),
  status: z.string(),
  frameworkIds: z.array(z.string()).optional(),
  decisionIds: z.array(z.string()).optional(),
  mvpBlocker: z.union([z.boolean(), z.string()]).optional(),
  source: SourceReferenceSchema.optional(),
});

// Decision schema
const DecisionSchema = z.object({
  id: z.string(),
  title: z.string(),
  question: z.string(),
  options: z.array(z.string()).default([]),
  recommendation: z.string().optional(),
  recommendationEvidence: z.string().optional(),
  affectedEntityIds: z.array(z.string()).default([]),
  urgency: z.string().optional(),
  blockingMvp: z.union([z.boolean(), z.string()]).optional(),
  status: z.enum(['OPEN', 'PENDING', 'APPROVED', 'REJECTED', 'RESOLVED']),
  resolution: z.string().nullable().optional(),
  resolvedBy: z.string().nullable().optional(),
});

const RelationSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  targetId: z.string(),
  relationType: z.string(),
  evidenceType: z.enum(['EXPLICIT', 'DERIVED', 'INFERRED']),
  status: z.string(),
});

// Main traceability data schema
export const TraceabilityDataSchema = z.object({
  metadata: MetadataSchema,
  frameworks: z.array(FrameworkSchema),
  phases: z.array(PhaseSchema),
  processes: z.array(ProcessSchema),
  roles: z.array(RoleSchema),
  artifacts: z.array(ArtifactSchema),
  controls: z.array(ControlSchema),
  gates: z.array(GateSchema),
  tools: z.array(ToolSchema),
  gaps: z.array(GapSchema),
  decisions: z.array(DecisionSchema),
  relations: z.array(RelationSchema).optional(),
  validationResults: z.record(z.unknown()).optional(),
});

// Export individual schemas for testing
export {
  SourceReferenceSchema,
  MetadataSchema,
  FrameworkSchema,
  PhaseSchema,
  ProcessSchema,
  RoleSchema,
  ArtifactSchema,
  ControlSchema,
  GateSchema,
  ToolSchema,
  GapSchema,
  DecisionSchema,
};
