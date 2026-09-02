// Shared types between Phase 1 and Phase 2

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'pmo' | 'executive';
  permissions: Permission[];
  createdAt: string;
}

export interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'admin')[];
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Phase 1 - Educational Content Types
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: PMICategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  content: ContentSection[];
  quiz?: Quiz;
  resources: Resource[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentSection {
  id: string;
  title: string;
  type: 'text' | 'video' | 'interactive' | 'diagram';
  content: string;
  order: number;
}

export interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'video' | 'tool';
  url: string;
  description?: string;
}

export type PMICategory = 
  | 'project-management'
  | 'agile'
  | 'risk-management'
  | 'stakeholder-management'
  | 'quality-management'
  | 'cost-management'
  | 'time-management'
  | 'scope-management'
  | 'integration-management'
  | 'procurement-management';

// Phase 2 - Corporate PMO Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  manager: string;
  sponsor: string;
  client: string;
  category: ProjectCategory;
  startDate: string;
  endDate: string;
  plannedEndDate: string;
  budget: Budget;
  progress: ProjectProgress;
  risks: Risk[];
  team: TeamMember[];
  timeline: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 
  | 'planning' 
  | 'in-progress' 
  | 'on-hold' 
  | 'completed' 
  | 'cancelled'
  | 'at-risk'
  | 'delayed';

export type ProjectCategory = 
  | 'digital-transformation'
  | 'software-development'
  | 'infrastructure'
  | 'data-analytics'
  | 'other';

export interface Budget {
  planned: number;
  actual: number;
  remaining: number;
  currency: 'USD' | 'CLP';
}

export interface ProjectProgress {
  percentage: number;
  tasksCompleted: number;
  tasksTotal: number;
  milestonesCompleted: number;
  milestonesTotal: number;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  status: 'open' | 'mitigated' | 'closed';
  owner: string;
  mitigation?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  allocation: number; // percentage
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  description?: string;
}

export interface PortfolioMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  atRiskProjects: number;
  delayedProjects: number;
  totalBudget: number;
  budgetUtilized: number;
  portfolioHealth: number; // percentage
  plannedHours: number;
  activeClients: number;
  activePMs: number;
  pmUtilization: number; // percentage
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  filters: Filter[];
  createdAt: string;
  updatedAt: string;
}

export interface Widget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'calendar';
  title: string;
  config: Record<string, any>;
  position: { x: number; y: number; w: number; h: number };
}

export interface Filter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater-than' | 'less-than' | 'between';
  value: any;
}