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
      className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-vedic-gold/20 bg-black/60 backdrop-blur-sm text-vedic-gold/70 hover:text-vedic-gold hover:border-vedic-gold/40 transition-all group"
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
        className="group-hover:-translate-x-0.5 transition-transform"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span className="font-sacred text-xs sm:text-sm">Mandala</span>
    </motion.button>
  );
}
