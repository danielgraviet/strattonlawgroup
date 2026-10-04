import "server-only";

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

/**
 * Verify a Cloudflare Turnstile token with Cloudflare's siteverify API.
 * Returns false when the secret is missing, the token is empty, or verification fails.
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not configured.");
    return false;
  }

  if (!token.trim()) {
    return false;
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        secret,
        response: token
      }),
      cache: "no-store"
    });

    if (!response.ok) {
      console.error("Turnstile siteverify HTTP error:", response.status);
      return false;
    }

    const data = (await response.json()) as TurnstileVerifyResponse;
    if (!data.success) {
      console.warn("Turnstile verification failed:", data["error-codes"] ?? []);
    }
    return Boolean(data.success);
  } catch (error) {
    console.error("Turnstile verification request failed:", error);
    return false;
  }
}
