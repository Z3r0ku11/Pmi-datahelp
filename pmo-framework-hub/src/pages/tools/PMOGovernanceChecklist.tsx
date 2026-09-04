import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ProjectContextForm } from '@/components/tools/ProjectContextForm';
import { StepWizard } from '@/components/tools/StepWizard';
import { ValidationPanel } from '@/components/tools/ValidationPanel';
import { PreviewPanel } from '@/components/tools/PreviewPanel';
import { ExportPanel } from '@/components/tools/ExportPanel';
import { useDraftStorage } from '@/hooks/useDraftStorage';
import { useProjectContext } from '@/app/providers/ProjectContextProvider';
import { useControls, useGates, useGovernanceGap } from '@/app/providers/TraceabilityProvider';
import { z } from 'zod';

const governanceChecklistSchema = z.object({
  checklistInfo: z.object({
    fechaEvaluacion: z.string().min(1, 'Fecha de evaluación es requerida'),
    evaluador: z.string().min(1, 'Evaluador es requerido'),
    faseProyecto: z.string().min(1, 'Fase del proyecto es requerida'),
    comentariosGenerales: z.string().optional()
  }),
  controles: z.array(z.object({
    id: z.string(),
    controlId: z.string(),
    cumplido: z.boolean(),
    evidencia: z.string().optional(),
    comentarios: z.string().optional(),
    fechaCumplimiento: z.string().optional(),
    responsable: z.string().optional()
  })),
  gates: z.array(z.object({
    id: z.string(),
    gateId: z.string(),
    status: z.enum(['NO_EVALUADO', 'EN_REVISION', 'PENDIENTE_DEFINICION_PMO', 'APROBADO', 'RECHAZADO']),
    comentarios: z.string().optional(),
    fechaEvaluacion: z.string().optional(),
    evaluador: z.string().optional()
  }))
});

type GovernanceChecklist = z.infer<typeof governanceChecklistSchema>;

