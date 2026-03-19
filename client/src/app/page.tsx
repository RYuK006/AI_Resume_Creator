"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7] px-6 text-center text-[#1d1d1f]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }} 
        className="max-w-3xl flex flex-col items-center"
      >
        <Image src="/logo.png" alt="AI Resume Logo" width={90} height={90} className="mb-8 rounded-3xl shadow-sm" />
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
          Resume Creator AI
        </h1>
        
        <p className="text-xl text-[#86868b] mb-10 max-w-2xl font-medium tracking-tight leading-snug">
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
