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

// Seed discussions for the Sabha
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
    <div className="min-h-screen px-4 py-6 sm:p-8 pt-16 sm:pt-8 max-w-4xl mx-auto">
      <BackToMandala />
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-sacred text-4xl text-vedic-gold mb-2">Sabha</h1>
        <p className="font-devanagari text-2xl text-vedic-parchment/60">सभा</p>
        <p className="text-vedic-parchment/40 mt-4 max-w-lg mx-auto">
          Not a forum. An ancient assembly. Where researchers, meditators,
          scientists, and seekers debate across disciplines.
        </p>
      </div>

      {/* Disagreement Engine banner */}
      <div className="sacred-card p-6 mb-8 border-vedic-dawn/30">
        <p className="font-sacred text-lg text-vedic-parchment/70 mb-2">
          The Disagreement Engine
        </p>
        <p className="text-vedic-parchment/40 text-sm">
          The most intellectually alive thing about Vedic knowledge is that the
          greatest minds disagreed violently about what it means. This tension is
          where the insight lives.
        </p>
      </div>

      {/* Tags filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          className={`px-3 py-1 rounded-full text-xs border transition-colors ${
            selectedTag === null
              ? "border-vedic-gold/50 text-vedic-gold"
              : "border-vedic-ash/30 text-vedic-parchment/40 hover:border-vedic-gold/30"
          }`}
          onClick={() => setSelectedTag(null)}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              selectedTag === tag
                ? "border-vedic-gold/50 text-vedic-gold"
                : "border-vedic-ash/30 text-vedic-parchment/40 hover:border-vedic-gold/30"
            }`}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* New post */}
      <button
        className="mb-8 px-6 py-3 border border-vedic-gold/30 text-vedic-gold font-sacred hover:bg-vedic-gold/10 transition-colors rounded"
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
            className="sacred-card p-6 mb-8"
          >
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Discussion title..."
              className="w-full bg-transparent border-b border-vedic-gold/20 text-vedic-parchment font-sacred text-lg p-2 mb-4 outline-none placeholder:text-vedic-parchment/20"
            />
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Present your position. Cite verses. Invite disagreement."
              className="w-full bg-transparent text-vedic-parchment/70 resize-none outline-none placeholder:text-vedic-parchment/20 min-h-[100px]"
            />
            <button className="mt-4 px-6 py-2 bg-vedic-saffron/20 text-vedic-saffron border border-vedic-saffron/30 rounded font-sacred hover:bg-vedic-saffron/30 transition-colors">
              Post to Sabha
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discussions list */}
      <div className="space-y-4">
        {filtered.map((d) => (
          <motion.div
            key={d.id}
            className="sacred-card p-6 cursor-pointer hover:border-vedic-gold/30 transition-colors"
            whileHover={{ scale: 1.005 }}
          >
            <h3 className="font-sacred text-lg text-vedic-parchment/90 mb-2">
              {d.title}
            </h3>
            <p className="text-vedic-parchment/50 text-sm mb-4 line-clamp-2">
              {d.body}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {d.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs border border-vedic-ash/30 text-vedic-parchment/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs text-vedic-parchment/30">
                <span>{d.replyCount} replies</span>
                <span>{d.createdAt}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
