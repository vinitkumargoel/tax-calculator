import React, { useState, useRef, useEffect } from 'react'

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
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)
  
  useEffect(() => {
    if (!isEditing) {
      const displayValue = isAnnual ? Math.round(value * 12) : value
      setInputValue(displayValue === 0 ? '' : new Intl.NumberFormat('en-IN').format(displayValue))
    }
  }, [value, isAnnual, isEditing])
  
  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '')
    
    if (rawValue === '') {
      setInputValue('')
      onChange(0)
    } else {
      const numValue = parseInt(rawValue, 10)
      const formatted = new Intl.NumberFormat('en-IN').format(numValue)
      setInputValue(formatted)
      
      const finalValue = isAnnual ? Math.round(numValue / 12) : numValue
      onChange(finalValue)
    }
  }
  
  const handleToggle = (newIsAnnual) => {
    if (newIsAnnual !== isAnnual) {
      const currentMonthlyValue = value
      const newDisplayValue = newIsAnnual 
        ? Math.round(currentMonthlyValue * 12) 
        : currentMonthlyValue
      
      setInputValue(newDisplayValue === 0 ? '' : new Intl.NumberFormat('en-IN').format(newDisplayValue))
      setIsAnnual(newIsAnnual)
    }
  }
  
  const handleFocus = () => {
    setIsEditing(true)
    const displayValue = isAnnual ? Math.round(value * 12) : value
    if (displayValue > 0) {
      setInputValue(String(displayValue))
    }
  }
  
  const handleBlur = () => {
    setIsEditing(false)
    const displayValue = isAnnual ? Math.round(value * 12) : value
    setInputValue(displayValue === 0 ? '' : new Intl.NumberFormat('en-IN').format(displayValue))
  }
  
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
              disabled={disabled}
              className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                isAnnual === option.value
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral hover:bg-gray-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className="w-full pl-7 pr-3 py-2 border border-border rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
        />
      </div>
    </div>
  )
}