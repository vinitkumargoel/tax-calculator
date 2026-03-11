import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useProfile } from '../../context/ProfileContext.jsx'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'

export const BreakdownDonut = () => {
  const { activeProfile } = useProfile()
  const calculations = useSalaryCalculations(activeProfile)
  
  const data = [
    { name: 'In-Hand', value: calculations.annualNetInHand, color: '#0E9F6E' },
    { name: 'Tax', value: calculations.totalTax, color: '#E02424' },
    { name: 'PF (Employee)', value: calculations.employeePF * 12, color: '#F59E0B' },
    { name: 'ESI (Employee)', value: calculations.employeeESI * 12, color: '#8B5CF6' },
    { name: 'Professional Tax', value: calculations.professionalTax * 12, color: '#EC4899' },
    { name: 'NPS (Employee)', value: calculations.npsEmployee * 12, color: '#6366F1' },
    { name: 'VPF', value: calculations.vpf * 12, color: '#14B8A6' },
  ].filter(item => item.value > 0)
  
  if (data.length === 0 || calculations.annualGross === 0) {
    return (
      <div className="bg-white p-4 rounded-lg border border-border">
        <h3 className="font-medium mb-4">Annual Breakdown</h3>
        <div className="h-64 flex items-center justify-center text-neutral">
          No data to display
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white p-4 rounded-lg border border-border">
      <h3 className="font-medium mb-4">Annual Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `₹${(value / 100000).toFixed(2)}L`}
          />
          <Legend 
            formatter={(value) => <span className="text-sm text-neutral">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}