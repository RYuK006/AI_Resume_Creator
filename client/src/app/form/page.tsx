"use client";

import { useState } from "react";
import styles from "./form.module.css";

export default function ResumeForm() {
  const [step, setStep] = useState(1);

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
              <label>Degree / Qualification</label>
              <input type="text" placeholder="e.g. B.S. in Computer Science" />
              
              <label>University / School</label>
              <input type="text" placeholder="e.g. Stanford University" />
              
              <label>Graduation Year</label>
              <input type="text" placeholder="e.g. 2026" />
            </div>
          )}

          {step === 2 && (
             <div className={styles.formGroup}>
               <label>Current/Recent Job Title</label>
               <input type="text" placeholder="e.g. Software Engineer" />
               
               <label>Company Name</label>
               <input type="text" placeholder="e.g. Google" />
               
               <label>Key Skills & Knowledge (Comma separated)</label>
               <input type="text" placeholder="e.g. React, Node.js, Python, SQL" />
             </div>
          )}

          {step === 3 && (
             <div className={styles.formGroup}>
               <label>Project Title</label>
               <input type="text" placeholder="e.g. AI Resume Creator" />
               
               <label>Project Description</label>
               <input type="text" placeholder="What did you build? What technologies did you use?" />
               
               <label>GitHub / Live Link</label>
               <input type="text" placeholder="e.g. https://github.com/..." />
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
                 background: "rgba(255,255,255,0.5)"
               }}>
                 <input type="file" multiple accept=".pdf,.ppt,.pptx" />
               </div>
             </div>
          )}
        </div>

        <div className={styles.footer}>
          <button 
            className={styles.buttonSecondary} 
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
          
          <button 
            className={styles.buttonPrimary}
            onClick={() => step < 4 ? setStep(step + 1) : alert("Files queued! Sending data to AI...")}
          >
            {step === 4 ? "Generate Resume via AI" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}
