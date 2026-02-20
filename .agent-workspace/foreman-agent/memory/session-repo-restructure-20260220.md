# Session: Repo Restructure — Move MAT Frontend - 2026-02-20 (LIVING_AGENT_SYSTEM v6.2.0)

## Agent
- Type: foreman-agent
- Class: foreman
- Session ID: session-repo-restructure-20260220

## Task
Move `apps/mat-frontend/` to `modules/mat/frontend/` and update all build paths, CI workflows,
gitignore, workspace config, and governance documentation to reflect the new canonical structure.

## POLC Evidence

### Planning
- Architecture review: Identified all files referencing `apps/mat-frontend` across the codebase
- Canonical module structure defined: `modules/<module>/frontend/` for code, `modules/<module>/` for specs/docs
- Acceptance criteria: all tests pass, CI references updated, vercel.json correct, docs updated

### Organizing
- Scope: vercel.json, deploy-mat-vercel.yml, pnpm-workspace.yaml, .gitignore, test file, BUILD_PROGRESS_TRACKER.md, session memory
- No builders required — this is a structural refactor with no production logic changes

### Leading
- Single-agent execution (file move + config update)
- All 71 frontend tests verified passing after move

### Checking
- Tests executed: 71/71 PASS (npm run test in modules/mat/frontend)
- Physical verification: confirmed `ls modules/mat/frontend/` shows all files correctly moved
- Verified no remaining `apps/mat-frontend` references in functional files

## Files Modified

| File | Change |
|------|--------|
| `apps/mat-frontend/` (entire dir) | Moved to `modules/mat/frontend/` via `git mv` |
| `vercel.json` | Updated buildCommand, outputDirectory, devCommand paths |
| `.github/workflows/deploy-mat-vercel.yml` | Updated path triggers (push/PR), 4 working-directory entries, artifact path |
| `pnpm-workspace.yaml` | Added `modules/mat/frontend` entry |
| `.gitignore` | Added explicit `modules/mat/frontend/.env` and `.env.local` entries |
| `modules/mat/frontend/tests/frontend-scaffolding.test.ts` | Fixed workspace path (../../ → ../../../) and pattern match |
| `modules/mat/BUILD_PROGRESS_TRACKER.md` | Added learning entry for directory restructure |

## Decisions Made

1. **Use `git mv`**: Preserves git history for all moved files
2. **Keep `apps/*` in pnpm-workspace.yaml**: Other apps (isms-portal, maturion-maturity-legacy) still live under `apps/`
3. **Add explicit gitignore entries**: Root `.gitignore` already has global `.env`/`.env*.local` patterns but issue explicitly requested entries for the new path
4. **Update test workspace check**: MAT-FE-T-002 path was `../../pnpm-workspace.yaml` from `apps/mat-frontend`; from `modules/mat/frontend` it must be `../../../`; also updated match pattern from `apps/*` to `modules/mat/frontend`
5. **Historical .md files not updated**: Agent memory, evidence, and certification files are historical records — updating them would be misleading

## Design Flaw Documented

**Flaw**: Frontend code at `apps/mat-frontend/` while all specs/docs/architecture were at `modules/mat/`. This created two sources of truth, inconsistent CI paths, and ambiguous builder instructions.

**Fix**: Canonical module structure is now `modules/<module>/frontend/` for frontend code. All future module frontends MUST follow this pattern.

**Future Builder Instructions**:
- MAT frontend build root: `modules/mat/frontend/`
- Build output: `modules/mat/frontend/dist/`
- Tests: `cd modules/mat/frontend && npm run test`
- Do NOT put frontend code under `apps/` for module-scoped applications

## Outcome
✅ COMPLETE

## Lessons

### What Worked Well
- `git mv` cleanly moved all files including hidden ones (.env.example, .eslintrc.cjs, etc.)
- Tests immediately verified the structural changes were consistent

### What Was Challenging
- Many historical .md files reference `apps/mat-frontend` — selective update required (only functional files updated)

### What Future Sessions Should Know
- Canonical MAT frontend path: `modules/mat/frontend/`
- When adding new modules, frontend code goes to `modules/<module>/frontend/`
- Always add new module frontend paths to `pnpm-workspace.yaml`

---
Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | Session: repo-restructure-20260220
