"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import BackToMandala from "@/components/BackToMandala";

interface FrequencyBand {
  name: string;
  element: string;
  hz: string;
  frequency: number; // actual Hz value for oscillator
  binaural?: { left: number; right: number }; // for binaural beats
  kosha: string;
  mantra: string;
  mantreDevanagari: string;
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
    mantreDevanagari: "लम्",
    description: "Grounding frequencies resonating with the physical body. Fear release, physical anchoring.",
    color: "#8B4513",
  },
  {
    name: "Apas",
    element: "Water",
    hz: "528 Hz",
    frequency: 528,
    kosha: "Pranamaya",
    mantra: "VAM",
    mantreDevanagari: "वम्",
    description: "Flow frequencies activating prana and vital energy. DNA repair research.",
    color: "#1E90FF",
  },
  {
    name: "Agni",
    element: "Fire",
    hz: "432 Hz",
    frequency: 432,
    kosha: "Manomaya",
    mantra: "RAM",
    mantreDevanagari: "रम्",
    description: "Natural tuning frequency. Mental clarity, transformative energy.",
    color: "#FF4500",
  },
  {
    name: "Vayu",
    element: "Air",
    hz: "Binaural 4-8 Hz",
    frequency: 200,
    binaural: { left: 200, right: 206 }, // 6 Hz difference = theta
    kosha: "Vijnanamaya",
    mantra: "OM",
    mantreDevanagari: "ॐ",
    description: "Expansive frequencies for intuitive wisdom. Deep meditation access.",
    color: "#9370DB",
  },
  {
    name: "Akasha",
    element: "Ether",
    hz: "136.1 Hz",
    frequency: 136.1,
    kosha: "Anandamaya",
    mantra: "AUM",
    mantreDevanagari: "ॐ",
    description: "Earth year frequency — the cosmic OM. Bliss states, cosmic alignment.",
    color: "#FFD700",
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
      // Fade out to avoid clicks
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
    gainNode.gain.setTargetAtTime(0.3, ctx.currentTime, 0.3); // fade in
    gainNode.connect(ctx.destination);

    const oscillators: OscillatorNode[] = [];

    if (band.binaural) {
      // Binaural beats: different frequency in each ear via stereo panner
      const mergerNode = ctx.createChannelMerger(2);
      mergerNode.connect(gainNode);

      const oscLeft = ctx.createOscillator();
      oscLeft.type = "sine";
      oscLeft.frequency.setValueAtTime(band.binaural.left, ctx.currentTime);
      const gainLeft = ctx.createGain();
      gainLeft.gain.setValueAtTime(1, ctx.currentTime);
      oscLeft.connect(gainLeft);
      gainLeft.connect(mergerNode, 0, 0); // left channel

      const oscRight = ctx.createOscillator();
      oscRight.type = "sine";
      oscRight.frequency.setValueAtTime(band.binaural.right, ctx.currentTime);
      const gainRight = ctx.createGain();
      gainRight.gain.setValueAtTime(1, ctx.currentTime);
      oscRight.connect(gainRight);
      gainRight.connect(mergerNode, 0, 1); // right channel

      oscLeft.start();
      oscRight.start();
      oscillators.push(oscLeft, oscRight);
    } else {
      // Single tone with a subtle harmonic layer
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(band.frequency, ctx.currentTime);
      osc.connect(gainNode);
      osc.start();
      oscillators.push(osc);

      // Subtle overtone for richness
      const overtone = ctx.createOscillator();
      overtone.type = "sine";
      overtone.frequency.setValueAtTime(band.frequency * 2, ctx.currentTime);
      const overtoneGain = ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.08, ctx.currentTime);
      overtone.connect(overtoneGain);
      overtoneGain.connect(gainNode);
      overtone.start();
      oscillators.push(overtone);
    }

    audioRef.current = { ctx, oscillators, gainNode };
  }, [stopAudio]);

  // Stop audio on route change
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== "/nada") {
      stopAudio();
    }
  }, [pathname, stopAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopAudio(); };
  }, [stopAudio]);

  const toggleBand = (index: number) => {
    if (activeBand === index) {
      // Stop
      stopAudio();
      setActiveBand(null);
      setIsPlaying(false);
    } else {
      // Play new band
      playFrequency(index);
      setActiveBand(index);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:p-8 pt-16 sm:pt-8 max-w-4xl mx-auto">
      <BackToMandala onBeforeNavigate={stopAudio} />
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-sacred text-4xl text-vedic-gold mb-2">Nada</h1>
        <p className="font-devanagari text-2xl text-vedic-parchment/60">नाद</p>
        <p className="text-vedic-parchment/40 mt-4 max-w-lg mx-auto">
          Nada Brahma — the universe is sound. The Vedas were never meant to be
          read. They are vibrational technology.
        </p>
      </div>

      {/* Sound wave visualization */}
      <div className="flex justify-center mb-12">
        <svg width="400" height="80" viewBox="0 0 400 80" className="opacity-40">
          {[...Array(50)].map((_, i) => {
            const height = activeBand !== null
              ? 10 + Math.sin(i * 0.3 + Date.now() / 500) * 25
              : 10 + Math.sin(i * 0.5) * 5;
            return (
              <motion.rect
                key={i}
                x={i * 8}
                y={40 - height / 2}
                width="3"
                height={height}
                fill={activeBand !== null ? BANDS[activeBand].color : "#DAA520"}
                rx="1.5"
                animate={
                  isPlaying
                    ? {
                        height: [height, height * 1.5, height * 0.7, height],
                        y: [40 - height / 2, 40 - (height * 1.5) / 2, 40 - (height * 0.7) / 2, 40 - height / 2],
                      }
                    : {}
                }
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Frequency bands */}
      <div className="space-y-4">
        {BANDS.map((band, i) => (
          <motion.div
            key={i}
            className={`sacred-card p-6 cursor-pointer transition-all ${
              activeBand === i ? "border-opacity-60" : ""
            }`}
            style={{
              borderColor: activeBand === i ? band.color : undefined,
            }}
            whileHover={{ scale: 1.01 }}
            onClick={() => toggleBand(i)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="font-sacred text-xl" style={{ color: band.color }}>
                    {band.name}
                  </h3>
                  <span className="text-vedic-parchment/40 text-sm">
                    {band.element}
                  </span>
                  <span className="text-vedic-parchment/30 text-xs">
                    {band.kosha} Kosha
                  </span>
                </div>
                <p className="text-vedic-parchment/60 text-sm mb-3">
                  {band.description}
                </p>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-vedic-parchment/30 text-xs uppercase">
                      Frequency
                    </span>
                    <p className="text-vedic-parchment/80 font-mono text-sm">
                      {band.hz}
                    </p>
                  </div>
                  <div>
                    <span className="text-vedic-parchment/30 text-xs uppercase">
                      Bija Mantra
                    </span>
                    <p className="font-devanagari text-lg" style={{ color: band.color }}>
                      {band.mantreDevanagari}
                    </p>
                  </div>
                </div>
              </div>

              {/* Play button */}
              <motion.button
                className="w-12 h-12 rounded-full flex items-center justify-center border"
                style={{
                  borderColor: band.color,
                  backgroundColor: activeBand === i ? `${band.color}20` : "transparent",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {activeBand === i && isPlaying ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={band.color}>
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={band.color}>
                    <polygon points="5 3 19 12 5 21" />
                  </svg>
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gayatri Mantra section */}
      <div className="mt-12 sacred-card p-8 text-center">
        <h3 className="font-sacred text-xl text-vedic-gold mb-4">Gayatri Mantra</h3>
        <p className="font-devanagari text-xl text-vedic-parchment/80 leading-relaxed mb-4">
          ओं भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्
        </p>
        <p className="text-vedic-parchment/40 text-sm italic">
          Om bhur bhuvah svah tat savitur varenyam bhargo devasya dhimahi dhiyo
          yo nah prachodayat
        </p>
        <p className="text-vedic-parchment/30 text-xs mt-4">
          Composed by Vishwamitra — 432 Hz — Anandamaya Kosha
        </p>
      </div>
    </div>
  );
}
