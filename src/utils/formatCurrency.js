export const formatCurrency = (amount, compact = false) => {
  const num = Number(amount) || 0
  
  if (compact) {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)}Cr`
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)}L`
    }
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export const formatCurrencyShort = (amount) => {
  return formatCurrency(amount, true)
}

export const parseCurrencyInput = (value) => {
  if (typeof value === 'number') return value
  if (!value) return 0
  const cleaned = value.toString().replace(/[^\d.-]/g, '')
  return Number(cleaned) || 0
}

export const formatPercent = (value) => {
  const num = Number(value) || 0
  return `${num.toFixed(1)}%`
}