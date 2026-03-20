# Setup Guide

> Complete from-scratch setup. Follow every step to get a working instance.

Back to [[00_Index]] | See also: [[01_Project_Overview]] | [[07_Deployment]]

## Prerequisites

| Software | Minimum Version | Check Command |
|----------|----------------|---------------|
| Node.js | 18.x | `node --version` |
| npm | 9.x | `npm --version` |
| Git | Any | `git --version` |

You also need a **Google Cloud Console** project for:
- Gemini API key (for AI features — see [[06_API_Reference]])
- OAuth credentials (for sign-in — see below)

## Step 1: Clone the Repository

```bash
git clone https://github.com/RYuK006/AI_Resume_Creator.git
cd AI_Resume_Creator/client
```

## Step 2: Install Dependencies

```bash
npm install
```

This installs all packages defined in `package.json`. Key ones:

| Package | Purpose | Doc Link |
|---------|---------|----------|
| `next` | Framework | [[03_Architecture]] |
| `tailwindcss` + `@tailwindcss/postcss` | Styling (v4) | [[04_Design_System#Tailwind v4 Configuration]] |
| `framer-motion` | Animations | [[05_Pages_and_Components#Animations]] |
| `next-auth` | Google OAuth | [[06_API_Reference#Auth Endpoint]] |
| `@google/generative-ai` | Gemini client | [[06_API_Reference]] |
| `react-to-pdf` | PDF export | [[05_Pages_and_Components#Action Buttons]] |
| `pdfreader` | PDF text extraction | [[06_API_Reference#File Parsing]] |
| `officeparser` | PPT text extraction | [[06_API_Reference#File Parsing]] |
| `lucide-react` | Editor toolbar icons | [[05_Pages_and_Components#Formatting Toolbar]] |

## Step 3: Configure Environment Variables

Create the file `client/.env.local`:

```env
# Google Gemini AI — used by /api/generate, /api/reanalyze, /api/job-match
GEMINI_API_KEY=your_gemini_api_key_here

# Google OAuth — used by NextAuth.js
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth internals
NEXTAUTH_SECRET=any_random_secret_string_here
NEXTAUTH_URL=http://localhost:3000
```

### Getting the Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click **Get API Key** → **Create Key**
3. Copy the key into `GEMINI_API_KEY`

> The app uses `gemini-2.5-flash-lite` model — see [[06_API_Reference]] for details.

### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** → `GOOGLE_CLIENT_ID`
8. Copy **Client Secret** → `GOOGLE_CLIENT_SECRET`

## Step 4: Run the Development Server

```bash
npm run dev
```

Opens at `http://localhost:3000`.

## Step 5: Verify Everything Works

| Check | URL | What to See |
|-------|-----|-------------|
| Landing page | `http://localhost:3000` | Stitch Etheric Ledger design ([[05_Pages_and_Components#Landing Page]]) |
| Sign in | Click "Get Started" | Google OAuth redirect |
| Form wizard | `/form` | 4-step wizard ([[05_Pages_and_Components#Form Wizard]]) |
| File upload | Step 4 | Drag & drop zone ([[05_Pages_and_Components#Step 4 Upload Documents]]) |
| AI generation | Click "Generate Resume via AI" | WYSIWYG editor loads ([[05_Pages_and_Components#Resume Editor]]) |

## Troubleshooting

| Issue | Fix | Related |
|-------|-----|---------|
| `@import rules must precede...` | Fonts must load via `<link>` in `layout.tsx`, not CSS `@import` | [[04_Design_System#Typography]] |
| Gemini 404 | Check model name = `gemini-2.5-flash-lite` in API routes | [[06_API_Reference]] |
| OAuth redirect error | Verify `NEXTAUTH_URL` matches your URL + redirect URI | See OAuth setup above |
| Material Symbols as text | Verify CDN `<link>` in `layout.tsx` `<head>` | [[04_Design_System#Icons]] |
| Tailwind classes not working | Ensure `globals.css` has `@import "tailwindcss"` + `@config` | [[04_Design_System#Tailwind v4 Configuration]] |
| Colors not applying | Check `@theme` block in `globals.css` | [[04_Design_System#Color Tokens]] |

---

Next: [[03_Architecture]] | [[04_Design_System]]
