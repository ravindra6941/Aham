"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import BackToMandala from "@/components/BackToMandala";

interface FrequencyBand {
  name: string;
  element: string;
  hz: string;
  frequency: number;
  binaural?: { left: number; right: number };
  kosha: string;
  mantra: string;
  mantraDevanagari: string;
  description: string;
  color: string;
}

const BANDS: FrequencyBand[] = [
  {
    name: "Prithvi",
    element: "Earth",
    hz: "396 Hz",
    frequency: 396,
    kosha: "Annamaya",
    mantra: "LAM",
    mantraDevanagari: "लम्",
    description: "Grounding. Fear release. Physical anchoring.",
    color: "#8B6B4A",
  },
  {
    name: "Apas",
    element: "Water",
    hz: "528 Hz",
    frequency: 528,
    kosha: "Pranamaya",
    mantra: "VAM",
    mantraDevanagari: "वम्",
    description: "Flow. Vital energy. DNA repair frequency.",
    color: "#4A7B9B",
  },
  {
    name: "Agni",
    element: "Fire",
    hz: "432 Hz",
    frequency: 432,
    kosha: "Manomaya",
    mantra: "RAM",
    mantraDevanagari: "रम्",
    description: "Natural tuning. Mental clarity. Transformation.",
    color: "#C4663B",
  },
  {
    name: "Vayu",
    element: "Air",
    hz: "Theta 4-8 Hz",
    frequency: 200,
    binaural: { left: 200, right: 206 },
    kosha: "Vijnanamaya",
    mantra: "OM",
    mantraDevanagari: "ॐ",
    description: "Expansion. Deep meditation access. Intuitive wisdom.",
    color: "#6B4B8A",
  },
  {
    name: "Akasha",
    element: "Ether",
    hz: "136.1 Hz",
    frequency: 136.1,
    kosha: "Anandamaya",
    mantra: "AUM",
    mantraDevanagari: "ॐ",
    description: "Earth year frequency. Cosmic alignment. Bliss.",
    color: "#9B8A4A",
  },
];

interface AudioNodes {
  ctx: AudioContext;
  oscillators: OscillatorNode[];
  gainNode: GainNode;
}

