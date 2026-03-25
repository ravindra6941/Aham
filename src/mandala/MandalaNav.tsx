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
  description: string;
}

const PETALS: Petal[] = [
  {
    id: "rishi",
    name: "Rishi",
    sanskrit: "ऋषि",
    route: "/rishi",
    angle: 0,
    color: "#E8720C",
    description: "Your assigned guide",
  },
  {
    id: "antahkarana",
    name: "Antahkarana",
    sanskrit: "अन्तःकरण",
    route: "/antahkarana",
    angle: 60,
    color: "#C4993B",
    description: "The inner instrument",
  },
  {
    id: "nada",
    name: "Nada",
    sanskrit: "नाद",
    route: "/nada",
    angle: 120,
    color: "#6B4B8A",
    description: "Sacred sound",
  },
  {
    id: "yajna",
    name: "Yajna",
    sanskrit: "यज्ञ",
    route: "/yajna",
    angle: 180,
    color: "#D94E1F",
    description: "Sacred offering",
  },
  {
    id: "sabha",
    name: "Sabha",
    sanskrit: "सभा",
    route: "/sabha",
    angle: 240,
    color: "#3A6B8A",
    description: "The assembly",
  },
  {
    id: "discovery",
    name: "Discovery",
    sanskrit: "अन्वेषण",
    route: "/discovery",
    angle: 300,
    color: "#8A7B5E",
    description: "Scientific bridge",
  },
];

