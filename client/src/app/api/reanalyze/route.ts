import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { resumeText, templateType } = await req.json();

    const prompt = `
You are an advanced AI Resume Analyzer and ATS scoring specialist.
You have been given a resume that has been manually edited by a user.
Re-analyze it and provide updated scoring and improvement suggestions.

The resume is currently styled in the "${templateType || "modern"}" template format.
Consider template-specific ATS implications:
- "minimal": Clean serif fonts, good ATS readability, traditional structure
- "modern": Sans-serif with color accents, moderate ATS compatibility
- "faang": Monospace, ultra-dense, excellent ATS parsing

RESUME TEXT:
${resumeText}

Analyze this resume and return STRICTLY a raw JSON object:
{
  "ats_score": {
    "overall": 0,
    "keyword_match": 0,
    "readability": 0,
    "formatting": 0,
    "missing_keywords": ["keyword1"],
    "weak_bullets": ["weak line"],
    "sections_to_improve": ["Section: suggestion"]
  },
  "improvements": [
    { "original": "weak line from resume", "improved": "stronger rewritten version" }
  ],
  "suggestions": [
    "Actionable suggestion 1"
  ]
}
Do not wrap in markdown. Respond only with raw JSON.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-3.0-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      const parsed = JSON.parse(responseText.replace(/```json/g, "").replace(/```/g, ""));
      return NextResponse.json({ success: true, ...parsed });
    } catch (e) {
      return NextResponse.json({ success: false, error: "AI failed to return valid JSON." }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Re-analysis Error:", error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
