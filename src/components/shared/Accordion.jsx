import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export const Accordion = ({ 
  items, 
  allowMultiple = false,
  className = '' 
}) => {
  const [openItems, setOpenItems] = useState([])
  
  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      )
    } else {
      setOpenItems(prev => 
        prev.includes(index) ? [] : [index]
      )
    }
  }
  
  return (
    <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="border-b border-border last:border-b-0">
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div>
              <h3 className="font-medium">{item.title}</h3>
              {item.subtitle && (
                <p className="text-xs text-neutral mt-0.5">{item.subtitle}</p>
              )}
            </div>
            {openItems.includes(index) ? (
              <ChevronUp size={20} className="text-neutral" />
            ) : (
              <ChevronDown size={20} className="text-neutral" />
            )}
          </button>
          {openItems.includes(index) && (
            <div className="p-4 pt-0 bg-gray-50">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export const AccordionItem = ({ title, subtitle, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div>
          <h3 className="font-medium">{title}</h3>
          {subtitle && (
            <p className="text-xs text-neutral mt-0.5">{subtitle}</p>
          )}
        </div>
        {isOpen ? (
          <ChevronUp size={20} className="text-neutral" />
        ) : (
          <ChevronDown size={20} className="text-neutral" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  )
}