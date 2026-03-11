import React, { useState } from 'react'

export const Tabs = ({ 
  tabs, 
  defaultValue,
  onChange,
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value)
  
  const handleTabChange = (value) => {
    setActiveTab(value)
    onChange?.(value)
  }
  
  return (
    <div className={className}>
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab.value
                ? 'text-primary'
                : 'text-neutral hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === tab.value ? 'bg-primary/10' : 'bg-gray-100'
              }`}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.value && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export const TabContent = ({ children, value, activeValue }) => {
  if (value !== activeValue) return null
  return <div className="py-4">{children}</div>
}