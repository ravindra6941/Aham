"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackToMandala from "@/components/BackToMandala";

interface LexiconEntry {
  term: string;
  sanskrit: string;
  domain: string;
  openProblem: string;
  relatedVerses: string[];
}

const LEXICON: LexiconEntry[] = [
  { term: "Rta", sanskrit: "ऋत", domain: "Systems Theory", openProblem: "Does Rta (cosmic order) map to self-organising criticality in complex systems?", relatedVerses: ["Rig Veda 1.164.46", "Rig Veda 10.190"] },
  { term: "Spanda", sanskrit: "स्पन्द", domain: "Quantum Physics", openProblem: "Does quantum vacuum fluctuation correspond to Spanda (cosmic vibration)?", relatedVerses: ["Shiva Sutra 1.1", "Spanda Karika 1"] },
  { term: "Prana", sanskrit: "प्राण", domain: "Biophysics", openProblem: "Can bio-electromagnetic field dynamics be mapped to Pancha Prana?", relatedVerses: ["Prashna Upanishad 3.3", "Chandogya Upanishad 1.15"] },
  { term: "Akasha", sanskrit: "आकाश", domain: "Cosmology", openProblem: "Is dark energy a modern correlate of Akasha as the substratum of space?", relatedVerses: ["Taittiriya Upanishad 2.1", "Chandogya Upanishad 1.9"] },
  { term: "Chitta", sanskrit: "चित्त", domain: "Cognitive Science", openProblem: "Can Chitta Vrtti classification improve computational models of consciousness?", relatedVerses: ["Yoga Sutra 1.2", "Yoga Sutra 1.5"] },
  { term: "Maya", sanskrit: "माया", domain: "Neuroscience", openProblem: "Does the predictive-processing model of perception parallel Maya (constructed reality)?", relatedVerses: ["Mandukya Upanishad 7", "Vivekachudamani 108"] },
  { term: "Nada", sanskrit: "नाद", domain: "Acoustics", openProblem: "Can Nada Brahma inform new models of cymatics and phonon physics?", relatedVerses: ["Hatha Yoga Pradipika 4.67", "Nada Bindu Upanishad 1"] },
  { term: "Samskara", sanskrit: "संस्कार", domain: "Epigenetics", openProblem: "Does epigenetic memory encoding parallel Samskara (deep impression)?", relatedVerses: ["Yoga Sutra 1.18", "Yoga Sutra 4.9"] },
];

const CONFIDENCE_COLORS: Record<string, string> = {
  structural_parallel: "#4A7B9B",
  speculative: "#9B8A4A",
  testable: "#4A8B5E",
  verified: "#E8720C",
};

