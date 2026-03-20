"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Petal {
  id: string;
  name: string;
  sanskrit: string;
  route: string;
  angle: number;
  color: string;
  icon: React.ReactNode;
  description: string;
}

const PETALS: Petal[] = [
  {
    id: "rishi",
    name: "Rishi",
    sanskrit: "ऋषि",
    route: "/rishi",
    angle: 0,
    color: "#FF6600",
    description: "Your assigned guide",
    icon: (
      <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="12" r="6" />
        <path d="M8 36c0-8 5-14 12-14s12 6 12 14" />
        <path d="M20 6c-2-4 0-6 0-6s2 2 0 6" strokeOpacity="0.6" />
      </svg>
    ),
  },
  {
    id: "antahkarana",
    name: "Antahkarana",
    sanskrit: "अन्तःकरण",
    route: "/antahkarana",
    angle: 60,
    color: "#DAA520",
    description: "The inner instrument",
    icon: (
      <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="20" r="16" strokeOpacity="0.3" />
        <circle cx="20" cy="20" r="12" strokeOpacity="0.5" />
        <circle cx="20" cy="20" r="8" strokeOpacity="0.7" />
        <circle cx="20" cy="20" r="4" strokeOpacity="0.9" />
        <circle cx="20" cy="20" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "nada",
    name: "Nada",
    sanskrit: "नाद",
    route: "/nada",
    angle: 120,
    color: "#8B0000",
    description: "Sacred sound",
    icon: (
      <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 20c2-8 4-8 6 0s4 8 6 0 4-8 6 0" />
        <circle cx="20" cy="28" r="3" strokeOpacity="0.5" />
        <path d="M14 32c0 0 3 4 6 4s6-4 6-4" strokeOpacity="0.3" />
      </svg>
    ),
  },
  {
    id: "yajna",
    name: "Yajna",
    sanskrit: "यज्ञ",
    route: "/yajna",
    angle: 180,
    color: "#FF4500",
    description: "Sacred offering",
    icon: (
      <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 32h16" />
        <path d="M14 32l6-18 6 18" />
        <path d="M20 14c-1-3 0-6 0-6s1 3 0 6" />
        <path d="M17 18c-2-2-1-5-1-5s2 1 1 5" strokeOpacity="0.7" />
        <path d="M23 18c2-2 1-5 1-5s-2 1-1 5" strokeOpacity="0.7" />
      </svg>
    ),
  },
  {
    id: "sabha",
    name: "Sabha",
    sanskrit: "सभा",
    route: "/sabha",
    angle: 240,
    color: "#2D1B69",
    description: "The assembly",
    icon: (
      <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="10" r="4" />
        <circle cx="10" cy="26" r="4" />
        <circle cx="30" cy="26" r="4" />
        <path d="M20 14v6m-7 3l5-3m9 3l-5-3" strokeOpacity="0.5" />
      </svg>
    ),
  },
  {
    id: "discovery",
    name: "Discovery",
    sanskrit: "अन्वेषण",
    route: "/discovery",
    angle: 300,
    color: "#F5E6C8",
    description: "Scientific bridge",
    icon: (
      <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="20" r="14" strokeDasharray="3 3" />
        <path d="M20 6v28M6 20h28" strokeOpacity="0.3" />
        <path d="M10 10l20 20M30 10l-20 20" strokeOpacity="0.2" />
        <circle cx="20" cy="20" r="3" fill="currentColor" fillOpacity="0.3" />
      </svg>
    ),
  },
];

function useRadius() {
  const [radius, setRadius] = useState(180);
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 400) setRadius(105);
      else if (w < 640) setRadius(120);
      else if (w < 768) setRadius(140);
      else setRadius(180);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return radius;
}

