# Architecture

> Complete file tree, data flow, and component hierarchy.

Back to [[00_Index]] | See also: [[01_Project_Overview]]

## File Tree (Annotated)

```
client/
├── src/
│   └── app/
│       ├── globals.css              # Tailwind v4 @theme design tokens
│       │                            #   → @import "tailwindcss"
│       │                            #   → @config "../../tailwind.config.js"
│       │                            #   → @theme { all color/font vars }
│       │                            #   → @utility glass-card, primary-gradient
│       │                            #   → See [[04_Design_System]]
│       │
│       ├── layout.tsx               # Root layout
│       │                            #   → <link> for Manrope, Inter, Material Symbols
│       │                            #   → Wraps children in <Providers>
│       │                            #   → body classes: font-body text-on-surface
│       │                            #   → See [[04_Design_System#Typography]]
│       │
│       ├── Providers.tsx            # NextAuth SessionProvider wrapper
│       │                            #   → See [[05_Pages_and_Components#Providers]]
│       │
│       ├── page.tsx                 # Landing page (/)
│       │                            #   → Stitch Etheric Ledger design
│       │                            #   → Navbar, Hero, Features, Testimonial, CTA, Footer
│       │                            #   → See [[05_Pages_and_Components#Landing Page]]
│       │
│       ├── page.module.css          # (legacy, unused)
│       │
│       ├── form/
│       │   ├── page.tsx             # Form wizard (4 steps) + Editor switch
│       │   │                        #   → Qualifications, Experiences, Projects, Upload
│       │   │                        #   → Drag & drop file upload
│       │   │                        #   → Dynamically imports ResumeEditor
│       │   │                        #   → See [[05_Pages_and_Components#Form Wizard]]
│       │   │
│       │   ├── form.module.css      # Wizard styles (Stitch tokens)
│       │   │                        #   → Glass-card, step indicators, gradient buttons
│       │   │                        #   → See [[04_Design_System]]
│       │   │
│       │   ├── ResumeEditor.tsx     # WYSIWYG resume editor
│       │   │                        #   → Word-style toolbar
│       │   │                        #   → 7 templates, ATS scoring, Job matching
│       │   │                        #   → See [[05_Pages_and_Components#Resume Editor]]
│       │   │
│       │   └── editor.module.css    # Editor styles (Stitch tokens)
│       │                            #   → Toolbar, A4 board, template styles
│       │                            #   → See [[04_Design_System]]
│       │
│       └── api/
│           ├── auth/
│           │   └── [...nextauth]/
│           │       └── route.ts     # NextAuth handler
│           │                        #   → Google OAuth provider
│           │                        #   → See [[06_API_Reference#Auth Endpoint]]
│           │
│           ├── generate/
│           │   └── route.ts         # POST: AI resume generation
│           │                        #   → Accepts FormData (text + files)
│           │                        #   → Parses PDF/PPT, calls Gemini
│           │                        #   → Returns structured JSON resume
│           │                        #   → See [[06_API_Reference#POST apigenerate]]
│           │
│           ├── reanalyze/
│           │   └── route.ts         # POST: Re-analyze edited resume
│           │                        #   → ATS scoring + improvements
│           │                        #   → See [[06_API_Reference#POST apireanalyze]]
│           │
│           └── job-match/
│               └── route.ts         # POST: Job description matching
│                                    #   → Match score + missing keywords
│                                    #   → See [[06_API_Reference#POST apijob-match]]
│
├── public/
│   └── hero-resume-mockup.png       # Hero section image
│
├── tailwind.config.js               # Stitch colors + fonts config
│                                    #   → Referenced by globals.css @config
│                                    #   → See [[04_Design_System#Tailwind v4 Configuration]]
│
├── postcss.config.js                # @tailwindcss/postcss plugin
├── package.json                     # Dependencies list
│                                    #   → See [[02_Setup_Guide#Step 2 Install Dependencies]]
└── tsconfig.json                    # TypeScript config
```

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  USER INPUT                                              │
│  ├── Step 1: Qualifications (textarea)                  │
│  ├── Step 2: Experiences (textarea)                     │
│  ├── Step 3: Projects (textarea)                        │
│  └── Step 4: Files (drag & drop PDF/PPT)                │
│       → See [[05_Pages_and_Components#Form Wizard]]      │
└──────────────────┬──────────────────────────────────────┘
                   │ FormData POST
                   ▼
┌──────────────────────────────────────────────────────────┐
│  POST /api/generate                                      │
│  ├── Extract text from PDFs (pdfreader)                  │
│  ├── Extract text from PPTs (officeparser)               │
│  ├── Build prompt with all user data                     │
│  ├── Call Gemini 2.5 Flash Lite                          │
│  └── Return structured JSON resume + ATS score           │
│       → See [[06_API_Reference#POST apigenerate]]        │
└──────────────────┬──────────────────────────────────────┘
                   │ JSON Response
                   ▼
┌──────────────────────────────────────────────────────────┐
│  RESUME EDITOR                                           │
│  ├── Renders JSON as HTML in contentEditable A4 page    │
│  ├── Word-style toolbar (bold, italic, font, colors)    │
│  ├── 7 template styles applied via CSS modules          │
│  │                                                       │
│  ├── "Re-Analyze" → POST /api/reanalyze                 │
│  │   └── Returns updated ATS score + improvements       │
│  │       → See [[06_API_Reference#POST apireanalyze]]   │
│  │                                                       │
│  ├── "Fix My Resume" → POST /api/reanalyze              │
│  │   └── Auto-applies improvements to HTML              │
│  │                                                       │
│  ├── "Apply for Job" → POST /api/job-match              │
│  │   └── Match score + missing keywords                 │
│  │       → See [[06_API_Reference#POST apijob-match]]   │
│  │                                                       │
│  └── "Export PDF" → react-to-pdf (client-side)          │
│       → See [[05_Pages_and_Components#Resume Editor]]    │
└──────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
RootLayout (layout.tsx)
│  └── Font links (Manrope, Inter, Material Symbols)
│      → See [[04_Design_System#Typography]]
│
├── Providers (Providers.tsx)
│   └── SessionProvider (NextAuth)
│
├── Home (page.tsx) ← Route: /
│   │  → See [[05_Pages_and_Components#Landing Page]]
│   ├── Navbar (glassmorphism, fixed)
│   ├── Hero Section
│   │   ├── AI Badge pill
│   │   ├── Headline + Subtitle
│   │   ├── CTA buttons (Get Started, View Templates)
│   │   ├── Social Proof (stars + company logos)
│   │   └── Resume Mockup + AI Suggestion Popover
│   ├── Features Grid (3 bento cards)
│   ├── Testimonial Section
│   ├── CTA Card (gradient)
│   └── Footer
│
└── ResumeForm (form/page.tsx) ← Route: /form
    │  → See [[05_Pages_and_Components#Form Wizard]]
    ├── Step Indicators (4 dots)
    ├── Step 1: Qualifications textarea
    ├── Step 2: Experiences textarea
    ├── Step 3: Projects textarea
    ├── Step 4: File Upload (drag & drop)
    │
    └── (after generation) ResumeEditor (ResumeEditor.tsx)
        │  → See [[05_Pages_and_Components#Resume Editor]]
        ├── Formatting Toolbar (font, size, B/I/U, align, lists, colors)
        ├── ATS Score Bar (animated progress)
        ├── Controls Row (Exit, Templates, Actions)
        ├── Job Match Panel (expandable)
        ├── A4 Board (contentEditable)
        └── Analysis Panels
            ├── Missing Keywords (click to add)
            ├── Weak Bullets
            ├── Sections to Improve
            ├── Smart Suggestions
            └── AI Improvements (click before→after)
```

## Key Design Decisions

| Decision | Rationale | Related |
|----------|-----------|---------|
| `contentEditable` for editor | Word-style editing without heavy library | [[05_Pages_and_Components#Resume Editor]] |
| CSS Modules for form/editor | Scoped styles prevent leaking | [[04_Design_System]] |
| Tailwind v4 `@theme` for globals | Design tokens in CSS, accessible via `var()` | [[04_Design_System#Tailwind v4 Configuration]] |
| Client-side PDF | No server dependency; instant export | [[05_Pages_and_Components#Action Buttons]] |
| Gemini JSON output | Template switching without regeneration | [[06_API_Reference#POST apigenerate]] |
| Fonts via `<link>` not `@import` | Avoids Tailwind v4 `@import` ordering conflict | [[04_Design_System#Typography]] |
| `dynamic()` for ResumeEditor | SSR disabled (uses `document.execCommand`) | [[03_Architecture#Component Hierarchy]] |

---

Related: [[04_Design_System]] | [[05_Pages_and_Components]] | [[06_API_Reference]]
