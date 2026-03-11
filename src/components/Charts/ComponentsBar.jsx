import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useProfile } from '../../context/ProfileContext.jsx'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { formatCurrency, formatCurrencyShort } from '../../utils/formatCurrency.js'

export const ComponentsBar = () => {
  const { activeProfile } = useProfile()
  const calculations = useSalaryCalculations(activeProfile)
  const earnings = activeProfile?.earnings || {}
  
  if (!calculations) return null
  
  const data = [
    { 
      name: 'Amount',
      Basic: earnings.basic || 0,
      HRA: earnings.hra || 0,
      DA: earnings.da || 0,
      'Special': earnings.specialAllowance || 0,
      Medical: earnings.medicalAllowance || 0,
      'Other': ((earnings.lta || 0) / 12) + (earnings.custom || []).reduce((sum, c) => sum + (Number(c.amount) || 0), 0),
    },
  ]
  
  const COLORS = ['#1A56DB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4']
  
  const monthlyGross = calculations.monthlyGross
  
  return (
    <div className="bg-white p-4 rounded-lg border border-border h-full flex flex-col">
      <div className="mb-2">
        <h3 className="font-medium">Monthly Earnings</h3>
        <p className="text-xs text-neutral">Component-wise breakdown</p>
      </div>
      
      <div className="flex gap-4 flex-1">
        <div className="flex-1 min-w-0">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} layout="vertical" barGap={2} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} />
              <XAxis type="number" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} fontSize={11} />
              <YAxis type="category" dataKey="name" width={50} fontSize={11} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              {Object.keys(data[0]).filter(k => k !== 'name').map((key, index) => (
                <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} maxBarSize={18} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-48 flex flex-col justify-center gap-1">
          {Object.keys(data[0]).filter(k => k !== 'name').map((key, index) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-sm flex-shrink-0" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-neutral truncate">{key}</span>
              <span className="font-mono ml-auto">{formatCurrencyShort(data[0][key] || 0)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-neutral">Monthly Gross</span>
            <p className="font-mono font-medium text-primary">{formatCurrency(monthlyGross)}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral">Employer Cost</span>
            <p className="font-mono font-medium text-positive">{formatCurrencyShort(calculations.employerPF + calculations.gratuityMonthly + calculations.employerESI)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}