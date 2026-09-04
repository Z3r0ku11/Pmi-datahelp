import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ProjectContextForm } from '@/components/tools/ProjectContextForm';
import { StepWizard } from '@/components/tools/StepWizard';
import { DynamicTable } from '@/components/tools/DynamicTable';
import { ValidationPanel } from '@/components/tools/ValidationPanel';
import { PreviewPanel } from '@/components/tools/PreviewPanel';
import { ExportPanel } from '@/components/tools/ExportPanel';
import { useDraftStorage } from '@/hooks/useDraftStorage';
import { useProjectContext } from '@/app/providers/ProjectContextProvider';
import { z } from 'zod';

const statusReportSchema = z.object({
  reportInfo: z.object({
    periodo: z.string().min(1, 'Período es requerido'),
    fechaReporte: z.string().min(1, 'Fecha del reporte es requerida'),
    semana: z.number().min(1, 'Número de semana es requerido'),
    statusGeneral: z.enum(['EN_TIEMPO', 'EN_RIESGO', 'ATRASADO', 'PAUSADO', 'CANCELADO']),
    resumenEjecutivo: z.string().min(10, 'Resumen ejecutivo es requerido'),
    proximosPasos: z.string().min(10, 'Próximos pasos son requeridos')
  }),
  logros: z.array(z.object({
    id: z.string(),
    descripcion: z.string().min(1, 'Descripción es requerida'),
    fechaCompletado: z.string().min(1, 'Fecha es requerida'),
    responsable: z.string().min(1, 'Responsable es requerido'),
    impacto: z.enum(['ALTO', 'MEDIO', 'BAJO'])
  })),
  actividades: z.array(z.object({
    id: z.string(),
    nombre: z.string().min(1, 'Nombre es requerido'),
    descripcion: z.string().min(1, 'Descripción es requerida'),
    fechaInicio: z.string().min(1, 'Fecha inicio es requerida'),
    fechaFin: z.string().min(1, 'Fecha fin es requerida'),
    progreso: z.number().min(0).max(100),
    responsable: z.string().min(1, 'Responsable es requerido'),
    status: z.enum(['NO_INICIADO', 'EN_PROGRESO', 'COMPLETADO', 'EN_RIESGO', 'BLOQUEADO'])
  })),
  riesgos: z.array(z.object({
    id: z.string(),
    descripcion: z.string().min(1, 'Descripción es requerida'),
    probabilidad: z.enum(['ALTA', 'MEDIA', 'BAJA']),
    impacto: z.enum(['ALTO', 'MEDIO', 'BAJO']),
    mitigacion: z.string().min(1, 'Plan de mitigación es requerido'),
    responsable: z.string().min(1, 'Responsable es requerido'),
    fechaLimite: z.string().min(1, 'Fecha límite es requerida'),
    status: z.enum(['ABIERTO', 'EN_TRATAMIENTO', 'MITIGADO', 'CERRADO'])
  })),
  issues: z.array(z.object({
    id: z.string(),
    descripcion: z.string().min(1, 'Descripción es requerida'),
    prioridad: z.enum(['CRITICA', 'ALTA', 'MEDIA', 'BAJA']),
    fechaIdentificacion: z.string().min(1, 'Fecha identificación es requerida'),
    responsable: z.string().min(1, 'Responsable es requerido'),
    accionCorrectiva: z.string().min(1, 'Acción correctiva es requerida'),
    fechaLimite: z.string().min(1, 'Fecha límite es requerida'),
    status: z.enum(['ABIERTO', 'EN_RESOLUCION', 'RESUELTO', 'ESCALADO'])
  })),
  kpis: z.array(z.object({
    id: z.string(),
    nombre: z.string().min(1, 'Nombre es requerido'),
    valorActual: z.number(),
    valorObjetivo: z.number(),
    unidad: z.string().min(1, 'Unidad es requerida'),
    tendencia: z.enum(['POSITIVA', 'NEUTRAL', 'NEGATIVA']),
    comentarios: z.string().optional()
  }))
});

