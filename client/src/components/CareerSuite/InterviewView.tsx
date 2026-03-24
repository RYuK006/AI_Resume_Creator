import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

const Icon = ({ name, className = "" }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`}>
    {name}
  </span>
);

export default function InterviewView({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
            <Icon name="groups" />
          </div>
          Behavioral Simulation
        </h3>
        <div className="space-y-4">
          {data.behavioralQuestions.map((q: any, i: number) => (
            <div key={i} className="p-5 rounded-[24px] bg-blue-50/50 border border-blue-100 group hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">Q{i+1}</span>
                <div>
                  <p className="font-bold text-gray-900 mb-3 leading-tight">{q.question}</p>
                  <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[11px] text-blue-700 font-bold uppercase tracking-widest bg-blue-100/50 px-2 py-1 rounded-lg inline-block">Intent: {q.intent}</p>
                    <p className="text-xs text-gray-600 leading-relaxed bg-white p-3 rounded-xl border border-blue-50">💡 <span className="font-medium">{q.tip}</span></p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
            <Icon name="terminal" />
          </div>
          Technical Deep Dive
        </h3>
        <div className="space-y-4">
          {data.technicalQuestions.map((q: any, i: number) => (
            <div key={i} className="p-5 rounded-[24px] bg-emerald-50/50 border border-emerald-100 group hover:bg-white hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">Q{i+1}</span>
                <div>
                  <p className="font-bold text-gray-900 mb-3 leading-tight">{q.question}</p>
                  <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[11px] text-emerald-700 font-bold uppercase tracking-widest bg-emerald-100/50 px-2 py-1 rounded-lg inline-block">Topic: {q.topic}</p>
                    <div className="text-xs text-gray-600 leading-relaxed bg-white p-3 rounded-xl border border-emerald-50">
                      <p className="font-black text-emerald-600 uppercase text-[9px] mb-1">Expected Pitch</p>
                      {q.expectedAnswer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
