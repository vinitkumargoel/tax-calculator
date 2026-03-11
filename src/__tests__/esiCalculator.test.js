import { describe, it, expect } from 'vitest'
import { calculateESI } from '../utils/esiCalculator.js'

describe('ESI Calculator', () => {
  describe('when ESI is applicable', () => {
    it('should be applicable when monthly gross is below 21000', () => {
      const result = calculateESI(20000)
      expect(result.applicable).toBe(true)
    })

    it('should be applicable when monthly gross is exactly 21000', () => {
      const result = calculateESI(21000)
      expect(result.applicable).toBe(true)
    })

    it('should calculate 0.75% as employee ESI contribution', () => {
      const result = calculateESI(20000)
      expect(result.employeeESI).toBe(150)
    })

    it('should calculate 3.25% as employer ESI contribution', () => {
      const result = calculateESI(20000)
      expect(result.employerESI).toBe(650)
    })

    it('should correctly calculate ESI for minimum wage', () => {
      const result = calculateESI(10000)
      expect(result.employeeESI).toBe(75)
      expect(result.employerESI).toBe(325)
    })
  })

  describe('when ESI is not applicable', () => {
    it('should not be applicable when monthly gross exceeds 21000', () => {
      const result = calculateESI(25000)
      expect(result.applicable).toBe(false)
    })

    it('should return zero contributions when not applicable', () => {
      const result = calculateESI(50000)
      expect(result.employeeESI).toBe(0)
      expect(result.employerESI).toBe(0)
    })

    it('should be not applicable for high salary employees', () => {
      const result = calculateESI(100000)
      expect(result.applicable).toBe(false)
    })
  })

  describe('with zero gross salary', () => {
    it('should be applicable but have zero contribution', () => {
      const result = calculateESI(0)
      expect(result.applicable).toBe(true)
      expect(result.employeeESI).toBe(0)
      expect(result.employerESI).toBe(0)
    })
  })

  describe('with boundary values', () => {
    it('should be applicable at exactly 21001 (just above threshold)', () => {
      const result = calculateESI(21001)
      expect(result.applicable).toBe(false)
    })

    it('should be applicable at high boundary values', () => {
      const gross = 21000
      const result = calculateESI(gross)
      expect(result.applicable).toBe(true)
      expect(result.employeeESI).toBe(Math.round(gross * 0.0075))
      expect(result.employerESI).toBe(Math.round(gross * 0.0325))
    })

    it('should round ESI contributions correctly', () => {
      const result = calculateESI(15750)
      expect(result.employeeESI).toBe(Math.round(15750 * 0.0075))
      expect(result.employerESI).toBe(Math.round(15750 * 0.0325))
    })
  })

  describe('with invalid inputs', () => {
    it('should handle null input', () => {
      const result = calculateESI(null)
      expect(result.applicable).toBe(true)
      expect(result.employeeESI).toBe(0)
      expect(result.employerESI).toBe(0)
    })

    it('should handle undefined input', () => {
      const result = calculateESI(undefined)
      expect(result.applicable).toBe(true)
      expect(result.employeeESI).toBe(0)
      expect(result.employerESI).toBe(0)
    })

    it('should handle string input', () => {
      const result = calculateESI('20000')
      expect(result.applicable).toBe(true)
      expect(result.employeeESI).toBe(150)
    })

    it('should handle invalid string input', () => {
      const result = calculateESI('invalid')
      expect(result.applicable).toBe(true)
      expect(result.employeeESI).toBe(0)
    })

    it('should handle negative input', () => {
      const result = calculateESI(-20000)
      expect(result.applicable).toBe(true)
    })
  })

  describe('real-world scenarios', () => {
    it('should calculate ESI for contract worker with 18000 gross', () => {
      const result = calculateESI(18000)
      expect(result.applicable).toBe(true)
      expect(result.employeeESI).toBe(135)
      expect(result.employerESI).toBe(585)
    })

    it('should calculate ESI for part-time employee with 12000 gross', () => {
      const result = calculateESI(12000)
      expect(result.applicable).toBe(true)
      expect(result.employeeESI).toBe(90)
      expect(result.employerESI).toBe(390)
    })

    it('should not calculate ESI for full-time software engineer with 80000 gross', () => {
      const result = calculateESI(80000)
      expect(result.applicable).toBe(false)
      expect(result.employeeESI).toBe(0)
      expect(result.employerESI).toBe(0)
    })

    it('should handle ESI at threshold for borderline salary', () => {
      const justBelow = calculateESI(20999)
      const justAbove = calculateESI(21001)
      
      expect(justBelow.applicable).toBe(true)
      expect(justAbove.applicable).toBe(false)
    })
  })

  describe('ESI contribution percentages', () => {
    it('should calculate correct employee contribution ratio', () => {
      const gross = 15000
      const result = calculateESI(gross)
      const ratio = result.employeeESI / gross
      expect(Math.abs(ratio - 0.0075)).toBeLessThan(0.001)
    })

    it('should calculate correct employer contribution ratio', () => {
      const gross = 15000
      const result = calculateESI(gross)
      const ratio = result.employerESI / gross
      expect(Math.abs(ratio - 0.0325)).toBeLessThan(0.001)
    })

    it('should have total ESI contribution at 4% of gross', () => {
      const gross = 20000
      const result = calculateESI(gross)
      const total = result.employeeESI + result.employerESI
      const ratio = total / gross
      expect(Math.abs(ratio - 0.04)).toBeLessThan(0.001)
    })
  })
})