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
  threshold: number;
}

const KOSHAS: KoshaLevel[] = [
  { name: "Annamaya Kosha", key: "annamaya", sanskrit: "अन्नमय", practice: "Body scan, Marma activation, specific asana", frequency: "396 Hz", brainState: "Beta → Alpha", color: "#8B6B4A", threshold: 0 },
  { name: "Pranamaya Kosha", key: "pranamaya", sanskrit: "प्राणमय", practice: "Nadi Shodhana, Kapalabhati, Bhramari", frequency: "528 Hz", brainState: "Alpha", color: "#4A8B5E", threshold: 30 },
  { name: "Manomaya Kosha", key: "manomaya", sanskrit: "मनोमय", practice: "Pratyahara, Trataka, Svapna Vidya", frequency: "432 Hz", brainState: "Theta", color: "#4A7B9B", threshold: 30 },
  { name: "Vijnanamaya Kosha", key: "vijnanamaya", sanskrit: "विज्ञानमय", practice: "Deep meditation, self-inquiry, Neti Neti", frequency: "Theta 4-8 Hz", brainState: "Deep Theta", color: "#6B4B8A", threshold: 30 },
  { name: "Anandamaya Kosha", key: "anandamaya", sanskrit: "आनन्दमय", practice: "Yoga Nidra, Sukshma Sharira exploration", frequency: "136.1 Hz (OM)", brainState: "Delta border", color: "#9B8A4A", threshold: 30 },
];

export default function AntahkaranaView() {
  const [isBrahmaMuhurta, setIsBrahmaMuhurta] = useState(false);
  const [selectedKosha, setSelectedKosha] = useState(0);
  const [journalText, setJournalText] = useState("");
  const [koshaProgress, setKoshaProgress] = useLocalState<KoshaProgress>("aham_kosha", {
    annamaya: 0, pranamaya: 0, manomaya: 0, vijnanamaya: 0, anandamaya: 0,
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
    <div className="min-h-screen realm-earth">
      <BackToMandala />

      {/* Header */}
      <div className="text-center pt-20 sm:pt-16 pb-6 px-6">
        <motion.h1
          className="font-devanagari text-display text-vedic-parchment/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          अन्तःकरण
        </motion.h1>
        <motion.p
          className="font-sans text-[11px] tracking-[0.3em] uppercase text-vedic-parchment/15 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        >
          The Inner Instrument
        </motion.p>
      </div>

      {/* Brahma Muhurta */}
      {isBrahmaMuhurta && (
        <motion.div
          className="max-w-2xl mx-auto px-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center py-3">
            <motion.div
              className="inline-block w-1.5 h-1.5 rounded-full bg-vedic-saffron/50 mr-2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-vedic-saffron/40 text-[11px] font-sans tracking-wider uppercase">
              Brahma Muhurta Active
            </span>
          </div>
        </motion.div>
      )}

      {/* Kosha rings — the journey inward */}
      <div className="relative flex justify-center mb-10 sm:mb-14">
        <div className="relative w-60 h-60 sm:w-72 sm:h-72">
          {KOSHAS.map((kosha, i) => {
            const pct = 100 - i * (100 / KOSHAS.length);
            const size = `${pct}%`;
            const unlocked = isKoshaUnlocked(i);
            const progress = koshaProgress[kosha.key];
            const isSelected = selectedKosha === i;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full border cursor-pointer flex items-center justify-center transition-all duration-700"
                style={{
                  width: size,
                  height: size,
                  left: `calc(50% - ${pct / 2}%)`,
                  top: `calc(50% - ${pct / 2}%)`,
                  borderColor: isSelected ? `${kosha.color}50` : `${kosha.color}${unlocked ? '18' : '08'}`,
                  background: isSelected ? `radial-gradient(circle, ${kosha.color}08 0%, transparent 70%)` : "transparent",
                }}
                whileHover={unlocked ? { scale: 1.03 } : {}}
                onClick={() => unlocked && setSelectedKosha(i)}
              >
                {i === KOSHAS.length - 1 && (
                  <span className={`font-devanagari text-xl ${unlocked ? "text-vedic-parchment/30" : "text-vedic-parchment/8"}`}>
                    ॐ
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected kosha detail */}
      <div className="max-w-2xl mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedKosha}
            className="glass p-6 sm:p-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-devanagari text-xl" style={{ color: `${KOSHAS[selectedKosha].color}80` }}>
                {KOSHAS[selectedKosha].sanskrit}
              </span>
              <span className="font-sans text-[11px] tracking-wider uppercase text-vedic-parchment/20">
                {KOSHAS[selectedKosha].name}
              </span>
              {!isKoshaUnlocked(selectedKosha) && (
                <span className="text-[10px] text-vedic-parchment/15 font-sans ml-auto">Locked</span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Practice", value: KOSHAS[selectedKosha].practice },
                { label: "Frequency", value: KOSHAS[selectedKosha].frequency },
                { label: "Brain State", value: KOSHAS[selectedKosha].brainState },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-vedic-parchment/12 text-[9px] uppercase tracking-wider mb-1 font-sans">{item.label}</p>
                  <p className="text-vedic-parchment/40 text-[12px] font-sans">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-[10px] text-vedic-parchment/15 mb-2 font-sans">
                <span>Progress</span>
                <span>{Math.round(currentProgress)}%</span>
              </div>
              <div className="h-[2px] bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: `${KOSHAS[selectedKosha].color}60` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentProgress}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <button
              onClick={handleBeginPractice}
              disabled={!isKoshaUnlocked(selectedKosha)}
              className="px-6 py-2.5 rounded-full border border-white/[0.06] text-vedic-parchment/30 font-sans text-[11px] tracking-wider uppercase hover:bg-white/[0.02] transition-all duration-500 disabled:opacity-15 disabled:cursor-not-allowed"
            >
              Begin Practice
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Journal */}
        <div className="mt-10 sm:mt-14 pb-12">
          <p className="text-vedic-parchment/12 text-[10px] uppercase tracking-[0.2em] mb-4 font-sans">
            Journal {isBrahmaMuhurta && "· entries earn bonus progress"}
          </p>
          <div className="glass p-5 sm:p-6">
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Write what arises..."
              className="w-full bg-transparent text-vedic-parchment/50 font-sacred text-base resize-none outline-none placeholder:text-vedic-parchment/10 min-h-[80px]"
            />
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleSealEntry}
                disabled={!journalText.trim()}
                className="px-5 py-2 rounded-full border border-white/[0.06] text-vedic-parchment/25 font-sans text-[11px] tracking-wider uppercase hover:bg-white/[0.02] transition-all duration-500 disabled:opacity-15 disabled:cursor-not-allowed"
              >
                Seal
              </button>
              {journal.length > 0 && (
                <span className="text-[10px] text-vedic-parchment/10 font-sans">
                  {journal.length} sealed
                </span>
              )}
            </div>
          </div>

          {/* Previous entries */}
          {journal.length > 0 && (
            <div className="mt-4 space-y-2">
              {journal.slice(-3).reverse().map((entry) => (
                <div key={entry.id} className="glass-subtle px-4 py-3">
                  <p className="text-vedic-parchment/30 font-sacred text-sm leading-relaxed">
                    {entry.content}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[9px] text-vedic-parchment/8 font-sans">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                    {entry.isBrahmaMuhurta && (
                      <span className="text-[9px] text-vedic-saffron/20 font-sans">
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
    </div>
  );
}
