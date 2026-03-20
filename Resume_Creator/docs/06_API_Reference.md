# API Reference

> All server-side API endpoints with full request/response schemas.

Back to [[00_Index]] | See also: [[03_Architecture]] | [[05_Pages_and_Components]]

---

## POST `/api/generate`

**Purpose**: Generate a structured JSON resume from user input + uploaded files.

**File**: `src/app/api/generate/route.ts`

**AI Model**: `gemini-2.5-flash-lite` (via `@google/generative-ai`)

### Request

| Property | Value |
|----------|-------|
| Method | `POST` |
| Content-Type | `multipart/form-data` |

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `qualifications` | string | ✅ | Educational background text |
| `experiences` | string | ✅ | Work experience and skills text |
| `projects` | string | ✅ | Notable projects text |
| `files` | File[] | ❌ | PDF/PPT/PPTX uploads (see [[#File Parsing]]) |
| `fileDesc_N` | string | ❌ | Context for file at index N |

### File Parsing

| File Type | Library | Process |
|-----------|---------|---------|
| `.pdf` | `pdfreader` | `PdfReader.parseBuffer()` → extracts text line by line |
| `.ppt`, `.pptx`, `.doc`, `.docx` | `officeparser` | `officeParser.parseOfficeAsync()` → extracts text |

Extracted text is included in the Gemini prompt with the file name and description.

### Response

```json
{
  "success": true,
  "resume": {
    "basics": {
      "name": "Name",
      "email": "email@example.com",
      "profiles": ["GitHub URL", "LinkedIn URL"],
      "summary": ["Summary point 1", "Summary point 2"]
    },
    "education": [{
      "institution": "Stanford University",
      "area": "Computer Science",
      "studyType": "B.S.",
      "startDate": "2022",
      "endDate": "2026"
    }],
    "work": [{
      "company": "Google",
      "position": "Software Engineer",
      "startDate": "Jun 2025",
      "endDate": "Present",
      "highlights": ["Led team of 5...", "Built React dashboard..."]
    }],
    "projects": [{
      "name": "AI Resume Creator",
      "description": "Next.js + Gemini AI",
      "highlights": ["Implemented WYSIWYG editor...", "Built ATS scoring..."]
    }],
    "achievements": ["Won hackathon...", "Published paper..."],
    "skills": ["Languages: Python, TypeScript", "Frameworks: React, Next.js"]
  },
  "ats_score": {
    "overall": 85,
    "keyword_match": 80,
    "readability": 90,
    "formatting": 85,
    "missing_keywords": ["Docker", "Kubernetes"],
    "weak_bullets": ["Managed team responsibilities"],
    "sections_to_improve": ["Skills: Add cloud certifications"]
  },
  "improvements": [{
    "original": "Managed team responsibilities",
    "improved": "Led a cross-functional team of 8 engineers delivering 3 products"
  }],
  "suggestions": ["Add quantifiable metrics to experience bullets"]
}
```

### How It's Used
1. Form wizard collects data across 4 steps (see [[05_Pages_and_Components#Form Wizard]])
2. On "Generate Resume via AI" → `FormData` POST to this endpoint
3. Response `resume` JSON → `buildResumeHTML()` → `contentEditable` A4 board
4. Response `ats_score`, `improvements`, `suggestions` → analysis panels

---

## POST `/api/reanalyze`

**Purpose**: Re-analyze an edited resume for updated ATS scoring and improvements.

**File**: `src/app/api/reanalyze/route.ts`

### Request

```json
{
  "resumeText": "Full plain-text of the edited resume (from innerText)",
  "templateType": "modern"
}
```

The `templateType` affects scoring — Gemini considers template-specific ATS implications:
- `minimal`: Traditional serif, good ATS readability
- `modern`: Sans-serif with color accents, moderate ATS
- `faang`: Monospace, ultra-dense, excellent ATS parsing

### Response

```json
{
  "success": true,
  "ats_score": {
    "overall": 88,
    "keyword_match": 85,
    "readability": 92,
    "formatting": 87,
    "missing_keywords": ["Docker", "Kubernetes"],
    "weak_bullets": ["Managed team"],
    "sections_to_improve": ["Skills: Add cloud certifications"]
  },
  "improvements": [
    { "original": "Managed team", "improved": "Led cross-functional team of 8 engineers" }
  ],
  "suggestions": ["Add quantifiable metrics to experience bullets"]
}
```

### How It's Used
- **Re-Analyze button**: Updates ATS score bar + all panels (see [[05_Pages_and_Components#Action Buttons]])
- **Fix My Resume button**: Same endpoint, but auto-applies `improvements` to the HTML via string replacement

---

## POST `/api/job-match`

**Purpose**: Match resume against a specific job description.

**File**: `src/app/api/job-match/route.ts`

### Request

```json
{
  "resumeText": "Full plain-text of resume",
  "jobDescription": "Full job description text (pasted by user)"
}
```

### Response

```json
{
  "success": true,
  "matchScore": 72,
  "missingKeywords": ["GraphQL", "AWS Lambda", "Terraform"],
  "addedKeywords": ["React", "TypeScript", "Next.js"],
  "optimizedResume": {
    "basics": { ... },
    "education": [{ ... }],
    "work": [{ ... }],
    "projects": [{ ... }],
    "achievements": ["..."],
    "skills": ["..."]
  }
}
```

### How It's Used
1. User clicks "Apply for Job" → panel expands (see [[05_Pages_and_Components#Job Match Panel]])
2. User pastes job description → clicks "Match & Optimize Resume"
3. Response shows match score, missing keywords (click to add), present keywords (green chips)

---

## Auth Endpoint

**Route**: `GET/POST /api/auth/[...nextauth]`

**File**: `src/app/api/auth/[...nextauth]/route.ts`

**Provider**: Google OAuth 2.0

### Environment Variables Required

| Variable | Purpose |
|----------|---------|
| `GOOGLE_CLIENT_ID` | OAuth client ID (see [[02_Setup_Guide#Getting Google OAuth Credentials]]) |
| `GOOGLE_CLIENT_SECRET` | OAuth secret |
| `NEXTAUTH_SECRET` | JWT encryption key |
| `NEXTAUTH_URL` | Application URL (e.g., `http://localhost:3000`) |

### Callback URL

```
{NEXTAUTH_URL}/api/auth/callback/google
```

Must be registered in Google Cloud Console as an authorized redirect URI.

### Usage in Code

```tsx
import { signIn } from "next-auth/react";
// Triggers Google sign-in, redirects to /form after success
signIn("google", { callbackUrl: "/form" });
```

See [[05_Pages_and_Components#Navbar]] for where sign-in is triggered.

---

Related: [[03_Architecture]] | [[05_Pages_and_Components]] | [[02_Setup_Guide]]
