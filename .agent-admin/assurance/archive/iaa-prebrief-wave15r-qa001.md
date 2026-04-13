# IAA Pre-Brief Artifact — Wave 15R Batch C — T-W15R-QA-001

**Agent**: independent-assurance-agent
**Version**: 6.2.0
**Pre-Brief Type**: Phase 0 — PRE-BRIEF
**Artifact Path**: `.agent-admin/assurance/iaa-prebrief-wave15r-qa001.md`
**Wave**: Wave 15R Batch C — T-W15R-QA-001 (governance closure for qa-builder RED test delegation)
**Branch**: `copilot/create-red-tests-wave-15r`
**Issue**: maturion-isms#1000 — T-W15R-QA-001 — 5 RED tests for Wave 15R UX features
**Date**: 2026-03-08
**CS2 Authority**: Issue #1000 opened directly by @APGI-cmy; "Please finish this job" directive 2026-03-08
**Invoked by**: foreman-v2-agent (IAA PRE-BRIEF REQUEST comment)
**Protocol Reference**: `IAA_PRE_BRIEF_PROTOCOL.md §Trigger`
**Adoption Phase**: PHASE_B_BLOCKING — hard gate active

---

## SECTION 1 — GOVERNANCE CONTEXT

### Wave Summary

This wave recovers the governance gap INC-OPOJD-W15R-QA-001: during the wave15r-gov governance
session, qa-builder was delegated T-W15R-QA-001 (write 5 RED tests for Wave 15R UX features)
but no GitHub issue was created to formally commission the work. The tests were written and merged
to main as part of Wave 15R. Issue #1000 was created by CS2 on 2026-03-08 as the corrective action.

CS2 has issued the directive: **"Please finish this job"** — meaning this wave's purpose is to
produce proper governance closure artifacts for issue #1000 and close the OPOJD recovery loop.

### INC-OPOJD-W15R-QA-001 Status

Per Foreman FAIL-ONLY-ONCE v3.2.0:
- **Status**: REMEDIATED — maturion-isms#1000 created (2026-03-08); INC recorded
- **Corrective Action**: Issue #1000 exists; S-025 DELEGATION-ISSUE-REQUIRED added to suggestions
  log (candidate A-033, status: OPEN)
- **QA-to-Red bypass**: Tests were written post-implementation. The 5 tests
  (`T-W15R-UX-001` through `T-W15R-UX-005` in `modules/mat/tests/wave15r/wave15r-ux-features.test.ts`)
  are GREEN on main because implementation is complete. This is documented and accepted.

### Branch State at Pre-Brief

| Item | Status |
|------|--------|
| Branch `copilot/create-red-tests-wave-15r` | EXISTS — 1 commit above origin/main ("Initial plan") |
| SCOPE_DECLARATION.md | PENDING update |
| wave-current-tasks.md | ✅ COMMITTED |
| PREHANDOVER proof | NOT YET CREATED |
| Session memory (foreman) | NOT YET CREATED |
| IAA token file | NOT YET CREATED — will be created at IAA-AUDIT-001 |

---

## SECTION 2 — TRIGGER CATEGORY DECLARATION

### Step 0.3 — Task Classification Against Trigger Table

| Task ID | Description | Files Changed | IAA Trigger Category | Qualifying? |
|---------|-------------|---------------|---------------------|-------------|
| GOVERNANCE-001 | wave-current-tasks.md created | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | EXEMPT — foreman personal workspace (session memory class) | NOT QUALIFYING standalone |
| GOVERNANCE-002 | IAA Pre-Brief invoked | `.agent-admin/assurance/iaa-prebrief-wave15r-qa001.md` | META — this artifact | N/A |
| GOVERNANCE-003 | SCOPE_DECLARATION.md updated | `SCOPE_DECLARATION.md` | ADMIN/governance metadata | NOT QUALIFYING standalone |
| QP-EVAL-001 | QP evaluation of qa-builder deliverable | documented in PREHANDOVER proof | **AAWP_MAT (governance ceremony)** — evaluates a MAT QA deliverable | **QUALIFYING** |
| PREHANDOVER-001 | PREHANDOVER proof + session memory | `.agent-workspace/foreman-v2/memory/PREHANDOVER-*.md` + `session-*.md` | Ceremony artifacts for AAWP_MAT governance gate | **QUALIFYING** |
| IAA-AUDIT-001 | IAA final audit invoked | `.agent-admin/assurance/iaa-token-*.md` | META — IAA ceremony output | N/A |
| MERGE-001 | Merge gate released | N/A | Consequence of IAA verdict | NOT QUALIFYING |

