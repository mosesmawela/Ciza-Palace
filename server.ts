import express from "express";
import path from "path";
import "dotenv/config";
import { createServer as createViteServer } from "vite";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 5180;

  // JSON parser middleware
  app.use(express.json());

  // API endpoints
  app.post("/api/subscribe", async (req, res) => {
    const { email, website } = req.body ?? {};

    // Honeypot: bots fill this hidden field; pretend success.
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
  });

  // Vite middleware for rendering the SPA front-end
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Strict localhost binding — not exposed on LAN
  app.listen(PORT, "127.0.0.1", () => {
    console.log(`[CIZA Server] running at http://127.0.0.1:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
