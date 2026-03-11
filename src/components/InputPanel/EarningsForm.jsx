import React from 'react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { CurrencyInput, CurrencyInputWithToggle, InfoTooltip } from '../shared/index.js'
import { Plus, Trash2 } from 'lucide-react'
import { DollarSign } from 'lucide-react'

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
      payload: { id, label: 'Other Earning', amount: 0 } 
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
  
  const handleAddRSU = () => {
    const id = crypto.randomUUID()
    dispatch({ 
      type: 'ADD_RSU', 
      payload: { id, name: '', units: 0, priceUsd: 0, exchangeRate: 85 } 
    })
  }
  
  const handleRemoveRSU = (id) => {
    dispatch({ type: 'REMOVE_RSU', payload: id })
  }
  
  const handleUpdateRSU = (id, field, value) => {
    dispatch({ type: 'UPDATE_RSU', payload: { id, [field]: value } })
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
        
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Other Earnings</h4>
            <button
              onClick={handleAddCustomEarning}
              className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          
          {(earnings.custom || []).length === 0 && (
            <p className="text-xs text-neutral mb-2">
              Add any additional earnings like variable pay, overtime, etc.
            </p>
          )}
          
          {(earnings.custom || []).map((item) => (
            <div key={item.id} className="p-3 bg-gray-50 rounded-md mb-2">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdateCustomEarning(item.id, 'label', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-border rounded-md mb-2"
                    placeholder="Earning name (e.g., Variable Pay)"
                  />
                  <CurrencyInputWithToggle
                    label="Amount"
                    value={item.amount}
                    onChange={(v) => handleUpdateCustomEarning(item.id, 'amount', v)}
                    className="mb-0"
                  />
                </div>
                <button
                  onClick={() => handleRemoveCustomEarning(item.id)}
                  className="p-2 text-negative hover:bg-red-50 rounded mt-0.5"
                  title="Remove earning"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">RSUs (Restricted Stock Units)</h4>
            <button
              onClick={handleAddRSU}
              className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          
          {(earnings.rsu || []).length === 0 && (
            <p className="text-xs text-neutral mb-2">
              Add RSU grants to calculate annual vesting value in ₹
            </p>
          )}
          
          {(earnings.rsu || []).map((item) => (
            <div key={item.id} className="p-3 bg-gray-50 rounded-md mb-2">
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateRSU(item.id, 'name', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-border rounded-md"
                    placeholder="Company/Stock name"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-neutral mb-1">Units/Year</label>
                      <input
                        type="number"
                        value={item.units || 0}
                        onChange={(e) => handleUpdateRSU(item.id, 'units', Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-sm border border-border rounded-md"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral mb-1">Price ($)</label>
                      <div className="relative">
                        <DollarSign size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral" />
                        <input
                          type="number"
                          value={item.priceUsd || 0}
                          onChange={(e) => handleUpdateRSU(item.id, 'priceUsd', Number(e.target.value))}
                          className="w-full pl-7 pr-3 py-1.5 text-sm border border-border rounded-md"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-neutral mb-1">USD/INR Rate</label>
                      <input
                        type="number"
                        value={item.exchangeRate || 85}
                        onChange={(e) => handleUpdateRSU(item.id, 'exchangeRate', Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-sm border border-border rounded-md"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="text-xs text-neutral bg-white p-2 rounded border border-border">
                    Annual Value: ₹{((item.units || 0) * (item.priceUsd || 0) * (item.exchangeRate || 85)).toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveRSU(item.id)}
                  className="p-2 text-negative hover:bg-red-50 rounded mt-0.5"
                  title="Remove RSU"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}