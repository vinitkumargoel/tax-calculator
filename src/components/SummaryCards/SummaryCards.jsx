import React from 'react'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { useProfile } from '../../context/ProfileContext.jsx'
import { formatCurrency, formatCurrencyShort, formatPercent } from '../../utils/formatCurrency.js'
import { IndianRupee, TrendingUp, Percent, Building2, PiggyBank, Briefcase } from 'lucide-react'
import { AlertCircle } from 'lucide-react'

const SummaryCard = ({ icon: Icon, label, value, subValue, color = 'primary', warning }) => (
    <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-neutral mb-1">{label}</p>
          <p className={`font-mono text-lg font-semibold text-${color}`}>{value}</p>
          {subValue && <p className="text-xs text-neutral mt-1">{subValue}</p>}
        </div>
        <Icon size={20} className={`text-${color} opacity-50`} />
      </div>
      {warning && (
        <div className="mt-2 flex items-center gap-1 text-xs text-negative">
          <AlertCircle size={12} />
          <span>{warning}</span>
        </div>
      )}
    </div>
)

export const SummaryCards = () => {
  const { activeProfile } = useProfile()
  const calculations = useSalaryCalculations(activeProfile)
  
  if (!activeProfile) return null
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      <SummaryCard
        icon={IndianRupee}
        label="Monthly In-Hand"
        value={formatCurrency(calculations.monthlyNetInHand)}
        subValue={`${formatCurrency(calculations.annualNetInHand)}/yr`}
        color="positive"
      />
      <SummaryCard
        icon={Building2}
        label="Annual CTC"
        value={formatCurrencyShort(calculations.annualCTC)}
        color="primary"
      />
      <SummaryCard
        icon={TrendingUp}
        label="Annual Tax"
        value={formatCurrencyShort(calculations.totalTax)}
        subValue={formatPercent(calculations.effectiveTaxRate)}
        color="negative"
        warning={calculations.surchargeWarning ? 'Surcharge may apply (income > ₹50L)' : null}
      />
      <SummaryCard
        icon={PiggyBank}
        label="Employer PF"
        value={`${formatCurrency(calculations.employerPF * 12)}/yr`}
        subValue={`${formatCurrency(calculations.employerPF)}/mo`}
        color="primary"
      />
      <SummaryCard
        icon={Briefcase}
        label="Gratuity"
        value={`${formatCurrency(calculations.gratuityAnnual)}/yr`}
        subValue={`${formatCurrency(calculations.gratuityMonthly)}/mo`}
        color="primary"
      />
      <SummaryCard
        icon={TrendingUp}
        label="Take-Home %"
        value={formatPercent(calculations.takeHomePercent)}
        subValue={`${formatCurrencyShort(calculations.annualNetInHand)} of CTC`}
        color="positive"
      />
    </div>
  )
}