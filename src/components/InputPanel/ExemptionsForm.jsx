import React from 'react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { CurrencyInput, Toggle, Select, Checkbox } from '../shared/index.js'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { ChevronDown, ChevronUp } from 'lucide-react'

export const ExemptionsForm = () => {
  const { activeProfile, dispatch } = useProfile()
  const calculations = useSalaryCalculations(activeProfile)
  const exemptions = activeProfile?.exemptions || {}
  const isOldRegime = activeProfile?.taxRegime === 'old'
  const [expanded, setExpanded] = React.useState(isOldRegime)
  
  if (!isOldRegime) {
    return (
      <div className="bg-white p-4 rounded-lg border border-border mb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Tax Exemptions (Old Regime Only)</h3>
          <span className="text-sm text-neutral">
            Switch to Old Regime to see exemptions
          </span>
        </div>
      </div>
    )
  }
  
  const handleUpdateExemptions = (field, value) => {
    dispatch({ type: 'UPDATE_EXEMPTIONS', payload: { [field]: value } })
  }
  
  const handleUpdateSection80C = (field, value) => {
    dispatch({ 
      type: 'UPDATE_EXEMPTIONS', 
      payload: { 
        section80C: { ...(exemptions.section80C || {}), [field]: value } 
      } 
    })
  }
  
  const handleUpdateSection80D = (field, value) => {
    dispatch({ 
      type: 'UPDATE_EXEMPTIONS', 
      payload: { 
        section80D: { ...(exemptions.section80D || {}), [field]: value } 
      } 
    })
  }
  
  const handleUpdateHomeLoan = (field, value) => {
    dispatch({ 
      type: 'UPDATE_EXEMPTIONS', 
      payload: { 
        homeLoan: { ...(exemptions.homeLoan || {}), [field]: value } 
      } 
    })
  }
  
  const cityTypeOptions = [
    { label: 'Metro', value: 'metro' },
    { label: 'Non-Metro', value: 'non-metro' },
  ]
  
  const propertyTypeOptions = [
    { label: 'Self-Occupied', value: 'self-occupied' },
    { label: 'Let-Out', value: 'let-out' },
  ]
  
  const section80C = exemptions.section80C || {}
  const eightyCTotal = Object.values(section80C).reduce((sum, v) => sum + (Number(v) || 0), 0)
  const eightyCUsed = Math.min(eightyCTotal, 150000)
  const eightyCPercent = (eightyCUsed / 150000) * 100
  
  const hraDetails = calculations.taxResult?.hraExemptionDetails
  
  return (
    <div className="bg-white p-4 rounded-lg border border-border mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <h3 className="font-medium">Tax Exemptions (Old Regime)</h3>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {expanded && (
        <div className="mt-4 space-y-6">
          <div className="p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm mb-3">HRA Exemption</h4>
            <CurrencyInput
              label="Monthly Rent Paid"
              value={exemptions.rentPaid || 0}
              onChange={(v) => handleUpdateExemptions('rentPaid', v)}
            />
            <Toggle
              label="City Type"
              options={cityTypeOptions}
              value={activeProfile?.cityType || 'metro'}
              onChange={(v) => dispatch({ type: 'UPDATE_SETTINGS', payload: { cityType: v } })}
            />
            {hraDetails && (
              <div className="mt-2 p-2 bg-white rounded text-xs">
                <p className="font-medium mb-1">HRA Exemption Calculation:</p>
                <div className="space-y-1 text-neutral">
                  <p>A: Actual HRA = {formatCurrency(hraDetails.conditionA)}</p>
                  <p>B: {activeProfile?.cityType === 'metro' ? '50%' : '40%'} of Basic = {formatCurrency(hraDetails.conditionB)}</p>
                  <p>C: Rent - 10% of Basic = {formatCurrency(hraDetails.conditionC)}</p>
                  <p className="font-medium text-primary pt-1 border-t">
                    Minimum (Exemption) = {formatCurrency(hraDetails.exemption)}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <CurrencyInput
              label="LTA Exemption"
              value={exemptions.ltaExemption || 0}
              onChange={(v) => handleUpdateExemptions('ltaExemption', v)}
              hint="Annual exemption claimed"
            />
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm mb-3">
              Section 80C
              <span className="text-xs text-neutral ml-2">(Max ₹1,50,000)</span>
            </h4>
            
            <div className="mb-3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${eightyCPercent > 100 ? 'bg-negative' : 'bg-positive'}`}
                  style={{ width: `${Math.min(eightyCPercent, 100)}%` }}
                />
              </div>
              <p className="text-xs text-neutral mt-1">
                {formatCurrency(eightyCUsed)} of ₹1,50,000 used
                {eightyCTotal > 150000 && (
                  <span className="text-negative ml-2">
                    (Excess will be capped)
                  </span>
                )}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <CurrencyInput
                label="Employee PF"
                value={section80C.pf || 0}
                onChange={(v) => handleUpdateSection80C('pf', v)}
                className="text-xs"
              />
              <CurrencyInput
                label="VPF"
                value={section80C.vpf || 0}
                onChange={(v) => handleUpdateSection80C('vpf', v)}
                className="text-xs"
              />
              <CurrencyInput
                label="PPF"
                value={section80C.ppf || 0}
                onChange={(v) => handleUpdateSection80C('ppf', v)}
                className="text-xs"
              />
              <CurrencyInput
                label="ELSS"
                value={section80C.elss || 0}
                onChange={(v) => handleUpdateSection80C('elss', v)}
                className="text-xs"
              />
              <CurrencyInput
                label="NSC"
                value={section80C.nsc || 0}
                onChange={(v) => handleUpdateSection80C('nsc', v)}
                className="text-xs"
              />
              <CurrencyInput
                label="Life Insurance"
                value={section80C.lifeInsurance || 0}
                onChange={(v) => handleUpdateSection80C('lifeInsurance', v)}
                className="text-xs"
              />
              <CurrencyInput
                label="Home Loan Principal"
                value={section80C.homeLoanPrincipal || 0}
                onChange={(v) => handleUpdateSection80C('homeLoanPrincipal', v)}
                className="text-xs"
              />
              <CurrencyInput
                label="Tuition Fee"
                value={section80C.tuitionFee || 0}
                onChange={(v) => handleUpdateSection80C('tuitionFee', v)}
                className="text-xs"
              />
              <CurrencyInput
                label="Sukanya Samriddhi"
                value={section80C.sukanya || 0}
                onChange={(v) => handleUpdateSection80C('sukanya', v)}
                className="text-xs"
              />
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm mb-3">Section 80D (Medical Insurance)</h4>
            <div className="space-y-3">
              <div>
                <Checkbox
                  label="Self + Family (Senior 60+)"
                  checked={exemptions.section80D?.selfFamilySenior || false}
                  onChange={(v) => handleUpdateSection80D('selfFamilySenior', v)}
                  className="mb-2"
                />
                <CurrencyInput
                  value={exemptions.section80D?.selfFamily || 0}
                  onChange={(v) => handleUpdateSection80D('selfFamily', v)}
                  hint={`Max: ₹${exemptions.section80D?.selfFamilySenior ? '50,000' : '25,000'}`}
                />
              </div>
              <div>
                <Checkbox
                  label="Parents (Senior 60+)"
                  checked={exemptions.section80D?.parentsSenior || false}
                  onChange={(v) => handleUpdateSection80D('parentsSenior', v)}
                  className="mb-2"
                />
                <CurrencyInput
                  value={exemptions.section80D?.parents || 0}
                  onChange={(v) => handleUpdateSection80D('parents', v)}
                  hint={`Max: ₹${exemptions.section80D?.parentsSenior ? '50,000' : '25,000'}`}
                />
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <CurrencyInput
              label="NPS 80CCD(1B)"
              value={exemptions.nps80CCD1B || 0}
              onChange={(v) => handleUpdateExemptions('nps80CCD1B', v)}
              hint="Max ₹50,000"
            />
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm mb-3">Home Loan Interest (Section 24(b))</h4>
            <Select
              label="Property Type"
              value={exemptions.homeLoan?.propertyType || 'self-occupied'}
              onChange={(v) => handleUpdateHomeLoan('propertyType', v)}
              options={propertyTypeOptions}
              hint={exemptions.homeLoan?.propertyType === 'self-occupied' ? 'Max deduction: ₹2,00,000' : 'No limit for let-out property'}
            />
            <CurrencyInput
              label="Annual Interest Paid"
              value={exemptions.homeLoan?.annualInterest || 0}
              onChange={(v) => handleUpdateHomeLoan('annualInterest', v)}
            />
          </div>
        </div>
      )}
    </div>
  )
}