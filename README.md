# MindDumper

*"your safe space to dump it all."*

A calm, gentle web app — a landing page and a chat screen — built with **Next.js 15
+ TypeScript + Tailwind CSS**. This is the first look-and-feel version: the chat
**echoes** your words back (no real AI yet — that comes in a later session).

> Part of a larger vision (an empathy-first AI companion, India-first, with strong
> safety rails). The full product roadmap lives outside this folder; this repo is
> the working app.

## Run it on your computer

You need **Node 22** and **pnpm**.

```bash
pnpm install     # first time only — downloads the building blocks
pnpm dev         # start the app at http://localhost:3000
```

Open **http://localhost:3000**, click **Start**, and try the chat.

## Build the production version

```bash
pnpm build       # makes the optimized version
pnpm start       # serves it at http://localhost:3000
```

## The two screens

| Page | What it is |
|------|------------|
| `/` (landing) | Calm gradient, a softly breathing glow, the **MindDumper** title + tagline, and a **Start** button. |
| `/chat` | A messaging screen. Type → **Send** → MindDumper echoes it back. Your bubbles are sage green; MindDumper's are warm peach. |

## Deploy it (put it on the internet)

The easiest host for a Next.js app is **Vercel** (free for hobby projects):

1. Push this folder to a GitHub repo (see below).
2. Go to **vercel.com**, "Add New → Project", and import the repo.
3. Vercel auto-detects Next.js — just click **Deploy**. Done. 🎉

A `vercel.json` is already included, and every push to `main` triggers a build
check (`.github/workflows/ci.yml`) so you always know the app is healthy.

### Push to GitHub

```bash
gh auth login                       # one-time: sign in to GitHub
gh repo create minddumper --public --source=. --push
```

(Or create an empty repo on github.com and `git push` to it.)

## Project layout

```
app/
  layout.tsx     # wraps every page (title + styles)
  page.tsx       # the landing page
  chat/page.tsx  # the chat screen (echo)
  globals.css    # base styles + reduced-motion kindness
tailwind.config.ts  # colours + the "breathe" animation
```
