import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey || apiKey.includes("your_") || apiKey.length < 10) {
      // Mock Data for testing/demo
      return NextResponse.json({
        success: true,
        currentLevel: "Senior Software Engineer (DevOps Focus)",
        nextMilestones: [
          { 
            title: "Staff DevOps Engineer / Architect", 
            timeframe: "12-18 months", 
            skillsNeeded: ["Distributed Systems Design", "FinOps Ecosystems", "Advanced Site Reliability Engineering"], 
            avgSalaryBump: "15-25%" 
          },
          { 
            title: "VP of Engineering or Infrastructure", 
            timeframe: "36 months", 
            skillsNeeded: ["Strategic Technology Leadership", "Budgeting & Resource Planning", "Scaling Engineering Organizations"], 
            avgSalaryBump: "40-60%" 
          }
        ],
        ultimateGoal: "Chief Technology Officer (CTO) or Head of Global Infrastructure",
        industryTrend: "The shift towards 'Platform Engineering' and 'Cloud-Native Security' (DevSecOps) is creating massive demand for architects who can automate compliance and cost-optimization at scale."
      });
    }

    const { resumeText } = await req.json();

    const prompt = `
      You are a strategic career architect.
      Analyze this resume and project a 3-year career growth roadmap.
      
      RESUME:
      ${resumeText}

      Return a JSON object with:
      {
        "currentLevel": "e.g. Mid-Level Engineer",
        "nextMilestones": [
          { "title": "...", "timeframe": "6-12 months", "skillsNeeded": ["..."], "avgSalaryBump": "..." }
        ],
        "ultimateGoal": "The possible role in 3 years",
        "industryTrend": "A brief note on where this niche is heading"
      }
      Do not include markdown. Return only raw JSON.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
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
