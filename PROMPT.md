# 💼 Indian Salary Dashboard — Product Requirements Document
> Version 2.0 — Corrected formulas, PF edge cases, full tax pipeline, surcharge notes

---

## Overview

A **no-login, no-backend** Indian salary calculator dashboard built with **React + Vite**.
All data is stored locally in the browser using `localStorage`.
Users can create and manage **multiple salary profiles**, each with full Indian salary
structure breakdowns and fully accurate dynamic calculations.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| State Management | React Context + useReducer |
| Storage | localStorage (no backend) |
| Charts | Recharts |
| Icons | Lucide React |

---

## Core Features

### 1. Multi-Profile Management
- Create unlimited named salary profiles (e.g., "Current Job", "New Offer", "Freelance")
- Switch between profiles from a sidebar or tab-based navigation
- Each profile stores independently in localStorage
- Rename, duplicate, or delete profiles
- Profile cards show a summary (CTC, In-hand, Tax) at a glance

---

### 2. Salary Input Panel
Users enter their salary components. All fields are editable:

#### Earnings (Monthly unless noted)

| Field | Input Type | Notes |
|---|---|---|
| Basic Pay | Manual | Usually 40–50% of CTC |
| HRA | Manual or Auto | Auto = 50% of Basic (metro) / 40% (non-metro) |
| DA (Dearness Allowance) | Manual | Mostly govt; private = 0 |
| LTA (Leave Travel Allowance) | Annual, manual | Entered as annual; divided by 12 for monthly gross |
| Special Allowance | Manual | Monthly |
| Bonus / Performance Pay | Annual, manual | Entered as annual lump sum; added directly to Annual Gross only |
| Medical Allowance | Manual | Monthly |
| Other Allowances | Custom label + amount | Monthly, repeatable |

> ⚠️ **Bonus is annual** — it is added once to Annual Gross, not spread across monthly gross.

#### Deductions (Monthly)

| Field | Input Type | Notes |
|---|---|---|
| PF (Employee) | Auto or Manual | See PF Logic section |
| ESI | Auto | See ESI Logic section |
| Professional Tax | Auto (state slab) | See PT section |
| TDS / Income Tax | Auto | Annual Tax ÷ 12; shown as monthly instalment |
| Gratuity | Auto (employer cost) | NOT deducted from in-hand; shown in CTC only |
| NPS (Employee) | Manual optional | 80CCD(1B) deduction up to ₹50,000 |
| Custom Deductions | Custom label + amount | Monthly, repeatable |

---

### 3. Calculation Engine — Corrected Formulas

#### 3.1 Gross Salary

```
Monthly Gross =
  Basic
  + HRA
  + DA
  + Special Allowance
  + Medical Allowance
  + (LTA ÷ 12)            ← LTA is annual; spread monthly
  + Custom Monthly Allowances

Annual Gross =
  (Monthly Gross × 12)
  + Annual Bonus            ← Bonus added once at annual level only
```

> Bonus is **not** divided by 12 for monthly gross. It is a one-time annual addition.

---

#### 3.2 CTC (Cost to Company) — Corrected

```
Annual CTC =
  Annual Gross
  + Annual Employer PF Contribution
  + Annual Gratuity Accrual
  + Annual Employer NPS (if applicable)
  + Annual Group Insurance Premium (if entered)
```

> Gratuity and Employer PF are **employer costs added to CTC** — they are NOT deducted
> from the employee's monthly take-home.

**❌ Old (incorrect) formula was:** `(Gross + Employer PF + Gratuity) × 12`
**✅ Correct:** Each component is calculated annually, then summed.

---

#### 3.3 PF (Provident Fund) Logic

User selects PF mode via toggle:

**Mode A — Full Basic (No Cap)**
```
Employee PF  = 12% of Basic
Employer PF  = 12% of Basic
  └── Split: 3.67% → PF account
              8.33% → EPS (Employee Pension Scheme)
```

**Mode B — Capped at ₹15,000 Basic (Statutory default)**
```
Employee PF  = min(12% × Basic, ₹1,800)
Employer PF  = min(12% × Basic, ₹1,800)
  └── Split: 3.67% → PF account  (max ₹550)
              8.33% → EPS         (max ₹1,250)
```

> **UI toggle:** `PF Basis: Full Basic | Capped at ₹15,000`
> Default = Capped (statutory). Override available for employers contributing on full basic.

**VPF (Voluntary PF):** Optional additional employee contribution field (reduces taxable income under 80C).

---

#### 3.4 ESI (Employee State Insurance)

