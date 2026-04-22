# Governance Evidence Exactness — Proof of Operation

**Wave**: gov-evidence-exactness-hardening-20260422
**Date**: 2026-04-22
**Script**: `.github/scripts/validate-governance-evidence-exactness.sh`
**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0, MERGE_GATE_PHILOSOPHY.md
**Issue**: maturion-isms#1413
**PR**: maturion-isms#1441

---

## PASS Case — Current Branch (Clean State)

**Command**: `bash .github/scripts/validate-governance-evidence-exactness.sh`

**Exit code**: 0

**Actual output** (branch `copilot/fix-253484265-1108482416-462c8484-4b9b-4f62-be55-ad07e0ee4136`, pre-commit):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Governance Evidence Exactness Gate
  Authority: LIVING_AGENT_SYSTEM.md v6.2.0, MERGE_GATE_PHILOSOPHY.md
  Branch: copilot/fix-253484265-1108482416-462c8484-4b9b-4f62-be55-ad07e0ee4136
  Diff base: origin/main...HEAD
  Changed files in diff: 0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

── CHECK 1: PATH-MISMATCH ──
   Source: SCOPE_DECLARATION.md
   ✅ PASS — All cited paths verified

── CHECK 2: COUNT-MISMATCH ──
   ℹ️  N/A — No files_changed field found. Skipping.

── CHECK 3: HASH-INCOMPLETE ──
   ℹ️  N/A — No hash verification claims found. Skipping.

── CHECK 4: VERSION-MISMATCH (cross-artifact: canon file header vs CANON_INVENTORY) ──
   ℹ️  N/A — No governance/ .md files changed in this diff. Skipping.

── CHECK 5: VERSION-MISMATCH (internal: conflicting versions within a single canon file) ──
   ℹ️  N/A — No added/modified governance/canon/ files in this diff.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ GOVERNANCE EVIDENCE EXACTNESS GATE: PASS
  0 errors, 0 warning(s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Defect Class Coverage Map

| Defect Class (Issue #1413) | Script Check | Detection Example |
|---|---|---|
| VERSION-MISMATCH (cross-artifact) | Check 4 | `❌ VERSION-MISMATCH: governance/canon/FILE.md declares Version: 1.0.0 but CANON_INVENTORY records 2.0.0` |
| VERSION-MISMATCH (internal) | Check 5 (warning) | `⚠️  VERSION-MISMATCH (internal, warning): governance/canon/FILE.md declares multiple version strings: 1.0.0 2.0.0` |
| PATH-MISMATCH | Check 1 | `❌ PATH-MISMATCH: 'path/to/file.md' cited in SCOPE_DECLARATION.md but not found in repo tree, diff, or working directory` |
| COUNT-MISMATCH | Check 2 | `❌ COUNT-MISMATCH: declared files_changed=15 in SCOPE_DECLARATION.md but actual git diff shows 12 files` |
| HASH-INCOMPLETE | Check 3 | `❌ HASH-INCOMPLETE: hash verification claimed in .agent-admin/prehandover/proof-1441.md but 3 CANON_INVENTORY entries have null/empty hashes` |
| AUTHORITY-STALE | Check 4 | Covered — every canon artifact version is tracked in CANON_INVENTORY; stale version citations in governance files are caught when the file is in the PR diff |

---

## Detection Examples

### PATH-MISMATCH (Check 1)
**Trigger**: SCOPE_DECLARATION.md contains a backtick-quoted path that does not exist in repo tree or PR diff.
**Expected output**:
```
── CHECK 1: PATH-MISMATCH ──
   Source: SCOPE_DECLARATION.md
   ❌ PATH-MISMATCH: 'governance/canon/OLD_LOCATION.md' cited in SCOPE_DECLARATION.md but not found in repo tree, diff, or working directory
```
**Exit code**: 1

### COUNT-MISMATCH (Check 2)
**Trigger**: A new `SCOPE_DECLARATION.md` or PREHANDOVER proof in the PR diff declares `files_changed: 15` but `git diff --name-only origin/main...HEAD | wc -l` shows 12.
**Expected output**:
```
── CHECK 2: COUNT-MISMATCH ──
   ❌ COUNT-MISMATCH: declared files_changed=15 in SCOPE_DECLARATION.md but actual git diff shows 12 files
```
**Exit code**: 1

### HASH-INCOMPLETE (Check 3)
**Trigger**: A PREHANDOVER proof contains "hash verification complete" but `governance/CANON_INVENTORY.json` has entries with null `file_hash_sha256`.
**Expected output**:
```
── CHECK 3: HASH-INCOMPLETE ──
   ❌ HASH-INCOMPLETE: hash verification claimed in .agent-admin/prehandover/proof-1441.md but 3 CANON_INVENTORY entries have null/empty hashes
```
**Exit code**: 1

### VERSION-MISMATCH cross-artifact (Check 4)
**Trigger**: Modified `governance/checklists/foo.md` has `Version: 1.0.0` in header but CANON_INVENTORY records `"version": "2.0.0"` for that path.
**Expected output**:
```
── CHECK 4: VERSION-MISMATCH (cross-artifact: canon file header vs CANON_INVENTORY) ──
   ❌ VERSION-MISMATCH: governance/checklists/foo.md declares Version: 1.0.0 but CANON_INVENTORY records 2.0.0
```
**Exit code**: 1

### VERSION-MISMATCH internal (Check 5 — warning)
**Trigger**: `governance/canon/BAR.md` is modified and contains both `Version: 1.0.0` and `Version: 1.1.0` in different sections.
**Expected output**:
```
── CHECK 5: VERSION-MISMATCH (internal: conflicting versions within a single canon file) ──
   ⚠️  VERSION-MISMATCH (internal, warning): governance/canon/BAR.md declares multiple version strings: 1.0.0 1.1.0
```
**Exit code**: 0 (warning only — does not block; allows amendment history sections to reference prior versions)

---

## CI Gate

The script is invoked automatically as CI job `preflight/evidence-exactness` in `.github/workflows/preflight-evidence-gate.yml` on every PR. The job runs in parallel with existing preflight checks and does not depend on them.
