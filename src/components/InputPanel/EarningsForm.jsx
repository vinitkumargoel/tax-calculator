import React from 'react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { CurrencyInput, CurrencyInputWithToggle, InfoTooltip } from '../shared/index.js'
import { Plus, Trash2 } from 'lucide-react'

export const EarningsForm = () => {
  const { activeProfile, dispatch } = useProfile()
  const earnings = activeProfile?.earnings || {}
  
  const handleChange = (field, value) => {
    dispatch({ type: 'UPDATE_EARNINGS', payload: { [field]: value } })
  }
  
  const handleHraAuto = () => {
    const basic = Number(earnings.basic) || 0
    const isMetro = activeProfile?.cityType === 'metro'
    const hraPercentage = isMetro ? 0.5 : 0.4
    handleChange('hra', Math.round(basic * hraPercentage))
  }
  
  const handleAddCustomEarning = () => {
    const id = crypto.randomUUID()
    dispatch({ 
      type: 'ADD_CUSTOM_EARNING', 
      payload: { id, label: 'Custom Earning', amount: 0 } 
    })
  }
  
  const handleRemoveCustomEarning = (id) => {
    dispatch({ type: 'REMOVE_CUSTOM_EARNING', payload: id })
  }
  
  const handleUpdateCustomEarning = (id, field, value) => {
    const custom = (earnings.custom || []).map(c => 
      c.id === id ? { ...c, [field]: value } : c
    )
    dispatch({ type: 'UPDATE_EARNINGS', payload: { custom } })
  }
  
  return (
    <div className="bg-white p-4 rounded-lg border border-border">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        Earnings
        <InfoTooltip content="Toggle between Monthly/Annual view for salary components">
          <span className="text-xs text-neutral">?</span>
        </InfoTooltip>
      </h3>
      
      <div className="space-y-3">
        <CurrencyInputWithToggle
          label="Basic Pay"
          value={earnings.basic || 0}
          onChange={(v) => handleChange('basic', v)}
          hint="Usually 40-50% of CTC"
        />
        
        <CurrencyInputWithToggle
          label="HRA"
          value={earnings.hra || 0}
          onChange={(v) => handleChange('hra', v)}
        />
        <button
          onClick={handleHraAuto}
          className="w-full py-1.5 text-xs bg-gray-50 border border-border rounded-md hover:bg-gray-100 -mt-2 mb-4"
        >
          Auto-fill HRA (50% of Basic for Metro, 40% for Non-Metro)
        </button>
        
        <CurrencyInputWithToggle
          label="DA (Dearness Allowance)"
          value={earnings.da || 0}
          onChange={(v) => handleChange('da', v)}
          hint="Mostly govt; private = 0"
        />
        
        <CurrencyInput
          label="LTA (Leave Travel Allowance)"
          value={earnings.lta || 0}
          onChange={(v) => handleChange('lta', v)}
          annual={true}
          hint="Annual amount, divided by 12 for monthly"
        />
        
        <CurrencyInputWithToggle
          label="Special Allowance"
          value={earnings.specialAllowance || 0}
          onChange={(v) => handleChange('specialAllowance', v)}
        />
        
        <CurrencyInput
          label="Bonus / Performance Pay"
          value={earnings.bonus || 0}
          onChange={(v) => handleChange('bonus', v)}
          annual={true}
          hint="Annual lump sum, added to annual gross only"
        />
        
        <CurrencyInputWithToggle
          label="Medical Allowance"
          value={earnings.medicalAllowance || 0}
          onChange={(v) => handleChange('medicalAllowance', v)}
        />
        
        <CurrencyInput
          label="Group Insurance (Employer)"
          value={earnings.groupInsurance || 0}
          onChange={(v) => handleChange('groupInsurance', v)}
          hint="Employer cost, added to CTC"
        />
        
        {(earnings.custom || []).map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm text-neutral mb-1">Label</label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleUpdateCustomEarning(item.id, 'label', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm"
                  placeholder="Custom earning name"
                />
              </div>
              <button
                onClick={() => handleRemoveCustomEarning(item.id)}
                className="p-2 text-negative hover:bg-red-50 rounded self-end mb-0.5"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <CurrencyInputWithToggle
              label="Amount"
              value={item.amount}
              onChange={(v) => handleUpdateCustomEarning(item.id, 'amount', v)}
            />
          </div>
        ))}
        
        <button
          onClick={handleAddCustomEarning}
          className="w-full py-2 border border-dashed border-border rounded-md text-sm text-neutral hover:border-primary hover:text-primary flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Custom Earning
        </button>
      </div>
    </div>
  )
}