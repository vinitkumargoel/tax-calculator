import React, { createContext, useContext, useReducer, useEffect, useState, useRef } from 'react'
import { validateProfile } from '../utils/validation.js'

const STORAGE_KEY = 'salary_profiles'

const createDefaultProfile = () => ({
  id: crypto.randomUUID(),
  name: 'New Profile',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  taxRegime: 'new',
  cityType: 'metro',
  state: 'none',
  pfMode: 'capped',
  earnings: {
    basic: 50000,
    hra: 25000,
    da: 0,
    lta: 60000,
    specialAllowance: 10000,
    bonus: 100000,
    medicalAllowance: 1250,
    custom: [],
    groupInsurance: 0,
  },
  deductions: {
    vpf: 0,
    npsEmployee: 0,
    npsEmployer: 0,
    custom: [],
  },
  exemptions: {
    rentPaid: 20000,
    ltaExemption: 60000,
    section80C: {
      pf: 0,
      vpf: 0,
      ppf: 0,
      elss: 0,
      nsc: 0,
      lifeInsurance: 0,
      homeLoanPrincipal: 0,
      tuitionFee: 0,
      sukanya: 0,
    },
    section80D: {
      selfFamily: 0,
      selfFamilySenior: false,
      parents: 0,
      parentsSenior: false,
    },
    nps80CCD1B: 0,
    homeLoan: {
      propertyType: 'self-occupied',
      annualInterest: 0,
    },
  },
})

const initialState = {
  profiles: [],
  activeProfileId: null,
  saving: false,
}

const profileReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_STATE':
      return {
        ...state,
        profiles: action.payload.profiles || [],
        activeProfileId: action.payload.activeProfileId || null,
      }
    
    case 'SET_SAVING':
      return { ...state, saving: action.payload }
    
    case 'CREATE_PROFILE': {
      const newProfile = createDefaultProfile()
      return {
        ...state,
        profiles: [...state.profiles, newProfile],
        activeProfileId: newProfile.id,
      }
    }
    
    case 'DELETE_PROFILE': {
      const filtered = state.profiles.filter(p => p.id !== action.payload)
      const newActiveId = state.activeProfileId === action.payload 
        ? (filtered[0]?.id || null)
        : state.activeProfileId
      return {
        ...state,
        profiles: filtered,
        activeProfileId: newActiveId,
      }
    }
    
    case 'DUPLICATE_PROFILE': {
      const original = state.profiles.find(p => p.id === action.payload)
      if (!original) return state
      const duplicate = {
        ...JSON.parse(JSON.stringify(original)),
        id: crypto.randomUUID(),
        name: `${original.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return {
        ...state,
        profiles: [...state.profiles, duplicate],
        activeProfileId: duplicate.id,
      }
    }
    
    case 'RENAME_PROFILE': {
      return {
        ...state,
        profiles: state.profiles.map(p => 
          p.id === action.payload.id 
            ? { ...p, name: action.payload.name, updatedAt: new Date().toISOString() }
            : p
        ),
      }
    }
    
    case 'SET_ACTIVE_PROFILE':
      return { ...state, activeProfileId: action.payload }
    
    case 'UPDATE_PROFILE': {
      return {
        ...state,
        profiles: state.profiles.map(p => 
          p.id === state.activeProfileId 
            ? { ...p, ...action.payload, updatedAt: new Date().toISOString() }
            : p
        ),
      }
    }
    
    case 'UPDATE_EARNINGS': {
      return {
        ...state,
        profiles: state.profiles.map(p => 
          p.id === state.activeProfileId 
            ? { 
                ...p, 
                earnings: { ...p.earnings, ...action.payload },
                updatedAt: new Date().toISOString(),
              }
            : p
        ),
      }
    }
    
    case 'UPDATE_DEDUCTIONS': {
      return {
        ...state,
        profiles: state.profiles.map(p => 
          p.id === state.activeProfileId 
            ? { 
                ...p, 
                deductions: { ...p.deductions, ...action.payload },
                updatedAt: new Date().toISOString(),
              }
            : p
        ),
      }
    }
    
    case 'UPDATE_EXEMPTIONS': {
      return {
        ...state,
        profiles: state.profiles.map(p => 
          p.id === state.activeProfileId 
            ? { 
                ...p, 
                exemptions: { ...p.exemptions, ...action.payload },
                updatedAt: new Date().toISOString(),
              }
            : p
        ),
      }
    }
    
    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        profiles: state.profiles.map(p => 
          p.id === state.activeProfileId 
            ? { 
                ...p, 
                ...action.payload,
                updatedAt: new Date().toISOString(),
              }
            : p
        ),
      }
    }
    
    case 'ADD_CUSTOM_EARNING': {
      const profile = state.profiles.find(p => p.id === state.activeProfileId)
      if (!profile) return state
      const custom = [...(profile.earnings.custom || []), action.payload]
      return {
        ...state,
        profiles: state.profiles.map(p => 
          p.id === state.activeProfileId 
            ? { ...p, earnings: { ...p.earnings, custom }, updatedAt: new Date().toISOString() }
            : p
        ),
      }
    }
    
    case 'REMOVE_CUSTOM_EARNING': {
      const profile = state.profiles.find(p => p.id === state.activeProfileId)
      if (!profile) return state
      const custom = (profile.earnings.custom || []).filter(c => c.id !== action.payload)
      return {
        ...state,
        profiles: state.profiles.map(p => 
          p.id === state.activeProfileId 
            ? { ...p, earnings: { ...p.earnings, custom }, updatedAt: new Date().toISOString() }
            : p
        ),
      }
    }
    
    case 'UPDATE_CUSTOM_EARNING': {
      const profile = state.profiles.find(p => p.id === state.activeProfileId)
      if (!profile) return state
      const custom = (profile.earnings.custom || []).map(c => 
        c.id === action.payload.id ? { ...c, ...action.payload } : c
      )
      return {
        ...state,
        profiles: state.profiles.map(p => 
          p.id === state.activeProfileId 
            ? { ...p, earnings: { ...p.earnings, custom }, updatedAt: new Date().toISOString() }
            : p
        ),
      }
    }
    
    case 'ADD_CUSTOM_DEDUCTION': {
      const profile = state.profiles.find(p => p.id === state.activeProfileId)
      if (!profile) return state
      const custom = [...(profile.deductions.custom || []), action.payload]
      return {
        ...state,
        profiles: state.profiles.map(p => 
          p.id === state.activeProfileId 
            ? { ...p, deductions: { ...p.deductions, custom }, updatedAt: new Date().toISOString() }
            : p
        ),
      }
    }
    
    case 'REMOVE_CUSTOM_DEDUCTION': {
      const profile = state.profiles.find(p => p.id === state.activeProfileId)
      if (!profile) return state
      const custom = (profile.deductions.custom || []).filter(c => c.id !== action.payload)
      return {
        ...state,
        profiles: state.profiles.map(p => 
          p.id === state.activeProfileId 
            ? { ...p, deductions: { ...p.deductions, custom }, updatedAt: new Date().toISOString() }
            : p
        ),
      }
    }
    
    default:
      return state
  }
}

const ProfileContext = createContext(null)

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState)
  const [loaded, setLoaded] = useState(false)
  const saveTimeoutRef = useRef(null)
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        if (data?.profiles) {
          dispatch({ type: 'LOAD_STATE', payload: data })
        } else {
          dispatch({ type: 'CREATE_PROFILE' })
        }
      } else {
        dispatch({ type: 'CREATE_PROFILE' })
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e)
      dispatch({ type: 'CREATE_PROFILE' })
    }
    setLoaded(true)
  }, [])
  
  useEffect(() => {
    if (!loaded) return
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          profiles: state.profiles,
          activeProfileId: state.activeProfileId,
        }))
      } catch (e) {
        console.error('Error saving to localStorage:', e)
      }
    }, 500)
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [state.profiles, state.activeProfileId, loaded])
  
  const activeProfile = state.profiles.find(p => p.id === state.activeProfileId)
  
  return (
    <ProfileContext.Provider value={{ 
      state, 
      dispatch, 
      activeProfile,
      loaded,
    }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}