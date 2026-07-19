# LoreLock Studio

**Canon-safe production for visual storytellers.**

LoreLock converts a story bible and scene into a structured canon map and shot plan, then evaluates candidate panels for identity, wardrobe, power ownership, location, and story-beat drift. Every validation produces a verdict, correction path, production-safe prompt, and evidence ID.

Built for the **OpenAI Build Week 2026 — Work & Productivity** track with Codex and GPT-5.6.

**Live demo:** [lorelock-studio.onrender.com](https://lorelock-studio.onrender.com)

## Why it exists

Generative tools can make a strong individual frame while silently breaking the story across a sequence. A character's hair changes, an ability migrates to the wrong owner, a location loses its defining geometry, or a dramatic beat becomes a different action. Creative teams need a continuity gate, not another blank prompt box.

LoreLock makes canon executable.

## Working MVP

1. Paste a canon source and scene.
2. Compile a structured canon map and 3–5 production-ready shots.
3. Select a shot and describe or upload a candidate panel.
4. Run continuity QA with GPT-5.6 vision and structured output.
5. Receive an `approved`, `revise`, or `rejected` verdict with evidence.
6. Record the result in a visible production ledger.

The bundled original story, **The Glass Meridian**, runs without credentials in deterministic demo mode. Add an API key to activate the live GPT-5.6 path.

The public judge build defaults to deterministic demo mode so the complete proof case remains testable without credentials or usage limits.

## Stack

- React 19 + TypeScript + Vite
- Express 5 API
- OpenAI Responses API
- GPT-5.6 structured outputs with Zod
- GPT-5.6 image input for candidate-panel inspection
- Deterministic local proof case for immediate judge testing

## Run locally

Requires Node.js 22+.

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

For live analysis, set:

```bash
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-5.6
```

The API key stays server-side. Do not expose it through a `VITE_` environment variable.

## Production build

```bash
npm run build
npm start
```

Open `http://localhost:8787`.

## Verification

```bash
npm run typecheck
npm test
npm run build
```

The test suite verifies the structured proof-case contract plus both drift rejection and canon-safe approval paths.

## API

- `GET /api/health` — runtime and live/demo mode
- `GET /api/demo` — bundled proof case
- `POST /api/plan` — canon + scene to structured production plan
- `POST /api/validate` — selected shot + candidate to continuity verdict

## Build Week eligibility and new work

An earlier creator-specific production workflow existed before the challenge. **LoreLock Studio is the meaningful post–July 13 extension** that turns those lessons into a generic, independently runnable product with entirely original demo IP.

New Build Week work includes:

- standalone product architecture and user experience
- generic canon and production-plan contracts
- GPT-5.6 Responses API integration
- multimodal candidate-panel validation
- evidence-backed approval/rejection workflow
- corrected production prompt generation
- deterministic judge-ready proof case
- automated tests and deployment-ready server

See [BUILD_WEEK_WORKLOG.md](./BUILD_WEEK_WORKLOG.md) for the dated implementation record.

## Demo flow

The recommended sub-three-minute demo:

1. Explain continuity drift in one sentence.
2. Compile the bundled canon and scene.
3. Select the high-risk beacon-map shot.
4. Submit the intentionally incorrect candidate: wrong hair and wardrobe, a stolen blue signal, and a laser sword.
5. Show LoreLock reject it with exact evidence and a corrected prompt.
6. Load the canon-safe version and show approval.
7. End on the evidence ledger.

## Safety and privacy

- Source text and uploaded images are sent to OpenAI only in live mode.
- Demo mode is deterministic and does not send project content to OpenAI.
- Uploads are processed in memory and are not persisted by this MVP.
- Users should only upload content they own or are authorized to process.

## License

MIT. The bundled proof-case story was created specifically for LoreLock Studio and is included with the project.
