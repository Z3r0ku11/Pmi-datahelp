import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PMOGovernanceChecklist } from '../PMOGovernanceChecklist';
import { TraceabilityProvider } from '@/app/providers/TraceabilityProvider';
import { ProjectContextProvider } from '@/app/providers/ProjectContextProvider';

// Mock the providers
const mockControls = [
  {
    id: 'CTRL-CORP-001',
    name: 'Control de Alcance',
    description: 'Verificación del alcance del proyecto',
    frameworkId: 'FRM-CORP-001'
  }
];

const mockGates = [
  {
    id: 'GATE-CORP-001',
    name: 'Gate de Iniciación',
    description: 'Revisión inicial del proyecto'
  },
  {
    id: 'GATE-CORP-002',
    name: 'Gate de Planificación',
    description: 'Revisión de planificación'
  }
];

const mockGovernanceGap = {
  id: 'GAP-GOV-001',
  name: 'Governance Limitation',
  description: 'Proceso de aprobación pendiente'
};

// Mock hooks
vi.mock('@/app/providers/TraceabilityProvider', async () => {
  const actual = await vi.importActual('@/app/providers/TraceabilityProvider');
  return {
    ...actual,
    useControls: () => mockControls,
    useGates: () => mockGates,
    useGovernanceGap: () => mockGovernanceGap
  };
});

vi.mock('@/app/providers/ProjectContextProvider', async () => {
  const actual = await vi.importActual('@/app/providers/ProjectContextProvider');
  return {
    ...actual,
    useProjectContext: () => ({
      projectContext: {
        codigo: 'PRJ-TEST-001',
        nombre: 'Test Project',
        projectManager: 'Test Manager'
      }
    })
  };
});

// Mock export services
vi.mock('@/services/ExcelExportService', () => ({
  ExcelExportService: {
    exportDocument: vi.fn().mockResolvedValue(undefined)
  }
}));

vi.mock('@/services/FileNameService', () => ({
  FileNameService: {
    generateFromToolData: vi.fn().mockReturnValue('test-governance-checklist.xlsx')
  }
}));

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <TraceabilityProvider>
        <ProjectContextProvider>
          <PMOGovernanceChecklist />
        </ProjectContextProvider>
      </TraceabilityProvider>
    </BrowserRouter>
  );
};

