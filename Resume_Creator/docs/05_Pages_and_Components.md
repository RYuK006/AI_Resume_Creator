# Pages & Components

> Every page, section, and component documented for full reproduction.

Back to [[00_Index]] | See also: [[03_Architecture]] | [[04_Design_System]]

---

## Landing Page

**File**: `src/app/page.tsx` | **Route**: `/`

Built with the [[04_Design_System|Stitch Etheric Ledger]] design system.

### Navbar
- **Position**: Fixed at top, `z-50`
- **Background**: `bg-white/70 backdrop-blur-xl` (glassmorphism)
- **Shadow**: `shadow-[0_8px_32px_0_rgba(0,0,0,0.04)]`
- **Content**: "Luminance AI" brand + desktop links (Home, Features, Pricing, Login) + "Get Started" gradient CTA
- **Mobile**: Hamburger menu toggles a dropdown with the same links
- **CTA action**: `signIn("google", { callbackUrl: "/form" })` via `next-auth/react`

### Hero Section
- **Layout**: `lg:grid-cols-2` — copy left, mockup right
- **AI Badge**: `inline-flex` pill with `bg-primary-fixed text-on-primary-fixed` + `auto_awesome` icon
- **Headline**: `text-5xl md:text-7xl font-extrabold` Manrope, with "AI" in `text-primary`
- **Subtitle**: `text-lg md:text-xl text-on-surface-variant`
- **CTAs**: "Get Started Now" (`primary-gradient`) + "View Templates" (`bg-surface-container-high`)
- **Social Proof**: 5x filled star icons (`text-tertiary-container`) + "4.9/5 Rating by 10k+ professionals"
- **Company logos**: Greyscale (`opacity-40 grayscale`) Spotify, Airbnb, Stripe, Google (from Stitch CDN)

### Resume Mockup (Right Column)
- **Container**: `glass-card` with 2° rotation, decorative gradient blobs behind
- **Image**: `/hero-resume-mockup.png` (locally generated, high quality)
- **AI Popover**: Floating "AI Improvement" chip, positioned `-left-8`, slight counter-rotation
  - Shows sample rephrasing: "Managed team" → "Spearheaded cross-functional initiatives"

### Features Grid
- **Section**: `id="features"`, bg: `bg-surface-container-low`
- **Heading**: "Engineered for Success" (Manrope 4xl extrabold)
- **Cards**: 3x bento grid (`md:grid-cols-3`)
  - Each card: `bg-surface-container-lowest`, rounded-2xl, border ghost
  - Icon in colored circle, changes color on hover
  - Cards: "AI-Powered Generation", "ATS Optimization Engine", "One-Click PDF Export"

### Testimonial Section
- **Layout**: Full-width centered
- **Quote**: Italic, `max-w-3xl`, from "Sarah Chen, Product Manager"
- **Avatar**: From Stitch CDN, `w-12 h-12 rounded-full`
- **Quote icon**: Blue pill badge with `format_quote` Material Symbol

### CTA Card
- **Container**: `rounded-[3rem]` gradient card (`primary-gradient`)
- **Heading**: "Ready to transform your career?" (white, bold)
- **CTA button**: White bg, primary text
- **Decorative**: Two white blurred blob circles

### Footer
- **Content**: "Luminance AI" brand + "© 2024" + links (Privacy, Terms, Contact)
- **Separator**: `bg-outline-variant/20` line

### Animations
All sections use **Framer Motion**:
- `fadeUp` variant: `opacity: 0, y: 24` → `opacity: 1, y: 0` with ease `[0.16, 1, 0.3, 1]`
- `stagger` variant: `staggerChildren: 0.12`
- `whileInView` with `viewport={{ once: true, margin: "-80px" }}`
- Hero mockup: enters from right (`x: 40`) with 2° rotation

---

## Form Wizard

**File**: `src/app/form/page.tsx` | **Route**: `/form` | **CSS**: `form.module.css`

Four-step data collection wizard. See [[04_Design_System]] for styling tokens.

### Step Indicators
- 4 dots at top, rendered via `STEPS.map()`
- Active dot: `width: 32px`, gradient fill
- Completed dot: solid `--color-primary`
- Default: `10px` circle, `--color-outline-variant`
- CSS classes: `.stepDot`, `.stepDotActive`, `.stepDotDone`

### Header
Each step has:
- **Icon**: Material Symbols in a `--color-primary-fixed` box (`.stepIcon`)
- **Title**: Manrope bold (e.g., "Qualifications & Studies")
- **Sublabel**: Inter, `--color-on-surface-variant`
- **Badge**: `STEP N/4` gradient pill (`.progress`)

### Step Content

#### Step 1: Qualifications
- Icon: `school`
- `<textarea>` with placeholder "e.g. B.S. in Computer Science at Stanford (2026)"

#### Step 2: Experiences
- Icon: `work`
- `<textarea>` with placeholder "e.g. Software Engineer at Google..."

