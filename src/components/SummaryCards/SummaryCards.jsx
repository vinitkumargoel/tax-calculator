import React, { memo } from 'react'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { useProfile } from '../../context/ProfileContext.jsx'
import { formatCurrency, formatCurrencyShort, formatPercent } from '../../utils/formatCurrency.js'
import { IndianRupee, TrendingUp, Percent, Building2, PiggyBank, Briefcase } from 'lucide-react'
import { AlertCircle, Coins } from 'lucide-react'

const SummaryCard = memo(({ icon: Icon, label, value, subValue, color = 'primary', warning }) => (
  <div 
    className="bg-white p-4 rounded-lg border border-border shadow-sm"
    role="article"
    aria-label={label}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-neutral mb-1">{label}</p>
        <p className={`font-mono text-lg font-semibold text-${color}`}>{value}</p>
        {subValue && <p className="text-xs text-neutral mt-1">{subValue}</p>}
      </div>
      <Icon size={20} className={`text-${color} opacity-50`} aria-hidden="true" />
    </div>
    {warning && (
      <div className="mt-2 flex items-center gap-1 text-xs text-negative" role="alert">
        <AlertCircle size={12} aria-hidden="true" />
        <span>{warning}</span>
      </div>
    )}
  </div>
))

SummaryCard.displayName = 'SummaryCard'

export const SummaryCards = memo(() => {
  const { activeProfile } = useProfile()
  const calculations = useSalaryCalculations(activeProfile)
  
  if (!activeProfile || !calculations) return null
  
  const hasRSU = (activeProfile?.earnings?.rsu || []).length > 0
  
  return (
    <div className={`grid gap-4 mb-6 ${hasRSU ? 'grid-cols-2 lg:grid-cols-7' : 'grid-cols-2 lg:grid-cols-6'}`} role="region" aria-label="Summary cards">
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
      {hasRSU && calculations.rsuAnnualValue > 0 && (
        <SummaryCard
          icon={Coins}
          label="RSU Value"
          value={formatCurrencyShort(calculations.rsuAnnualValue)}
          subValue="Annual vested"
          color="primary"
        />
      )}
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
})

SummaryCards.displayName = 'SummaryCards'