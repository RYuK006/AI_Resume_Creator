import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// @ts-ignore
import { PdfReader } from "pdfreader";
// @ts-ignore
import officeParser from "officeparser";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Helper to parse PDF via pdfreader
const extractPdfText = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    let text = "";
    new PdfReader({}).parseBuffer(buffer, (err: any, item: any) => {
      if (err) reject(err);
      else if (!item) resolve(text);
      else if (item.text) text += item.text + " ";
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const qualifications = formData.get("qualifications") as string || "";
    const experiences = formData.get("experiences") as string || "";
    const projects = formData.get("projects") as string || "";

    const files = formData.getAll("files") as File[];
    
    let extractedText = "";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const desc = formData.get(`fileDesc_${i}`) as string || "No context provided.";
      
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (file.name.endsWith(".pdf")) {
        try {
          const pdfText = await extractPdfText(buffer);
          extractedText += `\n--- Extracted from PDF: ${file.name} (Context: ${desc}) ---\n${pdfText}\n`;
        } catch (pdfErr) {
          console.error("PDF Parse Error:", pdfErr);
        }
      } else if (file.name.match(/\.(ppt|pptx|doc|docx)$/i)) {
        try {
          // @ts-ignore
          const officeText = await officeParser.parseOfficeAsync(buffer);
          extractedText += `\n--- Extracted from Office Doc: ${file.name} (Context: ${desc}) ---\n${officeText}\n`;
        } catch (officeErr) {
          console.error("Office Parse Error:", officeErr);
        }
      } else {
        extractedText += `\n--- Unsupported file type uploaded: ${file.name} ---\n`;
      }
    }

    const prompt = `
You are an advanced AI Resume Engine that replaces Canva, Overleaf, and Novoresume.
You are an expert resume writer, ATS optimization specialist, and technical recruiter with 15+ years of experience reviewing resumes for top tech companies (FAANG-level and startups).

Your task is to generate a highly optimized, ATS-friendly resume that scores above 90% in ATS while also appealing to human recruiters. You must also analyze, score, and provide improvement suggestions.

STRICT RULES FOR RESUME CONTENT:

1. FORMAT & STRUCTURE
- Clean, single-column format. No tables, no icons, no images, no emojis.
- Standard section headings ONLY: Summary, Skills, Technical Experience, Projects, Education, Achievements.
- Bullet points only, not paragraphs.
- Max 1 page (student), 2 pages (experienced).

2. ATS OPTIMIZATION
- Extract and include keywords relevant to the target job role.
- Ensure keyword density is natural (do NOT keyword stuff).
- Use standard job titles (e.g., "Software Developer Intern", not creative titles).
- Include technologies, tools, programming languages explicitly.
- Use both full forms and abbreviations where relevant (e.g., "REST APIs (Representational State Transfer)").

3. BULLET POINT WRITING (CRITICAL)
- Every bullet must follow: Action Verb + Task + Tool/Technology + Measurable Impact
- Example: "Developed a real-time chat application using Node.js and WebSockets, reducing message latency by 35%."
- Start with strong action verbs: Developed, Engineered, Built, Optimized, Designed, Implemented.
- Avoid weak phrases like "worked on", "helped", "responsible for".

4. QUANTIFICATION (MANDATORY)
- Add measurable impact wherever possible: % improvements, number of users, response time, performance gains, number of features.
- If exact metrics are unavailable, estimate realistically (but do not fabricate extreme or unrealistic numbers).

5. PROJECTS SECTION (FOR STUDENTS)
- Treat projects like real work experience.
- Include: Title, Tech stack, 2-4 bullet points with impact.
- Highlight: scalability, performance, real-world usage, complexity.

6. SKILLS SECTION
- Categorize clearly: Languages, Frameworks/Libraries, Tools/Platforms, Databases, AI/ML (if applicable).
- Avoid listing irrelevant or beginner-level skills.

7. SUMMARY SECTION
- 3-4 bullet points ONLY.
- Include: role, specialization, key strengths (tech + impact), career focus.

8. LANGUAGE STYLE
- Use concise, professional, results-driven language.
- Avoid buzzwords like: "passionate", "hardworking", "team player", "cutting-edge".
- Focus on proof, not claims.

9. CUSTOMIZATION
- Tailor the resume for the given job role.
- Prioritize relevant skills and projects.
- Reorder sections if needed to maximize relevance.

INPUT DATA:
Qualifications: ${qualifications}
Experiences: ${experiences}
Projects: ${projects}

EXTRACTED TEXT FROM UPLOADED FILES:
${extractedText}

You must transform the above inputs into a complete AI resume system output.
Return STRICTLY a raw JSON object matching EXACTLY this schema (no markdown, no explanations):
{
  "resume": {
    "basics": { 
      "name": "...", 
      "email": "...", 
      "profiles": ["github.com/...", "linkedin.com/..."],
      "summary": ["Bullet 1", "Bullet 2", "Bullet 3"] 
    },
    "education": [{ "institution": "...", "area": "...", "studyType": "...", "startDate": "...", "endDate": "..." }],
    "work": [{ "company": "...", "position": "...", "startDate": "...", "endDate": "...", "highlights": ["Action Verb + Task + Tool + Impact"] }],
    "projects": [{ "name": "...", "description": "...", "highlights": ["Action Verb + Task + Tool + Impact"] }],
    "achievements": ["Achievement 1", "Achievement 2"],
    "skills": ["Languages: ...", "Frameworks: ...", "Tools: ...", "Databases: ...", "AI/ML: ..."]
  },
  "ats_score": {
    "overall": 0,
    "keyword_match": 0,
    "readability": 0,
    "formatting": 0,
    "missing_keywords": ["keyword1", "keyword2"],
    "weak_bullets": ["The weak bullet text..."],
    "sections_to_improve": ["Section name: suggestion"]
  },
  "improvements": [
    { "original": "weak line from input", "improved": "rewritten stronger version" }
  ],
  "suggestions": [
    "Actionable suggestion 1",
    "Actionable suggestion 2"
  ]
}
Do not wrap it in markdown block quotes. Respond only with raw JSON.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-3.0-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("Raw LLM Response:", responseText);

    try {
      const parsed = JSON.parse(responseText.replace(/```json/g, "").replace(/```/g, ""));
      return NextResponse.json({ success: true, resume: parsed.resume || parsed, ats_score: parsed.ats_score || null, improvements: parsed.improvements || [], suggestions: parsed.suggestions || [] });
    } catch (e) {
      console.error("Failed to parse LLM output as JSON:", e);
      return NextResponse.json({ success: false, error: "AI failed to return valid JSON." }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error("Resume Generation Error:", error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
