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