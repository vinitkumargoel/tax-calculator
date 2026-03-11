import React from 'react'

export const NumberInput = ({ 
  value, 
  onChange, 
  label,
  hint,
  min,
  max,
  step = 1,
  disabled = false,
  className = '' 
}) => {
  const handleChange = (e) => {
    const val = e.target.value
    if (val === '') {
      onChange(0)
      return
    }
    const num = parseFloat(val)
    if (!isNaN(num)) {
      if (min !== undefined && num < min) return
      if (max !== undefined && num > max) return
      onChange(num)
    }
  }
  
  const increment = () => {
    const newVal = (value || 0) + step
    if (max !== undefined && newVal > max) return
    onChange(newVal)
  }
  
  const decrement = () => {
    const newVal = (value || 0) - step
    if (min !== undefined && newVal < min) return
    onChange(newVal)
  }
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-sm text-neutral mb-1">{label}</label>}
      {hint && <p className="text-xs text-neutral mb-1">{hint}</p>}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || (min !== undefined && value <= min)}
          className="px-2 py-2 border border-border rounded-l-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          −
        </button>
        <input
          type="number"
          value={value ?? ''}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="flex-1 px-3 py-2 border-y border-border text-center font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
        />
        <button
          type="button"
          onClick={increment}
          disabled={disabled || (max !== undefined && value >= max)}
          className="px-2 py-2 border border-border rounded-r-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  )
}