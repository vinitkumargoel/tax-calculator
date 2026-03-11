/**
 * Calculates Provident Fund (PF) contributions based on basic salary and PF mode
 * @param {number} basic - Basic salary amount
 * @param {'capped' | 'full'} pfMode - PF calculation mode: 'capped' (₹15,000 limit) or 'full' (no cap)
 * @returns {{ employeePF: number, employerPF: number, employerPFContribution: number, employerEPS: number }} PF calculation breakdown
 */
export const calculatePF = (basic, pfMode = 'capped') => {
  const basicNum = Number(basic) || 0
  
  if (pfMode === 'full') {
    const employeePF = basicNum * 0.12
    const employerPF = basicNum * 0.12
    const employerPFContribution = basicNum * 0.0367
    const employerEPS = basicNum * 0.0833
    
    return {
      employeePF: Math.round(employeePF),
      employerPF: Math.round(employerPF),
      employerPFContribution: Math.round(employerPFContribution),
      employerEPS: Math.round(employerEPS),
    }
  }
  
  const cappedBasic = Math.min(basicNum, 15000)
  const employeePF = cappedBasic * 0.12
  const employerPF = cappedBasic * 0.12
  const employerPFContribution = Math.min(basicNum * 0.0367, 550)
  const employerEPS = Math.min(basicNum * 0.0833, 1250)
  
  return {
    employeePF: Math.round(employeePF),
    employerPF: Math.round(employerPF),
    employerPFContribution: Math.round(employerPFContribution),
    employerEPS: Math.round(employerEPS),
  }
}

/**
 * Calculates Voluntary Provident Fund (VPF) contribution
 * @param {number} vpfAmount - VPF amount entered by user
 * @returns {number} VPF contribution amount
 */
export const calculateVPF = (vpfAmount) => {
  return Number(vpfAmount) || 0
}