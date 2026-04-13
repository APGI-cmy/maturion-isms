# IAA Pre-Brief — Wave mmm-gov-gaps

**Artifact Type**: IAA Pre-Brief (Phase 0 — PRE-BRIEF mode)
**Wave**: mmm-gov-gaps
**Wave Description**: Governance Compliance Gaps in MMM App Description
**Branch (to be created)**: copilot/fix-governance-compliance-gaps
**Issue**: Governance Compliance Gaps in MMM App Description: Alignment and Specificity Required
**Date**: 2026-03-20
**IAA Version**: independent-assurance-agent v6.2.0 / contract 2.3.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 only (@APGI-cmy)

---

## 1. Wave Scope Confirmation

**Declared scope (per issue and pre-brief request):**

| File | Change |
|------|--------|
| `modules/MMM/00-app-description/MMM_app_description.md` | Update to close governance compliance gaps (Priority 1, 2, 3 items per issue) |

**No production code, schemas, tests, CI workflows, or agent contracts in scope.**

---

## 2. Trigger Category Classification

**Classification decision flow (per `iaa-trigger-table.md` v2.1.0):**

| Step | Check | Result |
|------|-------|--------|
| 1 | Any `.github/agents/` or `governance/agents/` changes? | NO |
| 2 | Any `governance/canon/` or `CANON_INVENTORY.json` changes? | NO |
| 3 | Any `.github/workflows/` changes? | NO |
| 4 | AAWP/MAT deliverable artifacts (`modules/mat/`, `packages/ai-centre/`, labelled)? | NO — path is `modules/MMM/` |
| 5 | Any `governance/quality/agent-integrity/` changes? | NO |
| 6 | Any `.agent-workspace/*/knowledge/` changes? | NO |
| 7 | Clearly and unambiguously doc-only outside governance/canon? | **UNCERTAIN** → AMBIGUITY RULE applies |

**Classification: AMBIGUOUS → IAA MANDATORY (FAIL-ONLY-ONCE A-003)**

**Rationale for AMBIGUOUS (not EXEMPT):**

- The document `MMM_app_description.md` is declared as the "upstream authority" for all downstream FRS, TRS, QA, and implementation artifacts. It is architecture-constituting documentation.
- The amendments include: compliance baseline declarations (ISO 27001/31000/NIST CSF), control traceability rules, governance artifact cross-references, layer-down registration acknowledgment, and merge gate references. These are governance-material changes to a foundational platform document.
- **Established precedent**: The `modules/maturity-roadmap/00-app-description/ROADMAP_APP_DESCRIPTION_v3.0.md` wave (wave `markdown-rewrite-remediation`) was treated as IAA-mandatory with an ASSURANCE-TOKEN exit criterion. That document has identical structural role to `MMM_app_description.md`.
- The AMBIGUITY RULE (A-003): "Ambiguity resolves to mandatory invocation — never to exempt."

**IAA trigger category (resolved)**: **AMBIGUOUS → MANDATORY** (treated as governance documentation / architecture-planning deliverable for the MMM module).

---

## 3. Qualifying Tasks

| Task ID | Summary | IAA Trigger Category | Required Phases | Notes |
|---------|---------|----------------------|-----------------|-------|
| MMM-GOV-P1 | Priority 1: Resolve Q1 open design decision; declare compliance baseline (ISO 27001/31000/NIST CSF); add control traceability rule; acknowledge layer-down registration | AMBIGUOUS → MANDATORY | P0 (this pre-brief), P2–P4 at handover | Scope blocker: CONSUMER_REPO_REGISTRY.json does not exist — see §5 |
| MMM-GOV-P2 | Priority 2: Back-office AI admin interface; QIW dashboard; 5-check runtime readiness model; APP_STARTUP_REQUIREMENTS.md mandate; reference FAILURE_PROMOTION_RULE.md and WE_ONLY_FAIL_ONCE_DOCTRINE.md; reference AI merge gate and validation script | AMBIGUOUS → MANDATORY | P0, P2–P4 | Scope blocker: AI merge gate validation script does not exist — see §5 |
| MMM-GOV-P3 | Priority 3: Agent class references; enumerate .agent-admin/ structure; require PR-level evidence bundle; service performance metrics; cross-reference merge gate requirements | AMBIGUOUS → MANDATORY | P0, P2–P4 | No blockers for P3 items |

