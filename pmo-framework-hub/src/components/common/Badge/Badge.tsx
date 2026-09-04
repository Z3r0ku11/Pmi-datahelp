import React from 'react';
import { Status, Priority, MandatoryStatus } from '@/types';

export interface BadgeProps {
  variant?: 'status' | 'priority' | 'mandatory' | 'framework' | 'default';
  value?: Status | Priority | MandatoryStatus | string;
  size?: 'sm' | 'md';
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ 
  variant = 'default', 
  value, 
  size = 'md', 
  className = '',
  children 
}: BadgeProps) {
  const baseClasses = [
    'inline-flex items-center font-medium rounded-full',
    'px-2 py-1 text-xs'
  ].join(' ');

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs'
  };

  // Status-based styling
  const getStatusClasses = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'READY':
        return 'bg-green-100 text-green-800';
      case 'PARTIALLY_READY':
        return 'bg-yellow-100 text-yellow-800';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800';
      case 'PENDING_PMO':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Priority-based styling
  const getPriorityClasses = (priority?: string) => {
    switch (priority?.toUpperCase()) {
      case 'P0':
        return 'bg-red-100 text-red-800 font-semibold';
      case 'P1':
        return 'bg-yellow-100 text-yellow-800 font-medium';
      case 'P2':
        return 'bg-blue-100 text-blue-800';
      case 'P3':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mandatory status styling
  const getMandatoryClasses = (mandatory?: string) => {
    switch (mandatory?.toUpperCase()) {
      case 'OBLIGATORIO':
        return 'bg-red-100 text-red-800';
      case 'NO_DETERMINADO':
        return 'bg-yellow-100 text-yellow-800';
      case 'OPCIONAL':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Framework type styling
  const getFrameworkClasses = (framework?: string) => {
    switch (framework?.toUpperCase()) {
      case 'CORPORATIVO':
        return 'bg-purple-100 text-purple-800';
      case 'AGIL':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'status':
        return getStatusClasses(value);
      case 'priority':
        return getPriorityClasses(value);
      case 'mandatory':
        return getMandatoryClasses(value);
      case 'framework':
        return getFrameworkClasses(value);
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const labels: Record<string, string> = {
    OBLIGATORIO: 'Obligatorio',
    OPCIONAL: 'Opcional',
    NO_DETERMINADO: 'Por definir',
    PARTIALLY_READY: 'Parcialmente disponible',
    READY: 'Disponible',
    BLOCKED: 'Bloqueado',
    PENDING_PMO: 'Pendiente PMO',
    AGIL: 'Adaptativo',
  };
  const displayText = children || (value ? labels[String(value)] || value : '');

  const combinedClasses = [
    baseClasses,
    sizeClasses[size],
    getVariantClasses(),
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={combinedClasses}>
      {displayText}
    </span>
  );
}

// Convenience components for specific badge types
export function StatusBadge({ status, ...props }: Omit<BadgeProps, 'variant' | 'value'> & { status: Status }) {
  return <Badge variant="status" value={status} {...props} />;
}

export function PriorityBadge({ priority, ...props }: Omit<BadgeProps, 'variant' | 'value'> & { priority: Priority }) {
  return <Badge variant="priority" value={priority} {...props} />;
}

export function MandatoryBadge({ mandatory, ...props }: Omit<BadgeProps, 'variant' | 'value'> & { mandatory: MandatoryStatus }) {
  return <Badge variant="mandatory" value={mandatory} {...props} />;
}

export function FrameworkBadge({ framework, ...props }: Omit<BadgeProps, 'variant' | 'value'> & { framework: string }) {
  return <Badge variant="framework" value={framework} {...props} />;
}
