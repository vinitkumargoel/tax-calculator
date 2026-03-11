export const PT_BY_STATE = {
  maharashtra: {
    name: 'Maharashtra',
    calculate: (monthlyGross) => {
      if (monthlyGross <= 10000) return 0
      const month = new Date().getMonth()
      return month === 1 ? 300 : 200
    },
    annualMax: 2500,
  },
  karnataka: {
    name: 'Karnataka',
    calculate: (monthlyGross) => {
      return monthlyGross > 15000 ? 200 : 0
    },
    annualMax: 2400,
  },
  westbengal: {
    name: 'West Bengal',
    calculate: (monthlyGross) => {
      if (monthlyGross <= 10000) return 0
      if (monthlyGross <= 15000) return 110
      if (monthlyGross <= 25000) return 130
      if (monthlyGross <= 40000) return 150
      return 200
    },
    annualMax: 2400,
  },
  tamilnadu: {
    name: 'Tamil Nadu',
    calculate: (monthlyGross) => {
      return monthlyGross > 21000 ? 208 : 0
    },
    annualMax: 2496,
  },
  andhrapradesh: {
    name: 'Andhra Pradesh',
    calculate: (monthlyGross) => {
      if (monthlyGross <= 15000) return 0
      if (monthlyGross <= 20000) return 150
      return 200
    },
    annualMax: 2400,
  },
  telangana: {
    name: 'Telangana',
    calculate: (monthlyGross) => {
      if (monthlyGross <= 15000) return 0
      if (monthlyGross <= 20000) return 150
      return 200
    },
    annualMax: 2400,
  },
  none: {
    name: 'Other / N/A',
    calculate: () => 0,
    annualMax: 0,
  },
}

export const STATE_OPTIONS = Object.keys(PT_BY_STATE)