```
Applicable if: Monthly Gross ≤ ₹21,000

Employee ESI  = 0.75% of Gross
Employer ESI  = 3.25% of Gross  ← employer cost, part of CTC if toggled on
```

> ⚠️ **Approximation (display notice in UI):** Once enrolled, ESI continues until
> the end of the contribution wage period even if salary crosses ₹21,000 mid-year.
> This calculator uses simplified rule: ESI applies only when current monthly gross ≤ ₹21,000.

---

#### 3.5 Gratuity — Corrected Formula

```
Annual Gratuity Accrual  = (Basic + DA) × 15 ÷ 26

Monthly Gratuity Accrual = ((Basic + DA) × 15 ÷ 26) ÷ 12
```

> Gratuity is an **employer liability**, not an employee deduction.
> Included in CTC; does NOT reduce monthly in-hand.
> Shown separately in CTC breakdown and payslip as "Employer Gratuity Contribution."

**❌ Old (incorrect) formula was:** `(Basic + DA × 15) / 26 / 12` — operator precedence error.
**✅ Correct:** `(Basic + DA)` must be grouped before multiplication.

---

#### 3.6 Professional Tax (PT)

State-based monthly slab. Dropdown selector:

| State | Slab Logic |
|---|---|
| Maharashtra | ₹200/month (₹300 in February) if Monthly Gross > ₹10,000 |
| Karnataka | ₹200/month if Monthly Gross > ₹15,000 |
| West Bengal | Tiered slab by monthly salary |
| Tamil Nadu | ₹208/month above threshold |
| Andhra Pradesh | Tiered slab |
| Telangana | Tiered slab |
| Others / N/A | ₹0 |

> PT is constitutionally capped at ₹2,500/year.

---

#### 3.7 Net In-Hand (Take-Home)

```
Monthly Net In-Hand =
  Monthly Gross
  − Employee PF
  − Employee ESI
  − Professional Tax
  − TDS (Annual Tax ÷ 12)
  − Employee NPS
  − VPF
  − Custom Deductions

Annual Net In-Hand = Monthly Net In-Hand × 12
```

> Note: Months with bonus disbursement will have higher gross but same TDS spread.
> For simplicity, Annual Tax ÷ 12 is used as uniform monthly TDS.

---

### 4. Tax Calculation Engine (FY 2024–25)

#### 4.1 Taxable Income Pipeline (step-by-step)

Both regimes follow this pipeline. Steps 3+ differ by regime.

```
Step 1 — Start with Annual Gross Income
  = (Monthly Gross × 12) + Annual Bonus

Step 2 — Subtract Standard Deduction
  Old Regime: ₹50,000
  New Regime: ₹75,000

Step 3 — Subtract Regime-Specific Deductions

  NEW REGIME: No further deductions. Go to Step 4.

  OLD REGIME only:
  − HRA Exemption           (min of 3 conditions — see 4.3)
  − LTA Exemption           (manual)
  − Section 80C             (capped at ₹1,50,000 — see 4.7)
  − Section 80D             (medical insurance — see 4.8)
  − Section 80CCD(1B) NPS   (up to ₹50,000)
  − Section 24(b)           (home loan interest — see 4.6)

Step 4 — Taxable Income
  = Annual Gross − Standard Deduction − All applicable deductions above

Step 5 — Compute Tax on Taxable Income using slabs (see 4.2)

Step 6 — Apply Section 87A Rebate (see 4.4)
  Tax after rebate = Tax − Rebate (min 0)

Step 7 — Add 4% Health & Education Cess
  Final Tax = (Tax after rebate) × 1.04

Step 8 — Surcharge check (see 4.5) — NOT implemented in v1; show warning banner

Step 9 — Final Annual Tax Liability
  Monthly TDS = Final Annual Tax ÷ 12
```

---

#### 4.2 Income Tax Slabs (FY 2024–25)

**Old Regime:**

| Taxable Income Slab | Rate |
|---|---|
| Up to ₹2,50,000 | Nil |
| ₹2,50,001 – ₹5,00,000 | 5% |
| ₹5,00,001 – ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |
| + Cess | 4% on tax |
| Rebate u/s 87A | Full rebate if taxable income ≤ ₹5,00,000 |

**New Regime (default from FY 2024–25):**

| Taxable Income Slab | Rate |
|---|---|
| Up to ₹3,00,000 | Nil |
| ₹3,00,001 – ₹7,00,000 | 5% |
| ₹7,00,001 – ₹10,00,000 | 10% |
| ₹10,00,001 – ₹12,00,000 | 15% |
| ₹12,00,001 – ₹15,00,000 | 20% |
| Above ₹15,00,000 | 30% |
| + Cess | 4% on tax |
| Rebate u/s 87A | Full rebate if taxable income ≤ ₹7,00,000 |
| Standard Deduction | ₹75,000 (applied in Step 2) |

