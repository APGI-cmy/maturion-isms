# Security Fix Runbook — Dependabot Vulnerability Remediation

**Date**: 2026-02-27  
**Branch**: `copilot/fix-dependabot-vulnerabilities`  
**Scope**: `modules/mat/frontend/package.json` (direct deps), root `package.json` (overrides + root devDep)  
**Performed by**: Integration Builder (builder-class agent, session-069)  
**Authority**: CS2 — foreman-v2-agent delegation  

---

## Summary

12 Dependabot vulnerabilities were identified across the `modules/mat/frontend` workspace and root package. All 12 have been fully resolved. Post-fix `npm audit` reports **0 vulnerabilities** in both `modules/mat/frontend` and the repository root.

All vulnerabilities were in **devDependencies only** — no production runtime risk to end users.

---

## Vulnerability Inventory (Before Fix)

### HIGH Severity (7 instances)

| # | CVE / Advisory | Package | Vulnerable Range | Fix |
|---|---|---|---|---|
| 1 | GHSA-mw96-cpmx-2vgc | `rollup` | 4.0.0 – 4.58.0 | Upgrade to ≥4.59.0 (via vite 6.x) |
| 2 | GHSA-3ppc-4f35-3m26 | `minimatch` | ≤3.1.3 and 9.0.0–9.0.6 | Upgrade to ≥3.1.4 / ≥9.0.7 |
| 3 | GHSA-3ppc-4f35-3m26 | `minimatch` | (duplicate path via `@humanwhocodes/config-array`) | Same fix |
| 4 | GHSA-7r86-cg39-jmmj | `minimatch` | ≤3.1.3 and 9.0.0–9.0.6 | Upgrade to ≥3.1.4 / ≥9.0.7 |
| 5 | GHSA-7r86-cg39-jmmj | `minimatch` | (duplicate path via `eslint`) | Same fix |
| 6 | GHSA-23c5-xmqv-rm74 | `minimatch` | ≤3.1.3 and 9.0.0–9.0.6 | Upgrade to ≥3.1.4 / ≥9.0.7 |
| 7 | GHSA-23c5-xmqv-rm74 | `minimatch` | (duplicate path via `glob`) | Same fix |

**Descriptions:**
- **GHSA-mw96-cpmx-2vgc** — Rollup 4: Arbitrary File Write via Path Traversal. Attacker can write arbitrary files during bundle output.
- **GHSA-3ppc-4f35-3m26** — minimatch ReDoS via repeated wildcards with non-matching literal in pattern. Denial-of-service via crafted glob patterns.
- **GHSA-7r86-cg39-jmmj** — minimatch ReDoS via multiple non-adjacent GLOBSTAR segments.
- **GHSA-23c5-xmqv-rm74** — minimatch ReDoS via nested `*()` extglobs generating catastrophically backtracking regexes.

### MODERATE Severity (5 instances)

| # | CVE / Advisory | Package | Vulnerable Range | Fix |
|---|---|---|---|---|
| 8 | GHSA-67mh-4wv8-2f99 | `esbuild` | ≤0.24.2 | Upgrade to ≥0.25.0 (via vite 6.x) |
| 9 | GHSA-67mh-4wv8-2f99 | `vite` | 0.11.0–6.1.6 | Upgrade to ≥6.1.7 |
| 10 | GHSA-67mh-4wv8-2f99 | `vite-node` | (transitive via vite) | Resolved transitively |
| 11 | GHSA-67mh-4wv8-2f99 | `vitest` | 0.3.3–2.2.0-beta.2 | Upgrade to ≥3.0.0 |
| 12 | GHSA-2g4f-4pwh-qvx6 | `ajv` | <6.14.0 | Upgrade to ≥6.14.0 |

**Descriptions:**
- **GHSA-67mh-4wv8-2f99** — esbuild dev server: any website can send cross-origin requests to the local dev server and read responses. Only affects development — not production builds.
- **GHSA-2g4f-4pwh-qvx6** — ajv ReDoS when using `$data` option. Denial-of-service via crafted JSON schema.

---

## Root Cause Analysis

| Root Package | Vulnerability Chain |
|---|---|
| `@typescript-eslint/eslint-plugin@^6.14.0` | → `@typescript-eslint/typescript-estree@6.x` → `minimatch@9.0.0–9.0.5` (HIGH) |
| `@typescript-eslint/parser@^6.14.0` | → same chain as above (HIGH) |
| `vite@^5.0.8` | → `rollup@4.57.1` (HIGH), `esbuild@0.21.5` (MODERATE) |
| `vitest@^1.6.1` | → `vite@5.x` → same rollup + esbuild chain |
| `eslint@8.57.1` | → `ajv@6.12.6` (MODERATE), `minimatch@3.1.2` (HIGH) |

---

## Fix Actions Taken

### 1. `modules/mat/frontend/package.json` — Direct Dependency Upgrades

