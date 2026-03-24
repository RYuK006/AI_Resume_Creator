import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JobList from './JobList';
import { Job, ScoredJob } from '@/lib/job-utils';

interface JobSearchPanelProps {
  resumeText: string;
  onApplyChanges: (tailoredData: any) => void;
}

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export default function JobSearchPanel({ resumeText, onApplyChanges }: JobSearchPanelProps) {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<ScoredJob[]>([]);
  const [applying, setApplying] = useState<string | null>(null);
  const [autoApplyResult, setAutoApplyResult] = useState<any>(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/job-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoApply = async (job: ScoredJob) => {
    setApplying(job.title + job.company);
    try {
      const res = await fetch('/api/auto-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, resumeText }),
      });
      const data = await res.json();
      if (data.success) {
        setAutoApplyResult({ ...data, job });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 rounded-3xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-white">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-2">
          <Icon name="rocket_launch" className="text-primary" />
          Intelligent Job Match
        </h3>
        <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
          AI-powered matching across multiple platforms with automated tailoring.
        </p>
        
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="w-full mt-6 py-4 rounded-2xl bg-primary text-white font-black text-sm hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(0,97,164,0.15)]"
        >
          {loading ? (
             <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" />
          ) : (
             <Icon name="magic_button" />
          )}
          {loading ? "Searching Markets..." : "Find My Perfect Match"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <JobList 
          jobs={jobs} 
          loading={loading} 
          onAutoApply={handleAutoApply} 
        />
      </div>

      <AnimatePresence>
        {autoApplyResult && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setAutoApplyResult(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b bg-gradient-to-r from-emerald-50 to-white flex justify-between items-center">
                <div>
                   <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-2 inline-block">Tailoring Ready</span>
                   <h2 className="text-3xl font-black text-gray-900 leading-none">
                     Quick Tailor: <span className="text-emerald-600 font-black">{autoApplyResult.job.title}</span>
                   </h2>
                </div>
                <button onClick={() => setAutoApplyResult(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <Icon name="close" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-12">
                <section>
                   <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Icon name="history_edu" className="text-sm" /> Tailored Professional Summary
                   </h4>
                   <p className="text-lg text-gray-800 font-medium leading-relaxed italic bg-emerald-50/30 p-6 rounded-3xl border border-emerald-100">
                     "{autoApplyResult.tailoredSummary}"
                   </p>
                </section>

                <div className="grid md:grid-cols-2 gap-12">
                  <section>
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Icon name="list_alt" className="text-sm" /> Impact Bullets
                    </h4>
                    <ul className="space-y-3">
                      {autoApplyResult.tailoredBullets.map((b: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-700 font-medium leading-relaxed">
                          <span className="text-emerald-500 font-black">✔</span> {b}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Icon name="contact_mail" className="text-sm" /> Cover Letter Sniper
                    </h4>
                    <div className="bg-gray-900 text-gray-300 p-6 rounded-3xl text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                      {autoApplyResult.coverLetter}
                    </div>
                  </section>
                </div>

                <section>
                   <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Icon name="question_answer" className="text-sm" /> High-Probability Interview Prep
                   </h4>
                   <div className="grid gap-6">
                      {autoApplyResult.interviewPrep.map((item: any, i: number) => (
                        <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-sm font-black text-gray-900 mb-2">Q: {item.question}</p>
                          <p className="text-[13px] text-on-surface-variant font-medium">A: {item.answer}</p>
                        </div>
                      ))}
                   </div>
                </section>
              </div>

              <div className="p-8 border-t flex justify-center gap-4 bg-gray-50/50">
                <button 
                  onClick={() => setAutoApplyResult(null)}
                  className="px-10 py-4 rounded-2xl font-black text-sm text-gray-600 hover:bg-gray-100 transition-all"
                >
                  Discard
                </button>
                <button 
                   onClick={() => {
                     onApplyChanges(autoApplyResult);
                     setAutoApplyResult(null);
                   }}
                   className="px-12 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:shadow-xl transition-all active:scale-95 flex items-center gap-3"
                >
                  <Icon name="check_circle" /> Apply Tailored Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