### Primary Trigger Category: AAWP_MAT (GOVERNANCE_CEREMONY)

**Classification rationale**:

1. This PR is the formal governance closure for MAT QA deliverable T-W15R-QA-001.
2. The PREHANDOVER proof documents a QP evaluation of a MAT test file.
3. The wave task list explicitly names IAA-AUDIT-001 as a required task — confirming IAA invocation is mandatory.
4. Per the AMBIGUITY RULE (FAIL-ONLY-ONCE A-003): ambiguity resolves to mandatory invocation.
5. IAA is required for all AAWP/MAT governance gate ceremonies regardless of whether production
   code files appear in the diff.

**No secondary categories detected**:
- ❌ AGENT_CONTRACT — no `.github/agents/` files changed
- ❌ CANON_GOVERNANCE — no `governance/canon/` files changed
- ❌ CI_WORKFLOW — no `.github/workflows/` files changed
- ❌ KNOWLEDGE_GOVERNANCE — no `.agent-workspace/*/knowledge/` files changed
- ❌ AGENT_INTEGRITY — no `governance/quality/agent-integrity/` files changed

**IAA Triggered**: ✅ YES — MANDATORY
**AAWP_MAT governance ceremony overlay applies at IAA-AUDIT-001**

---

## SECTION 3 — FFA CHECKS IAA WILL RUN AT HANDOVER (IAA-AUDIT-001)

### FAIL-ONLY-ONCE Learning Checks (Phase 3, Step 3.1)

| Rule | Check | Expected at Handover |
|------|-------|---------------------|
| A-001 | IAA invocation evidence present | PREHANDOVER proof must reference IAA invocation (IAA-AUDIT-001 task) |
| A-003 | No ambiguity exploit | No claim that this PR is EXEMPT from IAA used to skip invocation |
| A-021 | Committed before invocation | All governance artifacts COMMITTED before IAA-AUDIT-001 is invoked |
| A-026 | SCOPE_DECLARATION.md matches diff | `git diff --name-only origin/main...HEAD` must exactly match declared scope (± A-031 carve-out for prior IAA ceremony artifacts) |
| A-028 | SCOPE_DECLARATION.md format | List format required; prior-wave entries trimmed |
| A-029 | PREHANDOVER token pre-populated | `iaa_audit_token` in PREHANDOVER proof pre-populated with expected reference `IAA-session-T-W15R-QA-001-wave15r-qa001-20260308-PASS` at commit time — not PENDING |
| A-031 | IAA ceremony artifact carve-out | If IAA ceremony artifacts from prior sessions appear in diff, A-031 note must be present in SCOPE_DECLARATION.md or they must be declared |

### Core Invariants (Phase 3, Step 3.2) — All 22 Checks Applied

