import {
  OLD_REGIME_SLABS,
  NEW_REGIME_SLABS,
  OLD_REGIME_STANDARD_DEDUCTION,
  NEW_REGIME_STANDARD_DEDUCTION,
  OLD_REGIME_REBATE_THRESHOLD,
  NEW_REGIME_REBATE_THRESHOLD,
  OLD_REGIME_REBATE_MAX,
  NEW_REGIME_REBATE_MAX,
  CESS_RATE,
} from '../constants/taxSlabs.js'
import { calculateHRAExemption } from './hraExemption.js'
import { SURCHARGE_THRESHOLD } from '../constants/surchargeSlabs.js'

const calculateTaxFromSlabs = (taxableIncome, slabs) => {
  let tax = 0
  let remainingIncome = taxableIncome
  
  for (const slab of slabs) {
    if (remainingIncome <= 0) break
    
    const slabWidth = slab.max - slab.min + 1
    const taxableInSlab = Math.min(remainingIncome, slabWidth > 0 ? slabWidth : Infinity)
    
    if (taxableIncome > slab.min) {
      const amountInSlab = Math.min(taxableIncome, slab.max) - slab.min
      if (amountInSlab > 0 && slab.rate > 0) {
        tax += amountInSlab * slab.rate
      }
    }
  }
  
  return Math.round(tax)
}

const calculateTaxFromSlabsCorrect = (taxableIncome, slabs) => {
  let tax = 0
  
  for (const slab of slabs) {
    if (taxableIncome <= slab.min) break
    
    const upperLimit = slab.max === Infinity ? taxableIncome : Math.min(slab.max, taxableIncome)
    const amountInSlab = upperLimit - slab.min + 1
    
    if (amountInSlab > 0) {
      tax += Math.max(0, amountInSlab) * slab.rate
    }
  }
  
  const prevSlabEnd = slabs.findIndex(s => taxableIncome < s.min) - 1
  
  return Math.round(tax)
}

const calculateTaxFromSlabsFinal = (taxableIncome, slabs) => {
  let tax = 0
  
  for (const slab of slabs) {
    if (taxableIncome <= slab.min) continue
    
    const upper = slab.max === Infinity ? taxableIncome : Math.min(slab.max, taxableIncome)
    const taxableAmount = upper - slab.min
    
    if (taxableAmount > 0) {
      tax += taxableAmount * slab.rate
    }
  }
  
  return Math.round(tax)
}

export const calculateTax = (profile, monthlyGross, annualBonus) => {
  const regime = profile.taxRegime || 'new'
  const annualGross = monthlyGross * 12 + (Number(annualBonus) || 0)
  
  const isOldRegime = regime === 'old'
  const standardDeduction = isOldRegime ? OLD_REGIME_STANDARD_DEDUCTION : NEW_REGIME_STANDARD_DEDUCTION
  
  const result = {
    regime,
    annualGross,
    standardDeduction,
    deductions: {},
    taxableIncome: 0,
    taxBeforeCess: 0,
    cess: 0,
    rebate: 0,
    totalTax: 0,
    monthlyTDS: 0,
    hraExemptionDetails: null,
    section80CUsed: 0,
    surchargeWarning: annualGross > SURCHARGE_THRESHOLD,
  }
  
  let taxableIncome = annualGross - standardDeduction
  
  if (isOldRegime) {
    const exemptions = profile.exemptions || {}
    const earnings = profile.earnings || {}
    
    const hraExemption = calculateHRAExemption(
      earnings.hra || 0,
      earnings.basic || 0,
      exemptions.rentPaid || 0,
      profile.cityType || 'metro'
    )
    result.hraExemptionDetails = hraExemption
    result.deductions.hraExemption = hraExemption.exemption
    taxableIncome -= hraExemption.exemption
    
    result.deductions.ltaExemption = Number(exemptions.ltaExemption) || 0
    taxableIncome -= result.deductions.ltaExemption
    
    const section80C = exemptions.section80C || {}
    const eightyCTotal = [
      section80C.pf || 0,
      section80C.vpf || 0,
      section80C.ppf || 0,
      section80C.elss || 0,
      section80C.nsc || 0,
      section80C.lifeInsurance || 0,
      section80C.homeLoanPrincipal || 0,
      section80C.tuitionFee || 0,
      section80C.sukanya || 0,
    ].reduce((a, b) => a + (Number(b) || 0), 0)
    
    result.section80CUsed = Math.min(eightyCTotal, 150000)
    result.deductions.section80C = result.section80CUsed
    taxableIncome -= result.section80CUsed
    
    const section80D = exemptions.section80D || {}
    const selfFamilyLimit = section80D.selfFamilySenior ? 50000 : 25000
    const parentsLimit = section80D.parentsSenior ? 50000 : 25000
    
    result.deductions.section80D = Math.min(Number(section80D.selfFamily) || 0, selfFamilyLimit) +
                                     Math.min(Number(section80D.parents) || 0, parentsLimit)
    taxableIncome -= result.deductions.section80D
    
    result.deductions.nps80CCD1B = Math.min(Number(exemptions.nps80CCD1B) || 0, 50000)
    taxableIncome -= result.deductions.nps80CCD1B
    
    const homeLoan = exemptions.homeLoan || {}
    const homeLoanDeduction = homeLoan.propertyType === 'let-out' 
      ? (Number(homeLoan.annualInterest) || 0)
      : Math.min(Number(homeLoan.annualInterest) || 0, 200000)
    result.deductions.homeLoanInterest = homeLoanDeduction
    taxableIncome -= homeLoanDeduction
    
    result.deductions.total = result.deductions.hraExemption + 
                               result.deductions.ltaExemption +
                               result.deductions.section80C +
                               result.deductions.section80D +
                               result.deductions.nps80CCD1B +
                               result.deductions.homeLoanInterest
  } else {
    result.deductions.total = 0
  }
  
  taxableIncome = Math.max(0, taxableIncome)
  result.taxableIncome = Math.round(taxableIncome)
  
  const slabs = isOldRegime ? OLD_REGIME_SLABS : NEW_REGIME_SLABS
  let tax = calculateTaxFromSlabsFinal(taxableIncome, slabs)
  
  const rebateThreshold = isOldRegime ? OLD_REGIME_REBATE_THRESHOLD : NEW_REGIME_REBATE_THRESHOLD
  const rebateMax = isOldRegime ? OLD_REGIME_REBATE_MAX : NEW_REGIME_REBATE_MAX
  
  if (taxableIncome <= rebateThreshold) {
    result.rebate = Math.min(tax, rebateMax)
    tax = Math.max(0, tax - result.rebate)
  }
  
  result.taxBeforeCess = tax
  result.cess = Math.round(tax * CESS_RATE)
  result.totalTax = tax + result.cess
  result.monthlyTDS = Math.round(result.totalTax / 12)
  
  return result
}

export const calculateOldRegimeTax = (profile, monthlyGross, annualBonus) => {
  return calculateTax({ ...profile, taxRegime: 'old' }, monthlyGross, annualBonus)
}

export const calculateNewRegimeTax = (profile, monthlyGross, annualBonus) => {
  return calculateTax({ ...profile, taxRegime: 'new' }, monthlyGross, annualBonus)
}