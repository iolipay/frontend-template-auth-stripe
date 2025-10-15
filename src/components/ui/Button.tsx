import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  variant = 'primary',
  children,
  onClick,
  disabled,
  type = 'button',
  fullWidth,
  className = '',
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 border-2 font-medium text-sm uppercase tracking-wide transition-all duration-200 rounded-none';
  const shadowClasses = 'shadow-[5px_5px_0px_0px_#333333] hover:shadow-[5px_5px_0px_0px_#000000] active:shadow-[3px_3px_0px_0px_#333333]';

  const variantClasses = variant === 'primary'
    ? 'bg-[#003049] text-white border-[#003049] hover:bg-[#4e35dc] hover:border-[#4e35dc]'
    : 'bg-white text-[#003049] border-[#003049] hover:bg-[#003049] hover:text-white';

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${shadowClasses} ${variantClasses} ${widthClass} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}