| Check ID | Check Name | Application to This Wave |
|----------|-----------|--------------------------|
| CORE-001 | YAML frontmatter valid | N/A — no agent contract files in this PR |
| CORE-002 | Agent version correct | N/A |
| CORE-003 | Contract version present | N/A |
| CORE-004 | Identity block complete | N/A |
| CORE-005 | Governance block present | N/A — no agent contracts |
| CORE-006 | CANON_INVENTORY alignment | ✅ REQUIRED — verify no canoninventory entries broken |
| CORE-007 | No placeholder content | ✅ REQUIRED — verify no stubs/TODO in PREHANDOVER proof or session memory. NOTE: `iaa_audit_token` pre-populated with expected reference per A-029 is NOT a placeholder violation |
| CORE-008 | Prohibitions block present | N/A |
| CORE-009 | Merge gate interface present | N/A |
| CORE-010 | Tier 2 knowledge indexed | N/A |
| CORE-011 | Four-phase structure present | N/A |
| CORE-012 | Self-modification lock present | N/A |
| CORE-013 | IAA invocation evidence | ✅ REQUIRED — PREHANDOVER proof must reference IAA-AUDIT-001 and wave task confirms IAA invoked |
| CORE-014 | No class exemption claim | ✅ REQUIRED — verify no exemption claimed for foreman governance wave |
| CORE-015 | Session memory present | ✅ REQUIRED — `session-T-W15R-QA-001-20260308.md` must be on branch |
| CORE-016 | IAA verdict evidenced (§4.3b) | ✅ REQUIRED — dedicated IAA token file must exist at `.agent-admin/assurance/iaa-token-session-T-W15R-QA-001-wave15r-qa001-20260308.md` after verdict |
| CORE-017 | No .github/agents/ modifications | ✅ REQUIRED — verify no `.github/agents/` files in diff |
| CORE-018 | Complete evidence artifact sweep | ✅ REQUIRED — PREHANDOVER proof, session memory, `iaa_audit_token` field, dedicated token file all present |
| CORE-019 | IAA token cross-verification | ✅ REQUIRED — first invocation exception applies (token file will be created this session); verify token file does not reference a different PR |
| CORE-020 | Zero partial pass rule | ✅ REQUIRED — no assumed passes |
| CORE-021 | Zero-severity-tolerance | ✅ REQUIRED — any finding = REJECTION-PACKAGE, no soft verdicts |
| CORE-022 | Secret field naming compliance | N/A — no agent contract YAML in this PR |

### AAWP_MAT Governance Ceremony Overlay (Phase 3, Step 3.3)

> **Mindset applied**: For this governance-only PR, 90% of IAA effort = verifying the QP
> evaluation is properly documented and the OPOJD closure loop is correctly completed.
> 10% = ceremony admin (existence checks only).

**BD Checks Applied (BUILD_DELIVERABLE overlay — governance variant):**

| Check ID | Check Name | Application |
|----------|-----------|-------------|
| BD-001 | Full scope delivered | All 7 declared files must be present in PR diff. No partial delivery. |
| BD-002 | No stub/TODO in production paths | N/A — no production code in this PR |
| BD-003 | One-time governance closure | Ask: "If merged, is the governance loop for T-W15R-QA-001 / INC-OPOJD-W15R-QA-001 definitively closed without requiring another immediate remediation?" |
| BD-004 | No leftover debt from previous jobs | Verify INC-OPOJD-W15R-QA-001 is properly closed (Status: REMEDIATED documented); S-025 candidate A-033 resolution documented |
| BD-011 through BD-024 | Code quality / security / wiring | **NOT APPLICABLE** — this PR contains no production code, tests, migrations, APIs, or UI components |

**Governance-Specific Checks (additional at IAA-AUDIT-001):**

| Check ID | Check Name | What IAA Will Verify |
|----------|-----------|----------------------|
| GOV-001 | QP evaluation documentation | PREHANDOVER proof must include a QP evaluation section documenting: (a) the qa-builder deliverable reviewed (`modules/mat/tests/wave15r/wave15r-ux-features.test.ts`), (b) 35 assertions covering T-W15R-UX-001 through T-W15R-UX-005, (c) test run evidence (GREEN), (d) QP verdict: PASS or FAIL with rationale |
| GOV-002 | QA-to-Red bypass acknowledged | PREHANDOVER proof must acknowledge that the QA-to-Red gate sequence was bypassed (tests written post-implementation) and reference INC-OPOJD-W15R-QA-001 as the documented record |
| GOV-003 | INC-OPOJD-W15R-QA-001 closure | PREHANDOVER proof must include a closure statement: INC-OPOJD-W15R-QA-001 (Status: REMEDIATED) — corrective action: Issue #1000 created and closed by this PR |
| GOV-004 | S-025 / A-033 status | Verify Foreman FAIL-ONLY-ONCE v3.2.0 S-025 (DELEGATION-ISSUE-REQUIRED) is addressed — either promoted to A-033 or documented as actively pending in this PR's governance artifacts |
| GOV-005 | Issue #1000 closure linkage | PREHANDOVER proof must state: "Closes maturion-isms#1000" — ensuring the corrective action issue is closed by this PR |
| GOV-006 | Scope creep check | Verify no production code, test files, CI changes, or agent contract changes were introduced. If any such files appear in the diff that are not in the declared scope → REJECTION-PACKAGE |