type StatusReport = z.infer<typeof statusReportSchema>;

const TOOL_CONFIG = {
  id: 'TOOL-PMO-003',
  name: 'Status Report Generator',
  description: 'Generador de reportes de estado semanal del proyecto',
  exportFormats: ['DOCX', 'PPTX', 'PDF'],
  storageKey: 'pmo-status-report-draft'
};

export function PMOStatusReportGenerator() {
  const { projectContext } = useProjectContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useDraftStorage<StatusReport>(TOOL_CONFIG.storageKey, {
    reportInfo: {
      periodo: `Semana del ${new Date().toISOString().split('T')[0]}`,
      fechaReporte: new Date().toISOString().split('T')[0],
      semana: Math.ceil((Date.now() - new Date().getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1,
      statusGeneral: 'EN_TIEMPO',
      resumenEjecutivo: '',
      proximosPasos: ''
    },
    logros: [],
    actividades: [],
    riesgos: [],
    issues: [],
    kpis: []
  });

  const steps = [
    { id: 'reportInfo', title: 'Información del Reporte', required: true },
    { id: 'logros', title: 'Logros de la Semana', required: false },
    { id: 'actividades', title: 'Actividades en Curso', required: true },
    { id: 'riesgos', title: 'Riesgos', required: false },
    { id: 'issues', title: 'Issues', required: false },
    { id: 'kpis', title: 'KPIs', required: false },
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

  const addLogro = () => {
    const newLogro = {
      id: `logro-${Date.now()}`,
      descripcion: '',
      fechaCompletado: new Date().toISOString().split('T')[0],
      responsable: '',
      impacto: 'MEDIO' as const
    };
    setFormData(prev => ({
      ...prev,
      logros: [...prev.logros, newLogro]
    }));
  };

  const addActividad = () => {
    const newActividad = {
      id: `actividad-${Date.now()}`,
      nombre: '',
      descripcion: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: '',
      progreso: 0,
      responsable: '',
      status: 'NO_INICIADO' as const
    };
    setFormData(prev => ({
      ...prev,
      actividades: [...prev.actividades, newActividad]
    }));
  };

  const addRiesgo = () => {
    const newRiesgo = {
      id: `riesgo-${Date.now()}`,
      descripcion: '',
      probabilidad: 'MEDIA' as const,
      impacto: 'MEDIO' as const,
      mitigacion: '',
      responsable: '',
      fechaLimite: '',
      status: 'ABIERTO' as const
    };
    setFormData(prev => ({
      ...prev,
      riesgos: [...prev.riesgos, newRiesgo]
    }));
  };

  const addIssue = () => {
    const newIssue = {
      id: `issue-${Date.now()}`,
      descripcion: '',
      prioridad: 'MEDIA' as const,
      fechaIdentificacion: new Date().toISOString().split('T')[0],
      responsable: '',
      accionCorrectiva: '',
      fechaLimite: '',
      status: 'ABIERTO' as const
    };
    setFormData(prev => ({
      ...prev,
      issues: [...prev.issues, newIssue]
    }));
  };

  const addKPI = () => {
    const newKPI = {
      id: `kpi-${Date.now()}`,
      nombre: '',
      valorActual: 0,
      valorObjetivo: 0,
      unidad: '',
      tendencia: 'NEUTRAL' as const,
      comentarios: ''
    };
    setFormData(prev => ({
      ...prev,
      kpis: [...prev.kpis, newKPI]
    }));
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'reportInfo':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período *
                </label>
                <input
                  type="text"
                  value={formData.reportInfo.periodo}
                  onChange={(e) => handleDataChange('reportInfo', {
                    ...formData.reportInfo,
                    periodo: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Semana del 01-07 Sept 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha del Reporte *
                </label>
                <input
                  type="date"
                  value={formData.reportInfo.fechaReporte}
                  onChange={(e) => handleDataChange('reportInfo', {
                    ...formData.reportInfo,
                    fechaReporte: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semana # *
                </label>
                <input
                  type="number"
                  value={formData.reportInfo.semana}
                  onChange={(e) => handleDataChange('reportInfo', {
                    ...formData.reportInfo,
                    semana: parseInt(e.target.value) || 1
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status General del Proyecto *
              </label>
              <select
                value={formData.reportInfo.statusGeneral}
                onChange={(e) => handleDataChange('reportInfo', {
                  ...formData.reportInfo,
                  statusGeneral: e.target.value as any
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="EN_TIEMPO">En Tiempo</option>
                <option value="EN_RIESGO">En Riesgo</option>
                <option value="ATRASADO">Atrasado</option>
                <option value="PAUSADO">Pausado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resumen Ejecutivo *
              </label>
              <textarea
                value={formData.reportInfo.resumenEjecutivo}
                onChange={(e) => handleDataChange('reportInfo', {
                  ...formData.reportInfo,
                  resumenEjecutivo: e.target.value
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Resumen de la situación actual del proyecto, principales logros y desafíos..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Próximos Pasos *
              </label>
              <textarea
                value={formData.reportInfo.proximosPasos}
                onChange={(e) => handleDataChange('reportInfo', {
                  ...formData.reportInfo,
                  proximosPasos: e.target.value
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Actividades planificadas para la próxima semana..."
              />
            </div>
          </div>
        );

      case 'logros':
        return (
          <DynamicTable
            title="Logros de la Semana"
            data={formData.logros}
            columns={[
              { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
              { key: 'fechaCompletado', label: 'Fecha Completado', type: 'date', required: true },
              { key: 'responsable', label: 'Responsable', type: 'text', required: true },
              { 
                key: 'impacto', 
                label: 'Impacto', 
                type: 'select', 
                options: [
                  { value: 'ALTO', label: 'Alto' },
                  { value: 'MEDIO', label: 'Medio' },
                  { value: 'BAJO', label: 'Bajo' }
                ],
                required: true 
              }
            ]}
            onDataChange={(data) => handleDataChange('logros', data)}
            onAddNew={addLogro}
            addButtonText="Agregar Logro"
          />
        );

      case 'actividades':
        return (
          <DynamicTable
            title="Actividades en Curso"
            data={formData.actividades}
            columns={[
              { key: 'nombre', label: 'Nombre', type: 'text', required: true },
              { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
              { key: 'fechaInicio', label: 'Fecha Inicio', type: 'date', required: true },
              { key: 'fechaFin', label: 'Fecha Fin', type: 'date', required: true },
              { key: 'progreso', label: 'Progreso (%)', type: 'number', required: true, min: 0, max: 100 },
              { key: 'responsable', label: 'Responsable', type: 'text', required: true },
              { 
                key: 'status', 
                label: 'Status', 
                type: 'select', 
                options: [
                  { value: 'NO_INICIADO', label: 'No Iniciado' },
                  { value: 'EN_PROGRESO', label: 'En Progreso' },
                  { value: 'COMPLETADO', label: 'Completado' },
                  { value: 'EN_RIESGO', label: 'En Riesgo' },
                  { value: 'BLOQUEADO', label: 'Bloqueado' }
                ],
                required: true 
              }
            ]}
            onDataChange={(data) => handleDataChange('actividades', data)}
            onAddNew={addActividad}
            addButtonText="Agregar Actividad"
          />
        );

      case 'riesgos':
        return (
          <DynamicTable
            title="Riesgos del Proyecto"
            data={formData.riesgos}
            columns={[
              { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
              { 
                key: 'probabilidad', 
                label: 'Probabilidad', 
                type: 'select', 
                options: [
                  { value: 'ALTA', label: 'Alta' },
                  { value: 'MEDIA', label: 'Media' },
                  { value: 'BAJA', label: 'Baja' }
                ],
                required: true 
              },
              { 
                key: 'impacto', 
                label: 'Impacto', 
                type: 'select', 
                options: [
                  { value: 'ALTO', label: 'Alto' },
                  { value: 'MEDIO', label: 'Medio' },
                  { value: 'BAJO', label: 'Bajo' }
                ],
                required: true 
              },
              { key: 'mitigacion', label: 'Plan de Mitigación', type: 'textarea', required: true },
              { key: 'responsable', label: 'Responsable', type: 'text', required: true },
              { key: 'fechaLimite', label: 'Fecha Límite', type: 'date', required: true },
              { 
                key: 'status', 
                label: 'Status', 
                type: 'select', 
                options: [
                  { value: 'ABIERTO', label: 'Abierto' },
                  { value: 'EN_TRATAMIENTO', label: 'En Tratamiento' },
                  { value: 'MITIGADO', label: 'Mitigado' },
                  { value: 'CERRADO', label: 'Cerrado' }
                ],
                required: true 
              }
            ]}
            onDataChange={(data) => handleDataChange('riesgos', data)}
            onAddNew={addRiesgo}
            addButtonText="Agregar Riesgo"
          />
        );

      case 'issues':
        return (
          <DynamicTable
            title="Issues del Proyecto"
            data={formData.issues}
            columns={[
              { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
              { 
                key: 'prioridad', 
                label: 'Prioridad', 
                type: 'select', 
                options: [
                  { value: 'CRITICA', label: 'Crítica' },
                  { value: 'ALTA', label: 'Alta' },
                  { value: 'MEDIA', label: 'Media' },
                  { value: 'BAJA', label: 'Baja' }
                ],
                required: true 
              },
              { key: 'fechaIdentificacion', label: 'Fecha Identificación', type: 'date', required: true },
              { key: 'responsable', label: 'Responsable', type: 'text', required: true },
              { key: 'accionCorrectiva', label: 'Acción Correctiva', type: 'textarea', required: true },
              { key: 'fechaLimite', label: 'Fecha Límite', type: 'date', required: true },
              { 
                key: 'status', 
                label: 'Status', 
                type: 'select', 
                options: [
                  { value: 'ABIERTO', label: 'Abierto' },
                  { value: 'EN_RESOLUCION', label: 'En Resolución' },
                  { value: 'RESUELTO', label: 'Resuelto' },
                  { value: 'ESCALADO', label: 'Escalado' }
                ],
                required: true 
              }
            ]}
            onDataChange={(data) => handleDataChange('issues', data)}
            onAddNew={addIssue}
            addButtonText="Agregar Issue"
          />
        );

      case 'kpis':
        return (
          <DynamicTable
            title="KPIs del Proyecto"
            data={formData.kpis}
            columns={[
              { key: 'nombre', label: 'Nombre', type: 'text', required: true },
              { key: 'valorActual', label: 'Valor Actual', type: 'number', required: true },
              { key: 'valorObjetivo', label: 'Valor Objetivo', type: 'number', required: true },
              { key: 'unidad', label: 'Unidad', type: 'text', required: true },
              { 
                key: 'tendencia', 
                label: 'Tendencia', 
                type: 'select', 
                options: [
                  { value: 'POSITIVA', label: 'Positiva' },
                  { value: 'NEUTRAL', label: 'Neutral' },
                  { value: 'NEGATIVA', label: 'Negativa' }
                ],
                required: true 
              },
              { key: 'comentarios', label: 'Comentarios', type: 'textarea', required: false }
            ]}
            onDataChange={(data) => handleDataChange('kpis', data)}
            onAddNew={addKPI}
            addButtonText="Agregar KPI"
          />
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <ValidationPanel
              data={formData}
              schema={statusReportSchema}
            />
            <PreviewPanel
              title="Status Report Semanal"
              data={formData}
              exportFormats={TOOL_CONFIG.exportFormats}
            />
            <ExportPanel
              data={formData}
              formats={TOOL_CONFIG.exportFormats}
              fileName={`${projectContext?.codigo || 'proyecto'}-status-report-s${formData.reportInfo.semana}`}
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