"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface BackToMandalaProps {
  onBeforeNavigate?: () => void;
}

export default function BackToMandala({ onBeforeNavigate }: BackToMandalaProps) {
  const router = useRouter();

  const handleClick = () => {
    onBeforeNavigate?.();
    router.push("/mandala");
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed top-5 left-5 sm:top-8 sm:left-8 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-vedic-void/80 backdrop-blur-md border border-white/[0.04] text-vedic-parchment/40 hover:text-vedic-parchment/70 transition-all duration-500 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="group-hover:-translate-x-0.5 transition-transform duration-300"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span className="font-sans text-[11px] tracking-wider uppercase">Back</span>
    </motion.button>
  );
}
