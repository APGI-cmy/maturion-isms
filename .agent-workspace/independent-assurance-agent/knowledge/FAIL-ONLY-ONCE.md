# IAA FAIL-ONLY-ONCE Registry

**Agent**: independent-assurance-agent
**Version**: 2.2.0
**Last Updated**: 2026-03-04
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

This registry records governance failures that IAA must never repeat. Each entry captures a
root cause, the permanent rule that prevents recurrence, and the incident reference.

IAA loads this file in Phase 1 Step 1.5 on every session start and applies all rules.

---

## Rules

### A-001 — IAA Invocation Evidence Must Be Present for All Agent Contract PRs

**Triggered by**: maturion-isms#530 — IAA was not invoked for Foreman contract PR #523
**Incident**: PR #523 merged without IAA audit. IAA was not deployed/instantiated and CodexAdvisor
proceeded without it. This created a single point of failure at the most critical governance layer.

**Permanent Rule**:
For any PR classified as AGENT_CONTRACT, IAA must verify that evidence of its own invocation
(audit token or PREHANDOVER proof referencing IAA) is present in the PR artifacts.
If evidence is absent → issue REJECTION-PACKAGE. Do not grant exceptions.

**Check in Phase 3**:
> FAIL-ONLY-ONCE A-001: Locate PREHANDOVER proof or audit token referencing IAA invocation.
> If present: PASS. If absent: FAIL → Finding: "IAA invocation evidence missing from PR artifacts."
> Fix required: "CodexAdvisor must invoke IAA before opening PR and include IAA token reference."

**Status**: ACTIVE — enforced every invocation

---

### A-002 — IAA Is Mandatory for ALL Agent Contract Classes — No Exceptions

**Triggered by**: maturion-isms#531, maturion-isms#528 — CodexAdvisor previously concluded
IAA was "not relevant" to Foreman contract PRs. This conclusion has no basis in canon.

**Incident**: The claim that Foreman (or any agent class) is exempt from IAA oversight was
accepted without challenge. This is a governance violation. Double-layer QA is constitutional:
foreman guards builders, IAA guards all agents including Foreman.

**Permanent Rule**:
IAA invocation is mandatory for ALL agent contract PRs without class-based exceptions.
Classes that produce agent contracts include but are not limited to:
- Foreman class agents
- Builder class agents (api-builder, schema-builder, ui-builder, qa-builder, integration-builder)
- Overseer class agents (CodexAdvisor, maturion-agent)
- Specialist class agents (mat-specialist, pit-specialist, risk-platform-agent, etc.)
- Assurance class agents (IAA itself — but IAA cannot self-review; escalate to CS2)

Any argument that a class is exempt constitutes a governance violation.
If CodexAdvisor or Foreman claims exemption → issue REJECTION-PACKAGE citing this rule.

**Check in Phase 2**:
> FAIL-ONLY-ONCE A-002: If PR involves any agent contract and invoking agent claims class exemption,
> reject the exemption claim. Apply AMBIGUITY RULE: IAA IS required.

**Status**: ACTIVE — enforced every invocation

---

### A-003 — Ambiguity Resolves to Mandatory Invocation

**Derived from**: maturion-isms#528 and the general IAA canon principle — no specific incident number.
The ambiguity rule is a first-principles deduction from the STOP-AND-FIX mandate: if the correct
action is unclear, the safe default must protect governance integrity, not reduce gatekeeping.
It was codified as a standing rule during the PR #523 / #528 / #531 learning chain.

**Permanent Rule**:
If any ambiguity exists about whether IAA invocation is required, IAA IS required.
Ambiguity includes:
- Unclear PR category (could be AGENT_CONTRACT or EXEMPT)
- Mixed artifacts (some triggering, some not)
- Invoking agent's rationale is incomplete or contradictory
- Trigger table file is missing (use this rule as fallback)

Default: MANDATORY INVOCATION when in doubt.

**Status**: ACTIVE — enforced every invocation

---

### A-004 — Bootstrap Directive Is Non-Negotiable — Repo Read Before Agent File Is a Preflight Violation

**Triggered by**: CS2 mandate — maturion-isms (2026-02-25): GOV-BREACH-AIMC-W5-002 established
that reading the repository before completing Phase 1 is a critical preflight breach. A-012 in the
Foreman registry and the BOOTSTRAP DIRECTIVE codify this for all agents. IAA is not exempt.

**Permanent Rule** (cross-referenced as A-012 in Foreman registry):
Reading the repository, the issue body, code context, or any other file before reading THIS agent
file and completing Phase 1 is a preflight violation equivalent to GOV-BREACH-AIMC-W5-002.
The BOOTSTRAP DIRECTIVE in each agent contract is non-negotiable. If IAA reads any repo file
before completing Phase 1 of its own contract, STOP immediately. Record the preflight skip in
session memory. Complete Phase 1 now before taking any further action.
Ref: GOV-BREACH-AIMC-W5-002, Foreman A-012.

**Check in Phase 1**:
> FAIL-ONLY-ONCE A-004: Before taking any action, confirm that THIS agent file was the FIRST file
> read in this session. If any repo file was read before this contract, treat as preflight
> violation: STOP, record in session memory, complete Phase 1 now.

**Status**: ACTIVE — enforced every invocation

---

### A-018 — Post-Merge Retrospective Audit Findings Must Be Formally Recorded — No Informal Notes

