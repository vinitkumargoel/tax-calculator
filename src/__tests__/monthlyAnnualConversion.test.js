import { describe, it, expect } from 'vitest'

describe('Monthly-to-Annual Value Conversion', () => {
  describe('conversion formulas', () => {
    it('should convert monthly to annual by multiplying by 12', () => {
      const monthlyToAnnual = (monthly) => Math.round(monthly * 12)
      expect(monthlyToAnnual(50000)).toBe(600000)
      expect(monthlyToAnnual(33333)).toBe(399996)
      expect(monthlyToAnnual(100000)).toBe(1200000)
    })

    it('should convert annual to monthly by dividing by 12', () => {
      const annualToMonthly = (annual) => Math.round(annual / 12)
      expect(annualToMonthly(600000)).toBe(50000)
      expect(annualToMonthly(1200000)).toBe(100000)
      expect(annualToMonthly(750000)).toBe(62500)
    })

    it('should round values after conversion', () => {
      const monthlyToAnnual = (monthly) => Math.round(monthly * 12)
      const annualToMonthly = (annual) => Math.round(annual / 12)
      
      // Test rounding
      expect(annualToMonthly(100000)).toBe(8333)
      expect(monthlyToAnnual(8333)).toBe(99996)
      
      // Round trip should be approximately equal
      const original = 50000
      const annual = monthlyToAnnual(original)
      const backToMonthly = annualToMonthly(annual)
      expect(backToMonthly).toBe(original)
    })
  })

  describe('edge cases', () => {
    it('should handle zero values', () => {
      const monthlyToAnnual = (monthly) => Math.round(monthly * 12)
      const annualToMonthly = (annual) => Math.round(annual / 12)
      
      expect(monthlyToAnnual(0)).toBe(0)
      expect(annualToMonthly(0)).toBe(0)
    })

    it('should handle very large values', () => {
      const monthlyToAnnual = (monthly) => Math.round(monthly * 12)
      const annualToMonthly = (annual) => Math.round(annual / 12)
      
      expect(monthlyToAnnual(5000000)).toBe(60000000)
      expect(annualToMonthly(24000000)).toBe(2000000)
    })

    it('should handle decimal values', () => {
      const monthlyToAnnual = (monthly) => Math.round(monthly * 12)
      const annualToMonthly = (annual) => Math.round(annual / 12)
      
      expect(monthlyToAnnual(55000.50)).toBe(660006)
      expect(annualToMonthly(660006)).toBe(55001)
    })
  })

  describe('input parsing', () => {
    it('should parse formatted numbers with commas', () => {
      const parseFormatted = (value) => {
        const cleaned = value.replace(/[^\d]/g, '')
        return parseInt(cleaned, 10) || 0
      }
      
      expect(parseFormatted('1,00,000')).toBe(100000)
      expect(parseFormatted('50,000')).toBe(50000)
      expect(parseFormatted('₹75,000')).toBe(75000)
    })

    it('should handle empty input', () => {
      const parseFormatted = (value) => {
        const cleaned = value.replace(/[^\d]/g, '')
        return cleaned === '' ? 0 : parseInt(cleaned, 10)
      }
      
      expect(parseFormatted('')).toBe(0)
      expect(parseFormatted('abc')).toBe(0)
    })
  })
})