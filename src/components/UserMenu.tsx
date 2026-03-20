"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Don't show "Sign in" button on the login page itself
  if (!session?.user) {
    if (pathname === "/login") return null;
    return (
      <Link
        href="/login"
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-full border border-vedic-gold/30 text-vedic-gold/60 text-sm font-sacred hover:border-vedic-gold/60 hover:text-vedic-gold transition-all"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-vedic-gold/30 hover:border-vedic-gold/60 transition-colors"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-vedic-dawn flex items-center justify-center text-vedic-gold font-sacred text-sm">
            {(session.user.name || "U")[0].toUpperCase()}
          </div>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-56 rounded-lg border border-vedic-gold/20 bg-vedic-night/95 backdrop-blur-lg shadow-xl overflow-hidden"
          >
            <div className="p-4 border-b border-vedic-gold/10">
              <p className="font-sacred text-sm text-vedic-parchment truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-vedic-parchment/40 truncate">
                {session.user.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full px-4 py-3 text-left text-sm text-vedic-parchment/60 hover:bg-vedic-ash/30 hover:text-vedic-parchment transition-colors font-sans"
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
