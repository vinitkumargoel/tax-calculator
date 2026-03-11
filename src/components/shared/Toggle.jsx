import React from 'react'

export const Toggle = ({ 
  options, 
  value, 
  onChange, 
  label,
  className = '' 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-sm text-neutral mb-2">{label}</label>}
      <div className="flex border border-border rounded-md overflow-hidden">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
              value === option.value
                ? 'bg-primary text-white'
                : 'bg-white text-neutral hover:bg-gray-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}