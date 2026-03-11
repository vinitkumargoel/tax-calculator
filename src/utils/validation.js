const MAX_REASONABLE_CTC = 5000000
const MAX_REASONABLE_BASIC = 5000000
const MIN_BASIC = 0
const MAX_PERCENTAGE = 100

const validateNumber = (value, field, options = {}) => {
  const num = Number(value)
  const errors = []
  
  if (isNaN(num)) {
    errors.push(`${field} must be a valid number`)
    return { valid: false, errors, value: 0 }
  }
  
  if (options.min !== undefined && num < options.min) {
    errors.push(`${field} cannot be less than ${options.min}`)
  }
  
  if (options.max !== undefined && num > options.max) {
    errors.push(`${field} cannot exceed ${options.max}`)
  }
  
  if (options.integer && !Number.isInteger(num)) {
    errors.push(`${field} must be a whole number`)
  }
  
  return {
    valid: errors.length === 0,
    errors,
    value: num,
  }
}

const validateSalaryComponents = (earnings, exemptions, deductions) => {
  const errors = []
  const warnings = []
  
  const basic = Number(earnings.basic) || 0
  const hra = Number(earnings.hra) || 0
  const lta = Number(earnings.lta) || 0
  const bonus = Number(earnings.bonus) || 0
  const rentPaid = Number(exemptions.rentPaid) || 0
  
  if (basic < MIN_BASIC) {
    errors.push('Basic pay cannot be negative')
  }
  
  if (basic > MAX_REASONABLE_BASIC) {
    warnings.push('Basic pay seems unusually high. Please verify.')
  }
  
  if (hra < 0) {
    errors.push('HRA cannot be negative')
  }
  
  if (lta < 0) {
    errors.push('LTA cannot be negative')
  }
  
  if (bonus < 0) {
    errors.push('Bonus cannot be negative')
  }
  
  if (rentPaid < 0) {
    errors.push('Rent paid cannot be negative')
  }
  
  const totalEarnings = basic + hra + lta + bonus
  if (totalEarnings > MAX_REASONABLE_CTC) {
    warnings.push('Total earnings exceed ₹50L. Surcharge may apply.')
  }
  
  if (hra > basic * 0.6) {
    warnings.push('HRA exceeds 60% of Basic. Typical range is 40-50%.')
  }
  
  return { errors, warnings, valid: errors.length === 0 }
}

const validateSection80C = (section80C) => {
  const limit = 150000
  const total = [
    section80C?.pf || 0,
    section80C?.vpf || 0,
    section80C?.ppf || 0,
    section80C?.elss || 0,
    section80C?.nsc || 0,
    section80C?.lifeInsurance || 0,
    section80C?.homeLoanPrincipal || 0,
    section80C?.tuitionFee || 0,
    section80C?.sukanya || 0,
  ].reduce((a, b) => a + (Number(b) || 0), 0)
  
  const warnings = []
  if (total > limit) {
    warnings.push(`Total 80C investments (₹${total.toLocaleString('en-IN')}) exceed limit of ₹1.5L. Only ₹1.5L will be considered.`)
  }
  
  return { total, limit, exceeded: total > limit, warnings }
}

const validateSection80D = (section80D) => {
  const selfFamily = Number(section80D?.selfFamily) || 0
  const parents = Number(section80D?.parents) || 0
  const selfFamilyLimit = section80D?.selfFamilySenior ? 50000 : 25000
  const parentsLimit = section80D?.parentsSenior ? 50000 : 25000
  
  const warnings = []
  
  if (selfFamily > selfFamilyLimit) {
    warnings.push(`Self/Family premium exceeds limit of ₹${selfFamilyLimit}. Only ₹${selfFamilyLimit} will be considered.`)
  }
  
  if (parents > parentsLimit) {
    warnings.push(`Parents premium exceeds limit of ₹${parentsLimit}. Only ₹${parentsLimit} will be considered.`)
  }
  
  return { warnings }
}

const validateHomeLoan = (homeLoan) => {
  const annualInterest = Number(homeLoan?.annualInterest) || 0
  const propertyType = homeLoan?.propertyType
  
  const warnings = []
  
  if (annualInterest < 0) {
    warnings.push('Annual interest cannot be negative')
  }
  
  if (propertyType === 'self-occupied' && annualInterest > 200000) {
    warnings.push('Self-occupied home loan interest capped at ₹2L. Only ₹2L will be considered.')
  }
  
  return { warnings }
}

const validateProfile = (profile) => {
  const { earnings, deductions, exemptions } = profile || {}
  
  const salaryValidation = validateSalaryComponents(earnings || {}, exemptions || {}, deductions || {})
  const section80CValidation = validateSection80C(exemptions?.section80C)
  const section80DValidation = validateSection80D(exemptions?.section80D)
  const homeLoanValidation = validateHomeLoan(exemptions?.homeLoan)
  
  return {
    valid: salaryValidation.valid,
    errors: salaryValidation.errors,
    warnings: [
      ...salaryValidation.warnings,
      ...section80CValidation.warnings,
      ...section80DValidation.warnings,
      ...homeLoanValidation.warnings,
    ],
  }
}

export {
  validateNumber,
  validateSalaryComponents,
  validateSection80C,
  validateSection80D,
  validateHomeLoan,
  validateProfile,
  MAX_REASONABLE_CTC,
  MAX_REASONABLE_BASIC,
}
