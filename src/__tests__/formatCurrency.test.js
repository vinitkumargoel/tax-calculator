import { describe, it, expect } from 'vitest'
import { formatCurrency, formatCurrencyShort, parseCurrencyInput, formatPercent } from '../utils/formatCurrency.js'

describe('formatCurrency', () => {
  describe('with regular formatting', () => {
    it('should format zero amount', () => {
      const result = formatCurrency(0)
      expect(result).toMatch(/₹/)
      expect(result).toMatch(/0/)
    })

    it('should format small amounts', () => {
      const result = formatCurrency(1000)
      expect(result).toMatch(/₹/)
      expect(result).toMatch(/1,000/)
    })

    it('should format amounts in thousands', () => {
      const result = formatCurrency(100000)
      expect(result).toMatch(/₹/)
      expect(result).toMatch(/1,00,000/)
    })

    it('should format amounts in lakhs', () => {
      const result = formatCurrency(1500000)
      expect(result).toMatch(/₹/)
      expect(result).toMatch(/15,00,000/)
    })

    it('should format amounts in crores', () => {
      const result = formatCurrency(10000000)
      expect(result).toMatch(/₹/)
      expect(result).toMatch(/1,00,00,000/)
    })
  })

  describe('with compact formatting', () => {
    it('should format amounts as lakhs in compact mode', () => {
      const result = formatCurrency(1500000, true)
      expect(result).toContain('L')
    })

    it('should format amounts as crores in compact mode', () => {
      const result = formatCurrency(15000000, true)
      expect(result).toContain('Cr')
    })

    it('should format exactly at crore boundary', () => {
      const result = formatCurrency(10000000, true)
      expect(result).toBe('₹1.00Cr')
    })

    it('should format exactly at lakh boundary', () => {
      const result = formatCurrency(100000, true)
      expect(result).toBe('₹1.00L')
    })

    it('should not use compact format for amounts below 1 lakh', () => {
      const result = formatCurrency(50000, true)
      expect(result).toBe('₹50,000')
    })
  })

  describe('with various input types', () => {
    it('should handle string input', () => {
      const result = formatCurrency('50000')
      expect(result).toMatch(/₹/)
    })

    it('should handle null input', () => {
      const result = formatCurrency(null)
      expect(result).toMatch(/₹0/)
    })

    it('should handle undefined input', () => {
      const result = formatCurrency(undefined)
      expect(result).toMatch(/₹0/)
    })

    it('should handle NaN input', () => {
      const result = formatCurrency(NaN)
      expect(result).toMatch(/₹0/)
    })

    it('should handle negative amounts', () => {
      const result = formatCurrency(-50000)
      expect(result).toContain('₹')
    })

    it('should handle decimal amounts', () => {
      const result = formatCurrency(50000.5)
      expect(result).toMatch(/₹/)
    })
  })

  describe('Indian number formatting', () => {
    it('should use Indian number system (lakhs)', () => {
      const result = formatCurrency(100000)
      expect(result).toBe('₹1,00,000')
    })

    it('should use Indian number system (crores)', () => {
      const result = formatCurrency(10000000)
      expect(result).toBe('₹1,00,00,000')
    })

    it('should format numbers with correct comma placement', () => {
      const result = formatCurrency(12345678)
      expect(result).toBe('₹1,23,45,678')
    })
  })
})

describe('formatCurrencyShort', () => {
  it('should call formatCurrency with compact true', () => {
    const result = formatCurrencyShort(1500000)
    expect(result).toContain('L')
  })

  it('should format crores correctly', () => {
    const result = formatCurrencyShort(25000000)
    expect(result).toBe('₹2.50Cr')
  })

  it('should format lakhs correctly', () => {
    const result = formatCurrencyShort(550000)
    expect(result).toBe('₹5.50L')
  })

  it('should not compact amounts below 1 lakh', () => {
    const result = formatCurrencyShort(50000)
    expect(result).toBe('₹50,000')
  })
})