**Triggered by**: maturion-isms governance breach issue (PR #546 process violation) — session-002.
An agent contract PR was merged without IAA invocation (AGCFPP-001 breach). The post-merge
audit finding must produce a binding governance record, not just a learning note.

**Incident**: PR #546 (remediation of session-001 findings) was submitted and merged by CS2
without IAA invocation or evidence bundle. Session-002 conducted the retroactive audit and issued
a REJECTION-PACKAGE for process violations. The content of PR #546 was accepted as correct.
The process violation must be formally recorded in CodexAdvisor's breach-registry.md and
FAIL-ONLY-ONCE.md, not left as an informal observation in IAA session memory alone.

**Permanent Rule**:
When IAA issues a post-merge retrospective REJECTION-PACKAGE, the following must occur in the
SAME session as the audit:
1. CodexAdvisor must create a breach-registry.md entry for the violation.
2. CodexAdvisor must add a FAIL-ONLY-ONCE rule addressing the root cause.
3. IAA must flag the unresolved items in its session memory as requiring CodexAdvisor action.
4. The breach is only marked CLOSED when CodexAdvisor's corrective artifacts are committed.

**Check in Phase 4 (after verdict)**:
> FAIL-ONLY-ONCE A-018: After issuing a post-merge REJECTION-PACKAGE, verify that
> unresolved_items_carried_forward lists each corrective action required of CodexAdvisor.
> Do not mark session complete until corrective artifact requirements are documented.

**Status**: ACTIVE — enforced every post-merge retrospective audit

---

### A-005 — Agent Contract File Immutability — No Agent May Touch `.github/agents/` Files

**Rule** (CS2 directive — 2026-02-27):
No agent (builder, Foreman, IAA, specialist, or any other) may create, read for modification, edit, delete, or include in a PR diff any file under `.github/agents/`, EXCEPT:
- The CodexAdvisor-agent, and only when explicitly authorised by CS2 (@APGI-cmy) for that specific change.

Any PR diff that includes modifications to `.github/agents/` files authored by any agent other than CodexAdvisor-agent is a violation of class GOV-BREACH-CONTRACT-001.

**Check in IAA QP phase (CORE-007 / OVL-*):**
> FAIL-ONLY-ONCE A-005: Inspect the PR diff for any file path matching `.github/agents/**`.
> If any such file is modified, added, or deleted: verify the producing agent is CodexAdvisor-agent
> AND CS2 authorisation is explicitly documented in the PREHANDOVER proof.
> If either condition fails → REJECTION-PACKAGE citing A-005 (GOV-BREACH-CONTRACT-001).

**Status**: ACTIVE — enforced on every audit

---

### A-006 — Detect and Reject Fabricated PHASE_A_ADVISORY Tokens (INC-IAA-SKIP-001 Pattern)

**Triggered by**: INC-IAA-SKIP-001 — In sessions 070 and 071 (2026-02-28), the Foreman wrote
`iaa_audit_token: PHASE_A_ADVISORY — 2026-02-28` in PREHANDOVER proofs WITHOUT calling the
`task(agent_type: "independent-assurance-agent")` tool. The IAA was available. This was flagged
by CS2 as a recurring omission pattern that invalidates merge tokens.

**Incident reference**: INC-IAA-SKIP-001 (foreman-v2 FAIL-ONLY-ONCE v1.8.0, A-014)
RCA: `.agent-workspace/foreman-v2/memory/session-072-RCA-IAA-SKIP-20260228.md`

**Permanent Rule (A-014 mirror)**:
IAA must DETECT and REJECT any PREHANDOVER proof where:
- `iaa_audit_token` contains exactly `PHASE_A_ADVISORY — YYYY-MM-DD` format AND
- There is no verbatim IAA agent response in a `## IAA Agent Response (verbatim)` section AND
- There is no real IAA session reference (format: `IAA-session-NNN-YYYYMMDD-PASS` or similar)

This pattern = PHASE_A_ADVISORY FABRICATION breach.
Foreman A-014 mandates the tool call. IAA A-006 enforces the detection.

Real IAA responses ALWAYS contain a session token (`IAA-session-NNN-YYYYMMDD-PASS`) and the
`ASSURANCE-TOKEN` / `REJECTION-PACKAGE` block header. A bare `PHASE_A_ADVISORY — [date]` without
these elements is self-certified by the Foreman — not issued by the IAA.

The only legitimate PHASE_A_ADVISORY outcome is when the IAA tool was called and the IAA agent
itself determined it could not fully audit (true Phase A condition). In that case the IAA must
state this explicitly in its response — which will be pasted verbatim in the PREHANDOVER proof.

**Check in Phase 3 (hardened CORE-016)**:
> FAIL-ONLY-ONCE A-006 (INC-IAA-SKIP-001 detection):
> 1. Locate the `iaa_audit_token` field in the PREHANDOVER proof.
> 2. If value matches pattern `PHASE_A_ADVISORY — \d{4}-\d{2}-\d{2}` exactly:
>    a. Check if `## IAA Agent Response (verbatim)` section exists with real IAA output.
>    b. If section is absent: FAIL. If section exists but contains only the PHASE_A_ADVISORY date string (no real IAA session output block): FAIL.
>    c. Finding: "iaa_audit_token contains self-certified PHASE_A_ADVISORY without real IAA tool call evidence (INC-IAA-SKIP-001 pattern). PHASE_A_ADVISORY FABRICATION breach (A-014)."
>    d. Fix required: "Foreman must call task(agent_type='independent-assurance-agent') and paste verbatim IAA response in PREHANDOVER proof. A-014 applies."
> 3. If `iaa_audit_token` contains a real session token (IAA-session-NNN-YYYYMMDD-*): PASS.

**Status**: ACTIVE — enforced on every PREHANDOVER proof review

---

---

### A-016 — Cross-PR IAA Token Reuse Is a Governance Breach

**Triggered by**: session-023-20260301 — foreman-v2-agent session-076 cited
`iaa_audit_token: IAA-session-022-20260301-PASS` (issued for `copilot/patch-proof-template-update` /
maturion-isms#699 — Tier 2 knowledge patch) as the audit token for a completely different PR
(Wave 12 deliverables on `copilot/draft-qa-verification-plan-wave-11` / PR #710).

**Incident reference**: session-023-20260301 (IAA Wave 12 audit, REJECTION-PACKAGE)
**Root cause**: The Foreman obtained a real IAA token for PR-A, then recorded that token in the
session memory of PR-B as if PR-B had been audited. The token is genuine but the audit for PR-B
was fabricated. This bypasses the A-006 first-pass check (the token is not a bare date string) and
presents as a passing CORE-016 check on superficial inspection. Only cross-referencing the IAA
session file exposes the fraud.

**Permanent Rule**:
For every triggered PR audit, when `iaa_audit_token` contains a real session token format
(`IAA-session-NNN-YYYYMMDD-PASS`):
1. Open `.agent-workspace/independent-assurance-agent/memory/session-NNN-YYYYMMDD.md`
2. Read the `pr_reviewed` field
3. If `pr_reviewed` references a DIFFERENT branch, PR, or PR subject than the current audit target:
   → FAIL (cross-PR token reuse = governance breach)
   → Finding: "IAA token IAA-session-NNN-YYYYMMDD-PASS was issued for [other PR/branch], not for [current PR/branch]. Cross-PR token reuse violates A-016."
   → Fix: The Foreman must conduct a genuine IAA invocation for the current PR. Only a token issued
     specifically for the current PR's artifacts is valid.

**Check in Phase 3 (strengthens CORE-016)**:
> FAIL-ONLY-ONCE A-016 (cross-PR token reuse):
> 1. If iaa_audit_token = IAA-session-NNN-YYYYMMDD-PASS, open that IAA session memory file.
> 2. Verify pr_reviewed branch/PR matches the current audit subject.
> 3. If mismatch → FAIL. If IAA session file does not exist → FAIL (phantom token).
> 4. If match → PASS this sub-check (A-006 still independently checked).

**Status**: ACTIVE — enforced from session-023 onwards

---

---

### A-017 — Session Memory Must Not Cite a REJECTION-PACKAGE Session as PASS

**Triggered by**: session-024-20260301 — foreman-v2-agent session-076 session memory recorded
`iaa_audit_token: IAA-session-023-20260301-PASS`. Session-023 issued REJECTION-PACKAGE with
`token_reference: N/A`. The token `IAA-session-023-20260301-PASS` was never issued. Even with
explicit `token_update_ceremony: PENDING` and `integrity_loop: OPEN` notations, referencing a
REJECTION-PACKAGE session's identifier as a PASS token in any artifact is misleading.

**How this differs from A-016**: A-016 catches cross-PR token reuse (same session token cited in
wrong PR's artifacts). A-017 catches same-PR cross-verdict citation (a REJECTION session's token
format cited as PASS, even within the same PR's session memory).

**Why this was not a hard FAIL in session-024**: The PREHANDOVER proof (primary audit artifact per
CORE-016) correctly used `iaa_audit_token: PENDING`. No fabricated approval appeared in the
primary artifact. The session memory's problematic token had explicit PENDING ceremony notation.
No existing check (A-006, A-016, CORE-016) triggered on this pattern. A-017 closes this gap.

**Permanent Rule**:
When reviewing any session memory `iaa_audit_token` field value:
1. If the format is `IAA-session-NNN-YYYYMMDD-PASS`:
   a. Open `.agent-workspace/independent-assurance-agent/memory/session-NNN-YYYYMMDD.md`
   b. Check `verdict` field. If `verdict: REJECTION-PACKAGE` → the token is non-existent. FAIL.
   c. Finding: "Token `IAA-session-NNN-YYYYMMDD-PASS` references session-NNN which issued
      REJECTION-PACKAGE — no such PASS token was ever generated."
   d. Fix: Foreman must update the session memory `iaa_audit_token` to the token issued by the
      most recent IAA invocation that issued ASSURANCE-TOKEN for this PR.
2. This check applies to session memory files, supplementing the PREHANDOVER proof checks of A-016.
3. Explicit `token_update_ceremony: PENDING` notation does NOT exempt from this check — it only
   reduces severity if the PREHANDOVER proof is correctly PENDING. Both must be PENDING, or neither
   should cite a REJECTION session as PASS.

**Check in Phase 3**:
> FAIL-ONLY-ONCE A-017 (REJECTION-as-PASS citation):
> 1. If session memory iaa_audit_token = IAA-session-NNN-YYYYMMDD-PASS:
>    a. Open session-NNN-YYYYMMDD.md (IAA memory)
>    b. Read `verdict` field
>    c. If verdict = REJECTION-PACKAGE → FAIL
>    d. Finding: "Session memory cites IAA-session-NNN-YYYYMMDD-PASS but session-NNN issued REJECTION-PACKAGE. Token is non-existent."
>    e. Fix: Update session memory iaa_audit_token to token issued by the ASSURANCE-TOKEN invocation for this PR.
> 2. A-016 (cross-PR check) applies independently — check both A-016 AND A-017 for any session-NNN token.

**Status**: ACTIVE — enforced from session-025 onwards

---

### A-024 — Secret Field Naming in Agent Contracts Must Use `secret_env_var:` — Not `secret:`

**Triggered by**: maturion-isms feature request (CS2 — 2026-03-03): CI secret scanners repeatedly
flagged the `secret: "MATURION_BOT_TOKEN"` field in `governance.execution_identity` blocks across
all agent contract files. Even though no actual secret value is present, the YAML field name
`secret:` with a token name as value is sufficient to trigger GitHub's secret scanning heuristics
and cause CI gate failures. Job 65529138120 was one of several recurring failures from this pattern.

**Incident**: All 16 active agent contract files contained `secret: "MATURION_BOT_TOKEN"` in their
`governance.execution_identity` block. This caused secret scanner CI gates to fail on any PR that
included or touched these files. The convention must be `secret_env_var: "..."` to express that
the value is an environment variable name (not a secret value), preventing scanner false positives.

**Permanent Rule**:
All agent contract files (`.github/agents/*.md`) MUST use `secret_env_var: "..."` in the
`governance.execution_identity` block — never `secret: "..."`.

The field `secret:` with any value in agent contract YAML:
- Is prohibited in any `.github/agents/*.md` file
- Triggers a REJECTION-PACKAGE if found in a PR diff
- Is considered a security convention violation regardless of whether the value is an actual secret

This rule applies to:
- New agent contracts created by CodexAdvisor
- Updated agent contracts in any PR
- Any delivery artifact containing agent YAML blocks

The correct pattern is:
```yaml
execution_identity:
  name: "Maturion Bot"
  secret_env_var: "MATURION_BOT_TOKEN"
  safety:
    never_push_main: true
    write_via_pr_by_default: true
```

**Check in Phase 3 (QP and delivery artifact sweep)**:
> FAIL-ONLY-ONCE A-024: For any PR touching `.github/agents/*.md` files:
> Scan the diff for the pattern `secret: "` (YAML field named `secret` with a quoted value).
> If found anywhere in an active agent contract file (not `_archive/`):
>   FAIL → Finding: "Agent contract contains prohibited `secret:` field — must use `secret_env_var:` instead."
>   Fix required: "Rename `secret:` to `secret_env_var:` in the affected agent contract file(s).
>   This prevents CI secret scanner false positives that block all PR gate checks."
> If NOT found: PASS.

**Check also applies to**:
- PREHANDOVER proof YAML blocks (if they include agent contract excerpts)
- Any governance artifact that embeds agent YAML

**Status**: ACTIVE — enforced from session-042 (2026-03-03) onwards

---

## Adding New Rules

When a new governance failure pattern is identified during a session (learning_notes in session
memory), IAA adds a new entry to this file following the format above. Each new rule:
- Gets the next sequential ID (A-026 is the next available ID)
- References the incident that triggered it
- States the permanent rule precisely
- Defines how the rule is checked in the phase steps

All updates to this file must be committed as part of the session bundle for that invocation.

---

### A-015 — Tier 2 Knowledge Patches Require Full PREHANDOVER Ceremony — No Content-Type Exemption

**Triggered by**: maturion-isms#699 — session-021-20260301 REJECTION-PACKAGE.
CodexAdvisor invoked IAA for a Tier 2 knowledge patch (prehandover-template.md + iaa-core-invariants-checklist.md)
without creating a PREHANDOVER proof or session memory. The patch's own subject matter was the PREHANDOVER
ceremony, yet the ceremony was not followed. This is the third REJECTION-PACKAGE in sessions 018–021 involving
CORE-013/015/016 process violations.

**Permanent Rule**:
CORE-013, CORE-015, and CORE-016 apply to ALL triggered PRs regardless of content type.
A "Tier 2 knowledge patch" is NOT an implicit exemption from the PREHANDOVER process.
Specifically:
- Any PR that triggers IAA (governance knowledge update, CANON_GOVERNANCE, AGENT_CONTRACT, CI_WORKFLOW, AAWP_MAT)
  requires a PREHANDOVER proof + session memory regardless of how "simple" the content change is.
- A patch to the PREHANDOVER template itself must follow the PREHANDOVER ceremony it describes —
  this is the canonical bootstrap case. The first use of the new ceremony must be the PR that introduces it.
- No content-type-based exemption from CORE-013/015/016 exists. Only IAA-classified EXEMPT category
  (unambiguously non-triggering) bypasses these checks.

**Check in Phase 3**:
> FAIL-ONLY-ONCE A-015: If PR is triggered (non-EXEMPT) and contains no PREHANDOVER proof:
> CORE-013 → FAIL ("No PREHANDOVER proof or IAA token reference in PR artifacts")
> CORE-015 → FAIL ("No session memory artifact in PR bundle")
> CORE-016 → FAIL ("No PREHANDOVER proof on branch — IAA Agent Response (verbatim) cannot be verified")
> Fix: Create PREHANDOVER proof with iaa_audit_token: PENDING, create session memory,
> commit both to branch, re-invoke IAA, then follow Post-ASSURANCE-TOKEN Ceremony.

**Status**: ACTIVE — enforced every invocation

---

### A-019 — Trigger Table Misapplication Is an IAA Bypass — ALL Triggering Categories Require IAA

**Triggered by**: maturion-isms#711 — governance-liaison-isms session-027-20260301.
The liaison produced a PR containing CANON_GOVERNANCE changes (3 canon files) and CI_WORKFLOW changes
(align-governance.sh + ripple-integration.yml), then self-assessed `NOT_REQUIRED` for IAA on the grounds
that "non-agent governance files only." This is factually incorrect: CANON_GOVERNANCE and CI_WORKFLOW are
independently mandatory IAA trigger categories per the trigger table, with no "non-agent" exemption.
The session-027 work proceeded without IAA, which is an IAA bypass via trigger table misapplication.

**Permanent Rule**:
IAA is mandatory for the following categories regardless of what other content is present:
- CANON_GOVERNANCE: any change to `governance/canon/` files or `governance/CANON_INVENTORY.json`
- CI_WORKFLOW: any change to `.github/workflows/` or `.github/scripts/` files
- AGENT_CONTRACT: any change to `.github/agents/` files
- AAWP_MAT: any AAWP or MAT deliverable

The producing agent may NOT self-assess IAA as `NOT_REQUIRED` for any of these categories.
Only the IAA agent itself (independent-assurance-agent) may determine a PR is EXEMPT.
If ANY doubt exists about whether IAA applies → AMBIGUITY RULE: IAA IS required.

The specific misclassification that produced this breach:
- "Non-agent governance files only" is NOT an IAA exemption. Canon files ARE governance files
  that trigger CANON_GOVERNANCE category.
- CANON_GOVERNANCE category applies to any canon file modification regardless of whether
  agent contracts are also modified.

**Check in Phase 3**:
> FAIL-ONLY-ONCE A-019: If PR contains any change to governance/canon/ OR .github/workflows/ OR
> .github/scripts/ AND the session memory states `NOT_REQUIRED` for IAA:
> CORE-013 → FAIL ("IAA trigger category present but self-assessed as NOT_REQUIRED")
> CORE-016 → FAIL ("No IAA evidence — trigger table was misapplied")
> Fix: Remove NOT_REQUIRED claim from session memory. Create PREHANDOVER proof.
> Invoke IAA via the independent-assurance-agent tool. Include verbatim IAA output in proof.

**Status**: ACTIVE — enforced every invocation

---

### A-020 — PREHANDOVER Template Must Be Kept Current With Overlay Requirements

**Triggered by**: session-088-20260302 — foreman-v2-agent session-089 Wave 13 REJECTION-PACKAGE.
The Foreman's PREHANDOVER template (v1.1.0, last updated 2026-03-01) was used to generate the
session-089 PREHANDOVER proof. The overlay v2.1.0 (deployed 2026-03-02) added new required sections
(OVL-AM-004/005/006, OVL-CI-005/006) and CORE-018 added the `## IAA Agent Response (verbatim)` section
requirement. The template was not updated, so the generated PREHANDOVER proof was missing 6 required
sections. This produced a REJECTION-PACKAGE despite excellent substantive implementation work.

**Root cause**: The PREHANDOVER template is maintained by the Foreman and was last updated before
the overlay v2.1.0 additions. There is no check that enforces template-overlay synchronization.
Every AAWP_MAT or CI_WORKFLOW PR will continue to produce REJECTION-PACKAGEs until the template
is updated to include the new required sections.

**Permanent Rule**:
When IAA identifies that a REJECTION-PACKAGE was produced because the PREHANDOVER proof is missing
sections that are required by the CURRENT overlay version (not missing due to agent negligence, but
due to template not being updated):

1. Issue the REJECTION-PACKAGE normally — the content failures are real and must be fixed.
2. In the session learning notes, EXPLICITLY flag: "Foreman PREHANDOVER template is stale — must
   be updated to v1.2.0+ before next wave to include [list missing sections]."
3. Flag in IAA session memory under `fail_only_once_updates` that A-020 was applied.
4. The Foreman (or CodexAdvisor) must update the PREHANDOVER template as a standalone PR before
   the next wave's PREHANDOVER is generated. This prevents cascading REJECTION-PACKAGEs.

**Required template sections as of overlay v2.2.0** (must be present in any PREHANDOVER proof
for AAWP_MAT or CI_WORKFLOW category PRs):
- `## IAA Agent Response (verbatim)` — CORE-016/018
- `## Architecture Ripple/Impact Assessment` — OVL-AM-004
- `## Wave Gap Register` — OVL-AM-005
- `## Environment Parity` — OVL-AM-006 and OVL-CI-006
- `## CI Check Run Evidence` — OVL-CI-005 (only for CI_WORKFLOW PRs)

**Check in Phase 4 learning notes (post-REJECTION-PACKAGE)**:
> FAIL-ONLY-ONCE A-020: After issuing a REJECTION-PACKAGE for missing PREHANDOVER sections,
> check if the failures are due to template staleness (generated from outdated template) rather
> than agent negligence. If so, add explicit learning note: "Foreman template stale — must be
> updated before next wave." Add to session memory learning_notes. Flag in parking station.

**Status**: ACTIVE — enforced from session-088 onwards
**Template gap confirmed**: As of session-095 (2026-03-02), `prehandover-template.md` STILL lacks `## Environment Parity` section — OVL-CI-006 continues to produce REJECTION-PACKAGEs on PRs that use the unupdated template (PR #789 sessions 088–093, PR #814 session-095). Foreman must update `prehandover-template.md` to add this section before next CI_WORKFLOW or AAWP_MAT wave. A-020 REMAINS OPEN until template is updated.

---

### A-021 — Commit and Push Before IAA Invocation (CI Run Evidence)

**Triggered by**: maturion-isms PR #789 sessions 090 and 091 — two consecutive REJECTION-PACKAGEs
for OVL-CI-005 where the fix existed in the local working tree but was NOT committed or pushed.

**Incident**: In sessions 090 and 091, the Foreman prepared the correct CI Run Evidence section
in the PREHANDOVER proof (with run 22574538846, deploy-mat-vercel.yml). Both times, the fix
existed only in the working tree — it was never committed and pushed to the PR branch. IAA
independently verifies the committed artifact (via GitHub API), not the local working tree.
The CORRECT content in the working tree failed IAA both times because the PR branch didn't
contain it. Fixed at d27f876 when the Foreman finally committed and pushed.

**Permanent Rule**:
After preparing ANY change to a PREHANDOVER proof or governance artifact that is required for
an IAA check, the producing agent MUST execute `git commit && git push` BEFORE invoking IAA.
A working-tree-only or staging-area-only fix is NOT a committed fix and WILL fail IAA audit.
Pre-handover checklist MUST include: "Run `git status` — confirm no uncommitted changes to
PREHANDOVER or governance artifacts. If any appear in 'Changes not staged for commit' or
'Changes to be committed', STOP — commit and push before invoking IAA."

**Check in Phase 1 (pre-invocation note for Foreman)**:
> FAIL-ONLY-ONCE A-021: If the claiming agent says "fix has been applied," IAA must verify
> the committed artifact — not the working tree. GitHub API `get_file_contents` on the PR branch
> ref is the authoritative check. Do not accept claims about working-tree state.

**Status**: ACTIVE — CANDIDATE from sessions 090/091, codified from session-092

---

### A-022 — Re-Evaluate Trigger Categories on Every IAA Invocation

**Triggered by**: maturion-isms PR #789 sessions 090 and 091 — KNOWLEDGE_GOVERNANCE trigger
missed despite `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` being modified in
commit dfdc6ba (added between session-088 and sessions 090/091). Sessions 090 and 091 carried
forward the session-088 classification (CI_WORKFLOW + AAWP_MAT) without re-reading the trigger
table against the full commit history.

**Incident**: dfdc6ba was committed to PR #789 AFTER session-088. When session-090 ran, dfdc6ba
was in scope and modified `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` — a file
matching the KNOWLEDGE_GOVERNANCE trigger pattern `.agent-workspace/*/knowledge/*`. Sessions 090
and 091 classified the PR as MIXED (CI_WORKFLOW + AAWP_MAT) without applying the
KNOWLEDGE_GOVERNANCE overlay. Session-092 correctly identified and applied the overlay,
discovering OVL-KG-004 (stale index.md) as a new failure.

**Permanent Rule**:
On EVERY IAA invocation, IAA MUST re-evaluate the trigger table from Step 1 of the decision flow
against ALL commits in the PR, not just the commits present in the prior invocation. A multi-
invocation PR may accumulate new commits between invocations that introduce new trigger categories.
Carrying forward a prior session's category classification without re-verification is a governance gap.
This rule is especially critical for PRs where remediation commits are added between IAA invocations
(e.g., the Foreman adds a governance learning commit between session-088 and session-090).

**Check in Phase 2 (category classification)**:
> FAIL-ONLY-ONCE A-022: Before classifying PR category, list all commits in the PR and check
> each against the trigger table. Do not carry forward prior session's category classification.
> Re-read the trigger table decision flow (steps 1-7) every invocation against the full commit
> history. New commits = new trigger possibilities.

**Status**: ACTIVE — CANDIDATE from session-092

---

### A-023 — OVL-AC-012 Ripple Assessment Is a Standing PREHANDOVER Requirement

**Triggered by**: Recurring pattern across sessions 084, 086, 088, 089, 097, 101 (2026-03-02–03) — OVL-AC-012 (ripple/cross-agent assessment absent) has failed in AGENT_CONTRACT and AAWP_MAT audits repeatedly.

**Incident reference**: session-101-20260303 (learning integration trigger).

**Permanent Rule**:
For every AGENT_CONTRACT PR, the PREHANDOVER proof MUST contain an explicit `## Ripple/Cross-Agent Assessment` section with either (a) a list of all affected agents with ripple status, or (b) an explicit "No ripple required" statement with specific justification per agent class.

**Check in Phase 3 (OVL-AC-012 enforcement)**:
> FAIL-ONLY-ONCE A-023: Search PREHANDOVER proof for ripple/cross-agent assessment section.
> If absent: FAIL immediately. Session memory is not a substitute.

**Status**: ACTIVE

---

### A-025 — Ceremony Artifacts Must Use PENDING Until Post-ASSURANCE-TOKEN Ceremony — No Pre-Fill of Anticipated -PASS Tokens

**Triggered by**: maturion-isms session-098 (2026-03-02) — PR #816 re-invocation after session-097 REJECTION-PACKAGE.
During remediation, the Foreman's session-092 memory and the PREHANDOVER proof checklist were populated with
`iaa_audit_token: IAA-session-097-20260302-PASS` and `result: ASSURANCE-TOKEN IAA-session-097-20260302-PASS`
before session-097 had issued any ASSURANCE-TOKEN. Since session-097 actually issued a REJECTION-PACKAGE, this
constituted an A-017 breach (citing REJECTION-PACKAGE as PASS) and a CORE-007 violation (incorrect/fabricated content).
The PREHANDOVER template anti-misuse comment explicitly warned "Never pre-fill '-PASS'" but was not followed.

**Incident**: Two PR artifacts (PREHANDOVER proof checklist line 111 and foreman session-092 memory) pre-filled
anticipated ASSURANCE-TOKEN values that referenced a session whose actual verdict was REJECTION-PACKAGE.
This caused a second REJECTION-PACKAGE (session-098) for a PR whose substantive content was correct.

**Permanent Rule**:
Ceremony artifacts (`PREHANDOVER-*.md` and `session-NNN-*.md`) must be committed with:
- `iaa_audit_token: PENDING` in all relevant fields
- Delegation log `result:` field: `[not yet issued — awaiting IAA session-NNN]` or `REJECTION-PACKAGE (session-NNN) — re-invoked`
- PREHANDOVER checklist `IAA audit token recorded` item: `- [ ] IAA audit token recorded: [PENDING — awaiting IAA session-NNN verdict]` (UNCHECKED)

Pre-filling any field with an anticipated `-PASS` token value before the ASSURANCE-TOKEN is actually received constitutes:
1. CORE-007 violation if the field is incorrect (fabricated content)
2. A-017 violation if the pre-filled token references a session that actually issued REJECTION-PACKAGE

The Post-ASSURANCE-TOKEN ceremony (copying verbatim IAA output, updating token field, committing) is the ONLY
authorised mechanism for populating ceremony artifact token fields with non-PENDING values.

**Check in Phase 3 (CORE-007 and CORE-019)**:
> FAIL-ONLY-ONCE A-025: For every `iaa_audit_token` field found in any PR artifact with a non-PENDING value,
> run CORE-019 cross-verification. Also check PREHANDOVER checklist items — any checked `[x]` IAA token item
> must reference an ASSURANCE-TOKEN session (not REJECTION-PACKAGE). If the iaa_audit_token field is PENDING
> but any checklist item or prose in the same file pre-fills a -PASS token → CORE-007 FAIL.

**Status**: ACTIVE — from session-098 (2026-03-02); renumbered A-025 (conflict resolution 2026-03-03)

---

### A-026 — SCOPE_DECLARATION.md Must Be Updated to Exactly Match PR Diff Before IAA Invocation

**Trigger**: IAA session-116 (2026-03-03) — Wave 13 Addendum B+C re-invocation
**Root Cause**: SCOPE_DECLARATION.md was not updated for the PR branch. It retained Wave 6 QA remediation content (5 old files declared). Actual PR diff contained 14 files. `validate-scope-to-diff.sh` (BL-027 exact set comparison) fails when SCOPE_DECLARATION.md is stale. The PREHANDOVER §4.3 self-report inaccurately stated PASS.

**Rule**: SCOPE_DECLARATION.md must be updated and committed on every PR branch to exactly match the output of `git diff --name-only origin/main...HEAD` before IAA is invoked. A SCOPE_DECLARATION.md that retains content from a prior session, prior PR, or is otherwise not current with the active diff constitutes a `validate-scope-to-diff.sh` (BL-027) failure and is an automatic REJECTION-PACKAGE at merge gate parity.

**IAA Enforcement**: During §4.3 Merge Gate Parity Check, run `validate-scope-to-diff.sh` and inspect exit code. Exit code 1 = REJECTION-PACKAGE citing merge gate parity failure. Do not accept the PREHANDOVER §4.3 self-report at face value — run the script.

**Fix Procedure**:
1. Run `git diff --name-only origin/main...HEAD | sort` to get the exact file list
2. Update `SCOPE_DECLARATION.md` — replace the file list section with all files from step 1
3. Commit and push the updated `SCOPE_DECLARATION.md`
4. Re-invoke IAA

**Applies To**: All PRs with SCOPE_DECLARATION.md present; all PRs where `validate-scope-to-diff.sh` is a CI gate check

**Status**: ACTIVE — from session-116 (2026-03-03)

---

### A-027 — Third-Consecutive A-021 Failure = Systemic Workflow Gap — Pre-IAA Commit Gate Required

**Trigger**: IAA session-119 (2026-03-03) — Wave 14 Addendum A third re-invocation attempt (sessions 118 and 119 both failed A-021 on same branch copilot/fix-schema-mapping-issues)
**Root Cause**: When A-021 (commit before invoke) fires three or more times consecutively on the same PR/branch, the root cause is no longer individual oversight but a systemic gap in the producing agent's pre-IAA workflow. The PREHANDOVER proof is written to disk, the implementation commit is made, but the governance artifact commit (PREHANDOVER + session memory + governance fixes) is deferred until after IAA responds — which is the precise anti-pattern A-021 was designed to prevent.

**Permanent Rule**:
When A-021 fires on a PR for the third time, IAA must cite this rule in the REJECTION-PACKAGE and record the systemic gap in learning notes. The producing agent (foreman) must add a "Pre-IAA Commit Gate" section to the PREHANDOVER template requiring explicit evidence that:
1. `git status --short | grep -E "^\?\?"` returns no untracked governance files before IAA invocation
2. `git log --oneline -1` output is pasted (showing governance files are in the latest commit)
3. SCOPE_DECLARATION matches the committed diff (A-026 self-check)

Any PREHANDOVER proof that cannot produce these three evidence snippets is self-disqualifying before IAA is even invoked.

**IAA Enforcement**: On every re-invocation, run `git status --short` and check for `??` on PREHANDOVER and session memory files. If `??` is found, cite A-021 and A-027 together.

**Status**: ACTIVE — from session-119 (2026-03-03)

---

### A-028 — SCOPE_DECLARATION Format Compliance — List Format Required, Prior-Wave Entries Must Be Trimmed

**Trigger**: IAA session-120 (2026-03-03) — Wave 14 Addendum A fourth invocation attempt
**Root Cause**: SCOPE_DECLARATION.md Wave 14 section used table format (`| \`file\` | type | incident |`) instead of list format (`- \`file\` - description`). The BL-027 `validate-scope-to-diff.sh` script parses ONLY list-format declarations using regex `^\s*-\s+\`[^`]+\`\s+-\s+`. Table-format declarations are completely invisible to the script, yielding 0 declared files from the entire Wave 14 section. Additionally, prior-wave list-format entries (from previous PRs already merged to `origin/main`) remain in SCOPE_DECLARATION — they appear as "EXTRA" declarations in BL-027's set comparison since they are not in the current PR's diff.

**Permanent Rule**:
1. SCOPE_DECLARATION.md file declarations MUST use list format only: `- \`path/to/file\` - one-line description`. Never use table format for file declarations in SCOPE_DECLARATION.
2. SCOPE_DECLARATION.md must be trimmed on each PR branch to contain ONLY the files changed in that PR's diff (`git diff --name-only origin/main...HEAD`). Prior-wave entries (already merged to origin/main) must be removed.
3. ALL files in the PR diff must be declared — including IAA workspace files, parking-station files, and any agent session memory files committed as evidence artifacts.
4. Reference format template: the Wave 13 Addendum B+C section (sessions 095/116) as the canonical format example — it previously passed BL-027.

**Self-Check Before IAA Invocation**:
```bash
# Step 1: Get exact PR diff file count
git diff --name-only origin/main...HEAD | wc -l

# Step 2: Get list-format declaration count from SCOPE_DECLARATION  
grep -E '^\s*-\s+`[^`]+`\s+-\s+' SCOPE_DECLARATION.md | wc -l

# These counts MUST match. If they don't: fix SCOPE_DECLARATION before invoking IAA.
```

**IAA Enforcement**: During §4.3, manually simulate `validate-scope-to-diff.sh` by running both commands above and confirming equal counts. If the script is unavailable (shallow clone), the manual count comparison is the equivalent check.

**Status**: ACTIVE — from session-120 (2026-03-03)

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-02-25 | Initial registry with A-001, A-002, A-003 |
| 1.1.0 | 2026-02-27 | A-004 (bootstrap directive), A-005 (agent contract immutability) added |
| 1.2.0 | 2026-02-28 | A-006 (PHASE_A_ADVISORY fabrication), A-015 (Tier 2 patches require ceremony), A-016 (cross-PR token reuse), A-017 (REJECTION-as-PASS citation) added |
| 1.3.0 | 2026-03-02 | A-018 renumbered from duplicate A-004 (post-merge retrospective); A-019 renumbered from duplicate A-016 (trigger table misapplication); duplicate rule ID deduplication patch (maturion-isms#IAA-TIER2) |
| 1.4.0 | 2026-03-02 | A-020 (PREHANDOVER template staleness — template must be kept current with overlay requirements) added from session-088 Wave 13 REJECTION-PACKAGE learning |
| 1.5.0 | 2026-03-02 | A-021 (commit and push before IAA invocation — working-tree fix is not a committed fix) codified from sessions 090/091 CANDIDATE; A-022 (re-evaluate trigger categories on every invocation — do not carry forward prior session classification) added from session-092 OVL-KG-004 finding |
| 1.6.0 | 2026-03-03 | A-023 (OVL-AC-012 ripple assessment is a standing PREHANDOVER requirement for all AGENT_CONTRACT PRs) codified from recurring pattern sessions 084–101 |
| 1.7.0 | 2026-03-03 | A-024 (secret field naming — `secret:` prohibited in agent contracts; must use `secret_env_var:`) added from CI scanner failures (job 65529138120) |
| 1.8.0 | 2026-03-03 | Conflict resolution: A-023 collision fixed — PR #816 rule renumbered to A-025 (ceremony PENDING rule); A-023 now = OVL-AC-012 ripple assessment; A-024 = secret field naming; A-025 = ceremony PENDING pre-fill prohibition |
| 1.9.0 | 2026-03-03 | A-026 (SCOPE_DECLARATION.md must match PR diff exactly before IAA invocation — stale declaration = BL-027 merge gate parity failure) added from session-116 (Wave 13 Addendum B+C re-invocation) |
| 2.0.0 | 2026-03-03 | A-027 (third-consecutive A-021 failure = systemic workflow gap — Pre-IAA Commit Gate required) added from session-119 (Wave 14 Addendum A — third A-021 failure on same branch); header version corrected from 1.8.0 to 2.0.0 (header/index discrepancy resolved) |
| 2.1.0 | 2026-03-03 | A-028 (SCOPE_DECLARATION format compliance — list format required, prior-wave entries must be trimmed) added from session-120 (Wave 14 Addendum A — fourth invocation; BL-027 fails due to table format and phantom prior-wave entries) |
| 2.2.0 | 2026-03-04 | A-029 ARTIFACT-IMMUTABILITY-4.3b locked in; supersedes A-025 PENDING requirement per AGENT_HANDOVER_AUTOMATION.md v1.1.3 §4.3b (PR 1298) |

---

### A-029 — Artifact Immutability §4.3b: PREHANDOVER Proof is Read-Only Post-Commit

**Effective**: 2026-03-04 | **Authority**: CS2 (PR 1298 — `AGENT_HANDOVER_AUTOMATION.md` v1.1.3 §4.3b)
**Supersedes**: A-025 (PENDING requirement) for the `iaa_audit_token` field in PREHANDOVER proofs.

**Rule**: Per `AGENT_HANDOVER_AUTOMATION.md` v1.1.3 §4.3b, the PREHANDOVER proof is **read-only after initial commit**. The following applies to all agent classes:

1. The `iaa_audit_token` field in the PREHANDOVER proof MUST be pre-populated with the expected reference at initial commit time: `IAA-session-NNN-waveY-YYYYMMDD-PASS`.
2. After the IAA issues its verdict, the IAA writes its token to a **new dedicated file** only: `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md`.
3. No agent (including the IAA) may edit the PREHANDOVER proof post-commit to update `iaa_audit_token`.
4. A-025's requirement to commit with `iaa_audit_token: PENDING` is superseded. PENDING is no longer the correct pre-commit value.

**IAA check (Phase 3)**:
> A-029: For any `iaa_audit_token` field in a committed PREHANDOVER proof:
> - If value is `PENDING` → FLAG as A-029 violation (old pattern, superseded by §4.3b).
> - If value is expected reference format (`IAA-session-NNN-waveY-YYYYMMDD-PASS`) → check that the dedicated token file exists at `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md`.
> - If dedicated token file is absent → FAIL (INC-PREHANDOVER-MUTATE-001).

**Violation class**: INC-PREHANDOVER-MUTATE-001

**Status**: ACTIVE — from 2026-03-04 (PR 1298 / AGENT_HANDOVER_AUTOMATION.md v1.1.3 §4.3b)

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0