**CERT (Ceremony) Checks:**

| Check ID | Check Name | Pass Condition |
|----------|-----------|----------------|
| CERT-001 | PREHANDOVER proof exists | Binary: file present on branch at declared path |
| CERT-002 | Session memory exists | Binary: `session-T-W15R-QA-001-20260308.md` present on branch |
| CERT-003 | FAIL-ONLY-ONCE attestation | Foreman session memory includes attestation to active rules |
| CERT-004 | Parking station updated | `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` entry present |

**FFA Summary Format at Handover:**
```
FFA Result (Governance Ceremony — T-W15R-QA-001):
  FFA-01 Delivery Completeness (BD-001): [PASS|FAIL] — all 7 declared files present
  FFA-02 QP Evaluation Documented (GOV-001): [PASS|FAIL] — evidence and verdict present
  FFA-03 OPOJD Closure Loop (GOV-002/GOV-003): [PASS|FAIL] — INC documented and closed
  FFA-04 Governance Integrity (GOV-004/GOV-006): [PASS|FAIL] — no scope creep, S-025 addressed
  FFA-05 Issue Linkage (GOV-005): [PASS|FAIL] — #1000 closure declared
  FFA-06 One-Time Governance Closure (BD-003): [PASS|FAIL] — loop definitively closed
  FFA-CARRY-FORWARD: [NONE|ISSUED] — S-025→A-033 promotion if deferred
```

---

## SECTION 4 — PREHANDOVER PROOF STRUCTURE REQUIRED

The PREHANDOVER proof must be committed at:
`.agent-workspace/foreman-v2/memory/PREHANDOVER-session-T-W15R-QA-001-20260308.md`

### Required Fields and Sections

```markdown
# PREHANDOVER Proof — T-W15R-QA-001 — Governance Closure

## Identity
- wave: wave15r-qa001
- branch: copilot/create-red-tests-wave-15r
- issue: maturion-isms#1000
- session_id: session-T-W15R-QA-001-20260308
- date: 2026-03-08
- producing_agent: foreman-v2-agent
- producing_agent_class: foreman

## IAA Audit Token (A-029 — pre-populated at commit time)
iaa_audit_token: IAA-session-T-W15R-QA-001-wave15r-qa001-20260308-PASS

## Scope Declaration Reference
- SCOPE_DECLARATION.md updated: YES
- Declared files: [list all 7 scope files]
- git diff origin/main match: [confirmed at commit time]

## QP Evaluation — T-W15R-QA-001 (QP-EVAL-001)
- Deliverable reviewed: modules/mat/tests/wave15r/wave15r-ux-features.test.ts
- Assertions count: 35
- Tests covered: T-W15R-UX-001, T-W15R-UX-002, T-W15R-UX-003, T-W15R-UX-004, T-W15R-UX-005
- Test execution evidence: [vitest run output or reference to test log]
- Test status: GREEN (implementation complete on main)
- QP verdict: PASS / FAIL with rationale
- QA-to-Red bypass acknowledged: YES — tests written post-implementation
- INC-OPOJD-W15R-QA-001 reference: REMEDIATED

## INC-OPOJD-W15R-QA-001 Closure
- Incident: Missing GitHub issue for T-W15R-QA-001 qa-builder delegation
- Status: REMEDIATED — Issue #1000 created; this PR closes the governance loop
- Corrective action: maturion-isms#1000 created 2026-03-08 by CS2 @APGI-cmy
- S-025 / A-033 status: [PROMOTED to A-033 / OPEN — candidate pending next FAIL-ONLY-ONCE revision]
- Closes: maturion-isms#1000

## Architecture Ripple/Impact Assessment (OVL-AM-004)
- Production code changed: NO
- Schema changed: NO
- Agent contracts changed: NO
- Canon/governance changed: NO
- CI/workflows changed: NO
- Ripple assessment: NONE REQUIRED — governance ceremony artifacts only

## Wave Gap Register (OVL-AM-005)
- Open gaps from prior waves carried forward: [list any, or NONE]
- New gaps introduced: [list any, or NONE]

## Environment Parity (OVL-AM-006)
- N/A — no production code, migrations, or environment configuration changed

## Session Memory Reference
- File: .agent-workspace/foreman-v2/memory/session-T-W15R-QA-001-20260308.md
- Status: COMMITTED on branch

## Parking Station
- Updated: YES — .agent-workspace/foreman-v2/parking-station/suggestions-log.md
```

