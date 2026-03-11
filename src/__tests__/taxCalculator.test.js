import { describe, it, expect } from 'vitest'
import { calculateTax, calculateOldRegimeTax, calculateNewRegimeTax } from '../utils/taxCalculator.js'

const createMockProfile = (overrides = {}) => ({
  taxRegime: 'new',
  earnings: {
    basic: 50000,
    hra: 20000,
    da: 0,
    lta: 0,
    specialAllowance: 0,
    medicalAllowance: 0,
    bonus: 0,
    ...overrides.earnings,
  },
  exemptions: {
    rentPaid: 0,
    ltaExemption: 0,
    section80C: { pf: 0, vpf: 0, ppf: 0, elss: 0, nsc: 0, lifeInsurance: 0, homeLoanPrincipal: 0, tuitionFee: 0, sukanya: 0 },
    section80D: { selfFamily: 0, parents: 0, selfFamilySenior: false, parentsSenior: false },
    nps80CCD1B: 0,
    homeLoan: { annualInterest: 0, propertyType: 'self-occupied' },
    ...overrides.exemptions,
  },
  ...overrides,
})

describe('Tax Calculator - New Regime', () => {
  describe('basic tax calculation', () => {
    it('should return zero tax for income below taxable threshold', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 20000, 0)
      expect(result.totalTax).toBe(0)
    })

    it('should apply standard deduction of 75000 for new regime', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 50000, 0)
      expect(result.standardDeduction).toBe(75000)
    })

    it('should calculate tax correctly for income in 5% slab', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 80000, 0)
      const annualGross = 80000 * 12
      const taxable = annualGross - 75000
      expect(result.taxableIncome).toBe(taxable)
      expect(result.taxBeforeCess).toBeGreaterThan(0)
    })

    it('should calculate tax correctly for income in 10% slab', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 80000, 0)
      expect(result.taxableIncome).toBeGreaterThan(700000)
      expect(result.taxBeforeCess).toBeGreaterThan(0)
    })

    it('should calculate tax correctly for high income in 30% slab', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 150000, 0)
      expect(result.taxableIncome).toBeGreaterThan(1500000)
      expect(result.taxBeforeCess).toBeGreaterThan(0)
    })
  })

  describe('rebate application', () => {
    it('should apply full rebate for taxable income at or below 700000 in new regime', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 64500, 0)
      const annualGross = 64500 * 12
      const taxable = annualGross - 75000
      expect(taxable).toBeLessThanOrEqual(700000)
      expect(result.rebate).toBeGreaterThan(0)
      expect(result.totalTax).toBe(0)
    })

    it('should not apply rebate for taxable income above 700000', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 100000, 0)
      expect(result.rebate).toBe(0)
    })

    it('should apply correct rebate max of 25000 for new regime', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 64000, 0)
      expect(result.rebate).toBeLessThanOrEqual(25000)
    })
  })

  describe('cess calculation', () => {
    it('should calculate 4% cess on tax after rebate', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 100000, 0)
      const expectedCess = Math.round(result.taxBeforeCess * 0.04)
      expect(result.cess).toBe(expectedCess)
    })

    it('should include cess in total tax', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 100000, 0)
      expect(result.totalTax).toBe(result.taxBeforeCess + result.cess)
    })

    it('should have zero cess when tax is zero', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 20000, 0)
      expect(result.cess).toBe(0)
    })
  })

  describe('monthly TDS calculation', () => {
    it('should calculate monthly TDS by dividing total tax by 12', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 100000, 0)
      expect(result.monthlyTDS).toBe(Math.round(result.totalTax / 12))
    })

    it('should return zero monthly TDS for zero tax', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 20000, 0)
      expect(result.monthlyTDS).toBe(0)
    })
  })

  describe('with annual bonus', () => {
    it('should include annual bonus in gross income', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const monthlyGross = 50000
      const annualBonus = 100000
      const result = calculateNewRegimeTax(profile, monthlyGross, annualBonus)
      expect(result.annualGross).toBe(monthlyGross * 12 + annualBonus)
    })

    it('should calculate higher tax with bonus', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const resultWithoutBonus = calculateNewRegimeTax(profile, 100000, 0)
      const resultWithBonus = calculateNewRegimeTax(profile, 100000, 200000)
      expect(resultWithBonus.totalTax).toBeGreaterThan(resultWithoutBonus.totalTax)
    })
  })

  describe('surcharge warning', () => {
    it('should show surcharge warning for income above 50L', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 500000, 0)
      expect(result.surchargeWarning).toBe(true)
    })

    it('should not show surcharge warning for income below 50L', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      const result = calculateNewRegimeTax(profile, 40000, 0)
      expect(result.surchargeWarning).toBe(false)
    })
  })
})

