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

See [[01_Project_Overview]] for full details.

---

*Last updated: 2026-03-20*

[[Resume_Creator]]