// Navigation and routing types

export interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
  isActive?: boolean;
  badge?: {
    text: string;
    variant: 'info' | 'warning' | 'error' | 'success';
  };
}

export interface RouteParams {
  frameworkId?: string;
  phaseId?: string;
  roleId?: string;
  artifactId?: string;
  controlId?: string;
  gateId?: string;
  toolId?: string;
}

export interface PageMetadata {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: PageAction[];
}

export interface PageAction {
  id: string;
  label: string;
  variant: 'primary' | 'secondary' | 'ghost';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}