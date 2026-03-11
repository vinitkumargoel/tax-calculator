import React, { useState, memo } from 'react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { useSalaryCalculations } from '../../hooks/useSalaryCalculations.js'
import { formatCurrency, formatCurrencyShort } from '../../utils/formatCurrency.js'
import { Briefcase, Trash2, Copy, ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon, Plus, Settings } from 'lucide-react'
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

export const Sidebar = ({ collapsed, onToggleCollapse }) => {
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
    <aside className={`bg-white border-r border-border h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRightIcon size={14} /> : <ChevronLeft size={14} />}
      </button>
      
      <div className={`shrink-0 border-b border-border ${collapsed ? 'p-4 flex justify-center' : 'p-4'}`}>
        {collapsed ? (
          <Briefcase size={24} className="text-primary" />
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Briefcase size={24} className="text-primary" />
              <h1 className="font-bold text-lg">Salary Dashboard</h1>
            </div>
            <p className="text-xs text-neutral mt-1">Indian Salary Calculator</p>
          </>
        )}
      </div>
      
      <div className={`shrink-0 ${collapsed ? 'p-2' : 'p-3 border-b border-border'}`}>
        {!collapsed && (
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-neutral">Profiles</h2>
            {saving && <span className="text-xs text-neutral">Saving…</span>}
          </div>
        )}
      </div>
      
      <div className={`flex-1 overflow-y-auto min-h-0 ${collapsed ? 'p-2 space-y-2' : 'p-3 space-y-2'}`}>
        {profiles.map((profile) => (
          <div key={profile.id} className="relative group">
            {collapsed ? (
              <button
                onClick={() => handleSelectProfile(profile.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  profile.id === activeProfile?.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={profile.name}
              >
                {profile.name.charAt(0).toUpperCase()}
              </button>
            ) : (
              <ProfileCard
                profile={profile}
                isActive={profile.id === activeProfile?.id}
                onClick={() => handleSelectProfile(profile.id)}
              />
            )}
            {!collapsed && profiles.length > 1 && profile.id === activeProfile?.id && (
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
      
      <div className="p-3 border-t border-border shrink-0 flex flex-col gap-2">
        <button
          onClick={handleCreateProfile}
          className={`bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center ${collapsed ? 'w-10 h-10 mx-auto' : 'w-full py-2 px-4 gap-1'}`}
          title={collapsed ? 'New Profile' : undefined}
        >
          <Plus size={16} />
          {!collapsed && <span>+ New Profile</span>}
        </button>
        
        <button
          onClick={() => setSettingsOpen(true)}
          disabled={!activeProfile}
          className={`border border-border bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${collapsed ? 'w-10 h-10 mx-auto' : 'w-full py-2 px-4 gap-2'}`}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings size={16} />
          {!collapsed && <span>Settings</span>}
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