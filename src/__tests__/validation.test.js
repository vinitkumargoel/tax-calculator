import { describe, it, expect } from 'vitest'
import {
  validateNumber,
  validateSalaryComponents,
  validateSection80C,
  validateSection80D,
  validateHomeLoan,
  validateProfile,
  MAX_REASONABLE_CTC,
  MAX_REASONABLE_BASIC,
} from '../utils/validation.js'

describe('validateNumber', () => {
  describe('with valid numeric input', () => {
    it('should return valid for a positive number', () => {
      const result = validateNumber(50000, 'Basic')
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.value).toBe(50000)
    })

    it('should return valid for zero', () => {
      const result = validateNumber(0, 'Basic')
      expect(result.valid).toBe(true)
      expect(result.value).toBe(0)
    })

    it('should return valid for string number', () => {
      const result = validateNumber('50000', 'Basic')
      expect(result.valid).toBe(true)
      expect(result.value).toBe(50000)
    })
  })

  describe('with min constraint', () => {
    it('should pass when value equals min', () => {
      const result = validateNumber(0, 'Basic', { min: 0 })
      expect(result.valid).toBe(true)
    })

    it('should fail when value below min', () => {
      const result = validateNumber(-100, 'Basic', { min: 0 })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Basic cannot be less than 0')
    })
  })

  describe('with max constraint', () => {
    it('should pass when value equals max', () => {
      const result = validateNumber(100000, 'Basic', { max: 100000 })
      expect(result.valid).toBe(true)
    })

    it('should fail when value exceeds max', () => {
      const result = validateNumber(150000, 'Basic', { max: 100000 })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Basic cannot exceed 100000')
    })
  })

  describe('with integer constraint', () => {
    it('should pass for whole numbers', () => {
      const result = validateNumber(50000, 'Basic', { integer: true })
      expect(result.valid).toBe(true)
    })

    it('should fail for decimal numbers when integer required', () => {
      const result = validateNumber(50000.50, 'Basic', { integer: true })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Basic must be a whole number')
    })
  })

  describe('with invalid input', () => {
    it('should fail for NaN', () => {
      const result = validateNumber(NaN, 'Basic')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Basic must be a valid number')
    })

    it('should fail for non-numeric string', () => {
      const result = validateNumber('invalid', 'Basic')
      expect(result.valid).toBe(false)
      expect(result.value).toBe(0)
    })

    it('should handle null input', () => {
      const result = validateNumber(null, 'Basic')
      expect(result.valid).toBe(true)
      expect(result.value).toBe(0)
    })

    it('should handle undefined input', () => {
      const result = validateNumber(undefined, 'Basic')
      expect(result.valid).toBe(false)
      expect(result.value).toBe(0)
    })
  })
})

