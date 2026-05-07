# Phase 4 Role-Separation Operational Guidance (Tier 2)

**Type**: Tier 2 operational guidance  
**Issue Anchor**: maturion-isms#1566 + CS2 clarification comment  
**Queue / Dependency**: Explicitly queued behind `APGI-cmy/maturion-isms#1565` (or earlier only with CS2 authorization).  
**Conflict Precedence Rule**: Tier 1 > Tier 2. If Tier 3 session instructions conflict with Tier 1 or Tier 2, stop and escalate.

---

## 1) Required Tier 2 file map

| Role / Cross-cutting rule | Existing Tier 2 file(s) reviewed | File(s) added or updated | Reason |
|---|---|---|---|
| Admin Ceremony | `governance/checklists/execution-ceremony-admin-checklist.md`; `governance/checklists/execution-ceremony-admin-reconciliation-matrix.md` | `governance/checklists/phase4-role-separation-operational-guidance.md` | Add complete role-separation checklist/risk scan/template coverage required by #1566. |
| ECAP | `.agent-workspace/independent-assurance-agent/knowledge/ecap-three-role-split-checklist.md`; `governance/checklists/execution-ceremony-admin-checklist.md` | Same file | Add admin+gate-at-current-head scrutiny checklist/questions/template fields. |
| Builder QA | `.agent-workspace/qa-builder/knowledge/index.md`; `governance/checklists/execution-ceremony-admin-checklist.md` | Same file | Add full behaviour-testing checklist/questions/template fields. |
| IAA | `.agent-workspace/independent-assurance-agent/knowledge/ecap-three-role-split-checklist.md`; `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` | Same file | Add quick-admin + deep-functional split with full required output template. |
| Foreman | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`; `governance/templates/execution-ceremony-admin/FOREMAN_ADMIN_READINESS_HANDBACK.template.md` | Same file | Add role orchestration checklist/questions/template and assignment matrix columns. |
| Cross-cutting | `governance/templates/execution-ceremony-admin/SCOPE_DECLARATION.template.md`; `governance/checklists/execution-ceremony-admin-checklist.md` | Same file | Add current-head, freshness, scope mutation, intent, adjacent impact, limitations, one-time-delivery blocks. |

---

## 2) Preservation note (reviewed and unchanged)

| Existing Tier 2 file reviewed | Why unchanged |
|---|---|
| `governance/checklists/execution-ceremony-admin-checklist.md` | Remains valid for ceremony core controls; this file adds role-separation specifics only. |
| `governance/checklists/execution-ceremony-admin-reconciliation-matrix.md` | Reconciliation logic remains valid and non-conflicting. |
| `.agent-workspace/independent-assurance-agent/knowledge/ecap-three-role-split-checklist.md` | Existing split model remains valid; this file adds complete operational detail requested by #1566. |
| `governance/templates/execution-ceremony-admin/README.md` | Existing template catalog remains valid; this file adds required template content only. |

---

## 3) Canon reference requirement for verdict terms (no redefinition)

Tier 2 operational guidance must cite governing canon or pending canon-alignment source for:
- `FULL_FUNCTIONAL_DELIVERY`
- `PARTIAL_FUNCTIONAL_DELIVERY`
- `ADMIN_ONLY`
- `FAIL`
- split `ADMIN_PASS` / `FUNCTIONAL_PASS` verdicts

Tier 2 operationalizes these terms through checklists/templates here and does not redefine canon semantics.

---

## 4) Template-only rule

All report formats in this file are reusable Tier 2 templates/examples only.  
Do not create live `ADMIN_CEREMONY_REPORT`, `ECAP_GATE_AND_ADMIN_REPORT`, `BUILDER_QA_FUNCTIONAL_REPORT`, `IAA_FINAL_ASSURANCE`, or `FOREMAN_ORCHESTRATION_RECORD` artifacts for unrelated active PRs in this issue.

---

## 5) Admin Ceremony Agent Tier 2 guidance

**Purpose**: Make the admin record clean.  
**Boundary**: Admin Ceremony Agent does not decide whether the build works.

Responsibilities checklist:
- manifest exists;
- scope declaration exists;
- scope declaration matches changed files;
- issue / PR numbers align;
- branch aligns with issue and PR purpose;
- evidence files are in allowed paths;
- file counts are correct;
- required admin artifacts are present;
- no stale root files;
- no ceremony spillover;
- no unrelated product/governance files pulled into scope;
- required labels/references/phase markers are present;
- prior review comments are addressed or clearly carried;
- handover text does not claim more than the PR delivered.

Required admin risk scan questions:
```text
1. What could still be wrong even if the checklist passes?
2. What values may have changed after this artifact was written?
3. Are any PR numbers, issue numbers, branch names, file counts, or SHAs now stale?
4. Did any later commit invalidate the evidence?
5. Did the IAA token, ECAP report, or PREHANDOVER artifact introduce new files that must be added to scope?
6. Did the final commit change the reviewed SHA?
7. Could the merge gate fail because evidence points to an earlier head?
8. Are there stale comments claiming blocked checks that are now green, or green checks that later turned red?
9. Is there any mismatch between issue intent, PR title, changed files, and handover claim?
10. What must be corrected before submission so this PR passes admin review once?
```

Required Tier 2 output template:
```text
ADMIN_CEREMONY_REPORT

