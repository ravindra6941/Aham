"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackToMandala from "@/components/BackToMandala";
import { useLocalState, type KoshaProgress, type JournalEntry } from "@/lib/useLocalState";

interface KoshaLevel {
  name: string;
  key: keyof KoshaProgress;
  sanskrit: string;
  practice: string;
  frequency: string;
  brainState: string;
  color: string;
  threshold: number; // previous kosha must reach this % to unlock
}

const KOSHAS: KoshaLevel[] = [
  {
    name: "Annamaya Kosha",
    key: "annamaya",
    sanskrit: "अन्नमय कोश",
    practice: "Body scan, Marma activation, specific asana",
    frequency: "396 Hz",
    brainState: "Beta -> Alpha",
    color: "#8B4513",
    threshold: 0,
  },
  {
    name: "Pranamaya Kosha",
    key: "pranamaya",
    sanskrit: "प्राणमय कोश",
    practice: "Nadi Shodhana, Kapalabhati, Bhramari",
    frequency: "528 Hz",
    brainState: "Alpha",
    color: "#228B22",
    threshold: 30,
  },
  {
    name: "Manomaya Kosha",
    key: "manomaya",
    sanskrit: "मनोमय कोश",
    practice: "Pratyahara, Trataka, Svapna Vidya begins",
    frequency: "432 Hz",
    brainState: "Theta",
    color: "#4169E1",
    threshold: 30,
  },
  {
    name: "Vijnanamaya Kosha",
    key: "vijnanamaya",
    sanskrit: "विज्ञानमय कोश",
    practice: "Deep meditation, self-inquiry, Neti Neti",
    frequency: "Binaural Theta 4-8 Hz",
    brainState: "Deep Theta",
    color: "#9932CC",
    threshold: 30,
  },
  {
    name: "Anandamaya Kosha",
    key: "anandamaya",
    sanskrit: "आनन्दमय कोश",
    practice: "Yoga Nidra, Sukshma Sharira exploration",
    frequency: "136.1 Hz (OM)",
    brainState: "Delta border",
    color: "#FFD700",
    threshold: 30,
  },
];

