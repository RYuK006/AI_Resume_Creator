"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import styles from "./editor.module.css";
import generatePDF from "react-to-pdf";
import { Download, ArrowLeft, RefreshCw, Wand2, Briefcase, List, ListOrdered, Minus, Undo2, Redo2 } from "lucide-react";

interface ResumeEditorProps {
  data: any;
  atsScore?: any;
  improvements?: any[];
  suggestions?: string[];
  onBack: () => void;
}

// Generate the full resume HTML from structured JSON — this becomes the initial editable document
function buildResumeHTML(data: any): string {
  if (!data) return "<p>No resume data.</p>";

  let html = "";

  // Name
  html += `<h1 style="text-align:center;margin:0 0 4px 0;">${data.basics?.name || "Your Name"}</h1>`;

  // Contact line
  const contactParts = [data.basics?.email || "email@example.com"];
  if (data.basics?.profiles) {
    contactParts.push(...data.basics.profiles);
  }
  html += `<p style="text-align:center;color:#666;font-size:0.9rem;border-bottom:2px solid #0077B6;padding-bottom:8px;margin-bottom:12px;">${contactParts.join(" | ")}</p>`;

  // Summary
  if (data.basics?.summary) {
    html += `<h2>Summary</h2>`;
    if (Array.isArray(data.basics.summary)) {
      html += `<ul>${data.basics.summary.map((s: string) => `<li>${s}</li>`).join("")}</ul>`;
    } else {
      html += `<p>${data.basics.summary}</p>`;
    }
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    html += `<h2>Skills</h2>`;
    html += `<p>${data.skills.join(" &nbsp;•&nbsp; ")}</p>`;
  }

  // Technical Experience
  if (data.work && data.work.length > 0) {
    html += `<h2>Technical Experience</h2>`;
    for (const job of data.work) {
      html += `<p style="margin-bottom:2px;"><strong>${job.company || ""}</strong> <span style="float:right;color:#777;font-style:italic;font-size:0.85rem;">${job.startDate || ""} – ${job.endDate || ""}</span></p>`;
      html += `<p style="color:#0077B6;font-weight:600;margin-top:0;">${job.position || ""}</p>`;
      if (job.highlights && job.highlights.length > 0) {
        html += `<ul>${job.highlights.map((h: string) => `<li>${h}</li>`).join("")}</ul>`;
      }
    }
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    html += `<h2>Projects</h2>`;
    for (const proj of data.projects) {
      html += `<p style="margin-bottom:2px;"><strong>${proj.name || ""}</strong></p>`;
      if (proj.description) {
        html += `<p style="font-style:italic;color:#555;margin-top:0;">${proj.description}</p>`;
      }
      if (proj.highlights && proj.highlights.length > 0) {
        html += `<ul>${proj.highlights.map((h: string) => `<li>${h}</li>`).join("")}</ul>`;
      }
    }
  }

  // Education
  if (data.education && data.education.length > 0) {
    html += `<h2>Education</h2>`;
    for (const edu of data.education) {
      html += `<p style="margin-bottom:2px;"><strong>${edu.institution || ""}</strong> <span style="float:right;color:#777;font-style:italic;font-size:0.85rem;">${edu.startDate || ""} – ${edu.endDate || ""}</span></p>`;
      html += `<p style="margin-top:0;color:#0077B6;font-weight:600;">${edu.studyType || ""} in ${edu.area || ""}</p>`;
    }
  }

  // Achievements
  if (data.achievements && data.achievements.length > 0) {
    html += `<h2>Achievements</h2>`;
    html += `<ul>${data.achievements.map((a: string) => `<li>${a}</li>`).join("")}</ul>`;
  }

  return html;
}

type TemplateName = "modern" | "minimal" | "faang" | "executive" | "creative" | "professional" | "tech";

