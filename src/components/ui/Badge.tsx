import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const colors = {
    primary: 'bg-[#003049] text-white border-[#003049]',
    secondary: 'bg-gray-200 text-gray-800 border-gray-300',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span className={`
      inline-block px-3 py-1 rounded-[1px] border-2 text-xs font-medium uppercase tracking-wide
      ${colors[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}
