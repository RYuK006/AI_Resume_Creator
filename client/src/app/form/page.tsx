"use client";

import { useState, useRef } from "react";
import styles from "./form.module.css";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const ResumeEditor = dynamic(() => import("./ResumeEditor"), { ssr: false });

/* Material Symbols helper */
const Icon = ({ name, fill, className = "" }: { name: string; fill?: boolean; className?: string }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);

const STEPS = [
  { icon: "school", label: "Qualifications & Studies", sublabel: "Your educational background" },
  { icon: "work", label: "Experiences & Knowledge", sublabel: "Professional history and skills" },
  { icon: "code", label: "Current Projects", sublabel: "Showcase your best work" },
  { icon: "upload_file", label: "Upload Documents", sublabel: "Supporting files (optional)" },
];

const fadeVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } }
};

export default function ResumeForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [atsScore, setAtsScore] = useState<any>(null);
  const [improvements, setImprovements] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const [qualifications, setQualifications] = useState("");
  const [experiences, setExperiences] = useState("");
  const [projects, setProjects] = useState("");
  const [files, setFiles] = useState<{file: File, description: string}[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const currentStep = STEPS[step - 1];

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={styles.wizard}
      >
        {/* Step indicators — 4 dots */}
        <div className={styles.stepIndicators}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`${styles.stepDot} ${i + 1 === step ? styles.stepDotActive : ""} ${i + 1 < step ? styles.stepDotDone : ""}`}
            />
          ))}
        </div>

        {/* Header with icon */}
        <div className={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className={styles.stepIcon}>
              <Icon name={currentStep.icon} fill className="text-2xl" />
            </div>
            <div>
              <h2>{currentStep.label}</h2>
              <div className={styles.stepLabel}>{currentStep.sublabel}</div>
            </div>
          </div>
          <div className={styles.progress}>
            Step {step}/4
          </div>
        </div>

        {/* Content with animated transitions */}
        <div className={styles.content}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={fadeVariant} initial="hidden" animate="visible" exit="exit" className={styles.formGroup}>
                <label>Degree / Qualification Details</label>
                <textarea 
                  value={qualifications} 
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="e.g. B.S. in Computer Science at Stanford (2026)" 
                  rows={5}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={fadeVariant} initial="hidden" animate="visible" exit="exit" className={styles.formGroup}>
                <label>Professional Experiences & Skills</label>
                <textarea 
                  value={experiences}
                  onChange={(e) => setExperiences(e.target.value)}
                  placeholder="e.g. Software Engineer at Google. Built React apps. Skills: Node.js, Python, SQL" 
                  rows={5}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={fadeVariant} initial="hidden" animate="visible" exit="exit" className={styles.formGroup}>
                <label>Notable Projects</label>
                <textarea 
                  value={projects}
                  onChange={(e) => setProjects(e.target.value)}
                  placeholder="e.g. AI Resume Creator using Next.js and Gemini AI." 
                  rows={5}
                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={fadeVariant} initial="hidden" animate="visible" exit="exit" className={styles.formGroup}>
                <label>Upload Supporting Documents (Optional)</label>
                <p style={{ color: "var(--color-on-surface-variant)", fontSize: "0.9rem", marginBottom: "0.5rem", marginTop: 0 }}>
                  Upload project PPTs, certificates, or existing resumes. Our AI will scan them to build a highly detailed resume.
                </p>
                
                <div
                  className={`${styles.uploadZone} ${dragActive ? styles.uploadZoneDragActive : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
                  onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
                  onDrop={(e) => {
                    e.preventDefault(); e.stopPropagation(); setDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      const newFiles = Array.from(e.dataTransfer.files).map(f => ({ file: f, description: "" }));
                      setFiles(prev => [...prev, ...newFiles]);
                    }
                  }}
                >
                  <span className="material-symbols-outlined text-4xl block mx-auto mb-2" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 0" }}>cloud_upload</span>
                  <p style={{ color: "var(--color-on-surface-variant)", fontSize: "0.85rem", margin: "0 0 0.5rem 0", fontWeight: 600 }}>
                    {dragActive ? 'Drop files here' : 'Drag & drop or click to browse'}
                  </p>
                  <p style={{ color: "var(--color-outline)", fontSize: "0.75rem", margin: 0 }}>
                    PDF, PPT, PPTX accepted
                  </p>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple 
                    accept=".pdf,.ppt,.pptx" 
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>

                {files.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {files.map((item, index) => (
                      <div key={index} className={styles.fileCard}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                          <strong>
                            <Icon name="description" className="text-sm align-middle mr-1" />
                            {item.file.name}
                          </strong>
                          <button onClick={() => removeFile(index)} className={styles.fileRemoveBtn}>
                            <Icon name="close" className="text-sm" /> Remove
                          </button>
                        </div>
                        <input 
                          type="text" 
                          className={styles.fileDescInput}
                          value={item.description}
                          onChange={(e) => updateFileDescription(index, e.target.value)}
                          placeholder="Add context (e.g., 'My old resume', 'Project slides')"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer buttons */}
        <div className={styles.footer}>
          <button 
            className={styles.buttonSecondary} 
            disabled={step === 1 || loading}
            onClick={() => setStep(step - 1)}
          >
            <Icon name="arrow_back" className="text-sm" />
            Back
          </button>
          
          <button 
            className={styles.buttonPrimary}
            disabled={loading}
            onClick={() => step < 4 ? setStep(step + 1) : generateAIResume()}
          >
            {loading ? (
              <>
                <Icon name="progress_activity" className="text-sm animate-spin" />
                AI is Generating...
              </>
            ) : step === 4 ? (
              <>
                <Icon name="auto_awesome" fill className="text-sm" />
                Generate Resume via AI
              </>
            ) : (
              <>
                Next Step
                <Icon name="arrow_forward" className="text-sm" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
