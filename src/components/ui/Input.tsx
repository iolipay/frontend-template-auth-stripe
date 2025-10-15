import React from 'react';

interface InputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  success,
  required,
  disabled,
  placeholder,
  className = '',
}: InputProps) {
  const inputClasses = `
    w-full px-4 py-3 text-sm border-2 rounded-[1px] transition-all duration-200
    ${error ? 'border-red-500' : success ? 'border-green-500' : 'border-gray-300'}
    focus:outline-none focus:border-[#003049] focus:ring-4 focus:ring-[#003049]/10
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
    ${className}
  `;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium uppercase tracking-wide text-black"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClasses}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
      {success && (
        <p className="text-green-500 text-xs mt-1">{success}</p>
      )}
    </div>
  );
}
