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
        behavioralQuestions: [
          { 
            question: "Tell me about a time you had to handle a critical system failure under pressure.", 
            intent: "Assessing resilience and problem-solving in high-stakes environments.", 
            tip: "Use the STAR method. Focus on the action you took to stabilize the system and the lessons learned." 
          },
          { 
            question: "How do you stay updated with the latest DevOps trends and tools?", 
            intent: "Testing commitment to continuous learning in a fast-paced field.", 
            tip: "Mention specific newsletters, communities, or recent certifications you've completed." 
          }
        ],
        technicalQuestions: [
          { 
            question: "Explain the difference between Blue-Green and Canary deployment strategies.", 
            topic: "Deployment Orchestration", 
            expectedAnswer: "Blue-Green switches all traffic to a new version. Canary rolls it out gradually to a subset of users." 
          },
          { 
            question: "How do you secure secrets in a CI/CD pipeline?", 
            topic: "Security & DevSecOps", 
            expectedAnswer: "Using vaulted stores like AWS Secrets Manager or HashiCorp Vault, never hardcoding in environment variables." 
          }
        ],
        confidenceTips: [
          "Maintain strong eye contact during video calls.",
          "Pause for 2 seconds before answering complex technical questions to show deliberate thought."
        ]
      });
    }

    const { resumeText } = await req.json();

    const prompt = `
      You are an elite technical interviewer at a Tier-1 tech company.
      Based on this resume, generate a tailored interview prep guide.
      
      RESUME:
      ${resumeText}

      Return a JSON object with:
      {
        "behavioralQuestions": [
          { "question": "...", "intent": "...", "tip": "..." }
        ],
        "technicalQuestions": [
          { "question": "...", "topic": "...", "expectedAnswer": "..." }
        ],
        "confidenceTips": ["Tip 1", "Tip 2"]
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