All three tasks constitute a single deliverable (one file modified) and will be assessed together at handover.

---

## 4. FFA Checks IAA Will Run at Handover

IAA will apply the Universal Ceremony Gate (CERT-001 through CERT-004) plus the following
Documentation-FFA checks specific to this wave. These checks represent IAA's **complete
acceptance bar** for this PR. The producing agent must ensure all DOC-FFA checks can pass
before invoking IAA.

### Universal Ceremony Gate (max 5 minutes — binary existence checks)

| Check | Requirement |
|-------|-------------|
| CERT-001 | PREHANDOVER proof file present on branch |
| CERT-002 | Session memory file present on branch |
| CERT-003 | FAIL-ONLY-ONCE attestation declared in session memory |
| CERT-004 | `iaa_audit_token` field present in PREHANDOVER proof (format: `IAA-session-NNN-mmm-gov-gaps-YYYYMMDD-PASS`) |

### Core Invariants (applicable subset)

| Check | What IAA Verifies |
|-------|------------------|
| CORE-007 | No STUB/TODO/FIXME/TBD/placeholder content in the delivered document (except legitimately declared open items with explicit labels) |
| CORE-013 | PREHANDOVER proof or IAA token reference present in PR artifacts |
| CORE-015 | Session memory present in PR bundle |
| CORE-016 | Dedicated IAA token file exists (first invocation exception applies) |
| CORE-018 | Complete evidence artifact sweep — all four ceremony artifacts present |
| CORE-020 | Zero partial pass rule — all checks must be verifiable |
| CORE-023 | N/A anticipated — no workflow-adjacent changes; IAA records `N/A` if confirmed |

### Documentation FFA Checks (DOC-FFA — PRIMARY REVIEW FOCUS)

| Check ID | Check Name | Pass Condition | Priority |
|----------|-----------|----------------|----------|
| DOC-FFA-001 | Diff scope clean | The diff contains `modules/MMM/00-app-description/MMM_app_description.md` plus only the required ceremony artifacts for the wave/PR (for example PREHANDOVER, session memory, and token/rejection records). No unrelated files modified. | BLOCKING |
| DOC-FFA-002 | Priority 1 items addressed | All four P1 items visibly addressed: (a) Q1 open design decision resolved with explicit declaration in Section 41 or new section; (b) compliance baseline declared (ISO 27001, ISO 31000, NIST CSF — or explicit reasoned alternatives); (c) control traceability rule stated; (d) layer-down registration acknowledged per §5 guidance | BLOCKING |
| DOC-FFA-003 | Priority 2 items addressed | All P2 items visibly addressed: (a) back-office AI admin interface described; (b) QIW dashboard requirements specified; (c) 5-check runtime readiness model declared (checks named or described); (d) APP_STARTUP_REQUIREMENTS.md mandated with required content declared; (e) FAILURE_PROMOTION_RULE.md referenced with canonical path `governance/canon/FAILURE_PROMOTION_RULE.md`; (f) WE_ONLY_FAIL_ONCE_DOCTRINE.md referenced with canonical path `governance/canon/WE_ONLY_FAIL_ONCE_DOCTRINE.md`; (g) AI merge gate referenced per §5 guidance | BLOCKING |
| DOC-FFA-004 | Priority 3 items addressed | All P3 items visibly addressed: (a) agent class references present; (b) `.agent-admin/` structure enumerated; (c) PR-level evidence bundle required; (d) service performance metrics addressed; (e) merge gate requirements cross-referenced | BLOCKING |
| DOC-FFA-005 | No placeholder content | No section delivered as "TBD", "to be defined", "STUB", "TODO", "FIXME". Open design items must be explicitly labelled as `[OPEN DESIGN ITEM — requires CS2 resolution]` — this is not a placeholder, it is a declared open item. | BLOCKING |
| DOC-FFA-006 | Reference integrity | Every referenced file that currently exists must have its path verified: `governance/canon/FAILURE_PROMOTION_RULE.md` ✅ (exists), `governance/canon/WE_ONLY_FAIL_ONCE_DOCTRINE.md` ✅ (exists). Every referenced file that does NOT yet exist must be explicitly noted as "to be created" with path declared — NOT referenced as if already present. | BLOCKING |
| DOC-FFA-007 | Version header updated | Document version in Status Header updated from `v0.1.0` to an appropriate new version (minimum `v0.2.0`). Date updated to wave execution date. | BLOCKING |
| DOC-FFA-008 | Compliance baseline specificity | The declared compliance baseline must name specific standards (not generic "applicable standards"). Minimum: ISO 27001 (information security), ISO 31000 (risk management), NIST CSF (cybersecurity framework). If scope is limited, the limitation must be explicitly stated with rationale. | BLOCKING |
| DOC-FFA-009 | Q1 resolution declared as decision (not deferred) | Section 41 item 1 ("Will MMM be a distinct top-level app or a named module in a portal shell?") must be resolved with an explicit decision statement, not deferred. The decision must be attributable (CS2 direction or architected position). | BLOCKING |
| DOC-FFA-010 | No over-specification beyond issue scope | The diff must not introduce content that was not scoped by the issue (Priority 1, 2, 3 items). No new open design items added without CS2 authorization. No existing sections rewritten beyond what is required to close the declared gaps. | ADVISORY |

