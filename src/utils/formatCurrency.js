/**
 * Formats a number as Indian currency
 * @param {number} amount - Amount to format
 * @param {boolean} compact - Whether to use short format (₹X.XL, ₹X.XCr)
 * @returns {string} Formatted currency string
 */
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

/**
 * Formats currency in short format (₹X.XL, ₹X.XCr)
 * @param {number} amount - Amount to format
 * @returns {string} Short formatted currency string
 */
export const formatCurrencyShort = (amount) => {
  return formatCurrency(amount, true)
}

/**
 * Parses currency input string to number
 * @param {string|number} value - Input value to parse
 * @returns {number} Parsed numeric value
 */
export const parseCurrencyInput = (value) => {
  if (typeof value === 'number') return value
  if (!value) return 0
  const cleaned = value.toString().replace(/[^\d.-]/g, '')
  return Number(cleaned) || 0
}

/**
 * Formats a number as percentage
 * @param {number} value - Value to format as percentage
 * @returns {string} Formatted percentage string
 */
export const formatPercent = (value) => {
  const num = Number(value) || 0
  return `${num.toFixed(1)}%`
}