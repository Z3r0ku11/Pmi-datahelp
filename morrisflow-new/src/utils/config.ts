// MorrisFlow Configuration

import type { Environment, FeatureFlags, BrandingConfig } from '../types/index'

// Environment Detection
export const getEnvironment = (): Environment => {
  const mode = import.meta.env.VITE_APP_ENV as 'production' | 'staging' | 'development'
  
  return {
    name: import.meta.env.VITE_APP_NAME || 'MorrisFlow',
    mode,
    frameworkVersion: import.meta.env.VITE_FRAMEWORK_VERSION || '3.1',
    apiUrl: import.meta.env.VITE_API_BASE_URL || '',
    features: getFeatureFlags(),
    branding: getBrandingConfig()
  }
}

export const getFeatureFlags = (): FeatureFlags => ({
  enableMorrisFramework: import.meta.env.VITE_ENABLE_MORRIS_FRAMEWORK === 'true',
  enablePMIPortal: import.meta.env.VITE_ENABLE_PMI_PORTAL === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableWorkflows: import.meta.env.VITE_ENABLE_WORKFLOWS === 'true',
  mockData: import.meta.env.VITE_MOCK_DATA === 'true',
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true'
})

export const getBrandingConfig = (): BrandingConfig => ({
  primaryColor: import.meta.env.VITE_BRAND_PRIMARY_COLOR || '#1E40AF',
  secondaryColor: import.meta.env.VITE_BRAND_SECONDARY_COLOR || '#059669',
  accentColor: import.meta.env.VITE_BRAND_ACCENT_COLOR || '#DC2626'
})

// Morris Framework Configuration
export const MORRIS_FRAMEWORK_CONFIG = {
  version: '3.1',
  name: 'Morris Framework',
  description: 'Framework Corporativo y Proceso de Gestión de Proyectos',
  workflows: {
    endToEnd: 'Workflow_PMO_End_to_End',
    projectFlow: 'Flujo_Proyectos_v2',
    assessment: 'Flujo_Assessment_v5'
  },
  phases: [
    {
      id: 'intake',
      name: 'Ingreso y Transferencia',
      color: '#1E40AF',
      icon: '📥'
    },
    {
      id: 'planning',
      name: 'Planificación y Arranque',
      color: '#7C3AED',
      icon: '📋'
    },
    {
      id: 'execution',
      name: 'Ejecución y Control',
      color: '#059669',
      icon: '⚡'
    },
    {
      id: 'validation',
      name: 'Validación y Cierre',
      color: '#DC2626',
      icon: '✅'
    }
  ]
}

// Application Constants
export const APP_CONFIG = {
  version: import.meta.env.VITE_APP_VERSION || '3.1.0',
  frameworkVersion: import.meta.env.VITE_FRAMEWORK_VERSION || '3.1',
  buildTime: __BUILD_TIME__,
  title: import.meta.env.VITE_APP_TITLE || 'MorrisFlow',
  description: import.meta.env.VITE_APP_DESCRIPTION || 'Framework Morris 3.1'
}

export const isProduction = () => getEnvironment().mode === 'production'
export const isStaging = () => getEnvironment().mode === 'staging'
export const isDevelopment = () => getEnvironment().mode === 'development'