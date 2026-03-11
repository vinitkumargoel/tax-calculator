import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useProfile } from '../../context/ProfileContext.jsx'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { formatCurrency, formatCurrencyShort } from '../../utils/formatCurrency.js'

export const BreakdownDonut = () => {
  const { activeProfile } = useProfile()
  const calculations = useSalaryCalculations(activeProfile)
  
  if (!calculations) return null
  
  const data = [
    { name: 'In-Hand', value: calculations.annualNetInHand, color: '#0E9F6E' },
    { name: 'Deductions', value: (calculations.employeePF + calculations.employeeESI + calculations.professionalTax + calculations.monthlyTDS + calculations.npsEmployee + calculations.vpf) * 12, color: '#E02424' },
    { name: 'Employer PF', value: calculations.employerPF * 12, color: '#F59E0B' },
    { name: 'Gratuity', value: calculations.gratuityAnnual, color: '#3B82F6' },
    { name: 'Employer ESI', value: calculations.employerESI * 12, color: '#8B5CF6' },
  ].filter(item => item.value > 0)
  
  if (data.length === 0 || calculations.annualGross === 0) {
    return (
      <div className="bg-white p-4 rounded-lg border border-border h-full">
        <h3 className="font-medium mb-2">Annual Breakdown</h3>
        <div className="h-64 flex items-center justify-center text-neutral text-sm">
          Enter salary details to see breakdown
        </div>
      </div>
    )
  }
  
  const colors = ['#0E9F6E', '#E02424', '#F59E0B', '#3B82F6', '#8B5CF6']
  
  return (
    <div className="bg-white p-4 rounded-lg border border-border h-full">
      <div className="mb-2">
        <h3 className="font-medium">Annual Breakdown</h3>
        <p className="text-xs text-neutral">CTC distribution</p>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-40 flex flex-col justify-center gap-1">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-sm flex-shrink-0" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-neutral truncate">{item.name}</span>
              <span className="font-mono ml-auto">{formatCurrencyShort(item.value)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-neutral">Annual CTC</span>
            <p className="font-mono font-medium text-primary">{formatCurrencyShort(calculations.annualCTC)}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral">Net In-Hand</span>
            <p className="font-mono font-medium text-positive">{formatCurrencyShort(calculations.annualNetInHand)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}