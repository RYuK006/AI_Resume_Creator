"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Play, 
  Sparkles, 
  Target, 
  Download, 
  ShieldCheck, 
  Star,
  Twitter,
  Linkedin,
  Github,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-600 selection:text-white overflow-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-blue-100/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
               <Sparkles size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Resume AI</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#resources" className="hover:text-blue-600 transition-colors">Resources</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => signIn("google", { callbackUrl: "/form" })}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all active:scale-95"
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-6 py-4 flex flex-col gap-4 shadow-xl">
            <a href="#" className="font-medium text-slate-600 py-2 border-b border-slate-50">Home</a>
            <a href="#features" className="font-medium text-slate-600 py-2 border-b border-slate-50">Features</a>
            <a href="#pricing" className="font-medium text-slate-600 py-2 border-b border-slate-50">Pricing</a>
            <button 
              onClick={() => signIn("google", { callbackUrl: "/form" })}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold mt-2"
            >
              Login
            </button>
          </div>
        )}
      </nav>

      <main className="pt-32">
        {/* --- HERO SECTION --- */}
        <section className="relative px-6 flex flex-col items-center text-center max-w-5xl mx-auto pb-20">
          
          {/* Background Soft Blue Blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-50/80 rounded-full blur-3xl -z-10 pointer-events-none opacity-70"></div>

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center w-full relative z-10">
            
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
              Craft Your Perfect <br/>
              <span className="text-blue-600 relative inline-block">
                Resume with AI
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="transparent"/></svg>
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl font-medium leading-relaxed">
              Create a professional resume in minutes with the power of AI.<br className="hidden md:block"/> Stand out and land your dream job.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button 
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                onClick={() => signIn("google", { callbackUrl: "/form" })}
              >
                Get Started Now
              </button>
              <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95">
                <Play size={18} className="fill-slate-700" /> Watch Demo
              </button>
            </motion.div>

            {/* Visual Element: Tablet Resume Mockup */}
            <motion.div variants={fadeUp} className="mt-16 w-full max-w-4xl relative">
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-full w-full pointer-events-none"></div>
              <div className="bg-white p-2 rounded-t-3xl sm:rounded-none sm:rounded-t-[2.5rem] border border-slate-200 border-b-0 shadow-2xl shadow-blue-900/5 mx-auto w-full sm:w-[90%] md:w-[80%] h-[300px] sm:h-[400px] overflow-hidden">
                <div className="w-full h-full bg-slate-50 rounded-t-2xl sm:rounded-none sm:rounded-t-[2rem] border border-slate-100 flex flex-col relative overflow-hidden">
                   {/* Mockup Header */}
                   <div className="h-10 border-b border-slate-200/60 bg-white flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                   </div>
                   {/* Mockup Body Content */}
                   <div className="p-8 px-12 pb-0">
                      <div className="h-8 w-48 bg-slate-200 rounded-md mb-6"></div>
                      <div className="flex gap-4 mb-8">
                         <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
                         <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
                         <div className="h-4 w-20 bg-slate-200 rounded-md"></div>
                      </div>
                      <div className="h-5 w-32 bg-blue-100 rounded-md mb-4"></div>
                      <div className="space-y-3 mb-8">
                         <div className="h-3 w-full bg-slate-100 rounded-md"></div>
                         <div className="h-3 w-full bg-slate-100 rounded-md"></div>
                         <div className="h-3 w-3/4 bg-slate-100 rounded-md"></div>
                      </div>
                      <div className="h-5 w-32 bg-blue-100 rounded-md mb-4"></div>
                      <div className="space-y-3">
                         <div className="h-3 w-full bg-slate-100 rounded-md"></div>
                         <div className="h-3 w-4/5 bg-slate-100 rounded-md"></div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* --- RATINGS AND TRUST SECTION --- */}
        <section className="py-16 bg-blue-50/50 border-y border-blue-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center gap-10">
              
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                {/* 4.9/5 Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex text-amber-400">
                    {[1,2,3,4,5].map(i => <Star key={i} size={24} className="fill-amber-400" />)}
                  </div>
                  <div className="text-slate-700 font-bold text-lg">4.9/5 Rating</div>
                </div>

                {/* Secure & Confidential */}
                <div className="flex items-center gap-3 text-slate-700 font-bold text-lg">
                  <ShieldCheck size={28} className="text-emerald-500" />
                  Secure & Confidential
                </div>

                {/* 10,000+ Professionals */}
                <div className="flex items-center gap-3 text-slate-700 font-bold text-lg">
                  <span className="text-blue-600 bg-blue-100 px-3 py-1 rounded-lg">10,000+</span>
                  Professionals Trust Us
                </div>
              </div>

              {/* Company Logos Placeholder */}
              <div className="w-full flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-60 grayscale mt-4">
                 <div className="text-2xl font-black tracking-tighter text-slate-800">Spotify</div>
                 <div className="text-2xl font-extrabold tracking-tight text-slate-800 relative">
                    <span className="text-rose-500 mr-1">▲</span>airbnb
                 </div>
                 <div className="text-2xl font-bold tracking-tight text-slate-800">Microsoft</div>
                 <div className="text-2xl font-bold tracking-normal italic text-slate-800">Amazon</div>
              </div>

            </div>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section id="features" className="py-32 px-6 bg-white relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">Why thousands choose our builder.</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Built from the ground up to get you past ATS screening and impress recruiters instantly.</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { 
                  icon: <Sparkles className="text-blue-600" size={32}/>, 
                  title: "AI-Powered Builder", 
                  desc: "Generate resumes tailored to your industry and role automatically without manual typing." 
                },
                { 
                  icon: <Target className="text-blue-600" size={32}/>, 
                  title: "ATS Optimized", 
                  desc: "Build resumes that pass Applicant Tracking Systems with precision keyword matching." 
                },
                { 
                  icon: <Download className="text-blue-600" size={32}/>, 
                  title: "Instant Download", 
                  desc: "Download your perfected resume instantly in high-quality PDF or DOCX format." 
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" as const }}
                  className="bg-white border border-slate-100 rounded-3xl p-10 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- TESTIMONIAL SECTION --- */}
        <section className="py-24 px-6 bg-blue-600 text-white relative overflow-hidden">
          {/* Decorative faint blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16 relative z-10"
          >
            {/* User Avatar */}
            <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl relative bg-blue-300 flex items-end justify-center">
               <svg className="w-32 h-32 text-blue-500 absolute -bottom-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
            </div>

            {/* Quote Block */}
            <div className="text-center md:text-left">
              <Star className="text-amber-400 fill-amber-400 mb-6 mx-auto md:mx-0" size={32} />
              <blockquote className="text-2xl md:text-4xl font-medium leading-tight mb-8 text-white">
                "This is the best resume builder I've ever used! Landed my dream job in just days!"
              </blockquote>
              <div>
                <div className="font-bold text-xl">Sarah M.</div>
                <div className="text-blue-200 font-medium tracking-wide uppercase text-sm mt-1">Product Manager</div>
              </div>
            </div>
          </motion.div>
        </section>

      </main>
      
      {/* --- FOOTER SECTION --- */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 border-b border-slate-800 pb-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                 <Sparkles size={16} />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Resume AI</span>
            </div>
            <p className="max-w-sm mb-6 font-medium">Crafting the future of recruitment through artificial intelligence. Land your dream job today.</p>
            <div className="flex items-center gap-4">
               <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors text-white"><Twitter size={18}/></a>
               <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors text-white"><Linkedin size={18}/></a>
               <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors text-white"><Github size={18}/></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Terms and Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-sm font-medium text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 Resume Creator AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