export default function ResumeEditor({ data, atsScore: initialAts, improvements: initialImprovements, suggestions: initialSuggestions, onBack }: ResumeEditorProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<TemplateName>("modern");
  const [reanalyzing, setReanalyzing] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [atsScore, setAtsScore] = useState(initialAts || null);
  const [improvements, setImprovements] = useState(initialImprovements || []);
  const [suggestions, setSuggestions] = useState(initialSuggestions || []);
  const [toast, setToast] = useState<string | null>(null);
  const [showJdPanel, setShowJdPanel] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  // Build initial HTML once
  const initialHTML = useMemo(() => buildResumeHTML(data), [data]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getAtsColor = (score: number) => {
    if (score <= 50) return "#ef4444";
    if (score <= 75) return "#f59e0b";
    return "#10b981";
  };

  // ===== Rich Text Commands (Word-style) =====
  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    targetRef.current?.focus();
  };

  const handleDownloadPdf = () => {
    generatePDF(targetRef, {
      filename: `${data?.basics?.name || "Resume"}_${template}.pdf`,
      page: { margin: 0 }
    });
  };

  // Re-analyze
  const handleReanalyze = useCallback(async (tmpl?: string) => {
    if (!targetRef.current) return;
    setReanalyzing(true);
    try {
      const resumeText = targetRef.current.innerText;
      const res = await fetch("/api/reanalyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, templateType: tmpl || template }),
      });
      const result = await res.json();
      if (result.success) {
        setAtsScore(result.ats_score);
        setImprovements(result.improvements || []);
        setSuggestions(result.suggestions || []);
        showToast("Re-analysis complete!");
      } else {
        alert("Re-analysis failed: " + result.error);
      }
    } catch (e) {
      alert("Error during re-analysis");
    } finally {
      setReanalyzing(false);
    }
  }, [template]);

  const handleTemplateChange = (tmpl: TemplateName) => {
    setTemplate(tmpl);
    // Re-analyze with new template context
    handleReanalyze(tmpl);
  };

  // Fix My Resume
  const handleFixResume = async () => {
    if (!targetRef.current) return;
    setFixing(true);
    try {
      const resumeText = targetRef.current.innerText;
      const res = await fetch("/api/reanalyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, templateType: template }),
      });
      const result = await res.json();
      if (result.success && result.improvements && result.improvements.length > 0) {
        let html = targetRef.current.innerHTML;
        let applied = 0;
        for (const imp of result.improvements) {
          if (imp.original && imp.improved && html.includes(imp.original)) {
            html = html.replace(imp.original, imp.improved);
            applied++;
          }
        }
        if (applied > 0) {
          targetRef.current.innerHTML = html;
          showToast(`✅ ${applied} improvement(s) applied!`);
        } else {
          showToast("Resume already looks strong!");
        }
        setAtsScore(result.ats_score);
        setImprovements(result.improvements || []);
        setSuggestions(result.suggestions || []);
      } else {
        showToast("Resume is already well-optimized!");
      }
    } catch (e) {
      alert("Error fixing resume");
    } finally {
      setFixing(false);
    }
  };

  // Click-to-add keyword
  const addKeywordToResume = (keyword: string) => {
    if (!targetRef.current) return;
    const html = targetRef.current.innerHTML;
    // Find the Skills section and append
    const skillsIdx = html.indexOf(">Skills</h2>");
    if (skillsIdx !== -1) {
      const afterSkills = html.substring(skillsIdx);
      const pEnd = afterSkills.indexOf("</p>");
      if (pEnd !== -1) {
        const insertAt = skillsIdx + pEnd;
        const before = html.substring(0, insertAt);
        const after = html.substring(insertAt);
        targetRef.current.innerHTML = before + ` &nbsp;•&nbsp; <span style="background:#dcfce7;padding:0 4px;border-radius:4px;">${keyword}</span>` + after;
        showToast(`Added "${keyword}" to Skills!`);
        return;
      }
    }
    showToast(`Keyword "${keyword}" — paste it where needed.`);
  };

  // Click-to-apply improvement
  const applyImprovement = (imp: any) => {
    if (!targetRef.current || !imp.original || !imp.improved) return;
    let html = targetRef.current.innerHTML;
    if (html.includes(imp.original)) {
      html = html.replace(imp.original, imp.improved);
      targetRef.current.innerHTML = html;
      showToast("Improvement applied!");
    } else {
      showToast("Text not found — may have been changed already.");
    }
  };

  // Click-to-add suggestion
  const applySuggestion = (text: string) => {
    if (!targetRef.current) return;
    // Append as a new bullet at the end
    targetRef.current.innerHTML += `<ul><li style="background:#dcfce7;padding:2px 4px;border-radius:4px;">${text}</li></ul>`;
    showToast("Suggestion added!");
  };

  // Job Match
  const handleJobMatch = async () => {
    if (!targetRef.current || !jobDescription.trim()) {
      alert("Please paste a job description first.");
      return;
    }
    setMatching(true);
    try {
      const resumeText = targetRef.current.innerText;
      const res = await fetch("/api/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      const result = await res.json();
      if (result.success) {
        setMatchResult(result);
        showToast(`Job match: ${result.matchScore}%`);
      } else {
        alert("Job match failed: " + result.error);
      }
    } catch (e) {
      alert("Error matching job");
    } finally {
      setMatching(false);
    }
  };

  const templateClass = styles[`template_${template}`] || "";
  const overallScore = atsScore?.overall || 0;

  return (
    <div className={styles.editorContainer}>
      
      {/* ===== WORD-STYLE FORMATTING TOOLBAR ===== */}
      <div className={styles.toolbar}>
        {/* Font */}
        <div className={styles.toolbarGroup}>
          <select className={styles.toolSelect} onChange={(e) => exec("fontName", e.target.value)} defaultValue="Inter" style={{ width: "90px" }}>
            <option value="Inter">Inter</option>
            <option value="Georgia">Georgia</option>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier</option>
            <option value="Times New Roman">Times NR</option>
            <option value="Verdana">Verdana</option>
            <option value="Calibri">Calibri</option>
            <option value="Garamond">Garamond</option>
          </select>
        </div>

        {/* Size */}
        <div className={styles.toolbarGroup}>
          <select className={styles.toolSelect} onChange={(e) => exec("fontSize", e.target.value)} defaultValue="3" style={{ width: "50px" }}>
            <option value="1">8</option>
            <option value="2">10</option>
            <option value="3">12</option>
            <option value="4">14</option>
            <option value="5">18</option>
            <option value="6">24</option>
            <option value="7">36</option>
          </select>
        </div>

        {/* Bold/Italic/Underline/Strikethrough */}
        <div className={styles.toolbarGroup}>
          <button className={styles.toolBtn} onClick={() => exec("bold")} title="Bold (Ctrl+B)"><b>B</b></button>
          <button className={styles.toolBtn} onClick={() => exec("italic")} title="Italic (Ctrl+I)"><i>I</i></button>
          <button className={styles.toolBtn} onClick={() => exec("underline")} title="Underline (Ctrl+U)"><u>U</u></button>
          <button className={styles.toolBtn} onClick={() => exec("strikeThrough")} title="Strikethrough"><s>S</s></button>
        </div>

        {/* Alignment */}
        <div className={styles.toolbarGroup}>
          <button className={styles.toolBtn} onClick={() => exec("justifyLeft")} title="Left">⫷</button>
          <button className={styles.toolBtn} onClick={() => exec("justifyCenter")} title="Center">⫶</button>
          <button className={styles.toolBtn} onClick={() => exec("justifyRight")} title="Right">⫸</button>
          <button className={styles.toolBtn} onClick={() => exec("justifyFull")} title="Justify">☰</button>
        </div>

        {/* Lists */}
        <div className={styles.toolbarGroup}>
          <button className={styles.toolBtn} onClick={() => exec("insertUnorderedList")} title="Bullet List"><List size={14} /></button>
          <button className={styles.toolBtn} onClick={() => exec("insertOrderedList")} title="Numbered List"><ListOrdered size={14} /></button>
          <button className={styles.toolBtn} onClick={() => exec("insertHorizontalRule")} title="Horizontal Line"><Minus size={14} /></button>
        </div>

        {/* Indent */}
        <div className={styles.toolbarGroup}>
          <button className={styles.toolBtn} onClick={() => exec("indent")} title="Indent">→</button>
          <button className={styles.toolBtn} onClick={() => exec("outdent")} title="Outdent">←</button>
        </div>

        {/* Colors */}
        <div className={styles.toolbarGroup}>
          <label className={styles.toolBtn} title="Text Color" style={{ position: "relative" }}>
            <span style={{ color: "#333" }}>A</span>
            <input type="color" onChange={(e) => exec("foreColor", e.target.value)} defaultValue="#333333" style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", top: 0, left: 0, cursor: "pointer" }} />
          </label>
          <label className={styles.toolBtn} title="Highlight Color" style={{ position: "relative" }}>
            <span style={{ background: "#fef08a", padding: "0 4px", borderRadius: "2px" }}>H</span>
            <input type="color" onChange={(e) => exec("hiliteColor", e.target.value)} defaultValue="#fef08a" style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", top: 0, left: 0, cursor: "pointer" }} />
          </label>
        </div>

        {/* Undo/Redo/Clear */}
        <div className={styles.toolbarGroup}>
          <button className={styles.toolBtn} onClick={() => exec("undo")} title="Undo"><Undo2 size={14} /></button>
          <button className={styles.toolBtn} onClick={() => exec("redo")} title="Redo"><Redo2 size={14} /></button>
          <button className={styles.toolBtn} onClick={() => exec("removeFormat")} title="Clear Formatting">✕</button>
        </div>
      </div>

      {/* ===== ATS SCORE BAR ===== */}
      {atsScore && (
        <div className={styles.atsBarContainer}>
          <div className={styles.atsBarHeader}>
            <span className={styles.atsBarLabel}>ATS Score ({template.charAt(0).toUpperCase() + template.slice(1)} Template)</span>
            <span className={styles.atsBarValue} style={{ color: getAtsColor(overallScore) }}>{overallScore}/100</span>
          </div>
          <div className={styles.atsBarTrack}>
            <div className={styles.atsBarFill} style={{ width: `${overallScore}%`, background: getAtsColor(overallScore) }}>
              {overallScore}%
            </div>
          </div>
          <div className={styles.atsBarMini}>
            <div className={styles.atsMiniItem}>
              <span className={styles.atsMiniValue}>{atsScore.keyword_match || 0}%</span>
              <span className={styles.atsMiniLabel}>Keywords</span>
            </div>
            <div className={styles.atsMiniItem}>
              <span className={styles.atsMiniValue}>{atsScore.readability || 0}</span>
              <span className={styles.atsMiniLabel}>Readability</span>
            </div>
            <div className={styles.atsMiniItem}>
              <span className={styles.atsMiniValue}>{atsScore.formatting || 0}</span>
              <span className={styles.atsMiniLabel}>Formatting</span>
            </div>
          </div>
        </div>
      )}

      {/* ===== CONTROLS ===== */}
      <div className={styles.controls}>
        <button className={`${styles.actionButton} ${styles.secondary}`} onClick={onBack}>
          <ArrowLeft size={14} /> Exit
        </button>

        <div className={styles.templateSelector}>
          {(["minimal", "modern", "faang", "executive", "creative", "professional", "tech"] as TemplateName[]).map((t) => (
            <button key={t} className={`${styles.templateBtn} ${template === t ? styles.activeTemplate : ""}`} onClick={() => handleTemplateChange(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controls}>
        <button className={`${styles.actionButton} ${styles.accent}`} onClick={() => handleReanalyze()} disabled={reanalyzing}>
          <RefreshCw size={14} /> {reanalyzing ? "Analyzing..." : "Re-Analyze"}
        </button>
        <button className={`${styles.actionButton} ${styles.purple}`} onClick={handleFixResume} disabled={fixing}>
          <Wand2 size={14} /> {fixing ? "Fixing..." : "Fix My Resume"}
        </button>
        <button className={`${styles.actionButton} ${styles.danger}`} onClick={() => setShowJdPanel(!showJdPanel)}>
          <Briefcase size={14} /> Apply for Job
        </button>
        <button className={styles.actionButton} onClick={handleDownloadPdf}>
          <Download size={14} /> Export PDF
        </button>
      </div>

      {/* ===== JOB MATCH PANEL ===== */}
      {showJdPanel && (
        <div className={styles.jdPanel}>
          <div className={styles.scorePanelTitle}>🎯 Apply for this Job</div>
          <textarea className={styles.jdTextarea} placeholder="Paste the full job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
          <button className={`${styles.actionButton} ${styles.danger}`} onClick={handleJobMatch} disabled={matching}>
            <Briefcase size={14} /> {matching ? "Matching..." : "Match & Optimize Resume"}
          </button>
          {matchResult && (
            <div style={{ marginTop: "1rem" }}>
              <div className={styles.matchScoreBar}>
                <span className={styles.matchScoreValue} style={{ color: getAtsColor(matchResult.matchScore) }}>{matchResult.matchScore}%</span>
                <span style={{ fontWeight: 600, color: "#666" }}>Job Match Score</span>
              </div>
              {matchResult.missingKeywords?.length > 0 && (
                <div style={{ marginTop: "0.75rem" }}>
                  <strong style={{ color: "var(--color-navy)", fontSize: "0.9rem" }}>Missing Keywords (click to add):</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.5rem" }}>
                    {matchResult.missingKeywords.map((kw: string, i: number) => (
                      <span key={i} className={styles.keywordChip} onClick={() => addKeywordToResume(kw)}>+ {kw}</span>
                    ))}
                  </div>
                </div>
              )}
              {matchResult.addedKeywords?.length > 0 && (
                <div style={{ marginTop: "0.75rem" }}>
                  <strong style={{ color: "#065f46", fontSize: "0.9rem" }}>Already Present:</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.5rem" }}>
                    {matchResult.addedKeywords.map((kw: string, i: number) => (
                      <span key={i} style={{ background: "#dcfce7", color: "#065f46", padding: "0.2rem 0.6rem", borderRadius: "6px", fontSize: "0.8rem" }}>✓ {kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== A4 PAGE — SINGLE EDITABLE DOCUMENT (WORD-STYLE) ===== */}
      <div
        className={`${styles.a4Board} ${templateClass}`}
        ref={targetRef}
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: initialHTML }}
        spellCheck={true}
        style={{ marginTop: "1.5rem" }}
      />

      {/* ===== ANALYSIS PANELS ===== */}
      {atsScore?.missing_keywords?.length > 0 && (
        <div className={styles.scorePanel}>
          <div className={styles.scorePanelTitle}>🔑 Missing Keywords <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 400 }}>(click to add)</span></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            {atsScore.missing_keywords.map((kw: string, i: number) => (
              <span key={i} className={styles.keywordChip} onClick={() => addKeywordToResume(kw)}>+ {kw}</span>
            ))}
          </div>
        </div>
      )}

      {atsScore?.weak_bullets?.length > 0 && (
        <div className={styles.scorePanel}>
          <div className={styles.scorePanelTitle}>⚠️ Weak Bullet Points</div>
          {atsScore.weak_bullets.map((wb: string, i: number) => (
            <div key={i} className={styles.weakBullet}>{wb}</div>
          ))}
        </div>
      )}

      {atsScore?.sections_to_improve?.length > 0 && (
        <div className={styles.scorePanel}>
          <div className={styles.scorePanelTitle}>📋 Sections to Improve <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 400 }}>(click to add)</span></div>
          {atsScore.sections_to_improve.map((s: string, i: number) => (
            <div key={i} className={styles.suggestionItem} onClick={() => applySuggestion(s)}>
              <span>{s}</span>
              <span className={styles.addBadge}>+ ADD</span>
            </div>
          ))}
        </div>
      )}

      {improvements?.length > 0 && (
        <div className={styles.scorePanel}>
          <div className={styles.scorePanelTitle}>🔧 AI Improvements <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 400 }}>(click to apply)</span></div>
          {improvements.map((imp: any, i: number) => (
            <div key={i} className={styles.improvementItem} onClick={() => applyImprovement(imp)}>
              <div className={styles.improvementOriginal}>❌ {imp.original}</div>
              <div className={styles.improvementFixed}>✅ {imp.improved}</div>
            </div>
          ))}
        </div>
      )}

      {suggestions?.length > 0 && (
        <div className={styles.scorePanel}>
          <div className={styles.scorePanelTitle}>💡 Smart Suggestions <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 400 }}>(click to add)</span></div>
          {suggestions.map((s: string, i: number) => (
            <div key={i} className={styles.suggestionItem} onClick={() => applySuggestion(s)}>
              <span>→ {s}</span>
              <span className={styles.addBadge}>+ ADD</span>
            </div>
          ))}
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
