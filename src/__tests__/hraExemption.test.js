import { describe, it, expect } from 'vitest'
import { calculateHRAExemption } from '../utils/hraExemption.js'

describe('HRA Exemption Calculator', () => {
  describe('when HRA is zero', () => {
    it('should return zero exemption when HRA received is zero', () => {
      const result = calculateHRAExemption(0, 50000, 15000, 'metro')
      expect(result.exemption).toBe(0)
      expect(result.conditionA).toBe(0)
    })
  })

  describe('when basic salary is zero', () => {
    it('should return zero exemption when basic salary is zero', () => {
      const result = calculateHRAExemption(10000, 0, 10000, 'metro')
      expect(result.exemption).toBe(0)
      expect(result.conditionB).toBe(0)
    })
  })

  describe('when rent paid is zero', () => {
    it('should return zero exemption when no rent is paid', () => {
      const result = calculateHRAExemption(15000, 50000, 0, 'metro')
      expect(result.exemption).toBe(0)
      expect(result.conditionC).toBe(0)
    })
  })

  describe('for metro city employees', () => {
    it('should use 50% of basic as conditionB for metro cities', () => {
      const result = calculateHRAExemption(20000, 50000, 20000, 'metro')
      expect(result.conditionB).toBe(300000)
      expect(result.exemption).toBe(180000)
    })
  })

  describe('for non-metro city employees', () => {
    it('should use 40% of basic as conditionB for non-metro cities', () => {
      const result = calculateHRAExemption(20000, 50000, 20000, 'non-metro')
      expect(result.conditionB).toBe(240000)
      expect(result.exemption).toBe(180000)
    })
  })

  describe('when HRA amount is the limiting factor', () => {
    it('should return HRA amount as exemption when it is minimum', () => {
      const result = calculateHRAExemption(5000, 60000, 30000, 'metro')
      expect(result.exemption).toBe(result.conditionA)
      expect(result.exemption).toBe(60000)
    })
  })

  describe('when rent minus 10% basic is the limiting factor', () => {
    it('should return conditionC as exemption when it is minimum', () => {
      const result = calculateHRAExemption(20000, 50000, 20000, 'metro')
      expect(result.exemption).toBe(result.conditionC)
      expect(result.exemption).toBe(180000)
    })
  })

  describe('when 50% or 40% of basic is the limiting factor', () => {
    it('should return conditionB as exemption when it is minimum', () => {
      const result = calculateHRAExemption(30000, 20000, 20000, 'metro')
      expect(result.exemption).toBe(result.conditionB)
      expect(result.exemption).toBe(120000)
    })
  })

  describe('with invalid inputs', () => {
    it('should handle null inputs gracefully', () => {
      const result = calculateHRAExemption(null, null, null, 'metro')
      expect(result.exemption).toBe(0)
      expect(result.conditionA).toBe(0)
      expect(result.conditionB).toBe(0)
      expect(result.conditionC).toBe(0)
    })

    it('should handle undefined inputs gracefully', () => {
      const result = calculateHRAExemption(undefined, undefined, undefined)
      expect(result.exemption).toBe(0)
    })

    it('should handle string inputs by converting to numbers', () => {
      const result = calculateHRAExemption('20000', '50000', '20000', 'metro')
      expect(result.exemption).toBe(180000)
    })
  })

  describe('edge cases', () => {
    it('should return zero when rent is less than 10% of basic', () => {
      const result = calculateHRAExemption(10000, 50000, 3000, 'metro')
      expect(result.conditionC).toBe(0)
      expect(result.exemption).toBe(0)
    })

    it('should use default metro city type when not specified', () => {
      const result = calculateHRAExemption(20000, 50000, 20000)
      expect(result.conditionB).toBe(300000)
    })

    it('should handle very high HRA amounts', () => {
      const result = calculateHRAExemption(100000, 50000, 40000, 'metro')
      expect(result.conditionA).toBe(1200000)
    })

    it('should handle very high basic salary', () => {
      const result = calculateHRAExemption(50000, 200000, 80000, 'metro')
      expect(result.conditionB).toBe(1200000)
    })
  })

  describe('real-world scenarios', () => {
    // Per Income Tax Act, only Delhi, Mumbai, Chennai, Kolkata are metro (50%).
    // Bengaluru, Hyderabad, Pune and all other cities are non-metro (40%).
    it('should calculate exemption for typical software engineer in Bengaluru (non-metro)', () => {
      const basic = 50000
      const hra = 20000
      const rent = 18000
      // A = 20000*12 = 240000, B = 50000*12*0.4 = 240000, C = 18000*12 - 50000*12*0.1 = 216000-60000 = 156000
      // min(240000, 240000, 156000) = 156000
      const result = calculateHRAExemption(hra, basic, rent, 'non-metro')
      expect(result.exemption).toBe(156000)
      expect(result.conditionB).toBe(240000) // 40% of basic annual, NOT 50%
    })

    it('should give higher exemption for same salary in metro vs non-metro', () => {
      const basic = 50000, hra = 20000, rent = 18000
      const metroResult = calculateHRAExemption(hra, basic, rent, 'metro')
      const nonMetroResult = calculateHRAExemption(hra, basic, rent, 'non-metro')
      // Metro conditionB = 50000*12*0.5 = 300000 > 240000 (non-metro)
      expect(metroResult.conditionB).toBeGreaterThan(nonMetroResult.conditionB)
    })

    it('should calculate exemption for employee in Mumbai (metro)', () => {
      const basic = 60000
      const hra = 25000
      const rent = 30000
      // A = 25000*12 = 300000, B = 60000*12*0.5 = 360000, C = 30000*12 - 60000*12*0.1 = 360000-72000 = 288000
      // min(300000, 360000, 288000) = 288000
      const result = calculateHRAExemption(hra, basic, rent, 'metro')
      expect(result.exemption).toBe(288000)
      expect(result.conditionB).toBe(360000) // 50% of basic annual for metro
    })

    it('should calculate exemption for employee living in own house', () => {
      const result = calculateHRAExemption(15000, 50000, 0, 'metro')
      expect(result.exemption).toBe(0)
    })
  })
})