---

## 5. Scope Blockers and Governance Conflicts

### BLOCKER-001 — CONSUMER_REPO_REGISTRY.json Does Not Exist

**Severity**: SCOPE-CLARIFICATION REQUIRED (not a hard stop — resolvable by producing agent)

**Finding**: The issue requires the app description to "acknowledge layer-down registration in CONSUMER_REPO_REGISTRY.json." A full-repository search confirms this file does not exist anywhere in `maturion-isms`.

**IAA position**: The producing agent MUST NOT reference `CONSUMER_REPO_REGISTRY.json` as if it is an existing active governance artifact. Doing so would create a false statement in the app description and would fail DOC-FFA-006 (reference integrity).

**Resolution options (producing agent must choose one, note the choice in session memory):**
- Option A: Reference as a **future artifact**: "MMM must be registered in `CONSUMER_REPO_REGISTRY.json` when that registry is established as a layer-down coordination mechanism." This is the recommended approach.
- Option B: Explicitly mark as an open design item: `[OPEN DESIGN ITEM — CONSUMER_REPO_REGISTRY.json does not yet exist; registration requirement to be confirmed at FRS stage]`
- Option C: Escalate to CS2 to determine whether the registry should be created as a separate wave before this update proceeds.

**DOC-FFA-006 will FAIL if**: The app description references `CONSUMER_REPO_REGISTRY.json` as an existing artifact that MMM is or should be registered in, without acknowledging that the file does not exist.

---

### BLOCKER-002 — AI Merge Gate Validation Script Does Not Exist

**Severity**: SCOPE-CLARIFICATION REQUIRED (resolvable by producing agent)

**Finding**: The issue requires the app description to "reference AI merge gate and validation script." A full-repository search found no file matching `*merge*gate*` or `*ai*merge*` or any validation script in the `.github/` directory beyond standard workflow files.

**IAA position**: The producing agent must not reference a specific script path that does not exist.

**Resolution options:**
- Option A: Reference the **concept** (not a specific file): "MMM implementation must pass the Maturion AI merge gate, including the validation script mandated by `governance/canon/PLATFORM_AI_REQUIREMENTS.md`." This keeps the requirement without a false file path.
- Option B: Reference the merge gate **workflow** (`.github/workflows/`) as the enforcement mechanism, if appropriate.
- Option C: Escalate to CS2 to confirm the exact script name and path before including the reference.

