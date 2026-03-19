"use client";

import { useState } from "react";
import styles from "./form.module.css";
import dynamic from "next/dynamic";

const ResumeEditor = dynamic(() => import("./ResumeEditor"), { ssr: false });

export default function ResumeForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [atsScore, setAtsScore] = useState<any>(null);
  const [improvements, setImprovements] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Data state
  const [qualifications, setQualifications] = useState("");
  const [experiences, setExperiences] = useState("");
  const [projects, setProjects] = useState("");
  
  // File state (array of objects to hold descriptions)
  const [files, setFiles] = useState<{file: File, description: string}[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({ file: f, description: "" }));
      setFiles((prev) => [...prev, ...newFiles]);
      e.target.value = '';
    }
  };

  const updateFileDescription = (index: number, desc: string) => {
    const updated = [...files];
    updated[index].description = desc;
    setFiles(updated);
  };

  const removeFile = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  const generateAIResume = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("qualifications", qualifications);
      formData.append("experiences", experiences);
      formData.append("projects", projects);
      
      files.forEach((item, i) => {
        formData.append("files", item.file);
        formData.append(`fileDesc_${i}`, item.description);
      });

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        console.log("AI Resume Built:", data.resume);
        setResumeData(data.resume);
        setAtsScore(data.ats_score || null);
        setImprovements(data.improvements || []);
        setSuggestions(data.suggestions || []);
      } else {
        alert("Generation failed: " + data.error);
      }
    } catch (e) {
      alert("Error generating resume");
    } finally {
      setLoading(false);
    }
  };

  if (resumeData) {
    return (
      <ResumeEditor 
        data={resumeData} 
        atsScore={atsScore}
        improvements={improvements}
        suggestions={suggestions}
        onBack={() => { setResumeData(null); setAtsScore(null); setImprovements([]); setSuggestions([]); }} 
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wizard}>
        <div className={styles.header}>
          <h2>
            {step === 1 ? "Qualifications & Studies" 
            : step === 2 ? "Experiences & Knowledge" 
            : step === 3 ? "Current Projects" 
            : "Upload Documents"}
          </h2>
          <div className={styles.progress}>
            Step {step} of 4
          </div>
        </div>

        <div className={styles.content}>
          {step === 1 && (
            <div className={styles.formGroup}>
              <label>Degree / Qualification Details</label>
              <textarea 
                value={qualifications} 
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="e.g. B.S. in Computer Science at Stanford (2026)" 
                rows={4}
              />
            </div>
          )}

          {step === 2 && (
            <div className={styles.formGroup}>
              <label>Professional Experiences & Skills</label>
              <textarea 
                value={experiences}
                onChange={(e) => setExperiences(e.target.value)}
                placeholder="e.g. Software Engineer at Google. Built React apps. Skills: Node.js, Python, SQL" 
                rows={4}
              />
            </div>
          )}

          {step === 3 && (
            <div className={styles.formGroup}>
              <label>Notable Projects</label>
              <textarea 
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                placeholder="e.g. AI Resume Creator using Next.js and Gemini AI." 
                rows={4}
              />
            </div>
          )}

          {step === 4 && (
            <div className={styles.formGroup}>
              <label>Upload Supporting Documents (Optional)</label>
              <p style={{ color: "var(--color-navy)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                Upload Project PPTs, Certificates, or existing resumes (PDF format). Our AI will scan them to build a highly detailed resume.
              </p>
              
              <div style={{
                border: "2px dashed rgba(0, 119, 182, 0.4)", 
                padding: "2rem", 
                textAlign: "center", 
                borderRadius: "10px",
                background: "rgba(255,255,255,0.5)",
                marginBottom: "1rem"
              }}>
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,.ppt,.pptx" 
                  onChange={handleFileChange}
                />
              </div>

              {files.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {files.map((item, index) => (
                    <div key={index} style={{ background: "white", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <strong style={{ color: "var(--color-navy)" }}>{item.file.name}</strong>
                        <button onClick={() => removeFile(index)} style={{ color: "red", background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}>X Remove</button>
                      </div>
                      <input 
                        type="text" 
                        value={item.description}
                        onChange={(e) => updateFileDescription(index, e.target.value)}
                        placeholder="Add context to this file (e.g., 'My old resume', 'Project slides')"
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
                      />
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button 
            className={styles.buttonSecondary} 
            disabled={step === 1 || loading}
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
          
          <button 
            className={styles.buttonPrimary}
            disabled={loading}
            onClick={() => step < 4 ? setStep(step + 1) : generateAIResume()}
          >
            {loading ? "AI is Generating..." : (step === 4 ? "Generate Resume via AI" : "Next Step")}
          </button>
        </div>
      </div>
    </div>
  );
}
