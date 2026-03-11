import React from 'react'

export const Card = ({ 
  children, 
  title, 
  subtitle,
  extra,
  className = '',
  noPadding = false
}) => {
  return (
    <div className={`bg-white rounded-lg border border-border shadow-sm ${className}`}>
      {(title || extra) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            {title && <h3 className="font-medium">{title}</h3>}
            {subtitle && <p className="text-xs text-neutral">{subtitle}</p>}
          </div>
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
    </div>
  )
}