### Critical Fields — IAA Will Hard-Fail if Missing

| Field | Rule | Consequence if Missing |
|-------|------|------------------------|
| `iaa_audit_token` pre-populated with expected reference | A-029 | CORE-007 FAIL — REJECTION-PACKAGE |
| QP Evaluation section with verdict | GOV-001 | REJECTION-PACKAGE |
| INC-OPOJD-W15R-QA-001 closure statement | GOV-003 | REJECTION-PACKAGE |
| `Closes: maturion-isms#1000` | GOV-005 | REJECTION-PACKAGE |
| Architecture Ripple/Impact Assessment section | OVL-AM-004 (from PREHANDOVER overlay v3.0.0) | REJECTION-PACKAGE |
| Wave Gap Register section | OVL-AM-005 | REJECTION-PACKAGE |
| Session memory file on branch | CORE-015 | REJECTION-PACKAGE |

---

## SECTION 5 — SCOPE BLOCKERS AND GOVERNANCE CONFLICTS VISIBLE NOW

### Blocker 1 — S-025 / A-033 Candidate Status (ADVISORY — not a blocker)

**Observation**: Foreman FAIL-ONLY-ONCE v3.2.0 records S-025 (DELEGATION-ISSUE-REQUIRED) as
`OPEN — Candidate for next A-rule (A-033)`. This suggests the corrective action from
INC-OPOJD-W15R-QA-001 may not be fully formalised.

**IAA requirement at handover**: The PREHANDOVER proof must declare the status of S-025.
Either: (a) S-025 has been promoted to A-033 in this PR, OR (b) S-025 remains a candidate
with a documented note explaining the deferral. If (b), IAA will issue a **Carry-Forward Mandate**
requiring A-033 promotion before the next wave that involves builder delegation.

**Severity**: ADVISORY (carry-forward) — does not block this PR provided it is documented.

### Blocker 2 — Tests are GREEN, not RED (GOVERNANCE DOCUMENTATION REQUIREMENT)

**Observation**: The 5 tests are already GREEN on `main` because implementation existed when
tests were written. This is the core QA-to-Red bypass that created INC-OPOJD-W15R-QA-001.

**IAA requirement at handover**: The QP Evaluation section in the PREHANDOVER proof must
**explicitly acknowledge** that the QA-to-Red protocol was bypassed. The Foreman cannot
present this as a standard QA-to-Red delivery. The governance closure is valid precisely
because INC-OPOJD-W15R-QA-001 documents the bypass and CS2 has issued the corrective directive.

**Severity**: DOCUMENTATION REQUIREMENT — not a merge blocker if properly documented.

### Blocker 3 — Pre-IAA Commit Gate Required (A-021 Critical)

**Observation**: At the time of this pre-brief, the branch contains only 1 commit ("Initial plan").
All governance artifacts (SCOPE_DECLARATION.md update, PREHANDOVER proof, session memory,
parking station update) are NOT YET COMMITTED.

**IAA requirement at handover**: Per FAIL-ONLY-ONCE A-021: **all artifacts must be committed and
pushed to the branch BEFORE invoking IAA-AUDIT-001**. IAA will reject any invocation where
`git status` shows uncommitted changes to declared scope files. This is a hard-blocking rule.
Evidence required in PREHANDOVER proof: `git log --oneline` showing all 7 scope files committed.

**Severity**: HARD BLOCKER if violated — REJECTION-PACKAGE per A-021.

### Blocker 4 — SCOPE_DECLARATION.md Must Match Exact Diff (A-026)

**Observation**: Per FAIL-ONLY-ONCE A-026, `SCOPE_DECLARATION.md` must match
`git diff --name-only origin/main...HEAD` exactly before IAA invocation.

