import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TraceabilityService } from '../TraceabilityService';

// Mock the data import
vi.mock('@/data/framework-traceability.json', () => ({
  default: {
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
        description: 'Modelo integral de gestión',
        version: 'v3.1',
        type: 'CORPORATIVO'
      }
    ],
    artifacts: [
      {
        id: 'ART-CORP-001',
        name: 'Información Base',
        description: 'Documento base del proyecto',
        type: 'TEMPLATE',
        frameworkId: 'FRM-CORP-001'
      }
    ],
    processes: [
      {
        id: 'PROC-CORP-001',
        name: 'Iniciación',
        description: 'Proceso de inicio',
        phaseId: 'PHASE-001',
        frameworkId: 'FRM-CORP-001'
      }
    ],
    roles: [
      {
        id: 'ROL-CORP-001',
        name: 'Project Manager',
        description: 'Gestor del proyecto',
        frameworkId: 'FRM-CORP-001'
      }
    ],
    tools: [
      {
        id: 'TOOL-PMO-001',
        name: 'Project Information',
        description: 'Tool for project info',
        mvpIncluded: true,
        readiness: 'READY'
      },
      {
        id: 'TOOL-PMO-002',
        name: 'Risk Matrix',
        description: 'Tool for risks',
        mvpIncluded: false,
        readiness: 'BLOCKED'
      }
    ],
    controls: [
      {
        id: 'CTRL-CORP-001',
        name: 'Control 1',
        description: 'First control',
        frameworkId: 'FRM-CORP-001'
      }
    ],
    gates: [
      {
        id: 'GATE-CORP-001',
        name: 'Gate 1',
        description: 'First gate'
      }
    ],
    gaps: [
      {
        id: 'GAP-GOV-001',
        name: 'Governance Gap',
        description: 'Governance limitation'
      }
    ],
    phases: [],
    decisions: [],
    traces: []
  }
}));

