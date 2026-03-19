# Agent Action History

This file documents the steps the AI Agent has taken to construct the AI Resume Creator.

## Phase 1: Foundation and UI
- Read initial Obsidian requirements.
- Developed `task.md` and `implementation_plan.md` breaking the project into 5 Phases.
- Initialized a new Next.js 16 application natively replacing Tailwind CSS with Vanilla CSS.
- Developed the core **Phase 1 UI Design System**, featuring a fluid 15-second radial gradient utilizing colors `#00B4D8`, `#0077B6`, `#03045E`, and 40% White.
- Created the Hero Landing Page (`page.tsx`) with a beautiful glassmorphism effect container.
- Initialized a Git Repository and executed a `git push` placing Phase 1 on Github.

## Phase 2: Authentication
- The User requested an exploratory UI branch into Dark/Light themes. Implemented Dark space-theme, and later a cool Light sky theme. **(Later reverted to the superior Phase 1 UI upon User's validation).**
- Installed `NextAuth.js` (Auth.js) securely in the application.
- Wrapped the Next.js `layout.tsx` in a `<Providers>` context exposing the session via `<SessionProvider>`.
- Hooked `signIn("google")` onto the landing page Hero button.
- Documented Auth scaffold via `Phase2_Authentication.md`.
- Generated a `.env.example` demonstrating the `GOOGLE_CLIENT_ID` requirement.

## Phase 3: Forms and Data Collection
- Prototyped the Data Collection Form wizard (`/form`) to collect Qualifications, Studies, Experiences, and Projects.
- Implemented multi-step tracking using React's `useState` alongside complex CSS module styling.
- Upon user request, set up local Prisma SQLite database schemas to securely collect form data (`prisma/schema.prisma`).
- Documented Form scaffold via `Phase3_Forms.md`.
- Cataloged this documentation and the prompt tracking system directly within Obsidian's file structure.

## Phase 4: Document Uploads & AI Integration
- Explained NextAuth missing credential warnings context to the user.
- Expanded the multi-step form to explicitly include a **Step 4: Document Uploads**, ready to ingest PDFs and PPTs.
- Created `Phase4_AI_Uploads.md` within the Obsidian architecture.
- Committed all changes to Github.
- Handled QA from User regarding a Turbopack Next.js build error related to `pdf-parse`.
- Replaced the ES module static import with a CommonJS `require()` resolution to fix the Next.js `Export default doesn't exist` crash.
- Discovered that `pdf-parse` also throws a Node `DOMMatrix` Reference Error due to relying on browser APIs in Next.js backend sandboxes.
- Removed `pdf-parse` entirely via npm and transitioned to a pure native architecture utilizing `pdfreader` and `officeparser`.
- Updated all Form documentation to officially support `pptx` and `docx` alongside PDFs via officeparser.
- Switched backend LLM explicitly from `gemini-1.5-flash` to universally-available `gemini-pro` after encountering a 404 model registry boundary error on the user's specific API key version.
- Reverted to `gemini-2.5-flash` exactly per User request.
- Verified successful Phase 4 conclusion via User's Dev Console screenshot displaying the perfectly structured JSON output `AI Resume Built: {basics: {...}, education: Array(1)...}`.
- Initiated **Phase 5: PDF Editable Environment** setup.
- Built `ResumeEditor.tsx` utilizing `contentEditable` and `react-to-pdf` for live manipulation.
- Fixed a Turbopack SSR compilation crash on `fflate` inside `jspdf` by dynamically importing the editor component with `{ ssr: false }`.
- Overhauled the AI Prompt Architecture into an "Elite Technical Recruiter" persona.
- Re-configured Form Step 4 to allow uploading multiple individual files with attached contextual descriptions, explicitly passing that context straight to the LLM.
- Executed local background extraction script on Aaron's actual PDF to populate a custom `Aaron_Demo_Input.md`.
- Solved Native File Upload UI overriding visually by resetting `e.target.value` upon change in React.
- Hardcoded the Elite FAANG Prompt System: Summaries into Array Bullets, Hard Metrics, Extracted Link Profiles arrays, Extracted Achievements arrays.
- Expanded `ResumeEditor` to conditionally map these new Data schemas visually into the interactive DOM.
- Deployed user's comprehensive 10-rule ATS system prompt verbatim as the new Gemini instruction set.
