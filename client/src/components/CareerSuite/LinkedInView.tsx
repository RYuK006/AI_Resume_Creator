import React, { useState } from 'react';

interface IconProps {
  name: string;
  className?: string;
}

const Icon = ({ name, className = "" }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`}>
    {name}
  </span>
);

export default function LinkedInView({ data, userName }: { data: any, userName?: string | null }) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!data) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 bg-gray-50 flex items-center justify-center shrink-0">
          <Icon name="person" className="text-2xl text-gray-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 leading-none">{userName || "Career Suite User"}</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">AI Optimized Professional Identity</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* --- SEO Headline Section --- */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Icon name="e91c" /> {/* trending_up icon code or name */}
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-lg">SEO Headline</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Optimized for algorithms</p>
              </div>
            </div>
            <button 
              onClick={() => copyToClipboard(data.headline, 'headline')}
              className={`p-3 rounded-xl transition-all active:scale-95 ${copied === 'headline' ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400 hover:bg-primary hover:text-white'}`}
            >
              <Icon name={copied === 'headline' ? 'check' : 'content_copy'} className="text-sm" />
            </button>
          </div>
          <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-50 border-dashed">
            <p className="text-base text-gray-800 font-bold leading-tight">
              {data.headline}
            </p>
          </div>
          <p className="mt-4 text-xs text-gray-500 italic font-medium">Use this as your primary profile heading to maximize recruiter visibility.</p>
        </div>

        {/* --- Strategic About Section --- */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Icon name="person_search" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-lg">Strategic Summary</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">About / Background</p>
              </div>
            </div>
            <button 
              onClick={() => copyToClipboard(data.about, 'about')}
              className={`p-3 rounded-xl transition-all active:scale-95 ${copied === 'about' ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400 hover:bg-primary hover:text-white'}`}
            >
              <Icon name={copied === 'about' ? 'check' : 'content_copy'} className="text-sm" />
            </button>
          </div>
          <div className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-50 border-dashed max-h-[120px] overflow-y-auto custom-scrollbar">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
              {data.about}
            </p>
          </div>
          <p className="mt-4 text-xs text-gray-500 italic font-medium">This narrative highlights your career milestones and key impact areas.</p>
        </div>

        {/* --- Networking Outreach Section --- */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Icon name="send" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-lg">Outreach Script</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Connection Request</p>
              </div>
            </div>
            <button 
              onClick={() => copyToClipboard(data.networkingIntro, 'intro')}
              className={`p-3 rounded-xl transition-all active:scale-95 ${copied === 'intro' ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400 hover:bg-primary hover:text-white'}`}
            >
              <Icon name={copied === 'intro' ? 'check' : 'content_copy'} className="text-sm" />
            </button>
          </div>
          <div className="bg-amber-50/30 p-5 rounded-2xl border border-amber-50 border-dashed">
            <p className="text-xs text-gray-700 leading-relaxed font-medium">
              {data.networkingIntro}
            </p>
          </div>
          <p className="mt-4 text-xs text-gray-500 italic font-medium">Use this template when sending connection requests to professionals in your field.</p>
        </div>

        {/* --- Skills & Keywords Section --- */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Icon name="label" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-lg">Keywords to Feature</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">High-traffic skill tags</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skillsToFeature.map((s: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl text-[11px] font-black uppercase tracking-widest border border-purple-100">
                {s}
              </span>
            ))}
          </div>
          <p className="mt-6 text-xs text-gray-500 leading-relaxed font-medium">
            Include these keywords throughout your Skills section to trigger relevant recruiter search filters.
          </p>
        </div>
      </div>
    </div>
  );
}
