# PREHANDOVER_PROOF Template

**Version**: 3.4  
**Authority**: MERGE_GATE_PHILOSOPHY.md v2.0, OPOJD v2.0  
**Purpose**: Evidence-based validation for complete job handover  
**Agent**: [Agent Name]  
**Task**: [Task Description]  
**Date**: [YYYY-MM-DD]

---

## Executive Summary

**Status**: ✅ COMPLETE | ⚠️ PARTIAL | ❌ BLOCKED  
**Evidence Type**: Pre-Handover Gate Validation  
**Compliance**: OPOJD v2.0 Complete Handover Doctrine  

**All Required Gates**: [✅ PASSED | ❌ FAILED]

---

## Pre-Gate Validation Evidence

Per MERGE_GATE_PHILOSOPHY.md v2.0, all applicable merge gates MUST be validated locally before PR handover.

### Gate 1: Scope-to-Diff Validation (BL-027)

**Status**: ✅ PASS | ❌ FAIL  
**Applicability**: All PRs with code or governance changes  
**Authority**: MERGE_GATE_PHILOSOPHY.md, SCOPE_TO_DIFF_RULE.md

**Command Executed**:
```bash
.github/scripts/validate-scope-to-diff.sh
```

**Exit Code**: 0

**Output**:
```
[Paste actual command output here]
```

**Timestamp**: [YYYY-MM-DD HH:MM:SS UTC]

---

### Gate 2: YAML Syntax Validation (BL-028)

**Status**: ✅ PASS | ❌ FAIL  
**Applicability**: All PRs modifying .yml or .yaml files  
**Authority**: MERGE_GATE_PHILOSOPHY.md (BL-028)

**Command Executed**:
```bash
.github/scripts/validate-yaml.sh
```

**Exit Code**: 0

**Output**:
```
[Paste actual command output here]
```

**Timestamp**: [YYYY-MM-DD HH:MM:SS UTC]

---

### Gate 3: Build Success (100% GREEN)

**Status**: ✅ PASS | ❌ FAIL  
**Applicability**: All code PRs  
**Authority**: BUILD_PHILOSOPHY.md, OPOJD v2.0

**Command Executed**:
```bash
pnpm build
```

**Exit Code**: 0

**Output**:
```
[Paste actual command output here]
```

**Timestamp**: [YYYY-MM-DD HH:MM:SS UTC]

---

### Gate 4: Test Execution (100% GREEN)

**Status**: ✅ PASS | ❌ FAIL  
**Applicability**: All code PRs  
**Authority**: BUILD_PHILOSOPHY.md, OPOJD v2.0

**Command Executed**:
```bash
pnpm test
```

**Exit Code**: 0

**Output**:
```
[Paste actual test results here]
Test Summary:
  Total: X
  Passed: X
  Failed: 0
  Skipped: 0
```

**Timestamp**: [YYYY-MM-DD HH:MM:SS UTC]

---

### Gate 5: Governance Artifact Integrity

**Status**: ✅ PASS | ❌ FAIL | N/A  
**Applicability**: All governance PRs  
**Authority**: AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md

**Command Executed**:
```bash
# Validate JSON syntax
jq empty governance/**/*.json

# Check inventory
cat governance/CANON_INVENTORY.json
```

**Exit Code**: 0

**Output**:
```
[Paste validation results here]
```

**Timestamp**: [YYYY-MM-DD HH:MM:SS UTC]

---

### Gate 6: Deployment Gate Confirmation (MANDATORY — Issue #622)

**Status**: ✅ PASS | ❌ FAIL | N/A (no deployment-triggering changes)
**Applicability**: All PRs that modify `modules/mat/frontend/**`, `vercel.json`, or `.github/workflows/deploy-mat-vercel.yml`. Required for any wave whose PR triggers the `deploy-mat-vercel.yml` workflow.
**Authority**: Issue #622 — CS2 (@APGI-cmy), 2026-02-26

