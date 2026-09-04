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

const minutesSchema = z.object({
  meetingInfo: z.object({
    titulo: z.string().min(1, 'Título es requerido'),
    fecha: z.string().min(1, 'Fecha es requerida'),
    horaInicio: z.string().min(1, 'Hora de inicio es requerida'),
    horaFin: z.string().min(1, 'Hora de fin es requerida'),
    modalidad: z.enum(['PRESENCIAL', 'VIRTUAL', 'HIBRIDA']),
    lugar: z.string().optional(),
    urlReunion: z.string().optional(),
    objetivo: z.string().min(10, 'Objetivo debe tener al menos 10 caracteres'),
    organizador: z.string().min(1, 'Organizador es requerido')
  }),
  participantes: z.array(z.object({
    id: z.string(),
    nombre: z.string().min(1, 'Nombre es requerido'),
    rol: z.string().min(1, 'Rol es requerido'),
    organizacion: z.string().min(1, 'Organización es requerida'),
    email: z.string().email('Email inválido'),
    presente: z.boolean(),
    motivo: z.string().optional()
  })),
  agenda: z.array(z.object({
    id: z.string(),
    orden: z.number(),
    tema: z.string().min(1, 'Tema es requerido'),
    responsable: z.string().min(1, 'Responsable es requerido'),
    tiempoEstimado: z.number().min(1, 'Tiempo estimado es requerido'),
    completado: z.boolean(),
    notas: z.string().optional()
  })),
  puntosTratados: z.array(z.object({
    id: z.string(),
    tema: z.string().min(1, 'Tema es requerido'),
    descripcion: z.string().min(1, 'Descripción es requerida'),
    responsable: z.string().optional(),
    decision: z.string().optional(),
    categoria: z.enum(['INFORMATIVO', 'DECISION', 'DISCUSION', 'PRESENTACION'])
  })),
  acuerdos: z.array(z.object({
    id: z.string(),
    descripcion: z.string().min(1, 'Descripción es requerida'),
    responsable: z.string().min(1, 'Responsable es requerido'),
    fechaCompromiso: z.string().min(1, 'Fecha compromiso es requerida'),
    prioridad: z.enum(['ALTA', 'MEDIA', 'BAJA']),
    estado: z.enum(['PENDIENTE', 'EN_PROGRESO', 'COMPLETADO', 'CANCELADO'])
  })),
  tareasPendientes: z.array(z.object({
    id: z.string(),
    descripcion: z.string().min(1, 'Descripción es requerida'),
    responsable: z.string().min(1, 'Responsable es requerido'),
    fechaVencimiento: z.string().min(1, 'Fecha vencimiento es requerida'),
    prioridad: z.enum(['ALTA', 'MEDIA', 'BAJA']),
    dependencias: z.string().optional(),
    comentarios: z.string().optional()
  })),
  proximaReunion: z.object({
    fecha: z.string().optional(),
    hora: z.string().optional(),
    modalidad: z.enum(['PRESENCIAL', 'VIRTUAL', 'HIBRIDA']).optional(),
    agenda: z.string().optional(),
    responsableOrganizacion: z.string().optional()
  }).optional()
});

type Minutes = z.infer<typeof minutesSchema>;

const TOOL_CONFIG = {
  id: 'TOOL-PMO-005',
  name: 'Minuta Online',
  description: 'Generador de minutas de reunión estructuradas',
  exportFormats: ['DOCX'],
  storageKey: 'pmo-minutes-draft'
};

