/**
 * Calculates annual and monthly gratuity accrual
 * Formula: (Basic + DA) × 15 ÷ 26
 * @param {number} basic - Basic salary amount
 * @param {number} da - Dearness allowance amount
 * @returns {{ annualAccrual: number, monthlyAccrual: number }} Gratuity calculation breakdown
 */
export const calculateGratuity = (basic, da) => {
  const basicNum = Number(basic) || 0
  const daNum = Number(da) || 0
  
  const annualAccrual = ((basicNum + daNum) * 15) / 26
  const monthlyAccrual = annualAccrual / 12
  
  return {
    annualAccrual: Math.round(annualAccrual),
    monthlyAccrual: Math.round(monthlyAccrual),
  }
}