/**
 * Calculates Employee State Insurance (ESI) contributions
 * Applicable if monthly gross ≤ ₹21,000
 * Employee: 0.75%, Employer: 3.25%
 * @param {number} monthlyGross - Monthly gross salary
 * @returns {{ applicable: boolean, employeeESI: number, employerESI: number }} ESI calculation result
 */
export const calculateESI = (monthlyGross) => {
  const gross = Number(monthlyGross) || 0
  
  if (gross > 21000) {
    return {
      applicable: false,
      employeeESI: 0,
      employerESI: 0,
    }
  }
  
  return {
    applicable: true,
    employeeESI: Math.round(gross * 0.0075),
    employerESI: Math.round(gross * 0.0325),
  }
}