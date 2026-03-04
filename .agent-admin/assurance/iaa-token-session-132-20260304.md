# IAA Assurance Token — Session 132 — 2026-03-04

```
═══════════════════════════════════════
ASSURANCE-TOKEN
PR: copilot/propagate-governance-changes-e45c6ae2-8853-4ff3-bb03-1720769d28b6
    Issue #876 — [Layer-Down] Propagate Governance Changes 61ab7b83
All 35 checks PASS (22 substantive PASS + 13 N/A). Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).
Token reference: IAA-session-132-20260304-PASS
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
═══════════════════════════════════════
```

## Token Details

| Field | Value |
|-------|-------|
| token_reference | IAA-session-132-20260304-PASS |
| session_id | session-132-20260304 |
| date | 2026-03-04 |
| pr_branch | copilot/propagate-governance-changes-e45c6ae2-8853-4ff3-bb03-1720769d28b6 |
| issue | APGI-cmy/maturion-isms#876 |
| invoking_agent | governance-liaison-isms (session-045-20260304) |
| producing_agent | governance-liaison-isms (session-045-20260304) |
| pr_category | CI_WORKFLOW |
| checks_executed | 35 (22 substantive PASS + 13 N/A + 0 FAIL) |
| merge_gate_parity | PASS (BL-027 exit 0; 13=13; governance/alignment PASS; stop-and-fix PASS) |
| verdict | ASSURANCE-TOKEN |
| adoption_phase | PHASE_B_BLOCKING |
| invocation_number | 3 (third invocation on this branch — prior: session-130 REJECTION, session-131 REJECTION) |
| authority | CS2 only (@APGI-cmy) |

## Prior Invocations on This Branch

| Session | Result | Key Failure |
|---------|--------|-------------|
| session-130-20260304 | REJECTION-PACKAGE | 8 failures: PREHANDOVER absent, SCOPE_DECLARATION stale, PHASE_A fabrication |
| session-131-20260304 | REJECTION-PACKAGE | 1 failure: BL-027 SCOPE_DECLARATION mismatch (47 declared vs 11 in diff) |
| session-132-20260304 | **ASSURANCE-TOKEN** | 0 failures — all checks PASS |

## Parity Evidence

| Check | Result |
|-------|--------|
| merge-gate/verdict | PASS — YAML valid; 0 agent file changes; 0 production code changes |
| governance/alignment | PASS — 191 canons; 0 bad hashes; IAA canon + AGCFPP-001 present |
| stop-and-fix/enforcement | PASS — 0 unauthorized .github/agents/ changes |
| BL-027 validate-scope-to-diff.sh | PASS — exit 0; 13 declared = 13 in diff; exact set match |

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Issued by**: independent-assurance-agent v6.2.0
**Merge authority**: CS2 ONLY — no merge without CS2 approval