#### Step 3: Projects
- Icon: `code`
- `<textarea>` with placeholder "e.g. AI Resume Creator using Next.js..."

#### Step 4: Upload Documents
- Icon: `upload_file`
- **Drag & Drop Zone**: Click or drag to upload
  - `cloud_upload` Material Symbol
  - Text: "Drag & drop or click to browse" / "Drop files here" (when dragging)
  - Accepts: `.pdf, .ppt, .pptx`
  - Hidden `<input type="file" ref={fileInputRef}>` triggered via `onClick`
  - Drag handlers: `onDragOver`, `onDragLeave`, `onDrop`
  - Visual drag-active state: border + bg change (`.uploadZoneDragActive`)
- **File Cards**: For each uploaded file
  - File name with `description` Material Symbol
  - Remove button (`close` icon)
  - Context input ("e.g., 'My old resume', 'Project slides'")

### Transitions
- Steps animate via `AnimatePresence mode="wait"` with `fadeVariant`
- Wizard card enters with `scale: 0.98 → 1`, `opacity: 0 → 1`

### Buttons
- **Back**: Secondary, disabled on step 1, `arrow_back` icon
- **Next Step**: Primary gradient, `arrow_forward` icon
- **Generate Resume via AI**: Primary gradient on step 4, `auto_awesome` filled icon
- **Loading state**: `progress_activity` spinning icon + "AI is Generating..."

### Generation Flow
On step 4 → "Generate Resume via AI":
1. Builds `FormData` with qualifications, experiences, projects, files, descriptions
2. POSTs to `/api/generate` (see [[06_API_Reference#POST apigenerate]])
3. On success → sets `resumeData` → renders `ResumeEditor`

---

## Resume Editor

**File**: `src/app/form/ResumeEditor.tsx` | **CSS**: `editor.module.css`

WYSIWYG editor with AI analysis tools. See [[04_Design_System]] for styling.

### Formatting Toolbar
Sticky at `top: 12px`, glassmorphism bg. Groups:

| Group | Tools |
|-------|-------|
| Font Family | Inter, Georgia, Arial, Courier, Times NR, Verdana, Calibri, Garamond |
| Font Size | 8, 10, 12, 14, 18, 24, 36 |
| Text Format | **B**, *I*, <u>U</u>, ~~S~~ |
| Alignment | Left, Center, Right, Justify |
| Lists | Bullet, Numbered, Horizontal Rule |
| Indent | Indent →, Outdent ← |
| Colors | Text color picker, Highlight color picker |
| Undo/Redo | Undo, Redo, Clear Formatting |

Implementation: Uses `document.execCommand()` for each action.

### Template Selector
7 templates as pill buttons. Active = `--color-primary` bg + white text.

| Template | Font | Style |
|----------|------|-------|
| `modern` | Inter | Blue accents, standard ATS |
| `minimal` | Georgia | Uppercase headers, serif feel |
| `faang` | Courier New | Monospace, ultra-dense |
| `executive` | Garamond | Double borders, elegant |
| `creative` | Verdana | Purple accents, colored borders |
| `professional` | Calibri | Blue header bars |
| `tech` | JetBrains Mono | Dashed borders, code style |

### Action Buttons
| Button | Gradient | API Call | Action |
|--------|----------|----------|--------|
| Exit | Secondary (tonal) | — | Returns to form wizard |
| Re-Analyze | Green | [[06_API_Reference#POST apireanalyze]] | Updates ATS score |
| Fix My Resume | Purple | [[06_API_Reference#POST apireanalyze]] | Auto-applies improvements |
| Apply for Job | Red | Expands JD panel | — |
| Export PDF | Primary | — | `react-to-pdf` download |

### ATS Score Bar
- Animated progress bar (Framer Motion `width: 0 → N%`)
- Color-coded: red ≤50, yellow ≤75, green >75
- Sub-metrics: Keywords %, Readability, Formatting

### Analysis Panels
4 panels in a 2-column grid:
1. **Missing Keywords** — Click to add to Skills section
2. **Weak Bullet Points** — Red-bg warnings
3. **Sections to Improve** — Click to append
4. **Smart Suggestions** — Click to append

### AI Improvements
Before → After improvements. Click to apply replacement.

### Job Match Panel
Expandable panel:
1. Paste job description in textarea
2. Click "Match & Optimize Resume" → [[06_API_Reference#POST apijob-match]]
3. Shows match score (0-100%), missing keywords (click to add), present keywords (green chips)

### A4 Board
- `contentEditable` div, `210mm × 297mm` (A4)
- Built from JSON via `buildResumeHTML()` (generates HTML from structured resume data)
- Template styles applied via CSS class: `.template_modern`, `.template_faang`, etc.

---

## Providers

**File**: `src/app/Providers.tsx`

```tsx
"use client";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

Wraps the entire app in NextAuth's `SessionProvider`. Used in [[03_Architecture#Component Hierarchy|layout.tsx]].

---

Related: [[04_Design_System]] | [[06_API_Reference]] | [[03_Architecture]]
