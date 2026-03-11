# 🧮 Indian Tax Calculator

A comprehensive, open-source Indian salary and tax calculator built with React. Calculate your in-hand salary, compare tax regimes, and understand your earnings breakdown for FY 2024-25.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)

**🌐 Live Demo:** [tax-calculation.vinitk.dev](https://tax-calculation.vinitk.dev)

---

## ✨ Features

### 📊 Salary Calculations
- **Gross Salary**: Monthly and annual breakdown
- **Net In-Hand Salary**: After all deductions
- **CTC Calculation**: Including employer contributions (PF, NPS, Gratuity)

### 💰 Tax Computation (FY 2024-25)
- **Old Tax Regime**: Full deductions (HRA, 80C, 80D, Home Loan, NPS)
- **New Tax Regime**: Simplified with standard deduction
- **Side-by-side Comparison**: Find your optimal regime automatically

### 📋 Deductions & Exemptions
- **HRA Exemption**: 3-condition calculation (Metro/Non-metro)
- **Section 80C**: Up to ₹1.5L (PF, PPF, ELSS, etc.)
- **Section 80D**: Medical insurance deductions
- **Section 80CCD(1B)**: Additional NPS deduction ₹50K
- **Home Loan Interest**: Up to ₹2L under Section 24
- **Professional Tax**: State-wise slabs (Maharashtra, Karnataka, etc.)

### 📈 Visualizations
- Interactive donut charts for earnings breakdown
- Bar charts for monthly component comparison
- 80C utilization progress tracking

### 🎯 Multi-Profile Support
- Create unlimited salary profiles
- Compare different job offers
- Auto-save with localStorage persistence

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/vinitkumar/tax-calculator.git
cd tax-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite 6 | Build Tool & Dev Server |
| Tailwind CSS 3 | Styling |
| Recharts | Charts & Visualizations |
| Lucide React | Icons |
| Vitest | Unit Testing |

---

## 📁 Project Structure

```
tax-calculator/
├── src/
│   ├── components/          # UI Components
│   │   ├── Charts/          # Donut, Bar charts
│   │   ├── InputPanel/      # Forms for earnings/deductions
│   │   ├── PayslipPreview/  # Print preview
│   │   ├── RegimeComparison/# Tax comparison
│   │   └── shared/          # Reusable components
│   ├── constants/           # Tax slabs, PT rates
│   ├── context/             # React Context state
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Calculation logic
│   └── __tests__/           # Unit tests
├── public/                   # Static assets
└── package.json
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

---

## 📖 Calculation Reference

### Old Tax Regime Slabs (FY 2024-25)

| Income Range | Tax Rate |
|--------------|----------|
| Up to ₹2,50,000 | 0% |
| ₹2,50,001 - ₹5,00,000 | 5% |
| ₹5,00,001 - ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

### New Tax Regime Slabs (FY 2024-25)

| Income Range | Tax Rate |
|--------------|----------|
| Up to ₹3,00,000 | 0% |
| ₹3,00,001 - ₹7,00,000 | 5% |
| ₹7,00,001 - ₹10,00,000 | 10% |
| ₹10,00,001 - ₹12,00,000 | 15% |
| ₹12,00,001 - ₹15,00,000 | 20% |
| Above ₹15,00,000 | 30% |

### HRA Exemption Formula
```
HRA Exemption = min(
  Actual HRA received,
  Rent - 10% of Basic,
  50% of Basic (Metro) / 40% (Non-metro)
)
```

### Gratuity Calculation
```
Gratuity = (Basic + DA) × 15 ÷ 26 × Years of Service
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

### Ways to Contribute
- 🐛 Report bugs via [Issues](https://github.com/vinitkumar/tax-calculator/issues)
- 💡 Suggest new features
- 📖 Improve documentation
- 🔧 Submit Pull Requests

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Tax calculations based on Indian Income Tax Act for FY 2024-25
- Professional Tax slabs sourced from respective state regulations
- Icons by [Lucide](https://lucide.dev/)

---

## 📞 Support

- 🐛 **Bugs**: [Open an Issue](https://github.com/vinitkumar/tax-calculator/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Request a Feature](https://github.com/vinitkumar/tax-calculator/issues/new?template=feature_request.md)
- ❓ **Questions**: [Start a Discussion](https://github.com/vinitkumar/tax-calculator/discussions)

---

**Disclaimer:** This calculator is for educational purposes only. Please consult a qualified tax professional for official tax advice.