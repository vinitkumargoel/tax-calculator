import React from 'react'

export const Skeleton = ({ 
  width = '100%',
  height = '1rem',
  rounded = 'md',
  className = ''
}) => {
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }
  
  return (
    <div 
      className={`animate-pulse bg-gray-200 ${roundedStyles[rounded]} ${className}`}
      style={{ width, height }}
    />
  )
}

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border border-border p-4">
      <Skeleton height="0.75rem" width="30%" className="mb-3" />
      <Skeleton height="1.5rem" width="60%" className="mb-2" />
      <Skeleton height="0.75rem" width="40%" />
    </div>
  )
}

export const FormSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i}>
          <Skeleton height="0.75rem" width="25%" className="mb-2" />
          <Skeleton height="2.5rem" width="100%" />
        </div>
      ))}
    </div>
  )
}