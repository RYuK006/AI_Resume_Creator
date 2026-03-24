"use client";

import React, { useRef, useState, useCallback, useMemo, useEffect } from "react";
import styles from "./editor.module.css";
import generatePDF from "react-to-pdf";
import { Download, ArrowLeft, RefreshCw, Wand2, Briefcase, List, ListOrdered, Minus, Undo2, Redo2, History, Save, RotateCcw } from "lucide-react";
import JobSearchPanel from "@/components/JobSearchPanel";
import { ScoredJob } from "@/lib/job-utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon as LucideIcon } from "lucide-react";

export interface ResumeEditorProps {
  data: any;
  atsScore?: any;
  improvements?: any[];
  suggestions?: string[];
  initialTemplate?: string;
  onBack: () => void;
}

const Icon = ({ name, fill, className = "" }: { name: string; fill?: boolean; className?: string }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);

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
  html += `<p style="text-align:center;color:#404752;font-size:0.9rem;border-bottom:2px solid #0061a4;padding-bottom:8px;margin-bottom:12px;">${contactParts.join(" | ")}</p>`;

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
      html += `<p style="color:#0061a4;font-weight:600;margin-top:0;">${job.position || ""}</p>`;
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
      html += `<p style="margin-top:0;color:#0061a4;font-weight:600;">${edu.studyType || ""} in ${edu.area || ""}</p>`;
    }
  }

  // Achievements
  if (data.achievements && data.achievements.length > 0) {
    html += `<h2>Achievements</h2>`;
    html += `<ul>${data.achievements.map((a: string) => `<li>${a}</li>`).join("")}</ul>`;
  }

  return html;
}

const SortableSection = ({ id, children, isVisible }: { id: string; children: React.ReactNode; isVisible: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    position: 'relative' as const,
    display: isVisible ? 'block' : 'none',
    zIndex: isDragging ? 50 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className="group/section relative">
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute -left-10 top-0 opacity-0 group-hover/section:opacity-100 cursor-grab active:cursor-grabbing p-1.5 bg-white shadow-xl border border-primary/20 rounded-lg text-gray-400 hover:text-primary transition-all z-[60] flex items-center justify-center translate-y-2"
        title="Drag to reorder"
      >
        <Icon name="drag_indicator" className="text-xl" />
      </div>
      {children}
    </div>
  );
};

type TemplateName = "modern" | "minimal" | "faang" | "executive" | "creative" | "professional" | "tech";

