"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles, FileText, Zap, Target, CheckCircle } from "lucide-react";

// Fade up animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans selection:bg-[#0071e3] selection:text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#f5f5f7]/80 backdrop-blur-xl border-b border-black/[0.05] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="mix-blend-multiply opacity-90" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Resume AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1d1d1f]/70">
            <a href="#features" className="hover:text-[#1d1d1f] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#1d1d1f] transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-[#1d1d1f] transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => signIn("google", { callbackUrl: "/form" })} className="text-sm font-medium hover:text-[#0071e3] transition-colors hidden sm:block">
              Log in
            </button>
            <button 
              onClick={() => signIn("google", { callbackUrl: "/form" })}
              className="bg-[#1d1d1f] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-black transition-transform active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 md:pt-32">
        {/* HERO SECTION */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
            
            <motion.div variants={fadeUp} className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/[0.05] shadow-sm text-sm font-medium text-[#0071e3]">
              <Sparkles size={16} />
              <span>Gemini 2.5 AI Powered Engine</span>
            </motion.div>
            
            <motion.div variants={fadeUp} className="mb-8 w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white flex items-center justify-center">
              <Image src="/logo.png" alt="AI Resume Logo" width={128} height={128} className="mix-blend-multiply opacity-90" />
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl md:text-[6.5rem] leading-[1.05] font-semibold tracking-tight mb-8">
              The resume that <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0071e3] to-[#42a1ec]">gets you hired.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-[#86868b] mb-12 max-w-2xl font-medium tracking-tight leading-snug">
              Stop guessing what recruiters want. Our AI analyzes your experience and builds an ATS-optimized, beautifully formatted resume in seconds.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                className="bg-[#0071e3] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#0077ed] transition-all shadow-[0_4px_14px_0_rgb(0,113,227,0.39)] hover:shadow-[0_6px_20px_rgba(0,113,227,0.23)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                onClick={() => signIn("google", { callbackUrl: "/form" })}
              >
                Create your resume <ArrowRight size={20} />
              </button>
              <a href="#features" className="px-8 py-4 rounded-full font-medium text-lg text-[#1d1d1f] hover:bg-black/[0.03] transition-colors">
                See how it works
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Brilliant features.</h2>
              <p className="text-xl text-[#86868b] max-w-2xl mx-auto font-medium">Everything you need to bypass the ATS screen and land the interview.</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Target className="text-[#0071e3]" size={32}/>, title: "Job Perfect Match", desc: "Paste any job description and let the AI tailor your resume to explicitly hit every required keyword." },
                { icon: <Zap className="text-[#0071e3]" size={32}/>, title: "1-Click AI Fixes", desc: "Weak bullet points? The AI identifies vague language and rewrites your lines to be action-driven and impactful." },
                { icon: <FileText className="text-[#0071e3]" size={32}/>, title: "Premium Templates", desc: "Instantly switch between FAANG, Executive, and Creative layouts without ever worrying about formatting breaking." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" as const }}
                  className="bg-[#f5f5f7] rounded-[2rem] p-10 hover:shadow-xl transition-shadow duration-500"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight mb-3">{feature.title}</h3>
                  <p className="text-[#86868b] leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-32 px-6 max-w-5xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Simple pricing.</h2>
            <p className="text-xl text-[#86868b] font-medium">Start for free, upgrade when you need extreme AI power.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}
              className="bg-white rounded-[2.5rem] p-10 lg:p-12 border border-black/[0.05] shadow-sm flex flex-col"
            >
              <h3 className="text-2xl font-semibold tracking-tight mb-2">Basic</h3>
              <div className="text-5xl font-bold tracking-tight mb-6">$0<span className="text-xl text-[#86868b] font-medium tracking-normal">/mo</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                {["1 AI Resume Generation", "Basic ATS Scoring", "Standard Export", "3 Basic Templates"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#1d1d1f] font-medium"><CheckCircle size={20} className="text-[#86868b]" /> {feature}</li>
                ))}
              </ul>
              <button onClick={() => signIn("google", { callbackUrl: "/form" })} className="w-full py-4 rounded-full bg-[#f5f5f7] text-[#1d1d1f] font-semibold hover:bg-[#e5e5ea] transition-colors">Start Free</button>
            </motion.div>
            
            {/* Pro */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#1d1d1f] text-white rounded-[2.5rem] p-10 lg:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <span className="bg-[#0071e3] text-white text-[0.65rem] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight mb-2">Pro</h3>
              <div className="text-5xl font-bold tracking-tight mb-6">$9<span className="text-xl text-white/50 font-medium tracking-normal">/mo</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                {["Unlimited AI Generations", "Advanced Job Matching", "Premium FAANG Templates", "1-Click Bullet Fixes", "Priority Processor"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white font-medium"><CheckCircle size={20} className="text-[#0071e3]" /> {feature}</li>
                ))}
              </ul>
              <button onClick={() => signIn("google", { callbackUrl: "/form" })} className="w-full py-4 rounded-full bg-[#0071e3] text-white font-semibold hover:bg-[#0077ed] transition-colors shadow-sm">Go Pro</button>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-12 border-t border-black/[0.05] bg-white text-center">
        <p className="text-[#86868b] text-sm font-medium">© 2026 Resume Creator AI. Built with intelligence.</p>
      </footer>
    </div>
  );
}