> ✅ **Effective zero-tax threshold (New Regime FY 2024–25):**
> ₹7,00,000 taxable income + ₹75,000 standard deduction = **Annual Gross up to ₹7,75,000 → ₹0 tax**

---

#### 4.3 HRA Exemption (Old Regime only)

HRA Exemption = **minimum of these three conditions:**

```
Condition A:  Actual HRA received annually
Condition B:  50% × Annual Basic  (metro city)
              40% × Annual Basic  (non-metro city)
Condition C:  (Annual Rent Paid) − (10% × Annual Basic)
```

> If Rent Paid = ₹0, Condition C = negative → HRA Exemption = ₹0.

**UI inputs required:**
- Monthly Rent Paid
- City Type toggle: **Metro** (Mumbai, Delhi, Chennai, Kolkata) | **Non-Metro**

Show all three condition values and the resulting minimum in a tooltip.

---

#### 4.4 Section 87A Rebate

```
Old Regime: Taxable Income ≤ ₹5,00,000 → Rebate = min(Tax, ₹12,500) → Net Tax = ₹0
New Regime: Taxable Income ≤ ₹7,00,000 → Rebate = min(Tax, ₹25,000) → Net Tax = ₹0
```

---

#### 4.5 Surcharge — Not Implemented in v1

> ⚠️ **Show in UI:** *"Surcharge applies to income above ₹50L and is not calculated here. Please consult a Chartered Accountant."*

| Annual Income | Surcharge on Tax |
|---|---|
| ₹50L – ₹1Cr | 10% |
| ₹1Cr – ₹2Cr | 15% |
| ₹2Cr – ₹5Cr | 25% |
| Above ₹5Cr | 37% (25% under New Regime) |

Trigger the warning banner when Annual Gross > ₹50,00,000.

---

#### 4.6 Section 24(b) — Home Loan Interest (Old Regime only)

| Property Type | Deduction on Interest Paid |
|---|---|
| Self-Occupied | Capped at ₹2,00,000/year |
| Let-Out (rented out) | **Full interest paid — no cap** |

> UI: Radio — `Self-Occupied | Let-Out`
> Input: Annual Interest Paid
> For Let-Out: full amount flows into taxable income deduction pipeline.

---

#### 4.7 Section 80C Breakdown (Old Regime only)

Total capped at ₹1,50,000:

| Component | Notes |
|---|---|
| Employee PF | Auto-filled from PF calculation |
| VPF | Auto-filled if entered |
| PPF | Manual |
| ELSS Mutual Funds | Manual |
| NSC | Manual |
| Life Insurance Premium | Manual |
| Home Loan Principal | Manual |
| Children's Tuition Fee | Manual (max 2 children) |
| Sukanya Samriddhi | Manual |

> Show a **progress bar**: `₹X of ₹1,50,000 used` — turns red when over-limit.
> Over-limit entries are capped at ₹1,50,000 in the tax calculation.

---

#### 4.8 Section 80D — Medical Insurance (Old Regime only)

| Category | Annual Limit |
|---|---|
| Self + Spouse + Children (age < 60) | ₹25,000 |
| Self + Spouse + Children (age ≥ 60) | ₹50,000 |
| Parents (age < 60) | + ₹25,000 |
| Parents (age ≥ 60) | + ₹50,000 |

**UI:** Two rows — "Self/Family Premium" and "Parents' Premium" with age toggles.

---

### 5. Summary Dashboard Cards

| Card | Value | Formula |
|---|---|---|
| 💰 Monthly In-Hand | Net after all deductions | Monthly Gross − all employee deductions − TDS/12 |
| 📅 Annual CTC | Full employer cost | Annual Gross + Employer PF + Gratuity + NPS |
| 🏦 Annual Tax | Final liability | After slabs + rebate + cess |
| 📊 Effective Tax Rate | % | Annual Tax ÷ Annual Gross × 100 |
| 💼 Employer PF | Annual | Employer PF × 12 |
| 🧾 Gratuity Accrual | Annual | (Basic + DA) × 15 ÷ 26 |
| 🎯 Take-Home % | % of CTC | Annual Net In-Hand ÷ Annual CTC × 100 |

---

### 6. Regime Comparison Panel

Side-by-side display:

| Metric | Old Regime | New Regime |
|---|---|---|
| Standard Deduction | ₹50,000 | ₹75,000 |
| Total Deductions | Calculated | ₹0 |
| Taxable Income | — | — |
| Tax (before cess) | — | — |
| Cess (4%) | — | — |
| **Total Tax** | — | — |
| Monthly TDS | — | — |
| **Monthly In-Hand** | — | — |