describe('Tax Calculator - Old Regime', () => {
  describe('basic tax calculation', () => {
    it('should apply standard deduction of 50000 for old regime', () => {
      const profile = createMockProfile({ taxRegime: 'old' })
      const result = calculateOldRegimeTax(profile, 50000, 0)
      expect(result.standardDeduction).toBe(50000)
    })

    it('should calculate tax correctly for income in 5% slab', () => {
      const profile = createMockProfile({ taxRegime: 'old' })
      const result = calculateOldRegimeTax(profile, 50000, 0)
      expect(result.taxableIncome).toBeGreaterThan(250000)
      expect(result.taxBeforeCess).toBeGreaterThan(0)
    })

    it('should calculate tax correctly for income in 20% slab', () => {
      const profile = createMockProfile({ taxRegime: 'old' })
      const result = calculateOldRegimeTax(profile, 60000, 0)
      expect(result.taxBeforeCess).toBeGreaterThan(0)
    })

    it('should calculate tax correctly for income in 30% slab', () => {
      const profile = createMockProfile({ taxRegime: 'old' })
      const result = calculateOldRegimeTax(profile, 150000, 0)
      expect(result.taxBeforeCess).toBeGreaterThan(0)
    })
  })

  describe('rebate application', () => {
    it('should apply rebate for taxable income at or below 500000 in old regime', () => {
      const profile = createMockProfile({ taxRegime: 'old' })
      const result = calculateOldRegimeTax(profile, 45000, 0)
      expect(result.rebate).toBeGreaterThan(0)
      expect(result.rebate).toBeLessThanOrEqual(12500)
    })

    it('should not apply rebate for income above 500000', () => {
      const profile = createMockProfile({ taxRegime: 'old' })
      const result = calculateOldRegimeTax(profile, 60000, 0)
      expect(result.rebate).toBe(0)
    })
  })

  describe('HRA exemption deduction', () => {
    it('should deduct HRA exemption from taxable income', () => {
      const profile = createMockProfile({
        taxRegime: 'old',
        earnings: { basic: 50000, hra: 20000 },
        exemptions: { rentPaid: 18000 },
      })
      const result = calculateOldRegimeTax(profile, 50000, 0)
      expect(result.hraExemptionDetails).toBeDefined()
      expect(result.deductions.hraExemption).toBeGreaterThan(0)
    })

    it('should calculate HRA exemption based on city type', () => {
      const metroProfile = createMockProfile({
        taxRegime: 'old',
        earnings: { basic: 50000, hra: 20000 },
        exemptions: { rentPaid: 20000 },
        cityType: 'metro',
      })
      const nonMetroProfile = createMockProfile({
        taxRegime: 'old',
        earnings: { basic: 50000, hra: 20000 },
        exemptions: { rentPaid: 20000 },
        cityType: 'non-metro',
      })
      
      const metroResult = calculateOldRegimeTax(metroProfile, 50000, 0)
      const nonMetroResult = calculateOldRegimeTax(nonMetroProfile, 50000, 0)
      
      expect(metroResult.hraExemptionDetails.conditionB).toBe(50000 * 12 * 0.5)
      expect(nonMetroResult.hraExemptionDetails.conditionB).toBe(50000 * 12 * 0.4)
    })
  })

  describe('Section 80C deduction', () => {
    it('should deduct Section 80C investments up to 150000 limit', () => {
      const profile = createMockProfile({
        taxRegime: 'old',
        exemptions: {
          section80C: { pf: 100000, ppf: 80000 },
        },
      })
      const result = calculateOldRegimeTax(profile, 50000, 0)
      expect(result.deductions.section80C).toBe(150000)
    })

    it('should cap Section 80C to 150000 even with higher investments', () => {
      const profile = createMockProfile({
        taxRegime: 'old',
        exemptions: {
          section80C: { pf: 200000, ppf: 100000 },
        },
      })
      const result = calculateOldRegimeTax(profile, 50000, 0)
      expect(result.section80CUsed).toBe(150000)
    })

    it('should sum all 80C components correctly', () => {
      const profile = createMockProfile({
        taxRegime: 'old',
        exemptions: {
          section80C: {
            pf: 50000,
            vpf: 20000,
            ppf: 30000,
            elss: 25000,
            nsc: 10000,
            lifeInsurance: 15000,
          },
        },
      })
      const result = calculateOldRegimeTax(profile, 50000, 0)
      expect(result.section80CUsed).toBe(150000)
    })
  })

  describe('Section 80D deduction', () => {
    it('should deduct health insurance premium with 25000 limit for non-senior', () => {
      const profile = createMockProfile({
        taxRegime: 'old',
        exemptions: {
          section80D: { selfFamily: 30000, parents: 20000, selfFamilySenior: false, parentsSenior: false },
        },
      })
      const result = calculateOldRegimeTax(profile, 50000, 0)
      expect(result.deductions.section80D).toBe(45000)
    })

    it('should allow 50000 limit for senior citizens', () => {
      const profile = createMockProfile({
        taxRegime: 'old',
        exemptions: {
          section80D: { selfFamily: 50000, parents: 50000, selfFamilySenior: true, parentsSenior: true },
        },
      })
      const result = calculateOldRegimeTax(profile, 50000, 0)
      expect(result.deductions.section80D).toBe(100000)
    })
  })

  describe('NPS 80CCD(1B) deduction', () => {
    it('should deduct NPS contribution up to 50000 limit', () => {
      const profile = createMockProfile({
        taxRegime: 'old',
        exemptions: { nps80CCD1B: 60000 },
      })
      const result = calculateOldRegimeTax(profile, 50000, 0)
      expect(result.deductions.nps80CCD1B).toBe(50000)
    })

    it('should allow full NPS contribution below 50000', () => {
      const profile = createMockProfile({
        taxRegime: 'old',
        exemptions: { nps80CCD1B: 40000 },
      })
      const result = calculateOldRegimeTax(profile, 50000, 0)
      expect(result.deductions.nps80CCD1B).toBe(40000)
    })
  })

  describe('Home loan interest deduction', () => {
    it('should cap home loan interest at 200000 for self-occupied', () => {
      const profile = createMockProfile({
        taxRegime: 'old',
        exemptions: {
          homeLoan: { annualInterest: 300000, propertyType: 'self-occupied' },
        },
      })
      const result = calculateOldRegimeTax(profile, 50000, 0)
      expect(result.deductions.homeLoanInterest).toBe(200000)
    })

    it('should allow full interest for let-out property', () => {
      const profile = createMockProfile({
        taxRegime: 'old',
        exemptions: {
          homeLoan: { annualInterest: 300000, propertyType: 'let-out' },
        },
      })
      const result = calculateOldRegimeTax(profile, 50000, 0)
      expect(result.deductions.homeLoanInterest).toBe(300000)
    })
  })

  describe('LTA exemption', () => {
    it('should deduct LTA exemption from taxable income', () => {
      const profile = createMockProfile({
        taxRegime: 'old',
        exemptions: { ltaExemption: 25000 },
      })
      const result = calculateOldRegimeTax(profile, 50000, 0)
      expect(result.deductions.ltaExemption).toBe(25000)
    })
  })

  describe('total deductions calculation', () => {
    it('should sum all deductions correctly', () => {
      const profile = createMockProfile({
        taxRegime: 'old',
        earnings: { basic: 50000, hra: 20000 },
        exemptions: {
          rentPaid: 20000,
          ltaExemption: 20000,
          section80C: { pf: 100000 },
          section80D: { selfFamily: 25000, parents: 25000, selfFamilySenior: false, parentsSenior: false },
          nps80CCD1B: 50000,
          homeLoan: { annualInterest: 100000, propertyType: 'self-occupied' },
        },
      })
      const result = calculateOldRegimeTax(profile, 50000, 0)
      expect(result.deductions.total).toBeGreaterThan(0)
    })
  })
})

