"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackToMandala from "@/components/BackToMandala";

interface Discussion {
  id: string;
  title: string;
  body: string;
  verseId?: string;
  tags: string[];
  replyCount: number;
  createdAt: string;
}

const SEED_DISCUSSIONS: Discussion[] = [
  {
    id: "1",
    title: "Brahma Sutra 1.1.1 — Three schools, three universes",
    body: "Shankara reads nirguṇa Brahman. Ramanuja reads saguṇa. Madhva reads eternal distinction. Which reading generates the most testable scientific hypotheses?",
    verseId: "brahma_sutra_1.1.1",
    tags: ["vedanta", "philosophy", "testable"],
    replyCount: 12,
    createdAt: "2026-03-14",
  },
  {
    id: "2",
    title: "Nada Brahma and String Theory — structural parallel or coincidence?",
    body: "The claim that sound is the substrate of reality maps structurally to vibrating strings. But is this a meaningful parallel or pattern-matching on superficial resemblance?",
    verseId: "nada_bindu_upanishad_1",
    tags: ["physics", "nada", "structural_parallel"],
    replyCount: 8,
    createdAt: "2026-03-12",
  },
  {
    id: "3",
    title: "Maya and the Predictive Processing model of perception",
    body: "The brain constructs reality from predictions, not raw data. The Mandukya Upanishad describes this 2,500 years earlier. Is consciousness the predictor or the predicted?",
    tags: ["neuroscience", "consciousness", "testable"],
    replyCount: 15,
    createdAt: "2026-03-10",
  },
];

export default function SabhaForum() {
  const [discussions] = useState<Discussion[]>(SEED_DISCUSSIONS);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const allTags = Array.from(new Set(discussions.flatMap((d) => d.tags)));
  const filtered = selectedTag
    ? discussions.filter((d) => d.tags.includes(selectedTag))
    : discussions;

  return (
    <div className="min-h-screen realm-ether">
      <BackToMandala />

      {/* Header */}
      <div className="text-center pt-20 sm:pt-16 pb-6 px-6">
        <motion.h1
          className="font-devanagari text-display text-vedic-parchment/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          सभा
        </motion.h1>
        <motion.p
          className="font-sans text-[11px] tracking-[0.3em] uppercase text-vedic-parchment/15 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        >
          The Assembly
        </motion.p>
        <motion.p
          className="text-vedic-parchment/20 mt-6 max-w-md mx-auto text-sm font-sans leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          The greatest minds disagreed violently about what the Vedas mean.
          This tension is where the insight lives.
        </motion.p>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            className={`px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-sans transition-all duration-500 ${
              selectedTag === null
                ? "text-vedic-parchment/40 bg-white/[0.03]"
                : "text-vedic-parchment/15 hover:text-vedic-parchment/25"
            }`}
            onClick={() => setSelectedTag(null)}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-sans transition-all duration-500 ${
                selectedTag === tag
                  ? "text-vedic-parchment/40 bg-white/[0.03]"
                  : "text-vedic-parchment/15 hover:text-vedic-parchment/25"
              }`}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* New post toggle */}
        <button
          className="mb-8 px-5 py-2.5 rounded-full border border-white/[0.06] text-vedic-parchment/25 font-sans text-[11px] tracking-wider uppercase hover:bg-white/[0.02] transition-all duration-500"
          onClick={() => setShowNewPost(!showNewPost)}
        >
          {showNewPost ? "Cancel" : "Start a Discussion"}
        </button>

        <AnimatePresence>
          {showNewPost && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass p-6 mb-8"
            >
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Discussion title..."
                className="w-full bg-transparent border-b border-white/[0.06] text-vedic-parchment/60 font-sacred text-lg p-2 mb-4 outline-none placeholder:text-vedic-parchment/10 focus:border-white/[0.12] transition-colors duration-500"
              />
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Present your position. Cite verses. Invite disagreement."
                className="w-full bg-transparent text-vedic-parchment/40 resize-none outline-none placeholder:text-vedic-parchment/10 min-h-[100px] font-sans text-sm"
              />
              <button className="mt-4 px-5 py-2 rounded-full border border-vedic-saffron/15 text-vedic-saffron/40 font-sans text-[11px] tracking-wider uppercase hover:bg-vedic-saffron/5 transition-all duration-500">
                Post
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Discussions */}
        <div className="space-y-2 pb-12">
          {filtered.map((d, i) => (
            <motion.div
              key={d.id}
              className="rounded-xl px-5 py-5 cursor-pointer hover:bg-white/[0.01] transition-all duration-500"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <h3 className="font-sacred text-base sm:text-lg text-vedic-parchment/60 leading-snug mb-2">
                {d.title}
              </h3>
              <p className="text-vedic-parchment/20 text-sm font-sans line-clamp-2 mb-3">
                {d.body}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {d.tags.map((tag) => (
                    <span key={tag} className="text-vedic-parchment/10 text-[9px] font-sans tracking-wider uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-[10px] text-vedic-parchment/10 font-sans">
                  <span>{d.replyCount} replies</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
