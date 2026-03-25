import { NextResponse } from "next/server";

// Simple in-memory counter — resets on redeploy, but that's fine for MVP.
// Seeded with a base number so it doesn't start at 0.
let seekerCount = 142;
const uniqueVisitors = new Set<string>();

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!uniqueVisitors.has(ip)) {
      uniqueVisitors.add(ip);
      seekerCount++;
    }

    return NextResponse.json({ count: seekerCount });
  } catch {
    return NextResponse.json({ count: seekerCount });
  }
}

export async function GET() {
  return NextResponse.json({ count: seekerCount });
}
