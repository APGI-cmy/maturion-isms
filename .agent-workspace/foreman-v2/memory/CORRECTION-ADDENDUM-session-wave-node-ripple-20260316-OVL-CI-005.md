# CORRECTION-ADDENDUM — Session wave-node-ripple | OVL-CI-005 S-033 Documentation | 2026-03-16

**Addendum to**: PREHANDOVER-session-wave-node-ripple-20260316.md
**Session**: session-wave-node-ripple-20260316
**Date**: 2026-03-16
**Finding addressed**: IAA REJECTION-PACKAGE R1 — FAILURE 3 (OVL-CI-005)
**A-031 carve-out**: PREHANDOVER is immutable post-commit — this addendum is a separate file per §4.3b

---

## OVL-CI-005 — S-033 Exception Documentation

### Modified Workflows

| Workflow | Modified Job | Job Trigger |
|----------|-------------|-------------|
| `deploy-mat-ai-gateway.yml` | `cwt` (line 221) | `push to refs/heads/main` OR `workflow_dispatch` |
| `liveness.yml` | `liveness` (line ~25) | `workflow_run` OR `workflow_dispatch` |

### S-033 Inherent Limitation Exception — INVOKED

**Reason**: Both modified job `if:` conditions require `push to main` or `workflow_run` — neither fires on a PR branch. CI evidence for these specific jobs CANNOT be collected pre-merge.

**S-033 Substitute (1) — YAML tool output (yamllint)**

Command: `yamllint .github/workflows/deploy-mat-ai-gateway.yml .github/workflows/liveness.yml`

Result for `deploy-mat-ai-gateway.yml`:
```
1:1 [document-start] missing document start "---"   (warning — pre-existing, whole-file style)
3:1 [truthy] truthy value should be one of [false, true]   (warning — pre-existing)
32:81 [line-length] line too long (107 > 80 characters)   (error — pre-existing, unrelated lines)
69:81 [line-length] line too long (97 > 80 characters)   (error — pre-existing)
... [additional pre-existing line-length errors at lines 73,74,90,99,102,125,128,130,146,179,183,184,190,205,221]
```

Result for `liveness.yml`:
```
1:1 [document-start] missing document start "---"   (warning — pre-existing, whole-file style)
5:81 [line-length] line too long (89 > 80 characters)   (error — pre-existing)
7:1 [truthy] truthy value should be one of [false, true]   (warning — pre-existing)
56:81 [line-length] line too long (103 > 80 characters)   (error — pre-existing)
57:81 [line-length] line too long (96 > 80 characters)   (error — pre-existing)
60:81 [line-length] line too long (97 > 80 characters)   (error — pre-existing)
68:81 [line-length] line too long (103 > 80 characters)   (error — pre-existing)
69:81 [line-length] line too long (91 > 80 characters)   (error — pre-existing)
97:81 [line-length] line too long (111 > 80 characters)   (error — pre-existing)
```

**Assessment**: ALL yamllint findings are pre-existing (whole-file style warnings and line-length at existing code lines). The change at `deploy-mat-ai-gateway.yml:226` and `liveness.yml:44` introduced **zero new yamllint issues**. Both files parse as valid YAML. The yamllint exit code 1 is from pre-existing issues that affect the entire file, not from the 2 single-character string changes (`'20'` → `'22'`).

**S-033 Substitute (2) — Pattern parity vs. approved equivalent workflow**

Reference workflow: `deploy-mat-vercel.yml` — already approved and merged to main; uses `node-version: ${{ env.NODE_VERSION }}` where `NODE_VERSION: '22'`.

| Attribute | `deploy-mat-ai-gateway.yml:226` | `liveness.yml:44` | `deploy-mat-vercel.yml` (approved) |
|-----------|--------------------------------|-------------------|-------------------------------------|
| Action | `actions/setup-node@v4` | `actions/setup-node@v4` | `actions/setup-node@v4` |
| Node version | `'22'` (literal) | `'22'` (literal) | `${{ env.NODE_VERSION }}` (= 22) |
| Effective version | Node.js 22 LTS | Node.js 22 LTS | Node.js 22 LTS |
| Pattern parity | ✅ EQUIVALENT | ✅ EQUIVALENT | ✅ Reference |

Structural equivalence: CONFIRMED. All three workflows use `actions/setup-node@v4` with Node.js 22 LTS. The literal string `'22'` vs. env var `${{ env.NODE_VERSION }}` resolves to the same runtime version.

**S-033 Substitute (3) — workflow_dispatch retained**

Both modified workflows retain `workflow_dispatch:` triggers, allowing manual CI validation post-merge without requiring a push to main:

| Workflow | `workflow_dispatch` line | Status |
|----------|------------------------|--------|
| `deploy-mat-ai-gateway.yml` | line 16 | ✅ PRESENT |
| `liveness.yml` | line 12 | ✅ PRESENT |

### S-033 Conclusion

All 3 required substitutes are now documented:
| Substitute | Status |
|------------|--------|
| (1) yamllint tool output included | ✅ COMPLETE — output above |
| (2) Pattern parity vs. approved equivalent | ✅ COMPLETE — matches deploy-mat-vercel.yml standard |
| (3) workflow_dispatch retained on both modified workflows | ✅ COMPLETE — lines 16 and 12 |

**OVL-CI-005 S-033 Exception: RESOLVED**

---

## CORRECTION-ADDENDUM AUTHORITY

This addendum is issued by foreman-v2-agent per IAA REJECTION-PACKAGE R1 FAILURE 3 instruction.
Token reference: IAA-session-wave-node-ripple-20260316-PENDING (pending R2 re-invocation).