describe('TraceabilityService', () => {
  let service: TraceabilityService;

  beforeEach(async () => {
    service = new TraceabilityService();
    await service.loadData();
  });

  describe('loadData', () => {
    it('should load data successfully', async () => {
      const data = await service.loadData();
      expect(data).toBeDefined();
      expect(data.metadata).toBeDefined();
      expect(data.frameworks).toBeDefined();
    });

    it('should validate loaded data', async () => {
      await service.loadData();
      const validation = service.getValidationResult();
      expect(validation).toBeDefined();
      expect(validation).toHaveProperty('isValid');
      expect(validation).toHaveProperty('errors');
      expect(validation).toHaveProperty('warnings');
    });
  });

  describe('getFrameworks', () => {
    it('should return all frameworks', () => {
      const frameworks = service.getFrameworks();
      expect(frameworks).toBeDefined();
      expect(Array.isArray(frameworks)).toBe(true);
      expect(frameworks.length).toBeGreaterThan(0);
    });
  });

  describe('getFramework', () => {
    it('should return specific framework by id', () => {
      const framework = service.getFramework('FRM-CORP-001');
      expect(framework).toBeDefined();
      expect(framework?.id).toBe('FRM-CORP-001');
      expect(framework?.name).toBe('Framework Corporativo');
    });

    it('should return undefined for non-existent framework', () => {
      const framework = service.getFramework('NON-EXISTENT');
      expect(framework).toBeUndefined();
    });
  });

  describe('getArtifacts', () => {
    it('should return all artifacts when no filter provided', () => {
      const artifacts = service.getArtifacts();
      expect(artifacts).toBeDefined();
      expect(Array.isArray(artifacts)).toBe(true);
      expect(artifacts.length).toBeGreaterThan(0);
    });

    it('should filter artifacts by framework', () => {
      const artifacts = service.getArtifacts({ frameworkId: 'FRM-CORP-001' });
      expect(artifacts).toBeDefined();
      expect(artifacts.every(a => a.frameworkId === 'FRM-CORP-001')).toBe(true);
    });

    it('should filter artifacts by type', () => {
      const artifacts = service.getArtifacts({ type: 'TEMPLATE' });
      expect(artifacts).toBeDefined();
      expect(artifacts.every(a => a.type === 'TEMPLATE')).toBe(true);
    });
  });

  describe('getArtifact', () => {
    it('should return specific artifact by id', () => {
      const artifact = service.getArtifact('ART-CORP-001');
      expect(artifact).toBeDefined();
      expect(artifact?.id).toBe('ART-CORP-001');
      expect(artifact?.name).toBe('Información Base');
    });

    it('should return undefined for non-existent artifact', () => {
      const artifact = service.getArtifact('NON-EXISTENT');
      expect(artifact).toBeUndefined();
    });
  });

  describe('getProcesses', () => {
    it('should return all processes when no phase filter', () => {
      const processes = service.getProcesses();
      expect(processes).toBeDefined();
      expect(Array.isArray(processes)).toBe(true);
    });

    it('should filter processes by phase', () => {
      const processes = service.getProcesses('PHASE-001');
      expect(processes).toBeDefined();
      expect(processes.every(p => p.phaseId === 'PHASE-001')).toBe(true);
    });
  });

  describe('getRoles', () => {
    it('should return all roles when no framework filter', () => {
      const roles = service.getRoles();
      expect(roles).toBeDefined();
      expect(Array.isArray(roles)).toBe(true);
    });

    it('should filter roles by framework', () => {
      const roles = service.getRoles('FRM-CORP-001');
      expect(roles).toBeDefined();
      expect(roles.every(r => r.frameworkId === 'FRM-CORP-001')).toBe(true);
    });
  });

  describe('getRole', () => {
    it('should return specific role by id', () => {
      const role = service.getRole('ROL-CORP-001');
      expect(role).toBeDefined();
      expect(role?.id).toBe('ROL-CORP-001');
      expect(role?.name).toBe('Project Manager');
    });

    it('should return undefined for non-existent role', () => {
      const role = service.getRole('NON-EXISTENT');
      expect(role).toBeUndefined();
    });
  });

  describe('getTools', () => {
    it('should return all tools', () => {
      const tools = service.getTools();
      expect(tools).toBeDefined();
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(0);
    });
  });

  describe('getMVPTools', () => {
    it('should return only MVP tools', () => {
      const mvpTools = service.getMVPTools();
      expect(mvpTools).toBeDefined();
      expect(Array.isArray(mvpTools)).toBe(true);
      expect(mvpTools.every(t => t.mvpIncluded === true)).toBe(true);
    });
  });

  describe('getControls', () => {
    it('should return all controls', () => {
      const controls = service.getControls();
      expect(controls).toBeDefined();
      expect(Array.isArray(controls)).toBe(true);
    });
  });

  describe('getGates', () => {
    it('should return all gates', () => {
      const gates = service.getGates();
      expect(gates).toBeDefined();
      expect(Array.isArray(gates)).toBe(true);
    });
  });

  describe('getGaps', () => {
    it('should return all gaps', () => {
      const gaps = service.getGaps();
      expect(gaps).toBeDefined();
      expect(Array.isArray(gaps)).toBe(true);
    });
  });

  describe('getGovernanceGap', () => {
    it('should return GAP-GOV-001 if exists', () => {
      const gap = service.getGovernanceGap();
      expect(gap).toBeDefined();
      expect(gap?.id).toBe('GAP-GOV-001');
    });
  });

  describe('edge cases', () => {
    it('should handle empty data gracefully', () => {
      const emptyService = new TraceabilityService();
      // Before loading data
      expect(emptyService.getFrameworks()).toEqual([]);
      expect(emptyService.getArtifacts()).toEqual([]);
      expect(emptyService.getTools()).toEqual([]);
    });

    it('should handle filters with no matches', () => {
      const artifacts = service.getArtifacts({ frameworkId: 'NON-EXISTENT' });
      expect(artifacts).toEqual([]);

      const roles = service.getRoles('NON-EXISTENT');
      expect(roles).toEqual([]);

      const processes = service.getProcesses('NON-EXISTENT');
      expect(processes).toEqual([]);
    });
  });
});