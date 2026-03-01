# IAA FAIL-ONLY-ONCE Registry

**Agent**: independent-assurance-agent
**Version**: 1.2.0
**Last Updated**: 2026-02-28
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
### A-004 — Post-Merge Retrospective Audit Findings Must Be Formally Recorded — No Informal Notes

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
> FAIL-ONLY-ONCE A-004: After issuing a post-merge REJECTION-PACKAGE, verify that
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

## Adding New Rules

When a new governance failure pattern is identified during a session (learning_notes in session
memory), IAA adds a new entry to this file following the format above. Each new rule:
- Gets the next sequential ID (A-004, A-005, etc.)
- References the incident that triggered it
- States the permanent rule precisely
- Defines how the rule is checked in the phase steps

All updates to this file must be committed as part of the session bundle for that invocation.

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0

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
