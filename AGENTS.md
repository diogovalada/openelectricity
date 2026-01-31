## Upstream project agents file.

A overview of this project is in `CLAUDE.md`. This was already a document from the upstream project. Use it only to have a rough idea of the project, but don't use it to guide yourself on what you should do or not. This `AGENTS.md` is the file that matters.

## Fork strategy 

- This is a fork of https://github.com/opennem/openelectricity; keep changes minimal and avoid unnecessary churn to reduce future merge conflicts.

Whenever you need to make changes due to having to adapt for the different reality of our project/country/etc, strive to do it by making the frontend more programmatic. Kind of like a prioritize a Modular, Data-Driven Toolkit architecture (or “Configuration-Driven Dashboard”??) over hard-coded solutions” for things like the Tracker page. Maybe modular Toolkit is the best expression, since maybe we don’t want to turn it into a rigid framework, but rather keep it a flexible toolkit where the UI adapts to the data provided?). In a way that is modular and extensible. E.g. allow users making forks to easily adapt to their own reality (e.g. different countries grids, etc) by allowing them to easily specify the resolutions they want, the source type names, etc. 

Examples:
Configuration-Driven: Abstract all market-specific constants (fuel types, colors, data resolutions, unit types) into a central config file or state.
Generic Components: UI components (charts, legends, tables) must be 'dumb' and programmatic. They should loop through configuration arrays rather than looking for hard-coded names like 'Coal' or 'Solar'.
Low Coupling: Ensure modules (like the Tracker page or the Charting engine) are independent. A user should be able to swap or remove one module without the entire system breaking.
Extensibility: Use standard interfaces for data fetching so that new API sources can be plugged in easily.
Whenever the guidance above impacts your decisions, don’t forget to state that.

My expectation is that modularity will allow to minimize merge conflicts in the future. Maybe it could be a good strategy to implement our new logic in new files? 

But of course, feel free to temper this strategy when common sense requires. And also it's mostly for when changes that break a bit with the upstream project paradigm are necessary.

Note:
  - The `opennem-fe` folder in the parent folder to this repo, contains my fork (https://github.com/diogovalada/opennem-fe) of the old frontend project https://github.com/opennem/opennem-fe (which will be deprecated as they are moving to the new frontend in `opennem/openelectricity`). In my fork, I already started adapting the project for my use case, but I also want to migrate to the svelte version, and that's what we are doing in this repo.
  - The `opennem-fe` folder in the parent folder is using a similar AGENTS.md as this repo (also with diary, ADRs, etc). 

## Global rules

- **Don't make changes until I explicitly say so.**
- If I ask you to “normalize WorkTree”, I mean: make the repository’s working tree clean by staging and committing the current changes. Split into multiple commits when it reduces risk or makes review/merge easier (e.g. separate refactors from behavior changes), but avoid unnecessary churn.
- This is a fork of [https://github.com/opennem/openelectricity](https://github.com/opennem/openelectricity); keep changes minimal and avoid unnecessary churn to reduce future merge conflicts.
  - Prefer additive files over rewrites when possible.
  - Keep fork-only logic isolated and well documented.
- "Memorize" convention
  - If I directly tell you to "memorize" something (e.g. "memorize this", "can you memorize ..."), treat it as a request to persist that information by updating the appropriate section below and/or linked docs. Do not treat "memorize" as a persistence request when I'm talking about myself (e.g. "I need to memorize ...").
- "Normalize working tree"
  - If I ask you to “normalize Working Tree”, I mean: make the repository’s working tree clean by staging and committing the current changes. Split into multiple commits when it reduces risk or makes review/merge easier (e.g. separate refactors from behavior changes), but avoid unnecessary churn.

## Agent notes (keep up to date)

This section is where we keep operational knowledge that’s easy to lose between conversations (API contract, non-obvious decisions, and deferred risks).

**Doc roles (to avoid redundancy):**
- **Canonical spec (Portugal-specific behavior + API/time rules):** `docs/PORTUGAL_ADAPTATION.md`
- **Canonical architecture decisions (expensive-to-reverse):** `docs/adr/`
- **Divergence index vs upstream (bullets + links, not prose):** `docs/FORK_NOTES.md`
- **Chronological breadcrumbs (non-canonical, link-first):** Diary below

If any subsections below are missing, create them using the same structure.

### Portugal adaptation contract

Framework-agnostic contract + key decisions live in `docs/PORTUGAL_ADAPTATION.md`.

**This doc is canonical** for: endpoints, response shapes, interval/timezone rules, PSR identity, and other porting-critical behavior.
Other docs (ADR/Fork notes/Diary) should link to it rather than restating details.

If you change anything contract-critical, update that doc.

### ADRs (deep decisions)

For a small number of non-obvious decisions that are expensive to reverse and/or important to replicate in a future frontend (e.g. a Svelte port), write a short Architecture Decision Record (ADR) under `docs/adr/`.

**ADRs are canonical for architecture decisions.** If the decision is primarily Portugal-specific behavior, prefer `docs/PORTUGAL_ADAPTATION.md` and link to it from the ADR.

Keep ADRs small (typically 10–30 lines) and link to deeper docs when available.

Suggested ADR template:
- Context
- Decision
- Alternatives considered
- Consequences / tradeoffs

### Diary

Intent: record decisions that aren’t obvious from the code alone (often driven by constraints or tradeoffs).

**Diary is non-canonical and should be link-first.**
Prefer one-liners that point to the canonical doc (ADR / PORTUGAL_ADAPTATION / FORK_NOTES) rather than duplicating details.

- Format: `YYYY-MM-DD: <short decision + why> (link)`
- Keep it concise; link to deeper docs when available.

### Heads-up (deferred)

Intent: keep a short list of known issues/risks we intentionally aren’t addressing yet.

- 15m interval is displayed but disabled until backend supports it end-to-end.
- Frontend does not implement client-side time-tile caching anymore; load-time depends on backend responsiveness.

# Working with the repo 

## Running dev server

The dev server can be launched with:
```
pnpm dev  # typically on http://localhost:5173/
```

## Backend dev (for local API)

FastAPI runs separately (repo: `../backend`). Typical command:
```
uvicorn api.generate_plot:app --reload --port 8000
```

## Tools and MCP servers
- Playwright is available (via the Docker MCP gateway).