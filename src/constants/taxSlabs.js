export const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 0.05 },
  { min: 500001, max: 1000000, rate: 0.20 },
  { min: 1000001, max: Infinity, rate: 0.30 },
]

export const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 700000, rate: 0.05 },
  { min: 700001, max: 1000000, rate: 0.10 },
  { min: 1000001, max: 1200000, rate: 0.15 },
  { min: 1200001, max: 1500000, rate: 0.20 },
  { min: 1500001, max: Infinity, rate: 0.30 },
]

export const OLD_REGIME_STANDARD_DEDUCTION = 50000
export const NEW_REGIME_STANDARD_DEDUCTION = 75000

export const OLD_REGIME_REBATE_THRESHOLD = 500000
export const NEW_REGIME_REBATE_THRESHOLD = 700000
export const OLD_REGIME_REBATE_MAX = 12500
export const NEW_REGIME_REBATE_MAX = 25000

export const CESS_RATE = 0.04