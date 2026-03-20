import { NextResponse } from "next/server";

export async function GET() {
  const hasGroqKey = !!process.env.GROQ_API_KEY;
  const hasGoogleAuth = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    llm: {
      provider: "groq",
      configured: hasGroqKey,
      model: process.env.LLM_MODEL || "llama-3.1-8b-instant",
      recommendation: !hasGroqKey
        ? "Add GROQ_API_KEY to .env.local — get free key at console.groq.com"
        : "Ready",
    },
    auth: {
      configured: hasGoogleAuth,
      recommendation: !hasGoogleAuth
        ? "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local"
        : "Ready",
    },
  });
}
