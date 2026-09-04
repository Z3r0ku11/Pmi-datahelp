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

const projectInfoSchema = z.object({
  projectBasics: z.object({
    codigo: z.string().min(1, 'Código del proyecto es requerido'),
    nombre: z.string().min(1, 'Nombre del proyecto es requerido'),
    descripcion: z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
    objetivoGeneral: z.string().min(10, 'Objetivo general es requerido'),
    alcance: z.string().min(10, 'Alcance debe estar definido'),
    fechaInicio: z.string().min(1, 'Fecha de inicio es requerida'),
    fechaFin: z.string().min(1, 'Fecha estimada de fin es requerida'),
    presupuesto: z.number().min(0, 'Presupuesto debe ser mayor a 0'),
    moneda: z.enum(['CLP', 'USD', 'EUR']),
    sponsor: z.string().min(1, 'Sponsor es requerido'),
    projectManager: z.string().min(1, 'Project Manager es requerido')
  }),
  stakeholders: z.array(z.object({
    id: z.string(),
    nombre: z.string().min(1, 'Nombre es requerido'),
    rol: z.string().min(1, 'Rol es requerido'),
    organizacion: z.string().min(1, 'Organización es requerida'),
    email: z.string().email('Email inválido'),
    telefono: z.string().optional(),
    nivelInfluencia: z.enum(['ALTO', 'MEDIO', 'BAJO']),
    nivelInteres: z.enum(['ALTO', 'MEDIO', 'BAJO'])
  })),
  objetivosEspecificos: z.array(z.object({
    id: z.string(),
    descripcion: z.string().min(1, 'Descripción es requerida'),
    kpi: z.string().min(1, 'KPI es requerido'),
    meta: z.string().min(1, 'Meta es requerida'),
    fechaObjetivo: z.string().min(1, 'Fecha objetivo es requerida')
  })),
  restricciones: z.array(z.object({
    id: z.string(),
    tipo: z.enum(['TIEMPO', 'PRESUPUESTO', 'RECURSOS', 'TECNOLOGIA', 'REGULATORIA', 'OTRA']),
    descripcion: z.string().min(1, 'Descripción es requerida'),
    impacto: z.enum(['ALTO', 'MEDIO', 'BAJO']),
    tratamiento: z.string().min(1, 'Tratamiento es requerido')
  })),
  supuestos: z.array(z.object({
    id: z.string(),
    descripcion: z.string().min(1, 'Descripción es requerida'),
    probabilidad: z.enum(['ALTA', 'MEDIA', 'BAJA']),
    impactoSiIncumple: z.string().min(1, 'Impacto si no se cumple es requerido')
  }))
});

type ProjectInfo = z.infer<typeof projectInfoSchema>;

const TOOL_CONFIG = {
  id: 'TOOL-PMO-001',
  name: 'Información Base del Proyecto',
  description: 'Formulario estructurado para validación de información mínima del proyecto',
  exportFormats: ['PDF', 'JSON'],
  storageKey: 'pmo-project-info-draft'
};

