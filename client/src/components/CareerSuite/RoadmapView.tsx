import React from 'react';

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

export default function RoadmapView({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 bg-primary/5 rounded-[32px] border border-primary/10">
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Current Career Status</p>
          <h3 className="text-2xl font-black text-gray-900 leading-tight">{data.currentLevel}</h3>
        </div>
        <div className="px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <Icon name="trending_up" className="text-emerald-500" fill />
          <span className="text-sm font-bold text-gray-600">3-Year High Growth Path</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {data.nextMilestones.map((m: any, i: number) => (
          <div key={i} className="group relative">
            <div className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">
                  {i + 1}
                </div>
                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                  {m.timeframe}
                </span>
              </div>
              
              <h4 className="text-xl font-black text-gray-900 mb-4 tracking-tight leading-tight">{m.title}</h4>
              
              <div className="space-y-6">
                 <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Critical Skills to Master</p>
                   <div className="flex flex-wrap gap-2">
                     {m.skillsNeeded.map((s: string) => (
                       <span key={s} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-[11px] font-bold border border-gray-100 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/10 transition-colors">
                          {s}
                       </span>
                     ))}
                   </div>
                 </div>

                 <div className="p-5 bg-emerald-50 rounded-[24px] border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Estimated Comp Bump</p>
                      <p className="text-lg font-black text-emerald-700">{m.avgSalaryBump}</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                       <Icon name="payments" className="text-emerald-600 text-xl" fill />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-10 bg-gray-900 rounded-[40px] text-white relative overflow-hidden group shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center shrink-0 border border-white/10 group-hover:rotate-12 transition-transform duration-500">
            <Icon name="emoji_events" className="text-4xl text-amber-400" fill />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black mb-2">North Star: {data.ultimateGoal}</h3>
            <p className="text-gray-400 font-medium leading-relaxed italic max-w-2xl">
              "{data.industryTrend}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
