# Phase 4 Role-Separation Operational Guidance (Tier 2)

**Type**: Tier 2 operational guidance  
**Issue Anchor**: maturion-isms#1566 + CS2 clarification comment  
**Queue / Dependency**: Explicitly queued behind `APGI-cmy/maturion-isms#1565`; work may proceed before `#1565` is completed only with explicit CS2 authorization.  
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
| Git / Commit / Push operations | `.agent-admin/scope-declarations/pr-1567.md`; `.admin/prs/pr-*.json` (model reference) | Same file | Add reusable Git/commit/push operating guidance, risk scan, and post-push verification fields required by CS2 clarification. |

---

## 2) Preservation note (reviewed and unchanged)

| Existing Tier 2 file reviewed | Why unchanged |
|---|---|
| `governance/checklists/execution-ceremony-admin-checklist.md` | Remains valid for ceremony core controls; this file adds role-separation specifics only. |
| `governance/checklists/execution-ceremony-admin-reconciliation-matrix.md` | Reconciliation logic remains valid and non-conflicting. |
| `.agent-workspace/independent-assurance-agent/knowledge/ecap-three-role-split-checklist.md` | Existing split model remains valid; this file adds complete operational detail requested by #1566. |
| `governance/templates/execution-ceremony-admin/README.md` | Existing template catalog remains valid; this file adds required template content only. |

---

## 2.A) Discoverability quick links (Phase 4 operational proof)

- QA Builder index: `.agent-workspace/qa-builder/knowledge/index.md`
- IAA index: `.agent-workspace/independent-assurance-agent/knowledge/index.md`
- ECAP index: `.agent-workspace/execution-ceremony-admin-agent/knowledge/index.md`
- Foreman index: `.agent-workspace/foreman-v2/knowledge/index.md`
- Foreman handback template: `governance/templates/execution-ceremony-admin/FOREMAN_ADMIN_READINESS_HANDBACK.template.md`
- PREHANDOVER template: `governance/templates/execution-ceremony-admin/PREHANDOVER.template.md`

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
- no evidence artifact was added after scope declaration without scope update;
- mandatory current-head gate snapshot produced and included in handover claim comment before any handover claim is posted;
- HANDOVER_ALLOWED: yes set only when ALL required checks are green at the snapshot SHA and snapshot SHA matches current HEAD;
- STOP_AND_FIX output issued if any required check is red, pending, or missing at snapshot time;
- handover claim withheld if snapshot SHA does not match current branch HEAD.

### Pre-handover mandatory snapshot enforcement

Before posting any handover claim comment, ECAP MUST:

1. Run the merge-gate snapshot against the current HEAD SHA.
2. Populate all required snapshot fields from the `ECAP_GATE_AND_ADMIN_REPORT` output template in §6 (Required Tier 2 output template) of this document.
3. Set `HANDOVER_ALLOWED: yes` ONLY when ALL required checks are green at the current HEAD SHA.
4. If any required check is red, pending, or missing: set `HANDOVER_ALLOWED: no` and output `STOP_AND_FIX`.
5. Include the snapshot block in the handover claim comment — this is the required **producer-side handover format** validated by the `handover-claim-gate` CI.

ECAP MUST NOT:
- copy the snapshot fields from the gate-bot's prior blocked comment (the gate-bot-emitted snapshot is authoritative output, not a template to fill in);
- claim `HANDOVER_ALLOWED: yes` based on an older SHA or stale gate run;
- post a handover claim while any required check is red, pending, or missing.

