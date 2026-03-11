import React from 'react'

export const Spinner = ({ 
  size = 'md',
  color = 'primary',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }
  
  const colors = {
    primary: 'border-primary',
    white: 'border-white',
    neutral: 'border-neutral',
  }
  
  return (
    <div 
      className={`${sizes[size]} ${colors[color]} border-2 border-t-transparent rounded-full animate-spin ${className}`}
    />
  )
}

export const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-2 text-sm text-neutral">{message}</p>
      </div>
    </div>
  )
}