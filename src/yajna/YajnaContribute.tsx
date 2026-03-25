"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BackToMandala from "@/components/BackToMandala";

type ContributionKind = "hypothesis" | "finding" | "discovery" | "translation" | "commentary";

const KINDS: { value: ContributionKind; label: string; description: string }[] = [
  { value: "hypothesis", label: "Hypothesis", description: "A falsifiable hypothesis derived from Vedic knowledge" },
  { value: "finding", label: "Finding", description: "Modern research connecting to a specific verse" },
  { value: "discovery", label: "Discovery", description: "A convergence signal — ancient and modern align" },
  { value: "translation", label: "Translation", description: "A new or improved translation of a passage" },
  { value: "commentary", label: "Commentary", description: "Philosophical commentary on a verse or concept" },
];

export default function YajnaContribute() {
  const [selectedKind, setSelectedKind] = useState<ContributionKind>("hypothesis");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen realm-fire">
      <BackToMandala />

      {/* Header */}
      <div className="text-center pt-20 sm:pt-16 pb-6 px-6">
        <motion.h1
          className="font-devanagari text-display text-vedic-parchment/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          यज्ञ
        </motion.h1>
        <motion.p
          className="font-sans text-[11px] tracking-[0.3em] uppercase text-vedic-parchment/15 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        >
          Sacred Offering
        </motion.p>
        <motion.p
          className="text-vedic-parchment/20 mt-6 max-w-md mx-auto text-sm font-sans leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          Knowledge received must be transmitted. Every other section is about
          receiving. This is where you give back.
        </motion.p>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-12">
        {/* Contribution form */}
        <div className="glass p-6 sm:p-8">
          {/* Kind selection */}
          <div className="mb-8">
            <p className="text-vedic-parchment/12 text-[9px] uppercase tracking-[0.2em] mb-3 font-sans">
              Type
            </p>
            <div className="flex flex-wrap gap-2">
              {KINDS.map((kind) => (
                <button
                  key={kind.value}
                  className={`px-4 py-2 rounded-full text-[11px] tracking-wider font-sans transition-all duration-500 ${
                    selectedKind === kind.value
                      ? "text-vedic-saffron/60 bg-vedic-saffron/8 border border-vedic-saffron/15"
                      : "text-vedic-parchment/20 border border-white/[0.04] hover:text-vedic-parchment/35"
                  }`}
                  onClick={() => setSelectedKind(kind.value)}
                >
                  {kind.label}
                </button>
              ))}
            </div>
            <p className="text-vedic-parchment/12 text-[11px] mt-3 font-sans">
              {KINDS.find((k) => k.value === selectedKind)?.description}
            </p>
          </div>

          {/* Title */}
          <div className="mb-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title — be precise"
              className="w-full bg-transparent border-b border-white/[0.06] text-vedic-parchment/60 font-sacred text-lg p-2 outline-none placeholder:text-vedic-parchment/8 focus:border-white/[0.12] transition-colors duration-500"
            />
          </div>

          {/* Body */}
          <div className="mb-8">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                selectedKind === "hypothesis"
                  ? "Vedic source, modern parallel, falsifiable hypothesis, suggested experiment..."
                  : "Your contribution with verse citations..."
              }
              className="w-full bg-white/[0.01] text-vedic-parchment/40 resize-none outline-none placeholder:text-vedic-parchment/8 min-h-[180px] border border-white/[0.04] rounded-xl p-4 font-sans text-sm focus:border-white/[0.08] transition-colors duration-500"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <motion.button
              className="px-8 py-3 rounded-full bg-vedic-saffron/10 text-vedic-saffron/50 border border-vedic-saffron/15 font-sans text-[12px] tracking-wider uppercase hover:bg-vedic-saffron/15 transition-all duration-500 disabled:opacity-15"
              disabled={!title.trim() || !body.trim()}
              onClick={handleSubmit}
              whileTap={{ scale: 0.98 }}
            >
              Offer to the Fire
            </motion.button>

            {submitted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-vedic-parchment/20 font-sacred text-sm"
              >
                Svaha. Received.
              </motion.p>
            )}
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-16 text-center">
          <p className="text-vedic-parchment/8 text-[11px] font-sans tracking-wide">
            You are a node in a 5,000-year transmission chain.
          </p>
        </div>
      </div>
    </div>
  );
}
