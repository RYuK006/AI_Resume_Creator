# Design System — Stitch "Etheric Ledger"

> Every color, font, utility, and config needed to reproduce the design from scratch.

Back to [[00_Index]] | See also: [[03_Architecture]] | [[05_Pages_and_Components]]

## Philosophy

The Etheric Ledger design system follows 6 principles:

1. **Tonal Surface Layering** — Background shifts (`#f7f9fb` → `#f2f4f6` → `#ffffff`) separate sections. No hard lines.
2. **Ghost Borders** — `rgba(191, 199, 212, 0.15)` — barely visible, premium feel
3. **Gradient CTAs** — Primary buttons: `linear-gradient(135deg, #0061a4, #2196f3)`
4. **Glassmorphism** — Elevated elements: `backdrop-filter: blur(24px)` + semi-transparent bg
5. **Dual Typeface** — Manrope (headlines) + Inter (body)
6. **Ambient Depth** — Soft blurred blobs, no hard box-shadows

## Color Tokens

These are defined in `globals.css` inside the `@theme` block (see [[#Tailwind v4 Configuration]]).

### Primary Palette
| Token | CSS Variable | Value | Usage |
|-------|-------------|-------|-------|
| primary | `--color-primary` | `#0061a4` | Primary actions, links, accents |
| primary-container | `--color-primary-container` | `#2196f3` | Gradient end, containers |
| primary-fixed | `--color-primary-fixed` | `#d1e4ff` | Light primary backgrounds, hover |
| primary-fixed-dim | `--color-primary-fixed-dim` | `#9ecaff` | Hover states |
| on-primary | `--color-on-primary` | `#ffffff` | Text on primary surfaces |
| on-primary-container | `--color-on-primary-container` | `#002c4f` | Text on containers |
| on-primary-fixed | `--color-on-primary-fixed` | `#001d36` | Text on fixed primary |
| on-primary-fixed-variant | `--color-on-primary-fixed-variant` | `#00497d` | Variant text |

### Secondary Palette
| Token | Value | Usage |
|-------|-------|-------|
| secondary | `#006398` | Secondary actions |
| secondary-container | `#6cbdfe` | Secondary containers |
| secondary-fixed | `#cde5ff` | Light secondary bg |
| on-secondary | `#ffffff` | Text on secondary |

### Tertiary Palette
| Token | Value | Usage |
|-------|-------|-------|
| tertiary | `#904d00` | Accents, warnings |
| tertiary-container | `#db7900` | Star ratings (⭐) |
| tertiary-fixed | `#ffdcc2` | Warm accents |
| on-tertiary | `#ffffff` | Text on tertiary |

### Surface Hierarchy
| Token | Value | Usage | Example |
|-------|-------|-------|---------|
| surface | `#f7f9fb` | Page background | `<body>`, `.editorContainer` |
| surface-container-lowest | `#ffffff` | Cards, A4 board | Wizard card, editor A4 |
| surface-container-low | `#f2f4f6` | Subtle bg sections | Features section |
| surface-container | `#eceef0` | Dividers | Template chip dividers |
| surface-container-high | `#e6e8ea` | Secondary button bg | "Back" button |
| surface-container-highest | `#e0e3e5` | Hovered secondary | Button hover |

### Text Colors
| Token | Value | Usage |
|-------|-------|-------|
| on-surface | `#191c1e` | Primary text, headings |
| on-surface-variant | `#404752` | Secondary text, labels |
| outline | `#707883` | Placeholder text |
| outline-variant | `#bfc7d4` | Ghost borders |

### Error
| Token | Value |
|-------|-------|
| error | `#ba1a1a` |
| on-error | `#ffffff` |

## Typography

| Role | Font Family | Weights | CSS Variable | Used In |
|------|------------|---------|-------------|---------|
| Headlines | Manrope | 600, 700, 800 | `--font-headline` | h1, h2, badges, buttons |
| Body | Inter | 400, 500, 600 | `--font-body` | paragraphs, inputs, labels |
| Labels | Inter | 500, 600 | `--font-label` | Small labels |

### Loading Method

Fonts are loaded via `<link>` tags in `layout.tsx` (NOT via CSS `@import`):

```html
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
```

> ⚠️ **Critical**: Using `@import url()` in CSS breaks Tailwind v4 build because `@import` rules must come before `@theme` and `@utility` blocks.

## Icons

**Material Symbols Outlined** loaded from Google Fonts CDN:

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
```

Usage in JSX:
```tsx
<span className="material-symbols-outlined">auto_awesome</span>

// Filled variant:
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
```

Helper component (defined in both `page.tsx` and `form/page.tsx`):
```tsx
const Icon = ({ name, fill, className = "" }: { name: string; fill?: boolean; className?: string }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);
```

## Custom Utilities

Defined in `globals.css` using Tailwind v4 `@utility`:

```css
@utility glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

@utility primary-gradient {
  background: linear-gradient(135deg, #0061a4 0%, #2196f3 100%);
}
```

Usage: `className="glass-card"` or `className="primary-gradient"`.

## Tailwind v4 Configuration

Tailwind v4 uses a CSS-first approach. Here's the setup:

### `globals.css` structure
```css
@import "tailwindcss";          /* ← replaces @tailwind directives */
@config "../../tailwind.config.js";  /* ← points to JS config */

@theme {
  --color-primary: #0061a4;
  --color-surface: #f7f9fb;
  --font-headline: 'Manrope', sans-serif;
  /* ... all tokens ... */
}

@layer base { /* Material Symbols config */ }
@utility glass-card { /* ... */ }
@utility primary-gradient { /* ... */ }
```

### `tailwind.config.js`
Contains the full color palette and font family definitions. Referenced by `@config` in CSS.

### `postcss.config.js`
```js
export default {
  plugins: {
    "@tailwindcss/postcss": {}
  }
};
```

### Using tokens in CSS Modules
CSS Modules (`form.module.css`, `editor.module.css`) access tokens via `var()`:
```css
.wizard {
  background: var(--color-surface-container-lowest);
  border: 1px solid rgba(191, 199, 212, 0.15);
}
```

### Using tokens in Tailwind classes
In JSX, use Tailwind classes that reference the `@theme` tokens:
```tsx
className="bg-surface text-on-surface font-headline"
className="bg-primary-fixed text-on-primary-fixed"
className="border-outline-variant/15"  // opacity modifier
```

## Do's and Don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| Use tonal bg shifts between sections | Use hard `border` between sections |
| Use `primary-gradient` for CTAs | Use flat `bg-blue-500` |
| Use Manrope (`font-headline`) for headings | Use default sans-serif |
| Use ghost borders (`outline-variant/15`) | Use visible solid borders |
| Use `glass-card` for elevated elements | Use `bg-white` with hard `shadow-lg` |
| Load fonts via `<link>` in `layout.tsx` | Use `@import url()` in CSS files |
| Use `@theme` for design tokens | Use inline `var(--custom-thing)` |
| Use cubic-bezier `0.16, 1, 0.3, 1` for easing | Use `ease-in-out` |

---

Related: [[03_Architecture]] | [[05_Pages_and_Components]] | [[02_Setup_Guide]]
