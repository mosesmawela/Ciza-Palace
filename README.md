# CIZA · Palace

Official fan hub for **CIZA** — South African DJ, producer and recording artist. Afro House. 3-step. Amapiano without borders.

→ **Live**: [ciza-palace.lvrn.dev](https://ciza-palace.lvrn.dev)
→ **EPK**: [ciza.lvrn.dev](https://ciza.lvrn.dev)

---

## About

This is a cinematic single-page experience built around CIZA's catalogue, upcoming album *Ciza's Palace*, tour, press, and Inner Circle subscriber list. Designed as the public-facing entry point — separate from the booking/press EPK.

**Stack**

- **Framework** · Vite + React 19 + TypeScript
- **Styling** · Tailwind v4 + custom CSS for liquid-glass + chromatic effects
- **Motion** · Framer Motion (Motion) + CSS `@property` + requestAnimationFrame for scroll-driven visuals
- **Server** · Express (`/api/subscribe` proxy to Resend Audiences)
- **Hosting** · Vercel (custom domain `ciza-palace.lvrn.dev`)
- **Email** · Resend (audience-list capture)

## What's in the box

| Section | What it does |
|---|---|
| Hero | Wings logo, orbit rings, typewriter cycling through 7 lines about CIZA |
| Marquee | Infinite scroll strip of stats and press credentials |
| Bio | Editorial bio in a frosted glass card |
| Album Preview | *Ciza's Palace* album countdown, 4 selected works grid |
| Events | Tour placeholder — populates when dates announced |
| Press | 9 verified press quotes with per-card typewriter reveal |
| Inner Circle | Subscribe form with 4 tile breakdown (Tour · Live · Releases · Drops) |
| Follow | Branded social pills with rotating border-beam |
| EPK CTA | Routes to the booking/press EPK at `ciza.lvrn.dev` |
| Sticky CTA | Mobile-only floating "View Full EPK" pill |

## Signature interactions

- **Scroll-driven focal blur** — the background canvas frames are uniformly blurred on landing; as you scroll, a radial mask opens a sharp circle at the centre, with blur strength decreasing from 32px to 10px
- **Liquid nav bubble** — a single gold pill tracks the active section via IntersectionObserver, animates between tabs with springy ease
- **Frosted-glass cards** — heavy `backdrop-filter` with drifting droplets, diagonal light-beam sweeps, click → bean-burst particle effect
- **Rotating headlines** — key H2s ("In the Press → Conversation → Spotlight → Record") slide-up between phrases every 2.8s
- **Conic-gradient border beams** — uses `@property --beam-angle` for smooth orbiting highlights around any rounded shape, no SVG dashes

## Mobile performance

Mobile is gated heavily — `(max-width: 720px), (pointer: coarse)`:

- Canvas scroll frames disabled (static gradient fallback)
- Focal blur overlay disabled
- `backdrop-filter` blur strength reduced from 32px → 12px
- Droplet animations + light-beam sweeps stripped
- Orbit rings hidden
- Magnetic cursor never mounts on touch

## Development

```bash
npm install
npm run dev          # starts Vite + Express on http://127.0.0.1:5180
```

The dev server binds strictly to `127.0.0.1` per project convention. Port 5180 is reserved for Ciza-Palace.

## Environment

`.env` is gitignored. Required keys:

```
RESEND_API_KEY=re_***                # Resend API key
RESEND_AUDIENCE_ID=***               # Audience ID for subscriber capture
RESEND_FROM_EMAIL=newsletter@ciza-palace.lvrn.dev
APP_URL=https://ciza-palace.lvrn.dev
```

Set these in **Vercel → Project → Settings → Environment Variables** for production. Local `.env` does not deploy.

## Deploy

```bash
vercel --prod --yes --force
```

The `--force` flag is required for LVRN projects — Vercel sometimes ships empty 404 builds without it. After deploy, verify the alias:

```bash
curl -sI https://ciza-palace.lvrn.dev | head
```

**This project must NOT have git auto-deploy enabled in Vercel** — CLI-only deploys to prevent empty-build 404s.

## Project structure

```
src/
├── App.tsx                       Main page composition
├── index.css                     Tailwind theme + beam + mobile perf gates
├── main.tsx                      Vite entry
├── assets/                       Local images
├── hooks/
│   └── useScrollVelocity.ts      rAF-driven velocity tracking
└── components/
    ├── LiquidNav.tsx             Bubble-tracking top nav
    ├── ScrollFrameBackground.tsx Canvas frame painter + focal blur
    ├── GlassCard.tsx             Frosted-glass card with droplets + bean-burst
    ├── MagneticCursor.tsx        Custom cursor with magnetic pull
    ├── AudioSwellOnScroll.tsx    Optional scroll-velocity audio
    ├── CinematicReveal.tsx       FilmCutSection + KineticQuote helpers
    ├── Marquee.tsx               Infinite scroll strip
    ├── EyebrowBubble.tsx         Animated section-number bubble
    ├── TypewriterCycle.tsx       Hero typewriter (loops)
    ├── TypewriterQuote.tsx       Press-quote typewriter (one-shot)
    ├── RotatingHeadline.tsx      Slide-up phrase rotator
    ├── Countdown.tsx             Album release countdown
    ├── ShareButton.tsx           navigator.share + clipboard fallback
    ├── StickyMobileCTA.tsx       Floating mobile EPK pill
    ├── SubscribeForm.tsx         Inner Circle form
    └── SocialIcons.tsx           Brand-mark SVGs (Spotify · Apple · etc)

public/
├── logos/                        wings, wordmark, ciza-palace marks
├── frames/                       Pre-extracted JPEG frames for scroll bg
├── video/                        Source mp4/webm (legacy, frames preferred)
└── favicon.svg                   Wings mark
```

## Credits

- **Artist** · [CIZA](https://open.spotify.com/artist/71hPkbyih5bdlHVPBgav33)
- **Label** · [LVRN](https://lvrn.com)
- **Design + Build** · Moses Mawela
- **Typography** · Fraunces · Newsreader · Inter · JetBrains Mono (Google Fonts)

## License

© 2026 CIZA · LVRN. All rights reserved.

This is a private artist project. The code, designs, copy, photography, and audio belong to CIZA and LVRN. Do not fork, redistribute, or use for commercial purposes without written permission.

For licensing or partnership: **moses@lvrn.com**
