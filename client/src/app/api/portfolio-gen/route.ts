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
        domainSuggestions: ["dev-infra-expert.me", "scaling-with-ai.com", "career-builder.tech"],
        htmlTemplate: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-slate-950 text-white selection:bg-blue-500/30">
    <nav class="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 py-4 px-8 flex justify-between items-center">
        <div class="text-xl font-black tracking-tighter">PORTFOLIO.</div>
        <div class="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
            <a href="#" class="hover:text-white transition-colors">Projects</a>
            <a href="#" class="hover:text-white transition-colors">Stack</a>
            <a href="#" class="hover:text-white transition-colors text-white">Contact</a>
        </div>
    </nav>
    <main class="pt-32 pb-20 px-8 max-w-6xl mx-auto">
        <section class="mb-32">
            <span class="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Engineered for Success</span>
            <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">Engineering the Future of Talent Optimization</h1>
            <p class="text-xl text-slate-400 max-w-2xl leading-relaxed italic border-l-4 border-blue-500 pl-6">
                "Visionary Software Engineer specializing in high-scale infrastructure and AI-driven automation. I build systems that transform complex data into actionable career insights."
            </p>
        </section>
        <section class="grid md:grid-cols-2 gap-12">
            <div class="p-8 rounded-[3rem] bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-500">
                <h2 class="text-2xl font-black mb-4">Luminance AI Platform</h2>
                <p class="text-slate-400 mb-6 font-medium">A full-stack career acceleration suite with distributed AI parsing and real-time document optimization.</p>
                <div class="text-blue-400 text-xs font-bold">Impact: Processed 10k+ resumes with 99.9% uptime.</div>
            </div>
            <div class="p-8 rounded-[3rem] bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-500">
                <h2 class="text-2xl font-black mb-4">Global Infra Scaler</h2>
                <p class="text-slate-400 mb-6 font-medium">Automated multi-region deployment orchestration for Kubernetes clusters across AWS and GCP.</p>
                <div class="text-blue-400 text-xs font-bold">Impact: Reduced deployment latency by 45% for enterprise clients.</div>
            </div>
        </section>
    </main>
</body>
</html>`
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
        "domainSuggestions": ["3 creative/professional domain names"],
        "htmlTemplate": "A complete, high-end single-file HTML/Tailwind CSS portfolio code. Use glassmorphism, clean typography (Inter), and subtle gradients. The structure should include a hero section, projects grid, and a tech stack section. Wrap it in a single <!DOCTYPE html> string."
      }
      Do not include markdown in the JSON values. Return only raw JSON.
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