export default function DiscoveryEngine() {
  const [selectedTerm, setSelectedTerm] = useState<LexiconEntry | null>(null);
  const [verseInput, setVerseInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeVerse = async (input?: string) => {
    const query = input || verseInput.trim();
    if (!query || isAnalyzing) return;
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const res = await fetch("/api/discovery/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verse: query }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Analysis failed");
      }
      const data = await res.json();
      setAnalysisResult(data.content);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeLexiconEntry = (entry: LexiconEntry) => {
    const query = `${entry.term} (${entry.sanskrit}) — ${entry.domain}: ${entry.openProblem}. Related verses: ${entry.relatedVerses.join(", ")}`;
    setVerseInput(query);
    analyzeVerse(query);
  };

  return (
    <div className="min-h-screen realm-cosmos">
      <BackToMandala />

      {/* Header */}
      <div className="text-center pt-20 sm:pt-16 pb-6 px-6">
        <motion.h1
          className="font-devanagari text-display text-vedic-parchment/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          ऋत
        </motion.h1>
        <motion.p
          className="font-sans text-[11px] tracking-[0.3em] uppercase text-vedic-parchment/15 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        >
          Discovery Engine
        </motion.p>
        <motion.p
          className="text-vedic-parchment/20 mt-6 max-w-md mx-auto text-sm font-sans leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          Mining patterns across the Vedic corpus. Converting encoded
          statements into falsifiable scientific hypotheses.
        </motion.p>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        {/* Verse analysis input */}
        <div className="glass p-6 sm:p-8 mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={verseInput}
              onChange={(e) => setVerseInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") analyzeVerse(); }}
              placeholder="Enter a verse or concept..."
              className="flex-1 bg-transparent border-b border-white/[0.06] text-vedic-parchment/70 p-2 outline-none placeholder:text-vedic-parchment/10 text-sm font-sans focus:border-white/[0.12] transition-colors duration-500"
            />
            <button
              onClick={() => analyzeVerse()}
              disabled={!verseInput.trim() || isAnalyzing}
              className="px-6 py-2.5 rounded-full border border-white/[0.06] text-vedic-parchment/40 font-sans text-[12px] tracking-wider uppercase hover:bg-white/[0.02] hover:text-vedic-parchment/60 transition-all duration-500 disabled:opacity-20 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-red-400/50 text-sm font-sans">
              {error}
            </motion.p>
          )}

          <AnimatePresence>
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8"
              >
                <div className="divider mb-6" />
                <div className="text-vedic-parchment/60 text-sm leading-relaxed font-sans space-y-3">
                  {analysisResult.split("\n").map((line, i) => {
                    if (line.startsWith("**") && line.includes("**:")) {
                      const parts = line.split("**:");
                      const header = parts[0].replace(/\*\*/g, "");
                      const content = parts.slice(1).join("**:");
                      return (
                        <p key={i}>
                          <span className="font-semibold text-vedic-parchment/80">{header}:</span>
                          {content}
                        </p>
                      );
                    }
                    if (line.includes("[structural_parallel]")) return <p key={i} className="border-l-2 pl-4" style={{ borderColor: CONFIDENCE_COLORS.structural_parallel }}>{line}</p>;
                    if (line.includes("[speculative]")) return <p key={i} className="border-l-2 pl-4" style={{ borderColor: CONFIDENCE_COLORS.speculative }}>{line}</p>;
                    if (line.includes("[testable]")) return <p key={i} className="border-l-2 pl-4" style={{ borderColor: CONFIDENCE_COLORS.testable }}>{line}</p>;
                    if (line.includes("[verified]")) return <p key={i} className="border-l-2 pl-4" style={{ borderColor: CONFIDENCE_COLORS.verified }}>{line}</p>;
                    if (!line.trim()) return <br key={i} />;
                    return <p key={i}>{line}</p>;
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isAnalyzing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full bg-vedic-parchment/20"
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.25 }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Epistemic tiers legend — subtle */}
        <div className="flex flex-wrap gap-6 mb-10 justify-center">
          {[
            { label: "Structural Parallel", color: CONFIDENCE_COLORS.structural_parallel },
            { label: "Speculative", color: CONFIDENCE_COLORS.speculative },
            { label: "Testable", color: CONFIDENCE_COLORS.testable },
            { label: "Verified", color: CONFIDENCE_COLORS.verified },
          ].map((tier) => (
            <div key={tier.label} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tier.color }} />
              <span className="text-vedic-parchment/15 text-[10px] font-sans tracking-wider uppercase">{tier.label}</span>
            </div>
          ))}
        </div>

        {/* Lexicon */}
        <div className="space-y-2 pb-12">
          {LEXICON.map((entry) => {
            const isSelected = selectedTerm?.term === entry.term;
            return (
              <motion.div
                key={entry.term}
                className="rounded-xl px-5 py-4 cursor-pointer transition-all duration-500"
                style={{
                  background: isSelected ? "rgba(255,255,255,0.02)" : "transparent",
                }}
                onClick={() => setSelectedTerm(isSelected ? null : entry)}
                whileTap={{ scale: 0.995 }}
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="font-devanagari text-base text-vedic-parchment/40">
                      {entry.sanskrit}
                    </span>
                    <span className="font-sans text-sm text-vedic-parchment/30">
                      {entry.term}
                    </span>
                  </div>
                  <span className="text-vedic-parchment/10 text-[10px] font-sans tracking-wider uppercase">
                    {entry.domain}
                  </span>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <p className="text-vedic-parchment/30 text-sm font-sans leading-relaxed">
                        {entry.openProblem}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {entry.relatedVerses.map((v) => (
                          <span key={v} className="text-vedic-parchment/15 text-[10px] font-sans">
                            {v}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); analyzeLexiconEntry(entry); }}
                        disabled={isAnalyzing}
                        className="mt-4 px-5 py-2 rounded-full border border-white/[0.06] text-vedic-parchment/30 font-sans text-[11px] tracking-wider uppercase hover:bg-white/[0.02] transition-all duration-500 disabled:opacity-20"
                      >
                        {isAnalyzing ? "Analyzing..." : `Analyze ${entry.term}`}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