function useRadius() {
  const [radius, setRadius] = useState(180);
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const min = Math.min(w, h);
      if (min < 400) setRadius(95);
      else if (min < 640) setRadius(115);
      else if (min < 768) setRadius(145);
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
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [seekerCount, setSeekerCount] = useState<number | null>(null);
  const [showShare, setShowShare] = useState(false);
  const router = useRouter();
  const radius = useRadius();

  // Track which petals the user has visited
  useEffect(() => {
    try {
      const stored = localStorage.getItem("aham_visited_petals");
      if (stored) setVisited(new Set(JSON.parse(stored)));
    } catch {}
  }, []);

  // Register as a seeker & get count
  useEffect(() => {
    fetch("/api/seekers", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setSeekerCount(d.count))
      .catch(() => {});
  }, []);

  const petalSize = radius < 130 ? 60 : radius < 155 ? 72 : 88;
  const halfPetal = petalSize / 2;

  const handlePetalClick = (petal: Petal) => {
    if ("ontouchstart" in window) {
      if (tappedPetal === petal.id) {
        markVisited(petal.id);
        router.push(petal.route);
      } else {
        setTappedPetal(petal.id);
      }
    } else {
      markVisited(petal.id);
      router.push(petal.route);
    }
  };

  const markVisited = (id: string) => {
    const next = new Set(visited);
    next.add(id);
    setVisited(next);
    try {
      localStorage.setItem("aham_visited_petals", JSON.stringify(Array.from(next)));
    } catch {}
  };

  return (
    <div
      className="relative flex items-center justify-center w-full overflow-hidden realm-cosmos"
      style={{ height: "100dvh" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setTappedPetal(null);
      }}
    >
      {/* Subtle ring */}
      <motion.div
        className="absolute rounded-full border border-white/[0.02]"
        style={{ width: radius * 2 + 30, height: radius * 2 + 30 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
      />

      {/* Central Atman — the heartbeat */}
      <motion.div
        className="absolute z-20 cursor-pointer"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setTappedPetal(null)}
      >
        <div className="relative flex flex-col items-center">
          <motion.div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center relative"
            style={{
              background:
                "radial-gradient(circle, rgba(232,114,12,0.25) 0%, rgba(196,153,59,0.08) 50%, transparent 70%)",
            }}
            animate={{
              boxShadow: [
                "0 0 30px rgba(232,114,12,0.1), 0 0 60px rgba(232,114,12,0.05)",
                "0 0 50px rgba(232,114,12,0.2), 0 0 100px rgba(232,114,12,0.08)",
                "0 0 30px rgba(232,114,12,0.1), 0 0 60px rgba(232,114,12,0.05)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-devanagari text-2xl text-vedic-parchment/90">
              अ
            </span>
          </motion.div>
          <motion.p
            className="absolute -bottom-7 text-[9px] tracking-[0.3em] uppercase text-vedic-parchment/15 font-sans"
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            ATMAN
          </motion.p>
        </div>
      </motion.div>

      {/* Petals — points of light */}
      {PETALS.map((petal, index) => {
        const angleRad = ((petal.angle - 90) * Math.PI) / 180;
        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;
        const isActive = hoveredPetal === petal.id || tappedPetal === petal.id;
        const hasVisited = visited.has(petal.id);

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
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.3 + index * 0.1,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            onHoverStart={() => setHoveredPetal(petal.id)}
            onHoverEnd={() => setHoveredPetal(null)}
            onClick={() => handlePetalClick(petal)}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
          >
            <motion.div
              className="w-full h-full rounded-full flex flex-col items-center justify-center relative"
              style={{
                background: isActive
                  ? `radial-gradient(circle, ${petal.color}18 0%, ${petal.color}06 60%, transparent 80%)`
                  : `radial-gradient(circle, ${petal.color}${hasVisited ? '0D' : '06'} 0%, transparent 70%)`,
              }}
              animate={{
                boxShadow: isActive
                  ? `0 0 40px ${petal.color}20, 0 0 80px ${petal.color}08`
                  : `0 0 ${hasVisited ? '20' : '8'}px ${petal.color}${hasVisited ? '0A' : '04'}`,
              }}
              transition={{ duration: 0.6 }}
            >
              {/* Devanagari as the primary identifier */}
              <span
                className="font-devanagari text-base sm:text-lg"
                style={{ color: isActive ? petal.color : `${petal.color}${hasVisited ? 'AA' : '60'}` }}
              >
                {petal.sanskrit}
              </span>
            </motion.div>

            {/* Label on hover/tap */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-center pointer-events-none"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <p
                    className="font-sans text-[11px] tracking-wider uppercase"
                    style={{ color: `${petal.color}CC` }}
                  >
                    {petal.name}
                  </p>
                  <p className="text-vedic-parchment/20 text-[10px] mt-0.5 hidden sm:block">
                    {petal.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Bottom — seeker count + share */}
      <motion.div
        className="absolute bottom-6 sm:bottom-10 left-0 right-0 flex flex-col items-center gap-3 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
      >
        {seekerCount !== null && (
          <p className="text-[10px] text-vedic-parchment/15 font-sans tracking-wider">
            {seekerCount} seekers have entered
          </p>
        )}
        <button
          onClick={() => setShowShare(true)}
          className="text-[10px] text-vedic-gold/25 hover:text-vedic-gold/50 font-sans tracking-wider uppercase transition-colors duration-500"
        >
          Invite a seeker
        </button>
      </motion.div>

      {/* Share overlay */}
      <AnimatePresence>
        {showShare && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShare(false)}
            />
            <motion.div
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto glass p-8 z-50 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="font-devanagari text-2xl text-vedic-parchment/60 mb-2">
                अहम्
              </h3>
              <p className="text-vedic-parchment/30 text-sm font-sans mb-6">
                Share AHAM with someone seeking wisdom
              </p>
              <div className="flex flex-col gap-3">
                {typeof navigator !== "undefined" && "share" in navigator && (
                  <button
                    onClick={async () => {
                      try {
                        await navigator.share({
                          title: "AHAM — Talk to Ancient Vedic Sages",
                          text: "I found this incredible app that lets you talk to ancient Vedic sages powered by AI. It's free.",
                          url: "https://aham-pi.vercel.app",
                        });
                      } catch {}
                      setShowShare(false);
                    }}
                    className="w-full py-3 rounded-full border border-vedic-saffron/20 text-vedic-saffron/60 text-[12px] font-sans tracking-wider uppercase hover:bg-vedic-saffron/5 transition-all duration-500"
                  >
                    Share
                  </button>
                )}
                <button
                  onClick={() => {
                    const text = encodeURIComponent(
                      "I've been talking to ancient Vedic sages through this AI app. It's free and quite profound:\nhttps://aham-pi.vercel.app"
                    );
                    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
                    setShowShare(false);
                  }}
                  className="w-full py-3 rounded-full border border-white/[0.06] text-vedic-parchment/30 text-[12px] font-sans tracking-wider uppercase hover:bg-white/[0.02] transition-all duration-500"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => {
                    const text = encodeURIComponent(
                      "Talk to ancient Vedic sages powered by AI. Free, no paywall.\n\nExplore consciousness, sound healing, and where 5,000-year-old wisdom meets modern science."
                    );
                    const url = encodeURIComponent("https://aham-pi.vercel.app");
                    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener");
                    setShowShare(false);
                  }}
                  className="w-full py-3 rounded-full border border-white/[0.06] text-vedic-parchment/30 text-[12px] font-sans tracking-wider uppercase hover:bg-white/[0.02] transition-all duration-500"
                >
                  Post on X
                </button>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText("https://aham-pi.vercel.app");
                    } catch {}
                    setShowShare(false);
                  }}
                  className="w-full py-3 rounded-full border border-white/[0.06] text-vedic-parchment/30 text-[12px] font-sans tracking-wider uppercase hover:bg-white/[0.02] transition-all duration-500"
                >
                  Copy Link
                </button>
              </div>
              <button
                onClick={() => setShowShare(false)}
                className="mt-4 text-[10px] text-vedic-parchment/15 font-sans hover:text-vedic-parchment/30 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
