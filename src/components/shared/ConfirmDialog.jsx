import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

export const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  if (!isOpen) return null
  
  const variantStyles = {
    danger: 'bg-negative hover:bg-red-700',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    primary: 'bg-primary hover:bg-blue-700',
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-start gap-4">
          {variant === 'danger' && (
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle size={24} className="text-negative" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-sm text-neutral">{message}</p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${variantStyles[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}