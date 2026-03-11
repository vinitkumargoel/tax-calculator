# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-12

### Added
- Initial open source release
- Multi-profile salary management
- Old and New tax regime calculations (FY 2025-26 / AY 2026-27)
- HRA exemption calculation (metro/non-metro support)
- Section 80C deduction tracking (₹1.5L limit)
- Section 80D medical insurance deductions
- Section 80CCD(1B) NPS additional deduction
- Section 24 home loan interest deduction
- Professional Tax calculation with state-wise slabs
- Employer PF and NPS contributions
- Gratuity calculation
- ESI auto-calculation for eligible employees
- Surcharge warning for high-income earners
- Interactive donut chart for earnings breakdown
- Bar chart for monthly component comparison
- 80C utilization progress bar
- Regime comparison with recommendation
- Payslip/print preview functionality
- LocalStorage-based data persistence
- Responsive design for mobile and desktop
- Unit tests for calculation utilities

### Tax Features
- Old Regime tax slabs (FY 2025-26)
  - Basic exemption: ₹2.5L
  - Standard deduction: ₹50,000
  - Section 87A rebate: ₹12,500 (up to ₹5L tax-free)
- New Regime tax slabs (FY 2025-26)
  - Basic exemption: ₹4L
  - Standard deduction: ₹75,000
  - Section 87A rebate: ₹60,000 (up to ₹12L tax-free)
  - New 25% slab for ₹20L-₹24L income
- 4% Health & Education Cess
- Surcharge rates (10%/15%/25%/37% old, capped at 25% new)
- State-wise Professional Tax slabs:
  - Maharashtra
  - Karnataka
  - West Bengal
  - Tamil Nadu
  - Andhra Pradesh
  - Delhi-NCR

---

## Future Roadmap

- [ ] Surcharge calculation for income > ₹50L
- [ ] Capital gains tax calculator
- [ ] Export to PDF
- [ ] Salary comparison across multiple offers
- [ ] Tax-saving investment suggestions
- [ ] Dark mode
- [ ] Multiple financial year support

---

<!-- 
Template for future releases:

## [x.x.x] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing features

### Deprecated
- Features to be removed in future

### Removed
- Features removed in this release

### Fixed
- Bug fixes

### Security
- Security improvements
-->