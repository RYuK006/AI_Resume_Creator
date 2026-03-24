import { NextRequest, NextResponse } from "next/server";
import { extractJobProfile, generateSearchQueries, scoreJob, ScoredJob } from "@/lib/job-utils";

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();

    // 1. Extract Profile
    const profile = await extractJobProfile(resumeText);

    // 2. Generate Queries
    const queries = generateSearchQueries(profile);

    // 3. Multi-source Fetcher (Mocked aggregation)
    // In production, we'd hit Adzuna, Remotive, and RapidAPI here.
    const jobs = await fetchMockJobs(queries);

    // 4. Score and Sort
    const scoredJobs = jobs.map(job => scoreJob(job, profile))
      .sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ success: true, jobs: scoredJobs, profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function fetchMockJobs(queries: string[]) {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 1000));
  
  // Return some high-quality mock data for demonstration
  return [
    {
      title: "Full Stack Engineer",
      company: "TechNova Solutions",
      location: "Remote",
      description: "Looking for a developer skilled in Next.js, TypeScript, and Prisma.",
      skills: ["React", "TypeScript", "Node.js", "Prisma"],
      postedDate: "2h ago",
      url: "https://example.com/job1"
    },
    {
      title: "Frontend Developer (Junior)",
      company: "Creative Studio",
      location: "New York, NY",
      description: "Join our team building beautiful UI with React and Tailwind CSS.",
      skills: ["React", "Tailwind CSS", "JavaScript"],
      postedDate: "1d ago",
      url: "https://example.com/job2"
    },
    {
      title: "Senior Backend Architect",
      company: "DataCloud Systems",
      location: "San Francisco, CA",
      description: "Expertise in distributed systems and Node.js backend required.",
      skills: ["Node.js", "PostgreSQL", "Docker", "AWS"],
      postedDate: "3h ago",
      url: "https://example.com/job3"
    }
  ];
}
