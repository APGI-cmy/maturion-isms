# IAA Wave Record — {wave} — {date}

**Record Version**: 1.2.0
**Wave**: {wave}
**Branch**: {branch}
**Issue**: {issue_ref}
**Date Created**: {YYYY-MM-DD}
**Authority**: GOVERNANCE_ARTIFACT_TAXONOMY.md v2.0.0

---

## 1. Pre-Brief

### 1.1 Wave Summary
{2-5 sentence summary of the wave scope, goals, and deliverables}

### 1.2 Overall PR Category Classification
{MIXED / AGENT_CONTRACT / CANON_GOVERNANCE / CI_WORKFLOW / GOVERNANCE_EVIDENCE / APPLICATION_CODE / APPLICATION_TESTS}

### 1.3 Qualifying Tasks
| task_id | task_summary | iaa_trigger_category | required_phases | required_evidence_artifacts |
|---------|-------------|---------------------|-----------------|---------------------------|
| {id}    | {summary}   | {category}          | {phases}        | {artifacts}               |

### 1.4 Anti-Regression Checks (FAIL-ONLY-ONCE)
{List of applicable recurring patterns from the agent's FAIL-ONLY-ONCE registry. Each entry must reference the A-rule or B-rule ID and a one-line statement of the check.}

### 1.5 Pre-Brief Status
- Pre-Brief Date: {YYYY-MM-DD}
- Status: ACTIVE

### 1.6 Wave-Level Admin Ceremony Contract

**Contract Version**: {version — e.g. 1.0.0}
**Declared By**: {agent_id — Pre-Brief issuer}
**Declared At**: {YYYY-MM-DD}

#### Required Admin Ceremony Artifacts
| Artifact | Path | Required By |
|----------|------|-------------|
| {artifact_name} | {path} | {rule_or_rationale} |

#### Required Final-State Conditions
| Condition | Required State | Rule |
|-----------|---------------|------|
| {condition_description} | {YES/CONFIRMED/etc.} | {rule_id} |

#### Required Cross-Artifact Consistency Checks
| Check | Artifacts Involved | Rule |
|-------|-------------------|------|
| {check_description} | {artifact_1, artifact_2} | {rule_id} |

#### Required Acknowledgements
| Acknowledgement | Owner | Rule |
|----------------|-------|------|
| {acknowledgement} | {agent_id or role} | {rule_id} |

#### Required Role Boundaries
| Artifact/Task | Responsible Role | Rule |
|--------------|-----------------|------|
| {artifact_or_task} | {agent_id or role} | {rule_id} |

#### Required Handover References
| Reference | Where Expected | Rule |
|-----------|---------------|------|
| {reference_description} | {artifact_path or section} | {rule_id} |

---

## 2. PREHANDOVER Proof

> **IMMUTABILITY NOTICE**: This section is READ-ONLY after initial commit per A-029/A-019.
> No agent may modify this section after the commit that creates it.
> Any correction requires a new iaa-wave-record with the previous record marked INVALIDATED.

### 2.1 Session Metadata
- Session ID: {session-id}
- Date: {YYYY-MM-DD}
- Agent Version: {version}
- Issue Reference: {issue_ref}

### 2.2 Wave Description
{Detailed description of the wave work completed, including all tasks executed and their outcomes}

### 2.3 Builder(s)
{List of builder agents that executed work in this wave, with their agent IDs and task references}

### 2.4 Quality Professor Verdict
- QP Verdict: {PASS/FAIL}
- Tests: {✅/❌}
- Skipped: {✅/❌}
- Test Debt: {✅/❌}
- Artifacts: {✅/❌}
- Architecture: {✅/❌}
- Warnings: {✅/❌}

### 2.5 OPOJD Gate
- OPOJD: {PASS/FAIL}
- §4.3 Merge Gate Parity: {PASS/FAIL}
- CANON_INVENTORY: {ALIGNED/DEGRADED}

### 2.6 CS2 Authorization Evidence
{Reference to CS2 authorization — issue number, comment link, or session reference}

### 2.7 IAA Audit Token Reference
- Expected Token: IAA-session-{NNN}-wave-{wave}-{YYYYMMDD}-PASS
- Token Status: {PENDING_IAA_VERDICT / PASS / REJECTED}

### 2.8 Environment Parity
{Local vs CI environment parity details — Node version, test runner, governance tool versions}

### 2.9 Pre-IAA Commit Gate
{Commit gate checks — all files committed, no unstaged changes, branch up to date with base}

### 2.10 Ripple/Cross-Agent Assessment
{Cross-agent impact assessment — does this wave trigger governance ripple, affect other agents, or modify shared canon?}

---

## 3. IAA Assurance Verdict

> **APPEND-ONLY**: This section is written by the IAA agent AFTER the PREHANDOVER section is committed.
> The IAA appends its verdict here in a SUBSEQUENT commit. The PREHANDOVER section above MUST NOT change.

### 3.1 IAA Verdict
- Verdict: {PASS / REJECTED / BLOCKED_PENDING_RUNTIME_EVIDENCE / BLOCKED_PENDING_BUILD_CORRECTNESS / PASS_WITH_CS2_WAIVER / INVALID_PRIOR_TOKEN}
- Token: IAA-session-{NNN}-wave-{wave}-{YYYYMMDD}-{PASS/FAIL}
- Date: {YYYY-MM-DD}
- PHASE_B_BLOCKING_TOKEN: {token_ref — reference to the blocking token written by IAA to `.agent-admin/assurance/iaa-token-*`. This field links the wave record to the standalone token file that IAA creates as its formal verdict artifact.}

### 3.2 Acceptance-Criteria Evidence Matrix

> **MANDATORY before any PASS token (§Evidence-First Assurance Mandate Rule 1).**
> IAA must extract every acceptance criterion from the governing issue and map each to hard evidence.
> Agent claims, PREHANDOVER attestations, and QP claims are NOT evidence — they may only point to evidence.
> Any non-waived criterion without hard evidence = REJECTED.

| # | Criterion (from governing issue) | Issue Intent / Operational Intent | Required Evidence Type | Submitted Evidence Reference | IAA Independent Verification | Verdict |
|---|---|----|---|---|---|---|
| 1 | {criterion text} | {what this criterion is trying to ensure in operation} | {STATIC_CODE / CONFIG / ARTIFACT / CI_TEST / LIVE_RUNTIME / LIVE_E2E} | {file path, CI run URL, log, hash, screenshot — NOT an agent claim} | {IAA check: what was verified and how} | {PASS / FAIL / N/A / WAIVED — waiver ref if applicable} |

**Matrix status**: {COMPLETE — all {N} criteria mapped and verified / INCOMPLETE — {list unmet criteria}}

### 3.3 Build-Correctness Assessment

> **Mandatory for T1 and T2 PRs (§Evidence-First Assurance Mandate Rule 2).**

- **Issue intent satisfied** (not just literal wording): {YES / NO — detail}
- **Architecture requirements followed**: {YES / NO — detail}
- **Deployment / runtime / security / schema contracts preserved**: {YES / NO — detail}
- **No papering over failures** (stubs, skips, static-only evidence for runtime requirements): {YES / NO — detail}
- **Functional outcome demonstrated**: {YES / NO — evidence reference}
- **Operational success condition identified and evidenced**: {YES / NO — success condition: [description] | evidence: [reference]}

**Build-Correctness Gate**: {PASS / FAIL — detail}

### 3.4 Independent Risk Challenge

> **Mandatory before every PASS token (§Evidence-First Assurance Mandate Rule 6).**
> Answers must be substantive — not template placeholders or single-word responses.

1. **What could still fail after merge?**
   {List at least one plausible failure mode, or: "No plausible failure mode identified — rationale: [reason]"}

2. **What evidence would prove it does not fail?**
   {For each failure mode: the specific evidence that would confirm the risk is mitigated}

3. **Is that evidence present?**
   {YES — evidence reference / NO — blocks PASS; issue BLOCKED_PENDING_RUNTIME_EVIDENCE or REJECTED}

4. **Is there any contradiction between issue intent, architecture requirements, and PR evidence?**
   {Explicit comparison of issue intent vs delivered implementation vs architecture — YES [detail] / NO}

5. **Would a reasonable production owner accept this as merge-ready?**
   {YES — rationale / NO — blocks PASS; issue REJECTED or BLOCKED_PENDING_BUILD_CORRECTNESS}

**Independent Risk Challenge**: {COMPLETE — no unmitigated risks / INCOMPLETE — {unresolved items}}

### 3.5 IAA Agent Response (verbatim)
<!-- ASSEMBLY_TIME_ONLY: Replace this instruction text with actual verbatim IAA response before final handback. Leaving this block in place in a committed final-state artifact will fail §4.3e Check C2 and trigger AAP-17/ACR-09 rejection. -->
{Verbatim IAA response — pasted without modification. Do not summarise, interpret, or redact.}

### 3.6 Evidence Reviewed
{Itemised list of evidence artifacts reviewed by IAA, with file paths and SHA256 checksums where applicable}

---

## 4. Rejection History

> This section tracks any rejection-and-resubmission cycles for this wave.
> Capped at: 1 INVALIDATED + 1 final per artifact type.
> If a second rejection occurs, the prior INVALIDATED record is archived and only
> the latest INVALIDATED + current attempt are retained.

### 4.1 Rejection Log
| Attempt | Date | Verdict | Rejection Reason Summary | Remediation |
|---------|------|---------|--------------------------|-------------|
| {N}     | {YYYY-MM-DD} | {PASS/FAIL} | {summary} | {remediation action taken} |

### 4.2 Invalidated Records
{If previous version was invalidated, reference it here. Max 1 invalidated record.}
{Format: `INVALIDATED: iaa-wave-record-{wave}-{date}.md — replaced by this record on {date}`}

---

## 5. Record Metadata
- Record Schema Version: 1.2.0
- Created By: {agent_id}
- Last Modified By: {agent_id}
- Last Modified Date: {YYYY-MM-DD}
- Immutability Lock: Section 2 locked after initial commit
- File Naming Convention: `iaa-wave-record-{wave}-{date}.md`
- Storage Location: `.agent-admin/assurance/`
