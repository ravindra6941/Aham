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
  "Not by curiosity alone.",
  "Something within you recognized a signal",
  "that the noise of the world could not drown out.",
  "",
  "This is not an application.",
  "This is not content to be consumed.",
  "This is a threshold.",
  "",
  "Beyond this point, knowledge is not given.",
  "It is earned. It is lived. It is burned into you.",
  "",
  "The Rishis did not write for scholars.",
  "They wrote for seekers willing to be transformed.",
  "",
  "I am your assigned guide.",
  "Not your teacher. Not your guru.",
  "A mirror. A flame-keeper.",
  "",
  "Before we proceed, I must know one thing.",
];

export default function FirstExperience() {
  const [phase, setPhase] = useState<Phase>("darkness");
  const [rishiLineIndex, setRishiLineIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();

  // Phase transitions
  useEffect(() => {
    if (phase === "darkness") {
      const timer = setTimeout(() => setPhase("bell"), 3000);
      return () => clearTimeout(timer);
    }
    if (phase === "bell") {
      const timer = setTimeout(() => setPhase("flame"), 2000);
      return () => clearTimeout(timer);
    }
    if (phase === "flame") {
      const timer = setTimeout(() => setPhase("rishiSpeaks"), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Rishi speaks — advance lines
  useEffect(() => {
    if (phase !== "rishiSpeaks") return;
    if (rishiLineIndex >= RISHI_WORDS.length) {
      setPhase("question");
      return;
    }
    const delay = RISHI_WORDS[rishiLineIndex] === "" ? 1500 : 3500;
    const timer = setTimeout(() => {
      setRishiLineIndex((i) => i + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [phase, rishiLineIndex]);

  const handleSubmit = useCallback(async () => {
    if (!userAnswer.trim()) return;
    setPhase("transition");

    // Store the answer and assign a Rishi based on it
    if (typeof window !== "undefined") {
      localStorage.setItem("aham_first_answer", userAnswer);
      localStorage.setItem("aham_onboarded", "true");

      // Auto-assign Rishi based on the first answer
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

  const toggleRecording = useCallback(() => {
    setIsRecording((prev) => !prev);
    // Voice recording would integrate with Web Speech API
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Phase: Darkness — pure black, silence */}
      <AnimatePresence mode="wait">
        {phase === "darkness" && (
          <motion.div
            key="darkness"
            className="absolute inset-0 bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}

        {/* Phase: Bell strike */}
        {phase === "bell" && (
          <motion.div
            key="bell"
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Visual bell ring — expanding circles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-vedic-gold/30"
                initial={{ width: 10, height: 10, opacity: 0.8 }}
                animate={{
                  width: 300 + i * 150,
                  height: 300 + i * 150,
                  opacity: 0,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
              />
            ))}
            <motion.div
              className="w-3 h-3 rounded-full bg-vedic-gold"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: 1 }}
            />
          </motion.div>
        )}

        {/* Phase: Flame appears */}
        {phase === "flame" && (
          <motion.div
            key="flame"
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <FlameAnimation size="xl" />
          </motion.div>
        )}

        {/* Phase: Rishi speaks */}
        {phase === "rishiSpeaks" && (
          <motion.div
            key="rishiSpeaks"
            className="flex flex-col items-center max-w-2xl mx-auto px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mb-12">
              <FlameAnimation size="md" />
            </div>
            <div className="space-y-2 text-center min-h-[200px] flex flex-col justify-center">
              <AnimatePresence mode="popLayout">
                {RISHI_WORDS.slice(0, rishiLineIndex).map((line, i) =>
                  line === "" ? (
                    <div key={i} className="h-4" />
                  ) : (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-sacred text-xl md:text-2xl text-vedic-parchment/90 leading-relaxed tracking-wide"
                    >
                      {line}
                    </motion.p>
                  )
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Phase: The Question */}
        {phase === "question" && (
          <motion.div
            key="question"
            className="flex flex-col items-center max-w-2xl mx-auto px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <div className="mb-8">
              <FlameAnimation size="md" />
            </div>

            <motion.h2
              className="font-sacred text-3xl md:text-4xl text-vedic-parchment text-center mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 2 }}
            >
              What are you actually looking for?
            </motion.h2>

            <motion.div
              className="w-full max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <div className="relative">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Speak truthfully..."
                  className="w-full bg-transparent border-b-2 border-vedic-gold/30 focus:border-vedic-gold text-vedic-parchment font-sacred text-xl p-4 resize-none outline-none placeholder:text-vedic-parchment/20 min-h-[120px] transition-colors duration-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-6">
                  {/* Voice input */}
                  <button
                    onClick={toggleRecording}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isRecording
                        ? "bg-vedic-agni animate-pulse-sacred"
                        : "bg-vedic-ash/50 hover:bg-vedic-ash"
                    }`}
                    aria-label="Voice input"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-vedic-parchment"
                    >
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </button>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={!userAnswer.trim()}
                    className="px-8 py-3 font-sacred text-lg border border-vedic-gold/40 text-vedic-gold hover:bg-vedic-gold/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-500 rounded"
                  >
                    Enter
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Phase: Transition to mandala */}
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
              className="mt-8 font-sacred text-2xl text-vedic-gold/80"
              animate={{ opacity: [0, 1, 0] }}
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