**IAA requirement at handover**: IAA will run `git diff --name-only origin/main...HEAD` and
compare against the declared scope. Any file in the diff not declared in SCOPE_DECLARATION.md
(excluding IAA ceremony artifacts covered by A-031) = REJECTION-PACKAGE.

**Note**: If IAA ceremony artifacts from this session (the pre-brief artifact, session memory)
appear in the diff, the Foreman must include the A-031 carve-out note in SCOPE_DECLARATION.md:
> "IAA ceremony artifacts committed on branch (IAA pre-brief, IAA session memory)
> excluded from declaration per A-031 carve-out. These are IAA-owned files."

**Severity**: HARD BLOCKER if SCOPE_DECLARATION.md is stale at handover.

### No Other Blockers Visible

- ✅ INC-OPOJD-W15R-QA-001 is already recorded as REMEDIATED in Foreman FAIL-ONLY-ONCE v3.2.0
- ✅ Issue #1000 exists (CS2 created it) — the corrective action issue exists
- ✅ Test file `modules/mat/tests/wave15r/wave15r-ux-features.test.ts` is on `main` with 35 assertions
- ✅ No agent contract, canon, or CI files are in scope — no secondary trigger categories to manage
- ✅ Merge gate CI checks: merge-gate/verdict, governance/alignment, stop-and-fix/enforcement

---

## SECTION 6 — PRE-BRIEF SUMMARY

| Item | Value |
|------|-------|
| Wave | Wave 15R Batch C — T-W15R-QA-001 |
| IAA Triggered | ✅ YES — MANDATORY (AAWP_MAT governance ceremony) |
| Qualifying Tasks | 2 (QP-EVAL-001, PREHANDOVER-001) |
| Primary Trigger Category | AAWP_MAT (GOVERNANCE_CEREMONY) |
| Secondary Trigger Categories | NONE |
| Total FFA Checks at Handover | 22 CORE + CERT-001 through CERT-004 + GOV-001 through GOV-006 + FFA summary |
| Applicable FAIL-ONLY-ONCE Rules | A-001, A-003, A-021, A-026, A-028, A-029, A-031 |
| Hard Blockers Now | A-021 (must commit all artifacts before IAA-AUDIT-001) |
| Advisory Items Now | S-025/A-033 status; QA-to-Red bypass documentation requirement |
| PREHANDOVER Proof Required Sections | Identity, iaa_audit_token, Scope, QP Evaluation, INC-OPOJD Closure, Ripple/Impact, Wave Gap Register, Environment Parity, Session Memory Reference, Parking Station |
| Adoption Phase | PHASE_B_BLOCKING — hard gate active |

---

## SECTION 7 — IAA INVOCATION INSTRUCTION FOR IAA-AUDIT-001

When invoking IAA for IAA-AUDIT-001, the Foreman must:

1. **Ensure all artifacts are committed and pushed** (A-021) before invocation
2. **Confirm `git diff --name-only origin/main...HEAD` matches SCOPE_DECLARATION.md** (A-026)
3. **Confirm PREHANDOVER proof contains pre-populated `iaa_audit_token`** in the format:
   `IAA-session-T-W15R-QA-001-wave15r-qa001-20260308-PASS` (A-029)
4. **Include the following context in the IAA-AUDIT-001 invocation comment**:
   - PR number and branch
   - Issue: maturion-isms#1000
   - CS2 authorization: "Please finish this job" directive, @APGI-cmy, 2026-03-08
   - INC-OPOJD-W15R-QA-001 status: REMEDIATED
   - S-025/A-033 status: [declared]
   - Path to PREHANDOVER proof

---

**IAA Pre-Brief Status**: ✅ COMPLETE — artifact committed
**Next Step**: Foreman proceeds to GOVERNANCE-003, QP-EVAL-001, PREHANDOVER-001, then invokes IAA-AUDIT-001
**Adoption Phase**: PHASE_B_BLOCKING — verdicts at IAA-AUDIT-001 are HARD-BLOCKING

---

*Authority: CS2 (Johan Ras / @APGI-cmy) | IAA v6.2.0 | Contract v2.2.0 | 2026-03-08*
