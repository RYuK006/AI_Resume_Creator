"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import styles from "./editor.module.css";
import generatePDF from "react-to-pdf";
import { Download, ArrowLeft, RefreshCw, Wand2, Briefcase } from "lucide-react";

interface ResumeEditorProps {
  data: any;
  atsScore?: any;
  improvements?: any[];
  suggestions?: string[];
  onBack: () => void;
}

export default function ResumeEditor({ data, atsScore: initialAts, improvements: initialImprovements, suggestions: initialSuggestions, onBack }: ResumeEditorProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<"modern" | "minimal" | "faang">("modern");
  const [reanalyzing, setReanalyzing] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [atsScore, setAtsScore] = useState(initialAts || null);
  const [improvements, setImprovements] = useState(initialImprovements || []);
  const [suggestions, setSuggestions] = useState(initialSuggestions || []);
  const [toast, setToast] = useState<string | null>(null);

  // Job Match state
  const [showJdPanel, setShowJdPanel] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Get ATS bar color
  const getAtsColor = (score: number) => {
    if (score <= 50) return "#ef4444";
    if (score <= 75) return "#f59e0b";
    return "#10b981";
  };

  const handleDownloadPdf = () => {
    generatePDF(targetRef, {
      filename: `${data?.basics?.name || "Resume"}_${template}.pdf`,
      page: { margin: 0 }
    });
  };

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  // Re-analyze with template context
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

  // Re-analyze when template changes
  const handleTemplateChange = (tmpl: "modern" | "minimal" | "faang") => {
    setTemplate(tmpl);
    handleReanalyze(tmpl);
  };

  // Fix My Resume — apply improvements directly
  const handleFixResume = async () => {
    if (!targetRef.current) return;
    setFixing(true);
    try {
      // First get fresh improvements
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
            html = html.replace(imp.original, `<strong>${imp.improved}</strong>`);
            applied++;
          }
        }
        if (applied > 0) {
          targetRef.current.innerHTML = html;
          showToast(`✅ Resume improved! ${applied} bullet(s) upgraded.`);
        } else {
          // Fallback: try text-level replacement
          let text = targetRef.current.innerText;
          for (const imp of result.improvements) {
            if (imp.original && imp.improved) {
              const escaped = imp.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const regex = new RegExp(escaped.substring(0, Math.min(40, escaped.length)), 'i');
              if (regex.test(text)) {
                html = html.replace(regex, imp.improved);
                applied++;
              }
            }
          }
          if (applied > 0) {
            targetRef.current.innerHTML = html;
            showToast(`✅ Resume improved! ${applied} fix(es) applied.`);
          } else {
            showToast("No matching text found to fix. Try re-generating.");
          }
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

  // Click-to-add: insert keyword into Skills section
  const addKeywordToResume = (keyword: string) => {
    if (!targetRef.current) return;
    const skillsSection = targetRef.current.querySelectorAll('[class*="skillPill"]');
    if (skillsSection.length > 0) {
      const lastSkill = skillsSection[skillsSection.length - 1];
      const newSkill = document.createElement('span');
      newSkill.className = lastSkill.className;
      newSkill.contentEditable = "true";
      newSkill.textContent = keyword;
      newSkill.style.background = "#dcfce7";
      newSkill.style.color = "#065f46";
      lastSkill.parentElement?.appendChild(newSkill);
      showToast(`Added "${keyword}" to Skills!`);
    } else {
      showToast(`Keyword "${keyword}" copied — paste it into the resume.`);
    }
  };

  // Click-to-add: apply an improvement
  const applyImprovement = (imp: any) => {
    if (!targetRef.current || !imp.original || !imp.improved) return;
    let html = targetRef.current.innerHTML;
    if (html.includes(imp.original)) {
      html = html.replace(imp.original, imp.improved);
      targetRef.current.innerHTML = html;
      showToast("Improvement applied!");
    } else {
      showToast("Text not found — it may have already been changed.");
    }
  };

  // Click-to-add: insert suggestion text
  const applySuggestion = (text: string) => {
    if (!targetRef.current) return;
    const lastSection = targetRef.current.lastElementChild;
    if (lastSection) {
      const newItem = document.createElement('li');
      newItem.className = `${styles.bullet} ${styles.editable}`;
      newItem.contentEditable = "true";
      newItem.textContent = text;
      newItem.style.background = "#dcfce7";
      const bullets = lastSection.querySelector('ul');
      if (bullets) {
        bullets.appendChild(newItem);
      }
      showToast("Suggestion added to resume!");
    }
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

  // Apply optimized resume from job match
  const applyOptimizedResume = () => {
    if (!matchResult?.optimizedResume) return;
    // Reload the page with optimized data (simplest approach)
    window.location.reload();
  };

  const templateClass = template === "minimal" ? styles.templateMinimal : template === "faang" ? styles.templateFaang : styles.templateModern;
  const overallScore = atsScore?.overall || 0;

  return (
    <div className={styles.editorContainer}>
      
      {/* Rich Text Formatting Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <select className={styles.toolSelect} onChange={(e) => exec("fontName", e.target.value)} defaultValue="Inter">
            <option value="Inter">Inter</option>
            <option value="Georgia">Georgia</option>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier</option>
            <option value="Times New Roman">Times</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>
        <div className={styles.toolbarGroup}>
          <select className={styles.toolSelect} onChange={(e) => exec("fontSize", e.target.value)} defaultValue="3">
            <option value="1">S</option>
            <option value="2">M</option>
            <option value="3">L</option>
            <option value="4">XL</option>
            <option value="5">2XL</option>
          </select>
        </div>
        <div className={styles.toolbarGroup}>
          <button className={styles.toolBtn} onClick={() => exec("bold")} title="Bold"><b>B</b></button>
          <button className={styles.toolBtn} onClick={() => exec("italic")} title="Italic"><i>I</i></button>
          <button className={styles.toolBtn} onClick={() => exec("underline")} title="Underline"><u>U</u></button>
        </div>
        <div className={styles.toolbarGroup}>
          <button className={styles.toolBtn} onClick={() => exec("justifyLeft")} title="Left">⫷</button>
          <button className={styles.toolBtn} onClick={() => exec("justifyCenter")} title="Center">⫶</button>
          <button className={styles.toolBtn} onClick={() => exec("justifyRight")} title="Right">⫸</button>
        </div>
        <div className={styles.toolbarGroup}>
          <input type="color" className={styles.toolColorInput} onChange={(e) => exec("foreColor", e.target.value)} defaultValue="#333333" title="Text Color" />
        </div>
        <div className={styles.toolbarGroup}>
          <button className={styles.toolBtn} onClick={() => exec("removeFormat")} title="Clear">✕</button>
        </div>
      </div>

      {/* ===== ATS SCORE BAR ===== */}
      {atsScore && (
        <div className={styles.atsBarContainer}>
          <div className={styles.atsBarHeader}>
            <span className={styles.atsBarLabel}>ATS Score ({template.toUpperCase()} Template)</span>
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

      {/* Action Buttons */}
      <div className={styles.controls}>
        <button className={`${styles.actionButton} ${styles.secondary}`} onClick={onBack}>
          <ArrowLeft size={14} /> Exit
        </button>

        <div className={styles.templateSelector}>
          <button className={`${styles.templateBtn} ${template === "minimal" ? styles.activeTemplate : ""}`} onClick={() => handleTemplateChange("minimal")}>Minimal</button>
          <button className={`${styles.templateBtn} ${template === "modern" ? styles.activeTemplate : ""}`} onClick={() => handleTemplateChange("modern")}>Modern</button>
          <button className={`${styles.templateBtn} ${template === "faang" ? styles.activeTemplate : ""}`} onClick={() => handleTemplateChange("faang")}>FAANG</button>
        </div>

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

      {/* Job Description Panel */}
      {showJdPanel && (
        <div className={styles.jdPanel}>
          <div className={styles.scorePanelTitle}>🎯 Apply for this Job</div>
          <textarea
            className={styles.jdTextarea}
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <button className={`${styles.actionButton} ${styles.danger}`} onClick={handleJobMatch} disabled={matching}>
            <Briefcase size={14} /> {matching ? "Matching..." : "Match & Optimize Resume"}
          </button>

          {matchResult && (
            <div style={{ marginTop: "1rem" }}>
              <div className={styles.matchScoreBar}>
                <span className={styles.matchScoreValue} style={{ color: getAtsColor(matchResult.matchScore) }}>
                  {matchResult.matchScore}%
                </span>
                <span style={{ fontWeight: 600, color: "#666" }}>Job Match Score</span>
              </div>

              {matchResult.missingKeywords && matchResult.missingKeywords.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  <strong style={{ color: "var(--color-navy)", fontSize: "0.9rem" }}>Missing Keywords (click to add):</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.5rem" }}>
                    {matchResult.missingKeywords.map((kw: string, i: number) => (
                      <span key={i} className={styles.keywordChip} onClick={() => addKeywordToResume(kw)}>
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {matchResult.addedKeywords && matchResult.addedKeywords.length > 0 && (
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

      {/* A4 Page */}
      <div className={`${styles.a4Board} ${templateClass}`} ref={targetRef} style={{ marginTop: "1.5rem" }}>
        <div>
          <h1 className={`${styles.name} ${styles.editable}`} contentEditable suppressContentEditableWarning>{data?.basics?.name || "Your Name"}</h1>
          <div className={styles.contact}>
            <span className={styles.editable} contentEditable suppressContentEditableWarning>{data?.basics?.email || "email@example.com"}</span>
            {data?.basics?.profiles && data.basics.profiles.map((link: string, i: number) => (
              <span key={i} className={styles.editable} contentEditable suppressContentEditableWarning>| {link}</span>
            ))}
          </div>
        </div>

        {data?.basics?.summary && (
          <div>
            <h2 className={styles.sectionTitle} contentEditable suppressContentEditableWarning>Summary</h2>
            {Array.isArray(data.basics.summary) ? (
              <ul className={styles.bullets}>
                {data.basics.summary.map((point: string, i: number) => (
                  <li key={i} className={`${styles.bullet} ${styles.editable}`} contentEditable suppressContentEditableWarning>{point}</li>
                ))}
              </ul>
            ) : (
              <div className={`${styles.summary} ${styles.editable}`} contentEditable suppressContentEditableWarning>{data.basics.summary}</div>
            )}
          </div>
        )}

        {data?.skills && data.skills.length > 0 && (
          <div>
            <h2 className={styles.sectionTitle} contentEditable suppressContentEditableWarning>Skills</h2>
            <div className={styles.skillsContainer}>
              {data.skills.map((skill: string, i: number) => (
                <span key={i} className={`${styles.skillPill} ${styles.editable}`} contentEditable suppressContentEditableWarning>{skill}</span>
              ))}
            </div>
          </div>
        )}

        {data?.work && data.work.length > 0 && (
          <div>
            <h2 className={styles.sectionTitle} contentEditable suppressContentEditableWarning>Technical Experience</h2>
            {data.work.map((job: any, i: number) => (
              <div key={i} style={{ marginBottom: "0.75rem" }}>
                <div className={styles.itemHeader}>
                  <span className={`${styles.itemTitle} ${styles.editable}`} contentEditable suppressContentEditableWarning>{job.company}</span>
                  <span className={`${styles.itemDates} ${styles.editable}`} contentEditable suppressContentEditableWarning>{job.startDate} - {job.endDate}</span>
                </div>
                <div className={`${styles.itemSub} ${styles.editable}`} contentEditable suppressContentEditableWarning>{job.position}</div>
                <ul className={styles.bullets}>
                  {job.highlights?.map((b: string, j: number) => (
                    <li key={j} className={`${styles.bullet} ${styles.editable}`} contentEditable suppressContentEditableWarning>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data?.projects && data.projects.length > 0 && (
          <div>
            <h2 className={styles.sectionTitle} contentEditable suppressContentEditableWarning>Projects</h2>
            {data.projects.map((proj: any, i: number) => (
              <div key={i} style={{ marginBottom: "0.75rem" }}>
                <span className={`${styles.itemTitle} ${styles.editable}`} contentEditable suppressContentEditableWarning>{proj.name}</span>
                <div className={`${styles.summary} ${styles.editable}`} contentEditable suppressContentEditableWarning style={{ fontStyle: "italic", marginBottom: "0.2rem" }}>{proj.description}</div>
                <ul className={styles.bullets}>
                  {proj.highlights?.map((b: string, j: number) => (
                    <li key={j} className={`${styles.bullet} ${styles.editable}`} contentEditable suppressContentEditableWarning>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data?.education && data.education.length > 0 && (
          <div>
            <h2 className={styles.sectionTitle} contentEditable suppressContentEditableWarning>Education</h2>
            {data.education.map((edu: any, i: number) => (
              <div key={i} style={{ marginBottom: "0.5rem" }}>
                <div className={styles.itemHeader}>
                  <span className={`${styles.itemTitle} ${styles.editable}`} contentEditable suppressContentEditableWarning>{edu.institution}</span>
                  <span className={`${styles.itemDates} ${styles.editable}`} contentEditable suppressContentEditableWarning>{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className={`${styles.itemSub} ${styles.editable}`} contentEditable suppressContentEditableWarning>{edu.studyType} in {edu.area}</div>
              </div>
            ))}
          </div>
        )}

        {data?.achievements && data.achievements.length > 0 && (
          <div>
            <h2 className={styles.sectionTitle} contentEditable suppressContentEditableWarning>Achievements</h2>
            <ul className={styles.bullets}>
              {data.achievements.map((a: string, i: number) => (
                <li key={i} className={`${styles.bullet} ${styles.editable}`} contentEditable suppressContentEditableWarning>{a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ===== ANALYSIS PANELS ===== */}

      {/* Missing Keywords — Click to Add */}
      {atsScore?.missing_keywords && atsScore.missing_keywords.length > 0 && (
        <div className={styles.scorePanel}>
          <div className={styles.scorePanelTitle}>🔑 Missing Keywords <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 400 }}>(click to add to resume)</span></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            {atsScore.missing_keywords.map((kw: string, i: number) => (
              <span key={i} className={styles.keywordChip} onClick={() => addKeywordToResume(kw)}>
                + {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weak Bullets */}
      {atsScore?.weak_bullets && atsScore.weak_bullets.length > 0 && (
        <div className={styles.scorePanel}>
          <div className={styles.scorePanelTitle}>⚠️ Weak Bullet Points</div>
          {atsScore.weak_bullets.map((wb: string, i: number) => (
            <div key={i} className={styles.weakBullet}>{wb}</div>
          ))}
        </div>
      )}

      {/* Sections to Improve — Click to Add */}
      {atsScore?.sections_to_improve && atsScore.sections_to_improve.length > 0 && (
        <div className={styles.scorePanel}>
          <div className={styles.scorePanelTitle}>📋 Sections to Improve <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 400 }}>(click to add suggestion)</span></div>
          {atsScore.sections_to_improve.map((s: string, i: number) => (
            <div key={i} className={styles.suggestionItem} onClick={() => applySuggestion(s)}>
              <span>{s}</span>
              <span className={styles.addBadge}>+ ADD</span>
            </div>
          ))}
        </div>
      )}

      {/* AI Improvements — Click to Apply */}
      {improvements && improvements.length > 0 && (
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

      {/* Smart Suggestions — Click to Add */}
      {suggestions && suggestions.length > 0 && (
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

      {/* Toast */}
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
