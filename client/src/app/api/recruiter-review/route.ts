import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();

    const prompt = `
      Act as a cynical, high-stakes technical recruiter scanning this resume for exactly 8 seconds.
      Provide a brutal, honest assessment.
      
      RESUME TEXT:
      ${resumeText}

      Return a JSON object with:
      {
        "verdict": "SHORTLIST" | "REJECT",
        "score": 0-100,
        "brutalReasons": ["Reason 1", "Reason 2", "Reason 3"],
        "riskFactors": ["Risk 1", "Risk 2"],
        "punchline": "A one-sentence witty/brutal summary of the overall vibe"
      }
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
