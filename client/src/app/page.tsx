"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useState } from "react";

/* ─── Stitch Etheric Ledger — Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

/* Material Symbols helper */
const Icon = ({ name, fill, className = "" }: { name: string; fill?: boolean; className?: string }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">

      {/* ═══════════════════════════════════════════════════════════════
          NAVBAR — Glassmorphism, Stitch exact output
          ═══════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl font-headline antialiased shadow-[0_8px_32px_0_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-2">
            <Icon name="auto_awesome" fill className="text-primary text-2xl" />
            <span className="font-headline font-black text-2xl tracking-tighter text-on-surface">Luminance AI</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-blue-700 font-semibold hover:text-blue-600 transition-colors duration-200 active:scale-95">Home</a>
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors duration-200 active:scale-95">Features</a>
            <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors duration-200 active:scale-95">Pricing</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors duration-200 active:scale-95">Login</a>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="hidden md:block primary-gradient text-on-primary px-6 py-2.5 rounded-lg font-semibold shadow-sm active:scale-95 duration-150 transition-transform"
          >
            Get Started
          </button>

          {/* Mobile hamburger */}
          <button className="md:hidden text-slate-600" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "close" : "menu"} className="text-2xl" />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden px-8 py-6 flex flex-col gap-4 bg-white/95 backdrop-blur-xl border-t border-slate-100"
          >
            <a href="#" className="font-semibold text-on-surface py-2">Home</a>
            <a href="#features" className="font-semibold text-on-surface py-2">Features</a>
            <a href="#pricing" className="font-semibold text-on-surface py-2">Pricing</a>
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="primary-gradient text-white py-3 rounded-xl font-bold mt-2"
            >
              Get Started
            </button>
          </motion.div>
        )}
      </nav>

      <main className="pt-24 overflow-x-hidden">

        {/* ═══════════════════════════════════════════════════════════════
            HERO — Two-column asymmetric layout from Stitch
            ═══════════════════════════════════════════════════════════════ */}
        <section className="relative px-8 pt-8 pb-24">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

            {/* Left column — Copy */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="text-left">

              {/* AI Badge */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold mb-8"
              >
                <Icon name="auto_awesome" fill className="text-[16px]" />
                AI-DRIVEN PRECISION
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface mb-8 leading-[1.1]"
              >
                Craft Your Perfect Resume with <span className="text-primary">AI</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-on-surface-variant max-w-xl mb-10 leading-relaxed"
              >
                The Digital Tailor for your career. We blend editorial aesthetics with advanced AI to create resumes that don&apos;t just list skills—they tell your story.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <button
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="primary-gradient text-on-primary px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  Get Started Now
                </button>
                <button className="bg-surface-container-high text-on-surface px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-container-highest active:scale-95 transition-all">
                  View Templates
                </button>
              </motion.div>

              {/* Social Proof — integrated in hero per Stitch */}
              <motion.div variants={fadeUp} className="mt-16 flex flex-col gap-6">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Icon key={i} name="star" fill className="text-tertiary-container" />
                  ))}
                  <span className="ml-2 font-bold text-on-surface">4.9/5 Rating</span>
                  <span className="text-on-surface-variant text-sm ml-2">by 10k+ professionals</span>
                </div>
                <div className="flex flex-wrap items-center gap-8 opacity-40 grayscale contrast-125">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuArrdMqSEdTrYLClHQq2atbuRRZGmMVKNGSH6PN0dNcsOXSfG_naJll3O8r02hbWZIrIeWl6Xj1wcYXwDxErjspCz_h0HpDMi5PG-3DZZYOFOx9TnjGx3mzios-24POAqiSHVWOPn7DfoSxcZsEdIfojHsOsDEJQSqyHd_DuJd8qXT_9fnAQ_-u3TGewJ7iw_J68oxW1EAxmSYw6_wp_w_LH8O6Wg7fgcruG--brbp_zJ8Ge9Owc9_Dx243RLdrkMOdSkZOq5NLNaA" alt="Spotify" className="h-6" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8jyZaHRtK5ur_pOZJ6oqRMaDgkog8snugfq31oeD5wcBrDiue9EAb_LQ6PDYo05cU2C5ooPbzxqoNoCgE4ENCk5ysKhAxX8KjtN-eHNrWlxLgJWCwEn5cZP1Z2rkrdosCGG-Y1CmEKdt6F76fiBs3h-S4ZNU7Ts0ZiBC95f0bxsr9S6d5stAmIaSnSWjwqSlAIhVwXWKLaMzZxd3QZ0oln3pCbvWYSSNpcPzrHLoJPb1tq3sPBm9sA7DD05nE9TTYVNZUG-z4XFk" alt="Airbnb" className="h-6" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_C_1ZBs6tPg7HPCSqgYrhDfusect5_MHF2dwloZsUQEQVueAeO1Ba8uWGnobqJdOd0Vubf8QkxsuSIO5vQDmY0q9rFgbEmX05SyaPN2x43s1AMTLmmu8AevBFvBnEkk5evJNCpuflQmE8dtAeNBP-psVO9zi_HUyT8jJiP9KNh6WomHDiqyHs1Xc3uyB7b8T91499YNsDh53jN1HUhbXBtLGUClxfq69ia8QrkFushIbPPRhkmkpKO6aaHZ86ofW2MEpiz-Qaeik" alt="Stripe" className="h-6" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHqe2MwdmKZS6hwwBUUXK3tvGOhigm5ZlgIMNhGKTlv33B4Pn3mF1SKedIQi3f-M89AYclsKSRWu48f0E-D9Jg7Nt6NOD8IN1d2RhqIhQ6ZBOEo4Vq43ikYI4-V7sPvXJxAMDrSgKhc4-fub1IpPTJlVEyB-lxWKUCRI72g6orN9ZTKE8q0KYgZ7lH8ECtyQABVBQSFc7YrXvl6-NLNqnsxmiINXH6jwA05B8u0pJe_s4qWcqEUoKx47xcItacbPLt_y8li-NYwqQ" alt="Google" className="h-6" />
                </div>
              </motion.div>
            </motion.div>

            {/* Right column — Resume Mockup with AI Popover */}
            <motion.div
              initial={{ opacity: 0, x: 40, rotate: 0 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative lg:translate-x-12"
            >
              {/* Decorative blobs */}
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-container/20 rounded-full blur-[100px] -z-10"></div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-secondary-container/20 rounded-full blur-[100px] -z-10"></div>

              <div className="glass-card p-4 rounded-2xl shadow-2xl border border-outline-variant/15 rotate-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-resume-mockup.png"
                  alt="Resume editor interface mockup"
                  className="rounded-xl w-full object-cover aspect-[4/5] shadow-inner"
                />

                {/* AI Suggestion Popover — Stitch "Live-Diff" chip */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="absolute top-1/2 -left-8 glass-card p-4 rounded-xl shadow-xl border border-outline-variant/20 max-w-[200px] -rotate-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="auto_awesome" fill className="text-primary text-sm" />
                    <span className="text-[10px] font-bold tracking-widest text-primary uppercase">AI Improvement</span>
                  </div>
                  <p className="text-[11px] leading-tight text-on-surface-variant italic">
                    &ldquo;Rephrased &lsquo;Managed team&rsquo; to &lsquo;Spearheaded cross-functional initiatives&rsquo; for 40% more impact.&rdquo;
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FEATURES — Bento grid with icon-swap hover from Stitch
            ═══════════════════════════════════════════════════════════════ */}
        <section id="features" className="py-24 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
              className="mb-16"
            >
              <h2 className="font-headline text-4xl font-extrabold text-on-surface mb-4">Engineered for Success</h2>
              <p className="text-on-surface-variant max-w-2xl">We stripped away the clutter to focus on what matters: landing your next role.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "psychology",
                  title: "AI-Powered Builder",
                  desc: "Our neural networks analyze thousands of winning resumes to suggest the perfect phrasing and layout for your specific industry.",
                  bgColor: "bg-primary-fixed",
                  iconColor: "text-primary",
                  hoverBg: "group-hover:bg-primary",
                  hoverText: "group-hover:text-on-primary",
                },
                {
                  icon: "verified",
                  title: "ATS Optimized",
                  desc: "Stop getting ghosted by algorithms. We ensure your resume passes every major Applicant Tracking System with high-scoring keywords.",
                  bgColor: "bg-secondary-fixed",
                  iconColor: "text-secondary",
                  hoverBg: "group-hover:bg-secondary",
                  hoverText: "group-hover:text-on-secondary",
                },
                {
                  icon: "file_download",
                  title: "Instant Download",
                  desc: "Export to PDF or Word in seconds. One-click formatting ensures your layout remains pristine across all devices and screen sizes.",
                  bgColor: "bg-tertiary-fixed",
                  iconColor: "text-tertiary",
                  hoverBg: "group-hover:bg-tertiary",
                  hoverText: "group-hover:text-on-tertiary",
                },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="group bg-surface-container-lowest p-10 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className={`w-14 h-14 rounded-2xl ${f.bgColor} flex items-center justify-center mb-8 ${f.iconColor} ${f.hoverBg} ${f.hoverText} transition-colors`}>
                    <Icon name={f.icon} className="text-3xl" />
                  </div>
                  <h3 className="font-headline text-2xl font-bold mb-4">{f.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            TESTIMONIAL — With real avatar from Stitch
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-32 px-8 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto flex flex-col items-center text-center"
          >
            {/* Avatar with quote badge */}
            <div className="relative inline-block mb-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB9twLVwen4uS_FmNDW3CCs8cfpXBVTFbCEwF5r6NEUxXoAgW85XIzCi4VOceBWt5TVpdfSQqDjZsz-FpiDev_EIZ9pSrsmH-hSZs5Ve3XI6uvr0WHljDvUsrKrd0RU9trmqxEqCFENJcusz68VwVOZYEsi7grOL2-mO1OaVF_uP6j43rapf6pPF72-Zrps-46S4Wrgr05BuLY7u72LRrQuIdI5tysL5DXuJ2Qjj323SFeGj68t0g5Dca6VDAKZxj5nl5PV3JFJ84"
                alt="Jameson Carter"
                className="w-24 h-24 rounded-full object-cover border-4 border-surface-container-lowest shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-1.5 rounded-full shadow-lg">
                <Icon name="format_quote" fill className="text-[14px]" />
              </div>
            </div>

            <blockquote className="max-w-3xl">
              <p className="font-headline text-3xl md:text-4xl font-bold text-on-surface italic leading-snug mb-8">
                &ldquo;Luminance AI didn&apos;t just help me write a resume; it gave me the confidence to apply for roles I previously thought were out of reach. I landed an offer at Stripe within two weeks.&rdquo;
              </p>
              <footer className="flex flex-col items-center">
                <span className="font-headline font-bold text-lg text-on-surface">Jameson Carter</span>
                <span className="text-on-surface-variant text-sm tracking-widest uppercase">Senior Software Engineer</span>
              </footer>
            </blockquote>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            PRICING — Three-tier system
            ═══════════════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-24 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}
              className="text-center mb-16"
            >
              <h2 className="font-headline text-4xl font-extrabold text-on-surface mb-4">Simple, Transparent Pricing</h2>
              <p className="text-on-surface-variant max-w-xl mx-auto">Start free. Upgrade when you need more power.</p>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {/* ── Free Tier ── */}
              <motion.div variants={fadeUp}
                className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/15 flex flex-col"
              >
                <div className="mb-6">
                  <h3 className="font-headline text-lg font-bold text-on-surface mb-1">Free</h3>
                  <p className="text-on-surface-variant text-sm">Perfect for getting started</p>
                </div>
                <div className="mb-6">
                  <span className="font-headline text-4xl font-extrabold text-on-surface">$0</span>
                  <span className="text-on-surface-variant text-sm ml-1">/month</span>
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {["3 AI-generated resumes", "2 templates (Modern, Minimal)", "Basic ATS scoring", "PDF export", "Community support"].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                      <Icon name="check_circle" fill className="text-primary text-base mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="w-full py-3 rounded-xl font-semibold bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all active:scale-95"
                >
                  Get Started Free
                </button>
              </motion.div>

              {/* ── Pro Tier (Popular) ── */}
              <motion.div variants={fadeUp}
                className="bg-surface-container-lowest rounded-2xl p-8 border-2 border-primary flex flex-col relative shadow-xl shadow-primary/10"
              >
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 primary-gradient text-on-primary text-xs font-bold px-4 py-1 rounded-full tracking-wider uppercase">
                  Most Popular
                </div>
                <div className="mb-6">
                  <h3 className="font-headline text-lg font-bold text-on-surface mb-1">Pro</h3>
                  <p className="text-on-surface-variant text-sm">For active job seekers</p>
                </div>
                <div className="mb-6">
                  <span className="font-headline text-4xl font-extrabold text-on-surface">$12</span>
                  <span className="text-on-surface-variant text-sm ml-1">/month</span>
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {["Unlimited AI resumes", "All 7 templates", "Advanced ATS scoring", "Job Match optimizer", "AI auto-fix suggestions", "Priority PDF export", "Email support"].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                      <Icon name="check_circle" fill className="text-primary text-base mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="w-full py-3 rounded-xl font-bold primary-gradient text-on-primary shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95"
                >
                  Start Pro Trial
                </button>
              </motion.div>

              {/* ── Enterprise Tier ── */}
              <motion.div variants={fadeUp}
                className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/15 flex flex-col"
              >
                <div className="mb-6">
                  <h3 className="font-headline text-lg font-bold text-on-surface mb-1">Enterprise</h3>
                  <p className="text-on-surface-variant text-sm">For teams & recruiters</p>
                </div>
                <div className="mb-6">
                  <span className="font-headline text-4xl font-extrabold text-on-surface">$29</span>
                  <span className="text-on-surface-variant text-sm ml-1">/month</span>
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {["Everything in Pro", "Team collaboration", "Custom branding on templates", "Bulk resume generation", "API access", "Analytics dashboard", "Dedicated account manager"].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                      <Icon name="check_circle" fill className="text-primary text-base mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="w-full py-3 rounded-xl font-semibold bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all active:scale-95"
                >
                  Contact Sales
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            CTA — Rounded gradient card from Stitch
            ═══════════════════════════════════════════════════════════════ */}
        <section className="px-8 pb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-7xl mx-auto rounded-[3rem] primary-gradient p-16 md:p-24 text-center text-on-primary overflow-hidden relative"
          >
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <h2 className="font-headline text-4xl md:text-6xl font-extrabold mb-8">Ready to Elevate Your Career?</h2>
              <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-2xl mx-auto">
                Join 50,000+ professionals who have transformed their job search with Luminance AI.
              </p>
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="bg-white text-primary px-10 py-5 rounded-2xl font-bold text-xl shadow-xl hover:bg-slate-50 transition-all active:scale-95"
              >
                Build Your Free Resume
              </button>
              <p className="mt-8 text-sm opacity-75">No credit card required. Standard templates are always free.</p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER — From Stitch, clean and minimal
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="w-full py-12 border-t border-slate-200/15 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6 font-headline text-sm">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-lg font-bold text-slate-900">Luminance AI</div>
            <p className="text-slate-500">© 2026 Luminance AI. Crafted for precision.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Contact Support</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Twitter</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