> **BLOCKING RULE (Issue #622)**: A wave is NOT ready for production merge if the deployment
> gate has not passed or has not been explicitly confirmed N/A with documented justification.
> Force-merging without a confirmed deployment gate is a governance violation.

**CI Workflow**: `.github/workflows/deploy-mat-vercel.yml`

**Deployment Gate Status**:
- [ ] Deployment gate: NOT TRIGGERED (governance/docs-only PR — no `modules/mat/frontend/**`, `vercel.json`, or `.github/workflows/deploy-mat-vercel.yml` changes)
- [ ] Deployment gate: TRIGGERED AND PASSED (confirm CI run link below)
- [ ] Deployment gate: TRIGGERED AND FAILED — **DO NOT MERGE** — return to builder for fix

**CI Run Reference**: [Link to GitHub Actions run or "N/A — gate not triggered"]

**Exit Code / Status**: [0 = PASS | non-zero = FAIL | N/A]

**Timestamp**: [YYYY-MM-DD HH:MM:SS UTC]

**Justification (if N/A)**:
```
[If N/A — state explicitly why deployment gate was not triggered, e.g.:
"This PR modifies only governance/templates/ and .agent-workspace/ paths.
No deployment-triggering files changed. Deployment gate: NOT TRIGGERED — N/A."]
```

---

## Deployment Surface Enumeration (MANDATORY for deployment-workflow PRs — Rule D-002)

> **Authority**: `governance/canon/DEPLOYMENT_WORKFLOW_QA_HARDENING.md` v1.0.0, Rule D-002.
> **Applicability**: Required for all PRs modifying `.github/workflows/deploy-*.yml` or
> `.github/scripts/` files invoked from a deployment workflow. For governance-only PRs that
> do not touch deployment workflows or scripts, mark each row N/A with justification.

| Surface | Surface Type | Evidence Type | Gate Status | CI Run / Notes |
|---------|-------------|--------------|------------|----------------|
| [surface name, e.g. "Supabase project (SUPABASE_PROJECT_REF)"] | `Supabase / Vercel / Secret / Other` | `STATIC_CODE / CI_TEST / CONFIG / LIVE_RUNTIME / LIVE_E2E` | `PASS / SKIP-JUSTIFIED / TRIGGERED-FAIL` | [CI run URL or "N/A — gate not triggered"] |

**Deployment gate triggered**: YES / NO  
**Deployment gate status**: PASS / FAIL / N/A — [justification if N/A]  
**`governance/checklists/deployment-workflow-qa-checklist.md` completed**: YES / N/A — [justification if N/A]

> If this PR does NOT touch any deployment workflow or deployment helper script, state:
> `No deployment surfaces touched — N/A. This PR modifies only [list paths]. No deploy-*.yml or
> .github/scripts/ changes. Deployment Surface Enumeration: NOT APPLICABLE.`

---

## Stop-and-Fix Compliance

**Preexisting Issues Encountered**: [YES | NO]

### Discovered Issues

[If YES, document all preexisting issues discovered and fixed]

**Issue 1**: [Description]
- **Location**: [File/line]
- **Type**: [Test failure | Warning | Deprecation | Other]
- **Fix**: [What was done]
- **Verification**: [Command + exit code to verify fix]

**Issue 2**: [Description]
- **Location**: [File/line]
- **Type**: [Test failure | Warning | Deprecation | Other]
- **Fix**: [What was done]
- **Verification**: [Command + exit code to verify fix]

[Add more issues as needed]

**Stop-and-Fix Summary**: All preexisting issues in working area fixed. Zero test debt remaining.

---

## Wave Completeness Gate (MANDATORY — added per Wave 3 incomplete delivery incident 2026-02-24)

> **Authority**: AAWP v0.1.0, Wave 3 incomplete delivery RCA 2026-02-24.
> This gate is non-negotiable. A blank or unchecked row is a handover BLOCKER.

- [ ] AAWP deliverable table for this wave reviewed line-by-line
- [ ] Every deliverable file confirmed PRESENT in the PR diff
- [ ] Any absent file is explicitly accounted for (future wave, confirmed stub, or CS2 waiver)
- [ ] QA-to-Red confirmation recorded as PR comment BEFORE implementation began

---

## Implementation Completeness

**Original Requirements**: [List requirements from issue/task]

**Completeness Checklist**:
- [ ] All requirements implemented (100%)
- [ ] All edge cases handled
- [ ] All error paths implemented
- [ ] No TODOs or stub code
- [ ] No placeholder logic

**Completeness Status**: ✅ 100% COMPLETE | ⚠️ PARTIAL | ❌ BLOCKED

---

## Acceptance-Criteria Matrix (Producer-Side)

> **MANDATORY — HANDOVER BLOCKER**: The producing agent MUST map every governing-issue acceptance criterion to the evidence delivered in this PR. This matrix is what the IAA will independently verify — if any criterion lacks a hard evidence reference, IAA will issue a REJECTION-PACKAGE per ACR-22.
>
> Evidence must be a hard artifact: file path with diff reference, CI run URL, command output log, hash, schema query result, runtime response, or health check. Agent statements like "tests pass" or "workflow reviewed" are claims, not evidence — they may point to evidence but are not evidence themselves.
>
> If a criterion requires runtime evidence (CI_TEST, LIVE_RUNTIME, LIVE_E2E) that is not yet available, mark the row `BLOCKED_PENDING_RUNTIME_EVIDENCE` and do not submit this proof for IAA until the evidence is present — or obtain an explicit CS2 waiver artifact.

| # | Acceptance Criterion (from governing issue) | Required Evidence Type | Evidence Reference | Status |
|---|---|---|---|---|
| 1 | [paste criterion from issue verbatim] | [STATIC_CODE / CONFIG / ARTIFACT / CI_TEST / LIVE_RUNTIME / LIVE_E2E] | [file path, CI run URL, log, hash — NOT a claim] | [SATISFIED / BLOCKED_PENDING_RUNTIME_EVIDENCE / WAIVED — waiver ref] |

**Acceptance-Criteria Matrix completeness**: [ALL_SATISFIED / INCOMPLETE — list unmet criteria / PARTIALLY_WAIVED — list waived criteria with waiver refs]

---

## Ripple/Cross-Agent Assessment

> **HFMC-01 MANDATORY — HANDOVER BLOCKER**: Every PREHANDOVER proof MUST contain this
> section, filled with concrete downstream-impact conclusions. A blank or absent section
> is a **producer-side defect** caught by AAP-20 at the ECAP/Foreman QP gate and by
> ACR-14 at the IAA assurance layer. Do NOT leave placeholder rows — name each agent or
> system actually assessed and state the impact conclusion.
>
> If this wave contains no code, schema, API contract, or agent-contract changes that
> could affect downstream consumers, state that explicitly: do NOT leave the table blank.

| Agent / System | Change Scope Assessed | Impact Conclusion |
|---------------|----------------------|-------------------|
| [agent-name or system] | [what was assessed — files, contracts, schema, API] | **[NO IMPACT — reason / IMPACTED — describe downstream effect]** |

**Downstream ripple conclusion**: [NO IMPACT — governance/ceremony artifacts only, no downstream effect / IMPACTED — list affected agents/systems and actions taken or deferred with reference]

---

## Coordination & Escalation

**Coordination Required**: [YES | NO]

[If YES, document all coordination events]

**Coordination Event 1**: [Description]
- **With**: [Agent/Human name]
- **Reason**: [Why coordination needed]
- **Outcome**: [Result of coordination]
- **Evidence**: [Link to coordination artifact]

**Escalation Required**: [YES | NO]

[If YES, document all escalations]

**Escalation 1**: [Description]
- **To**: [CS2 / Foreman / Other]
- **Reason**: [Why escalated]
- **Status**: [RESOLVED | PENDING | BLOCKED]
- **Evidence**: [Link to escalation document]

---

## Improvement Capture

Per OPOJD v2.0, all jobs MUST generate improvement suggestions.

### Process Improvements
- [Specific process improvement with rationale]

### Tool Gaps
- [Tools that would have helped] or N/A

### Governance Gaps
- [Governance ambiguities encountered] or N/A

### Knowledge Gaps
- [Missing documentation or training] or N/A

### Quality Improvements
- [Systemic quality issues identified] or N/A

---

## Evidence Artifacts

**Generated Artifacts**:
- [ ] SCOPE_DECLARATION.md (if applicable)
- [ ] Test reports (100% GREEN, zero test debt)
- [ ] Build logs (success)
- [ ] Coverage reports
- [ ] Security scan results
- [ ] Quality metrics (per TRS standards)
- [ ] This PREHANDOVER_PROOF
- [ ] This PREHANDOVER_PROOF

**Artifact Locations**: [List paths to all evidence artifacts]

---

## Handover Certification

**Agent Certification**: I certify that:
1. ✅ All applicable merge gates validated locally with exit code 0
2. ✅ All preexisting issues in working area fixed (Stop-and-Fix compliance)
3. ✅ All original requirements implemented completely
4. ✅ All tests pass (100% GREEN, zero test debt)
5. ✅ Build validation: Success
6. ✅ All TRS quality standards met
7. ✅ All coordination and escalation properly handled
8. ✅ All evidence collected and documented
9. ✅ All improvements captured
10. ✅ Work is production-ready and merge-ready
11. ✅ No ignorance excuses - all requirements understood and satisfied
12. ✅ Deployment gate confirmed (PASS or N/A with documented justification) — Issue #622 mandatory check
13. ✅ `## Ripple/Cross-Agent Assessment` section present and populated with concrete downstream-impact conclusions — HFMC-01 mandatory check
14. ✅ Active final-state bundle token/session coherence confirmed — all active artifacts (`iaa_audit_token` in this proof, `iaa_session_reference` in session memory, wave record `## TOKEN` section, `wave-current-tasks.md`) reference the same IAA session/token — AAP-22 / ACR-16 / §4.3e Check L mandatory check
15. ✅ `## Acceptance-Criteria Matrix (Producer-Side)` section present and all governing-issue acceptance criteria mapped to hard evidence references — ACR-22 / §Evidence-First Assurance Mandate Rule 1 mandatory check

**Handover Status**: ✅ COMPLETE - Ready for merge

**Agent**: [Agent Name]  
**Session**: [Session ID]  
**Timestamp**: [YYYY-MM-DD HH:MM:SS UTC]

---

**Authority**: MERGE_GATE_PHILOSOPHY.md v2.0, OPOJD v2.0, AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md  
**Evidence Type**: Pre-Handover Gate Validation  
**Compliance**: Living Agent System v6.x.0  
**Amendment**: v3.4 (2026-04-28) — Added mandatory `## Acceptance-Criteria Matrix (Producer-Side)` section (ACR-22 / §Evidence-First Assurance Mandate Rule 1 / INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.13.0 / maturion-isms#1492). Required for all T1 and T2 PRs; maps every governing-issue acceptance criterion to hard evidence. Absence of this section is a producer-side defect blocked at Foreman QP and IAA final audit. Added certification item 15.  
**Amendment**: v3.3 (2026-04-27) — Added mandatory `## Deployment Surface Enumeration` section (Rule D-002 / `governance/canon/DEPLOYMENT_WORKFLOW_QA_HARDENING.md` v1.0.0 / maturion-isms#1479). Required for all deployment-workflow PRs; N/A with justification for governance-only PRs. Absence of this section in a deployment-workflow PREHANDOVER proof is a producer-side defect blocked at Foreman QP and IAA final audit.  
**Amendment**: v3.2 (2026-04-20) — Added certification item 14: Active final-state bundle token/session coherence confirmation (AAP-22 / ACR-16 / §4.3e Check L — maturion-isms#1422); confirms all active artifacts reference same IAA session/token before handover.  
**Amendment**: v3.1 (2026-04-19) — Added mandatory `## Ripple/Cross-Agent Assessment` section (HFMC-01 / AAP-20 / ACR-14) — no PREHANDOVER proof is complete without this section; absence is a producer-side defect blocked at ECAP/Foreman QP gate and IAA layer.
