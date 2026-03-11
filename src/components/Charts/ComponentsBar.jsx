import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useProfile } from '../../context/ProfileContext.jsx'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

export const ComponentsBar = () => {
  const { activeProfile } = useProfile()
  const calculations = useSalaryCalculations(activeProfile)
  const earnings = activeProfile?.earnings || {}
  
  const data = [
    { 
      name: 'Monthly',
      Basic: earnings.basic || 0,
      HRA: earnings.hra || 0,
      DA: earnings.da || 0,
      'Special Allowance': earnings.specialAllowance || 0,
      Medical: earnings.medicalAllowance || 0,
      'Other': ((earnings.lta || 0) / 12) + (earnings.custom || []).reduce((sum, c) => sum + (Number(c.amount) || 0), 0),
      'Employer PF': calculations.employerPF,
      Gratuity: calculations.gratuityMonthly,
      'Employer ESI': calculations.employerESI,
    },
  ]
  
  const COLORS = ['#1A56DB', '#0E9F6E', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#FCD34D', '#10B981', '#A78BFA']
  
  return (
    <div className="bg-white p-4 rounded-lg border border-border">
      <h3 className="font-medium mb-4">Monthly Earnings Breakdown</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
          <YAxis type="category" dataKey="name" width={80} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          {Object.keys(data[0]).filter(k => k !== 'name').map((key, index) => (
            <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-4 text-right">
        <div>
          <span className="text-sm text-neutral">Monthly Gross: </span>
          <span className="font-mono font-medium">{formatCurrency(calculations.monthlyGross)}</span>
        </div>
        <div>
          <span className="text-sm text-neutral">Employer Costs: </span>
          <span className="font-mono font-medium">{formatCurrency(calculations.employerPF + calculations.gratuityMonthly + calculations.employerESI)}</span>
        </div>
      </div>
    </div>
  )
}