import React, { useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

export const Toast = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])
  
  const styles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: 'text-positive',
      Icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-negative',
      Icon: AlertCircle,
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'text-primary',
      Icon: Info,
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600',
      Icon: AlertCircle,
    },
  }
  
  const style = styles[type]
  const Icon = style.Icon
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 border rounded-lg shadow-lg ${style.bg}`}>
      <Icon size={20} className={style.icon} />
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 text-neutral hover:text-gray-700">
        <X size={16} />
      </button>
    </div>
  )
}

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}