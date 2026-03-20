"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Target, 
  Download, 
  ShieldCheck, 
  Star,
  Twitter,
  Linkedin,
  Github,
  Menu,
  X,
  ArrowRight,
  Quote,
  Zap
} from "lucide-react";
import { useState } from "react";

/* ─── Etheric Ledger Animation System ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div 
      className="min-h-screen overflow-hidden"
      style={{ 
        fontFamily: "'Inter', -apple-system, sans-serif", 
        color: "#191c1e", 
        background: "#f7f9fb" 
      }}
    >
      
      {/* ═══════════════════════════════════════════════════════════════
          NAVBAR — Glassmorphism, no hard borders (Etheric Ledger rule)
          ═══════════════════════════════════════════════════════════════ */}
      <nav 
        className="fixed top-0 w-full z-50 transition-all duration-500"
        style={{ 
          background: "rgba(255,255,255,0.7)", 
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)"
        }}
      >
        <div className="max-w-[1280px] mx-auto px-8 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(135deg, #0061a4, #2196f3)" }}
            >
              <Sparkles size={18} />
            </div>
            <span 
              className="text-lg tracking-[-0.02em]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: "#191c1e" }}
            >
              Luminance AI
            </span>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10 text-[0.875rem]" style={{ fontWeight: 500, color: "#404752" }}>
            <a href="#" className="transition-colors hover:text-[#0061a4]">Home</a>
            <a href="#features" className="transition-colors hover:text-[#0061a4]">Features</a>
            <a href="#pricing" className="transition-colors hover:text-[#0061a4]">Pricing</a>
            <a href="#testimonial" className="transition-colors hover:text-[#0061a4]">Resources</a>
            <a href="#faq" className="transition-colors hover:text-[#0061a4]">FAQ</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => signIn("google", { callbackUrl: "/form" })}
              className="text-[0.875rem] transition-colors hover:text-[#0061a4]"
              style={{ fontWeight: 600, color: "#404752" }}
            >
              Login
            </button>
            <button 
              onClick={() => signIn("google", { callbackUrl: "/form" })}
              className="text-white px-6 py-2.5 rounded-lg text-[0.875rem] transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.97]"
              style={{ 
                fontWeight: 700, 
                background: "linear-gradient(135deg, #0061a4, #2196f3)",
                boxShadow: "0 4px 14px rgba(0, 97, 164, 0.2)"
              }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden" style={{ color: "#404752" }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden px-8 py-6 flex flex-col gap-5"
            style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)" }}
          >
            <a href="#" style={{ fontWeight: 600, color: "#191c1e" }}>Home</a>
            <a href="#features" style={{ fontWeight: 600, color: "#191c1e" }}>Features</a>
            <a href="#pricing" style={{ fontWeight: 600, color: "#191c1e" }}>Pricing</a>
            <button 
              onClick={() => signIn("google", { callbackUrl: "/form" })}
              className="w-full text-white py-3 rounded-lg text-[0.95rem] mt-2"
              style={{ fontWeight: 700, background: "linear-gradient(135deg, #0061a4, #2196f3)" }}
            >
              Get Started
            </button>
          </motion.div>
        )}
      </nav>

      <main>
        {/* ═══════════════════════════════════════════════════════════════
            HERO — Editorial Asymmetry with Tonal Depth
            ═══════════════════════════════════════════════════════════════ */}
        <section className="relative pt-40 pb-28 px-8 overflow-hidden">
          {/* Ambient Gradient Blobs — very soft, barely-felt depth */}
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle, #d1e4ff 0%, transparent 70%)" }}></div>
          <div className="absolute bottom-[-100px] right-[-200px] w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #9ecaff 0%, transparent 70%)" }}></div>

          <div className="max-w-[1280px] mx-auto relative z-10">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
              
              {/* Pill Badge */}
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                style={{ background: "#d1e4ff", color: "#0061a4", fontSize: "0.85rem", fontWeight: 600 }}
              >
                <Zap size={14} /> Powered by Gemini AI
              </motion.div>

              {/* Headline — Manrope, editorial weight */}
              <motion.h1 
                variants={fadeUp}
                className="mb-6 leading-[1.08] tracking-[-0.03em]"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: "#191c1e", fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                Craft Your Perfect <br/>
                <span style={{ 
                  background: "linear-gradient(135deg, #0061a4, #2196f3)", 
                  WebkitBackgroundClip: "text", 
                  WebkitTextFillColor: "transparent" 
                }}>
                  Resume with AI
                </span>
              </motion.h1>

              {/* Subtitle — Inter body, softer */}
              <motion.p 
                variants={fadeUp}
                className="mb-10 leading-relaxed max-w-xl"
                style={{ color: "#404752", fontSize: "1.2rem", fontWeight: 500, letterSpacing: "-0.01em" }}
              >
                The Digital Tailor for your career. We blend editorial aesthetics with advanced AI to create resumes that don&apos;t just list skills — they tell your story.
              </motion.p>

              {/* Buttons — Gradient Primary, Tonal Secondary */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => signIn("google", { callbackUrl: "/form" })}
                  className="text-white px-8 py-4 rounded-xl text-[1.05rem] flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:shadow-xl active:scale-[0.97]"
                  style={{ 
                    fontWeight: 700, 
                    background: "linear-gradient(135deg, #0061a4, #2196f3)",
                    boxShadow: "0 8px 24px rgba(0, 97, 164, 0.25)"
                  }}
                >
                  Get Started Now <ArrowRight size={20} />
                </button>
                <button 
                  className="px-8 py-4 rounded-xl text-[1.05rem] flex items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-[0.97]"
                  style={{ fontWeight: 600, background: "#e6e8ea", color: "#191c1e" }}
                >
                  Watch Demo
                </button>
              </motion.div>
            </motion.div>

            {/* Floating AI Chip — The "Live-Diff" Chip (Stitch Signature Component) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block absolute right-0 top-72 max-w-sm"
            >
              <div 
                className="p-5 rounded-2xl"
                style={{ 
                  background: "rgba(255,255,255,0.7)", 
                  backdropFilter: "blur(20px)", 
                  boxShadow: "0 8px 32px rgba(25, 28, 30, 0.05)",
                  border: "1px solid rgba(191, 199, 212, 0.15)"
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} style={{ color: "#db7900" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#904d00", textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Suggestion</span>
                </div>
                <p style={{ fontSize: "0.875rem", color: "#191c1e", lineHeight: 1.6 }}>
                  Rephrased <span style={{ textDecoration: "line-through", color: "#707883" }}>&quot;Managed team&quot;</span> to <span style={{ fontWeight: 700, color: "#0061a4" }}>&quot;Spearheaded cross-functional initiatives&quot;</span> for 40% more impact.
                </p>
              </div>
            </motion.div>

            {/* Resume Editor Mockup — Tonal Surface Layering */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-20 mx-auto max-w-4xl relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#f7f9fb] via-transparent to-transparent z-10 pointer-events-none h-full w-full"></div>
              <div 
                className="rounded-t-2xl overflow-hidden mx-auto w-[90%] md:w-[85%]"
                style={{ 
                  background: "#ffffff", 
                  boxShadow: "0 24px 64px rgba(25, 28, 30, 0.06)",
                  border: "1px solid rgba(191, 199, 212, 0.15)"
                }}
              >
                {/* Mockup Header */}
                <div className="h-11 flex items-center px-5 gap-2" style={{ background: "#f2f4f6" }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ff6259" }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ffbf2f" }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ background: "#2ace42" }}></div>
                  <div className="ml-auto px-3 py-1 rounded-md" style={{ background: "#eceef0", fontSize: "0.7rem", fontWeight: 600, color: "#707883" }}>resume-editor.ai</div>
                </div>
                {/* Mockup Body */}
                <div className="p-10 px-14 pb-6" style={{ minHeight: "320px" }}>
                  <div className="h-9 w-56 rounded-lg mb-6" style={{ background: "#e6e8ea" }}></div>
                  <div className="flex gap-4 mb-8">
                    <div className="h-4 w-28 rounded-md" style={{ background: "#eceef0" }}></div>
                    <div className="h-4 w-36 rounded-md" style={{ background: "#eceef0" }}></div>
                    <div className="h-4 w-24 rounded-md" style={{ background: "#eceef0" }}></div>
                  </div>
                  <div className="h-5 w-36 rounded-md mb-4" style={{ background: "#d1e4ff" }}></div>
                  <div className="space-y-3 mb-8">
                    <div className="h-3 w-full rounded-md" style={{ background: "#f2f4f6" }}></div>
                    <div className="h-3 w-full rounded-md" style={{ background: "#f2f4f6" }}></div>
                    <div className="h-3 w-3/4 rounded-md" style={{ background: "#f2f4f6" }}></div>
                  </div>
                  <div className="h-5 w-28 rounded-md mb-4" style={{ background: "#d1e4ff" }}></div>
                  <div className="space-y-3">
                    <div className="h-3 w-full rounded-md" style={{ background: "#f2f4f6" }}></div>
                    <div className="h-3 w-4/5 rounded-md" style={{ background: "#f2f4f6" }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SOCIAL PROOF — Tonal background shift, no hard borders
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20" style={{ background: "#f2f4f6" }}>
          <div className="max-w-[1280px] mx-auto px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex flex-col items-center gap-10">
              
              <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20">
                <div className="flex items-center gap-3">
                  <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} size={22} style={{ color: "#db7900", fill: "#db7900" }} />)}</div>
                  <span style={{ fontWeight: 800, color: "#191c1e", fontSize: "1.05rem" }}>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2.5" style={{ fontWeight: 700, color: "#191c1e", fontSize: "1.05rem" }}>
                  <ShieldCheck size={24} style={{ color: "#0061a4" }} /> Secure & Confidential
                </div>
                <div className="flex items-center gap-2.5" style={{ fontWeight: 700, color: "#191c1e", fontSize: "1.05rem" }}>
                  <span className="px-3 py-1 rounded-full" style={{ background: "#d1e4ff", color: "#0061a4", fontWeight: 800 }}>50,000+</span>
                  Professionals Trust Us
                </div>
              </div>

              {/* Company logos — greyscale, understated as per "no-line" rule */}
              <div className="w-full flex flex-wrap justify-center items-center gap-12 md:gap-24 mt-2 opacity-40">
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em" }}>Spotify</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em" }}>Airbnb</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em" }}>Stripe</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em" }}>Microsoft</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FEATURES — Tonal cards with ghost borders, no hard lines
            ═══════════════════════════════════════════════════════════════ */}
        <section id="features" className="py-32 px-8" style={{ background: "#ffffff" }}>
          <div className="max-w-[1280px] mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="text-center mb-20">
              <h2 
                className="mb-5 tracking-[-0.03em]"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: "#191c1e", fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Engineered for Success
              </h2>
              <p style={{ color: "#404752", fontSize: "1.15rem", fontWeight: 500, maxWidth: "560px", margin: "0 auto" }}>
                We stripped away the clutter to focus on what matters: landing your next role.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Sparkles size={28} style={{ color: "#0061a4" }} />, title: "AI-Powered Builder", desc: "Our neural networks analyze thousands of winning resumes to suggest the perfect phrasing and layout for your specific industry." },
                { icon: <Target size={28} style={{ color: "#0061a4" }} />, title: "ATS Optimized", desc: "Stop getting ghosted by algorithms. We ensure your resume passes every major Applicant Tracking System with high-scoring keywords." },
                { icon: <Download size={28} style={{ color: "#0061a4" }} />, title: "Instant Download", desc: "Export to PDF or Word in seconds. One-click formatting ensures your layout remains pristine across all devices." }
              ].map((f, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl p-10 transition-all duration-500 hover:-translate-y-1 cursor-default"
                  style={{ 
                    background: "#f2f4f6", 
                    boxShadow: "none",
                    border: "1px solid rgba(191, 199, 212, 0.0)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.boxShadow = "0 16px 48px rgba(25, 28, 30, 0.06)";
                    e.currentTarget.style.border = "1px solid rgba(191, 199, 212, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f2f4f6";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.border = "1px solid rgba(191, 199, 212, 0.0)";
                  }}
                >
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-7"
                    style={{ background: "#d1e4ff" }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="mb-3 tracking-[-0.02em]" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: "#191c1e", fontSize: "1.4rem" }}>{f.title}</h3>
                  <p style={{ color: "#404752", fontSize: "0.95rem", lineHeight: 1.7, fontWeight: 500 }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            TESTIMONIAL — Deep primary background, editorial quote
            ═══════════════════════════════════════════════════════════════ */}
        <section id="testimonial" className="py-32 px-8 relative overflow-hidden" style={{ background: "#0061a4" }}>
          {/* Ambient blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 pointer-events-none" style={{ background: "#2196f3" }}></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ background: "#9ecaff" }}></div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto relative z-10"
          >
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
              {/* Avatar */}
              <div className="w-36 h-36 md:w-48 md:h-48 shrink-0 rounded-full overflow-hidden flex items-end justify-center relative" style={{ background: "#2196f3", border: "4px solid rgba(255,255,255,0.15)" }}>
                <svg className="w-28 h-28 absolute -bottom-3" fill="rgba(255,255,255,0.5)" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
              </div>

              <div className="text-center md:text-left">
                <Quote size={36} className="mb-5 mx-auto md:mx-0 opacity-40" style={{ color: "#ffffff" }} />
                <blockquote 
                  className="mb-8 leading-snug"
                  style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: "#ffffff", fontSize: "clamp(1.3rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}
                >
                  Luminance AI didn&apos;t just help me write a resume; it gave me the confidence to apply for roles I previously thought were out of reach.
                </blockquote>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.15rem", color: "#ffffff" }}>Sarah M.</div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#9ecaff", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>Product Manager at Stripe</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            CTA SECTION — Final push, gradient button
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-32 px-8 text-center" style={{ background: "#f7f9fb" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-2xl mx-auto">
            <motion.h2 
              variants={fadeUp} 
              className="mb-5 tracking-[-0.03em]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: "#191c1e", fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Ready to Elevate Your Career?
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: "#404752", fontSize: "1.1rem", fontWeight: 500, marginBottom: "2rem" }}>
              Join 50,000+ professionals who have transformed their job search with Luminance AI.
            </motion.p>
            <motion.div variants={fadeUp}>
              <button 
                onClick={() => signIn("google", { callbackUrl: "/form" })}
                className="text-white px-10 py-4 rounded-xl text-[1.1rem] transition-all hover:opacity-90 hover:shadow-xl active:scale-[0.97] inline-flex items-center gap-2"
                style={{ 
                  fontWeight: 700, 
                  background: "linear-gradient(135deg, #0061a4, #2196f3)",
                  boxShadow: "0 8px 24px rgba(0, 97, 164, 0.25)"
                }}
              >
                Create Your Resume <ArrowRight size={20} />
              </button>
              <p className="mt-4" style={{ fontSize: "0.85rem", color: "#707883", fontWeight: 500 }}>No credit card required. Standard templates are always free.</p>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER — Dark tonal surface, no hard borders
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="py-20 px-8" style={{ background: "#191c1e", color: "#707883" }}>
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-4 gap-12 pb-12 mb-12" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #0061a4, #2196f3)" }}>
                <Sparkles size={14} />
              </div>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "#ffffff" }}>Luminance AI</span>
            </div>
            <p className="max-w-sm mb-8" style={{ fontSize: "0.95rem", lineHeight: 1.7, fontWeight: 500 }}>
              Crafting the future of recruitment through artificial intelligence. Land your dream job today.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:opacity-80" style={{ background: "rgba(255,255,255,0.06)", color: "#bfc7d4" }}>
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-6" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: "#ffffff", fontSize: "0.95rem" }}>Product</h4>
            <ul className="space-y-4" style={{ fontSize: "0.9rem", fontWeight: 500 }}>
              <li><a href="#features" className="transition-colors hover:text-white">Features</a></li>
              <li><a href="#pricing" className="transition-colors hover:text-white">Pricing</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Templates</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: "#ffffff", fontSize: "0.95rem" }}>Legal</h4>
            <ul className="space-y-4" style={{ fontSize: "0.9rem", fontWeight: 500 }}>
              <li><a href="#" className="transition-colors hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto text-center md:text-left">
          <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>© 2026 Luminance AI. Crafted for precision.</p>
        </div>
      </footer>
    </div>
  );
}