const TOOL_CONFIG = {
  id: 'TOOL-PMO-004',
  name: 'Governance Checklist',
  description: 'Checklist interactivo de controles de governance del framework',
  exportFormats: ['PDF', 'XLSX'],
  storageKey: 'pmo-governance-checklist-draft'
};
export function PMOGovernanceChecklist() {
  const { projectContext } = useProjectContext();
  const controls = useControls();
  const gates = useGates();
  const governanceGap = useGovernanceGap();
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useDraftStorage<GovernanceChecklist>(TOOL_CONFIG.storageKey, {
    checklistInfo: {
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      evaluador: '',
      faseProyecto: '',
      comentariosGenerales: ''
    },
    controles: controls.map(control => ({
      id: `check-${control.id}`,
      controlId: control.id,
      cumplido: false,
      evidencia: '',
      comentarios: '',
      fechaCumplimiento: '',
      responsable: ''
    })),
    gates: gates.map(gate => ({
      id: `gate-${gate.id}`,
      gateId: gate.id,
      status: 'NO_EVALUADO' as const,
      comentarios: '',
      fechaEvaluacion: '',
      evaluador: ''
    }))
  });

  const steps = [
    { id: 'checklistInfo', title: 'Información General', required: true },
    { id: 'controles', title: 'Controles de Governance', required: true },
    { id: 'gates', title: 'Gates del Proyecto', required: true },
    { id: 'preview', title: 'Revisión y Exportación', required: false }
  ];

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleDataChange = (stepId: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: data
    }));
  };

  const updateControl = (controlId: string, updates: any) => {
    setFormData(prev => ({
      ...prev,
      controles: prev.controles.map(control => 
        control.controlId === controlId ? { ...control, ...updates } : control
      )
    }));
  };

  const updateGate = (gateId: string, updates: any) => {
    setFormData(prev => ({
      ...prev,
      gates: prev.gates.map(gate => 
        gate.gateId === gateId ? { ...gate, ...updates } : gate
      )
    }));
  };
  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'checklistInfo':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Evaluación *
                </label>
                <input
                  type="date"
                  value={formData.checklistInfo.fechaEvaluacion}
                  onChange={(e) => handleDataChange('checklistInfo', {
                    ...formData.checklistInfo,
                    fechaEvaluacion: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Evaluador *
                </label>
                <input
                  type="text"
                  value={formData.checklistInfo.evaluador}
                  onChange={(e) => handleDataChange('checklistInfo', {
                    ...formData.checklistInfo,
                    evaluador: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del evaluador"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fase del Proyecto *
              </label>
              <select
                value={formData.checklistInfo.faseProyecto}
                onChange={(e) => handleDataChange('checklistInfo', {
                  ...formData.checklistInfo,
                  faseProyecto: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione una fase</option>
                <option value="INICIACION">Iniciación</option>
                <option value="PLANIFICACION">Planificación</option>
                <option value="EJECUCION">Ejecución</option>
                <option value="CONTROL">Monitoreo y Control</option>
                <option value="CIERRE">Cierre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentarios Generales
              </label>
              <textarea
                value={formData.checklistInfo.comentariosGenerales}
                onChange={(e) => handleDataChange('checklistInfo', {
                  ...formData.checklistInfo,
                  comentariosGenerales: e.target.value
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observaciones generales sobre el estado de governance del proyecto..."
              />
            </div>
          </div>
        );
      case 'controles':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Controles de Governance</h3>
            <div className="space-y-4">
              {controls.map((control) => {
                const checklistItem = formData.controles.find(c => c.controlId === control.id);
                return (
                  <div key={control.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{control.id}</h4>
                        <p className="text-sm text-gray-600 mt-1">{control.name}</p>
                        {control.description && (
                          <p className="text-sm text-gray-500 mt-1">{control.description}</p>
                        )}
                      </div>
                      <div className="ml-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checklistItem?.cumplido || false}
                            onChange={(e) => updateControl(control.id, { cumplido: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Cumplido</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Evidencia
                        </label>
                        <input
                          type="text"
                          value={checklistItem?.evidencia || ''}
                          onChange={(e) => updateControl(control.id, { evidencia: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Documento, proceso, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Responsable
                        </label>
                        <input
                          type="text"
                          value={checklistItem?.responsable || ''}
                          onChange={(e) => updateControl(control.id, { responsable: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Nombre del responsable"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Comentarios
                      </label>
                      <textarea
                        value={checklistItem?.comentarios || ''}
                        onChange={(e) => updateControl(control.id, { comentarios: e.target.value })}
                        rows={2}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Observaciones adicionales..."
                      />
                    </div>

                    {checklistItem?.cumplido && (
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Fecha de Cumplimiento
                        </label>
                        <input
                          type="date"
                          value={checklistItem?.fechaCumplimiento || ''}
                          onChange={(e) => updateControl(control.id, { fechaCumplimiento: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'gates':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Gates del Proyecto</h3>
            
            {governanceGap && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-yellow-400 mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">GAP-GOV-001: Limitaciones de Aprobación</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      El proceso formal de aprobación de gates está pendiente de definición PMO. 
                      Esta herramienta permite evaluar el cumplimiento pero no aprobar formalmente.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {gates.map((gate) => {
                const gateItem = formData.gates.find(g => g.gateId === gate.id);
                const isBlocked = governanceGap && ['GATE-CORP-002', 'GATE-CORP-003'].includes(gate.id);
                
                return (
                  <div key={gate.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900">{gate.id}</h4>
                      <p className="text-sm text-gray-600 mt-1">{gate.name}</p>
                      {gate.description && (
                        <p className="text-sm text-gray-500 mt-1">{gate.description}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={gateItem?.status || 'NO_EVALUADO'}
                          onChange={(e) => updateGate(gate.id, { status: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          disabled={!!isBlocked}
                        >
                          <option value="NO_EVALUADO">No Evaluado</option>
                          <option value="EN_REVISION">En Revisión</option>
                          {isBlocked ? (
                            <option value="PENDIENTE_DEFINICION_PMO">Pendiente Definición PMO</option>
                          ) : (
                            <>
                              <option value="APROBADO">Aprobado</option>
                              <option value="RECHAZADO">Rechazado</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Evaluador
                        </label>
                        <input
                          type="text"
                          value={gateItem?.evaluador || ''}
                          onChange={(e) => updateGate(gate.id, { evaluador: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Nombre del evaluador"
                          disabled={!!isBlocked}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Comentarios
                      </label>
                      <textarea
                        value={gateItem?.comentarios || ''}
                        onChange={(e) => updateGate(gate.id, { comentarios: e.target.value })}
                        rows={2}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder={!!isBlocked ? "Pendiente definición PMO" : "Observaciones sobre el gate..."}
                        disabled={!!isBlocked}
                      />
                    </div>

                    {gateItem?.status !== 'NO_EVALUADO' && !isBlocked && (
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Fecha de Evaluación
                        </label>
                        <input
                          type="date"
                          value={gateItem?.fechaEvaluacion || ''}
                          onChange={(e) => updateGate(gate.id, { fechaEvaluacion: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {isBlocked && (
                      <div className="mt-3 bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-600">
                          <strong>Nota:</strong> Este gate requiere definición formal del proceso de aprobación PMO.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'preview':
        return (
          <div className="space-y-6">
            <ValidationPanel
              data={formData}
              schema={governanceChecklistSchema}
            />
            <PreviewPanel
              title="Governance Checklist"
              data={formData}
              exportFormats={TOOL_CONFIG.exportFormats}
            />
            <ExportPanel
              data={formData}
              formats={TOOL_CONFIG.exportFormats}
              fileName={`${projectContext?.codigo || 'proyecto'}-governance-checklist-${formData.checklistInfo.fechaEvaluacion}`}
              toolId={TOOL_CONFIG.id}
            />
          </div>
        );

      default:
        return <div>Paso no encontrado</div>;
    }
  };

  return (
    <ToolShell
      toolId={TOOL_CONFIG.id}
      title={TOOL_CONFIG.name}
      description={TOOL_CONFIG.description}
    >
      <ProjectContextForm />
      
      <div className="border-t pt-8">
        <StepWizard
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
        />
        
        <div className="mt-8">
          {renderStepContent()}
        </div>
      </div>
    </ToolShell>
  );
}