export function PMOMinutesGenerator() {
  const { projectContext } = useProjectContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useDraftStorage<Minutes>(TOOL_CONFIG.storageKey, {
    meetingInfo: {
      titulo: '',
      fecha: new Date().toISOString().split('T')[0],
      horaInicio: '',
      horaFin: '',
      modalidad: 'VIRTUAL',
      lugar: '',
      urlReunion: '',
      objetivo: '',
      organizador: projectContext?.projectManager || ''
    },
    participantes: [],
    agenda: [],
    puntosTratados: [],
    acuerdos: [],
    tareasPendientes: [],
    proximaReunion: {
      fecha: '',
      hora: '',
      modalidad: 'VIRTUAL',
      agenda: '',
      responsableOrganizacion: ''
    }
  });

  const steps = [
    { id: 'meetingInfo', title: 'Información de la Reunión', required: true },
    { id: 'participantes', title: 'Participantes', required: true },
    { id: 'agenda', title: 'Agenda', required: true },
    { id: 'puntosTratados', title: 'Puntos Tratados', required: true },
    { id: 'acuerdos', title: 'Acuerdos y Decisiones', required: false },
    { id: 'tareasPendientes', title: 'Tareas Pendientes', required: false },
    { id: 'proximaReunion', title: 'Próxima Reunión', required: false },
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

  const addParticipante = () => {
    const newParticipante = {
      id: `participante-${Date.now()}`,
      nombre: '',
      rol: '',
      organizacion: '',
      email: '',
      presente: true,
      motivo: ''
    };
    setFormData(prev => ({
      ...prev,
      participantes: [...prev.participantes, newParticipante]
    }));
  };

  const addAgendaItem = () => {
    const newItem = {
      id: `agenda-${Date.now()}`,
      orden: formData.agenda.length + 1,
      tema: '',
      responsable: '',
      tiempoEstimado: 15,
      completado: false,
      notas: ''
    };
    setFormData(prev => ({
      ...prev,
      agenda: [...prev.agenda, newItem]
    }));
  };

  const addPuntoTratado = () => {
    const newPunto = {
      id: `punto-${Date.now()}`,
      tema: '',
      descripcion: '',
      responsable: '',
      decision: '',
      categoria: 'DISCUSION' as const
    };
    setFormData(prev => ({
      ...prev,
      puntosTratados: [...prev.puntosTratados, newPunto]
    }));
  };

  const addAcuerdo = () => {
    const newAcuerdo = {
      id: `acuerdo-${Date.now()}`,
      descripcion: '',
      responsable: '',
      fechaCompromiso: '',
      prioridad: 'MEDIA' as const,
      estado: 'PENDIENTE' as const
    };
    setFormData(prev => ({
      ...prev,
      acuerdos: [...prev.acuerdos, newAcuerdo]
    }));
  };

  const addTarea = () => {
    const newTarea = {
      id: `tarea-${Date.now()}`,
      descripcion: '',
      responsable: '',
      fechaVencimiento: '',
      prioridad: 'MEDIA' as const,
      dependencias: '',
      comentarios: ''
    };
    setFormData(prev => ({
      ...prev,
      tareasPendientes: [...prev.tareasPendientes, newTarea]
    }));
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'meetingInfo':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título de la Reunión *
              </label>
              <input
                type="text"
                value={formData.meetingInfo.titulo}
                onChange={(e) => handleDataChange('meetingInfo', {
                  ...formData.meetingInfo,
                  titulo: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Reunión Semanal de Seguimiento - Proyecto X"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={formData.meetingInfo.fecha}
                  onChange={(e) => handleDataChange('meetingInfo', {
                    ...formData.meetingInfo,
                    fecha: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Inicio *
                </label>
                <input
                  type="time"
                  value={formData.meetingInfo.horaInicio}
                  onChange={(e) => handleDataChange('meetingInfo', {
                    ...formData.meetingInfo,
                    horaInicio: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Fin *
                </label>
                <input
                  type="time"
                  value={formData.meetingInfo.horaFin}
                  onChange={(e) => handleDataChange('meetingInfo', {
                    ...formData.meetingInfo,
                    horaFin: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modalidad *
                </label>
                <select
                  value={formData.meetingInfo.modalidad}
                  onChange={(e) => handleDataChange('meetingInfo', {
                    ...formData.meetingInfo,
                    modalidad: e.target.value as any
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="VIRTUAL">Virtual</option>
                  <option value="HIBRIDA">Híbrida</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizador *
                </label>
                <input
                  type="text"
                  value={formData.meetingInfo.organizador}
                  onChange={(e) => handleDataChange('meetingInfo', {
                    ...formData.meetingInfo,
                    organizador: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del organizador"
                />
              </div>
            </div>

            {(formData.meetingInfo.modalidad === 'PRESENCIAL' || formData.meetingInfo.modalidad === 'HIBRIDA') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lugar
                </label>
                <input
                  type="text"
                  value={formData.meetingInfo.lugar}
                  onChange={(e) => handleDataChange('meetingInfo', {
                    ...formData.meetingInfo,
                    lugar: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sala de reuniones, dirección, etc."
                />
              </div>
            )}

            {(formData.meetingInfo.modalidad === 'VIRTUAL' || formData.meetingInfo.modalidad === 'HIBRIDA') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de la Reunión
                </label>
                <input
                  type="url"
                  value={formData.meetingInfo.urlReunion}
                  onChange={(e) => handleDataChange('meetingInfo', {
                    ...formData.meetingInfo,
                    urlReunion: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://zoom.us/j/..."
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objetivo de la Reunión *
              </label>
              <textarea
                value={formData.meetingInfo.objetivo}
                onChange={(e) => handleDataChange('meetingInfo', {
                  ...formData.meetingInfo,
                  objetivo: e.target.value
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="¿Cuál es el propósito principal de esta reunión?"
              />
            </div>
          </div>
        );

      case 'participantes':
        return (
          <DynamicTable
            title="Participantes de la Reunión"
            data={formData.participantes}
            columns={[
              { key: 'nombre', label: 'Nombre', type: 'text', required: true },
              { key: 'rol', label: 'Rol', type: 'text', required: true },
              { key: 'organizacion', label: 'Organización', type: 'text', required: true },
              { key: 'email', label: 'Email', type: 'email', required: true },
              { key: 'presente', label: 'Presente', type: 'boolean', required: true },
              { key: 'motivo', label: 'Motivo (si ausente)', type: 'text', required: false }
            ]}
            onDataChange={(data) => handleDataChange('participantes', data)}
            onAddNew={addParticipante}
            addButtonText="Agregar Participante"
          />
        );

      case 'agenda':
        return (
          <DynamicTable
            title="Agenda de la Reunión"
            data={formData.agenda}
            columns={[
              { key: 'orden', label: 'Orden', type: 'number', required: true },
              { key: 'tema', label: 'Tema', type: 'text', required: true },
              { key: 'responsable', label: 'Responsable', type: 'text', required: true },
              { key: 'tiempoEstimado', label: 'Tiempo (min)', type: 'number', required: true, min: 1 },
              { key: 'completado', label: 'Completado', type: 'boolean', required: true },
              { key: 'notas', label: 'Notas', type: 'textarea', required: false }
            ]}
            onDataChange={(data) => handleDataChange('agenda', data)}
            onAddNew={addAgendaItem}
            addButtonText="Agregar Item de Agenda"
          />
        );

      case 'puntosTratados':
        return (
          <DynamicTable
            title="Puntos Tratados en la Reunión"
            data={formData.puntosTratados}
            columns={[
              { key: 'tema', label: 'Tema', type: 'text', required: true },
              { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
              { key: 'responsable', label: 'Responsable', type: 'text', required: false },
              { key: 'decision', label: 'Decisión Tomada', type: 'textarea', required: false },
              { 
                key: 'categoria', 
                label: 'Categoría', 
                type: 'select', 
                options: [
                  { value: 'INFORMATIVO', label: 'Informativo' },
                  { value: 'DECISION', label: 'Decisión' },
                  { value: 'DISCUSION', label: 'Discusión' },
                  { value: 'PRESENTACION', label: 'Presentación' }
                ],
                required: true 
              }
            ]}
            onDataChange={(data) => handleDataChange('puntosTratados', data)}
            onAddNew={addPuntoTratado}
            addButtonText="Agregar Punto Tratado"
          />
        );

      case 'acuerdos':
        return (
          <DynamicTable
            title="Acuerdos y Decisiones"
            data={formData.acuerdos}
            columns={[
              { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
              { key: 'responsable', label: 'Responsable', type: 'text', required: true },
              { key: 'fechaCompromiso', label: 'Fecha Compromiso', type: 'date', required: true },
              { 
                key: 'prioridad', 
                label: 'Prioridad', 
                type: 'select', 
                options: [
                  { value: 'ALTA', label: 'Alta' },
                  { value: 'MEDIA', label: 'Media' },
                  { value: 'BAJA', label: 'Baja' }
                ],
                required: true 
              },
              { 
                key: 'estado', 
                label: 'Estado', 
                type: 'select', 
                options: [
                  { value: 'PENDIENTE', label: 'Pendiente' },
                  { value: 'EN_PROGRESO', label: 'En Progreso' },
                  { value: 'COMPLETADO', label: 'Completado' },
                  { value: 'CANCELADO', label: 'Cancelado' }
                ],
                required: true 
              }
            ]}
            onDataChange={(data) => handleDataChange('acuerdos', data)}
            onAddNew={addAcuerdo}
            addButtonText="Agregar Acuerdo"
          />
        );

      case 'tareasPendientes':
        return (
          <DynamicTable
            title="Tareas Pendientes"
            data={formData.tareasPendientes}
            columns={[
              { key: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
              { key: 'responsable', label: 'Responsable', type: 'text', required: true },
              { key: 'fechaVencimiento', label: 'Fecha Vencimiento', type: 'date', required: true },
              { 
                key: 'prioridad', 
                label: 'Prioridad', 
                type: 'select', 
                options: [
                  { value: 'ALTA', label: 'Alta' },
                  { value: 'MEDIA', label: 'Media' },
                  { value: 'BAJA', label: 'Baja' }
                ],
                required: true 
              },
              { key: 'dependencias', label: 'Dependencias', type: 'text', required: false },
              { key: 'comentarios', label: 'Comentarios', type: 'textarea', required: false }
            ]}
            onDataChange={(data) => handleDataChange('tareasPendientes', data)}
            onAddNew={addTarea}
            addButtonText="Agregar Tarea"
          />
        );

      case 'proximaReunion':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Información de la Próxima Reunión</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.proximaReunion?.fecha || ''}
                  onChange={(e) => handleDataChange('proximaReunion', {
                    ...formData.proximaReunion,
                    fecha: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  value={formData.proximaReunion?.hora || ''}
                  onChange={(e) => handleDataChange('proximaReunion', {
                    ...formData.proximaReunion,
                    hora: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modalidad
                </label>
                <select
                  value={formData.proximaReunion?.modalidad || 'VIRTUAL'}
                  onChange={(e) => handleDataChange('proximaReunion', {
                    ...formData.proximaReunion,
                    modalidad: e.target.value as any
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="VIRTUAL">Virtual</option>
                  <option value="HIBRIDA">Híbrida</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsable de Organización
                </label>
                <input
                  type="text"
                  value={formData.proximaReunion?.responsableOrganizacion || ''}
                  onChange={(e) => handleDataChange('proximaReunion', {
                    ...formData.proximaReunion,
                    responsableOrganizacion: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Quien organizará la próxima reunión"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agenda Tentativa
              </label>
              <textarea
                value={formData.proximaReunion?.agenda || ''}
                onChange={(e) => handleDataChange('proximaReunion', {
                  ...formData.proximaReunion,
                  agenda: e.target.value
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Temas a tratar en la próxima reunión..."
              />
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <ValidationPanel
              data={formData}
              schema={minutesSchema}
            />
            <PreviewPanel
              title="Minuta de Reunión"
              data={formData}
              exportFormats={TOOL_CONFIG.exportFormats}
            />
            <ExportPanel
              data={formData}
              formats={TOOL_CONFIG.exportFormats}
              fileName={`minuta-${formData.meetingInfo.titulo.toLowerCase().replace(/\s+/g, '-')}-${formData.meetingInfo.fecha}`}
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