The `handover-claim-gate` CI enforces this format as a hard precondition: a handover claim comment that lacks the required snapshot fields, presents a stale SHA, or sets `HANDOVER_ALLOWED: yes` while checks are not fully green will be rejected.

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
11. Was the current-head gate snapshot produced and included in the handover claim comment before it was posted?
12. Does HANDOVER_ALLOWED: yes reflect a genuinely fully-green snapshot at the current HEAD SHA — or is it assumed from a prior gate run?
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
GIT_BRANCH_VERIFIED: yes/no
REMOTE_BRANCH_VERIFIED: yes/no
PUSH_COMPLETED: yes/no
POST_PUSH_HEAD_SHA: ...
PR_DIFF_MATCHES_SCOPE: yes/no
POST_PUSH_SCOPE_STILL_VALID: yes/no
POST_PUSH_CI_TRIGGERED: yes/no
POST_PUSH_EVIDENCE_REFRESH_REQUIRED: yes/no
POST_PUSH_EVIDENCE_REFRESHED: yes/no/not_applicable
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
- confirm product intent, not just issue wording, is understood;
- reject handover if ECAP gate snapshot is absent from the handover claim comment;
- confirm HANDOVER_ALLOWED: yes is present in ECAP snapshot before accepting handover;
- do not mark PR ready-for-review unless HANDOVER_ALLOWED: yes is confirmed in the ECAP snapshot.

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
11. Does the ECAP gate snapshot exist in the handover claim comment and show HANDOVER_ALLOWED: yes?
12. Is the snapshot SHA (CURRENT_HEAD_SHA in the ECAP snapshot) current — does it match the current HEAD at time of handover?
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
ECAP_SNAPSHOT_PRESENT: yes/no
ECAP_SNAPSHOT_HANDOVER_ALLOWED: yes/no
MERGE_OR_HANDOVER_ALLOWED: yes/no
GIT_BRANCH_VERIFIED: yes/no
REMOTE_BRANCH_VERIFIED: yes/no
PUSH_COMPLETED: yes/no
POST_PUSH_HEAD_SHA: ...
PR_DIFF_MATCHES_SCOPE: yes/no
POST_PUSH_SCOPE_STILL_VALID: yes/no
POST_PUSH_CI_TRIGGERED: yes/no
POST_PUSH_EVIDENCE_REFRESH_REQUIRED: yes/no
POST_PUSH_EVIDENCE_REFRESHED: yes/no/not_applicable
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

## 11) Git / Commit / Push operational guidance (Tier 2 reusable checklist)

Reusable Git / Commit / Push checklist:
- current repository verified;
- current branch verified;
- target PR number verified;
- target issue number verified;
- pre-change HEAD SHA recorded where required;
- working tree inspected before editing;
- changed files reviewed after editing;
- scope declaration and manifest include every changed file;
- no unrelated files staged;
- no generated/temp/cache/log files staged accidentally;
- staged diff reviewed before commit;
- commit message references correct issue/PR where appropriate;
- push target is the PR branch, not `main`;
- remote branch update confirmed;
- post-push PR head SHA captured;
- PR diff on GitHub matches intended scope;
- CI/gates triggered against the new head;
- evidence artifacts refreshed if SHA, file count, run ID, or check status changed after push.

Required Git / Push Risk Scan:
```text
1. Am I on the correct branch?
2. Am I pushing to the correct remote branch?
3. Did I accidentally edit or stage unrelated files?
4. Did generated files, caches, logs, or local temp files enter the diff?
5. Did I update scope declaration after adding evidence files?
6. Did I update the PR admin manifest after the final file set changed?
7. Did the final commit change the SHA referenced in evidence?
8. Did the push create a new head SHA after ECAP/IAA/admin evidence was written?
9. Do any artifacts still reference an older SHA, older file count, older run ID, or older check status?
10. Did the push actually reach GitHub?
11. Is the GitHub PR diff the same as the intended local diff?
12. Did CI start on the new head?
13. Are there pending or failed gates after the push?
14. Is handover being claimed before the pushed branch is verified?
```

Required output fields (where relevant, especially ECAP and Foreman):
```text
GIT_BRANCH_VERIFIED: yes/no
REMOTE_BRANCH_VERIFIED: yes/no
PUSH_COMPLETED: yes/no
POST_PUSH_HEAD_SHA: ...
PR_DIFF_MATCHES_SCOPE: yes/no
POST_PUSH_SCOPE_STILL_VALID: yes/no
POST_PUSH_CI_TRIGGERED: yes/no
POST_PUSH_EVIDENCE_REFRESH_REQUIRED: yes/no
POST_PUSH_EVIDENCE_REFRESHED: yes/no/not_applicable
```

---

## 12) Required Tier 1 / Tier 3 follow-up assessment

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

*Version: 1.3.0 | Tier 2 operational guidance only | Compatible with and queued behind APGI-cmy/maturion-isms#1565*
