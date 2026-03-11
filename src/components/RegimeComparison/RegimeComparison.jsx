import React from 'react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { formatCurrency, formatCurrencyShort } from '../../utils/formatCurrency.js'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { OLD_REGIME_STANDARD_DEDUCTION, NEW_REGIME_STANDARD_DEDUCTION } from '../../constants/taxSlabs.js'

export const RegimeComparison = () => {
  const { activeProfile, dispatch } = useProfile()
  const calculations = useSalaryCalculations(activeProfile)
  const [expanded, setExpanded] = React.useState(true)
  
  const isOldRegime = activeProfile?.taxRegime === 'old'
  const oldRegimeTax = calculations.oldRegimeTax
  const newRegimeTax = calculations.newRegimeTax
  
  const handleRegimeChange = (regime) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { taxRegime: regime } })
  }
  
  const betterRegime = calculations.betterRegime
  const savings = calculations.savingWithBetterRegime
  
  return (
    <div className="bg-white p-4 rounded-lg border border-border mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-medium">Regime Comparison</h3>
          {savings > 0 && (
            <span className="px-2 py-1 text-xs bg-positive text-white rounded">
              Save {formatCurrencyShort(savings)}/yr with {betterRegime === 'old' ? 'Old' : 'New'} Regime
            </span>
          )}
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {expanded && (
        <div className="mt-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleRegimeChange('new')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isOldRegime 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-neutral hover:bg-gray-200'
              }`}
            >
              New Regime (FY 2024-25)
            </button>
            <button
              onClick={() => handleRegimeChange('old')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isOldRegime 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-neutral hover:bg-gray-200'
              }`}
            >
              Old Regime
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-neutral font-medium">Metric</th>
                  <th className="text-right py-2 px-3 font-medium">Old Regime</th>
                  <th className="text-right py-2 px-3 font-medium">New Regime</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2 text-neutral">Standard Deduction</td>
                  <td className="text-right py-2 px-3 font-mono">{formatCurrency(OLD_REGIME_STANDARD_DEDUCTION)}</td>
                  <td className="text-right py-2 px-3 font-mono">{formatCurrency(NEW_REGIME_STANDARD_DEDUCTION)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 text-neutral">Total Deductions</td>
                  <td className="text-right py-2 px-3 font-mono text-positive">
                    {formatCurrency(oldRegimeTax.deductions?.total || 0)}
                  </td>
                  <td className="text-right py-2 px-3 font-mono">₹0</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 text-neutral">Taxable Income</td>
                  <td className="text-right py-2 px-3 font-mono">{formatCurrencyShort(oldRegimeTax.taxableIncome)}</td>
                  <td className="text-right py-2 px-3 font-mono">{formatCurrencyShort(newRegimeTax.taxableIncome)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 text-neutral">Tax (before cess)</td>
                  <td className="text-right py-2 px-3 font-mono">{formatCurrencyShort(oldRegimeTax.taxBeforeCess)}</td>
                  <td className="text-right py-2 px-3 font-mono">{formatCurrencyShort(newRegimeTax.taxBeforeCess)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 text-neutral">87A Rebate</td>
                  <td className="text-right py-2 px-3 font-mono text-positive">
                    -{formatCurrencyShort(oldRegimeTax.rebate)}
                  </td>
                  <td className="text-right py-2 px-3 font-mono text-positive">
                    -{formatCurrencyShort(newRegimeTax.rebate)}
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 text-neutral">Cess (4%)</td>
                  <td className="text-right py-2 px-3 font-mono">{formatCurrencyShort(oldRegimeTax.cess)}</td>
                  <td className="text-right py-2 px-3 font-mono">{formatCurrencyShort(newRegimeTax.cess)}</td>
                </tr>
                <tr className={`font-medium ${betterRegime === 'old' ? 'bg-green-50' : ''}`}>
                  <td className="py-3 text-primary">Total Tax</td>
                  <td className="text-right py-3 px-3 font-mono">
                    {formatCurrencyShort(oldRegimeTax.totalTax)}
                    {betterRegime === 'old' && (
                      <span className="ml-2 text-xs text-positive">✓ Better</span>
                    )}
                  </td>
                  <td className={`text-right py-3 px-3 font-mono ${betterRegime === 'new' ? 'bg-green-50' : ''}`}>
                    {formatCurrencyShort(newRegimeTax.totalTax)}
                    {betterRegime === 'new' && (
                      <span className="ml-2 text-xs text-positive">✓ Better</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 text-neutral">Monthly TDS</td>
                  <td className="text-right py-2 px-3 font-mono">{formatCurrencyShort(oldRegimeTax.monthlyTDS)}</td>
                  <td className="text-right py-2 px-3 font-mono">{formatCurrencyShort(newRegimeTax.monthlyTDS)}</td>
                </tr>
                <tr className={`font-medium ${!isOldRegime ? 'bg-primary/5' : ''}`}>
                  <td className="py-3 text-primary">Monthly In-Hand</td>
                  <td className="text-right py-3 px-3 font-mono text-positive">
                    {formatCurrencyShort(calculations.monthlyGross - (oldRegimeTax.monthlyTDS + calculations.employeePF + calculations.employeeESI + calculations.professionalTax + calculations.vpf + calculations.npsEmployee))}
                  </td>
                  <td className="text-right py-3 px-3 font-mono text-positive">
                    {formatCurrencyShort(calculations.monthlyNetInHand)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {calculations.surchargeWarning && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
              ⚠️ Surcharge applies to income above ₹50L and is not calculated here. Please consult a Chartered Accountant.
            </div>
          )}
        </div>
      )}
    </div>
  )
}