> ✅ Highlight the better regime with badge: `"Save ₹X/year with New Regime"`

---

### 7. Visualizations

- **Donut chart** — Gross breakdown: In-Hand vs Total Deductions vs Employer Cost
- **Stacked bar** — Monthly salary component breakdown
- **Tax comparison bar** — Old vs New Regime annual tax (side-by-side)
- **80C utilisation bar** — Used vs ₹1,50,000 limit (Old Regime only)
- All charts: toggle Monthly / Annual view

---

### 8. Custom Components

- **+ Add Custom Earning** → Label + Monthly Amount (persists in localStorage)
- **+ Add Custom Deduction** → Label + Monthly Amount (persists in localStorage)
- Edit or delete any custom component inline

---

### 9. Payslip Preview

- Left column: Earnings breakdown
- Right column: Deductions breakdown
- Footer row: Gross Earnings | Total Deductions | **Net Pay**
- Info section below: Employer PF, Gratuity accrual (not deducted, shown for transparency)
- Print button → browser print stylesheet
- PDF export: v2 scope

---

## Calculation Accuracy Notices (show as info tooltips in UI)

| Field | Notice |
|---|---|
| ESI | Approximation: applied if current Gross ≤ ₹21,000. Mid-year wage period transitions not modelled. |
| TDS | Shown as Annual Tax ÷ 12. Actual employer TDS may vary by projection methodology. |
| Gratuity | Monthly accrual shown. Payout requires minimum 5 years continuous service. |
| Surcharge | Not calculated. Applies above ₹50L income — consult a CA. |
| Bonus TDS | Bonus included in annual taxable income. Employer may deduct TDS on bonus separately. |
| 87A Rebate | Marginal relief not modelled. Applies where income is slightly above threshold. |

---

## Data Model (localStorage Schema v2)

```json
{
  "salary_profiles": [
    {
      "id": "uuid-1",
      "name": "Current Job",
      "createdAt": "2024-01-01",
      "updatedAt": "2024-01-15",
      "taxRegime": "new",
      "cityType": "metro",
      "state": "Maharashtra",
      "pfMode": "capped",
      "earnings": {
        "basic": 50000,
        "hra": 20000,
        "da": 0,
        "lta": 60000,
        "specialAllowance": 15000,
        "bonus": 100000,
        "medicalAllowance": 1250,
        "custom": [
          { "id": "c1", "label": "Transport Allowance", "amount": 3200 }
        ]
      },
      "deductions": {
        "pfEmployee": 1800,
        "pfEmployer": 1800,
        "vpf": 0,
        "esiEmployee": 0,
        "esiEmployer": 0,
        "pt": 200,
        "npsEmployee": 0,
        "custom": []
      },
      "gratuity": {
        "annualAccrual": 28846,
        "monthlyAccrual": 2404
      },
      "exemptions": {
        "rentPaid": 20000,
        "section80C": {
          "pf": 21600,
          "vpf": 0,
          "ppf": 0,
          "elss": 50000,
          "nsc": 0,
          "lifeInsurance": 12000,
          "homeLoanPrincipal": 0,
          "tuitionFee": 0,
          "sukanya": 0
        },
        "section80D": {
          "selfFamily": 15000,
          "selfFamilySenior": false,
          "parents": 0,
          "parentsSenior": false
        },
        "nps80CCD1B": 0,
        "homeLoan": {
          "propertyType": "self-occupied",
          "annualInterest": 0
        },
        "ltaExemption": 60000
      }
    }
  ],
  "active_profile_id": "uuid-1"
}
```

---

## UI Structure