**DOC-FFA-006 will FAIL if**: The app description references a specific script path that does not exist without the "to be created" qualifier.

---

### BLOCKER-003 — APP_STARTUP_REQUIREMENTS.md Does Not Exist (Advisory — Not Hard Blocker)

**Severity**: ADVISORY

**Finding**: `APP_STARTUP_REQUIREMENTS.md` does not exist as a standalone file anywhere in the repository. The MMM app description (Section 38) already references it as a commissioning artifact that MMM must include. The issue asks to "mandate APP_STARTUP_REQUIREMENTS.md platform requirements section."

**IAA position**: This is NOT a hard blocker. The app description can (and should) mandate this file by declaring what it must contain. The app description is the appropriate place to establish this requirement — the file being mandated does not need to exist yet.

**Producing agent guidance**: When addressing this item, the app description should declare:
1. That `APP_STARTUP_REQUIREMENTS.md` is a required governance artifact for MMM
2. What the platform requirements section of that file must contain (5-check runtime readiness model, dependency declarations, environment variable requirements, etc.)
3. When it must be created (before first deployment / commissioning gate)

No BLOCKER from IAA — this is forward-declared governance, which is the purpose of the app description.

---

### GOVERNANCE CONFLICT NOTE — "5-Check Runtime Readiness Model"

**Finding**: The term "5-check runtime readiness model" appears in the issue scope but is not currently defined in any governance canon file. The MMM app description can declare that this model must be defined, but the producing agent should not invent a specific 5-check model without CS2 authorization.

**Producing agent guidance**: Declare the model by requirement structure: "MMM must implement a structured runtime readiness verification model. The platform requirements section of `APP_STARTUP_REQUIREMENTS.md` must enumerate the specific checks (expected to be a minimum of 5 runtime readiness checks including: [placeholder for CS2 direction])." If CS2 has already provided the 5 checks in the issue or supplementary notes, use those exactly.

---

## 6. Required PREHANDOVER Proof Structure

The producing agent must commit a PREHANDOVER proof **before** invoking IAA. The proof must be committed and the branch must be in a clean state before invocation (FAIL-ONLY-ONCE A-021).

### Required PREHANDOVER Proof Fields

```yaml
# PREHANDOVER PROOF — wave mmm-gov-gaps
# Commit this file BEFORE invoking IAA

wave: mmm-gov-gaps
branch: copilot/mmm-governance-gaps
issue: "Governance Compliance Gaps in MMM App Description: Alignment and Specificity Required"
date: YYYY-MM-DD
session_id: session-NNN-mmm-gov-gaps-YYYYMMDD
producing_agent: [agent name — mat-specialist or equivalent]
producing_agent_class: [specialist / general-purpose]

## Deliverable Manifest

| ID | File | Change Summary | Status |
|----|------|----------------|--------|
| MMM-GOV-001 | modules/MMM/00-app-description/MMM_app_description.md | Close governance compliance gaps (P1, P2, P3) | DELIVERED |

## Scope Blocker Resolutions

blocker_001_consumer_repo_registry: >
  [State which option was chosen: A / B / C — and confirm how it was addressed in the document]

blocker_002_ai_merge_gate_script: >
  [State which option was chosen: A / B / C — and confirm how it was addressed in the document]

## Ceremony Artifacts

session_memory_path: .agent-workspace/[agent]/memory/session-NNN-mmm-gov-gaps-YYYYMMDD.md
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-mmm-gov-gaps.md
iaa_audit_token: IAA-session-NNN-mmm-gov-gaps-YYYYMMDD-PASS  # pre-populated expected reference

## DOC-FFA Self-Assessment (producing agent fills before IAA invocation)

DOC-FFA-001 diff_scope_clean: [PASS / explanation]
DOC-FFA-002 priority_1_addressed: [PASS / list of items with evidence]
DOC-FFA-003 priority_2_addressed: [PASS / list of items with evidence]
DOC-FFA-004 priority_3_addressed: [PASS / list of items with evidence]
DOC-FFA-005 no_placeholder_content: [PASS / explanation]
DOC-FFA-006 reference_integrity: [PASS / list of resolved references]
DOC-FFA-007 version_header_updated: [PASS — new version: vX.X.X]
DOC-FFA-008 compliance_baseline_specificity: [PASS / standards declared]
DOC-FFA-009 Q1_resolved: [PASS — decision: [state the decision]]

## CS2 Authorization Evidence

cs2_authorization: >
  GitHub issue "[issue title]" opened/assigned by CS2 (@APGI-cmy)
  Issue URL: [URL]
```

