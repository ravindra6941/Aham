"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import FlameAnimation from "@/components/FlameAnimation";

type Phase =
  | "darkness"
  | "bell"
  | "flame"
  | "rishiSpeaks"
  | "question"
  | "listening"
  | "transition";

const RISHI_WORDS = [
  "You have arrived.",
  "Not by accident.",
  "",
  "Something within you recognized a signal",
  "that the noise of the world could not drown out.",
  "",
  "This is not an application.",
  "This is a threshold.",
  "",
  "Beyond this point, knowledge is not given.",
  "It is earned. It is lived.",
  "It is burned into you.",
  "",
  "Before we proceed — one question.",
];

export default function FirstExperience() {
  const [phase, setPhase] = useState<Phase>("darkness");
  const [rishiLineIndex, setRishiLineIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (phase === "darkness") {
      const timer = setTimeout(() => setPhase("bell"), 2500);
      return () => clearTimeout(timer);
    }
    if (phase === "bell") {
      const timer = setTimeout(() => setPhase("flame"), 2000);
      return () => clearTimeout(timer);
    }
    if (phase === "flame") {
      const timer = setTimeout(() => setPhase("rishiSpeaks"), 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "rishiSpeaks") return;
    if (rishiLineIndex >= RISHI_WORDS.length) {
      setPhase("question");
      return;
    }
    const delay = RISHI_WORDS[rishiLineIndex] === "" ? 1200 : 3000;
    const timer = setTimeout(() => {
      setRishiLineIndex((i) => i + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [phase, rishiLineIndex]);

  const handleSubmit = useCallback(async () => {
    if (!userAnswer.trim()) return;
    setPhase("transition");

    if (typeof window !== "undefined") {
      localStorage.setItem("aham_first_answer", userAnswer);
      localStorage.setItem("aham_onboarded", "true");

      try {
        const res = await fetch("/api/assign-rishi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: userAnswer,
            currentHour: new Date().getHours(),
          }),
        });
        if (res.ok) {
          const { rishi } = await res.json();
          const user = { assignedRishi: rishi, onboarded: true, firstAnswer: userAnswer };
          localStorage.setItem("aham_user", JSON.stringify(user));
        }
      } catch {}
    }

    setTimeout(() => {
      router.push("/mandala");
    }, 3000);
  }, [userAnswer, router]);

  return (
    <div className="fixed inset-0 bg-vedic-void flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Darkness */}
        {phase === "darkness" && (
          <motion.div
            key="darkness"
            className="absolute inset-0 bg-vedic-void"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        )}

        {/* Bell */}
        {phase === "bell" && (
          <motion.div
            key="bell"
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-vedic-gold/10"
                initial={{ width: 4, height: 4, opacity: 0.6 }}
                animate={{ width: 250 + i * 120, height: 250 + i * 120, opacity: 0 }}
                transition={{ duration: 2.5, delay: i * 0.3, ease: "easeOut" }}
              />
            ))}
            <motion.div
              className="w-2 h-2 rounded-full bg-vedic-gold/60"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.2, repeat: 1 }}
            />
          </motion.div>
        )}

        {/* Flame */}
        {phase === "flame" && (
          <motion.div
            key="flame"
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
          >
            <FlameAnimation size="xl" />
          </motion.div>
        )}

        {/* Rishi speaks */}
        {phase === "rishiSpeaks" && (
          <motion.div
            key="rishiSpeaks"
            className="flex flex-col items-center max-w-lg mx-auto px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mb-16">
              <FlameAnimation size="sm" />
            </div>
            <div className="space-y-2 text-center min-h-[160px] flex flex-col justify-center">
              <AnimatePresence mode="popLayout">
                {RISHI_WORDS.slice(0, rishiLineIndex).map((line, i) =>
                  line === "" ? (
                    <div key={i} className="h-6" />
                  ) : (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="font-sacred text-lg sm:text-xl text-vedic-parchment/60 leading-relaxed"
                    >
                      {line}
                    </motion.p>
                  )
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Question */}
        {phase === "question" && (
          <motion.div
            key="question"
            className="flex flex-col items-center max-w-lg mx-auto px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <div className="mb-12">
              <FlameAnimation size="sm" />
            </div>

            <motion.h2
              className="font-sacred text-heading text-vedic-parchment/70 text-center mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 2 }}
            >
              What are you actually looking for?
            </motion.h2>

            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1.2 }}
            >
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Speak truthfully..."
                className="w-full bg-transparent border-b border-white/[0.06] focus:border-white/[0.15] text-vedic-parchment/60 font-sacred text-lg p-4 resize-none outline-none placeholder:text-vedic-parchment/10 min-h-[100px] transition-colors duration-700"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim()}
                  className="px-8 py-3 rounded-full border border-white/[0.06] text-vedic-parchment/30 font-sans text-[12px] tracking-wider uppercase hover:bg-white/[0.02] hover:text-vedic-parchment/50 disabled:opacity-10 disabled:cursor-not-allowed transition-all duration-700"
                >
                  Enter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Transition */}
        {phase === "transition" && (
          <motion.div
            key="transition"
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FlameAnimation size="lg" />
            <motion.p
              className="mt-10 font-sacred text-xl text-vedic-parchment/30"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3 }}
            >
              The fire remembers.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
