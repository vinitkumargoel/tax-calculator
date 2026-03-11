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
import { SURCHARGE_SLABS, SURCHARGE_SLABS_NEW_REGIME, SURCHARGE_THRESHOLD } from '../constants/surchargeSlabs.js'

/**
 * Calculates progressive income tax from slab table.
 * Slab boundaries are contiguous: min of each slab equals max of previous slab.
 * taxableAmount = min(income, slab.max) - slab.min for each slab where income > slab.min
 */
const calculateTaxFromSlabs = (taxableIncome, slabs) => {
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

/**
 * Calculates applicable surcharge rate for a given income.
 * Surcharge is levied on the base income tax (not on income).
 */
const getSurchargeRate = (taxableIncome, surchargeSlabs) => {
  for (let i = surchargeSlabs.length - 1; i >= 0; i--) {
    if (taxableIncome > surchargeSlabs[i].min) {
      return surchargeSlabs[i].rate
    }
  }
  return 0
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
    surcharge: 0,
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

    const customExemptions = (exemptions.custom || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
    result.deductions.customExemptions = customExemptions
    taxableIncome -= customExemptions

    result.deductions.total = result.deductions.hraExemption +
                               result.deductions.ltaExemption +
                               result.deductions.section80C +
                               result.deductions.section80D +
                               result.deductions.nps80CCD1B +
                               result.deductions.homeLoanInterest +
                               result.deductions.customExemptions
  } else {
    result.deductions.total = 0
  }

  taxableIncome = Math.max(0, taxableIncome)
  result.taxableIncome = Math.round(taxableIncome)

  const slabs = isOldRegime ? OLD_REGIME_SLABS : NEW_REGIME_SLABS
  let tax = calculateTaxFromSlabs(taxableIncome, slabs)

  const rebateThreshold = isOldRegime ? OLD_REGIME_REBATE_THRESHOLD : NEW_REGIME_REBATE_THRESHOLD
  const rebateMax = isOldRegime ? OLD_REGIME_REBATE_MAX : NEW_REGIME_REBATE_MAX

  if (taxableIncome <= rebateThreshold) {
    result.rebate = Math.min(tax, rebateMax)
    tax = Math.max(0, tax - result.rebate)
  }

  result.taxBeforeCess = tax

  // Apply surcharge if income exceeds ₹50L
  const surchargeSlabs = isOldRegime ? SURCHARGE_SLABS : SURCHARGE_SLABS_NEW_REGIME
  const surchargeRate = getSurchargeRate(taxableIncome, surchargeSlabs)
  result.surcharge = Math.round(tax * surchargeRate)

  const taxWithSurcharge = tax + result.surcharge
  result.cess = Math.round(taxWithSurcharge * CESS_RATE)
  result.totalTax = taxWithSurcharge + result.cess
  result.monthlyTDS = Math.round(result.totalTax / 12)

  return result
}

export const calculateOldRegimeTax = (profile, monthlyGross, annualBonus) => {
  return calculateTax({ ...profile, taxRegime: 'old' }, monthlyGross, annualBonus)
}

export const calculateNewRegimeTax = (profile, monthlyGross, annualBonus) => {
  return calculateTax({ ...profile, taxRegime: 'new' }, monthlyGross, annualBonus)
}

const getMarginalRate = (taxableIncome, slabs) => {
  for (let i = slabs.length - 1; i >= 0; i--) {
    if (taxableIncome > slabs[i].min) {
      return slabs[i].rate
    }
  }
  return 0
}

export const calculateSeparatedTax = (profile, monthlyGross, annualBonus, annualRSU) => {
  const regime = profile.taxRegime || 'new'
  const regularAnnualIncome = monthlyGross * 12
  const bonusAmount = Number(annualBonus) || 0
  const rsuAmount = Number(annualRSU) || 0
  const oneTimeIncome = bonusAmount + rsuAmount
  const totalAnnualGross = regularAnnualIncome + bonusAmount + rsuAmount

  // Tax on regular income only (used for monthly TDS)
  const regularResult = calculateTax(profile, monthlyGross, 0)

  const isOldRegime = regime === 'old'
  const slabs = isOldRegime ? OLD_REGIME_SLABS : NEW_REGIME_SLABS

  // Calculate one-time income tax by stacking on top of regular taxable income.
  // This correctly handles the case where bonus/RSU pushes income into a higher slab.
  const regularTaxableIncome = regularResult.taxableIncome

  // Tax on (regular + all one-time income) combined, then subtract regular tax
  const totalTaxableIncome = regularTaxableIncome + oneTimeIncome
  const combinedTax = calculateTaxFromSlabs(totalTaxableIncome, slabs)
  const regularTaxBeforeRebate = calculateTaxFromSlabs(regularTaxableIncome, slabs)

  // Marginal rate for display purposes
  const marginalRate = getMarginalRate(totalTaxableIncome, slabs)

  // One-time income tax = combined tax minus regular tax (before rebate, since one-time income
  // always pushes above rebate threshold at typical salary levels)
  const oneTimeTaxBeforeCess = Math.max(0, combinedTax - regularTaxBeforeRebate)

  // Apply surcharge to one-time portion if applicable
  const surchargeSlabs = isOldRegime ? SURCHARGE_SLABS : SURCHARGE_SLABS_NEW_REGIME
  const combinedSurchargeRate = getSurchargeRate(totalTaxableIncome, surchargeSlabs)
  const regularSurchargeRate = getSurchargeRate(regularTaxableIncome, surchargeSlabs)

  const combinedSurcharge = Math.round(combinedTax * combinedSurchargeRate)
  const regularSurchargeOnCombined = Math.round(regularTaxBeforeRebate * regularSurchargeRate)
  const oneTimeSurcharge = Math.max(0, combinedSurcharge - regularSurchargeOnCombined)

  const oneTimeTaxWithSurcharge = oneTimeTaxBeforeCess + oneTimeSurcharge
  const oneTimeCess = Math.round(oneTimeTaxWithSurcharge * CESS_RATE)
  const oneTimeTotalTax = oneTimeTaxWithSurcharge + oneTimeCess

  // Split between bonus and RSU proportionally if both are present
  let bonusTotalTax = 0
  let rsuTotalTax = 0
  if (oneTimeIncome > 0) {
    bonusTotalTax = bonusAmount > 0 ? Math.round(oneTimeTotalTax * bonusAmount / oneTimeIncome) : 0
    rsuTotalTax = rsuAmount > 0 ? oneTimeTotalTax - bonusTotalTax : 0
  }

  const totalTaxWithOneTime = regularResult.totalTax + oneTimeTotalTax

  return {
    ...regularResult,
    annualGross: totalAnnualGross,
    regularAnnualIncome,
    regularMonthlyTDS: regularResult.monthlyTDS,
    bonusAmount,
    bonusTax: bonusTotalTax,
    rsuAmount,
    rsuTax: rsuTotalTax,
    oneTimeIncome,
    oneTimeTax: oneTimeTotalTax,
    totalTaxWithOneTime,
    marginalRate: marginalRate * 100,
    surchargeWarning: totalAnnualGross > SURCHARGE_THRESHOLD,
  }
}
