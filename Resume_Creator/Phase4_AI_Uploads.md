# Phase 4: Document Uploads & AI Integration

This phase manages the logic for users to upload their supporting materials (PDFs and PowerPoints), parsing the text content on the backend, and channeling all gathered context into an AI LLM to construct the final resume draft.

## Status
- [x] Implement file upload routing architecture
- [x] Set up PPT/PDF parsing utilities (`pdf-parse`, etc.)
- [x] Configure AI Prompt construction
- [x] Form submit triggers backend AI pipeline

## Known Issues & Resolutions
- **Issue**: `Export default doesn't exist` during Next.js compilation for the `pdf-parse` library.
- **Resolution**: Next.js Turbopack strictly enforces static ESM exports and lacks browser canvas polyfills. Because `pdf-parse` heavily relies on a modified Mozilla `pdf.js` wrapped around DOM elements (like DOMMatrix, ImageData, Path2D), the API route completely crashes before code even executes.
- To fully resolve this, we eradicated `pdf-parse` and implemented two separate pure Node libraries: `pdfreader` for PDFs, and `officeparser` for PowerPoint/Word documents! This makes the backend 100x more stable and expands functionality!
