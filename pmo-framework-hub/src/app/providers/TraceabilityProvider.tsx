import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { TraceabilityData, ValidationResult } from '@/types';
import { TraceabilityService, traceabilityService } from '@/services/TraceabilityService';
import { createSearchService, SearchService } from '@/services/SearchService';

interface TraceabilityContextValue {
  data: TraceabilityData | null;
  service: TraceabilityService;
  searchService: SearchService | null;
  loading: boolean;
  error: string | null;
  validation: ValidationResult;
  reload: () => Promise<void>;
}

const TraceabilityContext = createContext<TraceabilityContextValue | null>(null);

interface TraceabilityProviderProps {
  children: ReactNode;
}

export function TraceabilityProvider({ children }: TraceabilityProviderProps) {
  const [data, setData] = useState<TraceabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: []
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('TraceabilityProvider: Starting data load...');
      
      const loadedData = await traceabilityService.loadData();
      const validationResult = traceabilityService.getValidationResult();
      
      console.log('TraceabilityProvider: Data loaded successfully', { 
        dataLoaded: !!loadedData, 
        isValid: validationResult.isValid,
        errors: validationResult.errors 
      });
      
      setData(loadedData);
      setValidation(validationResult);
      
      if (!validationResult.isValid) {
        console.warn('TraceabilityProvider: Validation failed but continuing with loaded data');
        // No setting error here - let the app work with partial data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('TraceabilityProvider: Failed to load data:', err);
      setError(errorMessage);
      
      // Create minimal working data to avoid blank screen
      setData({
        metadata: {
          schemaVersion: '1.0',
          discoveryVersion: 'ERROR',
          generatedDate: new Date().toISOString(),
          status: 'ERROR',
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
      });
    } finally {
      setLoading(false);
      console.log('TraceabilityProvider: Load process completed');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const searchService = useMemo(() => {
    return data ? createSearchService(data) : null;
  }, [data]);

  const contextValue: TraceabilityContextValue = {
    data,
    service: traceabilityService,
    searchService,
    loading,
    error,
    validation,
    reload: loadData
  };

  return (
    <TraceabilityContext.Provider value={contextValue}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos del framework...</p>
          </div>
        </div>
      ) : error ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error de carga</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={loadData}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </TraceabilityContext.Provider>
  );
}

export function useTraceabilityData(): TraceabilityContextValue {
  const context = useContext(TraceabilityContext);
  if (!context) {
    throw new Error('useTraceabilityData must be used within a TraceabilityProvider');
  }
  return context;
}

// Convenience hooks for specific data types
export function useFrameworks() {
  const { service } = useTraceabilityData();
  return service.getFrameworks();
}

export function useFramework(id: string) {
  const { service } = useTraceabilityData();
  return service.getFramework(id);
}

export function usePhases(frameworkId?: string) {
  const { service } = useTraceabilityData();
  return service.getPhases(frameworkId);
}

export function usePhase(id: string) {
  const { service } = useTraceabilityData();
  return service.getPhase(id);
}

export function useProcesses(phaseId?: string) {
  const { service } = useTraceabilityData();
  return service.getProcesses(phaseId);
}

export function useRoles(frameworkId?: string) {
  const { service } = useTraceabilityData();
  return service.getRoles(frameworkId);
}

export function useRole(id: string) {
  const { service } = useTraceabilityData();
  return service.getRole(id);
}

export function useArtifacts(filters?: any) {
  const { service } = useTraceabilityData();
  return service.getArtifacts(filters);
}

export function useArtifact(id: string) {
  const { service } = useTraceabilityData();
  return service.getArtifact(id);
}

export function useTools() {
  const { service } = useTraceabilityData();
  return service.getTools();
}

export function useMVPTools() {
  const { service } = useTraceabilityData();
  return service.getMVPTools();
}

export function useControls() {
  const { service } = useTraceabilityData();
  return service.getControls();
}

export function useGates() {
  const { service } = useTraceabilityData();
  return service.getGates();
}

export function useGaps() {
  const { service } = useTraceabilityData();
  return service.getGaps();
}

export function useSearchService() {
  const { searchService } = useTraceabilityData();
  return searchService;
}
export function useGovernanceGap() {
  const { service } = useTraceabilityData();
  return service.getGovernanceGap();
}