describe('validateSalaryComponents', () => {
  describe('with valid salary components', () => {
    it('should return valid for typical salary', () => {
      const earnings = { basic: 50000, hra: 20000, lta: 5000, bonus: 100000 }
      const result = validateSalaryComponents(earnings, {}, {})
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return valid for minimum values', () => {
      const earnings = { basic: 0, hra: 0, lta: 0, bonus: 0 }
      const result = validateSalaryComponents(earnings, {}, {})
      expect(result.valid).toBe(true)
    })

    it('should return valid for maximum reasonable values', () => {
      const earnings = { basic: 5000000, hra: 200000, lta: 50000, bonus: 500000 }
      const result = validateSalaryComponents(earnings, {}, {})
      expect(result.valid).toBe(true)
    })
  })

  describe('with negative values', () => {
    it('should fail for negative basic', () => {
      const earnings = { basic: -50000, hra: 0, lta: 0, bonus: 0 }
      const result = validateSalaryComponents(earnings, {}, {})
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Basic pay cannot be negative')
    })

    it('should fail for negative HRA', () => {
      const earnings = { basic: 50000, hra: -20000, lta: 0, bonus: 0 }
      const result = validateSalaryComponents(earnings, {}, {})
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('HRA cannot be negative')
    })

    it('should fail for negative LTA', () => {
      const earnings = { basic: 50000, hra: 20000, lta: -5000, bonus: 0 }
      const result = validateSalaryComponents(earnings, {}, {})
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('LTA cannot be negative')
    })

    it('should fail for negative bonus', () => {
      const earnings = { basic: 50000, hra: 20000, lta: 5000, bonus: -100000 }
      const result = validateSalaryComponents(earnings, {}, {})
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Bonus cannot be negative')
    })

    it('should fail for negative rent paid', () => {
      const earnings = { basic: 50000, hra: 20000, lta: 0, bonus: 0 }
      const exemptions = { rentPaid: -10000 }
      const result = validateSalaryComponents(earnings, exemptions, {})
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Rent paid cannot be negative')
    })
  })

  describe('with warning scenarios', () => {
    it('should warn when basic exceeds 50L', () => {
      const earnings = { basic: MAX_REASONABLE_BASIC + 1, hra: 0, lta: 0, bonus: 0 }
      const result = validateSalaryComponents(earnings, {}, {})
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings.some(w => w.includes('unusually high'))).toBe(true)
    })

    it('should warn when HRA exceeds 60% of basic', () => {
      const earnings = { basic: 50000, hra: 35000, lta: 0, bonus: 0 }
      const result = validateSalaryComponents(earnings, {}, {})
      expect(result.warnings.some(w => w.includes('exceeds 60%'))).toBe(true)
    })

    it('should warn when total earnings exceed 50L', () => {
      const earnings = { basic: 4000000, hra: 1000000, lta: 0, bonus: 1000000 }
      const result = validateSalaryComponents(earnings, {}, {})
      expect(result.warnings.some(w => w.includes('Surcharge may apply'))).toBe(true)
    })
  })

  describe('with typical salary structures', () => {
    it('should validate fresher salary structure', () => {
      const earnings = { basic: 25000, hra: 10000, lta: 2000, bonus: 0 }
      const result = validateSalaryComponents(earnings, {}, {})
      expect(result.valid).toBe(true)
    })

    it('should validate senior salary structure', () => {
      const earnings = { basic: 100000, hra: 40000, lta: 10000, bonus: 300000 }
      const result = validateSalaryComponents(earnings, {}, {})
      expect(result.valid).toBe(true)
    })
  })
})

describe('validateSection80C', () => {
  describe('with valid investments within limit', () => {
    it('should pass when total is within 1.5L limit', () => {
      const section80C = { pf: 50000, ppf: 50000, elss: 50000 }
      const result = validateSection80C(section80C)
      expect(result.exceeded).toBe(false)
      expect(result.warnings).toHaveLength(0)
    })

    it('should return correct total of all investments', () => {
      const section80C = { pf: 50000, vpf: 20000, ppf: 30000, elss: 25000 }
      const result = validateSection80C(section80C)
      expect(result.total).toBe(125000)
    })
  })

  describe('when exceeding limit', () => {
    it('should warn when total exceeds 1.5L limit', () => {
      const section80C = { pf: 100000, ppf: 100000 }
      const result = validateSection80C(section80C)
      expect(result.exceeded).toBe(true)
      expect(result.warnings.length).toBeGreaterThan(0)
    })

    it('should include exceeded limit in warning', () => {
      const section80C = { pf: 200000 }
      const result = validateSection80C(section80C)
      expect(result.warnings[0]).toContain('1.5L')
    })
  })

  describe('with various investment types', () => {
    it('should sum all investment types correctly', () => {
      const section80C = {
        pf: 10000,
        vpf: 10000,
        ppf: 10000,
        elss: 10000,
        nsc: 10000,
        lifeInsurance: 10000,
        homeLoanPrincipal: 10000,
        tuitionFee: 10000,
        sukanya: 10000,
      }
      const result = validateSection80C(section80C)
      expect(result.total).toBe(90000)
    })

    it('should handle missing investment types', () => {
      const section80C = { pf: 50000 }
      const result = validateSection80C(section80C)
      expect(result.total).toBe(50000)
    })

    it('should handle empty Section 80C object', () => {
      const result = validateSection80C({})
      expect(result.total).toBe(0)
      expect(result.exceeded).toBe(false)
    })
  })
})

