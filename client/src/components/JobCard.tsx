import React from 'react';
import { motion } from 'framer-motion';
import { ScoredJob } from '@/lib/job-utils';

interface JobCardProps {
  job: ScoredJob;
  onAutoApply: (job: ScoredJob) => void;
}

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export default function JobCard({ job, onAutoApply }: JobCardProps) {
  const scoreColor = job.matchScore > 80 ? 'text-emerald-500' : job.matchScore > 60 ? 'text-amber-500' : 'text-red-500';
  const bgColor = job.matchScore > 80 ? 'bg-emerald-50' : job.matchScore > 60 ? 'bg-amber-50' : 'bg-red-50';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-black text-gray-900 group-hover:text-primary transition-colors leading-tight">
            {job.title}
          </h3>
          <p className="text-sm font-bold text-on-surface-variant flex items-center gap-1">
            <Icon name="business" className="text-sm" /> {job.company}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-xl ${bgColor} ${scoreColor} text-center shrink-0`}>
          <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Match</p>
          <p className="text-xl font-black">{job.matchScore}%</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100/50">
        <p className="text-[11px] font-medium text-gray-600 leading-relaxed italic">
          "{job.explanation}"
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
           <Icon name="location_on" className="text-xs" /> {job.location}
           <span>•</span>
           <Icon name="schedule" className="text-xs" /> {job.postedDate}
        </div>
        <div className="flex flex-wrap gap-1">
          {job.skills.slice(0, 3).map(skill => (
            <span key={skill} className="px-2 py-0.5 bg-primary/5 text-primary text-[9px] font-black rounded uppercase border border-primary/10">
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && <span className="text-[9px] font-black text-gray-400">+{job.skills.length - 3} more</span>}
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-50">
        <button 
          onClick={() => window.open(job.url, '_blank')}
          className="flex-1 py-2.5 rounded-xl bg-surface border border-outline-variant text-[11px] font-black uppercase tracking-wider text-on-surface hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          View Job <Icon name="open_in_new" className="text-sm" />
        </button>
        <button 
          onClick={() => onAutoApply(job)}
          className="flex-2 py-2.5 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-wider hover:shadow-lg transition-all flex items-center justify-center gap-2 px-6"
        >
          <Icon name="auto_fix" className="text-sm" /> Quick Tailor
        </button>
      </div>
    </motion.div>
  );
}
