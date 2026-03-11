export const SURCHARGE_SLABS = [
  { min: 5000000, max: 10000000, rate: 0.10 },
  { min: 10000001, max: 20000000, rate: 0.15 },
  { min: 20000001, max: 50000000, rate: 0.25 },
  { min: 50000001, max: Infinity, rate: 0.37 },
]

export const SURCHARGE_SLABS_NEW_REGIME = [
  { min: 5000000, max: 10000000, rate: 0.10 },
  { min: 10000001, max: 20000000, rate: 0.15 },
  { min: 20000001, max: 50000000, rate: 0.25 },
  { min: 50000001, max: Infinity, rate: 0.25 },
]

export const SURCHARGE_THRESHOLD = 5000000