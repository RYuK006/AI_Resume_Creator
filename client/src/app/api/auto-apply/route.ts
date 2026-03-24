import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { job, resumeText } = await req.json();

    const prompt = `
      You are a career consultant. For the following job and resume:
      
      JOB: ${job.title} at ${job.company}
      DESCRIPTION: ${job.description}
      RESUME: ${resumeText}
      
      Generate:
      1. A tailored resume content (summary and bullet points only).
      2. A personalized cover letter.
      3. 5 likely interview questions and sample answers.
      
      Return as JSON:
      {
        "tailoredSummary": "...",
        "tailoredBullets": ["...", "..."],
        "coverLetter": "...",
        "interviewPrep": [
          { "question": "...", "answer": "..." }
        ]
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = JSON.parse(text.replace(/```json/g, "").replace(/```/g, ""));
    return NextResponse.json({ success: true, ...parsed });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