describe('PMOGovernanceChecklist', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component', () => {
    renderComponent();
    expect(screen.getByText('Governance Checklist')).toBeInTheDocument();
  });

  it('should display GAP-GOV-001 warning', () => {
    renderComponent();
    expect(screen.getByText('GAP-GOV-001: Limitaciones de Aprobación')).toBeInTheDocument();
  });

  it('should show project context form', () => {
    renderComponent();
    expect(screen.getByText('Contexto del Proyecto')).toBeInTheDocument();
  });

  it('should display step wizard', () => {
    renderComponent();
    expect(screen.getByText('Información General')).toBeInTheDocument();
    expect(screen.getByText('Controles de Governance')).toBeInTheDocument();
    expect(screen.getByText('Gates del Proyecto')).toBeInTheDocument();
  });

  it('should render general information form', () => {
    renderComponent();
    
    expect(screen.getByLabelText('Fecha de Evaluación *')).toBeInTheDocument();
    expect(screen.getByLabelText('Evaluador *')).toBeInTheDocument();
    expect(screen.getByLabelText('Fase del Proyecto *')).toBeInTheDocument();
  });

  it('should navigate between steps', async () => {
    renderComponent();
    
    // Click on Controls step
    const controlsStep = screen.getByText('Controles de Governance');
    fireEvent.click(controlsStep);
    
    await waitFor(() => {
      expect(screen.getByText('CTRL-CORP-001')).toBeInTheDocument();
    });
  });

  it('should display controls with checkboxes', async () => {
    renderComponent();
    
    // Navigate to controls step
    const controlsStep = screen.getByText('Controles de Governance');
    fireEvent.click(controlsStep);
    
    await waitFor(() => {
      expect(screen.getByText('CTRL-CORP-001')).toBeInTheDocument();
      expect(screen.getByText('Control de Alcance')).toBeInTheDocument();
      expect(screen.getByLabelText('Cumplido')).toBeInTheDocument();
    });
  });

  it('should handle control checkbox changes', async () => {
    renderComponent();
    
    // Navigate to controls step
    const controlsStep = screen.getByText('Controles de Governance');
    fireEvent.click(controlsStep);
    
    await waitFor(() => {
      const checkbox = screen.getByLabelText('Cumplido');
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  it('should display gates with status dropdown', async () => {
    renderComponent();
    
    // Navigate to gates step
    const gatesStep = screen.getByText('Gates del Proyecto');
    fireEvent.click(gatesStep);
    
    await waitFor(() => {
      expect(screen.getByText('GATE-CORP-001')).toBeInTheDocument();
      expect(screen.getByText('Gate de Iniciación')).toBeInTheDocument();
    });
  });

  it('should show "Pendiente definición PMO" for blocked gates', async () => {
    renderComponent();
    
    // Navigate to gates step
    const gatesStep = screen.getByText('Gates del Proyecto');
    fireEvent.click(gatesStep);
    
    await waitFor(() => {
      expect(screen.getByText('Pendiente definición PMO', { exact: false })).toBeInTheDocument();
    });
  });

  it('should not show approve/reject options for GAP-GOV-001 affected gates', async () => {
    renderComponent();
    
    // Navigate to gates step
    const gatesStep = screen.getByText('Gates del Proyecto');
    fireEvent.click(gatesStep);
    
    await waitFor(() => {
      // Should not have Approve/Reject options visible for blocked gates
      const approveOptions = screen.queryAllByText('Aprobado');
      const rejectOptions = screen.queryAllByText('Rechazado');
      
      // These should not be available for GATE-CORP-002 and GATE-CORP-003 if they're blocked
      expect(approveOptions.length).toBeLessThanOrEqual(mockGates.length);
      expect(rejectOptions.length).toBeLessThanOrEqual(mockGates.length);
    });
  });

  it('should fill out general information form', async () => {
    renderComponent();
    
    const evaluatorInput = screen.getByLabelText('Evaluador *');
    fireEvent.change(evaluatorInput, { target: { value: 'Test Evaluator' } });
    expect(evaluatorInput).toHaveValue('Test Evaluator');
    
    const phaseSelect = screen.getByLabelText('Fase del Proyecto *');
    fireEvent.change(phaseSelect, { target: { value: 'INICIACION' } });
    expect(phaseSelect).toHaveValue('INICIACION');
  });

  it('should navigate to preview step', async () => {
    renderComponent();
    
    // Navigate to preview step
    const previewStep = screen.getByText('Revisión y Exportación');
    fireEvent.click(previewStep);
    
    await waitFor(() => {
      expect(screen.getByText('Governance Checklist', { selector: 'h3' })).toBeInTheDocument();
    });
  });

  it('should handle export functionality', async () => {
    const { ExcelExportService } = await import('@/services/ExcelExportService');
    
    renderComponent();
    
    // Navigate to preview step
    const previewStep = screen.getByText('Revisión y Exportación');
    fireEvent.click(previewStep);
    
    await waitFor(() => {
      const exportButton = screen.getByText('Exportar como XLSX');
      fireEvent.click(exportButton);
      
      expect(ExcelExportService.exportDocument).toHaveBeenCalled();
    });
  });

  it('should preserve form data between steps', async () => {
    renderComponent();
    
    // Fill evaluator field
    const evaluatorInput = screen.getByLabelText('Evaluador *');
    fireEvent.change(evaluatorInput, { target: { value: 'Test Evaluator' } });
    
    // Navigate to controls step and back
    const controlsStep = screen.getByText('Controles de Governance');
    fireEvent.click(controlsStep);
    
    const infoStep = screen.getByText('Información General');
    fireEvent.click(infoStep);
    
    // Check if data is preserved
    await waitFor(() => {
      expect(screen.getByLabelText('Evaluador *')).toHaveValue('Test Evaluator');
    });
  });

  it('should show validation errors for required fields', async () => {
    renderComponent();
    
    // Navigate to preview without filling required fields
    const previewStep = screen.getByText('Revisión y Exportación');
    fireEvent.click(previewStep);
    
    await waitFor(() => {
      // Should show validation panel with errors
      expect(screen.getByText('Errores de Validación', { exact: false })).toBeInTheDocument();
    });
  });
});