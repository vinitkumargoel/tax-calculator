import { describe, it, expect } from 'vitest'
import { calculatePF, calculateVPF } from '../utils/pfCalculator.js'

describe('PF Calculator', () => {
  describe('employee PF calculation', () => {
    it('should calculate 12% of basic as employee PF in capped mode', () => {
      const result = calculatePF(50000, 'capped')
      expect(result.employeePF).toBe(1800)
    })

    it('should cap employee PF at 12% of 15000 when basic exceeds 15000', () => {
      const result = calculatePF(100000, 'capped')
      expect(result.employeePF).toBe(1800)
    })

    it('should calculate 12% of basic as employee PF in full mode', () => {
      const result = calculatePF(50000, 'full')
      expect(result.employeePF).toBe(6000)
    })

    it('should not cap employee PF in full mode even for high basic', () => {
      const result = calculatePF(100000, 'full')
      expect(result.employeePF).toBe(12000)
    })
  })

  describe('employer PF calculation', () => {
    it('should calculate 12% of basic as employer PF in capped mode', () => {
      const result = calculatePF(50000, 'capped')
      expect(result.employerPF).toBe(1800)
    })

    it('should cap employer PF at 12% of 15000 in capped mode', () => {
      const result = calculatePF(200000, 'capped')
      expect(result.employerPF).toBe(1800)
    })

    it('should calculate 12% of basic as employer PF in full mode', () => {
      const result = calculatePF(50000, 'full')
      expect(result.employerPF).toBe(6000)
    })
  })

  describe('employer PF contribution', () => {
    it('should calculate 3.67% of basic with cap at 550 in capped mode for high basic', () => {
      const result = calculatePF(100000, 'capped')
      expect(result.employerPFContribution).toBe(550)
    })

    it('should calculate 3.67% of basic in full mode', () => {
      const result = calculatePF(50000, 'full')
      expect(result.employerPFContribution).toBe(Math.round(50000 * 0.0367))
    })
  })

  describe('employer EPS calculation', () => {
    it('should calculate 8.33% of basic with cap at 1250 in capped mode for high basic', () => {
      const result = calculatePF(100000, 'capped')
      expect(result.employerEPS).toBe(1250)
    })

    it('should calculate 8.33% of basic in full mode', () => {
      const result = calculatePF(50000, 'full')
      expect(result.employerEPS).toBe(Math.round(50000 * 0.0833))
    })
  })

  describe('with zero basic salary', () => {
    it('should return zero PF when basic is zero', () => {
      const result = calculatePF(0, 'capped')
      expect(result.employeePF).toBe(0)
      expect(result.employerPF).toBe(0)
      expect(result.employerPFContribution).toBe(0)
      expect(result.employerEPS).toBe(0)
    })
  })

  describe('with minimal basic salary', () => {
    it('should calculate PF correctly for minimum wage', () => {
      const result = calculatePF(15000, 'capped')
      expect(result.employeePF).toBe(1800)
      expect(result.employerPF).toBe(1800)
    })
  })

  describe('PF mode variations', () => {
    it('should default to capped mode when mode is not specified', () => {
      const result = calculatePF(50000)
      expect(result.employeePF).toBe(1800)
    })

    it('should give higher PF amounts in full mode for high salary', () => {
      const cappedResult = calculatePF(100000, 'capped')
      const fullResult = calculatePF(100000, 'full')
      expect(fullResult.employeePF).toBeGreaterThan(cappedResult.employeePF)
    })

    it('should give same PF amounts in both modes for basic below 15000', () => {
      const cappedResult = calculatePF(10000, 'capped')
      const fullResult = calculatePF(10000, 'full')
      expect(fullResult.employeePF).toBe(cappedResult.employeePF)
      expect(fullResult.employerPF).toBe(cappedResult.employerPF)
    })
  })

  describe('with invalid inputs', () => {
    it('should handle null basic salary', () => {
      const result = calculatePF(null, 'capped')
      expect(result.employeePF).toBe(0)
    })

    it('should handle undefined basic salary', () => {
      const result = calculatePF(undefined, 'capped')
      expect(result.employeePF).toBe(0)
    })

    it('should handle string input for basic', () => {
      const result = calculatePF('50000', 'capped')
      expect(result.employeePF).toBe(1800)
    })

    it('should handle negative basic salary', () => {
      const result = calculatePF(-50000, 'capped')
      expect(result.employeePF).toBe(-6000)
    })
  })

  describe('real-world scenarios', () => {
    it('should calculate PF for fresher with basic 25000', () => {
      const result = calculatePF(25000, 'capped')
      expect(result.employeePF).toBe(1800)
      expect(result.employerPF).toBe(1800)
    })

    it('should calculate PF for senior engineer with basic 80000 in full mode', () => {
      const result = calculatePF(80000, 'full')
      expect(result.employeePF).toBe(9600)
      expect(result.employerPF).toBe(9600)
    })

    it('should calculate correctly at exactly 15000 basic cap threshold', () => {
      const result = calculatePF(15000, 'capped')
      expect(result.employeePF).toBe(1800)
      
      const resultAboveCap = calculatePF(15001, 'capped')
      expect(resultAboveCap.employeePF).toBe(1800)
    })
  })
})

describe('VPF Calculator', () => {
  it('should return the VPF amount as-is', () => {
    expect(calculateVPF(5000)).toBe(5000)
  })

  it('should return zero when VPF is not provided', () => {
    expect(calculateVPF(null)).toBe(0)
    expect(calculateVPF(undefined)).toBe(0)
  })

  it('should handle string input', () => {
    expect(calculateVPF('10000')).toBe(10000)
  })

  it('should handle zero VPF', () => {
    expect(calculateVPF(0)).toBe(0)
  })

  it('should handle invalid input gracefully', () => {
    expect(calculateVPF('invalid')).toBe(0)
    expect(calculateVPF(NaN)).toBe(0)
  })
})