import { 
  TraceabilityData, 
  Framework, 
  Phase, 
  Process, 
  Role, 
  Artifact, 
  Control, 
  Gate, 
  Tool, 
  Gap, 
  Decision,
  ArtifactFilters,

  ValidationResult,
} from '@/types';
import { TraceabilityDataSchema } from '@/schemas/traceabilitySchema';
import traceabilityJson from '../../docs/traceability/framework-traceability.json';

/**
 * TraceabilityService - Core data access service
 * 
 * Responsible for:
 * - Loading and validating framework-traceability.json
 * - Providing typed data access methods
 * - Resolving entity relationships
 * - Handling validation errors gracefully
 */
export class TraceabilityService {
  private data: TraceabilityData | null = null;
  private validationErrors: string[] = [];

  constructor() {
    this.loadData();
  }

  // Core data loading and validation
  async loadData(): Promise<TraceabilityData> {
    try {
      if (this.data) return this.data;

      const validationResult = TraceabilityDataSchema.safeParse(traceabilityJson);
      
      if (!validationResult.success) {
        this.validationErrors = validationResult.error.errors.map(e => 
          `${e.path.join('.')}: ${e.message}`
        );
        console.error('Traceability data validation failed:', JSON.stringify(this.validationErrors));
        
        // Return empty structure to prevent complete failure
        this.data = this.createEmptyData();
        return this.data;
      }

      this.data = validationResult.data as TraceabilityData;
      this.validationErrors = [];
      return this.data;
    } catch (error) {
      console.error('Failed to load traceability data:', error);
      this.validationErrors = [`Failed to load data: ${error}`];
      this.data = this.createEmptyData();
      return this.data;
    }
  }

  private createEmptyData(): TraceabilityData {
    return {
      metadata: {
        schemaVersion: '1.0',
        discoveryVersion: 'ERROR',
        generatedDate: new Date().toISOString(),
        status: 'INVALID',
        approvedForPhase2: false,
        traceabilityCoverage: { overall: 0, corporativo: 0, agil: 0 },
        mvpStatus: { toolsCount: 0, readyCount: 0, partiallyReadyCount: 0, status: 'ERROR' }
      },
      frameworks: [],
      phases: [],
      processes: [],
      roles: [],
      artifacts: [],
      controls: [],
      gates: [],
      tools: [],
      gaps: [],
      decisions: []
    };
  }

  // Validation and status
  getValidationResult(): ValidationResult {
    return {
      isValid: this.validationErrors.length === 0,
      errors: this.validationErrors,
      warnings: []
    };
  }

  isDataLoaded(): boolean {
    return this.data !== null;
  }

  // Entity getters
  getFrameworks(): Framework[] {
    return this.data?.frameworks || [];
  }

  getFramework(id: string): Framework | null {
    return this.getFrameworks().find(f => f.id === id) || null;
  }

  getPhases(frameworkId?: string): Phase[] {
    const phases = this.data?.phases || [];
    return frameworkId ? phases.filter(p => p.frameworkId === frameworkId) : phases;
  }

  getPhase(id: string): Phase | null {
    return this.getPhases().find(p => p.id === id) || null;
  }

  getProcesses(phaseId?: string): Process[] {
    const processes = this.data?.processes || [];
    return phaseId ? processes.filter(p => p.phaseId === phaseId) : processes;
  }

  getProcess(id: string): Process | null {
    return this.getProcesses().find(p => p.id === id) || null;
  }

  getRoles(frameworkId?: string): Role[] {
    const roles = this.data?.roles || [];
    return frameworkId ? roles.filter(r => r.frameworkId === frameworkId) : roles;
  }

  getRole(id: string): Role | null {
    return this.getRoles().find(r => r.id === id) || null;
  }

  getArtifacts(filters?: ArtifactFilters): Artifact[] {
    let artifacts = this.data?.artifacts || [];

    if (filters) {
      if (filters.frameworkId) {
        artifacts = artifacts.filter(a => a.frameworkId === filters.frameworkId);
      }
      if (filters.type) {
        artifacts = artifacts.filter(a => a.type === filters.type);
      }
      if (filters.mandatoryStatus) {
        artifacts = artifacts.filter(a => a.mandatoryStatus === filters.mandatoryStatus);
      }
      if (filters.hasTemplate !== undefined) {
        artifacts = artifacts.filter(a => a.templateCandidate === filters.hasTemplate);
      }
      if (filters.hasOnlineGenerator !== undefined) {
        artifacts = artifacts.filter(a => a.onlineGenerator === filters.hasOnlineGenerator);
      }
    }

    return artifacts;
  }

  getArtifact(id: string): Artifact | null {
    return this.getArtifacts().find(a => a.id === id) || null;
  }

