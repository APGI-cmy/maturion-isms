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

---

### A-016 — Trigger Table Misapplication Is an IAA Bypass — ALL Triggering Categories Require IAA

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
> FAIL-ONLY-ONCE A-016: If PR contains any change to governance/canon/ OR .github/workflows/ OR
> .github/scripts/ AND the session memory states `NOT_REQUIRED` for IAA:
> CORE-013 → FAIL ("IAA trigger category present but self-assessed as NOT_REQUIRED")
> CORE-016 → FAIL ("No IAA evidence — trigger table was misapplied")
> Fix: Remove NOT_REQUIRED claim from session memory. Create PREHANDOVER proof.
> Invoke IAA via the independent-assurance-agent tool. Include verbatim IAA output in proof.

**Status**: ACTIVE — enforced every invocation