export default function AntahkaranaView() {
  const [isBrahmaMuhurta, setIsBrahmaMuhurta] = useState(false);
  const [selectedKosha, setSelectedKosha] = useState(0);
  const [journalText, setJournalText] = useState("");
  const [koshaProgress, setKoshaProgress] = useLocalState<KoshaProgress>("aham_kosha", {
    annamaya: 0,
    pranamaya: 0,
    manomaya: 0,
    vijnanamaya: 0,
    anandamaya: 0,
  });
  const [journal, setJournal] = useLocalState<JournalEntry[]>("aham_journal", []);

  useEffect(() => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const totalMinutes = hour * 60 + minute;
    setIsBrahmaMuhurta(totalMinutes >= 264 && totalMinutes <= 348);
  }, []);

  const isKoshaUnlocked = (index: number): boolean => {
    if (index === 0) return true;
    const prevKosha = KOSHAS[index - 1];
    return koshaProgress[prevKosha.key] >= KOSHAS[index].threshold;
  };

  const handleBeginPractice = useCallback(() => {
    const kosha = KOSHAS[selectedKosha];
    if (!isKoshaUnlocked(selectedKosha)) return;
    setKoshaProgress((prev) => ({
      ...prev,
      [kosha.key]: Math.min(100, prev[kosha.key] + 5),
    }));
  }, [selectedKosha, setKoshaProgress]);

  const handleSealEntry = useCallback(() => {
    if (!journalText.trim()) return;
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      content: journalText.trim(),
      timestamp: new Date().toISOString(),
      koshaLevel: KOSHAS[selectedKosha].key,
      isBrahmaMuhurta,
    };
    setJournal((prev) => [...prev, entry]);
    setJournalText("");
    // Journaling during Brahma Muhurta gives progress
    if (isBrahmaMuhurta) {
      const kosha = KOSHAS[selectedKosha];
      setKoshaProgress((prev) => ({
        ...prev,
        [kosha.key]: Math.min(100, prev[kosha.key] + 10),
      }));
    }
  }, [journalText, selectedKosha, isBrahmaMuhurta, setJournal, setKoshaProgress]);

  const currentProgress = koshaProgress[KOSHAS[selectedKosha].key];

  return (
    <div className="min-h-screen px-4 py-6 sm:p-8 pt-16 sm:pt-8 max-w-4xl mx-auto">
      <BackToMandala />
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="font-sacred text-3xl sm:text-4xl text-vedic-gold mb-2">
          Antahkarana
        </h1>
        <p className="font-devanagari text-xl sm:text-2xl text-vedic-parchment/60">
          अन्तःकरण
        </p>
        <p className="text-vedic-parchment/40 mt-4 max-w-lg mx-auto text-sm sm:text-base">
          The inner instrument. Five layers of consciousness. Begin at the
          outermost and move inward. Cannot skip layers.
        </p>
      </div>

      {/* Brahma Muhurta indicator */}
      <motion.div
        className={`sacred-card p-4 mb-8 text-center ${
          isBrahmaMuhurta ? "border-vedic-saffron/40" : "border-vedic-ash/20"
        }`}
        animate={
          isBrahmaMuhurta
            ? { borderColor: ["rgba(255,102,0,0.2)", "rgba(255,102,0,0.5)", "rgba(255,102,0,0.2)"] }
            : {}
        }
        transition={{ duration: 3, repeat: Infinity }}
      >
        {isBrahmaMuhurta ? (
          <div>
            <p className="font-sacred text-lg text-vedic-saffron">
              Brahma Muhurta is active
            </p>
            <p className="text-vedic-parchment/50 text-sm mt-1">
              The sacred window before dawn is open. Journal entries earn extra progress.
            </p>
          </div>
        ) : (
          <div>
            <p className="font-sacred text-lg text-vedic-parchment/40">
              Brahma Muhurta has passed
            </p>
            <p className="text-vedic-parchment/30 text-sm mt-1">
              The texts remain, but certain doors open only before dawn.
            </p>
          </div>
        )}
      </motion.div>

      {/* Kosha rings */}
      <div className="relative flex justify-center mb-8 sm:mb-12">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
          {KOSHAS.map((kosha, i) => {
            // Use container-relative sizing: 100% of parent = 256px (mobile) or 320px (desktop)
            // This avoids SSR/client mismatch by using CSS-driven parent size
            const pct = 100 - i * (100 / KOSHAS.length);
            const size = `${pct}%`;
            const unlocked = isKoshaUnlocked(i);
            const progress = koshaProgress[kosha.key];
            return (
              <motion.div
                key={i}
                className="absolute rounded-full border-2 cursor-pointer flex items-center justify-center"
                style={{
                  width: size,
                  height: size,
                  left: `calc(50% - ${pct / 2}%)`,
                  top: `calc(50% - ${pct / 2}%)`,
                  borderColor: kosha.color,
                  opacity: unlocked ? 0.6 + (progress / 100) * 0.4 : 0.15,
                }}
                whileHover={unlocked ? { scale: 1.05 } : {}}
                onClick={() => unlocked && setSelectedKosha(i)}
              >
                {i === KOSHAS.length - 1 && (
                  <span className={`font-devanagari text-xl sm:text-2xl ${unlocked ? "text-vedic-gold/80" : "text-vedic-gold/20"}`}>
                    ॐ
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Kosha detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedKosha}
          className="sacred-card p-5 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mb-4">
            <h2 className="font-sacred text-xl sm:text-2xl" style={{ color: KOSHAS[selectedKosha].color }}>
              {KOSHAS[selectedKosha].name}
            </h2>
            <span className="font-devanagari text-base sm:text-lg text-vedic-parchment/60">
              {KOSHAS[selectedKosha].sanskrit}
            </span>
            {!isKoshaUnlocked(selectedKosha) && (
              <span className="text-xs text-vedic-parchment/30 bg-vedic-ash/30 px-2 py-0.5 rounded">
                Locked — complete previous layer
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div>
              <p className="text-vedic-parchment/40 text-xs uppercase tracking-wider mb-1">Practice</p>
              <p className="text-vedic-parchment/80 text-sm sm:text-base">{KOSHAS[selectedKosha].practice}</p>
            </div>
            <div>
              <p className="text-vedic-parchment/40 text-xs uppercase tracking-wider mb-1">Frequency</p>
              <p className="text-vedic-parchment/80 text-sm sm:text-base">{KOSHAS[selectedKosha].frequency}</p>
            </div>
            <div>
              <p className="text-vedic-parchment/40 text-xs uppercase tracking-wider mb-1">Brain State</p>
              <p className="text-vedic-parchment/80 text-sm sm:text-base">{KOSHAS[selectedKosha].brainState}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-vedic-parchment/40 mb-1">
              <span>Progress</span>
              <span>{Math.round(currentProgress)}%</span>
            </div>
            <div className="h-1.5 bg-vedic-ash/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: KOSHAS[selectedKosha].color }}
                initial={{ width: 0 }}
                animate={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>

          {/* Begin Practice button */}
          <button
            onClick={handleBeginPractice}
            disabled={!isKoshaUnlocked(selectedKosha)}
            className="px-6 py-3 border border-vedic-gold/30 text-vedic-gold font-sacred hover:bg-vedic-gold/10 transition-colors rounded disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Begin Practice
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Brahma Muhurta Journal */}
      <div className="mt-8 sm:mt-12">
        <h3 className="font-sacred text-xl text-vedic-gold/70 mb-4">
          Brahma Muhurta Journal
        </h3>
        <div className="sacred-card p-4 sm:p-6">
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder={
              isBrahmaMuhurta
                ? "Write what arises before dawn..."
                : "Journal available anytime. Brahma Muhurta entries earn bonus progress."
            }
            className="w-full bg-transparent text-vedic-parchment/70 font-sacred text-base sm:text-lg resize-none outline-none placeholder:text-vedic-parchment/20 min-h-[100px] sm:min-h-[120px]"
          />
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handleSealEntry}
              disabled={!journalText.trim()}
              className="px-6 py-2 border border-vedic-saffron/30 text-vedic-saffron font-sacred hover:bg-vedic-saffron/10 transition-colors rounded text-sm disabled:opacity-20 disabled:cursor-not-allowed"
            >
              Seal Entry
            </button>
            {journal.length > 0 && (
              <span className="text-xs text-vedic-parchment/30">
                {journal.length} {journal.length === 1 ? "entry" : "entries"} sealed
              </span>
            )}
          </div>
        </div>

        {/* Previous journal entries */}
        {journal.length > 0 && (
          <div className="mt-6 space-y-3">
            {journal.slice(-5).reverse().map((entry) => (
              <div key={entry.id} className="sacred-card p-4">
                <p className="text-vedic-parchment/60 font-sacred text-sm leading-relaxed">
                  {entry.content}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-vedic-parchment/20">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                  {entry.isBrahmaMuhurta && (
                    <span className="text-[10px] text-vedic-saffron/50 bg-vedic-saffron/10 px-1.5 py-0.5 rounded">
                      Brahma Muhurta
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
