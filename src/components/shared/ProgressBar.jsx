import React from 'react'

export const ProgressBar = ({ 
  value, 
  max = 100, 
  showLabel = true,
  color = 'primary',
  size = 'md',
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  const isOverLimit = value > max
  
  const colors = {
    primary: 'bg-primary',
    positive: 'bg-positive',
    negative: 'bg-negative',
    warning: 'bg-yellow-500',
  }
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  }
  
  return (
    <div className={className}>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div 
          className={`${sizes[size]} ${isOverLimit ? 'bg-negative' : colors[color]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-neutral mt-1">
          <span className={isOverLimit ? 'text-negative' : ''}>
            {isOverLimit && '⚠️ '}₹{value.toLocaleString('en-IN')}
          </span>
          <span>₹{max.toLocaleString('en-IN')}</span>
        </div>
      )}
    </div>
  )
}