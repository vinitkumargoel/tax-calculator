import { useMemo } from 'react'
import { calculatePF } from '../utils/pfCalculator.js'
import { calculateGratuity } from '../utils/gratuityCalculator.js'
import { calculateESI } from '../utils/esiCalculator.js'
import { calculateTax, calculateOldRegimeTax, calculateNewRegimeTax, calculateSeparatedTax } from '../utils/taxCalculator.js'
import { PT_BY_STATE } from '../constants/ptByState.js'

export const useSalaryCalculations = (profile) => {
  const earnings = profile?.earnings || {}
  const exemptions = profile?.exemptions || {}
  const pfMode = profile?.pfMode || 'capped'
  const state = profile?.state || 'none'
  
  const calculations = useMemo(() => {
    if (!profile) return null
    
    const basic = Number(earnings.basic) || 0
    const hra = Number(earnings.hra) || 0
    const da = Number(earnings.da) || 0
    const lta = Number(earnings.lta) || 0
    const specialAllowance = Number(earnings.specialAllowance) || 0
    const bonus = Number(earnings.bonus) || 0
    const medicalAllowance = Number(earnings.medicalAllowance) || 0
    const customEarnings = (earnings.custom || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
    const rsuAnnualValue = (earnings.rsu || []).reduce((sum, item) => {
      const units = Number(item.units) || 0
      const priceUsd = Number(item.priceUsd) || 0
      const exchangeRate = Number(item.exchangeRate) || 85
      return sum + (units * priceUsd * exchangeRate)
    }, 0)
    
    const monthlyGross = basic + hra + da + specialAllowance + medicalAllowance + (lta / 12) + customEarnings
    const annualGross = monthlyGross * 12 + bonus + rsuAnnualValue
    
    const pfResult = calculatePF(basic, pfMode)
    const employeePF = pfResult.employeePF
    const employerPF = pfResult.employerPF
    
    const vpf = Number(profile?.deductions?.vpf) || 0
    
    const esiResult = calculateESI(monthlyGross)
    const employeeESI = esiResult.applicable ? esiResult.employeeESI : 0
    const employerESI = esiResult.applicable ? esiResult.employerESI : 0
    
    const ptCalculator = PT_BY_STATE[state]?.calculate || (() => 0)
    const professionalTax = ptCalculator(monthlyGross)
    
    const gratuityResult = calculateGratuity(basic, da)
    const gratuityAnnual = gratuityResult.annualAccrual
    const gratuityMonthly = gratuityResult.monthlyAccrual
    
    const npsEmployee = Number(profile?.deductions?.npsEmployee) || 0
    
    const customDeductions = (profile?.deductions?.custom || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
    
    const taxResult = calculateSeparatedTax(profile, monthlyGross, bonus, rsuAnnualValue)
    
    const monthlyTDS = taxResult.regularMonthlyTDS
    
    const monthlyDeductions = employeePF + employeeESI + professionalTax + monthlyTDS + npsEmployee + vpf + customDeductions
    
    const monthlyNetInHand = monthlyGross - monthlyDeductions
    const annualNetInHand = (monthlyNetInHand * 12) + bonus - taxResult.bonusTax + rsuAnnualValue - taxResult.rsuTax
    
    const employerNPS = Number(profile?.deductions?.npsEmployer) || 0
    const groupInsurance = Number(earnings.groupInsurance) || 0
    
    const annualCTC = annualGross + (employerPF * 12) + gratuityAnnual + (employerNPS * 12) + (employerESI * 12) + (groupInsurance * 12)
    
    const oldRegimeTax = calculateOldRegimeTax(profile, monthlyGross, bonus)
    const newRegimeTax = calculateNewRegimeTax(profile, monthlyGross, bonus)
    
    return {
      monthlyGross,
      annualGross,
      monthlyNetInHand,
      annualNetInHand,
      annualCTC,
      employeePF,
      employerPF,
      employeeESI,
      employerESI,
      professionalTax,
      vpf,
      gratuityAnnual,
      gratuityMonthly,
      npsEmployee,
      customDeductions,
      monthlyTDS,
      bonusAmount: taxResult.bonusAmount,
      bonusTax: taxResult.bonusTax,
      rsuAmount: taxResult.rsuAmount,
      rsuTax: taxResult.rsuTax,
      oneTimeIncome: taxResult.oneTimeIncome,
      oneTimeTax: taxResult.oneTimeTax,
      totalTax: taxResult.totalTax,
      totalTaxWithOneTime: taxResult.totalTaxWithOneTime,
      marginalRate: taxResult.marginalRate,
      effectiveTaxRate: annualGross > 0 ? (taxResult.totalTaxWithOneTime / annualGross) * 100 : 0,
      takeHomePercent: annualCTC > 0 ? (annualNetInHand / annualCTC) * 100 : 0,
      employerNPS,
      groupInsurance: earnings.groupInsurance || 0,
      rsuAnnualValue,
      taxResult,
      oldRegimeTax,
      newRegimeTax,
      betterRegime: oldRegimeTax.totalTax < newRegimeTax.totalTax ? 'old' : 'new',
      savingWithBetterRegime: Math.abs(oldRegimeTax.totalTax - newRegimeTax.totalTax),
    }
  }, [
    profile,
    earnings.basic,
    earnings.hra,
    earnings.da,
    earnings.lta,
    earnings.specialAllowance,
    earnings.bonus,
    earnings.medicalAllowance,
    earnings.custom,
    earnings.groupInsurance,
    earnings.rsu,
    exemptions,
    pfMode,
    state,
    profile?.deductions?.vpf,
    profile?.deductions?.npsEmployee,
    profile?.deductions?.npsEmployer,
    profile?.deductions?.custom,
  ])
  
  return calculations
}