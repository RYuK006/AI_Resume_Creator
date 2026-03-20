"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const Icon = ({ name, fill, className = "" }: { name: string; fill?: boolean; className?: string }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Icon name="arrow_back" className="text-primary group-hover:-translate-x-1 transition-transform" />
            <span className="font-headline font-bold text-on-surface">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Icon name="auto_awesome" fill className="text-primary text-xl" />
            <span className="font-headline font-black text-xl tracking-tighter">Luminance AI</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.h1 variants={fadeUp} className="font-headline text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Terms of Service
          </motion.h1>
          <motion.p variants={fadeUp} className="text-on-surface-variant mb-12 italic">
            Last Updated: March 20, 2026
          </motion.p>

          <motion.section variants={fadeUp} className="prose prose-slate max-w-none">
            <h2 className="font-headline text-2xl font-bold mt-12 mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed mb-6">
              By accessing or using Luminance AI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the application.
            </p>

            <h2 className="font-headline text-2xl font-bold mt-12 mb-4">2. Use License</h2>
            <p className="leading-relaxed mb-4">
              Permission is granted to temporarily use Luminance AI for personal, non-commercial professional use. This is the grant of a license, not a transfer of title, and under this license, you may not:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Modify or copy the core AI algorithms or proprietary design system.</li>
              <li>Use the materials for any commercial purpose (other than personal job searching).</li>
              <li>Attempt to decompile or reverse engineer any software contained within Luminance AI.</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>

            <h2 className="font-headline text-2xl font-bold mt-12 mb-4">3. AI-Generated Content</h2>
            <p className="leading-relaxed mb-6">
              Luminance AI provides AI-assisted content suggestions. While we strive for accuracy, we do not guarantee the correctness or suitability of any AI-generated text for any specific job application. You are solely responsible for reviewing and verifying all content in your final resume.
            </p>

            <h2 className="font-headline text-2xl font-bold mt-12 mb-12">4. Limitations</h2>
            <p className="leading-relaxed mb-6">
              In no event shall Luminance AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Luminance AI.
            </p>

            <h2 className="font-headline text-2xl font-bold mt-12 mb-4">5. Governing Law</h2>
            <p className="leading-relaxed mb-6">
              These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </motion.section>

          <motion.div variants={fadeUp} className="mt-20 pt-8 border-t border-outline-variant/20 text-center">
            <Link href="/" className="primary-gradient text-on-primary px-8 py-3 rounded-xl font-bold inline-block shadow-lg active:scale-95 transition-all">
              Accept & Return
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <footer className="py-12 bg-surface-container-low border-t border-outline-variant/10 text-center text-sm text-on-surface-variant">
        <p>© 2026 Luminance AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
