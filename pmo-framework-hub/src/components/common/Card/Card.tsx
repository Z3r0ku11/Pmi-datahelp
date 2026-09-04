import React from 'react';

export interface CardProps {
  variant?: 'default' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Card({
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  hover = false,
  className = '',
  children,
  onClick,
  ...props
}: CardProps) {
  const baseClasses = [
    'rounded-lg border transition-all duration-200'
  ].join(' ');

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const variantClasses = {
    default: 'bg-white border-gray-200',
    glass: 'glass border-white/20 backdrop-blur-sm',
    gradient: 'bg-gradient-primary text-white border-transparent'
  };

  const interactiveClasses = onClick || hover ? 
    'cursor-pointer hover:shadow-lg hover:scale-105' : '';

  const combinedClasses = [
    baseClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    variantClasses[variant],
    interactiveClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

// Card subcomponents
export function CardHeader({ className = '', children, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`border-b border-gray-200 pb-3 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = '', children, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = '', children, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex-1 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardActions({ className = '', children, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-2 pt-4 border-t border-gray-200 mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}