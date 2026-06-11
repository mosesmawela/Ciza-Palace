# CIZA | Premium Amapiano Fan Portal (LVRN Records)

A high-fidelity, visual-first fan hub for amapiano artist **CIZA** (signed to Love Renaissance). Designed with dark, atmospheric high-fashion layouts, responsive structures, and subscription components built for newsletters, tour alerts, and exclusive listenings.

---

## 🚀 Tech Stack
- **Framework**: Next.js 14 (App Router) / React 19
- **Styler**: Tailwind CSS (v3 / v4 Config)
- **Language**: TypeScript
- **Icons**: Lucide React
- **Hosting / Deploy**: Vercel Ready

---

## 📂 Project Architecture

This workspace contains two implementations mapped perfectly for your needs:
1. **Next.js 14 Production Structure** (Under `/app` and `/components` directories), crafted exactly as requested so you can deploy straight to Vercel.
2. **Standard Express + Vite Dev Container** (Under `/src` & `/server.ts`), enabling a fully functional live and interactive browser workspace immediately inside Google AI Studio.

```bash
├── app/
│   ├── api/
│   │   └── subscribe/
│   │       └── route.ts       # Next.js 14 API POST Route (w/ Resend TODO Stub)
│   ├── globals.css            # Next.js global styling rules
│   ├── layout.tsx             # HTML document wrappers & metadata
│   └── page.tsx               # Primary editorial continuous scroll landing page
├── components/
│   └── SignupForm.tsx         # "use client" Newsletter Signup component
├── src/
│   ├── App.tsx                # Interactive local React/Vite layout
│   ├── main.tsx               # Dev entry-point for Vite
│   ├── index.css              # Local CSS rules
│   └── assets/                # Generated visual media (CIZA cover/banner)
├── server.ts                  # express-Vite proxy serving local `/api/subscribe`
├── package.json               # dependencies config
├── tailwind.config.ts         # scanned directories configuration
└── README.md                  # This file
```

---

## ⚡ Running Locally

### 1. Install Dependencies
Run the following package install command in your project terminal:
```bash
npm install
```

### 2. Launch Local Dev Server
To run the full-stack local server:
```bash
npm run dev
```
The server will start at `http://localhost:3000`. You can instantly interact with form inputs, receive inline validity alerts, and view terminal signup logs.

---

## 🔗 Resend Audience Wiring (Newsletter Signup)

The `/api/subscribe` endpoint in `server.ts` adds submitted emails to a **Resend Audience** (subscribed contacts list) so you can blast them about releases, events, and drops.

### Setup checklist (do these once)

1. **Create a Resend account** at [resend.com](https://resend.com).
2. **Verify a sending domain** under [Domains](https://resend.com/domains) — Resend won't let you broadcast to an audience until at least one domain is verified.
3. **Create an Audience** under [Audiences](https://resend.com/audiences). Copy the audience **UUID** (looks like `f9a1b2c3-...`).
4. **Generate an API key** at [API Keys](https://resend.com/api-keys) with `Full access` (or at minimum `audiences:write`).
5. **Copy `.env.example` to `.env`** at the repo root and fill in:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxx
   RESEND_AUDIENCE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
6. **Restart `npm run dev`** so `server.ts` picks up the new env vars.

### How it works

`POST /api/subscribe` validates the email, checks the honeypot, then calls:

```
POST https://api.resend.com/audiences/<RESEND_AUDIENCE_ID>/contacts
Authorization: Bearer <RESEND_API_KEY>
{ "email": "<user@example.com>", "unsubscribed": false }
```

On success the form shows `✓ You're in — check your inbox`. On failure it shows `Something broke — try again` and the server logs the Resend status code.

### Vercel deploy

In the Vercel project settings → **Environment Variables**, add `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` for the **Production** (and Preview) environments. Redeploy. The Express server bundled by `npm run build` reads them via `process.env`.

---

## ☁️ Deploying to Vercel

### Option A: Vercel CLI (Super fast)
1. Install globally and authenticate:
   ```bash
   npm install -g vercel
   vercel login
   ```
2. Execute the deploy framework:
   ```bash
   vercel
   ```
3. Select defaults and assign your production build domain.

### Option B: GitHub Integration (Recommended)
1. Create a repository on GitHub and commit all changes:
   ```bash
   git init
   git add .
   git commit -m "Initialize CIZA Fan Website"
   git remote add origin YOUR_REPO_URL
   git branch -M main
   git push -u origin main
   ```
2. Open your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New Project**.
3. Import your GitHub repository.
4. Set **Next.js** as the Project Framework, configure any Environment Variables (like `RESEND_API_KEY`), and click **Deploy**.
