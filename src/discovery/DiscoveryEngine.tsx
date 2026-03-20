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
  {
    term: "Rta",
    sanskrit: "ऋत",
    domain: "Systems Theory",
    openProblem: "Does Rta (cosmic order) map to self-organising criticality in complex systems?",
    relatedVerses: ["Rig Veda 1.164.46", "Rig Veda 10.190"],
  },
  {
    term: "Spanda",
    sanskrit: "स्पन्द",
    domain: "Quantum Physics",
    openProblem: "Does quantum vacuum fluctuation correspond to Spanda (cosmic vibration)?",
    relatedVerses: ["Shiva Sutra 1.1", "Spanda Karika 1"],
  },
  {
    term: "Prana",
    sanskrit: "प्राण",
    domain: "Biophysics",
    openProblem: "Can bio-electromagnetic field dynamics be mapped to Pancha Prana?",
    relatedVerses: ["Prashna Upanishad 3.3", "Chandogya Upanishad 1.15"],
  },
  {
    term: "Akasha",
    sanskrit: "आकाश",
    domain: "Cosmology",
    openProblem: "Is dark energy a modern correlate of Akasha as the substratum of space?",
    relatedVerses: ["Taittiriya Upanishad 2.1", "Chandogya Upanishad 1.9"],
  },
  {
    term: "Chitta",
    sanskrit: "चित्त",
    domain: "Cognitive Science",
    openProblem: "Can Chitta Vrtti classification improve computational models of consciousness?",
    relatedVerses: ["Yoga Sutra 1.2", "Yoga Sutra 1.5"],
  },
  {
    term: "Maya",
    sanskrit: "माया",
    domain: "Neuroscience",
    openProblem: "Does the predictive-processing model of perception parallel Maya (constructed reality)?",
    relatedVerses: ["Mandukya Upanishad 7", "Vivekachudamani 108"],
  },
  {
    term: "Nada",
    sanskrit: "नाद",
    domain: "Acoustics",
    openProblem: "Can Nada Brahma inform new models of cymatics and phonon physics?",
    relatedVerses: ["Hatha Yoga Pradipika 4.67", "Nada Bindu Upanishad 1"],
  },
  {
    term: "Samskara",
    sanskrit: "संस्कार",
    domain: "Epigenetics",
    openProblem: "Does epigenetic memory encoding parallel Samskara (deep impression)?",
    relatedVerses: ["Yoga Sutra 1.18", "Yoga Sutra 4.9"],
  },
];

const CONFIDENCE_TIERS = [
  { label: "Structural Parallel", color: "#4169E1", description: "Vedic concept maps structurally to modern science" },
  { label: "Speculative", color: "#DAA520", description: "Interesting connection, not yet testable" },
  { label: "Testable", color: "#228B22", description: "Falsifiable hypothesis can be derived" },
  { label: "Verified", color: "#FF6600", description: "Modern research has confirmed the insight" },
];

export default function DiscoveryEngine() {
  const [selectedTerm, setSelectedTerm] = useState<LexiconEntry | null>(null);
  const [verseInput, setVerseInput] = useState("");

  return (
    <div className="min-h-screen px-4 py-6 sm:p-8 pt-16 sm:pt-8 max-w-5xl mx-auto">
      <BackToMandala />
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-sacred text-4xl text-vedic-gold mb-2">
          Discovery Engine
        </h1>
        <p className="font-devanagari text-2xl text-vedic-parchment/60">ऋत</p>
        <p className="text-vedic-parchment/40 mt-4 max-w-lg mx-auto">
          Science's new frontier. Mining patterns across the entire Vedic corpus
          that no individual researcher could find. Converting encoded statements
          into falsifiable scientific hypotheses.
        </p>
      </div>

      {/* Epistemic Honesty Legend */}
      <div className="sacred-card p-6 mb-8">
        <h3 className="font-sacred text-lg text-vedic-parchment/70 mb-4">
          Epistemic Honesty Tiers
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CONFIDENCE_TIERS.map((tier) => (
            <div key={tier.label} className="flex items-start gap-2">
              <div
                className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                style={{ backgroundColor: tier.color }}
              />
              <div>
                <p className="text-vedic-parchment/80 text-sm font-semibold">
                  {tier.label}
                </p>
                <p className="text-vedic-parchment/40 text-xs">
                  {tier.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verse analysis input */}
      <div className="sacred-card p-6 mb-8">
        <h3 className="font-sacred text-lg text-vedic-parchment/70 mb-4">
          Analyze a Verse
        </h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={verseInput}
            onChange={(e) => setVerseInput(e.target.value)}
            placeholder="Enter verse reference (e.g., Rig Veda 1.164.46)"
            className="flex-1 bg-transparent border-b border-vedic-gold/20 text-vedic-parchment p-2 outline-none placeholder:text-vedic-parchment/20"
          />
          <button className="px-6 py-2 border border-vedic-gold/30 text-vedic-gold font-sacred hover:bg-vedic-gold/10 transition-colors rounded">
            Generate Hypotheses
          </button>
        </div>
      </div>

      {/* Sanskrit Open Scientific Lexicon */}
      <h3 className="font-sacred text-xl text-vedic-gold/70 mb-6">
        Sanskrit Open Scientific Lexicon
        <span className="text-vedic-parchment/30 text-sm font-sans ml-2">
          96 terms mapped to open problems
        </span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LEXICON.map((entry) => (
          <motion.div
            key={entry.term}
            className={`sacred-card p-5 cursor-pointer transition-all ${
              selectedTerm?.term === entry.term
                ? "border-vedic-gold/40"
                : ""
            }`}
            whileHover={{ scale: 1.01 }}
            onClick={() =>
              setSelectedTerm(
                selectedTerm?.term === entry.term ? null : entry
              )
            }
          >
            <div className="flex items-baseline gap-3 mb-2">
              <h4 className="font-sacred text-lg text-vedic-saffron">
                {entry.term}
              </h4>
              <span className="font-devanagari text-vedic-parchment/50">
                {entry.sanskrit}
              </span>
              <span className="text-vedic-parchment/30 text-xs ml-auto">
                {entry.domain}
              </span>
            </div>
            <p className="text-vedic-parchment/60 text-sm">
              {entry.openProblem}
            </p>

            <AnimatePresence>
              {selectedTerm?.term === entry.term && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-vedic-ash/20"
                >
                  <p className="text-vedic-parchment/40 text-xs uppercase tracking-wider mb-2">
                    Related Verses
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {entry.relatedVerses.map((v) => (
                      <span
                        key={v}
                        className="px-2 py-1 text-xs border border-vedic-gold/20 text-vedic-gold/60 rounded"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
