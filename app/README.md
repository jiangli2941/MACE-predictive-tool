# MACE Risk Predictor

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.0.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.0-cyan.svg)](https://tailwindcss.com/)

A web-based visualization tool for predicting **non-fatal Major Adverse Cardiovascular Events (MACE)** risk using serum protein biomarkers and clinical data.

![MACE Risk Predictor](./public/hero-cardio.jpg)

## Model Overview

This tool implements a **CoxBoost + Elastic Net (α=0.1)** machine learning model with the following specifications:

- **C-index**: 0.758
- **Total Features**: 28
  - **Serum Proteins**: 9 biomarkers
  - **Clinical Variables**: 19 parameters

### Serum Protein Biomarkers

| Protein | Description |
|---------|-------------|
| ANG | Angiogenin |
| FGFR2 | Fibroblast Growth Factor Receptor 2 |
| HAVCR1 | Hepatitis A Virus Cellular Receptor 1 |
| IL1R1 | Interleukin 1 Receptor Type 1 |
| PTGDS | Prostaglandin D2 Synthase |
| CCL3 | C-C Motif Chemokine Ligand 3 |
| CXCL14 | C-X-C Motif Chemokine Ligand 14 |
| ESAM | Endothelial Cell Selective Adhesion Molecule |
| IGSF8 | Immunoglobulin Superfamily Member 8 |

### Clinical Variables

- **Demographics**: Age, Sex, Education, TDI (Townsend Deprivation Index)
- **Metabolic**: HbA1c, Glucose, BMI
- **Lipid Profile**: TC, HDL, TG, LDL, LpA, ApoB
- **Cardiovascular**: DBP, SBP, WC (Waist Circumference)
- **Renal Function**: Urea, eGFR, ACR

## Features

- **Interactive Prediction**: Input patient data and get instant MACE risk assessment
- **Risk Stratification**: Categorizes risk as Low, Moderate, or High
- **Visual Results**: Progress bars and color-coded risk indicators
- **Responsive Design**: Works on desktop and mobile devices
- **GitHub Ready**: Easy to deploy to GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mace-predictor.git
cd mace-predictor

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deploy to GitHub Pages

### Method 1: Using GitHub Actions (Recommended)

1. Push your code to a GitHub repository
2. Go to **Settings > Pages** in your repository
3. Set Source to "GitHub Actions"
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Method 2: Manual Deployment

```bash
# Build the project
npm run build

# Deploy to gh-pages branch
npx gh-pages -d dist
```

## Project Structure

```
mace-predictor/
├── public/              # Static assets
│   ├── hero-cardio.jpg
│   ├── proteins.jpg
│   └── mace-risk.jpg
├── src/
│   ├── components/      # UI components
│   ├── types/           # TypeScript definitions
│   ├── App.tsx          # Main application
│   ├── App.css          # Custom styles
│   └── main.tsx         # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Risk Interpretation

| Risk Category | Score Range | Recommendation |
|--------------|-------------|----------------|
| **Low** | < 30% | Standard cardiovascular care |
| **Moderate** | 30% - 60% | Enhanced monitoring, lifestyle intervention |
| **High** | > 60% | Intensive intervention, specialist referral |

## Disclaimer

This tool is for **research and educational purposes only**. It should not be used as the sole basis for clinical decisions. Always consult with qualified healthcare professionals for medical advice, diagnosis, and treatment.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Citation

If you use this tool in your research, please cite:

```
MACE Risk Predictor: A Machine Learning Tool for Cardiovascular Risk Assessment
Based on Serum Protein Biomarkers and Clinical Data
```

## Contact

For questions or issues, please open an issue on GitHub.

---

**Created**: 2026-03-23
