import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = true }: CardProps) {
  const hoverClasses = hoverable
    ? 'hover:shadow-lg hover:-translate-y-0.5'
    : '';

  return (
    <div className={`
      bg-white border-2 border-gray-200 rounded-[9px] p-6
      shadow-sm transition-all duration-200
      ${hoverClasses}
      ${className}
    `}>
      {children}
    </div>
  );
}
