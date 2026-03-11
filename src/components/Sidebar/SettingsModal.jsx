import React from 'react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { Modal } from '../shared/Modal.jsx'
import { Toggle } from '../shared/Toggle.jsx'
import { Select } from '../shared/Select.jsx'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { PT_BY_STATE } from '../../constants/ptByState.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

export const SettingsModal = ({ isOpen, onClose }) => {
  const { activeProfile, dispatch } = useProfile()
  const calculations = useSalaryCalculations(activeProfile)
  
  if (!activeProfile) return null
  
  const handleSettingsChange = (field, value) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [field]: value } })
  }
  
  const stateOptions = Object.keys(PT_BY_STATE).map(key => ({
    value: key,
    label: PT_BY_STATE[key].name
  }))
  
  const cityTypeOptions = [
    { value: 'metro', label: 'Metro' },
    { value: 'non-metro', label: 'Non-Metro' },
  ]
  
  const pfModeOptions = [
    { value: 'capped', label: 'Capped at ₹15,000' },
    { value: 'full', label: 'Full Basic' },
  ]
  
  const taxRegimeOptions = [
    { value: 'new', label: 'New Regime' },
    { value: 'old', label: 'Old Regime' },
  ]
  
  const currentPT = calculations?.professionalTax || 0
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profile Settings">
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-1">Profile: {activeProfile.name}</h4>
          <p className="text-xs text-neutral">Last updated: {new Date(activeProfile.updatedAt).toLocaleString('en-IN')}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-3">Tax Regime</h4>
          <Toggle
            options={taxRegimeOptions}
            value={activeProfile.taxRegime || 'new'}
            onChange={(v) => dispatch({ type: 'UPDATE_TAX_REGIME', payload: v })}
          />
          <p className="text-xs text-neutral mt-2">
            {activeProfile.taxRegime === 'new' 
              ? 'New regime offers lower tax rates but fewer deductions'
              : 'Old regime allows more deductions but higher tax rates'}
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-3">City Type (for HRA exemption)</h4>
          <Toggle
            options={cityTypeOptions}
            value={activeProfile.cityType || 'metro'}
            onChange={(v) => handleSettingsChange('cityType', v)}
          />
          <p className="text-xs text-neutral mt-2">
            {activeProfile.cityType === 'metro' 
              ? '50% of Basic is considered for HRA exemption'
              : '40% of Basic is considered for HRA exemption'}
          </p>
        </div>
        
        <Select
          label="State (for Professional Tax)"
          value={activeProfile.state || 'none'}
          onChange={(v) => handleSettingsChange('state', v)}
          options={stateOptions}
          hint={`Current PT: ${formatCurrency(currentPT)}/month`}
        />
        
        <div>
          <h4 className="font-medium text-sm mb-3">PF Calculation Mode</h4>
          <Toggle
            options={pfModeOptions}
            value={activeProfile.pfMode || 'capped'}
            onChange={(v) => handleSettingsChange('pfMode', v)}
          />
          <p className="text-xs text-neutral mt-2">
            {activeProfile.pfMode === 'capped' 
              ? 'PF calculated on max ₹15,000 basic (standard practice)'
              : 'PF calculated on full basic salary'}
          </p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-sm mb-2">Quick Tips</h4>
          <ul className="text-xs text-neutral space-y-1">
            <li>• Metro cities: Delhi, Mumbai, Chennai, Kolkata, Bangalore, Hyderabad, Pune, etc.</li>
            <li>• PF capped mode is standard for most companies</li>
            <li>• New regime is beneficial if you don\'t have many deductions</li>
            <li>• Old regime allows HRA, 80C, 80D, NPS, Home Loan deductions</li>
          </ul>
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}