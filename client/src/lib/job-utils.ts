import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface JobProfile {
  roles: string[];
  skills: string[];
  experienceLevel: "entry" | "mid" | "senior";
  preferredLocations: string[];
  jobTypes: string[];
}

export interface Job {
  id?: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  postedDate: string;
  url: string;
}

export interface ScoredJob extends Job {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
}

/**
 * STEP 1: RESUME → STRUCTURED PROFILE
 */
export async function extractJobProfile(resumeText: string): Promise<JobProfile> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  const prompt = `
    Analyze the following resume and extract structured professional data.
    
    RESUME:
    ${resumeText}
    
    Return ONLY a JSON object:
    {
      "roles": ["Standard job titles"],
      "skills": ["Key technical and soft skills"],
      "experienceLevel": "entry" | "mid" | "senior",
      "preferredLocations": ["Locations mentioned or inferred"],
      "jobTypes": ["Full-time", "Remote", "Contract", etc.]
    }
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text.replace(/```json/g, "").replace(/```/g, ""));
}

/**
 * STEP 2: QUERY GENERATION ENGINE
 */
export function generateSearchQueries(profile: JobProfile): string[] {
  const queries: string[] = [];
  const roles = profile.roles.slice(0, 3);
  const topSkills = profile.skills.slice(0, 3);
  
  roles.forEach(role => {
    // Basic role search
    queries.push(`${role} ${profile.preferredLocations[0] || ""}`);
    // Skill focused
    queries.push(`${role} ${topSkills.join(" ")}`);
    // Experience focused
    if (profile.experienceLevel === "entry") {
      queries.push(`${role} intern`);
      queries.push(`${role} fresher`);
      queries.push(`${role} entry level`);
    } else {
      queries.push(`${profile.experienceLevel} ${role}`);
    }
  });

  return Array.from(new Set(queries)).slice(0, 8);
}

/**
 * STEP 4: JOB SCORING ENGINE
 */
export function scoreJob(job: Job, profile: JobProfile): ScoredJob {
  let score = 0;
  
  // 1. Skill Match (40%)
  const jobSkills = job.skills.map(s => s.toLowerCase());
  const profileSkills = profile.skills.map(s => s.toLowerCase());
  const matchedSkills = profileSkills.filter(s => jobSkills.includes(s) || job.description.toLowerCase().includes(s));
  const missingSkills = jobSkills.filter(s => !profileSkills.includes(s));
  
  const skillMatchRatio = profileSkills.length > 0 ? matchedSkills.length / Math.max(jobSkills.length, 5) : 0;
  score += Math.min(skillMatchRatio * 40, 40);

  // 2. Title Similarity (30%)
  const titleMatch = profile.roles.some(r => job.title.toLowerCase().includes(r.toLowerCase())) ? 30 : 10;
  score += titleMatch;

  // 3. Experience Match (20%)
  // Simple heuristic: check for "Senior" in title if profile is entry etc.
  const isSeniorJob = job.title.toLowerCase().includes("senior") || job.title.toLowerCase().includes("sr");
  const isLeadJob = job.title.toLowerCase().includes("lead") || job.title.toLowerCase().includes("manager");
  
  let expScore = 20;
  if (profile.experienceLevel === "entry" && (isSeniorJob || isLeadJob)) expScore = 5;
  if (profile.experienceLevel === "senior" && !isSeniorJob) expScore = 15;
  score += expScore;

  // 4. Recency (10%)
  // Mock logic: assume newer jobs have higher score (parsed from postedDate if possible)
  score += 10; 

  // STEP 5: MATCH EXPLANATION ENGINE
  const explanation = `Matches your ${matchedSkills.slice(0, 2).join(" + ")} skills and ${profile.experienceLevel} requirement.`;

  return {
    ...job,
    matchScore: Math.round(score),
    matchedSkills,
    missingSkills,
    explanation
  };
}
