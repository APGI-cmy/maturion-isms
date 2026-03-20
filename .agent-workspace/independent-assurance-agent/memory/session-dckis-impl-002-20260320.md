# IAA Session Memory — DCKIS-IMPL-002 Assurance

**Session ID**: session-dckis-impl-002-20260320
**Date**: 2026-03-20
**Agent**: independent-assurance-agent v6.2.0
**Adoption phase at verdict**: PHASE_B_BLOCKING

---

## Session Fields

| Field | Value |
|-------|-------|
| session_id | session-dckis-impl-002-20260320 |
| date | 2026-03-20 |
| pr_reviewed | DCKIS-IMPL-002 — MAT Frontend Components — Knowledge Ingestion Interface |
| branch | copilot/dckis-impl-002-frontend-components |
| invoking_agent | foreman-v2-agent |
| producing_agent | ui-builder |
| producing_agent_class | BUILDER |
| pr_category | AAWP_MAT / BUILD_DELIVERABLE |
| checks_executed | 44 |
| checks_passed | 30 |
| checks_failed | 8 |
| merge_gate_parity_result | FAIL (BL-027) |
| verdict | REJECTION-PACKAGE |
| token_reference | IAA-session-dckis-impl-002-20260320-REJECTION |
| adoption_phase_at_time_of_verdict | PHASE_B_BLOCKING |

---

## Prior Sessions Reviewed

- session-dckis-sch-001-20260320-R2.md
- session-dckis-gov-001-20260319.md
- session-dckis-qa-red-20260319.md
- session-wave20-atomic-write-back-20260318-R2.md
- session-dckis-cl5d2-20260319-R2.md

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 | YES | PASS — PREHANDOVER proof present, IAA invocation evidenced |
| A-002 | YES | PASS — No class exemption claimed |
| A-003 | YES | N/A — Category unambiguous (AAWP_MAT) |
| A-005 | YES | PASS — No .github/agents/ files in diff |
| A-021 | YES | PASS — Code committed before IAA invocation (4 commits ahead of origin) |
| A-026 | YES | FAIL — BL-027: SCOPE_DECLARATION.md stale (0 files declared, 12 in diff) |
| A-028 | YES | FAIL — SCOPE_DECLARATION.md contains prior wave content |
| A-029 | YES | FAIL — iaa_audit_token is "Pending IAA session execution" (OLD A-025 pattern); required: IAA-session-dckis-impl-002-20260320-PASS |
| A-032 | YES | PASS — All INSERT/SELECT columns verified against migration DDL (003, 006, 008) |
| A-033 | YES | PASS — git ls-files used for artifact verification (not disk -f check) |
| A-034 | YES | PASS — FUNCTIONAL-BEHAVIOUR-REGISTRY read; NBR-001 through NBR-005 checked |
| A-035 | YES | PASS — Niggle pattern library read; relevant patterns applied |

---

## Failures Cited

### FAILURE 1 — CORE-018 / A-029: iaa_audit_token non-compliant
- **Value**: "Pending IAA session execution" (OLD A-025 pattern)
- **Required**: `IAA-session-dckis-impl-002-20260320-PASS`
- **Fix**: Update PREHANDOVER proof with correction addendum commit (per A-030)

### FAILURE 2 — CORE-023: Edge Function path not in deployment workflow
- **Gap**: `packages/ai-centre/supabase/functions/` not in deploy-mat-edge-functions.yml `paths:`
- **Fix**: Add `packages/ai-centre/supabase/functions/**` to workflow paths filters

### FAILURE 3 — BL-027 MERGE GATE: SCOPE_DECLARATION.md stale
- **validate-scope-to-diff.sh exit code**: 1
- **Gap**: 12 changed files, 0 declared
- **Fix**: Update SCOPE_DECLARATION.md with all 12 files in correct format

### FAILURES 4+5+6+8 — BD-005/BD-003/BD-010/BD-022: process-document-v2 not wired
- **Core issue**: useKnowledgeDocuments does direct INSERT only; process-document-v2 never called
- **Impact**: Documents uploaded but never chunked or embedded; RAG pipeline non-functional
- **Fix**: Wire supabase.functions.invoke('process-document-v2', ...) into uploadWithRetry OR implement async trigger mechanism

### FAILURE 7 — BD-021: ApprovalStatus type mismatch
- **TypeScript type**: 'pending' | 'approved' | 'rejected'
- **DB CHECK**: ('pending', 'approved', 'retired')
- **Alignment plan spec**: 'rejected'
- **Fix**: Add migration 009 to update CHECK constraint to 'rejected'