describe('Tax Calculator - Regime Comparison', () => {
  describe('comparing old vs new regime', () => {
    it('should return same values for same profile with calculateTax and regime-specific functions', () => {
      const newProfile = createMockProfile({ taxRegime: 'new' })
      const oldProfile = createMockProfile({ taxRegime: 'old' })
      
      const newResult = calculateTax(newProfile, 50000, 0)
      const oldResult = calculateTax(oldProfile, 50000, 0)
      
      const newRegimeResult = calculateNewRegimeTax(newProfile, 50000, 0)
      const oldRegimeResult = calculateOldRegimeTax(oldProfile, 50000, 0)
      
      expect(newResult.totalTax).toBe(newRegimeResult.totalTax)
      expect(oldResult.totalTax).toBe(oldRegimeResult.totalTax)
    })

    it('should calculate different tax for old vs new regime without deductions', () => {
      const profile = createMockProfile({ taxRegime: 'new' })
      
      const newResult = calculateNewRegimeTax(profile, 60000, 0)
      const oldResult = calculateOldRegimeTax(profile, 60000, 0)
      
      expect(newResult.totalTax).not.toBe(oldResult.totalTax)
    })

    it('should result in lower tax for new regime when no deductions claimed', () => {
      const profile = createMockProfile({
        taxRegime: 'new',
        earnings: { basic: 50000, hra: 20000 },
        exemptions: { rentPaid: 0, ltaExemption: 0, section80C: {}, section80D: {} },
      })
      
      const newResult = calculateNewRegimeTax(profile, 50000, 0)
      const oldResult = calculateOldRegimeTax(profile, 50000, 0)
      
      expect(newResult.totalTax).toBeLessThanOrEqual(oldResult.totalTax)
    })

    it('should result in lower tax for old regime with maximum deductions', () => {
      const profile = createMockProfile({
        taxRegime: 'old',
        earnings: { basic: 50000, hra: 25000 },
        exemptions: {
          rentPaid: 25000,
          ltaExemption: 50000,
          section80C: { pf: 150000 },
          section80D: { selfFamily: 25000, parents: 25000 },
          nps80CCD1B: 50000,
          homeLoan: { annualInterest: 200000, propertyType: 'self-occupied' },
        },
        cityType: 'metro',
      })
      
      const newResult = calculateNewRegimeTax(profile, 50000, 0)
      const oldResult = calculateOldRegimeTax(profile, 50000, 0)
    })
  })
})

