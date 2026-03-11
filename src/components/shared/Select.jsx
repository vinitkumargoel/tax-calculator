import React from 'react'

export const Select = ({ 
  value, 
  onChange, 
  options, 
  label,
  hint,
  disabled = false,
  className = '' 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral mb-1.5">{label}</label>
      )}
      {hint && <p className="text-xs text-neutral mb-1.5">{hint}</p>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg text-sm 
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                     bg-white appearance-none cursor-pointer
                     disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
                     transition-all duration-200 hover:border-gray-300"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}