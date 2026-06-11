import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parser middleware
  app.use(express.json());

  // API endpoints
  app.post("/api/subscribe", (req, res) => {
    const { email, name, coordinates } = req.body;

    // Server-side validation
    if (!email || typeof email !== "string" || !email.trim() || !email.includes("@")) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const sanitizedEmail = email.trim();
    const sanitizedName = name ? String(name).trim() : "";
    const sanitizedCoordinates = coordinates ? String(coordinates).trim() : "Not Provided";

    console.log(`[CIZA FAN SIGNUP] New subscriber: Name: "${sanitizedName || "N/A"}", Email: "${sanitizedEmail}", Coordinates: "${sanitizedCoordinates}"`);

    // TODO: Connect Resend API or another email provider here in production
    // Example:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'CIZA Fans <newsletter@cizamusic.com>',
    //   to: sanitizedEmail,
    //   subject: 'Welcome to the Movement | CIZA Amapiano',
    //   react: EmailTemplate({ firstName: sanitizedName }),
    // });

    return res.status(200).json({ success: true, message: "Subscribed successfully!" });
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CIZA Server] running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
