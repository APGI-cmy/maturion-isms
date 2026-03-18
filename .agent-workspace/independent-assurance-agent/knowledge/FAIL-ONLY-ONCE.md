# IAA FAIL-ONLY-ONCE Registry

**Agent**: independent-assurance-agent
**Version**: 2.5.0
**Last Updated**: 2026-03-08
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## ⚠️ ACTIVE OVERRIDE — A-029 SUPERSEDES A-025 (read this first)

**A-029 is the current governing rule for PREHANDOVER proof token fields.**
A-025 (PENDING requirement) is superseded as of 2026-03-04 for the `iaa_audit_token` field in PREHANDOVER proofs.

Under A-029 (§4.3b architecture):
- PREHANDOVER proof `iaa_audit_token` → pre-populated at commit time with **expected reference** `IAA-session-NNN-waveY-YYYYMMDD-PASS`
- IAA verdict → written to **dedicated token file** `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md`
- PREHANDOVER proof is **read-only** after initial commit
- `iaa_audit_token: PENDING` is the OLD pattern — do not use for post-2026-03-04 proofs

**CORE-016 and CORE-018 have been updated in `iaa-core-invariants-checklist.md` v2.7.0 to match this architecture.**
The `## IAA Agent Response (verbatim)` section requirement has moved from the PREHANDOVER proof to the dedicated token file.

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

### A-005 — Agent Contract File Immutability — No Agent May Touch `.github/agents/` Files

**Rule** (CS2 directive — 2026-02-27):
No agent (builder, Foreman, IAA, specialist, or any other) may create, read for modification, edit, delete, or include in a PR diff any file under `.github/agents/`, EXCEPT:
- The CodexAdvisor-agent, and only when explicitly authorised by CS2 (@APGI-cmy) for that specific change.

Any PR diff that includes modifications to `.github/agents/` files authored by any agent other than CodexAdvisor-agent is a violation of class GOV-BREACH-CONTRACT-001.

**Check in IAA QP phase (CORE-007 / OVL-*)**:
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
- No dedicated IAA token file exists for this PR at `.agent-admin/assurance/iaa-token-session-NNN-*.md`

This pattern = PHASE_A_ADVISORY FABRICATION breach.
Foreman A-014 mandates the tool call. IAA A-006 enforces the detection.

Real IAA responses ALWAYS produce a dedicated token file containing the ASSURANCE-TOKEN or REJECTION-PACKAGE block. A bare `PHASE_A_ADVISORY — [date]` without a corresponding token file is self-certified by the Foreman — not issued by the IAA.

**Check in Phase 3**:
> FAIL-ONLY-ONCE A-006 (INC-IAA-SKIP-001 detection):
> 1. Locate the `iaa_audit_token` field in the PREHANDOVER proof.
> 2. If value matches pattern `PHASE_A_ADVISORY — \d{4}-\d{2}-\d{2}` exactly:
>    a. Check if a dedicated IAA token file exists at `.agent-admin/assurance/iaa-token-session-NNN-*.md` for this PR.
>    b. If absent: FAIL. Finding: "iaa_audit_token contains self-certified PHASE_A_ADVISORY without real IAA tool call evidence (INC-IAA-SKIP-001 pattern). PHASE_A_ADVISORY FABRICATION breach (A-014)."
>    c. Fix required: "Foreman must call task(agent_type='independent-assurance-agent'). IAA will create the dedicated token file. A-014 applies."
> 3. If `iaa_audit_token` contains a real session token reference format: PASS (CORE-019 handles cross-verification).

**Status**: ACTIVE — enforced on every PREHANDOVER proof review

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
> CORE-016 → FAIL ("No PREHANDOVER proof on branch — dedicated IAA token file cannot be verified")
> Fix: Create PREHANDOVER proof with iaa_audit_token pre-populated to expected reference, create session memory,
> commit both to branch, re-invoke IAA, then follow Post-ASSURANCE-TOKEN Ceremony.

**Status**: ACTIVE — enforced every invocation

---

### A-016 — Cross-PR IAA Token Reuse Is a Governance Breach

