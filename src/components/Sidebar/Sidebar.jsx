import React, { useState } from 'react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { formatCurrency, formatCurrencyShort } from '../../utils/formatCurrency.js'
import { Briefcase, Trash2, Copy, ChevronRight, Settings } from 'lucide-react'
import { ConfirmDialog } from '../shared/ConfirmDialog.jsx'
import { Select } from '../shared/Select.jsx'
import { PT_BY_STATE } from '../../constants/ptByState.js'

export const ProfileCard = ({ profile, isActive, onClick }) => {
  const calculations = useSalaryCalculations(profile)
  
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-all border ${
        isActive 
          ? 'border-primary bg-blue-50' 
          : 'border-border bg-white hover:border-primary hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm truncate">{profile.name}</h3>
        {isActive && <ChevronRight size={16} className="text-primary" />}
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-neutral">In-Hand</span>
          <span className="font-mono text-positive">{formatCurrencyShort(calculations.monthlyNetInHand)}/mo</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral">CTC</span>
          <span className="font-mono">{formatCurrencyShort(calculations.annualCTC)}/yr</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral">Tax</span>
          <span className="font-mono text-negative">{formatCurrencyShort(calculations.totalTax)}</span>
        </div>
      </div>
    </div>
  )
}

export const Sidebar = () => {
  const { state, dispatch, activeProfile } = useProfile()
  const { profiles, saving } = state
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, profileId: null, profileName: '' })
  
  const handleCreateProfile = () => {
    dispatch({ type: 'CREATE_PROFILE' })
  }
  
  const handleDeleteClick = (e, profileId, profileName) => {
    e.stopPropagation()
    setDeleteConfirm({ isOpen: true, profileId, profileName })
  }
  
  const handleDeleteConfirm = () => {
    dispatch({ type: 'DELETE_PROFILE', payload: deleteConfirm.profileId })
  }
  
  const handleDuplicateProfile = (e, profileId) => {
    e.stopPropagation()
    dispatch({ type: 'DUPLICATE_PROFILE', payload: profileId })
  }
  
  const handleSelectProfile = (profileId) => {
    dispatch({ type: 'SET_ACTIVE_PROFILE', payload: profileId })
  }
  
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
  
  return (
    <aside className="w-64 bg-white border-r border-border h-screen overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Briefcase size={24} className="text-primary" />
          <h1 className="font-bold text-lg">Salary Dashboard</h1>
        </div>
        <p className="text-xs text-neutral mt-1">Indian Salary Calculator</p>
      </div>
      
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-neutral">Profiles</h2>
          {saving && <span className="text-xs text-neutral">Saving…</span>}
        </div>
      </div>
      
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {profiles.map((profile) => (
          <div key={profile.id} className="relative group">
            <ProfileCard
              profile={profile}
              isActive={profile.id === activeProfile?.id}
              onClick={() => handleSelectProfile(profile.id)}
            />
            {profiles.length > 1 && profile.id === activeProfile?.id && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleDuplicateProfile(e, profile.id)}
                  className="p-1 bg-white rounded hover:bg-gray-100"
                  title="Duplicate"
                >
                  <Copy size={14} className="text-neutral" />
                </button>
                <button
                  onClick={(e) => handleDeleteClick(e, profile.id, profile.name)}
                  className="p-1 bg-white rounded hover:bg-gray-100"
                  title="Delete"
                >
                  <Trash2 size={14} className="text-negative" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-border">
        <button
          onClick={handleCreateProfile}
          className="w-full py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + New Profile
        </button>
      </div>
      
      {activeProfile && (
        <div className="p-3 border-t border-border bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <Settings size={16} className="text-neutral" />
            <h3 className="text-xs font-medium text-neutral">Settings</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-neutral mb-1">State (for PT)</label>
              <select
                value={activeProfile.state || 'none'}
                onChange={(e) => handleSettingsChange('state', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {stateOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-neutral mb-1">City Type (HRA)</label>
              <select
                value={activeProfile.cityType || 'metro'}
                onChange={(e) => handleSettingsChange('cityType', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {cityTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-neutral mb-1">PF Mode</label>
              <select
                value={activeProfile.pfMode || 'capped'}
                onChange={(e) => handleSettingsChange('pfMode', e.target.value)}
                className="w-full px-2 py-1 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {pfModeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, profileId: null, profileName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Profile"
        message={`Are you sure you want to delete "${deleteConfirm.profileName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </aside>
  )
}