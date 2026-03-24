import React from 'react';
import JobCard from './JobCard';
import { ScoredJob } from '@/lib/job-utils';
import { motion } from 'framer-motion';

interface JobListProps {
  jobs: ScoredJob[];
  loading: boolean;
  onAutoApply: (job: ScoredJob) => void;
}

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

export default function JobList({ jobs, loading, onAutoApply }: JobListProps) {
  if (loading) {
    return (
      <div className="space-y-4 py-10">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-gray-50 h-48 rounded-3xl" />
        ))}
        <p className="text-center text-xs font-bold text-gray-400 animate-bounce">
          Analyzing market opportunities...
        </p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto">
          <Icon name="search_off" className="text-4xl" />
        </div>
        <div>
          <h4 className="text-sm font-black text-gray-900">No matches found yet</h4>
          <p className="text-[11px] text-gray-400 font-medium">Try updating your skills or experience level.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {jobs.length} Optimized Matches
        </p>
        <div className="flex gap-2">
           <button className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
             Filter <Icon name="filter_list" className="text-xs" />
           </button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {jobs.map((job, idx) => (
          <JobCard key={idx} job={job} onAutoApply={onAutoApply} />
        ))}
      </div>
    </div>
  );
}