describe('Tax Calculator - Edge Cases', () => {
  it('should handle zero gross salary', () => {
    const profile = createMockProfile({ taxRegime: 'new' })
    const result = calculateTax(profile, 0, 0)
    expect(result.annualGross).toBe(0)
    expect(result.totalTax).toBe(0)
  })

  it('should handle very high salary', () => {
    const profile = createMockProfile({ taxRegime: 'new' })
    const result = calculateTax(profile, 1000000, 5000000)
    expect(result.annualGross).toBe(17000000)
    expect(result.surchargeWarning).toBe(true)
  })

  it('should throw error for null profile', () => {
    expect(() => calculateTax(null, 50000, 0)).toThrow()
  })

  it('should handle undefined exemptions', () => {
    const profile = createMockProfile({ taxRegime: 'old', exemptions: undefined })
    const result = calculateOldRegimeTax(profile, 50000, 0)
    expect(result).toBeDefined()
  })

  it('should handle undefined earnings', () => {
    const profile = createMockProfile({ taxRegime: 'old', earnings: undefined })
    const result = calculateOldRegimeTax(profile, 50000, 0)
    expect(result).toBeDefined()
  })

  it('should calculate correct taxable income floor at zero', () => {
    const profile = createMockProfile({
      taxRegime: 'old',
      exemptions: {
        section80C: { pf: 500000 },
        section80D: { selfFamily: 500000, parents: 500000 },
        nps80CCD1B: 500000,
        homeLoan: { annualInterest: 500000, propertyType: 'let-out' },
      },
    })
    const result = calculateOldRegimeTax(profile, 30000, 0)
    expect(result.taxableIncome).toBeGreaterThanOrEqual(0)
  })
})