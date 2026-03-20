"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BackToMandala from "@/components/BackToMandala";

type ContributionKind =
  | "hypothesis"
  | "finding"
  | "discovery"
  | "translation"
  | "commentary";

const KINDS: { value: ContributionKind; label: string; description: string }[] = [
  {
    value: "hypothesis",
    label: "Scientific Hypothesis",
    description: "A falsifiable hypothesis derived from Vedic knowledge",
  },
  {
    value: "finding",
    label: "Research Finding",
    description: "A modern research result that connects to a specific verse",
  },
  {
    value: "discovery",
    label: "Discovery",
    description: "A convergence signal — when ancient and modern align",
  },
  {
    value: "translation",
    label: "Translation",
    description: "A new or improved translation of a verse or passage",
  },
  {
    value: "commentary",
    label: "Commentary",
    description: "Philosophical commentary on a verse or concept",
  },
];

export default function YajnaContribute() {
  const [selectedKind, setSelectedKind] = useState<ContributionKind>("hypothesis");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) return;
    setSubmitted(true);
    // Would POST to /api/yajna/contribute
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:p-8 pt-16 sm:pt-8 max-w-4xl mx-auto">
      <BackToMandala />
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-sacred text-4xl text-vedic-gold mb-2">Yajna</h1>
        <p className="font-devanagari text-2xl text-vedic-parchment/60">यज्ञ</p>
        <p className="text-vedic-parchment/40 mt-4 max-w-lg mx-auto">
          The Vedic iron law: knowledge received must be transmitted. Every other
          section is about receiving. Yajna is where you give back — and in
          giving, transform the corpus itself.
        </p>
      </div>

      {/* Corpus Growth Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { label: "Total Contributions", value: "—" },
          { label: "Hypotheses Generated", value: "—" },
          { label: "Convergence Signals", value: "—" },
        ].map((stat) => (
          <div key={stat.label} className="sacred-card p-4 text-center">
            <p className="font-sacred text-2xl text-vedic-saffron">
              {stat.value}
            </p>
            <p className="text-vedic-parchment/40 text-xs mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Contribution form */}
      <div className="sacred-card p-8">
        <h3 className="font-sacred text-xl text-vedic-gold mb-6">
          Contribute to the Living Corpus
        </h3>

        {/* Kind selection */}
        <div className="mb-6">
          <p className="text-vedic-parchment/40 text-xs uppercase tracking-wider mb-3">
            Contribution Type
          </p>
          <div className="flex flex-wrap gap-2">
            {KINDS.map((kind) => (
              <button
                key={kind.value}
                className={`px-4 py-2 rounded border text-sm transition-colors ${
                  selectedKind === kind.value
                    ? "border-vedic-saffron/50 text-vedic-saffron bg-vedic-saffron/10"
                    : "border-vedic-ash/30 text-vedic-parchment/50 hover:border-vedic-gold/30"
                }`}
                onClick={() => setSelectedKind(kind.value)}
              >
                {kind.label}
              </button>
            ))}
          </div>
          <p className="text-vedic-parchment/30 text-xs mt-2">
            {KINDS.find((k) => k.value === selectedKind)?.description}
          </p>
        </div>

        {/* Title */}
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title — be precise, the Rishis were precise"
            className="w-full bg-transparent border-b border-vedic-gold/20 text-vedic-parchment font-sacred text-lg p-2 outline-none placeholder:text-vedic-parchment/20"
          />
        </div>

        {/* Body */}
        <div className="mb-6">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={
              selectedKind === "hypothesis"
                ? "State the Vedic source, the modern parallel, the falsifiable hypothesis, and the suggested experiment..."
                : "Provide your contribution with verse citations where applicable..."
            }
            className="w-full bg-transparent text-vedic-parchment/70 resize-none outline-none placeholder:text-vedic-parchment/20 min-h-[200px] border border-vedic-ash/20 rounded p-4"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <motion.button
            className="px-8 py-3 bg-vedic-saffron/20 text-vedic-saffron border border-vedic-saffron/30 rounded font-sacred text-lg hover:bg-vedic-saffron/30 transition-colors disabled:opacity-30"
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
              className="text-vedic-gold/60 font-sacred"
            >
              Svaha. Your offering has been received.
            </motion.p>
          )}
        </div>
      </div>

      {/* Transmission chain note */}
      <div className="mt-12 text-center">
        <p className="text-vedic-parchment/20 text-sm font-sacred italic">
          You are not a user. You are a node in a 5,000-year transmission chain.
        </p>
      </div>
    </div>
  );
}