describe('parseCurrencyInput', () => {
  describe('with numeric input', () => {
    it('should return number as-is', () => {
      expect(parseCurrencyInput(50000)).toBe(50000)
    })

    it('should return zero for zero', () => {
      expect(parseCurrencyInput(0)).toBe(0)
    })

    it('should handle negative numbers', () => {
      expect(parseCurrencyInput(-50000)).toBe(-50000)
    })

    it('should handle decimal numbers', () => {
      expect(parseCurrencyInput(50000.5)).toBe(50000.5)
    })
  })

  describe('with string input', () => {
    it('should parse plain number string', () => {
      expect(parseCurrencyInput('50000')).toBe(50000)
    })

    it('should remove currency symbol', () => {
      expect(parseCurrencyInput('₹50,000')).toBe(50000)
    })

    it('should remove commas', () => {
      expect(parseCurrencyInput('1,00,000')).toBe(100000)
    })

    it('should handle both symbol and commas', () => {
      expect(parseCurrencyInput('₹1,50,000')).toBe(150000)
    })

    it('should handle dots as decimal', () => {
      expect(parseCurrencyInput('50000.50')).toBe(50000.5)
    })

    it('should handle negative string', () => {
      expect(parseCurrencyInput('-50000')).toBe(-50000)
    })
  })

  describe('with invalid input', () => {
    it('should return zero for null', () => {
      expect(parseCurrencyInput(null)).toBe(0)
    })

    it('should return zero for undefined', () => {
      expect(parseCurrencyInput(undefined)).toBe(0)
    })

    it('should return zero for empty string', () => {
      expect(parseCurrencyInput('')).toBe(0)
    })

    it('should return zero for non-numeric string', () => {
      expect(parseCurrencyInput('invalid')).toBe(0)
    })

    it('should handle mixed string', () => {
      expect(parseCurrencyInput('₹abc50000')).toBe(50000)
    })
  })

  describe('real-world scenarios', () => {
    it('should parse user input with spaces', () => {
      expect(parseCurrencyInput('  50000  ')).toBe(50000)
    })

    it('should parse input with INR prefix', () => {
      expect(parseCurrencyInput('INR 50000')).toBe(50000)
    })

    it('should parse Indian formatted numbers', () => {
      expect(parseCurrencyInput('1,23,456')).toBe(123456)
    })
  })
})

describe('formatPercent', () => {
  describe('with various percentage values', () => {
    it('should format zero percent', () => {
      expect(formatPercent(0)).toBe('0.0%')
    })

    it('should format whole number percent', () => {
      expect(formatPercent(50)).toBe('50.0%')
    })

    it('should format decimal percent', () => {
      expect(formatPercent(33.5)).toBe('33.5%')
    })

    it('should format percent with one decimal', () => {
      expect(formatPercent(12.3)).toBe('12.3%')
    })
  })

  describe('with edge cases', () => {
    it('should handle 100 percent', () => {
      expect(formatPercent(100)).toBe('100.0%')
    })

    it('should handle over 100 percent', () => {
      expect(formatPercent(150)).toBe('150.0%')
    })

    it('should handle negative percent', () => {
      expect(formatPercent(-10)).toBe('-10.0%')
    })
  })

  describe('with invalid input', () => {
    it('should handle null', () => {
      expect(formatPercent(null)).toBe('0.0%')
    })

    it('should handle undefined', () => {
      expect(formatPercent(undefined)).toBe('0.0%')
    })

    it('should handle string input', () => {
      expect(formatPercent('50')).toBe('50.0%')
    })

    it('should handle NaN', () => {
      expect(formatPercent(NaN)).toBe('0.0%')
    })
  })

  describe('rounding', () => {
    it('should round to one decimal', () => {
      expect(formatPercent(33.333)).toBe('33.3%')
    })

    it('should show trailing zero', () => {
      expect(formatPercent(25)).toBe('25.0%')
    })
  })
})