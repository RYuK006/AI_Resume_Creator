import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { resumeText, targetRole } = await req.json();

    const prompt = `
      You are an expert career coach and technical architect.
      Compare this resume with the target job role: "${targetRole}"
      
      RESUME:
      ${resumeText}

      Return a JSON object with:
      {
        "missingSkills": ["Skill 1", "Skill 2"],
        "priorityList": [
          { "skill": "...", "importance": "High/Medium/Low", "reason": "..." }
        ],
        "learningRoadmap": [
          { "phase": "Week 1-2", "goal": "...", "resources": ["...", "..."] }
        ],
        "matchPercentage": 0-100
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
