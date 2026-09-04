import React from 'react';
import { useProjectContext } from '@/app/providers/ProjectContextProvider';
import { useFrameworks } from '@/app/providers/TraceabilityProvider';
import { ToolShellSection } from '@/components/tools/ToolShell';
import { Button } from '@/components/common/Button';

interface ProjectContextFormProps {
  onComplete?: () => void;
  hideActions?: boolean;
}

export function ProjectContextForm({ onComplete, hideActions = false }: ProjectContextFormProps) {
  const { state, updateField } = useProjectContext();
  const frameworks = useFrameworks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onComplete) onComplete();
  };

  const isValid = state.projectName && state.frameworkId;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ToolShellSection 
        title="Información del Proyecto"
        description="Datos generales que se utilizarán en todas las herramientas durante esta sesión"
        required
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Name */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              id="projectName"
              value={state.projectName || ''}
              onChange={(e) => updateField('projectName', e.target.value)}
              placeholder="Ej: Implementación Sistema CRM"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Client */}
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>
            <input
              type="text"
              id="clientName"
              value={state.clientName || ''}
              onChange={(e) => updateField('clientName', e.target.value)}
              placeholder="Ej: Empresa ABC S.A."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Project Manager */}
          <div>
            <label htmlFor="projectManager" className="block text-sm font-medium text-gray-700 mb-2">
              Project Manager
            </label>
            <input
              type="text"
              id="projectManager"
              value={state.projectManager || ''}
              onChange={(e) => updateField('projectManager', e.target.value)}
              placeholder="Nombre del PM"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Framework */}
          <div>
            <label htmlFor="frameworkId" className="block text-sm font-medium text-gray-700 mb-2">
              Framework a utilizar *
            </label>
            <select
              id="frameworkId"
              value={state.frameworkId || ''}
              onChange={(e) => updateField('frameworkId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar framework</option>
              {frameworks.map(framework => (
                <option key={framework.id} value={framework.id}>
                  {framework.name} ({framework.version})
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Inicio
            </label>
            <input
              type="date"
              id="startDate"
              value={state.startDate ? state.startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => updateField('startDate', e.target.value ? new Date(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción del Proyecto
          </label>
          <textarea
            id="description"
            rows={3}
            value={state.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Breve descripción de los objetivos y alcance del proyecto"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </ToolShellSection>

      {!hideActions && (
        <div className="flex justify-end">
          <Button type="submit" disabled={!isValid}>
            Continuar
          </Button>
        </div>
      )}
    </form>
  );
}

// Compact version for display in other tools
export function ProjectContextSummary() {
  const { state } = useProjectContext();
  const frameworks = useFrameworks();
  
  if (!state.projectName) return null;
  
  const framework = frameworks.find(f => f.id === state.frameworkId);
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h4 className="font-medium text-gray-900 mb-2">Contexto del Proyecto</h4>
      <div className="space-y-1 text-sm text-gray-600">
        <div><strong>Proyecto:</strong> {state.projectName}</div>
        {state.clientName && <div><strong>Cliente:</strong> {state.clientName}</div>}
        {state.projectManager && <div><strong>PM:</strong> {state.projectManager}</div>}
        {framework && <div><strong>Framework:</strong> {framework.name} ({framework.version})</div>}
        {state.startDate && (
          <div><strong>Inicio:</strong> {state.startDate.toLocaleDateString()}</div>
        )}
      </div>
    </div>
  );
}