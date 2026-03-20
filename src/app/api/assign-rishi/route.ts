import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { validateOrigin, validateTextInput } from "@/lib/validate";

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  yajnavalkya: ["brahman", "atman", "consciousness", "reality", "self", "truth", "existence", "neti", "upanishad", "awareness", "being", "absolute", "non-dual", "advaita", "who am i"],
  gargi: ["logic", "analysis", "structure", "cosmology", "space", "time", "woven", "framework", "systematic", "evidence", "proof", "academic", "philosophy", "ontology", "epistemology"],
  narada: ["story", "music", "love", "devotion", "bhakti", "meaning", "purpose", "lost", "confused", "seeking", "faith", "heart", "feel", "emotion", "song"],
  patanjali: ["yoga", "meditation", "breath", "pranayama", "practice", "discipline", "asana", "samadhi", "dhyana", "concentration", "mind control", "stillness", "calm"],
  vishwamitra: ["science", "mantra", "gayatri", "sound", "frequency", "vibration", "physics", "quantum", "technology", "modern", "research", "brain", "neuroscience", "experiment"],
  pippalada: ["prana", "subtle", "kosha", "sheath", "layer", "deep", "esoteric", "breath of life", "mandukya", "dream", "sleep", "turiya", "death", "afterlife"],
  lopamudra: ["relationship", "grief", "body", "pain", "feel", "emotion", "anger", "desire", "love", "marriage", "family", "loss", "trauma", "heal", "personal", "struggle"],
};

function assignRishi(question: string, currentHour: number): string {
  const q = question.toLowerCase();

  // Time-based signals
  if (currentHour < 6) return "patanjali"; // Brahma Muhurta

  // Keyword matching with scoring
  const scores: Record<string, number> = {};
  for (const [rishi, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    scores[rishi] = keywords.filter(k => q.includes(k)).length;
  }

  // Text length bias — long thoughtful questions -> Pippalada
  if (question.length > 300) scores.pippalada = (scores.pippalada || 0) + 2;

  // Person-mention detection -> Lopamudra
  if (/\b(i feel|my (wife|husband|mother|father|child|partner|friend)|hurting|crying|grief|lost someone)\b/i.test(question)) {
    scores.lopamudra = (scores.lopamudra || 0) + 3;
  }

  // Academic language -> Gargi
  if (/\b(according to|research|studies|hypothesis|framework|epistem|ontolog|phenomen)\b/i.test(question)) {
    scores.gargi = (scores.gargi || 0) + 2;
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (best && best[1] > 0) return best[0];

  return "narada"; // Default: the welcoming storyteller
}

export async function POST(req: NextRequest) {
  try {
    // CSRF check
    if (!validateOrigin(req.headers)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Auth check
    const { error: authError } = await requireAuth();
    if (authError) return authError;

    const body = await req.json();
    const question = typeof body.question === "string" ? body.question.slice(0, 4000) : "";
    const currentHour = typeof body.currentHour === "number"
      ? Math.max(0, Math.min(23, Math.floor(body.currentHour)))
      : new Date().getHours();

    const rishi = assignRishi(question, currentHour);
    return NextResponse.json({ rishi });
  } catch (error) {
    console.error("Assign rishi error:", error);
    return NextResponse.json({ error: "Assignment failed" }, { status: 500 });
  }
}
