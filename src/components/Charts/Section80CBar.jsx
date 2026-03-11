import React from 'react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'

export const Section80CBar = () => {
  const { activeProfile } = useProfile()
  const exemptions = activeProfile?.exemptions || {}
  const isOldRegime = activeProfile?.taxRegime === 'old'
  
  if (!isOldRegime) return null
  
  const section80C = exemptions.section80C || {}
  const eightyCTotal = Object.values(section80C).reduce((sum, v) => sum + (Number(v) || 0), 0)
  const eightyCUsed = Math.min(eightyCTotal, 150000)
  const eightyCPercent = (eightyCUsed / 150000) * 100
  
  const items = Object.entries(section80C)
    .filter(([, value]) => Number(value) > 0)
    .map(([key, value]) => ({
      name: key.replace(/([A-Z])/g, ' $1').trim(),
      value: Number(value) || 0
    }))
  
  return (
    <div className="bg-white p-4 rounded-lg border border-border mb-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium">Section 80C</h3>
          <p className="text-xs text-neutral">Tax-saving investments under 80C</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral">Limit: <span className="font-mono font-medium">₹1,50,000</span></p>
          <p className="text-xs text-neutral">Used: <span className={`font-mono font-medium ${eightyCTotal > 150000 ? 'text-negative' : 'text-positive'}`}>{formatCurrency(eightyCUsed)}</span></p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all rounded-full ${eightyCTotal > 150000 ? 'bg-gradient-to-r from-positive to-negative' : 'bg-positive'}`}
            style={{ width: `${Math.min(eightyCPercent, 100)}%` }}
          />
        </div>
        
        {eightyCTotal > 150000 && (
          <p className="text-xs text-negative">
            ⚠️ Excess ₹{((eightyCTotal - 150000)/1000).toFixed(0)}K will be capped at limit
          </p>
        )}
      </div>
      
      {items.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
            {items.map(({ name, value }) => (
              <div key={name} className="flex justify-between items-center text-sm">
                <span className="text-neutral capitalize">{name}</span>
                <span className="font-mono">{formatCurrency(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}