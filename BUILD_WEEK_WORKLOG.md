# OpenAI Build Week Worklog

This record distinguishes the LoreLock Studio submission from an earlier creator-specific production workflow, as required for pre-existing projects that are meaningfully extended during the submission period.

## Before the submission period

The earlier workflow had project-specific canon documents, prompt sheets, a production ledger, preflight checks, panel generation, and manual/evidence-backed QA. It was not a reusable web product, did not accept arbitrary canon or scenes, and did not expose a generic continuity-analysis experience.

## July 17, 2026 — Product creation

- Paused the earlier production workflow to preserve its state during Build Week.
- Defined LoreLock Studio as a generic continuity engine for visual creators.
- Created the standalone React/Vite/Express application.
- Added generic Zod contracts for canon entities, shot plans, checks, and verdicts.
- Added GPT-5.6 Responses API planning and multimodal validation paths.
- Added the original science-fiction story **The Glass Meridian** as a deterministic proof case for no-credential judge testing.
- Strengthened **The Glass Meridian** into a complete cause-and-effect proof scene with explicit stakes, mission logic, obstacle, warning, confirmation, reroute, and payoff. Tightened deterministic validation so omissions of story-critical evidence return `revise` instead of a false approval.
- Added a complete interface for canon input, shot selection, candidate inspection, corrections, and evidence ledger.
- Added three contract/behavior tests.
- Verified TypeScript, tests, production build, server health, plan endpoint, validation endpoint, and static serving.
- Added one-click drifted/canon-safe proof-case switching for the judge demo.
- Added browser-persistent evidence ledger storage and downloadable JSON evidence artifacts.

## July 19, 2026 — Public release

- Created the public GitHub repository and pushed the standalone LoreLock Studio source.
- Connected a repository-scoped Render deployment on the free judge-accessible tier.
- Published the application at `https://lorelock-studio.onrender.com`.
- Verified the production build, health endpoint, bundled proof case, and rejected-drift evidence contract against the public service.
- Added a dedicated OpenAI project key to Render's encrypted environment settings; the credential is not stored in source control or local project files.
- Verified the public live GPT-5.6 path end to end: `/api/health` reports `live: true`, `/api/plan` returned a structured five-shot plan, and `/api/validate` returned a structured continuity verdict with evidence ID `LL-S01-CONTINUITY-001`.
- Confirmed the public hostname remained healthy after the environment-triggered rebuild and initial edge propagation.

## Remaining submission milestones

- Add one approved and one intentionally drifted visual proof case.
- Capture a sub-three-minute public YouTube demo.
- Add final screenshots, architecture summary, and submission copy.
- Record the Codex `/feedback` session ID used for the majority of core functionality.

## Codex contribution

Codex was used to research the challenge requirements, scope the product against the judging criteria, design the architecture and UX, implement the frontend and backend, create tests, diagnose runtime issues, and verify the full local workflow. The implementation session began July 17, 2026.