ADMIN_RECORD_READY: yes/no
SCOPE_MATCH: yes/no
ISSUE_PR_ALIGNMENT: yes/no
SHA_CURRENT: yes/no
EVIDENCE_PATHS_VALID: yes/no
STALE_ARTIFACT_RISK: low/medium/high
ADMIN_RISK_SCAN_COMPLETE: yes/no
OPEN_ADMIN_RISKS: ...
REQUIRED_CORRECTIONS: ...
```

---

## 6) ECAP Agent Tier 2 guidance

**Purpose**: Run the gates, verify the admin package at current head, prove stop-and-fix happened, and block handover if anything is red, stale, pending, missing, or mismatched.  
**Boundary**: ECAP proves admin + gates at current head. ECAP does not issue final functional delivery assurance.

Responsibilities checklist:
- Admin Ceremony Agent report exists;
- manifest exists and validates;
- scope declaration exists and matches actual changed files;
- issue / PR numbers align;
- branch name aligns with issue and PR;
- file counts match actual diff;
- evidence files exist in allowed paths;
- PREHANDOVER / handover evidence exists when required;
- IAA pre-brief exists when required;
- required gate runs executed against current HEAD;
- gate run IDs recorded;
- failing gates listed;
- pending gates listed;
- missing gates listed;
- red gates fixed or remain blocking;
- reruns tied to correct commit SHA;
- no handover claimed while required checks are red, pending, or missing;
- no green claim relies on an old SHA;
- no evidence artifact was added after scope declaration without scope update.

Required ECAP risk scan questions:
```text
1. What could still fail at merge even though checks are currently green?
2. Did the latest commit change the head SHA after evidence was generated?
3. Did a newly added IAA/ECAP/admin artifact change file count or scope?
4. Are any checks green on an older SHA but missing on current HEAD?
5. Are there required checks that did not run because paths did not trigger them?
6. Are any failures hidden as neutral, skipped, cancelled, or ignored?
7. Does the PR claim handover before all required gates are complete?
8. Are there stale bot comments saying handover is blocked?
9. Are there stale human review comments that remain unresolved?
10. What needs to happen so this PR can be submitted once and pass all admin/gate scrutiny?
```

Required Tier 2 output template:
```text
ECAP_GATE_AND_ADMIN_REPORT

CURRENT_HEAD_SHA: ...
ADMIN_REPORT_PRESENT: yes/no
SCOPE_DECLARATION_VALID: yes/no
MANIFEST_VALID: yes/no
REQUIRED_CHECKS_RUN: yes/no
ALL_REQUIRED_CHECKS_GREEN: yes/no
FAILING_CHECKS: ...
PENDING_CHECKS: ...
MISSING_CHECKS: ...
STOP_AND_FIX_EVIDENCED: yes/no
STALE_SHA_RISK: low/medium/high
ECAP_RISK_SCAN_COMPLETE: yes/no
HANDOVER_ALLOWED: yes/no
ADMIN_PACKAGE_SURVIVES_SCRUTINY: yes/no
GATES_GREEN_AT_CURRENT_HEAD: yes/no
```

---

## 7) Builder QA Agent Tier 2 guidance

**Purpose**: Test the product behaviour, not the paperwork.  
**Boundary**: Builder QA provides product-behaviour evidence. IAA still independently assesses whether the evidence supports full functional delivery.

Responsibilities checklist:
- user journeys;
- every visible CTA;
- backend integration behind every CTA;
- error states;
- loading states;
- success states;
- navigation outcomes;
- state creation, update, or display;
- dashboard reflection of workflow state;
- regression behaviour;
- preview/live verification;
- screenshots or recordings;
- backend logs or API evidence where possible.

Required Builder QA risk scan questions:
```text
1. What user intent was actually requested?
2. Can the user complete the full journey, or only see the screen?
3. Did we test every visible CTA?
4. Are any buttons decorative, dead, mocked, or placeholder?
5. Are backend calls real, deployed, and reachable?
6. Do successful calls create, update, or display the expected state?
7. Do failed calls show visible user-facing errors?
8. Does the dashboard or next page reflect the completed workflow?
9. Are there hidden dependency failures outside the immediate UI?
10. What adjacent project components are affected even if not named in the issue?
11. Could this pass a narrow test but fail the user’s actual intent?
12. Is any limitation being hidden instead of explicitly declared?
```

Required Tier 2 output template:
```text
BUILDER_QA_FUNCTIONAL_REPORT