export default function MandalaNav() {
  const [hoveredPetal, setHoveredPetal] = useState<string | null>(null);
  const [tappedPetal, setTappedPetal] = useState<string | null>(null);
  const router = useRouter();
  const radius = useRadius();

  // Petal size: smaller on mobile
  const petalSize = radius < 130 ? 56 : radius < 150 ? 64 : 96;
  const halfPetal = petalSize / 2;

  const handlePetalClick = (petal: Petal) => {
    // On touch devices, first tap reveals label, second tap navigates
    if ("ontouchstart" in window) {
      if (tappedPetal === petal.id) {
        router.push(petal.route);
      } else {
        setTappedPetal(petal.id);
      }
    } else {
      router.push(petal.route);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center w-full overflow-hidden"
      style={{ minHeight: "100dvh" }}
      onClick={(e) => {
        // Clear tapped petal when clicking empty space
        if (e.target === e.currentTarget) setTappedPetal(null);
      }}
    >
      {/* Outer rings — responsive */}
      {[0, 1, 2].map((i) => {
        const ringSize = (radius * 2) + 40 + i * 40;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: ringSize,
              height: ringSize,
              borderColor: `rgba(218, 165, 32, ${0.05 + i * 0.02})`,
              willChange: "transform",
            }}
            animate={{ rotate: 360 * (i % 2 === 0 ? 1 : -1) }}
            transition={{
              duration: 120 + i * 40,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}

      {/* Central Atman point */}
      <motion.div
        className="absolute z-20 cursor-pointer"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setTappedPetal(null)}
      >
        <div className="relative">
          <motion.div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
            style={{
              background:
                "radial-gradient(circle, rgba(255,102,0,0.8) 0%, rgba(218,165,32,0.4) 50%, transparent 70%)",
            }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(255,102,0,0.3)",
                "0 0 40px rgba(255,102,0,0.5)",
                "0 0 20px rgba(255,102,0,0.3)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="font-devanagari text-lg sm:text-xl text-white font-bold">
              अ
            </span>
          </motion.div>
          <motion.p
            className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs text-vedic-gold/50 font-sacred whitespace-nowrap"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ATMAN
          </motion.p>
        </div>
      </motion.div>

      {/* Six petals */}
      {PETALS.map((petal) => {
        const angleRad = ((petal.angle - 90) * Math.PI) / 180;
        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;
        const isActive = hoveredPetal === petal.id || tappedPetal === petal.id;

        return (
          <motion.div
            key={petal.id}
            className="absolute cursor-pointer z-10"
            style={{
              left: `calc(50% + ${x}px - ${halfPetal}px)`,
              top: `calc(50% + ${y}px - ${halfPetal}px)`,
              width: petalSize,
              height: petalSize,
            }}
            onHoverStart={() => setHoveredPetal(petal.id)}
            onHoverEnd={() => setHoveredPetal(null)}
            onClick={() => handlePetalClick(petal)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-full h-full rounded-full flex flex-col items-center justify-center relative"
              style={{
                background: `radial-gradient(circle, ${petal.color}20 0%, ${petal.color}08 60%, transparent 70%)`,
                border: `1px solid ${petal.color}30`,
              }}
              animate={
                isActive
                  ? {
                      boxShadow: `0 0 30px ${petal.color}40`,
                      borderColor: `${petal.color}60`,
                    }
                  : {
                      boxShadow: `0 0 10px ${petal.color}10`,
                      borderColor: `${petal.color}20`,
                    }
              }
            >
              <div style={{ color: petal.color }}>{petal.icon}</div>
              <span
                className="font-devanagari text-[9px] sm:text-xs mt-0.5"
                style={{ color: petal.color }}
              >
                {petal.sanskrit}
              </span>
            </motion.div>

            {/* Label on hover/tap */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-center pointer-events-none"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <p
                    className="font-sacred text-xs sm:text-sm font-semibold"
                    style={{ color: petal.color }}
                  >
                    {petal.name}
                  </p>
                  <p className="text-vedic-parchment/40 text-[10px] sm:text-xs hidden sm:block">
                    {petal.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Connecting lines — hidden on mobile for clarity */}
      <svg
        className="absolute pointer-events-none hidden sm:block"
        width="500"
        height="500"
        viewBox="-250 -250 500 500"
      >
        {PETALS.map((petal) => {
          const angleRad = ((petal.angle - 90) * Math.PI) / 180;
          const x = Math.cos(angleRad) * (radius - 48);
          const y = Math.sin(angleRad) * (radius - 48);
          return (
            <line
              key={petal.id}
              x1="0"
              y1="0"
              x2={x}
              y2={y}
              stroke={petal.color}
              strokeWidth="0.5"
              strokeOpacity="0.15"
              strokeDasharray="4 8"
            />
          );
        })}
      </svg>
    </div>
  );
}
