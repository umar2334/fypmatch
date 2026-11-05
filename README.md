# FYPMatch

An AI final year project (FYP) idea generator for Pakistani university students. Answer a short form and get 5 ranked ideas, each with a tech stack, MVP features, risks and a pitch to read to your supervisor.

## The problem

Choosing an FYP is hard: ideas are often too big for the timeline, too generic to impress a supervisor, or unrelated to the student's skills and career goal. FYPMatch starts from the student's department, skills, team size, duration and goal, and suggests projects that fit those limits.

## Features

- 3-step form with autosave, and Save & exit that restores progress
- 5 ranked ideas with difficulty, career relevance and originality scores
- Full breakdown for each idea: MVP features, tech stack, challenges, similar products and a supervisor pitch
- Refine with AI chat, with history saved per idea
- PDF export, generated in the browser
- No signup. Everything is stored in the student's own browser

## Architecture

```
Browser (Next.js client components, localStorage)
   │  POST /api/generate, /api/chat
   ▼
Route handlers: origin check → IP rate limit → body size limit → Zod validation → cache
   │  API key stays on the server
   ▼
Gemini REST API → JSON output validated with Zod → retried once if malformed
```

| Path | Purpose |
| --- | --- |
| `app/` | Pages and API routes |
| `components/` | UI, including the wizard, idea views and chat |
| `lib/schema.ts` | Zod schemas shared by client and server |
| `lib/server/` | Prompts, Gemini client, rate limiter, cache and HTTP helpers |
| `lib/pdf.ts` | PDF export |
| `lib/sample.ts` | Sample ideas for the Examples page and tests |

## Setup

Requires Node 20 or newer.

```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY
npm run dev
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Free key from [Google AI Studio](https://aistudio.google.com/apikey) |
| `GEMINI_MODEL` | No | Overrides the default model, `gemini-3.5-flash-lite` |
| `NEXT_PUBLIC_SITE_URL` | No | Public URL for canonical links and social previews |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Shows a contact address in the footer and on the pricing page |
| `MOCK_AI` | No | `1` serves labelled sample ideas for tests. Ignored on Vercel production |

To deploy on Vercel, import the repo and add `GEMINI_API_KEY`. No other setup is needed.

## Testing

```bash
npm run lint
npm run build       # also creates the type declarations used below
npm run typecheck
npm test            # unit and API route tests, with Gemini mocked
npm run e2e         # browser flow against the production build, needs Chrome
```

## Decisions

- **No database or accounts.** Students can use it instantly, and there's less personal data to protect. The trade-off is that results stay on one device.
- **Honesty is enforced in the prompt.** The AI is told not to invent statistics, funding figures or citations, and money figures must be labelled as rough estimates. This lowers the risk but can't remove it, so the UI also asks students to verify suggestions.
- **Student text is treated as data.** It's sent inside marked JSON, after the rules, so notes can't easily redefine the task.
- **In-memory rate limit and cache.** They need no extra services and suit the free tier, but each serverless instance keeps its own counts. Limits are generous because a campus can share one IP. A shared store such as Redis is the next step for heavier traffic.
- **No fake output.** If the AI isn't configured or is unavailable, users see an honest error. Sample ideas only appear on the Examples page or in clearly labelled test mode.
- **PDFs use a built-in Latin font.** This keeps the bundle small, but Urdu text is left out of exports.

## Known limits

- The Gemini free tier has request limits, and Google may use free-tier data to improve its products. A paid tier is the better fit for paying customers.
- Payments aren't built. Student Pro is shown as coming soon and nothing can be bought.
