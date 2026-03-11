import React from 'react'

export const Checkbox = ({ 
  checked, 
  onChange, 
  label,
  disabled = false,
  className = '' 
}) => {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-1"
      />
      {label && <span className="text-sm">{label}</span>}
    </label>
  )
}