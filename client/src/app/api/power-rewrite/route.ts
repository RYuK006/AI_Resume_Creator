import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { resumeText, mode } = await req.json();

    const modePrompts: Record<string, string> = {
      FAANG: "Focus heavily on metrics, scale, and measurable impact. Use strong action verbs and highlight complexity.",
      Concise: "Make every bullet point extremely short and punchy. Remove fluff and focus on the core achievement.",
      Startup: "Focus on ownership, 'wearing multiple hats', speed of delivery, and '0 to 1' building.",
      Executive: "Focus on high-level strategy, leadership, cross-functional collaboration, and business outcomes."
    };

    const selectedPrompt = modePrompts[mode] || modePrompts.FAANG;

    const prompt = `
      You are an expert resume rewriter.
      Rewrite this resume using the following style focus: ${selectedPrompt}
      
      RESUME:
      ${resumeText}

      Return a JSON object with:
      {
        "rewrittenResume": { 
          "basics": { ... },
          "work": [ ... ],
          "projects": [ ... ],
          "skills": [ ... ]
        },
        "changesMade": ["Change 1", "Change 2"]
      }
      Maintain the same JSON schema as the input.
      Do not include markdown. Return only raw JSON.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      const parsed = JSON.parse(responseText.replace(/```json/g, "").replace(/```/g, ""));
      return NextResponse.json({ success: true, ...parsed });
    } catch (e) {
      return NextResponse.json({ success: false, error: "AI failed to return valid JSON." }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
