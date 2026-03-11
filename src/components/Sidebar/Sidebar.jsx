import React from 'react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { formatCurrency, formatCurrencyShort } from '../../utils/formatCurrency.js'
import { Briefcase, Trash2, Copy, ChevronRight } from 'lucide-react'

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
  
  const handleCreateProfile = () => {
    dispatch({ type: 'CREATE_PROFILE' })
  }
  
  const handleDeleteProfile = (e, profileId) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this profile?')) {
      dispatch({ type: 'DELETE_PROFILE', payload: profileId })
    }
  }
  
  const handleDuplicateProfile = (e, profileId) => {
    e.stopPropagation()
    dispatch({ type: 'DUPLICATE_PROFILE', payload: profileId })
  }
  
  const handleSelectProfile = (profileId) => {
    dispatch({ type: 'SET_ACTIVE_PROFILE', payload: profileId })
  }
  
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
                  onClick={(e) => handleDeleteProfile(e, profile.id)}
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
          <h3 className="text-xs font-medium text-neutral mb-2">Settings</h3>
          <p className="text-xs text-neutral">State: {activeProfile.state || 'Not set'}</p>
          <p className="text-xs text-neutral">City: {activeProfile.cityType || 'metro'}</p>
          <p className="text-xs text-neutral">PF Mode: {activeProfile.pfMode || 'capped'}</p>
        </div>
      )}
    </aside>
  )
}