describe('validateSection80D', () => {
  describe('with valid health insurance premiums', () => {
    it('should pass when premiums are within limits for non-senior', () => {
      const section80D = { selfFamily: 25000, parents: 25000, selfFamilySenior: false, parentsSenior: false }
      const result = validateSection80D(section80D)
      expect(result.warnings).toHaveLength(0)
    })

    it('should pass when premiums are within limits for senior', () => {
      const section80D = { selfFamily: 50000, parents: 50000, selfFamilySenior: true, parentsSenior: true }
      const result = validateSection80D(section80D)
      expect(result.warnings).toHaveLength(0)
    })
  })

  describe('when premiums exceed limits', () => {
    it('should warn when self/family premium exceeds 25000 limit for non-senior', () => {
      const section80D = { selfFamily: 30000, parents: 20000, selfFamilySenior: false, parentsSenior: false }
      const result = validateSection80D(section80D)
      expect(result.warnings.some(w => w.includes('Self/Family'))).toBe(true)
    })

    it('should warn when parents premium exceeds limit', () => {
      const section80D = { selfFamily: 20000, parents: 60000, parentsSenior: true }
      const result = validateSection80D(section80D)
      expect(result.warnings.some(w => w.includes('Parents'))).toBe(true)
    })
  })

  describe('with senior citizen limits', () => {
    it('should apply 50000 limit for senior self/family', () => {
      const section80D = { selfFamily: 50000, selfFamilySenior: true }
      const result = validateSection80D(section80D)
      expect(result.warnings).toHaveLength(0)
    })

    it('should warn when non-senior exceeds 25000 limit', () => {
      const section80D = { selfFamily: 40000, selfFamilySenior: false }
      const result = validateSection80D(section80D)
      expect(result.warnings.length).toBeGreaterThan(0)
    })
  })
})

describe('validateHomeLoan', () => {
  describe('with valid home loan details', () => {
    it('should pass for self-occupied property with interest within 2L', () => {
      const homeLoan = { annualInterest: 150000, propertyType: 'self-occupied' }
      const result = validateHomeLoan(homeLoan)
      expect(result.warnings).toHaveLength(0)
    })

    it('should pass for let-out property with any interest amount', () => {
      const homeLoan = { annualInterest: 500000, propertyType: 'let-out' }
      const result = validateHomeLoan(homeLoan)
      expect(result.warnings).toHaveLength(0)
    })
  })

  describe('when interest exceeds limit', () => {
    it('should warn when self-occupied property interest exceeds 2L', () => {
      const homeLoan = { annualInterest: 300000, propertyType: 'self-occupied' }
      const result = validateHomeLoan(homeLoan)
      expect(result.warnings.some(w => w.includes('capped at'))).toBe(true)
    })

    it('should not warn for let-out property even with high interest', () => {
      const homeLoan = { annualInterest: 500000, propertyType: 'let-out' }
      const result = validateHomeLoan(homeLoan)
      expect(result.warnings).toHaveLength(0)
    })
  })

  describe('with invalid inputs', () => {
    it('should warn for negative interest', () => {
      const homeLoan = { annualInterest: -100000, propertyType: 'self-occupied' }
      const result = validateHomeLoan(homeLoan)
      expect(result.warnings.some(w => w.includes('negative'))).toBe(true)
    })

    it('should handle undefined home loan', () => {
      const result = validateHomeLoan(undefined)
      expect(result.warnings).toHaveLength(0)
    })

    it('should handle empty home loan object', () => {
      const result = validateHomeLoan({})
      expect(result.warnings).toHaveLength(0)
    })
  })
})

describe('validateProfile', () => {
  describe('with valid profile', () => {
    it('should return valid for complete profile', () => {
      const profile = {
        earnings: { basic: 50000, hra: 20000, lta: 5000, bonus: 0 },
        exemptions: {
          section80C: { pf: 50000, ppf: 50000 },
          section80D: { selfFamily: 25000, parents: 25000 },
          homeLoan: { annualInterest: 100000, propertyType: 'self-occupied' },
        },
      }
      const result = validateProfile(profile)
      expect(result.valid).toBe(true)
    })
  })

  describe('with invalid profile', () => {
    it('should fail for negative basic', () => {
      const profile = {
        earnings: { basic: -50000, hra: 0, lta: 0, bonus: 0 },
        exemptions: {},
      }
      const result = validateProfile(profile)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('with warnings', () => {
    it('should include warnings from all validations', () => {
      const profile = {
        earnings: { basic: 50000, hra: 35000, lta: 0, bonus: 0 },
        exemptions: {
          section80C: { pf: 200000 },
          section80D: { selfFamily: 50000 },
          homeLoan: { annualInterest: 300000, propertyType: 'self-occupied' },
        },
      }
      const result = validateProfile(profile)
      expect(result.warnings.length).toBeGreaterThan(0)
    })
  })

  describe('with missing data', () => {
    it('should handle null profile', () => {
      const result = validateProfile(null)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should handle undefined profile', () => {
      const result = validateProfile(undefined)
      expect(result.valid).toBe(true)
    })

    it('should handle empty profile', () => {
      const result = validateProfile({})
      expect(result.valid).toBe(true)
    })
  })
})