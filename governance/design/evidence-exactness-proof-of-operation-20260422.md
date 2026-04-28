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
| ISSUE-MISMATCH | Check 6 | `❌ ISSUE-MISMATCH: declared issue 'maturion-isms#1400' in SCOPE_DECLARATION.md does not match expected 'maturion-isms#1486'` |

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

### ISSUE-MISMATCH (Check 6)
**Trigger (stale reference)**: `SCOPE_DECLARATION.md` has `**Issue**: maturion-isms#1400` but `EXPECTED_ISSUE=1486` (or `maturion-isms#1486`) is supplied.
**Expected output**:
```
── CHECK 6: ISSUE-MISMATCH ──
   ❌ ISSUE-MISMATCH: declared issue 'maturion-isms#1400' in SCOPE_DECLARATION.md does not match expected 'maturion-isms#1486'
      Remediation: Update the **Issue**: line in SCOPE_DECLARATION.md to '**Issue**: maturion-isms#1486'.
```
**Exit code**: 1

**Trigger (missing issue line)**: `SCOPE_DECLARATION.md` has no `**Issue**:` line.
**Expected output**:
```
── CHECK 6: ISSUE-MISMATCH ──
   ❌ ISSUE-MISMATCH: No **Issue**: line found in SCOPE_DECLARATION.md
      Remediation: Add '**Issue**: maturion-isms#NNNN' to SCOPE_DECLARATION.md pointing to the current governing issue.
```
**Exit code**: 1

**Trigger (malformed)**: `SCOPE_DECLARATION.md` has `**Issue**: issue-1486` (no repo prefix, no hash).
**Expected output**:
```
── CHECK 6: ISSUE-MISMATCH ──
   ❌ ISSUE-MISMATCH: Malformed issue reference 'issue-1486' in SCOPE_DECLARATION.md
      Expected format: maturion-isms#NNNN
      Remediation: Fix the **Issue**: line to use the format 'maturion-isms#NNNN'.
```
**Exit code**: 1

**Trigger (no EXPECTED_ISSUE set — format-only pass)**: `SCOPE_DECLARATION.md` has `**Issue**: maturion-isms#1486` and no `EXPECTED_ISSUE` env var is set.
**Expected output**:
```
── CHECK 6: ISSUE-MISMATCH ──
   ✅ PASS (format-only) — Issue reference 'maturion-isms#1486' is well-formed.
      ℹ️  No EXPECTED_ISSUE supplied; authority comparison skipped.
      To enable full authority check: export EXPECTED_ISSUE=<issue-number-or-repo#NNN>
```
**Exit code**: 0

**Authority-source model**: `EXPECTED_ISSUE` env var (bare number or `repo#NNN`) takes priority. In CI, it is derived from a `Governing-Issue:` control field in the PR body. When absent, the check is format-only (warns but does not hard-fail).

---

## CI Gate

The script is invoked automatically as CI job `preflight/evidence-exactness` in `.github/workflows/preflight-evidence-gate.yml` on every PR. The job runs in parallel with existing preflight checks and does not depend on them.