---

## 7. Applicable FAIL-ONLY-ONCE Rules (Pre-Brief Advisory)

| Rule | Trigger Condition | Notes |
|------|------------------|-------|
| A-001 | PREHANDOVER proof present for agent contract PRs | Not AGENT_CONTRACT — but CERT-001/CORE-013 still apply for all PRs |
| A-003 | Ambiguity resolves to mandatory invocation | Applied this pre-brief — wave classified MANDATORY not EXEMPT |
| A-021 | Working tree must be clean before IAA invocation | PREHANDOVER proof must be committed; no uncommitted changes |
| A-026 | SCOPE_DECLARATION must match git diff exactly | If producing agent maintains a SCOPE_DECLARATION, it must be updated |
| A-029 | §4.3b artifact immutability — PREHANDOVER proof read-only post-commit | Producing agent must not edit PREHANDOVER proof after committing it |
| A-033 | Artifact verification must use `git ls-tree HEAD` — not filesystem stat | IAA will verify artifacts using git tree, not file presence alone |

---

## 8. Delegation Guidance

**Recommended delegate**: `mat-specialist` (MMM is a maturity domain document; mat-specialist holds deep MMM context and understanding of the governance compliance requirements).

**Alternative delegate**: `general-purpose` agent with explicit context load of:
- `modules/MMM/00-app-description/MMM_app_description.md` (current state)
- `modules/MMM/MMM_strategy.md` (strategic context)
- `governance/canon/FAILURE_PROMOTION_RULE.md`
- `governance/canon/WE_ONLY_FAIL_ONCE_DOCTRINE.md`
- `governance/canon/PLATFORM_AI_REQUIREMENTS.md`
- This pre-brief (for scope blocker resolutions and FFA acceptance bar)

**Delegate must NOT**: Modify any file other than `modules/MMM/00-app-description/MMM_app_description.md` (plus ceremony artifacts). Any side-effect changes require CS2 authorization and a scope amendment.

---

## 9. Exit Criteria (Wave Closure)

- [ ] `modules/MMM/00-app-description/MMM_app_description.md` updated (all P1, P2, P3 items)
- [ ] PREHANDOVER proof committed before IAA invocation
- [ ] Session memory committed before IAA invocation
- [ ] Scope blocker resolutions documented in PREHANDOVER proof
- [ ] IAA invoked → ASSURANCE-TOKEN received
- [ ] IAA token file written to `.agent-admin/assurance/iaa-token-session-NNN-mmm-gov-gaps-YYYYMMDD.md`
- [ ] PR opened on branch `copilot/mmm-governance-gaps`
- [ ] CS2 merge authorization obtained

---

## 10. Pre-Brief Status

**Pre-Brief Status**: COMMITTED
**Phase 0 complete**: YES
**Phases 1–4 status**: STANDBY — awaiting producing agent delivery and IAA invocation
**IAA adoption phase**: PHASE_B_BLOCKING — hard gate ACTIVE

---

*Authority: CS2 (Johan Ras / @APGI-cmy) | IAA v6.2.0 | Pre-Brief committed: 2026-03-20*
