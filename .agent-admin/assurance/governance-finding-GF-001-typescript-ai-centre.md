# Governance Assurance Finding — GF-001 TypeScript/Node Type Errors in ai/ai-centre

**Finding ID**: GF-001  
**Date Recorded**: 2026-03-02  
**Recorded By**: governance-liaison-isms (session-036-20260302)  
**Status**: REMEDIATED  
**Wave Reference**: Wave 13 (live deployment wiring) — pre-existing finding  
**IAA Zero-Tolerance Reference**: Issue #792 — IAA Zero-Severity-Tolerance policy  
**Cross-Reference PR**: #789 (Wave 13 wiring — finding pre-dates this PR)  
**Remediation PR**: copilot/fix-typescript-errors-ai-centre

---

## Finding Summary

Multiple TypeScript errors and missing type definitions detected in the AI/AI-centre modules
during Vercel build and local `tsc` type-check runs. Per IAA Zero-Tolerance policy (Issue #792),
all findings must be recorded regardless of whether they block existing MAT module gates.

---

## Errors Recorded

### Category A — Missing `@types/node` (TS2307, TS2580, TS7006)

Files affected:
- `api/ai/feedback.ts` — TS2307 (`node:http`), TS2580 (`process`, `Buffer`) × 8 errors
- `api/ai/feedback/approve.ts` — TS2307 (`node:http`), TS2580 (`process`, `Buffer`) × 8 errors
- `api/ai/feedback/pending.ts` — TS2307 (`node:http`, `node:url`), TS2580 (`process`) × 6 errors
- `api/ai/health.ts` — TS2307 (`node:http`) × 1 error
- `api/ai/request.ts` — TS2307 (`node:http`), TS2580 (`process`, `Buffer`) × 8 errors
- `packages/ai-centre/src/keys/ProviderKeyStore.ts` — TS2580 (`process`) × 1 error
- `packages/ai-centre/src/personas/PersonaLoader.ts` — TS2307 (`node:fs/promises`, `node:path`, `node:url`), TS7006 (implicit `any`) × 5 errors

Root cause: `@types/node` absent from both root `package.json` and `packages/ai-centre/package.json` devDependencies.

### Category B — Code Syntax Error (TS1434)

File: `api/ai/request.ts` line 73  
Error: `TS1434: Unexpected keyword or identifier`  
Root cause: Multi-line `as` type assertion — TypeScript ASI (automatic semicolon insertion) treats the
newline after `createClient(...)` as a statement terminator, making the continuation `as unknown as`
on the next line invalid.

### Category C — Malformed Test File (TS1109, TS1003, TS1005, TS1161)

File: `packages/ai-centre/src/__tests__/personas/PersonaLoader.test.ts` lines 153–155, 271–272, 309  
Root cause: Duplicate/orphaned test fragments from two overlapping generations of CL-1 tests.
The `CL-1-T-002` test body (line 149) was missing its assertions and closing brackets.
Lines 271–307 contained duplicate tests (CL-1-T-003, CL-1-T-004, CL-1-T-005) and orphaned JSDoc
comment fragments that caused parse errors inside the `describe` block.

---

## Evidence

Screenshots from Vercel build logs (attached in Issue #793):
- Vercel build: `api/ai/feedback/approve.ts(15,54): error TS2307: Cannot find module 'node:http'`
- Vercel build: `api/ai/feedback/approve.ts(28,23): error TS2580: Cannot find name 'process'`
- Vercel build: `api/ai/feedback/pending.ts(16,54): error TS2307: Cannot find module 'node:http'`
- (and multiple similar errors across all feedback and health API files)

---

## Remediation Actions

| Action | File | Status |
|--------|------|--------|
| Add `@types/node` devDependency | `package.json` (root) | ✅ DONE |
| Add `@types/node` devDependency | `packages/ai-centre/package.json` | ✅ DONE |
| Exclude test files from tsconfig compilation | `packages/ai-centre/tsconfig.json` | ✅ DONE |
| Fix multi-line `as` assertion (TS1434) | `api/ai/request.ts` line 73 | ✅ DONE |
| Remove malformed duplicate test fragments | `packages/ai-centre/src/__tests__/personas/PersonaLoader.test.ts` | ✅ DONE |

---

## Verification

Post-fix type-check results:
- `tsc -p api/tsconfig.json --noEmit` (with @types/node): PASS (0 errors except @supabase/supabase-js not installed locally)
- `tsc -p packages/ai-centre/tsconfig.json --noEmit` (with @types/node): PASS (0 errors)
- `modules/mat/frontend`: type-check PASS, lint PASS (no regressions)

---

## IAA Compliance Note

Per Issue #792 (IAA Zero-Severity-Tolerance policy): this finding is recorded regardless of impact on
existing MAT module gates. The errors were silent failures in the AI API endpoint build path.
Future pipelines should surface this class of error as gating failures for ai/ai-centre modules.