USER_JOURNEY_TESTED: yes/no
ALL_VISIBLE_CTAS_TESTED: yes/no
BACKEND_TARGETS_VERIFIED: yes/no
SUCCESS_STATES_VISIBLE: yes/no
FAILURE_STATES_VISIBLE: yes/no
LOADING_STATES_VISIBLE: yes/no
STATE_UPDATED_OR_DISPLAYED: yes/no
PREVIEW_OR_LIVE_URL_TESTED: yes/no
SCREENSHOTS_ATTACHED: yes/no
BACKEND_EVIDENCE_ATTACHED: yes/no
KNOWN_LIMITATIONS: ...
QA_RISK_SCAN_COMPLETE: yes/no
QA_FUNCTIONAL_RECOMMENDATION: FULL / PARTIAL / FAIL
ORIGINAL_USER_INTENT_UNDERSTOOD: yes/no
ORIGINAL_USER_INTENT_SUMMARY: ...
INTENT_MATCHES_DELIVERED_BEHAVIOUR: yes/no
```

---

## 8) IAA Agent Tier 2 guidance

**Purpose**: Independent final assurance that the build is complete, not just administratively valid.

### 8.A Admin assurance quick scan

Checklist:
- Admin Ceremony Agent report exists;
- manifest and scope evidence are aligned;
- ECAP report exists;
- gates are green or stop-and-fix is evidenced;
- issue and PR references align;
- current head SHA matches evidence;
- no stale admin artifacts invalidate the assurance package;
- no required admin/gate evidence is missing.

### 8.B Functional delivery assurance

Deep checklist:
- Does this build satisfy the original user intent?
- Does it complete the requested workflow?
- Are all visible CTAs wired?
- Are all backend capabilities real and deployed?
- Are success states visible?
- Are failure states visible?
- Are loading states visible?
- Does expected system state get created, updated, or displayed?
- Does the dashboard reflect the workflow?
- Is there live or preview evidence?
- Are screenshots sufficient?
- Are backend logs or workflow traces sufficient?
- Are any placeholders represented as complete?
- Are limitations explicitly declared?
- Does delivered scope match issue functional intent?
- Are adjacent components affected even if not named in the narrow instruction?
- Would CS2, using the product, reasonably experience this as complete?

Required IAA risk scan questions:
```text
1. What was done wrong or incompletely?
2. What could still go wrong in live use?
3. What evidence is missing?
4. What user journey remains unproven?
5. What CTA remains untested or unwired?
6. What backend capability is assumed rather than proven?
7. What project component is affected outside the narrow PR wording?
8. Did the implementation satisfy the instruction but miss the intent?
9. Is a visual shell being mistaken for functional delivery?
10. Is this a one-time complete build, or will CS2 need another corrective pass?
11. What would improve the build before merge?
12. Can I honestly call this full functional delivery?
```

Required Tier 2 output template:
```text
IAA_FINAL_ASSURANCE

ADMIN_PASS: yes/no
FUNCTIONAL_PASS: yes/no
VERDICT: FULL_FUNCTIONAL_DELIVERY | PARTIAL_FUNCTIONAL_DELIVERY | ADMIN_ONLY | FAIL

