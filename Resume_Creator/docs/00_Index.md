# 📚 AI Resume Creator — Project Wiki

> This is the **master index** for the Luminance AI Resume Creator project. 
> Every page in this vault is cross-linked. Open any doc and follow `[[wikilinks]]` to navigate.

## Core Documentation

| # | Document | What It Covers |
|---|----------|----------------|
| 1 | [[01_Project_Overview]] | What this project is, full feature list, tech stack table |
| 2 | [[02_Setup_Guide]] | Clone → install → env vars → first run (from scratch) |
| 3 | [[03_Architecture]] | Complete file tree, data flow, component hierarchy |
| 4 | [[04_Design_System]] | Stitch "Etheric Ledger" — every color token, font, utility |
| 5 | [[05_Pages_and_Components]] | Every page, section, component, prop documented |
| 6 | [[06_API_Reference]] | All 4 API endpoints with request/response schemas |
| 7 | [[07_Deployment]] | Vercel deployment + self-hosted guide |

## Quick Links

- **Landing Page** → [[05_Pages_and_Components#Landing Page]]
- **Form Wizard** → [[05_Pages_and_Components#Form Wizard]]
- **Resume Editor** → [[05_Pages_and_Components#Resume Editor]]
- **Color Tokens** → [[04_Design_System#Color Tokens]]
- **API Generate** → [[06_API_Reference#POST apigenerate]]
- **Tailwind v4 Config** → [[04_Design_System#Tailwind v4 Configuration]]

## Quick Start

```bash
git clone https://github.com/RYuK006/AI_Resume_Creator.git
cd AI_Resume_Creator/client
npm install
```

Create `client/.env.local` (see [[02_Setup_Guide#Step 3 Configure Environment Variables]]):

```env
GEMINI_API_KEY=your_key
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
NEXTAUTH_SECRET=any_random_string
NEXTAUTH_URL=http://localhost:3000
```

```bash
npm run dev
# Open http://localhost:3000
```

## Tech Stack Summary

| Layer | Tech | Version |
|-------|------|---------|
| Framework | Next.js | 16.2.0 |
| Runtime | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | 4.2.2 |
| Design System | Stitch "Etheric Ledger" | Custom |
| AI | Google Gemini | 2.5 Flash Lite |
| Auth | NextAuth.js | 4.24.13 |
| Animations | Framer Motion | 12.38.0 |
| Icons | Material Symbols | Google CDN |
| PDF Export | react-to-pdf | 3.2.2 |

## Project History & Development Phases

The project evolved through **18 distinct phases** of iterative development and refinement:

| Phase | Milestone | Focus Area |
|-------|-----------|------------|
| 1 | [[Phase_01_Initialization\|Initialization]] | Next.js, Tailwind v4, Basic Structure |
| 2 | [[Phase_02_Authentication\|Authentication]] | NextAuth, Google OAuth Integration |
| 3 | [[Phase_03_Form_Wizard\|Form Wizard]] | Multi-step user data collection |
| 4 | [[Phase_04_AI_Integration\|AI Integration]] | Gemini 1.5 Pro, structured generation |
| 5 | [[Phase_05_Resume_Editor\|Resume Editor]] | A4 Live Editor, PDF Export |
| 6 | [[Phase_06_ATS_Scoring\|ATS Scoring]] | Keyword analysis, optimize score |
| 7 | [[Phase_07_UX_Audit\|UX Audit]] | Visibility and contrast refinements |
| 8 | [[Phase_08_Stitch_Integration\|Stitch Design]] | Etheric Ledger System, Premium UI |
| 9 | [[Phase_09_Premium_Wizard\|Premium Wizard]] | Redesigned multi-step form flow |
| 10 | [[Phase_10_Landing_Page_Redesign\|Landing Page]] | Asymmetric Hero, trust elements |
| 11 | [[Phase_11_Mobile_Responsiveness\|Responsive UI]] | Mobile menus, touch optimization |
| 12 | [[Phase_12_Android_Port_Planning\|Android Planning]] | Capacitor/Cordova build research |
| 13 | [[Phase_13_Iconography_Theming\|Theming]] | Material Symbols, Brand scaling |
| 14 | [[Phase_14_Persistence_Layer\|Persistence]] | localStorage-based storage engine |
| 15 | [[Phase_15_Dashboard_Foundation\|Dashboard v1]] | Sidebar layout, Canva-style base |
| 16 | [[Phase_16_Dashboard_Refinement\|Dashboard v2]] | High-quality assets, grid layouts |
| 17 | [[Phase_17_Pricing_Templates\|Pricing & CTAs]] | Monetization, Template shortcuts |
| 18 | [[Phase_18_Interactivity_Documentation\|Brain Overhaul]] | Interactivity, Detailed Docs |

See [[Phase_18_Interactivity_Documentation]] for the most recent changes.

---

*Last updated: 2026-03-20*

[[Resume_Creator]]