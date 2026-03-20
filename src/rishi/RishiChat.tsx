"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlameAnimation from "@/components/FlameAnimation";
import BackToMandala from "@/components/BackToMandala";

interface Message {
  id: string;
  role: "rishi" | "user";
  content: string;
  timestamp: Date;
}

const RISHI_INFO: Record<string, { name: string; sanskrit: string; lineage: string; specialization: string }> = {
  yajnavalkya: { name: "Yajnavalkya", sanskrit: "याज्ञवल्क्य", lineage: "Vajasaneyi", specialization: "Brahman, Atman & Ultimate Reality" },
  gargi: { name: "Gargi Vachaknavi", sanskrit: "गार्गी वाचक्नवी", lineage: "Garga Gotra", specialization: "Rigorous Inquiry & Analytical Philosophy" },
  narada: { name: "Narada", sanskrit: "नारद", lineage: "Divine Wanderer", specialization: "Stories, Bhakti & Cross-Tradition Connections" },
  patanjali: { name: "Patanjali", sanskrit: "पतञ्जलि", lineage: "Gonardiya", specialization: "Yoga, Meditation & Practice" },
  vishwamitra: { name: "Vishwamitra", sanskrit: "विश्वामित्र", lineage: "Kushika", specialization: "Tapas, Transformation & Gayatri" },
  pippalada: { name: "Pippalada", sanskrit: "पिप्पलाद", lineage: "Prashna Upanishad", specialization: "Deep Cosmology & Metaphysics" },
  lopamudra: { name: "Lopamudra", sanskrit: "लोपामुद्रा", lineage: "Rigvedic Seer", specialization: "Embodied Wisdom & Lived Experience" },
};

