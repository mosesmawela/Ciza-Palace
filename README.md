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

## 🔗 Connecting Resend (Production Setup)

Inside your api routing file (`app/api/subscribe/route.ts` or `server.ts`), you can replace the `TODO` log section with direct Resend mail-sending workflows:

1. Install the official SDK:
   ```bash
   npm install resend
   ```
2. Generate your API key in the [Resend Console](https://resend.com) and add it to your environment:
   ```env
   RESEND_API_KEY="re_123456789..."
   ```
3. Initialize and trigger email dispatches in `/app/api/subscribe/route.ts`:
   ```typescript
   import { Resend } from "resend";

   const resend = new Resend(process.env.RESEND_API_KEY);

   await resend.emails.send({
     from: "CIZA Fans <newsletter@cizamusic.com>",
     to: email,
     subject: "Welcome to the Movement | CIZA Amapiano",
     text: "Hi! Welcome to CIZA's core community...",
   });
   ```

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
