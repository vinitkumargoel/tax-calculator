# Agent Guidelines for Indian Tax Calculator

This document provides guidelines for AI agents working on this codebase.

## Project Overview

Indian Tax Calculator is a React-based salary and tax calculation tool for FY 2026-27 (AY 2027-28). It helps users compare old and new tax regimes, calculate in-hand salary, and understand deductions.

## Tech Stack

- **Framework:** React 19 with Vite 6
- **Styling:** Tailwind CSS 3.4
- **State Management:** React Context + useReducer
- **Charts:** Recharts 3.8
- **Testing:** Vitest 4.0
- **Icons:** Lucide React

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/           # React components
│   ├── Charts/           # Data visualization (BreakdownDonut, ComponentsBar, Section80CBar)
│   ├── InputPanel/       # User input forms (EarningsForm, DeductionsForm, ExemptionsForm)
│   ├── PayslipPreview/    # Print preview component
│   ├── RegimeComparison/  # Tax regime comparison table
│   ├── shared/           # Reusable UI components (Accordion, Card, Input, etc.)
│   ├── Sidebar/          # Navigation and settings modal
│   └── SummaryCards/     # Summary display cards
├── constants/            # Static configuration
│   ├── ptByState.js      # Professional Tax slabs by state
│   ├── surchargeSlabs.js # Surcharge rates
│   └── taxSlabs.js       # Tax slab definitions (OLD_REGIME_SLABS, NEW_REGIME_SLABS)
├── context/              # React Context
│   └── ProfileContext.jsx # Global state management
├── hooks/                # Custom React hooks
│   ├── useLocalStorage.js
│   └── useSalaryCalculations.js
├── utils/                # Calculation utilities
│   ├── esiCalculator.js  # ESI calculation
│   ├── formatCurrency.js # Currency formatting
│   ├── gratuityCalculator.js # Gratuity calculation
│   ├── hraExemption.js   # HRA exemption (3-condition)
│   ├── pfCalculator.js   # PF calculation
│   ├── taxCalculator.js  # Main tax calculation engine
│   └── validation.js     # Input validation
└── __tests__/            # Unit tests
```

## Key Files to Know

### Tax Calculations (`src/utils/taxCalculator.js`)
- Main tax calculation logic
- Handles both old and new regimes
- Apply `npm test` after any changes

### Tax Slabs (`src/constants/taxSlabs.js`)
- **New Regime (FY 2026-27):**
  - Basic exemption: ₹4,00,000
  - Standard deduction: ₹75,000
  - Section 87A rebate: Up to ₹60,000 (tax-free up to ₹12L)
  - Slabs: 0%, 5%, 10%, 15%, 20%, 25%, 30%

- **Old Regime:**
  - Basic exemption: ₹2,50,000
  - Standard deduction: ₹50,000
  - Section 87A rebate: Up to ₹12,500 (tax-free up to ₹5L)
  - Slabs: 0%, 5%, 20%, 30%

### State Management (`src/context/ProfileContext.jsx`)
- Uses `useReducer` with localStorage persistence
- Storage key: `salary_profiles`
- Debounced save (500ms) to prevent excessive writes

## Code Style Guidelines

1. **No comments** - Code should be self-documenting
2. **Functional components** - Use React functional components with hooks
3. **Tailwind CSS** - Use utility classes for styling
4. **Indian number formatting** - Use `en-IN` locale for currency
5. **Component organization:** Small, focused components

## Making Changes

### When updating tax calculations:
1. Update `src/constants/taxSlabs.js` if slabs change
2. Update `src/utils/taxCalculator.js` for calculation logic
3. Update corresponding test files in `src/__tests__/`
4. Run `npm test` to verify all tests pass

### When updating UI components:
1. Check for existing patterns in `src/components/shared/`
2. Use Tailwind classes for styling
3. Ensure responsive design works on mobile

### When adding new features:
1. Follow existing file structure
2. Add unit tests for utility functions
3. Update documentation if needed

## Testing

- Run tests before committing: `npm test`
- All 246 tests should pass
- Test files mirror `src/` structure in `src/__tests__/`

## Common Tasks

### Update Tax Slabs for New Financial Year
1. Modify `src/constants/taxSlabs.js`
2. Update rebate thresholds and standard deductions
3. Update tests in `src/__tests__/taxCalculator.test.js`
4. Update documentation (README.md, CHANGELOG.md)
5. Update `index.html` SEO meta tags

### Add New Deduction/Exemption
1. Add to profile schema in `ProfileContext.jsx`
2. Add input field in relevant form component
3. Update calculation in `useSalaryCalculations.js`
4. Add tests for calculation

### Fix localStorage Issues
- Storage key: `salary_profiles`
- Check `ProfileContext.jsx` for save/load logic
- Verify debounce timer is properly cleared

## Financial Year Context

Current implementation is for **FY 2026-27 (AY 2027-28)**. When updating for new financial years:

- Update tax slab constants
- Update rebate limits
- Update standard deduction amounts
- Add surcharge slab changes
- Update all references in documentation

## Related Documentation

- `README.md` - Project overview and setup
- `CONTRIBUTING.md` - Contribution guidelines
- `CHANGELOG.md` - Version history
- `SECURITY.md` - Security policy