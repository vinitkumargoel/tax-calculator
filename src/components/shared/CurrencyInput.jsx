import React from 'react'

export const CurrencyInput = ({ 
  value, 
  onChange, 
  label, 
  hint,
  annual = false,
  disabled = false,
  className = '' 
}) => {
  const displayValue = value === 0 ? '' : value
  
  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '')
    const numValue = rawValue === '' ? 0 : parseInt(rawValue, 10)
    onChange(numValue)
  }
  
  const formattedValue = displayValue === '' ? '' : new Intl.NumberFormat('en-IN').format(displayValue)
  
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm text-neutral mb-1">
        {label}
        {annual && <span className="text-xs text-neutral ml-1">(Annual)</span>}
      </label>
      {hint && <p className="text-xs text-neutral mb-1">{hint}</p>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral">₹</span>
        <input
          type="text"
          value={formattedValue}
          onChange={handleChange}
          disabled={disabled}
          className="w-full pl-7 pr-3 py-2 border border-border rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
        />
      </div>
    </div>
  )
}