"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareWisdomProps {
  wisdom: string;
  rishiName: string;
  rishiSanskrit: string;
}

export default function ShareWisdom({ wisdom, rishiName, rishiSanskrit }: ShareWisdomProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `"${wisdom.slice(0, 280)}${wisdom.length > 280 ? "..." : ""}"\n\n— ${rishiName} (${rishiSanskrit})\nvia AHAM · aham-pi.vercel.app`;

  const shareUrl = "https://aham-pi.vercel.app";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = shareText;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Wisdom from ${rishiName}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {}
    }
    setShowMenu(false);
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`"${wisdom.slice(0, 220)}${wisdom.length > 220 ? "..." : ""}"\n\n— ${rishiName}\nvia @aham_vedic`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener");
    setShowMenu(false);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
    setShowMenu(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="text-vedic-parchment/10 hover:text-vedic-parchment/30 transition-colors duration-500 p-1"
        aria-label="Share this wisdom"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
        </svg>
      </button>

      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 bottom-full mb-2 w-48 rounded-xl glass overflow-hidden z-50"
            >
              {/* Native share (mobile) */}
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full px-4 py-2.5 text-left text-[12px] text-vedic-parchment/40 hover:text-vedic-parchment/70 hover:bg-white/[0.02] transition-all duration-300 font-sans flex items-center gap-3"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                  </svg>
                  Share...
                </button>
              )}

              <button
                onClick={handleTwitterShare}
                className="w-full px-4 py-2.5 text-left text-[12px] text-vedic-parchment/40 hover:text-vedic-parchment/70 hover:bg-white/[0.02] transition-all duration-300 font-sans flex items-center gap-3"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Post on X
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="w-full px-4 py-2.5 text-left text-[12px] text-vedic-parchment/40 hover:text-vedic-parchment/70 hover:bg-white/[0.02] transition-all duration-300 font-sans flex items-center gap-3"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </button>

              <button
                onClick={handleCopy}
                className="w-full px-4 py-2.5 text-left text-[12px] text-vedic-parchment/40 hover:text-vedic-parchment/70 hover:bg-white/[0.02] transition-all duration-300 font-sans flex items-center gap-3"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {copied ? (
                    <path d="M20 6L9 17l-5-5" />
                  ) : (
                    <>
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </>
                  )}
                </svg>
                {copied ? "Copied!" : "Copy text"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
