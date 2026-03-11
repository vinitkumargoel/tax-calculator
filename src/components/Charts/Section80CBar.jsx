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
  
  return (
    <div className="bg-white p-4 rounded-lg border border-border">
      <h3 className="font-medium mb-4">Section 80C Utilisation</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral">Used</span>
          <span className="font-mono">{formatCurrency(eightyCUsed)}</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${eightyCPercent > 100 ? 'bg-negative' : 'bg-positive'}`}
            style={{ width: `${Math.min(eightyCPercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral">Limit</span>
          <span className="font-mono">₹1,50,000</span>
        </div>
        {eightyCTotal > 150000 && (
          <p className="text-xs text-negative">
            Excess of {formatCurrency(eightyCTotal - 150000)} will be capped at limit
          </p>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <h4 className="text-sm font-medium mb-2">Breakdown</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(section80C).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-neutral capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="font-mono">{formatCurrency(value || 0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}