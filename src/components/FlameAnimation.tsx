"use client";

import { motion } from "framer-motion";

interface FlameAnimationProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: { width: 40, height: 60 },
  md: { width: 80, height: 120 },
  lg: { width: 120, height: 180 },
  xl: { width: 200, height: 300 },
};

export default function FlameAnimation({
  size = "md",
  className = "",
}: FlameAnimationProps) {
  const { width, height } = sizeMap[size];

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: width * 1.5,
          height: height * 0.8,
          background:
            "radial-gradient(ellipse at center, rgba(255,102,0,0.15) 0%, transparent 70%)",
          bottom: 0,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Core flame SVG */}
      <motion.svg
        viewBox="0 0 100 150"
        width={width}
        height={height}
        className="relative z-10"
        animate={{
          scaleX: [1, 0.97, 1.02, 0.98, 1],
          scaleY: [1, 1.02, 0.98, 1.01, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Outer flame — saffron */}
        <motion.path
          d="M50 5 C50 5, 15 60, 15 90 C15 115, 30 140, 50 145 C70 140, 85 115, 85 90 C85 60, 50 5, 50 5Z"
          fill="url(#outerFlameGrad)"
          animate={{
            d: [
              "M50 5 C50 5, 15 60, 15 90 C15 115, 30 140, 50 145 C70 140, 85 115, 85 90 C85 60, 50 5, 50 5Z",
              "M50 8 C50 8, 18 55, 18 88 C18 112, 32 138, 50 143 C68 138, 82 112, 82 88 C82 55, 50 8, 50 8Z",
              "M50 3 C50 3, 13 62, 13 92 C13 117, 28 142, 50 147 C72 142, 87 117, 87 92 C87 62, 50 3, 50 3Z",
              "M50 5 C50 5, 15 60, 15 90 C15 115, 30 140, 50 145 C70 140, 85 115, 85 90 C85 60, 50 5, 50 5Z",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Inner flame — gold */}
        <motion.path
          d="M50 30 C50 30, 28 70, 28 95 C28 112, 38 130, 50 133 C62 130, 72 112, 72 95 C72 70, 50 30, 50 30Z"
          fill="url(#innerFlameGrad)"
          animate={{
            d: [
              "M50 30 C50 30, 28 70, 28 95 C28 112, 38 130, 50 133 C62 130, 72 112, 72 95 C72 70, 50 30, 50 30Z",
              "M50 35 C50 35, 32 68, 32 93 C32 110, 40 128, 50 131 C60 128, 68 110, 68 93 C68 68, 50 35, 50 35Z",
              "M50 28 C50 28, 26 72, 26 97 C26 114, 36 132, 50 135 C64 132, 74 114, 74 97 C74 72, 50 28, 50 28Z",
              "M50 30 C50 30, 28 70, 28 95 C28 112, 38 130, 50 133 C62 130, 72 112, 72 95 C72 70, 50 30, 50 30Z",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Core — white hot */}
        <motion.ellipse
          cx="50"
          cy="110"
          rx="12"
          ry="18"
          fill="url(#coreGrad)"
          animate={{
            rx: [12, 10, 13, 11, 12],
            ry: [18, 20, 17, 19, 18],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="outerFlameGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF4500" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#FF6600" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#DAA520" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B0000" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="innerFlameGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#FFA500" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF6600" stopOpacity="0.7" />
          </linearGradient>
          <radialGradient id="coreGrad">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#FFF8DC" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.5" />
          </radialGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
