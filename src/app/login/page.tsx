"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import FlameAnimation from "@/components/FlameAnimation";

export default function LoginPage() {
  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center px-6 overflow-hidden pb-8 sm:pb-0">
      {/* Flame */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="flex-shrink-0"
      >
        <FlameAnimation size="sm" />
      </motion.div>

      {/* Title */}
      <motion.div
        className="text-center mt-4 mb-6 sm:mt-6 sm:mb-10 flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1.5 }}
      >
        <h1 className="font-devanagari text-4xl sm:text-5xl text-vedic-gold mb-1">
          अहम्
        </h1>
        <p className="font-sacred text-lg sm:text-2xl text-vedic-parchment/60 tracking-widest">
          AHAM
        </p>
        <p className="font-sacred text-xs sm:text-sm text-vedic-parchment/30 mt-3 max-w-xs mx-auto">
          The Vedic Knowledge Engine
        </p>
      </motion.div>

      {/* Sign in button */}
      <motion.div
        className="flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-lg border border-vedic-gold/30 hover:border-vedic-gold/60 bg-vedic-ash/20 hover:bg-vedic-ash/40 transition-all duration-500 group active:scale-95"
        >
          {/* Google icon */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="font-sacred text-base sm:text-lg text-vedic-parchment/80 group-hover:text-vedic-parchment transition-colors">
            Continue with Google
          </span>
        </button>

        <p className="text-center text-vedic-parchment/20 text-[11px] sm:text-xs mt-4 sm:mt-6 font-sans">
          Your journey is private. We store nothing on servers.
        </p>
      </motion.div>
    </div>
  );
}
