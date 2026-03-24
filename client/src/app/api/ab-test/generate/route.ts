import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { resumeText, focus } = await req.json();

    const focusPrompts: Record<string, string> = {
      Keywords: "Optimize specifically for ATS keyword density without sacrificing readability.",
      Achievements: "Quantify every single bullet point with numbers, percentages, or dollar amounts.",
      Readability: "Optimize for human sky-reading: clear headers, whitespace, and punchy openings."
    };

    const selectedPrompt = focusPrompts[focus] || focusPrompts.Keywords;

    const prompt = `
      You are an A/B testing expert for resumes.
      Generate a high-performing VARIANT of this resume focusing on: ${selectedPrompt}
      
      ORIGINAL RESUME:
      ${resumeText}

      Return a JSON object with:
      {
        "variantResume": { ... },
        "strategyUsed": "...",
        "expectedImpact": "Why this variant might perform better"
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
