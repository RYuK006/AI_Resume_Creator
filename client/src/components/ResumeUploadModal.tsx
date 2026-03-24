import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InterviewView from "./CareerSuite/InterviewView";
import LinkedInView from "./CareerSuite/LinkedInView";
import PortfolioView from "./CareerSuite/PortfolioView";
import RoadmapView from "./CareerSuite/RoadmapView";

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (resumeId: string | null, uploadFile?: File) => void;
  existingResumes: any[];
  isLoading?: boolean;
  activeFeature?: string | null;
}

const Icon = ({ name, className = "", fill }: { name: string; className?: string; fill?: boolean }) => (
  <span 
    className={`material-symbols-outlined ${className}`}
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);

export default function ResumeUploadModal({ isOpen, onClose, onSelect, existingResumes, isLoading: externalLoading, activeFeature }: ResumeUploadModalProps) {
  const [step, setStep] = useState<"selection" | "processing" | "results">("selection");
  const [processingStatus, setProcessingStatus] = useState("");
  const [resultData, setResultData] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeName, setResumeName] = useState<string | null>(null);

  // Reset state when modal closes/opens
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("selection");
        setResultData(null);
        setSelectedFile(null);
        setProcessingStatus("");
      }, 500);
    }
  }, [isOpen]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setSelectedFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const runStandaloneAI = async (resumeText: string) => {
    setStep("processing");
    try {
      let endpoint = "";
      if (activeFeature === "interview") {
        setProcessingStatus("Simulating behavioral & technical scenarios...");
        endpoint = "/api/interview-prep";
      } else if (activeFeature === "linkedin") {
        setProcessingStatus("Optimizing for LinkedIn SEO & Branding...");
        endpoint = "/api/linkedin-optimize";
      } else if (activeFeature === "portfolio") {
        setProcessingStatus("Generating personal website blueprint...");
        endpoint = "/api/portfolio-gen";
      } else if (activeFeature === "roadmap") {
        setProcessingStatus("Calculating 3-year career trajectory...");
        endpoint = "/api/career-roadmap";
      } else {
        // Fallback to traditional editor if not a career suite feature
        onSelect(null, selectedFile!);
        return;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      if (data.success) {
        setResultData(data);
        setStep("results");
      } else {
        alert("AI Generation failed: " + data.error);
        setStep("selection");
      }
    } catch (err) {
      alert("Error generating AI content.");
      setStep("selection");
    }
  };

  const handleFinalSelect = async (resumeId: string | null, file?: File) => {
    // If it's a career suite feature, we do everything here
    if (activeFeature) {
      setStep("processing");
      setProcessingStatus("Extracting resume content...");
      
      let text = "";
      if (resumeId) {
        const resume = existingResumes.find(r => r.id === resumeId);
        text = JSON.stringify(resume);
        setResumeName(resume.name || "User");
      } else if (file) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await fetch("/api/parse", { method: "POST", body: formData });
          const data = await res.json();
          if (data.success) {
            text = data.text;
            // Try to extract name: take first line, and if it's 1-4 words and < 50 chars, use it
            const firstLine = text.split('\n')[0].trim();
            const words = firstLine.split(/\s+/);
            if (words.length >= 1 && words.length <= 4 && firstLine.length < 50) {
              setResumeName(firstLine);
            } else {
              setResumeName("Career Suite User");
            }
          } else {
            alert("Parsing failed: " + data.error);
            setStep("selection");
            setIsUploading(false);
            return;
          }
        } catch (e) {
          alert("Connection error during parsing.");
          setStep("selection");
          setIsUploading(false);
          return;
        }
      }
      
      setIsUploading(false);
      await runStandaloneAI(text);
    } else {
      // Normal flow: navigate to editor
      onSelect(resumeId, file);
    }
  };

  const getHeader = () => {
    const titles: Record<string, { title: string; sub: string }> = {
      interview: { title: "Interview Readiness", sub: "Technical & Behavioral Preparation" },
      linkedin: { title: "LinkedIn SEO Optimization", sub: "Headline & About Section Revamp" },
      portfolio: { title: "Personal Website Blueprint", sub: "Convert Resume to Portfolio site" },
      roadmap: { title: "Career Growth Roadmap", sub: "Strategic 3-Year Trajectory" },
    };

    if (activeFeature && titles[activeFeature]) {
      return titles[activeFeature];
    }
    return { title: "Pick Your Context", sub: "Select a resume or upload a new one to begin." };
  };

  const header = getHeader();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={step === "processing" ? undefined : onClose}
        >
          <motion.div 
            layout
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className={`bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col transition-all duration-700 ease-[0.16,1,0.3,1] border border-white/20 h-full max-h-[90vh] md:h-[700px] ${
              step === "results" ? "w-full max-w-7xl" : "w-full max-w-2xl"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {step === "processing" && (
              <div className="absolute inset-0 z-[600] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="bolt" className="text-primary text-2xl animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                   <p className="font-black text-gray-900 text-xl animate-pulse mb-1">AI Intelligence at Work</p>
                   <p className="text-sm text-gray-500 font-bold uppercase tracking-[0.2em]">{processingStatus}</p>
                </div>
              </div>
            )}

            <div className={`p-6 md:p-10 border-b flex justify-between items-center ${step === "results" ? "bg-slate-50/50" : ""}`}>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  {step === "results" && <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">AI Generated</span>}
                  <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">{header.title}</h2>
                </div>
                <p className="text-xs md:text-sm text-gray-500 font-medium">{header.sub}</p>
              </div>
              <button onClick={onClose} className="p-2 md:p-4 hover:bg-gray-100 rounded-full transition-all text-gray-400 bg-gray-50/50 shadow-sm border border-gray-100">
                <Icon name="close" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
              {step === "selection" && (
                <div className="space-y-10 animate-in fade-in zoom-in-95 duration-300">
                  {/* --- Upload Section --- */}
                  <section>
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                       <div className="w-1.5 h-4 bg-primary rounded-full" /> Upload New Version
                    </h4>
                    <div 
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-[32px] p-12 transition-all flex flex-col items-center justify-center gap-6 group ${
                        dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-gray-200 hover:border-primary/40 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all shadow-xl ${selectedFile ? "bg-emerald-600 text-white rotate-6" : "bg-primary/5 text-primary group-hover:scale-110 group-hover:-rotate-3"}`}>
                        <Icon name={selectedFile ? "check_circle" : "cloud_upload"} className="text-4xl" fill={!!selectedFile} />
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-black text-gray-900 mb-1">
                          {selectedFile ? selectedFile.name : "Drop your resume here"}
                        </p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">PDF, DOCX or TXT (Max 5MB)</p>
                      </div>
                      {!selectedFile && <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept=".pdf,.docx,.txt" />}
                      
                      {selectedFile && (
                        <button 
                          disabled={isUploading}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFinalSelect(null, selectedFile);
                          }}
                          className={`mt-4 px-10 py-4 text-white text-base font-black rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-95 flex items-center gap-3 z-10 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary'}`}
                        >
                          {isUploading ? (
                            <>
                              <Icon name="progress_activity" className="animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>Use This Resume <Icon name="arrow_forward" /></>
                          )}
                        </button>
                      )}
                    </div>
                  </section>

                  {/* --- Existing Resumes Section --- */}
                  {existingResumes.length > 0 && (
                    <section>
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                         <div className="w-1.5 h-4 bg-primary rounded-full" /> Use Existing Build
                      </h4>
                      <div className="grid gap-4">
                        {existingResumes.slice(0, 4).map((resume) => (
                          <button 
                            key={resume.id}
                            onClick={() => handleFinalSelect(resume.id)}
                            className="flex items-center gap-6 p-6 rounded-[28px] border border-gray-100 bg-white hover:border-primary/50 hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/5 transition-all group text-left w-full border-b-[4px] border-b-gray-100 hover:border-b-primary/50 active:translate-y-1 active:border-b-0"
                          >
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-white transition-all shadow-sm">
                              <Icon name="article" className="text-2xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-lg text-gray-900 truncate leading-none mb-1">{resume.name}</p>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Last modified: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                               <Icon name="arrow_forward" className="text-xl" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}

              {step === "results" && (
                <div className="h-full">
                  {activeFeature === "interview" && <InterviewView data={resultData} />}
                  {activeFeature === "linkedin" && <LinkedInView data={resultData} userName={resumeName} />}
                  {activeFeature === "portfolio" && <PortfolioView data={resultData} />}
                  {activeFeature === "roadmap" && <RoadmapView data={resultData} />}
                </div>
              )}
            </div>

            <div className={`p-6 md:p-10 border-t ${step === "results" ? "bg-slate-50/50" : "bg-gray-50/30"} flex justify-center`}>
              {step === "results" ? (
                <button 
                  onClick={onClose}
                  className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-2xl active:scale-95 flex items-center gap-3"
                >
                  Close Insights <Icon name="check_circle" fill />
                </button>
              ) : (
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.25em] flex items-center gap-3 bg-white px-6 py-2 rounded-full border border-gray-100 shadow-sm">
                  <Icon name="security" className="text-primary text-xs" /> Privacy Protected AI Infrastructure
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