export default function NadaPlayer() {
  const [activeBand, setActiveBand] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<AudioNodes | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      const { oscillators, gainNode, ctx } = audioRef.current;
      gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
      setTimeout(() => {
        oscillators.forEach((osc) => {
          try { osc.stop(); } catch {}
        });
        ctx.close();
        audioRef.current = null;
      }, 200);
    }
  }, []);

  const playFrequency = useCallback((bandIndex: number) => {
    stopAudio();
    const band = BANDS[bandIndex];
    const ctx = new AudioContext();
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.setTargetAtTime(0.3, ctx.currentTime, 0.3);
    gainNode.connect(ctx.destination);
    const oscillators: OscillatorNode[] = [];

    if (band.binaural) {
      const mergerNode = ctx.createChannelMerger(2);
      mergerNode.connect(gainNode);
      const oscLeft = ctx.createOscillator();
      oscLeft.type = "sine";
      oscLeft.frequency.setValueAtTime(band.binaural.left, ctx.currentTime);
      const gainLeft = ctx.createGain();
      gainLeft.gain.setValueAtTime(1, ctx.currentTime);
      oscLeft.connect(gainLeft);
      gainLeft.connect(mergerNode, 0, 0);
      const oscRight = ctx.createOscillator();
      oscRight.type = "sine";
      oscRight.frequency.setValueAtTime(band.binaural.right, ctx.currentTime);
      const gainRight = ctx.createGain();
      gainRight.gain.setValueAtTime(1, ctx.currentTime);
      oscRight.connect(gainRight);
      gainRight.connect(mergerNode, 0, 1);
      oscLeft.start();
      oscRight.start();
      oscillators.push(oscLeft, oscRight);
    } else {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(band.frequency, ctx.currentTime);
      osc.connect(gainNode);
      osc.start();
      oscillators.push(osc);
      const overtone = ctx.createOscillator();
      overtone.type = "sine";
      overtone.frequency.setValueAtTime(band.frequency * 2, ctx.currentTime);
      const overtoneGain = ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.06, ctx.currentTime);
      overtone.connect(overtoneGain);
      overtoneGain.connect(gainNode);
      overtone.start();
      oscillators.push(overtone);
    }

    audioRef.current = { ctx, oscillators, gainNode };
  }, [stopAudio]);

  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== "/nada") {
      stopAudio();
      setActiveBand(null);
      setIsPlaying(false);
    }
  }, [pathname, stopAudio]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopAudio();
        setActiveBand(null);
        setIsPlaying(false);
      }
    };
    const handleBeforeUnload = () => stopAudio();
    const handlePopState = () => {
      stopAudio();
      setActiveBand(null);
      setIsPlaying(false);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      stopAudio();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [stopAudio]);

  const toggleBand = (index: number) => {
    if (activeBand === index) {
      stopAudio();
      setActiveBand(null);
      setIsPlaying(false);
    } else {
      playFrequency(index);
      setActiveBand(index);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen realm-water">
      <BackToMandala onBeforeNavigate={stopAudio} />

      {/* Header — centered, spacious */}
      <div className="text-center pt-20 sm:pt-16 pb-8 px-6">
        <motion.h1
          className="font-devanagari text-display text-vedic-parchment/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          नाद
        </motion.h1>
        <motion.p
          className="font-sans text-[11px] tracking-[0.3em] uppercase text-vedic-parchment/15 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        >
          The universe is sound
        </motion.p>
      </div>

      {/* Central ripple visualization */}
      <div className="flex justify-center mb-12 sm:mb-16">
        <div className="relative w-40 h-40 sm:w-52 sm:h-52">
          {/* Ripple rings when playing */}
          {isPlaying && activeBand !== null && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border"
                  style={{ borderColor: `${BANDS[activeBand].color}15` }}
                  animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
          {/* Center circle */}
          <motion.div
            className="absolute inset-0 m-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
            style={{
              background: activeBand !== null
                ? `radial-gradient(circle, ${BANDS[activeBand].color}15 0%, transparent 70%)`
                : "radial-gradient(circle, rgba(196,153,59,0.06) 0%, transparent 70%)",
            }}
            animate={isPlaying ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span
              className="font-devanagari text-2xl sm:text-3xl"
              style={{ color: activeBand !== null ? `${BANDS[activeBand].color}90` : "rgba(196,153,59,0.25)" }}
            >
              {activeBand !== null ? BANDS[activeBand].mantraDevanagari : "ॐ"}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Frequency bands — minimal rows */}
      <div className="max-w-2xl mx-auto px-6 space-y-1">
        {BANDS.map((band, i) => {
          const isActive = activeBand === i;
          return (
            <motion.button
              key={i}
              className="w-full text-left px-5 py-5 rounded-xl transition-all duration-500"
              style={{
                background: isActive ? `${band.color}08` : "transparent",
              }}
              onClick={() => toggleBand(i)}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-devanagari text-lg"
                    style={{ color: isActive ? band.color : `${band.color}50` }}
                  >
                    {band.mantraDevanagari}
                  </span>
                  <span
                    className="font-sans text-sm transition-colors duration-500"
                    style={{ color: isActive ? `${band.color}CC` : "rgba(232,220,200,0.25)" }}
                  >
                    {band.name}
                  </span>
                  <span className="text-vedic-parchment/10 text-[11px] font-sans hidden sm:inline">
                    {band.hz}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-vedic-parchment/10 text-[10px] font-sans hidden sm:inline">
                    {band.element}
                  </span>
                  {/* Play/Pause indicator */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500"
                    style={{
                      borderColor: isActive ? `${band.color}40` : "rgba(255,255,255,0.04)",
                      background: isActive ? `${band.color}10` : "transparent",
                    }}
                  >
                    {isActive && isPlaying ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill={`${band.color}90`}>
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill={isActive ? `${band.color}90` : "rgba(255,255,255,0.08)"}>
                        <polygon points="5 3 19 12 5 21" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              {/* Expanded detail when active */}
              {isActive && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-vedic-parchment/25 text-[12px] mt-3 font-sans"
                >
                  {band.description}
                </motion.p>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Gayatri Mantra — at the bottom, subtle */}
      <div className="mt-16 sm:mt-20 pb-12 text-center px-6">
        <div className="divider mb-8 max-w-lg mx-auto" />
        <p className="font-devanagari text-sm sm:text-base text-vedic-parchment/20 leading-relaxed max-w-md mx-auto">
          ओं भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्
        </p>
        <p className="text-vedic-parchment/8 text-[10px] mt-4 font-sans tracking-wider uppercase">
          Gayatri Mantra · Vishwamitra · 432 Hz
        </p>
      </div>
    </div>
  );
}