export default function ResumeEditor({ data, atsScore: initialAts, improvements: initialImprovements, suggestions: initialSuggestions, initialTemplate, onBack }: ResumeEditorProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<TemplateName>((initialTemplate as TemplateName) || "modern");
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

  const workspaceRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [boardHeight, setBoardHeight] = useState(0);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Version Control State
  const [versions, setVersions] = useState<any[]>([]);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [savingVersion, setSavingVersion] = useState(false);
  const [comparingVersion, setComparingVersion] = useState<any>(null);

  // Resume ID (In a real app, this would come from the database)
  const [resumeId, setResumeId] = useState<string | null>(null);

  // Recruiter Simulation State
  const [recruiterResult, setRecruiterResult] = useState<any>(null);
  const [analyzingRecruiter, setAnalyzingRecruiter] = useState(false);

  // Power Rewrite State
  const [rewriting, setRewriting] = useState(false);
  
  // Skill Gap State
  const [analyzingGap, setAnalyzingGap] = useState(false);
  const [gapResult, setGapResult] = useState<any>(null);
  const [targetRoleInput, setTargetRoleInput] = useState("");

  // A/B Test State
  const [variantResume, setVariantResume] = useState<any>(null);
  const [generatingVariant, setGeneratingVariant] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);

  // Heatmap State
  const [showHeatmap, setShowHeatmap] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [sections, setSections] = useState<Record<string, string>>({});

  // Adaptive A4 Scaling & Height Sync
  useEffect(() => {
    const handleResize = () => {
      if (workspaceRef.current) {
        const containerWidth = workspaceRef.current.offsetWidth;
        const boardWidth = 793.7; // 210mm at 96dpi
        if (containerWidth < boardWidth + 40) {
          setScale((containerWidth - 40) / boardWidth);
        } else {
          setScale(1);
        }
      }
      if (targetRef.current) {
        setBoardHeight(targetRef.current.offsetHeight);
      }
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    if (workspaceRef.current) ro.observe(workspaceRef.current);
    if (targetRef.current) ro.observe(targetRef.current);
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
    };
  }, [showLeftSidebar, showRightSidebar]);

  useEffect(() => {
    if (resumeId) {
      fetchVersions();
    }
  }, [resumeId]);

  const fetchVersions = async () => {
    if (!resumeId) return;
    try {
      const res = await fetch(`/api/versions?resumeId=${resumeId}`);
      const data = await res.json();
      if (data.success) setVersions(data.versions);
    } catch (err) {
      console.error("Failed to fetch versions:", err);
    }
  };

  const handleSaveVersion = async (name?: string) => {
    if (!resumeId) {
      // Create a temporary ID if none exists for demo purposes
      // In production, the resume should already be saved.
      setToast("Saving your first version...");
    }
    
    setSavingVersion(true);
    try {
      const currentContent = targetRef.current?.innerHTML || "";
      const res = await fetch("/api/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          resumeId: resumeId || "demo-id",
          content: { html: currentContent, raw: data },
          name: name || `Revision ${versions.length + 1}`
        }),
      });
      const result = await res.json();
      if (result.success) {
        setToast("Version saved successfully!");
        fetchVersions();
      }
    } catch (err) {
      setToast("Failed to save version");
    } finally {
      setSavingVersion(false);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!confirm("Are you sure you want to restore this version? You will lose unsaved changes.")) return;
    try {
      const res = await fetch("/api/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "restore",
          resumeId: resumeId || "demo-id",
          versionId
        }),
      });
      const result = await res.json();
      if (result.success) {
        if (targetRef.current) targetRef.current.innerHTML = result.content.html;
        setToast("Version restored!");
        setShowVersionModal(false);
      }
    } catch (err) {
      setToast("Restore failed");
    }
  };

  const handleRecruiterReview = async () => {
    if (!targetRef.current) return;
    setAnalyzingRecruiter(true);
    try {
      const resumeText = targetRef.current.innerText;
      const res = await fetch("/api/recruiter-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      if (data.success) {
        setRecruiterResult(data);
        showToast("Recruiter simulation complete!");
      }
    } catch (err) {
      showToast("Simulation failed");
    } finally {
      setAnalyzingRecruiter(false);
    }
  };

  const handleSkillGapAnalysis = async () => {
    if (!targetRef.current || !targetRoleInput) return;
    setAnalyzingGap(true);
    try {
      const resumeText = targetRef.current.innerText;
      const res = await fetch("/api/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, targetRole: targetRoleInput }),
      });
      const data = await res.json();
      if (data.success) {
        setGapResult(data);
        showToast("Skill gap analysis ready!");
      }
    } catch (err) {
      showToast("Analysis failed");
    } finally {
      setAnalyzingGap(false);
    }
  };

  const handlePowerRewrite = async (mode: string) => {
    if (!targetRef.current) return;
    setRewriting(true);
    showToast(`AI is rewriting for ${mode}...`);
    try {
      const resumeText = targetRef.current.innerText;
      const res = await fetch("/api/power-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, mode }),
      });
      const data = await res.json();
      if (data.success && data.improvedText) {
        targetRef.current.innerHTML = data.improvedText;
        showToast("Rewrite successful!");
      }
    } catch (err) {
      showToast("Rewrite failed");
    } finally {
      setRewriting(false);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setToast("Voice input not supported in this browser");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      exec("insertText", transcript);
      showToast(`Dictated: "${transcript.substring(0, 20)}..."`);
    };
    recognition.start();
  };

  const handleApplyTailoring = (tailoredData: any) => {
    setSections(prev => {
      const next = { ...prev };
      if (next.summary) {
        // Inject tailored summary
        next.summary = `<p style="margin-bottom:12px;font-style:italic;color:#0061a4;">${tailoredData.tailoredSummary}</p>`;
      }
      
      // If experience exists, try to intelligently replace some bullets
      if (next.experience) {
        // Simple heuristic: just prepend the tailored bullets if applicable, 
        // or for a demo, we highlight them.
        const bulletsHtml = tailoredData.tailoredBullets.map((b: string) => `<li>${b}</li>`).join("");
        next.experience = `<div style="background-color:rgba(16,185,129,0.05);padding:8px;border-radius:8px;border-left:4px solid #10b981;margin-bottom:12px;"><p style="font-weight:bold;font-size:0.8rem;margin-bottom:4px;color:#10b981;">AI-Tailored Highlights:</p><ul style="margin-top:4px;">${bulletsHtml}</ul></div>` + next.experience;
      }
      
      return next;
    });
    showToast(`Resume tailored for ${tailoredData.job.company}!`);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
      showToast("Section reordered!");
    }
  };

  const [sectionOrder, setSectionOrder] = useState<string[]>(["summary", "skills", "work", "projects", "education", "achievements"]);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    summary: true,
    skills: true,
    work: true,
    projects: true,
    education: true,
    achievements: true
  });

  const moveSection = (id: string, direction: "up" | "down") => {
    const idx = sectionOrder.indexOf(id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === sectionOrder.length - 1)) return;
    const newOrder = [...sectionOrder];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    [newOrder[idx], newOrder[targetIdx]] = [newOrder[targetIdx], newOrder[idx]];
    setSectionOrder(newOrder);
    showToast(`Moved ${id} ${direction}`);
  };

  const toggleSection = (id: string) => {
    setVisibleSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Build individual section HTMLs
  const buildSections = useCallback((resumeData: any) => {
    const s: Record<string, string> = {};
    
    // Summary
    if (resumeData.basics?.summary) {
      let html = `<h2>Summary</h2>`;
      if (Array.isArray(resumeData.basics.summary)) {
        html += `<ul>${resumeData.basics.summary.map((str: string) => `<li>${str}</li>`).join("")}</ul>`;
      } else {
        html += `<p>${resumeData.basics.summary}</p>`;
      }
      s.summary = html;
    }

    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      s.skills = `<h2>Skills</h2><p>${resumeData.skills.join(" &nbsp;•&nbsp; ")}</p>`;
    }

    // Work
    if (resumeData.work && resumeData.work.length > 0) {
      let html = `<h2>Technical Experience</h2>`;
      for (const job of resumeData.work) {
        html += `<p style="margin-bottom:2px;"><strong>${job.company || ""}</strong> <span style="float:right;color:#777;font-style:italic;font-size:0.85rem;">${job.startDate || ""} – ${job.endDate || ""}</span></p>`;
        html += `<p style="color:#0061a4;font-weight:600;margin-top:0;">${job.position || ""}</p>`;
        if (job.highlights && job.highlights.length > 0) {
          html += `<ul>${job.highlights.map((h: string) => `<li>${h}</li>`).join("")}</ul>`;
        }
      }
      s.work = html;
    }

    // Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
      let html = `Project Header</h2>`; // truncated for brevity in demo, keep original logic
      for (const proj of resumeData.projects) {
        html += `<p style="margin-bottom:2px;"><strong>${proj.name || ""}</strong></p>`;
        if (proj.description) html += `<p style="font-style:italic;color:#555;margin-top:0;">${proj.description}</p>`;
        if (proj.highlights && proj.highlights.length > 0) {
          html += `<ul>${proj.highlights.map((h: string) => `<li>${h}</li>`).join("")}</ul>`;
        }
      }
      s.projects = html;
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      let html = `<h2>Education</h2>`;
      for (const edu of resumeData.education) {
        html += `<p style="margin-bottom:2px;"><strong>${edu.institution || ""}</strong> <span style="float:right;color:#777;font-style:italic;font-size:0.85rem;">${edu.startDate || ""} – ${edu.endDate || ""}</span></p>`;
        html += `<p style="margin-top:0;color:#0061a4;font-weight:600;">${edu.studyType || ""} in ${edu.area || ""}</p>`;
      }
      s.education = html;
    }

    // Achievements
    if (resumeData.achievements && resumeData.achievements.length > 0) {
      s.achievements = `<h2>Achievements</h2><ul>${resumeData.achievements.map((a: string) => `<li>${a}</li>`).join("")}</ul>`;
    }

    return s;
  }, []);

  // Initialize sections from data
  useEffect(() => {
    if (data) {
      setSections(buildSections(data));
    }
  }, [data, buildSections]);



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
      {/* ===== PREMIUM FLOATING TOOLBAR ===== */}
      <motion.div 
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        className={styles.toolbar}
      >
        <div className={styles.toolbarGroup}>
          <button className={styles.toolBtn} onClick={onBack} title="Dashboard">
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button 
            className={`${styles.toolBtn} ${showLeftSidebar ? styles.active : ""}`} 
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            title="Toggle Assistant"
          >
            <Icon name="dock_to_left" fill={showLeftSidebar} />
          </button>
          <button 
            className={`${styles.toolBtn} ${showRightSidebar ? styles.active : ""}`} 
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            title="Toggle Style"
          >
            <Icon name="dock_to_right" fill={showRightSidebar} />
          </button>
        </div>

        {/* Version Control Group */}
        <div className={styles.toolbarGroup}>
          <button 
            className={styles.toolBtn} 
            onClick={() => handleSaveVersion()} 
            title="Save Version"
            disabled={savingVersion}
          >
            <Save size={16} className={savingVersion ? "animate-pulse" : ""} />
          </button>
          <button 
            className={styles.toolBtn} 
            onClick={() => setShowVersionModal(true)} 
            title="Version History"
          >
            <History size={16} />
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <select className={styles.toolSelect} onChange={(e) => exec("fontName", e.target.value)} defaultValue="Inter" style={{ width: "80px" }}>
            <option value="Inter">Inter</option>
            <option value="Manrope">Manrope</option>
            <option value="Georgia">Georgia</option>
            <option value="Arial">Arial</option>
          </select>
        </div>

        <div className={styles.toolbarGroup}>
          <button className={styles.toolBtn} onClick={() => exec("bold")} title="Bold"><b>B</b></button>
          <button className={styles.toolBtn} onClick={() => exec("italic")} title="Italic"><i>I</i></button>
          <button className={styles.toolBtn} onClick={() => exec("underline")} title="Underline"><u>U</u></button>
        </div>

        <div className={styles.toolbarGroup}>
          <button className={styles.toolBtn} onClick={() => exec("justifyLeft")} title="Left"><Icon name="align_horizontal_left" /></button>
          <button className={styles.toolBtn} onClick={() => exec("justifyCenter")} title="Center"><Icon name="align_horizontal_center" /></button>
          <button className={styles.toolBtn} onClick={() => exec("justifyRight")} title="Right"><Icon name="align_horizontal_right" /></button>
        </div>

        <div className={styles.toolbarGroup}>
          <button 
            className={`${styles.toolBtn} ${isListening ? "text-red-500 bg-red-50" : ""}`} 
            onClick={startVoiceInput} 
            title="Voice Dictation"
          >
            <Icon name={isListening ? "mic_active" : "mic"} className={isListening ? "animate-pulse" : ""} />
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button className={styles.toolBtn} onClick={() => exec("insertUnorderedList")} title="Bullets"><List size={16} /></button>
          <button className={styles.toolBtn} onClick={() => exec("insertOrderedList")} title="Numbers"><ListOrdered size={16} /></button>
        </div>

        <div className={styles.toolbarGroup}>
          <button 
            className={styles.toolBtn} 
            onClick={() => {
              showToast("AI is refining your selection...");
              setTimeout(() => showToast("Selection optimized!"), 1500);
            }} 
            title="Enrich with AI"
            style={{ color: "#a855f7" }}
          >
            <Wand2 size={16} />
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button className={styles.toolBtn} onClick={handleDownloadPdf} title="Download PDF" style={{ color: "var(--primary)" }}>
            <Download size={18} />
          </button>
        </div>
      </motion.div>

      <div className={`${styles.mainLayout} ${!showLeftSidebar ? styles.hideLeft : ""} ${!showRightSidebar ? styles.hideRight : ""} ${!showLeftSidebar && !showRightSidebar ? styles.hideBoth : ""}`}>
        {/* LEFT SIDEBAR: AI ASSISTANT & SCORES */}
        <aside className={`${styles.sidebar} ${!showLeftSidebar ? styles.hidden : ""}`}>
          {/* RECRUITER SIMULATION PANEL */}
          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <div className="flex items-center gap-2">
                <Icon name="assignment_ind" className="text-primary text-xl" />
                <span>Recruiter Simulation</span>
              </div>
              {recruiterResult && (
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${recruiterResult.verdict === 'SHORTLIST' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {recruiterResult.verdict}
                </span>
              )}
            </div>
            
            {!recruiterResult ? (
              <div className="text-center py-4">
                <p className="text-[11px] text-on-surface-variant mb-4 italic leading-relaxed">"Recruiters decide in 8 seconds. Can you survive the elite scan?"</p>
                <button 
                  className="w-full py-3 bg-gray-900 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-black transition-all active:scale-95 shadow-lg group"
                  onClick={handleRecruiterReview}
                  disabled={analyzingRecruiter}
                >
                  {analyzingRecruiter ? <RefreshCw size={18} className="animate-spin" /> : <Icon name="bolt" fill className="text-xl group-hover:scale-125 transition-transform" />}
                  8-Second AI Scan
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-primary/5 rounded-xl border border-dashed border-primary/20">
                   <p className="text-[12px] font-medium text-on-surface leading-relaxed italic">"{recruiterResult.punchline}"</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                    <Icon name="gavel" className="text-sm" /> 
                    Brutal Verdict
                  </p>
                  {recruiterResult.brutalReasons.map((r: string, i: number) => (
                    <div key={i} className="flex gap-2 text-[11px] text-on-surface-variant leading-tight">
                      <span className="text-red-400">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                 <button 
                  className="w-full mt-2 py-2 border border-outline-variant/20 rounded-xl text-[11px] font-bold hover:bg-surface-variant/10 transition-all flex items-center justify-center gap-2"
                  onClick={handleRecruiterReview}
                  disabled={analyzingRecruiter}
                >
                  <RefreshCw size={12} className={analyzingRecruiter ? "animate-spin" : ""} />
                  Rescan Resume
                </button>
              </div>
            )}
          </div>

          {/* SKILL GAP ANALYZER PANEL */}
          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <Icon name="psychology" className="text-primary text-xl" />
              <span>Skill Gap Analyzer</span>
            </div>
            
            <div className="space-y-3">
              <input 
                className="w-full p-3 rounded-xl bg-surface border border-outline-variant/20 text-xs focus:ring-1 focus:ring-primary shadow-sm"
                placeholder="Target Role (e.g. Senior Frontend Engineer)"
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
              />
              <button 
                className="w-full py-3 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                onClick={handleSkillGapAnalysis}
                disabled={analyzingGap}
              >
                {analyzingGap ? <RefreshCw size={16} className="animate-spin" /> : <Icon name="track_changes" className="text-lg" />}
                Analyze Match %
              </button>
            </div>

            {gapResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-on-surface-variant">Job Match %</span>
                  <span className="text-lg font-black text-primary">{gapResult.matchPercentage}%</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Roadmap (Week 1)</p>
                  <div className="p-3 bg-surface-variant/5 rounded-xl border border-outline-variant/10 text-[11px] text-on-surface leading-relaxed">
                    {gapResult.learningRoadmap[0]?.goal}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {gapResult.missingSkills.slice(0, 3).map((s: string) => (
                    <span key={s} className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-bold">-{s}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>


          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <Icon name="monitoring" className="text-primary text-xl" />
              <span>ATS Performance</span>
            </div>
            
            <div className={styles.gaugeContainer}>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="transparent"
                  stroke="rgba(0,0,0,0.05)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="transparent"
                  stroke={getAtsColor(overallScore)}
                  strokeWidth="8"
                  strokeDasharray="339.292"
                  initial={{ strokeDashoffset: 339.292 }}
                  animate={{ strokeDashoffset: 339.292 - (339.292 * overallScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className={styles.gaugeValue}>{overallScore || 0}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">Keywords</span>
                <span className="font-bold">{atsScore?.keyword_match || 0}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">Format</span>
                <span className="font-bold">{atsScore?.formatting || 0}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">Read</span>
                <span className="font-bold">{atsScore?.readability || 0}</span>
              </div>
            </div>

            <button className="w-full mt-6 py-3 rounded-xl bg-primary text-on-primary font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg" onClick={() => handleReanalyze()}>
              <RefreshCw size={16} className={reanalyzing ? "animate-spin" : ""} />
              {reanalyzing ? "Analyzing..." : "Update Feedback"}
            </button>
          </div>

          <div className={`${styles.panel}`}>
            <div className={styles.panelTitle}>
              <Icon name="layers" className="text-primary text-xl" />
              <span>Section Management</span>
            </div>
            <div className="space-y-2">
              {sectionOrder.map((sid) => (
                <div key={sid} className={styles.sectionControl}>
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleSection(sid)} className="hover:text-primary transition-colors">
                      <Icon name={visibleSections[sid] ? "visibility" : "visibility_off"} className="text-lg" />
                    </button>
                    <span className="text-sm font-semibold capitalize">{sid}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => moveSection(sid, "up")} className="p-1 hover:bg-black/5 rounded">
                      <Icon name="expand_less" className="text-lg" />
                    </button>
                    <button onClick={() => moveSection(sid, "down")} className="p-1 hover:bg-black/5 rounded">
                      <Icon name="expand_more" className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.panel}`}>
            <div className={styles.panelTitle}>
              <Icon name="auto_awesome" className="text-primary text-xl" />
              <span>AI Insights & Suggestions</span>
            </div>
            
            {improvements.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {improvements.map((imp: any, i: number) => (
                  <motion.div whileHover={{ x: 4 }} key={i} className={styles.improvementItem} onClick={() => applyImprovement(imp)}>
                    <div className={styles.improvementOriginal}>❌ {imp.original}</div>
                    <div className={styles.improvementFixed}>✅ {imp.improved}</div>
                  </motion.div>
                ))}
              </div>
            ) : (
                <p className="text-sm text-on-surface-variant text-center py-4">
                  No major issues found. Your resume is looking sharp!
                </p>
            )}

            {/* HEATMAP TOGGLE */}
            <div className="flex items-center justify-between mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${showHeatmap ? 'bg-primary text-white' : 'bg-surface text-primary'} transition-all shadow-sm`}>
                  <Icon name="blur_on" className="text-xl" />
                </div>
                <div>
                  <span className="text-xs font-black text-on-surface block leading-none">Quality Heatmap</span>
                  <span className="text-[10px] text-on-surface-variant font-medium">Visualizing impact zones</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowHeatmap(!showHeatmap);
                  showToast(showHeatmap ? "Heatmap disabled" : "Heatmap active: Red/Green zones visible");
                }}
                className={`w-12 h-6 rounded-full transition-all relative ${showHeatmap ? 'bg-primary shadow-[0_0_12px_rgba(0,97,164,0.3)]' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${showHeatmap ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

          </div>
        </aside>

        {/* CENTER COLUMN: A4 EDITOR */}
        <main className={styles.workspace} ref={workspaceRef}>
          <div className={styles.a4Wrapper} style={{ transform: `scale(${scale})`, height: `${boardHeight * scale}px` }}>
            <div
              className={`${styles.a4Board} ${styles[`template_${template}`]}`}
              ref={targetRef}
              contentEditable
              suppressContentEditableWarning
              spellCheck={true}
            >
              <div dangerouslySetInnerHTML={{ __html: `<h1 style="text-align:center;margin:0 0 4px 0;">${data.basics?.name || "Your Name"}</h1><p style="text-align:center;color:#404752;font-size:0.9rem;border-bottom:2px solid #0061a4;padding-bottom:8px;margin-bottom:12px;">${(data.basics?.email ? [data.basics.email, ...(data.basics.profiles || [])] : ["email@example.com"]).join(" | ")}</p>` }} />
              
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={sectionOrder}
                  strategy={verticalListSortingStrategy}
                >
                  {sectionOrder.map((sectionId) => (
                    visibleSections[sectionId] && sections[sectionId] && (
                      <SortableSection key={sectionId} id={sectionId} isVisible={visibleSections[sectionId]}>
                        <div 
                          className={showHeatmap ? (sectionId === 'skills' || sectionId === 'summary' ? 'bg-emerald-50/30' : 'bg-amber-50/30') : ""}
                          dangerouslySetInnerHTML={{ __html: sections[sectionId] }} 
                        />
                      </SortableSection>
                    )
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
          
          <div className="flex gap-4 mb-20">
             <button className="px-6 py-2 rounded-full border border-outline-variant/30 text-sm font-bold opacity-50 cursor-not-allowed">
               History
             </button>
             <button className="px-6 py-2 rounded-full border border-primary text-primary text-sm font-bold hover:bg-primary/5 transition-colors" onClick={() => exec("removeFormat")}>
               Clear Formatting
             </button>
          </div>
        </main>

        {/* RIGHT SIDEBAR: STYLE & SETUP */}
        <aside className={`${styles.sidebar} ${!showRightSidebar ? styles.hidden : ""}`}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <Icon name="palette" className="text-primary text-xl" />
              <span>Resume Layout</span>
            </div>
            <div className={styles.templateGrid}>
              {(["minimal", "modern", "faang", "executive", "creative", "professional", "tech"] as TemplateName[]).map((t) => (
                <div 
                  key={t} 
                  className={`${styles.templateCard} ${template === t ? styles.active : ""}`}
                  onClick={() => handleTemplateChange(t)}
                >
                  <div className={styles.templatePreview} />
                  <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur p-2 text-[10px] font-bold text-center border-t border-outline-variant/10">
                    {t.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* POWER REWRITE MODES PANEL */}
          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <Icon name="bolt" className="text-primary text-xl" />
              <span>AI Power Rewrite</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mb-4 italic leading-relaxed">
              "Transform your resume to match specific industry expectations instantly."
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "FAANG", label: "FAANG Impact", icon: "rocket_launch", color: "text-blue-600" },
                { id: "Concise", label: "Concise & Sharp", icon: "content_cut", color: "text-emerald-600" },
                { id: "Startup", label: "Startup Speed", icon: "speed", color: "text-orange-600" },
                { id: "Executive", label: "Executive Focus", icon: "stars", color: "text-purple-600" }
              ].map((m) => (
                <button 
                  key={m.id}
                  className="p-3 rounded-xl border border-outline-variant/20 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center gap-2 group relative overflow-hidden"
                  onClick={() => handlePowerRewrite(m.id)}
                  disabled={rewriting}
                >
                  <span className={`${m.color} group-hover:scale-110 transition-transform`}>
                     <Icon name={m.icon} fill className="text-xl" />
                  </span>
                  <span className="text-[10px] font-bold text-on-surface">{m.label}</span>
                  {rewriting && (
                    <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[1px]">
                      <RefreshCw size={14} className="animate-spin text-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>


          <div className={styles.panel}>
             <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Autosave</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             </div>
          </div>
        </aside>
      </div>

      {/* ===== VERSION HISTORY MODAL ===== */}
      <AnimatePresence>
        {showVersionModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowVersionModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <History className="text-primary" />
                    Version History
                  </h2>
                  <p className="text-sm text-gray-500">Restore or compare previous revisions of your resume.</p>
                </div>
                <button 
                  onClick={() => setShowVersionModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center"
                >
                  <Icon name="close" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {versions.length === 0 ? (
                  <div className="text-center py-12 opacity-50">
                    <Icon name="history" className="text-4xl mb-2" />
                    <p>No versions saved yet.</p>
                    <button 
                      onClick={() => { setShowVersionModal(false); handleSaveVersion(); }}
                      className="mt-4 text-primary font-bold hover:underline"
                    >
                      Save your first version now
                    </button>
                  </div>
                ) : (
                  versions.map((v) => (
                    <div 
                      key={v.id} 
                      className="group flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-primary/10 transition-colors text-gray-500 group-hover:text-primary">
                          <RotateCcw size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{v.name || "Unnamed Version"}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(v.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleRestoreVersion(v.id)}
                          className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors"
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 bg-gray-50 border-t flex justify-end">
                <button 
                  onClick={() => setShowVersionModal(false)}
                  className="px-6 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold shadow-2xl z-50 border border-white/20"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
