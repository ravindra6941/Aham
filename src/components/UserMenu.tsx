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

  if (!session?.user) {
    if (pathname === "/login") return null;
    return (
      <Link
        href="/login"
        className="fixed top-5 right-5 z-50 px-4 py-1.5 rounded-full text-vedic-parchment/30 text-[11px] uppercase tracking-wider font-sans hover:text-vedic-parchment/60 transition-colors duration-500"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="fixed top-5 right-5 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-500"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-vedic-dawn flex items-center justify-center text-vedic-parchment/60 font-sans text-xs">
            {(session.user.name || "U")[0].toUpperCase()}
          </div>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 mt-2 w-56 rounded-xl glass overflow-hidden z-50"
            >
              <div className="p-4 border-b border-white/[0.04]">
                <p className="font-sans text-sm text-vedic-parchment/80 truncate">
                  {session.user.name}
                </p>
                <p className="text-[11px] text-vedic-parchment/30 truncate mt-0.5">
                  {session.user.email}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full px-4 py-3 text-left text-[13px] text-vedic-parchment/40 hover:text-vedic-parchment/70 hover:bg-white/[0.02] transition-all duration-300 font-sans"
              >
                Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