---

## What Was GREEN (confirmed by IAA, not needing re-review)

- 12/12 T-KU-xxx tests — independently re-run by IAA
- ADR-005 Pipeline 1 isolation
- Auth guards (/knowledge inside ProtectedRoute + OnboardingGuard)
- WCAG 2.1 AA implementation
- RLS policies (SELECT + INSERT on ai_knowledge)
- No hardcoded secrets
- No XSS vectors (file content inserted as column value, not rendered as HTML)
- No TypeScript `any` usage
- NBR-001 cache invalidation (onSuccess → invalidateQueries['knowledge-documents'])
- NBR-002 RLS write error handling (checked, retried, surfaced to user)
- CANON_INVENTORY 191 entries all valid
- No .github/agents/ modifications

---

## Learning Notes

1. **Pipeline wiring gap pattern**: The most impactful finding was BD-005 — the Edge Function was delivered but never wired into the upload flow. The hook's "direct insert + separate edge function" design is only valid if there's an explicit trigger mechanism for the Edge Function. Future IAA reviews of multi-step pipelines should explicitly verify the trigger mechanism for each async step is documented and present in the diff, not just that the endpoint code exists.

2. **SCOPE_DECLARATION.md recurrence**: This is at least the third wave where SCOPE_DECLARATION.md was stale. The foreman-v2 agent must include SCOPE_DECLARATION.md update in the PREHANDOVER template as a mandatory pre-commit step. This should become a FAIL-ONLY-ONCE rule candidate (builder class — SCOPE_DECLARATION update is a wave ceremony artifact).

3. **Approval_status constraint drift**: The 'rejected'/'retired' mismatch was caused by migration 006 using a different value from the alignment plan spec. Future schema waves should include a cross-check between migration CHECK constraints and TypeScript types/alignment plan specs for enum-like columns.

4. **A-029 adoption**: Multiple builder waves are still using the OLD A-025 "Pending IAA session execution" pattern. The Foreman should add an explicit check in the PREHANDOVER template: "iaa_audit_token: IAA-session-[slug]-[date]-PASS" (expected reference format, not PENDING). Foreman PREHANDOVER template should make this mandatory.

---

## Suggestions for Improvement (MANDATORY — non-blank)

1. **SCOPE_DECLARATION.md automation**: The foreman-v2 PREHANDOVER template should auto-populate SCOPE_DECLARATION.md from `git diff --name-only origin/main...HEAD` as part of the pre-commit ceremony. The recurrence of BL-027 failures across waves suggests this step is being manually skipped. A scripted helper (`scripts/update-scope-declaration.sh`) would eliminate this class of merge gate failures.

2. **Edge Function wiring verification in pre-brief**: The IAA pre-brief should explicitly call out when a PR contains an Edge Function that must be invoked — and require the PREHANDOVER proof to show the invocation code (or explicit async trigger evidence) before IAA accepts the handover. The current pre-brief BD-005 check was declared but not enforced at the pre-brief gate.

3. **Process-document-v2 SCOPE_DECLARATION carve-out for CI**: Add a dedicated `deploy-ai-centre-edge-functions.yml` workflow (or extend `deploy-mat-edge-functions.yml`) to cover `packages/ai-centre/supabase/functions/**`. This gap affects all future AIMC/DCKIS Edge Function deliveries.

---

## Parking Station Entry

Appended to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`:
```
| 2026-03-20 | independent-assurance-agent | session-dckis-impl-002-20260320 | Phase 3 BD-005 | Edge Function pipeline wiring gap: SCOPE_DECLARATION + invocation chain + CI path coverage — three distinct preventable failures | session-dckis-impl-002-20260320.md |
```

---

## FAIL-ONLY-ONCE Updates

**Candidate for new rule**: Builder-class SCOPE_DECLARATION.md recurrence. This is the 3rd+ occurrence. Raising as candidate A-036 for CS2 review:

> **A-036 CANDIDATE** — SCOPE_DECLARATION.md is a mandatory wave ceremony artifact for ALL triggered PRs (AAWP_MAT, AGENT_CONTRACT, CANON_GOVERNANCE, CI_WORKFLOW). Foreman PREHANDOVER template MUST include SCOPE_DECLARATION.md generation as a pre-commit step (not post-commit). A PREHANDOVER proof that is committed without a matching SCOPE_DECLARATION.md = merge gate pre-failure.

Status: CANDIDATE — requires CS2 ratification before addition to registry.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Token file**: `.agent-admin/assurance/iaa-token-session-dckis-impl-002-20260320.md`
