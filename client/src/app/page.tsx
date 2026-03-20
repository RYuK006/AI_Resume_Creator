"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7] px-6 text-center text-[#1d1d1f]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }} 
        className="max-w-4xl flex flex-col items-center"
      >
        <div className="mb-10 w-24 h-24 rounded-[28px] overflow-hidden shadow-sm bg-white flex items-center justify-center">
          <Image src="/logo.png" alt="AI Resume Logo" width={96} height={96} className="mix-blend-multiply opacity-90" />
        </div>
        
        <h1 className="text-5xl md:text-[5.5rem] leading-none font-semibold tracking-[-0.03em] mb-6 text-[#1d1d1f]">
          Resume Creator AI
        </h1>
        
        <p className="text-xl md:text-2xl text-[#86868b] mb-12 max-w-[600px] font-medium tracking-tight leading-snug">
          Build an incredible professional resume effortlessly. Sign in, upload your achievements, and let the intelligence do the rest.
        </p>
        
        <button 
          className="bg-[#0071e3] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#0077ed] transition-colors shadow-sm active:scale-95 flex items-center gap-2"
          onClick={() => signIn("google", { callbackUrl: "/form" })}
        >
          Get Started with Google
        </button>
      </motion.div>
    </main>
  );
}