```
App
├── Sidebar
│   ├── Logo + App Title
│   ├── Profile List
│   │   ├── ProfileCard (name, monthly in-hand, CTC)
│   │   └── + New Profile button
│   └── Settings
│       ├── State selector (for PT)
│       ├── City Type (Metro / Non-Metro, for HRA)
│       ├── PF Mode (Full Basic / Capped ₹15,000)
│       └── Financial Year selector
│
└── Main Content
    ├── Profile Header
    │   ├── Profile name (editable inline)
    │   ├── Old / New Regime toggle
    │   └── Last updated timestamp
    │
    ├── Summary Cards Row
    │   └── [In-Hand] [CTC] [Annual Tax] [Eff. Rate] [Take-Home %]
    │
    ├── Regime Comparison Panel (collapsible)
    │
    ├── Charts Row
    │   ├── Donut: Earnings vs Deductions vs Employer Cost
    │   ├── Bar: Component breakdown
    │   └── 80C Utilisation bar (Old Regime only)
    │
    ├── Input Panel (2-column grid)
    │   ├── LEFT — Earnings
    │   │   ├── Monthly components (Basic, HRA, DA, SA, Medical)
    │   │   ├── Annual fields (LTA, Bonus — clearly labelled)
    │   │   └── + Add Custom Earning
    │   │
    │   └── RIGHT — Deductions
    │       ├── PF (with Full / Capped toggle)
    │       ├── ESI (auto + approximation badge)
    │       ├── PT (auto from state)
    │       ├── NPS, VPF
    │       └── + Add Custom Deduction
    │
    ├── Tax & Exemptions Panel (collapsible — Old Regime only)
    │   ├── HRA Exemption Calculator (rent + city type)
    │   ├── 80C Breakdown (with ₹1.5L progress bar)
    │   ├── 80D (self/family + parents with senior toggles)
    │   ├── Home Loan (Self-Occupied / Let-Out + interest input)
    │   ├── LTA Exemption
    │   └── NPS 80CCD(1B)
    │
    └── Payslip Preview (collapsible)
```

---

## UX Behaviours

- All inputs editable inline — no Save button required
- Auto-save to localStorage with 500ms debounce
- "Saving…" / "Saved ✓" micro-indicator near profile name
- Switching profiles saves current state first
- Delete profile shows confirmation modal
- New profile shows onboarding example (pre-filled with sample values)
- Surcharge warning banner shown when Annual Gross > ₹50,00,000
- Responsive: works on tablet (≥768px) and desktop (≥1280px)

---

## Design System

- **Theme:** Light & clean — spreadsheet-grade clarity
- **Fonts:** `DM Mono` (all numbers/amounts) + `DM Sans` (labels, UI copy)
- **Colors:**
  - Page background: `#F8F9FA`
  - Card: `#FFFFFF`, `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`
  - Primary: `#1A56DB`
  - Earnings/positive: `#0E9F6E`
  - Deductions/tax: `#E02424`
  - Neutral label: `#6B7280`
  - Border: `1px solid #E5E7EB`
- **Spacing:** 8px base grid
- **Numbers:** `en-IN` locale, ₹ symbol, shorthand (₹12.5L, ₹1.2Cr)

---

## Folder Structure (React + Vite)

```
salary-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProfileCard.jsx
│   │   ├── SummaryCards/
│   │   │   └── SummaryCards.jsx
│   │   ├── RegimeComparison/
│   │   │   └── RegimeComparison.jsx
│   │   ├── InputPanel/
│   │   │   ├── EarningsForm.jsx
│   │   │   ├── DeductionsForm.jsx
│   │   │   └── ExemptionsForm.jsx
│   │   ├── Charts/
│   │   │   ├── BreakdownDonut.jsx
│   │   │   ├── ComponentsBar.jsx
│   │   │   └── Section80CBar.jsx
│   │   ├── PayslipPreview/
│   │   │   └── PayslipPreview.jsx
│   │   └── shared/
│   │       ├── CurrencyInput.jsx
│   │       ├── InfoTooltip.jsx
│   │       └── Toggle.jsx
│   ├── context/
│   │   └── ProfileContext.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   └── useSalaryCalculations.js
│   ├── utils/
│   │   ├── taxCalculator.js        ← Full pipeline: gross → taxable → slabs → rebate → cess
│   │   ├── hraExemption.js         ← 3-condition min formula
│   │   ├── pfCalculator.js         ← Full/capped modes + employer PF/EPS split
│   │   ├── gratuityCalculator.js   ← (Basic + DA) × 15 ÷ 26
│   │   ├── esiCalculator.js        ← Gross ≤ ₹21,000 check
│   │   └── formatCurrency.js       ← en-IN locale, lakh/crore shorthand
│   ├── constants/
│   │   ├── taxSlabs.js             ← Old + New regime FY 2024–25
│   │   ├── ptByState.js            ← State slab lookup table
│   │   └── surchargeSlabs.js       ← Reference only, not used in v1
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## Out of Scope for v1

- [ ] PDF payslip export
- [ ] CTC letter import / parsing
- [ ] Surcharge calculation (income > ₹50L)
- [ ] Marginal relief on 87A
- [ ] Year-over-year salary comparison
- [ ] Increment / hike simulator
- [ ] 80C goal planner
- [ ] Capital gains / other income heads
- [ ] Form 16 reconciliation

---

*v2.0 — All formulas verified and corrected. Ready for implementation.*
*No backend. No login. All data in browser localStorage.*
