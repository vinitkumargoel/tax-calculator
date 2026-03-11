import { describe, it, expect } from 'vitest'
import { calculateGratuity } from '../utils/gratuityCalculator.js'

describe('Gratuity Calculator', () => {
  describe('when calculating with basic salary only', () => {
    it('should calculate annual gratuity as (basic * 15) / 26', () => {
      const result = calculateGratuity(50000, 0)
      expect(result.annualAccrual).toBe(Math.round((50000 * 15) / 26))
    })

    it('should calculate monthly gratuity as annual divided by 12', () => {
      const result = calculateGratuity(50000, 0)
      expect(result.monthlyAccrual).toBe(Math.round(result.annualAccrual / 12))
    })

    it('should return zero gratuity when basic is zero', () => {
      const result = calculateGratuity(0, 0)
      expect(result.annualAccrual).toBe(0)
      expect(result.monthlyAccrual).toBe(0)
    })
  })

  describe('when calculating with basic and DA', () => {
    it('should include DA in gratuity calculation', () => {
      const basic = 50000
      const da = 5000
      const result = calculateGratuity(basic, da)
      const expected = ((basic + da) * 15) / 26
      expect(result.annualAccrual).toBe(Math.round(expected))
    })

    it('should handle DA higher than basic', () => {
      const result = calculateGratuity(20000, 30000)
      expect(result.annualAccrual).toBe(Math.round((50000 * 15) / 26))
    })
  })

  describe('with various salary levels', () => {
    it('should calculate gratuity for entry-level salary', () => {
      const result = calculateGratuity(20000, 0)
      expect(result.annualAccrual).toBe(Math.round((20000 * 15) / 26))
      expect(result.monthlyAccrual).toBe(Math.round(result.annualAccrual / 12))
    })

    it('should calculate gratuity for mid-level salary', () => {
      const result = calculateGratuity(60000, 5000)
      expect(result.annualAccrual).toBe(Math.round((65000 * 15) / 26))
    })

    it('should calculate gratuity for senior-level salary', () => {
      const result = calculateGratuity(100000, 10000)
      expect(result.annualAccrual).toBe(Math.round((110000 * 15) / 26))
    })

    it('should handle very high basic salary', () => {
      const result = calculateGratuity(200000, 50000)
      expect(result.annualAccrual).toBe(Math.round((250000 * 15) / 26))
    })
  })

  describe('with invalid inputs', () => {
    it('should handle null basic salary', () => {
      const result = calculateGratuity(null, 5000)
      expect(result.annualAccrual).toBe(Math.round((5000 * 15) / 26))
    })

    it('should handle undefined basic salary', () => {
      const result = calculateGratuity(undefined, 5000)
      expect(result.annualAccrual).toBe(Math.round((5000 * 15) / 26))
    })

    it('should handle null DA', () => {
      const result = calculateGratuity(50000, null)
      expect(result.annualAccrual).toBe(Math.round((50000 * 15) / 26))
    })

    it('should handle undefined DA', () => {
      const result = calculateGratuity(50000, undefined)
      expect(result.annualAccrual).toBe(Math.round((50000 * 15) / 26))
    })

    it('should handle string inputs', () => {
      const result = calculateGratuity('50000', '5000')
      expect(result.annualAccrual).toBe(Math.round((55000 * 15) / 26))
    })

    it('should handle negative values', () => {
      const result = calculateGratuity(-50000, 5000)
      expect(result.annualAccrual).toBe(Math.round((-45000 * 15) / 26))
    })
  })

  describe('calculation accuracy', () => {
    it('should round annual gratuity correctly', () => {
      const result = calculateGratuity(33333, 0)
      expect(result.annualAccrual).toBe(Math.round((33333 * 15) / 26))
    })

    it('should round monthly gratuity correctly', () => {
      const result = calculateGratuity(50000, 0)
      const expectedAnnual = Math.round((50000 * 15) / 26)
      expect(result.monthlyAccrual).toBe(Math.round(expectedAnnual / 12))
    })

    it('should maintain consistency between annual and monthly values', () => {
      const result = calculateGratuity(75000, 10000)
      const expectedMonthly = Math.round(result.annualAccrual / 12)
      expect(result.monthlyAccrual).toBe(expectedMonthly)
    })
  })

  describe('real-world scenarios', () => {
    it('should calculate gratuity for government employee with high DA', () => {
      const basic = 50000
      const da = 25000
      const result = calculateGratuity(basic, da)
      expect(result.annualAccrual).toBe(Math.round((75000 * 15) / 26))
    })

    it('should calculate gratuity for private sector employee with no DA', () => {
      const result = calculateGratuity(80000, 0)
      expect(result.annualAccrual).toBe(Math.round((80000 * 15) / 26))
    })

    it('should calculate gratuity for employee with 50% DA', () => {
      const basic = 60000
      const da = 30000
      const result = calculateGratuity(basic, da)
      expect(result.annualAccrual).toBe(Math.round((90000 * 15) / 26))
    })
  })

  describe('edge cases', () => {
    it('should handle minimum basic salary', () => {
      const result = calculateGratuity(15000, 0)
      expect(result.annualAccrual).toBe(Math.round((15000 * 15) / 26))
    })

    it('should handle fractional DA', () => {
      const result = calculateGratuity(50000, 1234.56)
      expect(result.annualAccrual).toBe(Math.round((51234.56 * 15) / 26))
    })

    it('should handle very small values', () => {
      const result = calculateGratuity(1, 1)
      expect(result.annualAccrual).toBe(Math.round((2 * 15) / 26))
    })
  })
})