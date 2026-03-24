import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    
    if (!apiKey || apiKey.includes("your_") || apiKey.length < 10) {
      // Mock Data for Portfolio Gen
      return NextResponse.json({
        success: true,
        bio: "Visionary Software Engineer specializing in high-scale infrastructure and AI-driven automation. I build systems that transform complex data into actionable career insights.",
        tagline: "Engineering the Future of Talent Optimization",
        projects: [
          {
            title: "Luminance AI Platform",
            desc: "A full-stack career acceleration suite with distributed AI parsing and real-time document optimization.",
            tech: ["Next.js", "TypeScript", "Gemini AI", "Tailwind CSS"],
            impact: "Processed 10k+ resumes with 99.9% uptime."
          },
          {
            title: "Global Infra Scaler",
            desc: "Automated multi-region deployment orchestration for Kubernetes clusters across AWS and GCP.",
            tech: ["Go", "Kubernetes", "Terraform", "gRPC"],
            impact: "Reduced deployment latency by 45% for enterprise clients."
          }
        ],
        techStack: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
        themes: [
          { name: "Glassmorphic Dark", primary: "#0061a4", accent: "#60a5fa" },
          { name: "Minimalist Executive", primary: "#1e293b", accent: "#94a3b8" }
        ],
        domainSuggestions: ["dev-infra-expert.me", "scaling-with-ai.com", "career-builder.tech"]
      });
    }

    const { resumeText } = await req.json();

    const prompt = `
      You are a high-end web designer and brand strategist.
      Analyze this resume and generate a "Personal Portfolio Blueprint".
      
      RESUME:
      ${resumeText}

      Return a JSON object with:
      {
        "bio": "A compelling 2-3 sentence personal brand statement.",
        "tagline": "A punchy 5-word headline for the hero section.",
        "projects": [
          { "title": "...", "desc": "Context-rich project summary", "tech": ["..."], "impact": "Quantitative achievement" }
        ],
        "techStack": ["Top 5 most marketable skills"],
        "themes": [
          { "name": "...", "primary": "hex color", "accent": "hex color" }
        ],
        "domainSuggestions": ["3 creative/professional domain names"]
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
