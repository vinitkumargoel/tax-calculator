import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'salary_profiles'

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return initialValue
    }
  })

  const [error, setError] = useState(null)

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      setError(null)
      return true
    } catch (error) {
      console.error('Error setting localStorage value:', error)
      setError(error.message)
      return false
    }
  }, [storedValue])

  const saveWithDebounce = useCallback((value, delay = 500) => {
    const timeoutId = setTimeout(() => {
      setValue(value)
    }, delay)
    return () => clearTimeout(timeoutId)
  }, [setValue])

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      setError(error.message)
      return false
    }
  }, [key, initialValue])

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      setError(error.message)
    }
  }, [key, storedValue])

  return {
    value: storedValue,
    setValue,
    saveWithDebounce,
    remove,
    error,
  }
}

export const useSalaryStorage = () => {
  return useLocalStorage(STORAGE_KEY, { profiles: [], activeProfileId: null })
}