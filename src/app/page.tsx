"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FirstExperience from "@/onboarding/FirstExperience";

export default function Home() {
  const { data: session, status } = useSession();
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    // Not logged in → show login page
    if (!session) {
      router.replace("/login");
      return;
    }

    // Logged in — check onboarding
    const onboarded = localStorage.getItem("aham_onboarded");
    if (onboarded === "true") {
      router.replace("/mandala");
    } else {
      setHasOnboarded(false);
    }
  }, [session, status, router]);

  // Loading state — pure black
  if (status === "loading" || hasOnboarded === null) {
    return <div className="fixed inset-0 bg-black" />;
  }

  // First experience — unrepeatable
  return <FirstExperience />;
}
