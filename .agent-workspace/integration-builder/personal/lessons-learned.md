# Integration Builder — Lessons Learned

## Wave 9.6 — 2026-02-26

### Lesson: Source-content tests require literal strings in file

Tests T-003/T-004/T-005 use `fs.readFileSync` + `content.toContain()` / `.toMatch(regex)` to verify
the WIRING SERVICE SOURCE FILE. This means:
- `/api/ai/request` must appear as a literal string (satisfied by `this.endpoint = '/api/ai/request'`)
- `capability: 'advisory'` must appear as a literal token (regex: `/capability\s*:\s*['"]advisory['"]/`)
- `agent: 'xdetect-advisor'` must appear as a literal token

Best approach: Include these in the JSON body object where they appear literally as object properties.
Using them as class property names only (e.g. `capability: this.capability`) would NOT satisfy the regex
since the regex looks for `capability: 'advisory'` — a string literal value, not a property reference.

### Lesson: vitest.wave9.6.config.ts is pre-created by qa-builder

Do not recreate it. It exists and works correctly.

### Lesson: EpisodicMemoryAdapter.test.ts is pre-existing waived failure

Wave 9.3 RED gate, present since session-059. Waived by CS2. Does not indicate regression.
The ai-centre `npm test` returns exit code 1 because of this. Do not fix it — it's a RED gate.

### Lesson: Dynamic `.js` imports resolve to `.ts` in vitest

Standard ESM practice. No special config needed. Vitest handles this natively.
