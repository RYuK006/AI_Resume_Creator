import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!jobDescription) {
      return NextResponse.json({ success: false, error: "Job description is required." }, { status: 400 });
    }

    const prompt = `
You are an expert job-matching AI and resume optimizer.

Given a resume and a job description, you must:
1. Extract key skills, tools, and requirements from the job description
2. Compare them with the resume content
3. Calculate a match score (0-100)
4. Identify missing keywords that should be added
5. Identify keywords already present
6. Rewrite the resume to better align with the job while keeping all truthful information

CURRENT RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return STRICTLY a raw JSON object:
{
  "matchScore": 0,
  "missingKeywords": ["keyword1", "keyword2"],
  "addedKeywords": ["already present keyword1"],
  "optimizedResume": {
    "basics": { 
      "name": "...", 
      "email": "...", 
      "profiles": ["..."],
      "summary": ["Tailored bullet 1", "Tailored bullet 2", "Tailored bullet 3"] 
    },
    "education": [{ "institution": "...", "area": "...", "studyType": "...", "startDate": "...", "endDate": "..." }],
    "work": [{ "company": "...", "position": "...", "startDate": "...", "endDate": "...", "highlights": ["Tailored bullet"] }],
    "projects": [{ "name": "...", "description": "...", "highlights": ["Tailored bullet"] }],
    "achievements": ["..."],
    "skills": ["Languages: ...", "Frameworks: ...", "Tools: ...", "Databases: ...", "AI/ML: ..."]
  }
}
Do not wrap in markdown. Respond only with raw JSON.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      const parsed = JSON.parse(responseText.replace(/```json/g, "").replace(/```/g, ""));
      return NextResponse.json({ success: true, ...parsed });
    } catch (e) {
      return NextResponse.json({ success: false, error: "AI failed to return valid JSON." }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Job Match Error:", error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