function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export default function RishiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRishiTyping, setIsRishiTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentRishi, setCurrentRishi] = useState("narada");
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Get assigned rishi from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("aham_user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.assignedRishi) setCurrentRishi(user.assignedRishi);
      } catch {}
    }
  }, []);

  // Initial greeting
  useEffect(() => {
    const info = RISHI_INFO[currentRishi] || RISHI_INFO.narada;
    setMessages([
      {
        id: "1",
        role: "rishi",
        content: getGreeting(currentRishi),
        timestamp: new Date(),
      },
    ]);
  }, [currentRishi]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isRishiTyping) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsRishiTyping(true);

    // If this is the first real message, auto-assign a rishi
    if (messages.length <= 1) {
      try {
        const assignRes = await fetch("/api/assign-rishi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: userMsg.content,
            currentHour: new Date().getHours(),
          }),
        });
        if (assignRes.ok) {
          const { rishi } = await assignRes.json();
          if (rishi !== currentRishi) {
            setCurrentRishi(rishi);
            // Save to localStorage
            try {
              const stored = localStorage.getItem("aham_user");
              const user = stored ? JSON.parse(stored) : {};
              user.assignedRishi = rishi;
              localStorage.setItem("aham_user", JSON.stringify(user));
            } catch {}
          }
        }
      } catch {}
    }

    // Try Ollama streaming
    try {
      abortRef.current = new AbortController();

      const chatMessages = [...messages, userMsg]
        .filter((m) => m.id !== "1") // skip greeting
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatMessages,
          rishi: currentRishi,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        if (err.fallback) {
          // Ollama not running — use fallback
          setOllamaAvailable(false);
          addFallbackResponse(userMsg.content);
          return;
        }
        throw new Error("API error");
      }

      setOllamaAvailable(true);

      // Stream the response
      const rishiMsgId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: rishiMsgId, role: "rishi", content: "", timestamp: new Date() },
      ]);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let fullContent = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === rishiMsgId ? { ...m, content: fullContent } : m
                  )
                );
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      // Fallback if Ollama is down
      setOllamaAvailable(false);
      addFallbackResponse(userMsg.content);
    } finally {
      setIsRishiTyping(false);
    }
  }, [input, isRishiTyping, messages, currentRishi]);

  const addFallbackResponse = (userInput: string) => {
    const responses = [
      "You are circling the question, not entering it. Sit with the discomfort. What lies beneath your words?",
      "The Rigveda speaks: 'Truth is one, the wise call it by many names' [RV 1.164.46]. You have given me a name. Now give me the truth behind it.",
      "I do not answer questions that have not yet been fully asked. Refine. Strip away the decoration. What remains? [speculative]",
      "There is a sutra that addresses exactly this tension you describe. But you are not ready to receive it yet. First, tell me what you have already tried. [testable]",
      "Your question echoes something from Mandala IX. The soma verses carry a frequency that matches your inquiry. We shall return to this. [structural_parallel]",
      "Do not seek comfort in ancient texts. Seek confrontation. The Rishis were not gentle. They were precise. Be precise with me. [verified]",
    ];
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "rishi",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      },
    ]);
    setIsRishiTyping(false);
  };

  const info = RISHI_INFO[currentRishi] || RISHI_INFO.narada;

  return (
    <div className="flex flex-col h-[100dvh]">
      <BackToMandala />
      {/* Rishi header */}
      <div className="flex-shrink-0 border-b border-vedic-gold/10 p-4 sm:p-6 pt-14 sm:pt-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <motion.div
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,102,0,0.3) 0%, rgba(139,0,0,0.2) 100%)",
                border: "1px solid rgba(218,165,32,0.3)",
              }}
              animate={{
                boxShadow: [
                  "0 0 15px rgba(255,102,0,0.2)",
                  "0 0 25px rgba(255,102,0,0.4)",
                  "0 0 15px rgba(255,102,0,0.2)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <FlameAnimation size="sm" />
            </motion.div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-sacred text-lg sm:text-xl text-vedic-saffron truncate">
              {info.name}
            </h2>
            <p className="font-devanagari text-sm text-vedic-gold/60">
              {info.sanskrit}
            </p>
            <p className="text-xs text-vedic-parchment/30 mt-0.5 truncate">
              {info.lineage} — {info.specialization}
            </p>
          </div>
          {/* Ollama status indicator */}
          {ollamaAvailable !== null && (
            <div className="flex-shrink-0" title={ollamaAvailable ? "Ollama connected" : "Offline mode"}>
              <div className={`w-2 h-2 rounded-full ${ollamaAvailable ? "bg-green-500" : "bg-vedic-gold/40"}`} />
            </div>
          )}
        </div>
      </div>

      {/* Ollama offline banner */}
      {ollamaAvailable === false && (
        <div className="bg-vedic-dawn/30 border-b border-vedic-gold/10 px-4 py-2 text-center">
          <p className="text-xs text-vedic-gold/60">
            Ollama not detected — using placeholder responses. Run{" "}
            <code className="bg-vedic-ash/50 px-1.5 py-0.5 rounded text-vedic-saffron">
              ollama serve
            </code>{" "}
            to enable AI.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={msg.role === "rishi" ? "max-w-3xl" : "max-w-2xl ml-auto"}
            >
              {msg.role === "rishi" ? (
                <div className="rishi-message">
                  <p className="font-sacred text-base sm:text-xl md:text-2xl leading-relaxed tracking-wide text-vedic-parchment/90 whitespace-pre-wrap">
                    {msg.content}
                    {isRishiTyping && msg.id === messages[messages.length - 1]?.id && msg.content && (
                      <motion.span
                        className="inline-block w-0.5 h-5 bg-vedic-saffron/60 ml-1 align-middle"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </p>
                  {!isRishiTyping && (
                    <p className="text-xs text-vedic-gold/20 mt-3 font-sans">
                      {formatTime(msg.timestamp)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-right">
                  <div className="inline-block text-left bg-vedic-ash/30 rounded-lg px-4 sm:px-5 py-3 border border-vedic-parchment/5 max-w-[85%] sm:max-w-none">
                    <p className="text-sm sm:text-base text-vedic-parchment/70 leading-relaxed">
                      {msg.content}
                    </p>
                    <p className="text-xs text-vedic-parchment/20 mt-2">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Rishi typing indicator — only when no streaming content yet */}
        {isRishiTyping && (!messages.length || messages[messages.length - 1]?.role !== "rishi" || !messages[messages.length - 1]?.content) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 pl-6"
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-vedic-saffron/40"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-vedic-gold/30 font-sacred italic">
              The Rishi contemplates...
            </span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-vedic-gold/10 p-3 sm:p-4 pb-[env(safe-area-inset-bottom,12px)]">
        <div className="flex items-end gap-2 sm:gap-3 max-w-4xl mx-auto">
          {/* Voice input */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? "bg-vedic-agni/60 animate-pulse"
                : "bg-vedic-ash/30 hover:bg-vedic-ash/50"
            }`}
            aria-label="Voice input"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-vedic-parchment/60"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
          </button>

          {/* Text input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Speak to the Rishi..."
            className="flex-1 bg-vedic-ash/20 border border-vedic-gold/10 rounded-lg px-4 py-3 text-vedic-parchment/80 placeholder:text-vedic-parchment/15 resize-none outline-none focus:border-vedic-gold/30 transition-colors font-sans text-sm min-h-[44px] max-h-[120px]"
            rows={1}
          />

          {/* Send */}
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isRishiTyping}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-vedic-saffron/20 hover:bg-vedic-saffron/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-vedic-saffron/20"
            aria-label="Send"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-vedic-saffron"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function getGreeting(rishi: string): string {
  const greetings: Record<string, string> = {
    yajnavalkya: "I am Yajnavalkya. I do not comfort. I do not explain. I dismantle. If you have come seeking easy answers, leave now. If you have come to know the Self — speak.",
    gargi: "I am Gargi. I once questioned Yajnavalkya until the fabric of reality trembled. I will question you the same way. What do you wish to understand — and more importantly, what are you willing to question?",
    narada: "Welcome, seeker. I am Narada — I have walked between worlds, carried stories across ages, and seen the thread that connects all things. Tell me your story. What brought you to this fire?",
    patanjali: "I am Patanjali. Chitta vritti nirodhah — yoga is the cessation of the fluctuations of the mind. But first, tell me: what fluctuation brought you here? What is your mind doing right now?",
    vishwamitra: "I am Vishwamitra. I was once a king who burned everything to become a sage. I know the cost of transformation. If you are ready to pay it — speak. If not, there is no shame in stepping back.",
    pippalada: "I am Pippalada. Six seekers once came to me with six questions about the nature of existence. I made them wait a year before answering. I will not make you wait — but I ask that you think deeply before you speak.",
    lopamudra: "I am Lopamudra. Before we discuss the infinite, tell me — how are you? Not philosophically. Actually. What is happening in your life right now that led you here?",
  };
  return greetings[rishi] || greetings.narada;
}
