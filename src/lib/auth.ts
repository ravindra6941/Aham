import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * Shared auth helper for API routes.
 * Returns the session if authenticated, or a 401 response.
 */
export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}
