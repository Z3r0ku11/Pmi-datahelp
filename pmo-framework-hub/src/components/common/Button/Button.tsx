import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium rounded transition',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ].join(' ');

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: [
      'bg-gradient-primary text-white',
      'hover:opacity-90 focus:ring-purple-500',
      'shadow hover:shadow-lg'
    ].join(' '),
    secondary: [
      'bg-gradient-secondary text-white',
      'hover:opacity-90 focus:ring-blue-500',
      'shadow hover:shadow-lg'
    ].join(' '),
    ghost: [
      'text-gray-700 hover:bg-gray-100',
      'focus:ring-gray-500'
    ].join(' '),
    outline: [
      'border border-gray-300 text-gray-700 bg-white',
      'hover:bg-gray-50 focus:ring-gray-500',
      'shadow-sm'
    ].join(' ')
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const combinedClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    widthClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}