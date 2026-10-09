# Agente Jota — Professional Services

Phase A: an independent extraction of the approved Spanish landing. Copy, interactions, responsive CSS, and media are preserved; only local asset paths are namespaced.

## Quick check

~~~sh
npm ci
npm run build
npm run typecheck
npm run lint
npm run verify:isolation
~~~

Use npm run dev for local development. Dependencies are pinned, with this repository's own node_modules and dist. All assets live under public/agentejota-profesionales/.

## Boundaries

The app renders the landing directly, without portfolio App, LanguageProvider, source routes, backend, analytics, or deployment configuration. The brand link / means this standalone home. The existing portfolio link and WhatsApp draft flow remain external. The presentation video remains a future placeholder.

Canonical/page metadata retains approved original URLs; it does not configure hosting or routing. Social-image metadata now uses local paths; final absolute deployed URLs await separate authorization.

**Production protection:** no deployment, domain/DNS changes, redirects, rewrites, or source production settings. Phases B, C, and D require separate authorization. The production HTTP/routing baseline belongs to Phase C and has not been audited or changed. This is not an assertion of identical production rendering.

See [preservation evidence](docs/PHASE-A-ISOLATION.md). Browser/localhost validation was not performed; checks are static source/media proof and build/type/lint verification.