ADMIN_SCAN_SUMMARY: ...
ECAP_VERIFICATION: ...
FUNCTIONAL_DELIVERY_SUMMARY: ...
ORIGINAL_USER_INTENT_SATISFIED: yes/no
ALL_VISIBLE_CTAS_WIRED: yes/no
BACKEND_CAPABILITIES_DEPLOYED: yes/no
SUCCESS_FAILURE_LOADING_STATES_VISIBLE: yes/no
STATE_UPDATED_OR_DISPLAYED: yes/no
LIVE_OR_PREVIEW_EVIDENCE_PRESENT: yes/no
PLACEHOLDER_MISREPRESENTATION: yes/no
ADJACENT_COMPONENT_IMPACT_REVIEWED: yes/no
IAA_FUNCTIONAL_RISK_SCAN_COMPLETE: yes/no
REQUIRED_CORRECTIONS_BEFORE_MERGE: ...
ONE_TIME_BUILD: yes/no
ONE_HUNDRED_PERCENT_BUILD: yes/no
FULL_FUNCTIONAL_DELIVERY_CLAIMED: yes/no
FULL_FUNCTIONAL_DELIVERY_REFUSAL_REASON: ...
```

IAA must be able to say:
```text
This is a 100% build.
This is a one-time build.
This is full functional delivery.
```

Or explicitly refuse full functional delivery with reasons.

---

## 9) Foreman Tier 2 guidance

**Purpose**: Orchestrate and enforce role boundaries.  
Foreman does not build. Foreman ensures the right agents build, test, run gates, and assure.

Responsibilities checklist:
- assign the correct agent for each role;
- prevent role collapse;
- prevent builders from self-assuring final delivery;
- prevent IAA from becoming a gate runner instead of assurance authority;
- ensure ECAP owns admin/gate scrutiny;
- ensure Builder QA owns product behaviour testing;
- ensure IAA owns independent final assurance;
- ensure all roles produce their required reports;
- ensure unresolved risks are routed back to correct agent;
- block merge if any role is missing or conflicted;
- confirm product intent, not just issue wording, is understood.

Required Foreman risk scan questions:
```text
1. Has any agent performed a role it should not perform?
2. Has any role been skipped?
3. Is any agent self-certifying its own work?
4. Did ECAP verify current-head gates and admin scrutiny?
5. Did Builder QA test product behaviour deeply enough?
6. Did IAA independently assess delivery truth?
7. Is the original user intent preserved across all roles?
8. Are there hidden assumptions about who checked the workflow?
9. Are downstream components affected but unassigned?
10. Is this delivery likely to pass once, cleanly, without a corrective PR?
```

Required Tier 2 output template:
```text
FOREMAN_ORCHESTRATION_RECORD

ADMIN_AGENT_ASSIGNED: yes/no
ECAP_AGENT_ASSIGNED: yes/no
BUILDER_QA_ASSIGNED: yes/no
IAA_ASSIGNED: yes/no
ROLE_BOUNDARIES_CONFIRMED: yes/no
NO_SELF_CERTIFICATION: yes/no
ALL_REPORTS_PRESENT: yes/no
UNRESOLVED_RISKS: ...
MERGE_OR_HANDOVER_ALLOWED: yes/no
```

Foreman assignment matrix template (required columns):
| Responsibility | Assigned agent | Evidence required | Cannot be self-certified by | Status |
|---|---|---|---|---|
| <responsibility> | <agent> | <artifact/evidence> | <agent/role> | <OPEN/PASS/FAIL> |

---

## 10) Cross-cutting Tier 2 operational blocks

### Current-head lock rule
```text
CURRENT_HEAD_SHA_REVIEWED: ...
REFRESH_REQUIRED_IF_HEAD_CHANGES: yes
```

### Evidence freshness rule
```text
EVIDENCE_FRESH_AGAINST_HEAD: yes/no
```

### Scope mutation rule
```text
POST_SCOPE_ARTIFACTS_ADDED: yes/no
SCOPE_UPDATED_AFTER_ARTIFACTS: yes/no/not_applicable
```

### Intent-over-instruction rule
Agents must evaluate literal instruction compliance and user intent.

### Adjacent-component impact rule
```text
What other components are affected by this change even if not mentioned?
```

### Limitation honesty rule
```text
KNOWN_LIMITATIONS_DECLARED: yes/no
LIMITATIONS_ACCEPTED_BY_CS2: yes/no/not_required
```

### One-time-delivery cross-cutting question
```text
Will this require another corrective PR before CS2 can use the promised workflow?
```

If yes, it is not full functional delivery.

---

## 11) Required Tier 1 / Tier 3 follow-up assessment

Conclusion (required format): **Follow-up required, with proposed issue title, repository, and scope.**

- **Proposed issue title**: Tier 1 assurance-term harmonization for admin/functional split verdict references
- **Repository**: `APGI-cmy/maturion-foreman-governance` (with consumer ripple to `APGI-cmy/maturion-isms`)
- **Scope**:
  - Tier 1 canon / agent contract pointer changes: evaluate and align verdict-term references.
  - Tier 3 session artifact templates: evaluate whether template pointers need updates only.
  - Governance layer-down / layer-up: execute if canonical updates are approved by CS2.
  - CI gate hardening: assess later phase; out of scope for this Tier 2 update.
  - Agent contract updates via Foreman + Codex Advisor: only via separate CS2-approved path.

---

*Version: 1.1.0 | Tier 2 operational guidance only | Compatible with and queued behind APGI-cmy/maturion-isms#1565*
