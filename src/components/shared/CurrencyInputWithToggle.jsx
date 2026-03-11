import React, { useState, useEffect } from 'react'

export const CurrencyInputWithToggle = ({ 
  value, 
  onChange, 
  label, 
  hint,
  defaultMode = 'monthly',
  disabled = false,
  className = '' 
}) => {
  const [isAnnual, setIsAnnual] = useState(defaultMode === 'annual')
  
  const monthlyToAnnual = (val) => Math.round(val * 12)
  const annualToMonthly = (val) => Math.round(val / 12)
  
  const displayValue = isAnnual 
    ? (value === 0 ? '' : monthlyToAnnual(value))
    : (value === 0 ? '' : value)
  
  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '')
    const numValue = rawValue === '' ? 0 : parseInt(rawValue, 10)
    const finalValue = isAnnual ? annualToMonthly(numValue) : numValue
    onChange(finalValue)
  }
  
  const handleToggle = (newIsAnnual) => {
    setIsAnnual(newIsAnnual)
  }
  
  const formattedValue = displayValue === '' ? '' : new Intl.NumberFormat('en-IN').format(displayValue)
  
  const toggleOptions = [
    { label: 'Monthly', value: false },
    { label: 'Annual', value: true },
  ]
  
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm text-neutral">{label}</label>
        <div className="flex border border-border rounded overflow-hidden">
          {toggleOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => handleToggle(option.value)}
              className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                isAnnual === option.value
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
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