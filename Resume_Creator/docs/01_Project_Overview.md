# Project Overview

> **Luminance AI** — An AI-powered resume builder that creates professional, ATS-optimized resumes using Google Gemini.

Back to [[00_Index]]

## What It Does

Users provide qualifications, experience, projects, and optional documents (PDF/PPT). The AI engine ([[06_API_Reference#POST apigenerate|Gemini 2.5 Flash Lite]]) analyzes everything and generates a structured JSON resume. This JSON is rendered in a rich WYSIWYG editor ([[05_Pages_and_Components#Resume Editor]]) where users can:

1. **Generate** a resume from freeform text + uploaded docs
2. **Edit** in a Word-style editor with 7 templates
3. **Analyze** ATS compatibility (keyword match, readability, formatting)
4. **Fix** weak bullet points via one-click AI improvements
5. **Match** against a specific job description
6. **Export** to PDF

## Full Feature List

| Feature | Where | Doc Link |
|---------|-------|----------|
| 🧠 AI Resume Generation | `/api/generate` | [[06_API_Reference#POST apigenerate]] |
| 📝 WYSIWYG Editor | `/form` (after generation) | [[05_Pages_and_Components#Resume Editor]] |
| 🎨 7 Resume Templates | Editor template selector | [[05_Pages_and_Components#Template Selector]] |
| 📊 ATS Scoring | `/api/reanalyze` | [[06_API_Reference#POST apireanalyze]] |
| 🔧 Auto-Fix | "Fix My Resume" button | [[05_Pages_and_Components#Action Buttons]] |
| 🎯 Job Matching | `/api/job-match` | [[06_API_Reference#POST apijob-match]] |
| 📥 PDF Export | "Export PDF" button | [[05_Pages_and_Components#Action Buttons]] |
| 🔐 Google OAuth | NextAuth.js | [[02_Setup_Guide#Getting Google OAuth Credentials]] |
| 📂 File Parsing | PDF + PPT extraction | [[06_API_Reference#File Parsing]] |
| 🎭 Stitch Design System | Etheric Ledger | [[04_Design_System]] |
| 📱 Responsive | Mobile-first design | [[05_Pages_and_Components#Landing Page]] |
| ✨ Animations | Framer Motion | [[05_Pages_and_Components#Animations]] |
| 🖱️ Drag & Drop Upload | Form step 4 | [[05_Pages_and_Components#Step 4 Upload Documents]] |

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js (App Router) | 16.2.0 | Full-stack React framework |
| Runtime | React | 19.2.4 | UI library |
| Language | TypeScript | ^5 | Type safety |
| Styling | Tailwind CSS | 4.2.2 | Utility-first CSS (see [[04_Design_System#Tailwind v4 Configuration]]) |
| PostCSS | @tailwindcss/postcss | 4.2.2 | CSS processing |
| Design System | Stitch "Etheric Ledger" | Custom | Color tokens, typography (see [[04_Design_System]]) |
| AI Engine | @google/generative-ai | Latest | Gemini API client |
| AI Model | Gemini 2.5 Flash Lite | — | Resume generation + analysis |
| Auth | next-auth | 4.24.13 | Google OAuth 2.0 |
| Animations | framer-motion | 12.38.0 | Page transitions, popups |
| Icons | Material Symbols Outlined | CDN | Google Material icons |
| PDF Export | react-to-pdf | 3.2.2 | Client-side PDF generation |
| PDF Parsing | pdfreader | Latest | Extract text from PDF uploads |
| PPT Parsing | officeparser | Latest | Extract text from PPT/PPTX |
| Typography | Manrope + Inter | Google Fonts | Headline + body fonts |
| Utilities | clsx + tailwind-merge | Latest | Class concatenation |
| Rich Text Icons | lucide-react | Latest | Editor toolbar icons |

## Repository Structure

```
AI_Resume_Creator/
├── .git/
├── client/                      # ← Next.js application root
│   ├── src/app/                # App Router pages + API routes
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Tailwind v4 @theme tokens
│   │   ├── layout.tsx          # Root layout (fonts, providers)
│   │   ├── Providers.tsx       # NextAuth SessionProvider
│   │   ├── form/               # Form + Editor pages
│   │   └── api/                # Server API routes
│   ├── public/                 # Static assets
│   ├── tailwind.config.js      # Stitch color + font config
│   ├── postcss.config.js       # @tailwindcss/postcss
│   ├── package.json
│   └── tsconfig.json
└── Resume_Creator/             # Documentation + demos
    ├── docs/                   # ← This Obsidian vault
    ├── Aaron_Demo_Input.md
    └── Complete_Project_Documentation.md
```

→ Full file tree in [[03_Architecture]]

---

Related: [[02_Setup_Guide]] | [[03_Architecture]] | [[04_Design_System]]