| Dependency | Before | After | Vulnerability Fixed |
|---|---|---|---|
| `@typescript-eslint/eslint-plugin` | `^6.14.0` | `^7.6.0` | minimatch HIGH chain (GHSA-3ppc, GHSA-7r86, GHSA-23c5) |
| `@typescript-eslint/parser` | `^6.14.0` | `^7.6.0` | Same as above |
| `@vitejs/plugin-react` | `^4.2.1` | `^4.3.0` | Vite 6 compatibility (minor, no CVE) |
| `vite` | `^5.0.8` | `^6.1.7` | esbuild GHSA-67mh (MODERATE), rollup GHSA-mw96 (HIGH) |
| `vitest` | `^1.6.1` | `^3.0.0` | Transitive vite/esbuild chain |

**Added `overrides` block to `modules/mat/frontend/package.json`:**
```json
"overrides": {
  "rollup": ">=4.59.0",
  "ajv": ">=6.14.0",
  "minimatch": ">=3.1.4"
}
```
This forces safe minimum versions for transitive dependencies including those from `eslint@8.57.1`'s sub-tree.

### 2. Root `package.json` — Root devDependency Upgrade + Overrides

| Change | Before | After | Reason |
|---|---|---|---|
| `devDependencies.vitest` | `^1.6.1` | `^3.0.0` | Root vitest pulled in vulnerable vite 5.x / rollup 4.57.x |
| Added `overrides` block | — | `rollup >=4.59.0`, `ajv >=6.14.0`, `minimatch >=3.1.4` | npm-level transitive override for root workspace |
| Added `pnpm.overrides` block | — | `rollup >=4.59.0`, `ajv >=6.14.0`, `minimatch >=9.0.7` | pnpm-level transitive override for pnpm workspace |

### 3. Lockfile Regeneration

- `modules/mat/frontend/package-lock.json` — regenerated via `npm install` + `npm audit fix`
- `pnpm-lock.yaml` — regenerated via `pnpm install --no-frozen-lockfile`

**Resolved transitive package versions after fix:**

| Package | Before (vulnerable) | After (safe) |
|---|---|---|
| `rollup` | 4.57.1 | 4.59.0 |
| `minimatch` (3.x path) | 3.1.2 | 3.1.5 |
| `minimatch` (9.x path) | 9.0.3 / 9.0.5 | 9.0.9 |
| `ajv` | 6.12.6 | 6.14.0 |
| `esbuild` | 0.21.5 | 0.25.12 |
| `vite` | 5.4.21 | 6.4.1 |
| `vitest` | 1.6.1 | 3.2.4 |

---

## Post-Fix Audit Results

### `modules/mat/frontend` npm audit:
```
found 0 vulnerabilities
```

### Root npm audit:
```
found 0 vulnerabilities
```

---

## Test Regression Verification

All existing tests passed without modification after the dependency upgrades:

### `modules/mat/frontend` (vitest v3.2.4):
```
Test Files  15 passed (15)
Tests       87 passed (87)
```

### Root workspace (vitest v3.2.4):
```
Test Files  45 passed (45)
Tests       360 passed (360)
```

**No test files were modified.** Only `package.json` dependency versions and lock files were updated.

---

## Compliance Notes

- **All 12 resolved vulnerabilities were in `devDependencies`** — they affect build tooling, linting, and development server only. No production runtime risk to end users.
- **`eslint@8.57.1`** remains pinned (exact version) as it is itself deprecated but still functional. The transitive vulnerabilities within its sub-tree (`ajv`, `minimatch`) are fully resolved via the `overrides` blocks.
- **Vite 6.x** is used exclusively in `modules/mat/frontend`. The `apps/isms-portal/` and `apps/maturion-maturity-legacy/` directories retain their existing Vite 5.x configuration — no cross-contamination.
- **`vite.config.ts` and `vitest.config.ts`** required no changes — the configuration API is backward-compatible between Vite 5/6 and Vitest 1/3 for the patterns used in this project.

---

## Files Modified

| File | Change |
|---|---|
| `modules/mat/frontend/package.json` | Upgraded 5 devDependencies, added `overrides` block |
| `modules/mat/frontend/package-lock.json` | Regenerated (new transitive resolved versions) |
| `package.json` (root) | Upgraded root `vitest` devDep, added `overrides` + `pnpm.overrides` |
| `package-lock.json` (root) | Regenerated |
| `pnpm-lock.yaml` | Regenerated via `pnpm install --no-frozen-lockfile` |
| `SECURITY_FIX_RUNBOOK.md` | Created (this file) |

---

## Version Summary

| Tool / Library | Version Before | Version After |
|---|---|---|
| `vite` (mat/frontend) | 5.4.21 | 6.4.1 |
| `vitest` (mat/frontend) | 1.6.1 | 3.2.4 |
| `vitest` (root) | 1.6.1 | 3.2.4 |
| `@typescript-eslint/eslint-plugin` | 6.x | 7.18.0 |
| `@typescript-eslint/parser` | 6.x | 7.18.0 |
| `@vitejs/plugin-react` | 4.2.1 | 4.7.0 |
| `rollup` (resolved transitive) | 4.57.1 | 4.59.0 |
| `esbuild` (resolved transitive) | 0.21.5 | 0.25.12 |
| `ajv` (resolved transitive) | 6.12.6 | 6.14.0 |
| `minimatch` 3.x (resolved transitive) | 3.1.2 | 3.1.5 |
| `minimatch` 9.x (resolved transitive) | 9.0.3–9.0.5 | 9.0.9 |
