export const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 0.05 },
  { min: 500001, max: 1000000, rate: 0.20 },
  { min: 1000001, max: Infinity, rate: 0.30 },
]

export const NEW_REGIME_SLABS = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400001, max: 800000, rate: 0.05 },
  { min: 800001, max: 1200000, rate: 0.10 },
  { min: 1200001, max: 1600000, rate: 0.15 },
  { min: 1600001, max: 2000000, rate: 0.20 },
  { min: 2000001, max: 2400000, rate: 0.25 },
  { min: 2400001, max: Infinity, rate: 0.30 },
]

export const OLD_REGIME_STANDARD_DEDUCTION = 50000
export const NEW_REGIME_STANDARD_DEDUCTION = 75000

export const OLD_REGIME_REBATE_THRESHOLD = 500000
export const NEW_REGIME_REBATE_THRESHOLD = 1200000
export const OLD_REGIME_REBATE_MAX = 12500
export const NEW_REGIME_REBATE_MAX = 60000

export const CESS_RATE = 0.04