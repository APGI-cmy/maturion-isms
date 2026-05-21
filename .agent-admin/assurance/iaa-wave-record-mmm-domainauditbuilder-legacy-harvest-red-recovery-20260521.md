# IAA Wave Record — mmm-domainauditbuilder-legacy-harvest-red-recovery-20260521

**Wave ID**: mmm-domainauditbuilder-legacy-harvest-red-recovery-20260521
**Date**: 2026-05-21
**PR**: #1723
**Issue**: #1722 — RED recovery: classify MMM DomainAuditBuilder as legacy harvest and record PR1700/PR1711 parity failure
**Branch**: copilot/red-recovery-legacy-harvest-fix
**Producing Agent (expected)**: governance-liaison-isms-agent (delegated by foreman-v2-agent)
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**CS2 Authorization**: Issue #1722 opened by CS2 / @APGI-cmy, with CS2 clarification comment applied

---

IAA_PREFLIGHT_BRIEF
PR: #1723
ISSUE: #1722
WAVE: mmm-domainauditbuilder-legacy-harvest-red-recovery-20260521
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
CURRENT_HEAD_SHA: GITHUB_PR_HEAD_SHA (runtime placeholder resolved by iaa-preflight-contract-gate.sh)

CURRENT_HEAD_CONTEXT:
- historical_prebrief_sha: 7e1a6660cd80c7dcb9794a426feff23b651a2430
- reviewed_head_at_cs2_change_request: bbdb92143cae66739b48ba71f12a88064f2efafc
- closure_policy: current-head closure tracked via GITHUB_PR_HEAD_SHA to prevent stale SHA-only loops
- closure_policy_resolution: GITHUB_PR_HEAD_SHA is resolved at gate/runtime to the active PR head SHA accepted by .github/scripts/iaa-preflight-contract-gate.sh
- closure_policy_intent: this keeps reviewed historical SHAs explicit while avoiding repeated manual CURRENT_HEAD_SHA rewrites on each non-substantive governance update

EXPECTED_QA_SCOPE:
- `modules/MMM/BUILD_PROGRESS_TRACKER.md` must explicitly record PR1700/PR1711 as parity failure (not restoration completion)
- Harvest-vs-build classification artifact for DomainAuditBuilder recovery work
- Legacy source manifest with explicit source-of-truth file list and missing-file policy
- RED parity test specification enforcing the legacy three-card generation workflow and generated-card lifecycle behaviours
- Hard anti-thin-shell legacy-restoration rule in pre-build artifacts

EXPECTED_FAILURE_MODES:
- PR1700/PR1711 interpreted as complete legacy restoration despite missing behavioural parity
- Harvest-vs-build boundary not codified, allowing thin-shell rebuilds to be misclassified
- Legacy source manifest omitted, incomplete, or silently substituted
- RED parity tests too vague to fail thin-shell rebuild claims
- Follow-up implementation linkage omitted from governance artifacts

FOREMAN_INSTRUCTIONS:
- Record PR1700/PR1711 as route/data plumbing success with legacy behavioural parity failure.
- Define HARVEST as source-truth extraction/adaptation and BUILD/ADAPT as compatibility wiring only.
- Keep exact legacy file manifest as source of truth; declare any missing legacy file explicitly.
- Add RED parity criteria covering three-card UX, generated-card lifecycle, loading/error states, and save-refresh lifecycle.
- Add hard instruction: no PR may claim legacy restoration without source-file parity proof.

IAA_WILL_QA:
- Trigger classification and governance-wave scope correctness.
- Accuracy/completeness of parity-failure recording for PR1700/PR1711.
- HARVEST vs BUILD/ADAPT boundary clarity and enforceability.
- Legacy source manifest traceability and missing-file handling explicitness.
- RED parity spec enforceability against thin-shell implementations.
- Presence of follow-up implementation linkage.

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## PRE-BRIEF

**Produced by**: independent-assurance-agent  
**Date**: 2026-05-21  
**Action**: PRE-BRIEF  
**Status**: COMPLETE

Qualifying tasks:
1. Record PR1700/PR1711 DomainAuditBuilder legacy parity failure in MMM governance artifacts.
2. Classify DomainAuditBuilder scope into HARVEST vs BUILD/ADAPT with explicit boundary rules.
3. Create a legacy source manifest with resolvable lineage mapping.
4. Define RED parity test specifications that block false “legacy restoration complete” claims.
5. Enforce hard prohibition on thin-shell rebuilds being labeled as legacy restoration.

Applicable overlay:
- MIXED (MANDATORY): PRE_BUILD_STAGE_MODEL + CANON_GOVERNANCE

Anti-regression obligations:
- YES — FUNCTIONAL-BEHAVIOUR-REGISTRY enforced.
- Preserve and apply NBR-001, NBR-003, NBR-005 where DomainAuditBuilder functional claims are made.
- Add/maintain explicit parity-failure guardrail: PR1700/PR1711 must not be represented as legacy restoration parity.
- Require RED parity tests to remain failing until full behavioural parity evidence exists.
