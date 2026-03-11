export const calculateHRAExemption = (hra, basic, rentPaid, cityType = 'metro') => {
  const hraAnnual = (Number(hra) || 0) * 12
  const basicAnnual = (Number(basic) || 0) * 12
  const rentAnnual = (Number(rentPaid) || 0) * 12
  
  const conditionA = hraAnnual
  const conditionB = cityType === 'metro' ? basicAnnual * 0.5 : basicAnnual * 0.4
  const conditionC = Math.max(0, rentAnnual - basicAnnual * 0.1)
  
  const exemption = Math.min(conditionA, conditionB, conditionC)
  
  return {
    exemption: Math.round(exemption),
    conditionA,
    conditionB,
    conditionC,
  }
}