// MorrisFlow Types - Framework Morris v3.1

export interface MorrisFrameworkPhase {
  id: string
  name: string
  description: string
  color: string
  icon: string
  duration: string
  deliverables: string[]
  activities: MorrisActivity[]
  gates: MorrisGate[]
}

export interface MorrisActivity {
  id: string
  name: string
  description: string
  responsible: string[]
  tools: string[]
  inputs: string[]
  outputs: string[]
  duration: string
  dependencies?: string[]
}

export interface MorrisGate {
  id: string
  name: string
  type: 'decision' | 'validation' | 'approval'
  criteria: string[]
  approvers: string[]
  documents: string[]
}

export interface WorkflowStep {
  id: string
  name: string
  phase: string
  responsible: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'blocked'
  dependencies: string[]
  artifacts: string[]
}

export interface ProjectAssessment {
  id: string
  projectId: string
  type: 'initial' | 'milestone' | 'final'
  framework: 'traditional' | 'agile' | 'hybrid'
  complexity: 'low' | 'medium' | 'high'
  duration: string
  team: AssessmentTeam
  risks: RiskAssessment[]
  recommendations: string[]
  createdAt: Date
  updatedAt: Date
}

export interface AssessmentTeam {
  pm: string
  pmLead: string
  cloudTeam: string[]
  stakeholders: string[]
  sponsors: string[]
}

export interface RiskAssessment {
  id: string
  category: string
  description: string
  probability: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  mitigation: string
  owner: string
}

export interface MorrisPortal {
  id: string
  name: string
  description: string
  access: 'public' | 'restricted' | 'private'
  modules: PortalModule[]
}

export interface PortalModule {
  id: string
  name: string
  path: string
  icon: string
  description: string
  enabled: boolean
  permissions: string[]
}

export interface PMIResource {
  id: string
  title: string
  type: 'guide' | 'template' | 'tool' | 'course' | 'certification'
  category: string
  description: string
  url?: string
  downloadUrl?: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  permissions: string[]
  department: string
  avatar?: string
}

export type UserRole = 'admin' | 'pmo-manager' | 'pm-lead' | 'pm' | 'team-member' | 'stakeholder'

export interface Environment {
  name: string
  mode: 'production' | 'staging' | 'development'
  apiUrl: string
  frameworkVersion?: string
  features: FeatureFlags
  branding: BrandingConfig
}

export interface FeatureFlags {
  enableMorrisFramework: boolean
  enablePMIPortal: boolean
  enableAnalytics: boolean
  enableWorkflows: boolean
  mockData: boolean
  debugMode: boolean
}

export interface BrandingConfig {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logo?: string
  favicon?: string
}