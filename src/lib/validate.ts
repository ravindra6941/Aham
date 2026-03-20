/**
 * Input validation helpers for API routes.
 */

const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES = 50;
const MAX_INPUT_LENGTH = 8000;

export function validateChatInput(body: any): { valid: boolean; error?: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const { messages } = body;

  if (!Array.isArray(messages)) {
    return { valid: false, error: "messages must be an array" };
  }

  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Too many messages (max ${MAX_MESSAGES})` };
  }

  for (const msg of messages) {
    if (!msg.content || typeof msg.content !== "string") {
      return { valid: false, error: "Each message must have a string content field" };
    }
    if (msg.content.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: `Message too long (max ${MAX_MESSAGE_LENGTH} chars)` };
    }
    // Only allow user and rishi roles from the client
    if (!["user", "rishi"].includes(msg.role)) {
      return { valid: false, error: "Invalid message role" };
    }
  }

  return { valid: true };
}

export function validateTextInput(text: string | undefined, fieldName: string): { valid: boolean; error?: string } {
  if (!text || typeof text !== "string") {
    return { valid: false, error: `${fieldName} is required` };
  }
  if (text.length > MAX_INPUT_LENGTH) {
    return { valid: false, error: `${fieldName} too long (max ${MAX_INPUT_LENGTH} chars)` };
  }
  return { valid: true };
}

/**
 * Validate request origin to prevent CSRF.
 * Returns true if the origin is allowed.
 */
export function validateOrigin(headers: Headers): boolean {
  const origin = headers.get("origin");
  const referer = headers.get("referer");

  // Allow requests with no origin (same-origin, curl, server-side)
  if (!origin && !referer) return true;

  const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean);

  if (origin && allowedOrigins.some((allowed) => origin.startsWith(allowed!))) {
    return true;
  }

  if (referer && allowedOrigins.some((allowed) => referer.startsWith(allowed!))) {
    return true;
  }

  return false;
}
