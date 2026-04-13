# IAA REJECTION-PACKAGE — Session 135 — Wave audit-field-sync — 2026-03-04

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/sync-frontend-backend-audit-fields (wave audit-field-sync — MAT Audit Field Sync)
Session: session-135
Invocation number: 3 (third IAA assurance invocation on this branch)
HEAD reviewed: f82df47
1 check FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:
  BL-027 / A-026: validate-scope-to-diff.sh exits code 1
    Finding: SCOPE_DECLARATION.md uses em-dash (—) separators in file declarations
             instead of the required hyphen (-) format. The parser regex
             `^\s*-\s+\`[^\`]+\`\s+-\s+` does not match em-dash, causing
             0 files to be parsed from SCOPE_DECLARATION.md. With 25 changed
             files in the diff and 0 declared, the exact set comparison fails.
             Additionally, even with format corrected, 15 files present in
             git diff are not declared in SCOPE_DECLARATION.md (full list below).
    Fix required:
      1. Update ALL file entry separators in SCOPE_DECLARATION.md from:
            - `path/to/file.ext` — Description
         to:
            - `path/to/file.ext` - Description
         (replace em-dash — with hyphen -)
      2. Declare ALL 25 files from `git diff --name-only origin/main...HEAD`:
            .agent-admin/assurance/iaa-prebrief-wave-audit-field-sync.md
            .agent-admin/assurance/rejection-package-session-133-wave-audit-field-sync-20260304.md
            .agent-admin/assurance/rejection-package-session-134-wave-audit-field-sync-20260304.md
            .agent-admin/prehandover/CORRECTION_ADDENDUM_TASK_AFS_001.md
            .agent-admin/prehandover/PREHANDOVER_PROOF_TASK_AFS_001.md
            .agent-admin/prehandover/PREHANDOVER_PROOF_TASK_AFS_002.md
            .agent-workspace/foreman-v2/memory/PREHANDOVER-session-099-wave-audit-field-sync-20260304.md
            .agent-workspace/foreman-v2/personal/wave-current-tasks.md
            .agent-workspace/independent-assurance-agent/memory/.archive/LEGACY_BOUNDARY.md
            .agent-workspace/independent-assurance-agent/memory/.archive/breach-registry.md
            .agent-workspace/independent-assurance-agent/memory/.archive/session-097-20260304.md
            .agent-workspace/independent-assurance-agent/memory/.archive/session-098-20260304.md
            .agent-workspace/independent-assurance-agent/memory/.archive/session-098b-20260304.md
            .agent-workspace/independent-assurance-agent/memory/.archive/session-099-20260304.md
            .agent-workspace/independent-assurance-agent/memory/.archive/session-100-20260304.md
            .agent-workspace/independent-assurance-agent/memory/.archive/session-124-20260304.md
            .agent-workspace/independent-assurance-agent/memory/.archive/session-125-20260304.md
            .agent-workspace/independent-assurance-agent/memory/.archive/session-126-20260304.md
            .agent-workspace/independent-assurance-agent/memory/session-133-20260304.md
            .agent-workspace/independent-assurance-agent/memory/session-134-20260304.md
            .agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md
            SCOPE_DECLARATION.md
            modules/mat/frontend/src/components/audits/AuditList.tsx
            modules/mat/frontend/src/lib/hooks/useAudits.ts
            modules/mat/tests/audit-field-sync/audit-field-sync.test.ts
         Note: session-135 IAA session memory will be committed in the same fix
         commit. Add it to the declaration as well.
         Note: the IAA rejection-package-session-135 artifact will also be committed
         in the same fix commit. Add it to the declaration.
         Total declared must match total in diff exactly (script enforces exact set).
      3. Commit SCOPE_DECLARATION.md to branch before re-invoking IAA (A-021).
      4. Run .github/scripts/validate-scope-to-diff.sh locally and confirm exit code 0.

This PR must not be opened until the single failure is resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════
```

---

## Context for Invoking Agent

### What PASSED this session (for clarity — all prior findings resolved)

All substantive build checks PASS:
- `useAudits.ts`: correct interface (all 4 fields), correct mutation (no `description` workaround, all 4 fields written to correct columns) ✅
- `AuditList.tsx`: `organisation_name` rendered below `audit.title` ✅
- Tests: 5/5 PASS (T-AFS-COL-001–005) — RED gate T-AFS-COL-005 is GREEN ✅
- Wave-14 regressions: 6/6 PASS ✅
- PREHANDOVER proofs: AFS-001 (original + CORRECTION_ADDENDUM per A-030) + AFS-002 + Foreman — all correct ✅
- iaa_audit_token in all proofs: valid reference format ✅
- CORRECTION_ADDENDUM (A-030 path): correctly addresses session-133 FAILURE-2 ✅
- IAA session memory (session-133, session-134) committed on branch ✅
- A-021 compliance: artifacts committed before this invocation ✅
- CORE-015 through CORE-019: all PASS (First Invocation Exception for token file) ✅

### What FAILED: BL-027 only

The ONLY remaining blocker is the SCOPE_DECLARATION.md format issue (em-dash vs hyphen)
and the missing 15 file declarations. The substantive build is complete and correct.

### Minimal fix for next re-invocation

1. Rewrite SCOPE_DECLARATION.md with correct format (all entries as `- \`path\` - Description`)
2. Declare ALL files from the diff (25 current + this rejection package + session-135 memory = 27 total by the time of re-invocation)
3. Run `validate-scope-to-diff.sh` locally → must exit 0
4. Commit and push (A-021 — commit BEFORE invocation)
5. Re-invoke IAA

The SCOPE_DECLARATION.md fix does NOT require amending any PREHANDOVER proof (A-029 immutability applies). SCOPE_DECLARATION.md itself is not a PREHANDOVER proof — it can be updated.

---

*IAA: independent-assurance-agent v6.2.0*
*Session: session-135*
*Date: 2026-03-04*
*Authority: CS2 ONLY (@APGI-cmy)*
