// Vercel serverless function — mirrors the local Express /api/subscribe
// route so production traffic can hit it. The Express server is dev-only.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const SITE_URL = "https://ciza-palace.lvrn.dev";
const EPK_URL = "https://ciza.lvrn.dev";

function welcomeEmailText(): string {
  return [
    "You're in.",
    "",
    "Welcome to the Inner Circle — first access to CIZA's tour dates, releases, drops, and CIZA'S PALACE live mixes.",
    "",
    "What's coming:",
    "• Tour announcements before public on-sale",
    "• CIZA'S PALACE live mixes and residency nights",
    "• New releases direct to your inbox",
    "• Limited drops and member-only items",
    "",
    "Until then, get into the catalogue:",
    SITE_URL,
    "",
    "Booking + press: " + EPK_URL,
    "",
    "— CIZA · LVRN",
  ].join("\n");
}

function welcomeEmailHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>Welcome to the Inner Circle</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#f5f5f5;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;">
    <tr><td align="center" style="padding:48px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#111114;border:1px solid rgba(255,255,255,0.06);border-radius:20px;overflow:hidden;">
        <tr><td style="padding:36px 36px 24px 36px;text-align:center;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#F5A623;margin-bottom:12px;">The Inner Circle</div>
          <h1 style="margin:0 0 16px 0;font-size:32px;line-height:1.05;font-weight:800;letter-spacing:-0.01em;color:#f5f5f5;">You're in.</h1>
          <p style="margin:0;font-size:15px;line-height:1.55;color:rgba(245,245,245,0.8);">Welcome to the Inner Circle. You'll be the first to hear when CIZA drops new music, announces tour dates, or goes live from <strong style="color:#F5A623;font-weight:600;">CIZA'S PALACE</strong>.</p>
        </td></tr>

        <tr><td style="padding:8px 36px 24px 36px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.06);">
            <tr><td style="padding:18px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#F5A623;margin-bottom:4px;">Tour</div>
              <div style="font-size:14px;color:rgba(245,245,245,0.9);">Cities, venues, presale codes — before public on-sale.</div>
            </td></tr>
            <tr><td style="padding:18px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#F5A623;margin-bottom:4px;">Events</div>
              <div style="font-size:14px;color:rgba(245,245,245,0.9);">CIZA'S PALACE live mixes, residencies, club nights.</div>
            </td></tr>
            <tr><td style="padding:18px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#F5A623;margin-bottom:4px;">Music</div>
              <div style="font-size:14px;color:rgba(245,245,245,0.9);">Singles, features, the LP — direct to your inbox.</div>
            </td></tr>
            <tr><td style="padding:18px 0;">
              <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#F5A623;margin-bottom:4px;">Drops</div>
              <div style="font-size:14px;color:rgba(245,245,245,0.9);">Limited drops, early-bird access, member-only items.</div>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:8px 36px 36px 36px;text-align:center;">
          <a href="${SITE_URL}" style="display:inline-block;background:#F5A623;color:#0a0a0a;text-decoration:none;font-weight:700;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;padding:14px 28px;border-radius:999px;">Enter Ciza's Palace →</a>
          <p style="margin:18px 0 0 0;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(245,245,245,0.5);">
            <a href="${EPK_URL}" style="color:rgba(245,245,245,0.65);text-decoration:none;">Booking · Press · Rates</a>
          </p>
        </td></tr>

        <tr><td style="padding:24px 36px;background:#0c0c0e;border-top:1px solid rgba(255,255,255,0.04);text-align:center;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(245,245,245,0.45);">CIZA · LVRN · 2026</div>
          <div style="margin-top:8px;font-size:11px;color:rgba(245,245,245,0.35);">You're receiving this because you subscribed at ciza-palace.lvrn.dev</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

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

    // Fire welcome email — best-effort. If sending fails, the user is
    // already in the audience so the form should still resolve as success.
    const fromEmail = process.env.RESEND_FROM_EMAIL || "newsletter@ciza-palace.lvrn.dev";
    const fromName = process.env.RESEND_FROM_NAME || "CIZA";
    try {
      const sendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: [sanitizedEmail],
          subject: "Welcome to the Inner Circle — CIZA",
          html: welcomeEmailHtml(),
          text: welcomeEmailText(),
        }),
      });
      if (!sendRes.ok) {
        const detail = await sendRes.text().catch(() => "");
        console.warn(`[CIZA] Welcome email send failed ${sendRes.status}:`, detail);
      } else {
        console.log(`[CIZA] Welcome email queued for: ${sanitizedEmail}`);
      }
    } catch (sendErr) {
      console.warn("[CIZA] Welcome email request errored:", sendErr);
    }

    return res.status(200).json({ success: true, message: "Subscribed successfully!" });
  } catch (err) {
    console.error("[CIZA] Resend request failed:", err);
    return res.status(502).json({ error: "Network error talking to Resend. Try again." });
  }
}
