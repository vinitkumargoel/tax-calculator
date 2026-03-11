import React from 'react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { Printer, ChevronDown, ChevronUp } from 'lucide-react'

export const PayslipPreview = () => {
  const { activeProfile } = useProfile()
  const calculations = useSalaryCalculations(activeProfile)
  const [expanded, setExpanded] = React.useState(false)
  
  const earnings = activeProfile?.earnings || {}
  const deductions = activeProfile?.deductions || {}
  
  const handlePrint = () => {
    window.print()
  }
  
  if (!activeProfile) return null
  
  const earningsItems = [
    { label: 'Basic Pay', value: earnings.basic || 0 },
    { label: 'HRA', value: earnings.hra || 0 },
    { label: 'DA', value: earnings.da || 0 },
    { label: 'Special Allowance', value: earnings.specialAllowance || 0 },
    { label: 'Medical Allowance', value: earnings.medicalAllowance || 0 },
    { label: 'LTA (Monthly)', value: (earnings.lta || 0) / 12 },
    ...(earnings.custom || []).map(c => ({ label: c.label, value: c.amount || 0 })),
  ].filter(item => item.value > 0)
  
  const deductionItems = [
    { label: 'PF (Employee)', value: calculations.employeePF },
    { label: 'ESI (Employee)', value: calculations.employeeESI },
    { label: 'Professional Tax', value: calculations.professionalTax },
    { label: 'TDS / Income Tax', value: calculations.monthlyTDS },
    { label: 'NPS (Employee)', value: calculations.npsEmployee },
    { label: 'VPF', value: calculations.vpf },
    ...(deductions.custom || []).map(c => ({ label: c.label, value: c.amount || 0 })),
  ].filter(item => item.value > 0)
  
  return (
    <div className="bg-white p-4 rounded-lg border border-border print:border-none print:shadow-none">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between print:hidden"
      >
        <h3 className="font-medium">Payslip Preview</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrint()
            }}
            className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-blue-700"
          >
            <Printer size={16} className="inline mr-1" /> Print
          </button>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      {(expanded || window.matchMedia('print').matches) && (
        <div className="mt-4 print:mt-0">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-3 border-b border-border">
              <h4 className="font-medium text-center">Monthly Payslip</h4>
              <p className="text-sm text-center text-neutral">
                {activeProfile.name} - {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            
            <div className="grid grid-cols-2 divide-x divide-border">
              <div className="p-4">
                <h5 className="font-medium text-sm mb-3 text-positive">Earnings</h5>
                <div className="space-y-2">
                  {earningsItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-neutral">{item.label}</span>
                      <span className="font-mono">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border font-medium">
                    <div className="flex justify-between">
                      <span>Total Earnings</span>
                      <span className="font-mono">{formatCurrency(calculations.monthlyGross)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h5 className="font-medium text-sm mb-3 text-negative">Deductions</h5>
                <div className="space-y-2">
                  {deductionItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-neutral">{item.label}</span>
                      <span className="font-mono">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border font-medium">
                    <div className="flex justify-between">
                      <span>Total Deductions</span>
                      <span className="font-mono">
                        {formatCurrency(calculations.employeePF + calculations.employeeESI + calculations.professionalTax + calculations.monthlyTDS + calculations.npsEmployee + calculations.vpf + calculations.customDeductions)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-border">
              <div className="flex justify-between font-medium text-lg">
                <span>Net Pay</span>
                <span className="font-mono text-positive">{formatCurrency(calculations.monthlyNetInHand)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg print:hidden">
            <h5 className="font-medium text-sm mb-2">Employer Cost (CTC Components)</h5>
            <p className="text-xs text-neutral mb-3">
              These are employer costs, not deducted from salary
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral">Employer PF</span>
                <span className="font-mono">{formatCurrency(calculations.employerPF)}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral">Gratuity</span>
                <span className="font-mono">{formatCurrency(calculations.gratuityMonthly)}/mo</span>
              </div>
              {calculations.employerESI > 0 && (
                <div className="flex justify-between">
                  <span className="text-neutral">Employer ESI</span>
                  <span className="font-mono">{formatCurrency(calculations.employerESI)}/mo</span>
                </div>
              )}
              {earnings.groupInsurance > 0 && (
                <div className="flex justify-between">
                  <span className="text-neutral">Group Insurance</span>
                  <span className="font-mono">{formatCurrency(earnings.groupInsurance)}/mo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}