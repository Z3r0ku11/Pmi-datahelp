import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface ProjectContextState {
  codigo?: string;
  nombre?: string;  
  sponsor?: string;
  projectManager?: string;
  projectId?: string;
  projectName?: string;
  clientName?: string;
  frameworkId?: string;
  startDate?: Date;
  description?: string;
  customFields?: Record<string, any>;
}

type ProjectContextAction =
  | { type: 'SET_PROJECT'; payload: Partial<ProjectContextState> }
  | { type: 'UPDATE_FIELD'; field: keyof ProjectContextState; value: any }
  | { type: 'CLEAR_PROJECT' }
  | { type: 'LOAD_PROJECT'; payload: ProjectContextState };

interface ProjectContextValue {
  projectContext?: ProjectContextState;
  state: ProjectContextState;
  setProject: (project: Partial<ProjectContextState>) => void;
  updateField: (field: keyof ProjectContextState, value: any) => void;
  clearProject: () => void;
  loadProject: (project: ProjectContextState) => void;
  hasProject: boolean;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

function projectContextReducer(state: ProjectContextState, action: ProjectContextAction): ProjectContextState {
  switch (action.type) {
    case 'SET_PROJECT':
      return { ...state, ...action.payload };
    
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    
    case 'CLEAR_PROJECT':
      return {};
    
    case 'LOAD_PROJECT':
      return action.payload;
    
    default:
      return state;
  }
}

interface ProjectContextProviderProps {
  children: ReactNode;
}

export function ProjectContextProvider({ children }: ProjectContextProviderProps) {
  const [state, dispatch] = useReducer(projectContextReducer, {});

  const setProject = (project: Partial<ProjectContextState>) => {
    dispatch({ type: 'SET_PROJECT', payload: project });
  };

  const updateField = (field: keyof ProjectContextState, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const clearProject = () => {
    dispatch({ type: 'CLEAR_PROJECT' });
  };

  const loadProject = (project: ProjectContextState) => {
    dispatch({ type: 'LOAD_PROJECT', payload: project });
  };

  const hasProject = Boolean(state.projectId || state.projectName);

  const value: ProjectContextValue = {
    projectContext: state,
    state,
    setProject,
    updateField,
    clearProject,
    loadProject,
    hasProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext(): ProjectContextValue {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectContextProvider');
  }
  return context;
}

// Validation helper
export function validateProjectContext(context: ProjectContextState): string[] {
  const errors: string[] = [];
  
  if (!context.projectName?.trim()) {
    errors.push('Nombre del proyecto es requerido');
  }
  
  if (!context.frameworkId) {
    errors.push('Framework es requerido');
  }
  
  return errors;
}