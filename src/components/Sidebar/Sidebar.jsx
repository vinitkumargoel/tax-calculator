import React, { useState, memo } from 'react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { formatCurrency, formatCurrencyShort } from '../../utils/formatCurrency.js'
import { Briefcase, Trash2, Copy, ChevronRight } from 'lucide-react'
import { ConfirmDialog } from '../shared/ConfirmDialog.jsx'
import { SettingsModal } from './SettingsModal.jsx'

export const ProfileCard = memo(({ profile, isActive, onClick }) => {
  const calculations = useSalaryCalculations(profile)
  
  if (!calculations) return null
  
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Select profile ${profile.name}`}
      aria-pressed={isActive}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
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
})

ProfileCard.displayName = 'ProfileCard'

export const Sidebar = () => {
  const { state, dispatch, activeProfile } = useProfile()
  const { profiles, saving } = state
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, profileId: null, profileName: '' })
  const [settingsOpen, setSettingsOpen] = useState(false)
  
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
      
      <div className="p-3 border-t border-border">
        <button
          onClick={() => setSettingsOpen(true)}
          disabled={!activeProfile}
          className="w-full py-2 px-4 border border-border bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>
      </div>
      
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
      
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </aside>
  )
}