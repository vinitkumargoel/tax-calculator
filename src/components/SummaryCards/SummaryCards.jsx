import React, { memo, useState } from 'react'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { useProfile } from '../../context/ProfileContext.jsx'
import { formatCurrency, formatCurrencyShort, formatPercent } from '../../utils/formatCurrency.js'
import { IndianRupee, TrendingUp, Percent, Building2, PiggyBank, Briefcase } from 'lucide-react'
import { AlertCircle, Coins, Gift, Hash, ChevronDown, ChevronUp } from 'lucide-react'

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
  const [showOneTimeDetails, setShowOneTimeDetails] = useState(false)
  
  if (!activeProfile || !calculations) return null
  
  const hasRSU = (activeProfile?.earnings?.rsu || []).length > 0
  const hasBonus = calculations.bonusAmount > 0
  const hasOneTimeIncome = hasBonus || hasRSU
  
  return (
    <div role="region" aria-label="Summary cards">
      <div className={`grid gap-4 mb-4 ${hasRSU ? 'grid-cols-2 lg:grid-cols-7' : 'grid-cols-2 lg:grid-cols-6'}`}>
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
        {hasRSU && calculations.rsuAmount > 0 && (
          <SummaryCard
            icon={Coins}
            label="RSU Value"
            value={formatCurrencyShort(calculations.rsuAmount)}
            subValue="Annual vested"
            color="primary"
          />
        )}
        <SummaryCard
          icon={TrendingUp}
          label="Annual Tax"
          value={formatCurrencyShort(calculations.totalTax)}
          subValue={`${formatCurrencyShort(calculations.totalTaxWithOneTime)} with bonus/RSU`}
          color="negative"
          warning={calculations.surchargeWarning ? 'Surcharge included. Marginal relief may vary — consult a CA.' : null}
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
      
      {hasOneTimeIncome && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg overflow-hidden mb-6">
          <button
            onClick={() => setShowOneTimeDetails(!showOneTimeDetails)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-amber-100 transition-colors"
            aria-expanded={showOneTimeDetails}
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                One-time Income Tax Details (not in monthly TDS)
              </span>
            </div>
            {showOneTimeDetails ? (
              <ChevronUp size={18} className="text-amber-600" />
            ) : (
              <ChevronDown size={18} className="text-amber-600" />
            )}
          </button>
          
          {showOneTimeDetails && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hasBonus && calculations.bonusAmount > 0 && (
                  <div className="bg-white rounded-md p-3 border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift size={14} className="text-amber-600" />
                      <span className="text-xs text-neutral">Bonus/Performance Pay</span>
                    </div>
                    <div className="font-mono text-sm">
                      <span className="text-neutral">₹{calculations.bonusAmount.toLocaleString('en-IN')}</span>
                      <span className="mx-2">→</span>
                      <span className="text-negative font-medium">₹{calculations.bonusTax.toLocaleString('en-IN')} tax</span>
                    </div>
                    <div className="text-xs text-neutral mt-1">
                      Taxed at {calculations.marginalRate}% marginal rate
                    </div>
                  </div>
                )}
                {hasRSU && calculations.rsuAmount > 0 && (
                  <div className="bg-white rounded-md p-3 border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash size={14} className="text-amber-600" />
                      <span className="text-xs text-neutral">RSU Vesting</span>
                    </div>
                    <div className="font-mono text-sm">
                      <span className="text-neutral">₹{calculations.rsuAmount.toLocaleString('en-IN')}</span>
                      <span className="mx-2">→</span>
                      <span className="text-negative font-medium">₹{calculations.rsuTax.toLocaleString('en-IN')} tax</span>
                    </div>
                    <div className="text-xs text-neutral mt-1">
                      Taxed at {calculations.marginalRate}% marginal rate
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-amber-200 text-xs text-amber-700">
                <strong>Note:</strong> Bonus and RSU taxes are <strong>not deducted from monthly salary</strong>. 
                Bonus tax is deducted at payout. RSU tax is deducted at vesting (perquisite tax).
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

SummaryCards.displayName = 'SummaryCards'