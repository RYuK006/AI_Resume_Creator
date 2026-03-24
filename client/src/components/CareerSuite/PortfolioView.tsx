import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IconProps {
  name: string;
  className?: string;
  fill?: boolean;
}

const Icon = ({ name, className = "", fill }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: fill ? "'FILL' 1" : "none" }}>
    {name}
  </span>
);

export default function PortfolioView({ data }: { data: any }) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.htmlTemplate || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Preview */}
      <div className="p-12 bg-gray-950 rounded-[48px] text-white relative overflow-hidden group border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <div className="flex justify-between items-start mb-6">
              <span className="px-4 py-1.5 bg-primary/20 text-primary-fixed-dim rounded-full text-[10px] font-black uppercase tracking-[0.3em] inline-block border border-white/10">
                Personal Brand Blueprint
              </span>
              <button 
                onClick={() => setShowCode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/10 transition-all text-xs font-bold group"
              >
                <Icon name="code" className="text-sm group-hover:rotate-12 transition-transform" />
                Extract Code
              </button>
            </div>
            <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-[1.1]">
              {data.tagline}
            </h3>
            <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-xl italic">
              "{data.bio}"
            </p>
          </div>
          <div className="w-full md:w-72 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Core Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {data.techStack.map((tech: string) => (
                <span key={tech} className="px-3 py-1.5 bg-white/10 text-white rounded-xl text-[11px] font-bold border border-white/10">
                   {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Showcase */}
      <div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2 h-8 bg-indigo-500 rounded-full" />
          <h4 className="text-2xl font-black text-gray-900 tracking-tight">Portfolio Highlights</h4>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {data.projects.map((project: any, i: number) => (
            <div key={i} className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 hover:-translate-y-2 group">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                    <Icon name="code" className="text-2xl" fill />
                 </div>
              </div>
              <h5 className="text-xl font-black text-gray-900 mb-3">{project.title}</h5>
              <p className="text-sm text-gray-500 font-medium mb-6 leading-relaxed line-clamp-2">
                 {project.desc}
              </p>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-6 font-bold text-emerald-700 text-xs">
                 Impact: {project.impact}
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t: string) => (
                  <span key={t} className="px-2.5 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-wider">
                     {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Themes & Domains */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-8 bg-indigo-50/50 rounded-[40px] border border-indigo-100">
          <h5 className="font-black text-indigo-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
             <Icon name="palette" className="text-sm" fill /> UI Personalization
          </h5>
          <div className="grid grid-cols-2 gap-4">
             {data.themes.map((theme: any) => (
               <div key={theme.name} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary }} />
                  <span className="text-[11px] font-bold text-gray-700">{theme.name}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="p-8 bg-amber-50/50 rounded-[40px] border border-amber-100">
          <h5 className="font-black text-amber-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
             <Icon name="language" className="text-sm" fill /> Domain Reservation
          </h5>
          <div className="space-y-3">
             {data.domainSuggestions.map((domain: string) => (
               <div key={domain} className="flex justify-between items-center px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm group hover:border-amber-500 transition-colors">
                  <span className="text-sm font-bold text-gray-700">{domain}</span>
                  <Icon name="arrow_forward" className="text-amber-400 text-sm group-hover:translate-x-1 transition-transform" />
               </div>
             ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCode(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl h-[80vh] bg-white rounded-[48px] shadow-2xl overflow-hidden flex flex-col border border-gray-100"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Source Code</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Ready-to-use HTML/Tailwind Template</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs transition-all shadow-lg shadow-indigo-200"
                  >
                    <Icon name={copied ? "check" : "content_copy"} className="text-sm" />
                    {copied ? "Copied!" : "Copy Code"}
                  </button>
                  <button 
                    onClick={() => setShowCode(false)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl transition-colors"
                  >
                    <Icon name="close" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-8 bg-slate-950">
                <pre className="text-xs md:text-sm font-mono text-emerald-400 leading-relaxed">
                  {data.htmlTemplate}
                </pre>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