export function PMOProjectInformationGenerator() {
  const { projectContext } = useProjectContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useDraftStorage<ProjectInfo>(TOOL_CONFIG.storageKey, {
    projectBasics: {
      codigo: projectContext?.codigo || '',
      nombre: projectContext?.nombre || '',
      descripcion: '',
      objetivoGeneral: '',
      alcance: '',
      fechaInicio: '',
      fechaFin: '',
      presupuesto: 0,
      moneda: 'CLP' as const,
      sponsor: projectContext?.sponsor || '',
      projectManager: projectContext?.projectManager || ''
    },
    stakeholders: [],
    objetivosEspecificos: [],
    restricciones: [],
    supuestos: []
  });

  const steps = [
    { id: 'basics', title: 'Información Básica', required: true },
    { id: 'stakeholders', title: 'Stakeholders', required: true },
    { id: 'objectives', title: 'Objetivos Específicos', required: true },
    { id: 'constraints', title: 'Restricciones', required: false },
    { id: 'assumptions', title: 'Supuestos', required: false },
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

  const addStakeholder = () => {
    const newStakeholder = {
      id: `stakeholder-${Date.now()}`,
      nombre: '',
      rol: '',
      organizacion: '',
      email: '',
      telefono: '',
      nivelInfluencia: 'MEDIO' as const,
      nivelInteres: 'MEDIO' as const
    };
    setFormData(prev => ({
      ...prev,
      stakeholders: [...prev.stakeholders, newStakeholder]
    }));
  };

  const addObjective = () => {
    const newObjective = {
      id: `objective-${Date.now()}`,
      descripcion: '',
      kpi: '',
      meta: '',
      fechaObjetivo: ''
    };
    setFormData(prev => ({
      ...prev,
      objetivosEspecificos: [...prev.objetivosEspecificos, newObjective]
    }));
  };

  const addConstraint = () => {
    const newConstraint = {
      id: `constraint-${Date.now()}`,
      tipo: 'OTRA' as const,
      descripcion: '',
      impacto: 'MEDIO' as const,
      tratamiento: ''
    };
    setFormData(prev => ({
      ...prev,
      restricciones: [...prev.restricciones, newConstraint]
    }));
  };

  const addAssumption = () => {
    const newAssumption = {
      id: `assumption-${Date.now()}`,
      descripcion: '',
      probabilidad: 'MEDIA' as const,
      impactoSiIncumple: ''
    };
    setFormData(prev => ({
      ...prev,
      supuestos: [...prev.supuestos, newAssumption]
    }));
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'basics':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código del Proyecto *
                </label>
                <input
                  type="text"
                  value={formData.projectBasics.codigo}
                  onChange={(e) => handleDataChange('projectBasics', {
                    ...formData.projectBasics,
                    codigo: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: PRY-2024-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  value={formData.projectBasics.nombre}
                  onChange={(e) => handleDataChange('projectBasics', {
                    ...formData.projectBasics,
                    nombre: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre descriptivo del proyecto"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                value={formData.projectBasics.descripcion}
                onChange={(e) => handleDataChange('projectBasics', {
                  ...formData.projectBasics,
                  descripcion: e.target.value
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción detallada del proyecto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objetivo General *
              </label>
              <textarea
                value={formData.projectBasics.objetivoGeneral}
                onChange={(e) => handleDataChange('projectBasics', {
                  ...formData.projectBasics,
                  objetivoGeneral: e.target.value
                })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="¿Qué se espera lograr con este proyecto?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alcance *
              </label>
              <textarea
                value={formData.projectBasics.alcance}
                onChange={(e) => handleDataChange('projectBasics', {
                  ...formData.projectBasics,
                  alcance: e.target.value
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Qué incluye y qué NO incluye el proyecto..."
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio *
                </label>
                <input
                  type="date"
                  value={formData.projectBasics.fechaInicio}
                  onChange={(e) => handleDataChange('projectBasics', {
                    ...formData.projectBasics,
                    fechaInicio: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin Estimada *
                </label>
                <input
                  type="date"
                  value={formData.projectBasics.fechaFin}
                  onChange={(e) => handleDataChange('projectBasics', {
                    ...formData.projectBasics,
                    fechaFin: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Moneda
                </label>
                <select
                  value={formData.projectBasics.moneda}
                  onChange={(e) => handleDataChange('projectBasics', {
                    ...formData.projectBasics,
                    moneda: e.target.value as 'CLP' | 'USD' | 'EUR'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CLP">CLP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Presupuesto *
                </label>
                <input
                  type="number"
                  value={formData.projectBasics.presupuesto}
                  onChange={(e) => handleDataChange('projectBasics', {
                    ...formData.projectBasics,
                    presupuesto: parseFloat(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sponsor *
                </label>
                <input
                  type="text"
                  value={formData.projectBasics.sponsor}
                  onChange={(e) => handleDataChange('projectBasics', {
                    ...formData.projectBasics,
                    sponsor: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del sponsor del proyecto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Manager *
                </label>
                <input
                  type="text"
                  value={formData.projectBasics.projectManager}
                  onChange={(e) => handleDataChange('projectBasics', {
                    ...formData.projectBasics,
                    projectManager: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del project manager"
                />
              </div>
            </div>
          </div>
        );

      case 'stakeholders':
        return (
          <DynamicTable
            title="Stakeholders del Proyecto"
            data={formData.stakeholders}
            columns={[
              { key: 'nombre', label: 'Nombre', type: 'text', required: true },
              { key: 'rol', label: 'Rol', type: 'text', required: true },
              { key: 'organizacion', label: 'Organización', type: 'text', required: true },
              { key: 'email', label: 'Email', type: 'email', required: true },
              { key: 'telefono', label: 'Teléfono', type: 'tel', required: false },
              { 
                key: 'nivelInfluencia', 
                label: 'Influencia', 
                type: 'select', 
                options: [
                  { value: 'ALTO', label: 'Alto' },
                  { value: 'MEDIO', label: 'Medio' },
                  { value: 'BAJO', label: 'Bajo' }
                ],
                required: true 
              },
              { 
                key: 'nivelInteres', 
                label: 'Interés', 
                type: 'select', 
                options: [
                  { value: 'ALTO', label: 'Alto' },
                  { value: 'MEDIO', label: 'Medio' },
                  { value: 'BAJO', label: 'Bajo' }
                ],
                required: true 
              }
            ]}
            onDataChange={(data) => handleDataChange('stakeholders', data)}
            onAddNew={addStakeholder}
            addButtonText="Agregar Stakeholder"
          />
        );

      case 'objectives':
        return (
          <DynamicTable
            title="Objetivos Específicos"
            data={formData.objetivosEspecificos}
            columns={[
              { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
              { key: 'kpi', label: 'KPI', type: 'text', required: true },
              { key: 'meta', label: 'Meta', type: 'text', required: true },
              { key: 'fechaObjetivo', label: 'Fecha Objetivo', type: 'date', required: true }
            ]}
            onDataChange={(data) => handleDataChange('objetivosEspecificos', data)}
            onAddNew={addObjective}
            addButtonText="Agregar Objetivo"
          />
        );

      case 'constraints':
        return (
          <DynamicTable
            title="Restricciones del Proyecto"
            data={formData.restricciones}
            columns={[
              { 
                key: 'tipo', 
                label: 'Tipo', 
                type: 'select', 
                options: [
                  { value: 'TIEMPO', label: 'Tiempo' },
                  { value: 'PRESUPUESTO', label: 'Presupuesto' },
                  { value: 'RECURSOS', label: 'Recursos' },
                  { value: 'TECNOLOGIA', label: 'Tecnología' },
                  { value: 'REGULATORIA', label: 'Regulatoria' },
                  { value: 'OTRA', label: 'Otra' }
                ],
                required: true 
              },
              { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
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
              { key: 'tratamiento', label: 'Tratamiento', type: 'textarea', required: true }
            ]}
            onDataChange={(data) => handleDataChange('restricciones', data)}
            onAddNew={addConstraint}
            addButtonText="Agregar Restricción"
          />
        );

      case 'assumptions':
        return (
          <DynamicTable
            title="Supuestos del Proyecto"
            data={formData.supuestos}
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
              { key: 'impactoSiIncumple', label: 'Impacto si no se cumple', type: 'textarea', required: true }
            ]}
            onDataChange={(data) => handleDataChange('supuestos', data)}
            onAddNew={addAssumption}
            addButtonText="Agregar Supuesto"
          />
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <ValidationPanel
              data={formData}
              schema={projectInfoSchema}
            />
            <PreviewPanel
              title="Información Base del Proyecto"
              data={formData}
              exportFormats={TOOL_CONFIG.exportFormats}
            />
            <ExportPanel
              data={formData}
              formats={TOOL_CONFIG.exportFormats}
              fileName={`${formData.projectBasics.codigo || 'proyecto'}-informacion-base`}
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