**Triggered by**: session-023-20260301 — foreman-v2-agent session-076 cited
`iaa_audit_token: IAA-session-022-20260301-PASS` (issued for `copilot/patch-proof-template-update` /
pr #699 — Tier 2 knowledge patch) as the audit token for a completely different PR
(Wave 12 deliverables on `copilot/draft-qa-verification-plan-wave-11` / PR #710).

**Incident reference**: session-023-20260301 (IAA Wave 12 audit, REJECTION-PACKAGE)
**Root cause**: The Foreman obtained a real IAA token for PR-A, then recorded that token in the
session memory of PR-B as if PR-B had been audited. The token is genuine but the audit for PR-B
was fabricated.

**Permanent Rule**:
For every triggered PR audit, when `iaa_audit_token` contains a real session token reference:
1. Open the dedicated token file `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md`
2. Read the PR reference field
3. If PR reference references a DIFFERENT branch, PR, or PR subject than the current audit target:
   → FAIL (cross-PR token reuse = governance breach)
4. Apply CORE-019 First Invocation Exception if token file does not yet exist.

**Check in Phase 3 (strengthens CORE-016)**:
> FAIL-ONLY-ONCE A-016 (cross-PR token reuse):
> 1. If iaa_audit_token = IAA-session-NNN-YYYYMMDD-PASS, open that dedicated token file.
> 2. Verify PR reference matches the current audit subject.
> 3. If mismatch → FAIL. If token file does not exist AND this is NOT a first invocation → FAIL (phantom token).
> 4. If match → PASS this sub-check.

**Status**: ACTIVE — enforced from session-023 onwards

---

### A-017 — Session Memory Must Not Cite a REJECTION-PACKAGE Session as PASS

**Triggered by**: session-024-20260301 — foreman-v2-agent session-076 session memory recorded
`iaa_audit_token: IAA-session-023-20260301-PASS`. Session-023 issued REJECTION-PACKAGE with
`token_reference: N/A`. The token `IAA-session-023-20260301-PASS` was never issued.

**Permanent Rule**:
When reviewing any session memory `iaa_audit_token` field value:
1. If the format is `IAA-session-NNN-YYYYMMDD-PASS`:
   a. Open the dedicated token file for session-NNN
   b. Check verdict field. If verdict = REJECTION-PACKAGE → the token is non-existent. FAIL.
   c. Finding: "Token references session-NNN which issued REJECTION-PACKAGE — no such PASS token was ever generated."
   d. Fix: Foreman must update the session memory `iaa_audit_token` to the token issued by the most recent ASSURANCE-TOKEN invocation for this PR.

**Check in Phase 3**:
> FAIL-ONLY-ONCE A-017 (REJECTION-as-PASS citation):
> 1. If session memory iaa_audit_token = IAA-session-NNN-YYYYMMDD-PASS, open dedicated token file for session-NNN.
> 2. If verdict = REJECTION-PACKAGE → FAIL. Finding: "Session memory cites session-NNN which issued REJECTION-PACKAGE."
> 3. A-016 (cross-PR check) applies independently.

**Status**: ACTIVE — enforced from session-025 onwards

---

### A-018 — Post-Merge Retrospective Audit Findings Must Be Formally Recorded — No Informal Notes

**Triggered by**: maturion-isms governance breach issue (PR #546 process violation) — session-002.

**Permanent Rule**:
When IAA issues a post-merge retrospective REJECTION-PACKAGE, the following must occur in the
SAME session as the audit:
1. CodexAdvisor must create a breach-registry.md entry for the violation.
2. CodexAdvisor must add a FAIL-ONLY-ONCE rule addressing the root cause.
3. IAA must flag the unresolved items in its session memory as requiring CodexAdvisor action.
4. The breach is only marked CLOSED when CodexAdvisor's corrective artifacts are committed.

**Status**: ACTIVE — enforced every post-merge retrospective audit

---

### A-019 — Trigger Table Misapplication Is an IAA Bypass — ALL Triggering Categories Require IAA

**Triggered by**: maturion-isms#711 — governance-liaison-isms session-027-20260301.

**Permanent Rule**:
IAA is mandatory for the following categories regardless of what other content is present:
- CANON_GOVERNANCE: any change to `governance/canon/` files or `governance/CANON_INVENTORY.json`
- CI_WORKFLOW: any change to `.github/workflows/` or `.github/scripts/` files
- AGENT_CONTRACT: any change to `.github/agents/` files
- AAWP_MAT: any AAWP or MAT deliverable

The producing agent may NOT self-assess IAA as `NOT_REQUIRED` for any of these categories.
Only the IAA agent itself may determine a PR is EXEMPT.

**Status**: ACTIVE — enforced every invocation

---

### A-020 — PREHANDOVER Template Must Be Kept Current With Overlay Requirements

**Triggered by**: session-088-20260302 — foreman-v2-agent session-089 Wave 13 REJECTION-PACKAGE.

**Permanent Rule**:
When IAA identifies that a REJECTION-PACKAGE was produced because the PREHANDOVER proof is missing
sections required by the CURRENT overlay version:
1. Issue the REJECTION-PACKAGE normally.
2. In session learning notes, flag: "Foreman PREHANDOVER template is stale — must be updated."
3. The Foreman must update the template before the next wave's PREHANDOVER is generated.

**Required template sections as of overlay v3.0.0** (must be present in any PREHANDOVER proof):
- `iaa_audit_token` field pre-populated with expected reference (§4.3b architecture)
- `## Architecture Ripple/Impact Assessment` — OVL-AM-004
- `## Wave Gap Register` — OVL-AM-005
- `## Environment Parity` — OVL-AM-006 and OVL-CI-006
- `## CI Check Run Evidence` — OVL-CI-005 (only for CI_WORKFLOW PRs)
- **Note**: `## IAA Agent Response (verbatim)` is NO LONGER a required PREHANDOVER section. It now lives in the dedicated token file.

**Status**: ACTIVE — enforced from session-088 onwards

---

### A-021 — Commit and Push Before IAA Invocation (CI Run Evidence)

**Triggered by**: maturion-isms PR #789 sessions 090 and 091.

**Permanent Rule**:
After preparing ANY change to a PREHANDOVER proof or governance artifact required for an IAA check,
the producing agent MUST execute `git commit && git push` BEFORE invoking IAA.
A working-tree-only or staging-area-only fix is NOT a committed fix and WILL fail IAA audit.

**Check in Phase 1 (pre-invocation note for Foreman)**:
> FAIL-ONLY-ONCE A-021: IAA must verify the committed artifact — not the working tree.
> GitHub API `get_file_contents` on the PR branch ref is the authoritative check.

**Status**: ACTIVE — codified from session-092

---

### A-022 — Re-Evaluate Trigger Categories on Every IAA Invocation

**Triggered by**: maturion-isms PR #789 sessions 090 and 091.

**Permanent Rule**:
On EVERY IAA invocation, IAA MUST re-evaluate the trigger table against ALL commits in the PR,
not just the commits present in the prior invocation.

**Status**: ACTIVE — from session-092

---

### A-023 — OVL-AC-012 Ripple Assessment Is a Standing PREHANDOVER Requirement

**Triggered by**: Recurring pattern across sessions 084, 086, 088, 089, 097, 101.

**Permanent Rule**:
For every AGENT_CONTRACT PR, the PREHANDOVER proof MUST contain an explicit `## Ripple/Cross-Agent Assessment` section.

**Check in Phase 3 (OVL-AC-012 enforcement)**:
> FAIL-ONLY-ONCE A-023: Search PREHANDOVER proof for ripple/cross-agent assessment section.
> If absent: FAIL immediately. Session memory is not a substitute.

**Status**: ACTIVE

---

### A-024 — Secret Field Naming in Agent Contracts Must Use `secret_env_var:` — Not `secret:`

**Triggered by**: maturion-isms feature request (CS2 — 2026-03-03).

**Permanent Rule**:
All agent contract files MUST use `secret_env_var:` — never `secret:` — in `governance.execution_identity` blocks.

**Status**: ACTIVE — enforced from session-042 (2026-03-03) onwards

---

### A-025 — ~~Ceremony Artifacts Must Use PENDING~~ — SUPERSEDED BY A-029

**Status**: ⚠️ SUPERSEDED by A-029 (effective 2026-03-04) for the `iaa_audit_token` field in PREHANDOVER proofs.

**What A-025 said**: PREHANDOVER proof `iaa_audit_token` must be committed as `PENDING` and updated only after receiving ASSURANCE-TOKEN.

**Why it is superseded**: A-029 (§4.3b architecture) makes the PREHANDOVER proof read-only post-commit. PENDING can no longer be the pre-commit value because the proof cannot be edited after commit. Instead, the expected reference format is pre-populated at commit time.

**A-025 still applies to**:
- Session memory `iaa_audit_token` fields (NOT governed by §4.3b immutability)
- Delegation log `result:` fields
- PREHANDOVER checklist items EXCEPT the `iaa_audit_token` field itself

**For PREHANDOVER proof `iaa_audit_token` specifically**: Use A-029.

---

### A-026 — SCOPE_DECLARATION.md Must Be Updated to Exactly Match PR Diff Before IAA Invocation

**Trigger**: IAA session-116 (2026-03-03)

**Rule**: SCOPE_DECLARATION.md must be updated and committed on every PR branch to exactly match `git diff --name-only origin/main...HEAD` before IAA is invoked.

**IAA Enforcement**: During §4.3 Merge Gate Parity Check, run `validate-scope-to-diff.sh` and inspect exit code. Exit code 1 = REJECTION-PACKAGE.

**Status**: ACTIVE — from session-116 (2026-03-03)

---

### A-027 — Third-Consecutive A-021 Failure = Systemic Workflow Gap — Pre-IAA Commit Gate Required

**Trigger**: IAA session-119 (2026-03-03)

**Permanent Rule**:
When A-021 fires on a PR for the third time, IAA must cite this rule in the REJECTION-PACKAGE.
The producing agent must add a "Pre-IAA Commit Gate" section requiring explicit evidence of:
1. `git status --short` shows no untracked governance files
2. `git log --oneline -1` shows governance files in latest commit
3. SCOPE_DECLARATION matches committed diff

**Status**: ACTIVE — from session-119 (2026-03-03)

---

### A-028 — SCOPE_DECLARATION Format Compliance — List Format Required, Prior-Wave Entries Must Be Trimmed

**Trigger**: IAA session-120 (2026-03-03)

**Permanent Rule**:
1. SCOPE_DECLARATION.md file declarations MUST use list format: `- \`path/to/file\` - one-line description`
2. Must be trimmed to contain ONLY files in current PR diff
3. ALL PR diff files must be declared

**Status**: ACTIVE — from session-120 (2026-03-03)

---

### A-029 — Artifact Immutability §4.3b: PREHANDOVER Proof is Read-Only Post-Commit

**Effective**: 2026-03-04 | **Authority**: CS2 (PR 1298 — `AGENT_HANDOVER_AUTOMATION.md` v1.1.3 §4.3b)
**Supersedes**: A-025 (PENDING requirement) for the `iaa_audit_token` field in PREHANDOVER proofs.

**Rule**: Per `AGENT_HANDOVER_AUTOMATION.md` v1.1.3 §4.3b, the PREHANDOVER proof is **read-only after initial commit**:

1. The `iaa_audit_token` field in the PREHANDOVER proof MUST be pre-populated with the expected reference at initial commit time: `IAA-session-NNN-waveY-YYYYMMDD-PASS`.
2. After the IAA issues its verdict, the IAA writes its token to a **new dedicated file** only: `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md`.
3. No agent (including the IAA) may edit the PREHANDOVER proof post-commit to update `iaa_audit_token`.
4. A-025's requirement to commit with `iaa_audit_token: PENDING` is superseded. PENDING is no longer the correct pre-commit value for PREHANDOVER proofs.

**IAA check (Phase 3)**:
> A-029: For any `iaa_audit_token` field in a committed PREHANDOVER proof:
> - If value is `PENDING` → FLAG as A-029 violation (old pattern, superseded by §4.3b). Flag only — do not hard-fail on first invocation if this is clearly a legacy proof from before 2026-03-04.
> - If value is expected reference format (`IAA-session-NNN-waveY-YYYYMMDD-PASS`) → check that the dedicated token file exists at `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md` OR apply CORE-019 First Invocation Exception.
> - If dedicated token file is absent on a re-invocation (not first invocation) → FAIL (INC-PREHANDOVER-MUTATE-001).

**Circular Dependency Resolution**:
A-029 and CORE-019 previously created a circular dependency: A-029 requires the expected token reference to be pre-populated, but CORE-019 required the token file to exist, which it cannot on the first invocation. This is resolved by the **CORE-019 First Invocation Exception** (added in iaa-core-invariants-checklist.md v2.7.0): on the first invocation for session-NNN, the absence of the token file is expected and not a failure. The file is created by THIS invocation's Step 4.3 output.

**Violation class**: INC-PREHANDOVER-MUTATE-001

**Status**: ACTIVE — from 2026-03-04 (PR 1298 / AGENT_HANDOVER_AUTOMATION.md v1.1.3 §4.3b)

---

### A-029b — Carry-Forward Mandate: Leftovers from Prior Jobs Block Token Until Resolved

**Triggered by**: maturion-isms PR #892 IAA session-097-20260304 — FFA-05 CFM issued for
two pre-existing CI YAML failures.

**Canon references**:
- `INDEPENDENT_ASSURANCE_AGENT_CANON.md` §Intelligence-Led Reasoning — "Carry-forward authority"
- `STOP_AND_FIX_DOCTRINE.md` §3.2 — "If you see it, you own it."
- `ZERO_TOLERANCE_FINDING_PROTOCOL.md` §3
- `OPOJD_COMPLETE_JOB_HANDOVER_DOCTRINE.md` §2.4

**Permanent Rule**:
When the IAA identifies ANY of the following originating in a prior job/PR (not the current PR):
- CI failures (failing workflows, YAML parse errors)
- Broken wires (missing integrations, schema gaps)
- Open governance violations not yet remediated
- Pre-existing test failures in scope of the working area

The IAA MUST:
1. Issue a **Carry-Forward Mandate (CFM)** as FFA-05 in the REJECTION-PACKAGE.
2. Require one of: (a) inline fix in current PR, (b) tracked blocking issue referenced in PREHANDOVER, or (c) CS2 written exception.
3. If none present → ASSURANCE-TOKEN BLOCKED.

**Prohibited**: "pre-existing", "not introduced by this PR", "out of scope", "separate ticket" — all prohibited per STOP_AND_FIX_DOCTRINE.md §3.5.

**Status**: ACTIVE — from session-097 (2026-03-04)

---

## Rule A-031 — IAA Ceremony Artifact A-026 Carve-Out

**Triggered by**: Sessions 142, 146, 148, 149, 150 (2026-03-04/05) — recurring pattern where IAA's
own ceremony artifacts (parking station updates, session memory, rejection token) committed to a
shared branch during a prior REJECTION-PACKAGE session appear in `git diff --name-only origin/main...HEAD`
but are not declared in SCOPE_DECLARATION.md. Producing agents have no visibility into IAA's internal
parking station writes, causing repeated A-026 failures on legitimate PRs.

**Root cause**: A-026 requires EXACT match of `git diff` against SCOPE_DECLARATION, but IAA writes
to `.agent-workspace/independent-assurance-agent/` (its own write path) during every rejection
ceremony. These IAA-owned files are not the producing agent's deliverables. Producing agents cannot
reliably predict every IAA parking station entry that IAA will write.

**Permanent Rule**:

When IAA ceremony artifacts from a prior REJECTION-PACKAGE commit are present in the PR branch diff
(i.e., IAA ran a rejection ceremony on this branch, writing session memory, rejection token, and/or
parking station updates), producing agents have TWO compliant options for SCOPE_DECLARATION:

**Option A (full declaration — always compliant):**
Declare ALL files in `git diff --name-only origin/main...HEAD` in SCOPE_DECLARATION.md, including
IAA ceremony artifacts. Ensures zero ambiguity. Recommended for clarity.

**Option B (A-031 carve-out — compliant when explicitly invoked):**
Add the following note to SCOPE_DECLARATION.md under "Governance Actions":
  > "IAA ceremony artifacts from session-NNN rejection committed on branch (IAA session memory,
  > IAA rejection token, IAA parking station update) excluded from declaration per A-031 carve-out.
  > These are IAA-owned files; producing agent deliverables are fully declared above."
When this note is present, IAA will verify that the only undeclared files in the diff match the
pattern `.agent-workspace/independent-assurance-agent/` and/or `.agent-admin/assurance/iaa-token-*.md`
from prior rejection sessions. Any other undeclared file = A-026 FAIL (carve-out does not apply).

**What this rule does NOT exempt:**
- The producing agent's own deliverables must ALWAYS be declared
- SCOPE_DECLARATION.md itself must be declared
- IAA ceremony artifacts from FUTURE IAA invocations (current session) must be declared or use A-031 note

**How this is checked in Phase 3 (A-026 evaluation):**
When evaluating A-026, if a mismatch is detected, IAA first checks whether the undeclared files
are exclusively IAA ceremony artifacts from a prior rejection on this branch. If YES and if the
A-031 carve-out note is present in SCOPE_DECLARATION.md → A-026 PASS. If YES but carve-out note
is absent → A-026 FAIL (add carve-out note or declare the files). If NO (undeclared file is
not an IAA ceremony artifact) → A-026 FAIL regardless.

**Status**: ACTIVE — from session-150 (2026-03-05)

---

## Adding New Rules

When a new governance failure pattern is identified during a session, IAA adds a new entry following the format above. Each new rule:
- Gets the next sequential ID (A-032 is the next available ID)
- References the incident that triggered it
- States the permanent rule precisely
- Defines how the rule is checked in the phase steps

All updates to this file must be committed as part of the session bundle for that invocation.

---

## Rule A-032 — Schema Column Compliance Check (IAA BD-005/BD-006 Mandatory Extension)

**Triggered by**: INC-ALCF-001 (maturion-isms, 2026-03-08) — wave-upload-doclist-fix PR #1007 merged
with column mismatches between `useCriteria.ts` INSERT/SELECT and the actual `audit_logs` schema.

**Incident summary**: IAA reviewed wave-upload-doclist-fix (session-wave-upload-doclist-fix-20260308)
and explicitly stated `resource_id in UploadedDocument: All good` — which was incorrect.
The INSERT used non-existent columns (`user_id`, `resource_type`, `resource_id`) and omitted the
required NOT NULL `organisation_id`. The SELECT included non-existent `resource_id`. All DB errors
were silently swallowed by a non-fatal `try/catch` wrapper. The QA tests used mocked Supabase
clients that returned whatever columns were queried — no schema contract validation.
The column mismatch caused every `audit_logs` write to fail silently, and every query for uploaded
documents to return a "Failed to load" error. Root cause: IAA did not read the migration DDL file
during the BD-005/BD-006 end-to-end wiring check. The migration was in a legacy app path
(`apps/maturion-maturity-legacy/supabase/migrations/`) not the standard `supabase/migrations/` path.

**Permanent Rule**:
For any PR that contains Supabase INSERT or SELECT operations on a named table:
1. IAA MUST locate and directly read the migration DDL file for that table.
2. IAA MUST cross-check every column name used in INSERT values against the schema definition.
3. IAA MUST cross-check every column name used in SELECT strings against the schema definition.
4. Any column name used in code that does NOT appear in the migration schema = REJECTION-PACKAGE.
5. The migration file path MUST be cited in the IAA's FFA evidence output.
6. A non-fatal `try/catch` wrapper does NOT exempt a PR from schema compliance checks.
   Silent failure modes are not "acceptable" — the column names must still be verified against DDL.
7. Mocked Supabase tests do NOT satisfy schema compliance evidence. IAA must verify schema
   compliance by reading the DDL directly, independent of test coverage.

**Check in Phase 3 (BD-TIER-2 — executed as part of BD-005/BD-006)**:
> A-032 Schema Column Compliance:
> Locate migration DDL for each table modified by INSERT/SELECT in the PR.
> For each INSERT: verify every key in the insert object exists as a column in the schema.
> For each SELECT: verify every column name in the select string exists in the schema.
> Evidence: cite migration file path and list each column with ✅/❌ status.
> If any ❌ found → REJECTION-PACKAGE.

**Incident reference**: INC-ALCF-001 | Remediated in: wave-audit-log-column-fix (2026-03-08)
**IAA self-governance action**: Added by independent-assurance-agent during session-wave-audit-log-column-fix-20260308 final audit, per Pre-Brief §7 "shared responsibility between foreman-v2-agent and IAA self-governance."

**Status**: ACTIVE — enforced on all AAWP_MAT PRs containing INSERT/SELECT operations

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-02-25 | Initial registry with A-001, A-002, A-003 |
| 1.1.0 | 2026-02-27 | A-004 (bootstrap directive), A-005 (agent contract immutability) added |
| 1.2.0 | 2026-02-28 | A-006 (PHASE_A_ADVISORY fabrication), A-015 (Tier 2 patches require ceremony), A-016 (cross-PR token reuse), A-017 (REJECTION-as-PASS citation) added |
| 1.3.0 | 2026-03-02 | A-018 renumbered from duplicate A-004; A-019 renumbered from duplicate A-016; duplicate rule ID deduplication |
| 1.4.0 | 2026-03-02 | A-020 (PREHANDOVER template staleness) added from session-088 |
| 1.5.0 | 2026-03-02 | A-021 (commit before invoke), A-022 (re-evaluate trigger categories) added |
| 1.6.0 | 2026-03-03 | A-023 (OVL-AC-012 ripple assessment) codified |
| 1.7.0 | 2026-03-03 | A-024 (secret field naming) added |
| 1.8.0 | 2026-03-03 | A-025 (ceremony PENDING rule), A-023/024/025 conflict resolution |
| 1.9.0 | 2026-03-03 | A-026 (SCOPE_DECLARATION must match PR diff) added |
| 2.0.0 | 2026-03-03 | A-027 (third A-021 = systemic gap) added |
| 2.1.0 | 2026-03-03 | A-028 (SCOPE_DECLARATION format compliance) added |
| 2.2.0 | 2026-03-04 | A-029 ARTIFACT-IMMUTABILITY-4.3b added; supersedes A-025 PENDING requirement |
| 2.3.0 | 2026-03-04 | **BREAKING FIX**: Active Override block added at top — A-029 supersedes A-025 clearly stated. A-025 marked SUPERSEDED with residual scope. A-029 updated with Circular Dependency Resolution note explaining CORE-019 First Invocation Exception. A-029b (Carry-Forward Mandate from session-097) promoted to named rule. A-006 updated to reference dedicated token file instead of verbatim section. A-015 fix procedure updated. Next sequential ID updated to A-030. |
| 2.4.0 | 2026-03-05 | A-031 (IAA ceremony artifact A-026 carve-out) codified — resolves recurring pattern from sessions 142, 146, 148, 149, 150 where IAA's own parking station/session memory/token file from prior rejection ceremony causes A-026 failures; produces two compliant options (full declaration or explicit A-031 carve-out note); next sequential ID updated to A-032. |
| 2.5.0 | 2026-03-08 | A-032 (Schema Column Compliance Check) added — INC-ALCF-001: schema column mismatch escaped IAA gate in wave-upload-doclist-fix; audit_logs INSERT/SELECT used non-existent columns (user_id, resource_type, resource_id); organisation_id NOT NULL omitted; silent try/catch made failure invisible. IAA self-governance action per Pre-Brief §7 shared responsibility clause. Next sequential ID: A-033. |
| 2.6.0 | 2026-03-12 | A-033 (Git-Committed vs Disk Existence — CORE-018 Verification Standard) added — INC-CI-GATEWAY-FIX-001-IAA: IAA evaluated PREHANDOVER as PASS based on disk file existence (`-f` check) when the PREHANDOVER was untracked (never committed to git). Phase 4 `git ls-tree HEAD` revealed file not in any commit. CORE-018(a) must use git verification, not disk existence. Next sequential ID: A-034. |
| 2.7.0 | 2026-03-17 | A-034 (FUNCTIONAL-BEHAVIOUR-REGISTRY reading — mandatory for BUILD/AAWP_MAT PRs; niggle patterns as blocking checks), A-035 (niggle pattern library application — stack-specific patterns in niggle-pattern-library.md must be applied to relevant code areas) added — CS2 IAA functional behaviour strengthening issue. Next sequential ID: A-036. |

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
---

### A-033 — CORE-018 Verification Must Use Git, Not Disk (`git ls-tree HEAD`, Not `-f`)

**Triggered by**: INC-CI-GATEWAY-FIX-001-IAA (session-ci-gateway-fix-20260312, 2026-03-12) — IAA assessed CORE-018(a) as PASS because `[ -f "$PREHANDOVER_PATH" ]` returned true (file was on disk). Phase 4 merge gate parity `git ls-tree -r HEAD | grep PREHANDOVER` returned nothing. The PREHANDOVER was UNTRACKED — never committed to git.

**Incident summary**: Foreman created the PREHANDOVER on disk during the governance ceremony but never ran `git add` + `git commit` + `git push` for that file. IAA read it from disk and assessed CORE-018(a) as PASS. Phase 4 git verification with `git ls-tree -r HEAD` and `git ls-files --error-unmatch` confirmed the file was NOT in any git commit. IAA revised the verdict to REJECTION-PACKAGE after Phase 4 discovery.

**Why this matters**: In a real PR context (GitHub Pull Request), only committed files appear in the PR. An uncommitted untracked file on the CI runner is invisible to any reviewer. CORE-018 exists to ensure the governance record is part of the PR — not just on disk.

**Permanent Rule**:
For CORE-018(a) "PREHANDOVER proof file on branch" — verification MUST use one of:
- `git ls-tree -r HEAD | grep <filename>` — confirms file is in HEAD commit tree
- `git show HEAD:<path>` — reads the committed version (also confirms committed)
- `git ls-files --error-unmatch <path>` — confirms file is tracked in git index

`[ -f "$PATH" ]` disk existence check is INSUFFICIENT for CORE-018(a). A file present on disk but not in git is UNTRACKED and NOT "on the branch" for PR purposes.

**How this is checked in Phase 3 / Phase 4 (CORE-018a evaluation)**:
> A-033 Git-Committed Verification:
> Run: `git ls-tree -r HEAD | grep PREHANDOVER-session-<wave>.md`
> If the file appears: PASS.
> If the file does NOT appear (or `git ls-files --error-unmatch` fails): FAIL regardless of disk presence.
> Finding: "PREHANDOVER proof not committed to git — untracked on disk only."
> Fix required: "git add <path> && git commit && git push"

**Additional scope**: Same rule applies to ALL CORE-018 artifact checks (session memory, token file). Disk presence ≠ committed. Always verify via `git ls-tree HEAD` or `git show HEAD:<path>`.

**Status**: ACTIVE — enforced from session-ci-gateway-fix-20260312 onwards

---

### A-034 — FUNCTIONAL-BEHAVIOUR-REGISTRY Reading Mandatory for BUILD PRs

**Triggered by**: CS2 Issue — IAA functional behaviour strengthening (2026-03-17) — systematic pattern where "works except..." bugs pass IAA review because historical niggle patterns are not re-applied as mandatory checks.

**Incident pattern**: IAA repeatedly approves PRs where a feature appears functionally wired but exhibits known behavioural failure modes (e.g., cache not invalidated after mutation, stale state after save, optimistic update not rolled back on error). These failures are caught post-merge, logged informally, but not converted to re-testable checks. The same patterns recur.

**Permanent Rule**:
For any PR classified as BUILD or AAWP_MAT, IAA MUST at Step 3.1:
1. Open `.agent-workspace/independent-assurance-agent/knowledge/FUNCTIONAL-BEHAVIOUR-REGISTRY.md`.
2. For each registered niggle entry: determine whether the area of code touched by this PR is relevant to that niggle pattern.
3. If relevant: apply the niggle as an explicit testable check against the PR diff — with the same blocking weight as a FAIL-ONLY-ONCE rule.
4. If the check fails → REJECTION-PACKAGE citing the niggle pattern ID and the specific code location.
5. A niggle pattern matched but not checked = REJECTION-PACKAGE (same weight as unchecked FAIL-ONLY-ONCE rule).

**How this is checked in Phase 3 (Step 3.1 FUNCTIONAL-BEHAVIOUR-REGISTRY learning)**:
> A-034 FUNCTIONAL-BEHAVIOUR-REGISTRY:
> Open FUNCTIONAL-BEHAVIOUR-REGISTRY.md. For each entry: is this PR touching relevant code?
> If YES: apply the registered check. Evidence: [what was found]. Verdict: PASS ✅ / FAIL ❌.
> If FAIL: REJECTION-PACKAGE citing niggle ID and specific code location.

**Status**: ACTIVE — enforced on all BUILD/AAWP_MAT PRs

---

### A-035 — Niggle Pattern Library Must Be Applied to Relevant Code Areas

**Triggered by**: CS2 Issue — IAA functional behaviour strengthening (2026-03-17) — stack-specific failure patterns (TanStack Query cache invalidation, Supabase RLS gotchas, Zustand store leakage) are not systematically checked despite being well-known recurring failure modes in this stack.

**Permanent Rule**:
For any PR classified as BUILD or AAWP_MAT, IAA MUST at Step 3.1:
1. Open `.agent-workspace/independent-assurance-agent/knowledge/niggle-pattern-library.md`.
2. Identify which stack-specific patterns are relevant to the code changed in this PR (by technology area: TanStack Query, Supabase, Zustand, Next.js routing, etc.).
3. For each relevant pattern: execute the described check against the PR diff.
4. If a known pattern is violated → REJECTION-PACKAGE citing the pattern ID and specific code.
5. A relevant pattern not checked = REJECTION-PACKAGE (omission is itself a failure).

**How this is checked in Phase 3 (Step 3.1 niggle pattern check)**:
> A-035 Niggle Pattern Library:
> Open niggle-pattern-library.md. Identify relevant patterns for this PR's code areas.
> For each relevant pattern: check the diff. Evidence: [what was found]. Verdict: PASS ✅ / FAIL ❌.
> If FAIL: REJECTION-PACKAGE citing pattern ID and specific violation.

**Status**: ACTIVE — enforced on all BUILD/AAWP_MAT PRs
