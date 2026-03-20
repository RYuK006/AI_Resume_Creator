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

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Icon name="arrow_back" className="text-primary group-hover:-translate-x-1 transition-transform" />
            <span className="font-headline font-bold text-on-surface">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Icon name="verified_user" className="text-primary text-xl" />
            <span className="font-headline font-black text-xl tracking-tighter">Luminance AI</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.h1 variants={fadeUp} className="font-headline text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Privacy Policy
          </motion.h1>
          <motion.p variants={fadeUp} className="text-on-surface-variant mb-12 italic">
            Last Updated: March 20, 2026
          </motion.p>

          <motion.section variants={fadeUp} className="prose prose-slate max-w-none">
            <h2 className="font-headline text-2xl font-bold mt-12 mb-4">1. Introduction</h2>
            <p className="leading-relaxed mb-6">
              Welcome to Luminance AI. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI-powered resume creator.
            </p>

            <h2 className="font-headline text-2xl font-bold mt-12 mb-4">2. Information We Collect</h2>
            <p className="leading-relaxed mb-4">
              When you use our services, we may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and profile picture (via Google OAuth).</li>
              <li><strong>Professional Data:</strong> Employment history, education, skills, and other details you provide for your resume.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our application (log files, device info, etc.).</li>
            </ul>

            <h2 className="font-headline text-2xl font-bold mt-12 mb-4">3. How We Use Your Data</h2>
            <p className="leading-relaxed mb-6">
              Your data is primarily used to provide and enhance our resume-building services. We use AI models to analyze your professional data to suggest better phrasing and formatting. <strong>We do not sell your personal data to third parties.</strong>
            </p>

            <h2 className="font-headline text-2xl font-bold mt-12 mb-4">4. Data Security</h2>
            <p className="leading-relaxed mb-6">
              We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="font-headline text-2xl font-bold mt-12 mb-4">5. Contact Us</h2>
            <p className="leading-relaxed mb-6">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@luminanceai.com" className="text-primary font-bold">support@luminanceai.com</a>.
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
