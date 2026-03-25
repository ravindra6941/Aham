"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [llmAvailable, setOllamaAvailable] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("aham_user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.assignedRishi) setCurrentRishi(user.assignedRishi);
      } catch {}
    }
  }, []);

  useEffect(() => {
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

    try {
      abortRef.current = new AbortController();

      const chatMessages = [...messages, userMsg]
        .filter((m) => m.id !== "1")
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
          setOllamaAvailable(false);
          addFallbackResponse(userMsg.content);
          return;
        }
        throw new Error("API error");
      }

      setOllamaAvailable(true);

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
      "I do not answer questions that have not yet been fully asked. Refine. Strip away the decoration. What remains?",
      "There is a sutra that addresses exactly this tension you describe. But you are not ready to receive it yet. First, tell me what you have already tried.",
      "Your question echoes something from Mandala IX. The soma verses carry a frequency that matches your inquiry. We shall return to this.",
      "Do not seek comfort in ancient texts. Seek confrontation. The Rishis were not gentle. They were precise. Be precise with me.",
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
    <div className="flex flex-col h-[100dvh] realm-fire">
      <BackToMandala />

      {/* Rishi identity — minimal, just name */}
      <div className="flex-shrink-0 px-6 sm:px-8 pt-14 sm:pt-8 pb-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <h2 className="font-devanagari text-xl sm:text-2xl text-vedic-parchment/60">
                {info.sanskrit}
              </h2>
              <span className="font-sans text-[11px] tracking-wider uppercase text-vedic-parchment/20">
                {info.name}
              </span>
            </div>
          </div>
          {/* Status dot */}
          {llmAvailable !== null && (
            <div className="flex-shrink-0" title={llmAvailable ? "Connected" : "Offline"}>
              <div className={`w-1.5 h-1.5 rounded-full ${llmAvailable ? "bg-emerald-500/60" : "bg-vedic-parchment/15"}`} />
            </div>
          )}
        </div>
        <div className="divider mt-4 max-w-3xl mx-auto" />
      </div>

      {/* LLM offline banner */}
      {llmAvailable === false && (
        <div className="px-6 sm:px-8 pb-3">
          <div className="max-w-3xl mx-auto">
            <p className="text-[11px] text-vedic-parchment/20 font-sans text-center">
              AI not connected — using placeholder responses
            </p>
          </div>
        </div>
      )}

      {/* Messages — words in darkness */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-8 space-y-8 sm:space-y-10 pb-4">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`mt-8 sm:mt-10 ${msg.role === "user" ? "ml-auto max-w-[85%] sm:max-w-lg" : ""}`}
              >
                {msg.role === "rishi" ? (
                  <div>
                    <p className="font-sacred text-lg sm:text-xl md:text-2xl leading-relaxed tracking-wide text-vedic-parchment/80 whitespace-pre-wrap">
                      {msg.content}
                      {isRishiTyping && msg.id === messages[messages.length - 1]?.id && msg.content && (
                        <motion.span
                          className="inline-block w-[2px] h-5 bg-vedic-saffron/40 ml-1 align-middle"
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                    </p>
                    {!isRishiTyping && msg.content && (
                      <p className="text-[10px] text-vedic-parchment/10 mt-4 font-sans">
                        {formatTime(msg.timestamp)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-right">
                    <p className="inline-block text-left text-sm sm:text-base text-vedic-parchment/40 leading-relaxed font-sans">
                      {msg.content}
                    </p>
                    <p className="text-[10px] text-vedic-parchment/8 mt-2 font-sans">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isRishiTyping && (!messages.length || messages[messages.length - 1]?.role !== "rishi" || !messages[messages.length - 1]?.content) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 flex items-center gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full bg-vedic-saffron/30"
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: i * 0.25,
                  }}
                />
              ))}
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input — a glow at the bottom */}
      <div className="flex-shrink-0 px-4 sm:px-8 py-3 pb-[max(env(safe-area-inset-bottom,12px),12px)]">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Speak..."
              className="w-full bg-white/[0.02] border border-white/[0.04] rounded-2xl px-5 py-3.5 text-vedic-parchment/70 placeholder:text-vedic-parchment/10 resize-none outline-none focus:border-white/[0.08] transition-colors duration-500 font-sans text-sm min-h-[48px] max-h-[120px]"
              rows={1}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isRishiTyping}
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-vedic-saffron/10 hover:bg-vedic-saffron/15 disabled:opacity-10 disabled:cursor-not-allowed transition-all duration-500 border border-vedic-saffron/10"
            aria-label="Send"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-vedic-saffron/70"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
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