  getControls(): Control[] {
    return this.data?.controls || [];
  }

  getControl(id: string): Control | null {
    return this.getControls().find(c => c.id === id) || null;
  }

  getGates(): Gate[] {
    return this.data?.gates || [];
  }

  getGate(id: string): Gate | null {
    return this.getGates().find(g => g.id === id) || null;
  }

  getTools(): Tool[] {
    return this.data?.tools || [];
  }

  getMVPTools(): Tool[] {
    return this.getTools().filter(t => t.mvpIncluded);
  }

  getTool(id: string): Tool | null {
    return this.getTools().find(t => t.id === id) || null;
  }

  getGaps(): Gap[] {
    return this.data?.gaps || [];
  }

  getGap(id: string): Gap | null {
    return this.getGaps().find(g => g.id === id) || null;
  }

  getDecisions(): Decision[] {
    return this.data?.decisions || [];
  }

  getDecision(id: string): Decision | null {
    return this.getDecisions().find(d => d.id === id) || null;
  }

  // Relationship resolvers
  getPhasesByFramework(frameworkId: string): Phase[] {
    return this.getPhases(frameworkId).sort((a, b) => a.sequence - b.sequence);
  }

  getProcessesByPhase(phaseId: string): Process[] {
    return this.getProcesses(phaseId).sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
  }

  getProcessesByFramework(frameworkId: string): Process[] {
    return this.getProcesses().filter(p => p.frameworkId === frameworkId);
  }

  getArtifactsByProcess(processId: string): Artifact[] {
    return this.getArtifacts().filter(artifact => artifact.processIds.includes(processId));
  }

  getArtifactsByRole(roleId: string): Artifact[] {
    return this.getArtifacts().filter(a => a.ownerRoleIds.includes(roleId));
  }

  getToolsByArtifact(artifactId: string): Tool[] {
    return this.getTools().filter(tool => tool.artifactId === artifactId);
  }

  getControlsByFramework(frameworkId: string): Control[] {
    return this.getControls().filter(c => c.frameworkId === frameworkId);
  }

  getGatesByFramework(frameworkId: string): Gate[] {
    return this.getGates().filter(g => g.frameworkId === frameworkId);
  }

  getGatesByPhase(phaseId: string): Gate[] {
    const processIds = new Set(this.getProcessesByPhase(phaseId).map(process => process.id));
    return this.getGates().filter(gate => gate.processIds.some(id => processIds.has(id)));
  }

  getGapsByEntity(entityId: string): Gap[] {
    return this.getGaps().filter(g => g.affectedEntityIds.includes(entityId));
  }

  // Special gap handling for GAP-GOV-001
  getGovernanceGap(): Gap | null {
    return this.getGap('GAP-GOV-001');
  }

  hasGovernanceLimitation(entityId: string): boolean {
    const gap = this.getGovernanceGap();
    return gap ? gap.affectedEntityIds.includes(entityId) : false;
  }

  // Entity existence checks
  entityExists(entityId: string): boolean {
    const allEntities = [
      ...this.getFrameworks(),
      ...this.getPhases(),
      ...this.getProcesses(),
      ...this.getRoles(),
      ...this.getArtifacts(),
      ...this.getControls(),
      ...this.getGates(),
      ...this.getTools(),
      ...this.getGaps(),
      ...this.getDecisions()
    ];
    return allEntities.some(entity => entity.id === entityId);
  }

  // Reference validation
  validateReferences(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check framework references in phases
    this.getPhases().forEach(phase => {
      if (!this.getFramework(phase.frameworkId)) {
        errors.push(`Phase ${phase.id} references non-existent framework ${phase.frameworkId}`);
      }
    });

    // Check role references in artifacts
    this.getArtifacts().forEach(artifact => {
      artifact.ownerRoleIds.forEach(roleId => {
        if (!this.getRole(roleId)) {
          errors.push(`Artifact ${artifact.id} references non-existent role ${roleId}`);
        }
      });
    });

    // Check gap references in tools
    this.getTools().forEach(tool => {
      tool.blockingGapIds.forEach(gapId => {
        if (!this.getGap(gapId)) {
          errors.push(`Tool ${tool.id} references non-existent gap ${gapId}`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Metadata accessors
  getMetadata() {
    return this.data?.metadata || null;
  }

  getTraceabilityCoverage(frameworkType?: 'corporativo' | 'agil') {
    const metadata = this.getMetadata();
    if (!metadata) return 0;
    
    if (frameworkType) {
      return metadata.traceabilityCoverage[frameworkType];
    }
    return metadata.traceabilityCoverage.overall;
  }
}

// Singleton instance
export const traceabilityService = new TraceabilityService();
