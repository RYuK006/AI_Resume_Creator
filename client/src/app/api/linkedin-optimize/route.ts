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
        headline: "Principal DevOps Engineer | Cloud Transformation | Kubernetes & AWS Architect",
        about: "Strategic DevOps leader with over 8 years of experience in architecting high-scalability cloud infrastructures. Specialized in CI/CD automation, microservices orchestration, and security-first deployment patterns. Proven track record of reducing infrastructure costs by 30% while increasing deployment frequency at Fortune 500 companies.",
        skillsToFeature: [
          "Infrastructure-as-Code (Terraform)",
          "Cloud-Native Architecture (AWS/GCP)",
          "DevSecOps Strategy & Compliance",
          "High-Performance Monitoring (Prometheus/Grafana)"
        ],
        networkingIntro: "Hi [Name], I've been following your team's work on cloud-native expansion. Given my background in scaling Kubernetes for high-traffic environments, I'd love to connect and share some insights on multi-region reliability patterns."
      });
    }

    const { resumeText } = await req.json();

    const prompt = `
      You are a LinkedIn Branding Expert.
      Optimize the following resume for a professional LinkedIn profile.
      
      RESUME:
      ${resumeText}

      Return a JSON object with:
      {
        "headline": "A high-impact, SEO-optimized headline",
        "about": "A compelling 'About' section in first-person",
        "skillsToFeature": ["Skill 1", "Skill 2", "Skill 3"],
        "networkingIntro": "A short template for reaching out to recruiters in this field"
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
