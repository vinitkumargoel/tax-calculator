import React from 'react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { CurrencyInput, InfoTooltip, Toggle, Select } from '../shared/index.js'
import { Plus, Trash2, AlertCircle } from 'lucide-react'
import { PT_BY_STATE, STATE_OPTIONS } from '../../constants/ptByState.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

export const DeductionsForm = () => {
  const { activeProfile, dispatch } = useProfile()
  const calculations = useSalaryCalculations(activeProfile)
  const deductions = activeProfile?.deductions || {}
  
  const handleUpdateDeductions = (field, value) => {
    dispatch({ type: 'UPDATE_DEDUCTIONS', payload: { [field]: value } })
  }
  
  const handleUpdateSettings = (field, value) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [field]: value } })
  }
  
  const handleAddCustomDeduction = () => {
    const id = crypto.randomUUID()
    dispatch({ 
      type: 'ADD_CUSTOM_DEDUCTION', 
      payload: { id, label: 'Custom Deduction', amount: 0 } 
    })
  }
  
  const handleRemoveCustomDeduction = (id) => {
    dispatch({ type: 'REMOVE_CUSTOM_DEDUCTION', payload: id })
  }
  
  const handleUpdateCustomDeduction = (id, field, value) => {
    const custom = (deductions.custom || []).map(c => 
      c.id === id ? { ...c, [field]: value } : c
    )
    dispatch({ type: 'UPDATE_DEDUCTIONS', payload: { custom } })
  }
  
  const pfModeOptions = [
    { label: 'Capped at ₹15K', value: 'capped' },
    { label: 'Full Basic', value: 'full' },
  ]
  
  const stateOptions = STATE_OPTIONS.map(s => ({ label: PT_BY_STATE[s].name, value: s }))
  
  return (
    <div className="bg-white p-4 rounded-lg border border-border">
      <h3 className="font-medium mb-4">Deductions</h3>
      
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Employee PF</span>
            <span className="font-mono text-positive">{formatCurrency(calculations.employeePF)}</span>
          </div>
          <Toggle
            options={pfModeOptions}
            value={activeProfile?.pfMode || 'capped'}
            onChange={(v) => handleUpdateSettings('pfMode', v)}
          />
          <p className="text-xs text-neutral mt-1">
            {activeProfile?.pfMode === 'capped' 
              ? `12% of Basic (capped at ₹15,000): ₹${(activeProfile?.earnings?.basic || 0) > 15000 ? 1800 : Math.round((activeProfile?.earnings?.basic || 0) * 0.12)}`
              : `12% of Full Basic: ${formatCurrency(calculations.employeePF)}`
            }
          </p>
        </div>
        
        <CurrencyInput
          label="VPF (Voluntary PF)"
          value={deductions.vpf || 0}
          onChange={(v) => handleUpdateDeductions('vpf', v)}
          hint="Additional PF contribution (80C benefit)"
        />
        
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">
              ESI
              <InfoTooltip content="Applicable if Monthly Gross ≤ ₹21,000. Simplified calculation.">
                <AlertCircle size={12} className="ml-1 inline" />
              </InfoTooltip>
            </span>
            {calculations.employeeESI > 0 ? (
              <div className="text-right">
                <span className="font-mono text-negative">{formatCurrency(calculations.employeeESI)}</span>
                <p className="text-xs text-neutral">Employee (0.75%)</p>
              </div>
            ) : (
              <span className="text-xs text-neutral">Not Applicable</span>
            )}
          </div>
          {calculations.employeeESI > 0 && (
            <p className="text-xs text-neutral">
              Employer ESI: {formatCurrency(calculations.employerESI)}/mo
            </p>
          )}
        </div>
        
        <Select
          label="Professional Tax (State)"
          value={activeProfile?.state || 'none'}
          onChange={(v) => handleUpdateSettings('state', v)}
          options={stateOptions}
          hint={`Current: ₹${calculations.professionalTax}/mo`}
        />
        
<div className="p-3 bg-gray-50 rounded-md">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium">PF Breakdown</span>
    <span className="font-mono text-primary">{formatCurrency(calculations.employerPF)}</span>
  </div>
  <div className="grid grid-cols-2 gap-2 text-xs">
    <div className="bg-white p-2 rounded border border-border">
      <p className="text-neutral">Employer PF (3.67%)</p>
      <p className="font-mono text-positive">{formatCurrency(Math.min((activeProfile?.earnings?.basic || 0) * 0.0367, activeProfile?.pfMode === 'capped' ? 550 : Infinity))}/mo</p>
    </div>
    <div className="bg-white p-2 rounded border border-border">
      <p className="text-neutral">EPS (8.33%)</p>
      <p className="font-mono text-primary">{formatCurrency(Math.min((activeProfile?.earnings?.basic || 0) * 0.0833, activeProfile?.pfMode === 'capped' ? 1250 : Infinity))}/mo</p>
    </div>
  </div>
  <p className="text-xs text-neutral mt-2">
    {activeProfile?.pfMode === 'capped' 
      ? 'Capped at ₹15,000 basic for EPS'
      : 'Applied on full Basic'}
  </p>
</div>

<CurrencyInput
  label="NPS (Employee 80CCD(1B))"
  value={deductions.npsEmployee || 0}
  onChange={(v) => handleUpdateDeductions('npsEmployee', v)}
  hint="Up to ₹50,000 deduction (Old Regime)"
/>

<CurrencyInput
  label="NPS (Employer contribution)"
  value={deductions.npsEmployer || 0}
  onChange={(v) => handleUpdateDeductions('npsEmployer', v)}
  hint="Employer cost, added to CTC"
/>
        
        {(deductions.custom || []).map((item) => (
          <div key={item.id} className="flex gap-2 items-end">
            <div className="flex-1">
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleUpdateCustomDeduction(item.id, 'label', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm"
                placeholder="Label"
              />
            </div>
            <div className="w-32">
              <CurrencyInput
                value={item.amount}
                onChange={(v) => handleUpdateCustomDeduction(item.id, 'amount', v)}
              />
            </div>
            <button
              onClick={() => handleRemoveCustomDeduction(item.id)}
              className="p-2 text-negative hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        
        <button
          onClick={handleAddCustomDeduction}
          className="w-full py-2 border border-dashed border-border rounded-md text-sm text-neutral hover:border-primary hover:text-primary flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Custom Deduction
        </button>
      </div>
    </div>
  )
}