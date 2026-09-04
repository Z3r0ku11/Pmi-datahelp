import React, { ReactNode } from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { BreadcrumbItem } from '@/types';

export interface ToolShellProps {
  title: string;
  description?: string;
  toolName?: string;
  toolId?: string;
  toolStatus?: 'READY' | 'PARTIALLY_READY' | 'BLOCKED';
  breadcrumbs?: BreadcrumbItem[];
  currentStep?: number;
  totalSteps?: number;
  onBack?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  onClear?: () => void;
  canNext?: boolean;
  canExport?: boolean;
  isLoading?: boolean;
  autoSaveStatus?: 'saving' | 'saved' | 'error' | null;
  children: ReactNode;
}

export function ToolShell({
  title,
  description,
  toolName,
  toolId,
  toolStatus = 'READY',
  breadcrumbs = [],
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSave,
  onExport,
  onClear,
  canNext = true,
  canExport = false,
  isLoading = false,
  autoSaveStatus = null,
  children
}: ToolShellProps) {
  
  const displayName = title || toolName || 'Herramienta PMO';
  
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Herramientas', path: '/tools' },
    { label: displayName, isActive: true }
  ];

  const finalBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={finalBreadcrumbs} className="mb-6" />

        {/* Tool Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                {description && (
                  <p className="text-gray-600 text-sm mt-1">{description}</p>
                )}
              </div>
              <StatusBadge status={toolStatus} />
            </div>
            
            <div className="flex items-center gap-3">
              {/* Autosave indicator */}
              {autoSaveStatus && (
                <div className="flex items-center gap-2 text-sm">
                  {autoSaveStatus === 'saving' && (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      <span className="text-gray-600">Guardando...</span>
                    </>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <>
                      <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-600">Guardado</span>
                    </>
                  )}
                  {autoSaveStatus === 'error' && (
                    <>
                      <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-red-600">Error al guardar</span>
                    </>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {onSave && (
                  <Button variant="outline" size="sm" onClick={onSave} disabled={isLoading}>
                    Guardar borrador
                  </Button>
                )}
                
                {onClear && (
                  <Button variant="ghost" size="sm" onClick={onClear} disabled={isLoading}>
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Step Progress */}
          {currentStep !== undefined && totalSteps !== undefined && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Paso {currentStep} de {totalSteps}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round((currentStep / totalSteps) * 100)}% completado
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tool Content */}
        <div className="bg-white rounded-lg border border-gray-200 min-h-96">
          {children}
        </div>

        {/* Navigation Footer */}
        {(onBack || onNext || onExport) && (
          <div className="flex items-center justify-between mt-6">
            <div>
              {onBack && (
                <Button variant="outline" onClick={onBack} disabled={isLoading}>
                  ← Anterior
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              {onNext && (
                <Button 
                  onClick={onNext} 
                  disabled={!canNext || isLoading}
                >
                  Siguiente →
                </Button>
              )}
              
              {onExport && (
                <Button 
                  variant="primary"
                  onClick={onExport} 
                  disabled={!canExport || isLoading}
                >
                  {isLoading ? 'Exportando...' : 'Exportar'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components for better composition
export function ToolShellContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function ToolShellSection({ 
  title, 
  description, 
  children, 
  required = false,
  className = '' 
}: { 
  title: string; 
  description?: string; 
  children: ReactNode; 
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          {title}
          {required && <span className="text-red-500">*</span>}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}