import { useEffect, useRef, useCallback } from 'react'

const STORAGE_KEY = 'salary_profiles'

export const useLocalStorage = (initialValue) => {
  const loadedRef = useRef(false)
  
  const readFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error('Error reading from localStorage:', e)
    }
    return initialValue
  }, [initialValue])
  
  const writeToStorage = useCallback((value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch (e) {
      console.error('Error writing to localStorage:', e)
    }
  }, [])
  
  return { readFromStorage, writeToStorage }
}