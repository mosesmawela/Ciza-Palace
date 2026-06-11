// Vercel serverless function — mirrors the local Express /api/subscribe
// route so production traffic can hit it. The Express server is dev-only.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface RequestLike {
  method?: string;
  body?: { email?: unknown; website?: unknown } | string;
}

interface ResponseLike {
  status(code: number): ResponseLike;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
  end?(): void;
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  // Method gate
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Vercel parses JSON bodies into req.body automatically, but be defensive.
  let body: { email?: unknown; website?: unknown } = {};
  if (req.body && typeof req.body === "object") {
    body = req.body as { email?: unknown; website?: unknown };
  } else if (typeof req.body === "string") {
    try {
      body = JSON.parse(req.body);
    } catch {
      body = {};
    }
  }

  const { email, website } = body;

  // Honeypot — bots fill the hidden `website` field; pretend success
  if (typeof website === "string" && website.trim() !== "") {
    return res.status(200).json({ success: true });
  }

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  const sanitizedEmail = email.trim().toLowerCase();
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.warn("[CIZA] Resend not configured. Logging signup only:", sanitizedEmail);
    return res.status(500).json({ error: "Subscription service is not configured. Try again later." });
  }

  try {
    const resendRes = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: sanitizedEmail, unsubscribed: false }),
      }
    );

    if (!resendRes.ok) {
      const detail = await resendRes.text().catch(() => "");
      console.error(`[CIZA] Resend error ${resendRes.status}:`, detail);
      return res.status(502).json({ error: "Could not add you to the list. Try again." });
    }

    console.log(`[CIZA FAN SIGNUP] Added to Resend audience: ${sanitizedEmail}`);
    return res.status(200).json({ success: true, message: "Subscribed successfully!" });
  } catch (err) {
    console.error("[CIZA] Resend request failed:", err);
    return res.status(502).json({ error: "Network error talking to Resend. Try again." });
  }
}
