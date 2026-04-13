# IAA Pre-Brief — Wave OVL-INJ
# Add OVL-INJ-001: Injection Audit Trail Check to IAA PREHANDOVER Canon

**Artifact Type**: IAA Pre-Brief (Phase 0 output)
**Wave**: Wave OVL-INJ
**Branch**: `copilot/add-injection-audit-trail-check`
**IAA Session**: session-prebrief-waveOVLINJ-20260307
**Date**: 2026-03-07
**IAA Agent Version**: independent-assurance-agent v6.2.0 / contract v2.2.0
**Invocation Trigger**: `IAA_PRE_BRIEF_PROTOCOL.md §Trigger` — foreman-v2-agent wave-current-tasks.md
**CS2 Authorization**: Issue opened and assigned to CodexAdvisor-agent by @APGI-cmy directly
**Status**: ISSUED — builder (CodexAdvisor-agent) may proceed
**Pre-Brief Phase Mode**: PHASE_B_BLOCKING (verdicts at handover are hard-blocking)

---

## PHASE 0 BOOTSTRAP ATTESTATION

> "I am independent-assurance-agent, class: assurance, version 6.2.0.
> My role: Independent final-gate assurance before merge of qualifying PRs.
> STOP-AND-FIX mandate: ACTIVE. No class exceptions. Ambiguity resolves to mandatory invocation.
> Authority: CS2 only (@APGI-cmy). This Pre-Brief is issued under CS2 explicit mandate.
> I did NOT produce any artifact in this PR. Producer: CodexAdvisor-agent."

---

## Pre-Brief Summary

This Pre-Brief covers 4 tasks in Wave OVL-INJ. After classification, **all 4 tasks are
QUALIFYING** — they modify IAA Tier 1 canon and Tier 2 knowledge files. All 4 tasks will be
delivered in a single PR bundle.

**Overall PR Classification**: **MIXED — CANON_GOVERNANCE + KNOWLEDGE_GOVERNANCE**
**PR Tier (canon Risk-Tiered Ceremony Table)**: **T3** (T3 governs over T5 when mixed)
**IAA Triggered at Handover**: **YES — MANDATORY** (see §Governance Conflict below)
**Phases Required at Handover**: **Three-Phase: Phase 1 (Preflight) + Phase 2 (Governance) + Phase 4 (Handover)**
**Phase 3 (Working Phase Proof)**: NOT required at T3 — optional but accepted if supplied

---

## ⚠️ GOVERNANCE CONFLICT — MUST BE READ BEFORE PROCEEDING

**CONFLICT: Canon Trigger Table (T1 authority) vs Tier 2 Trigger Table**

| Authority | Document | Says |
|-----------|----------|------|
| **Tier 1 — Canon** | `INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.3.0 §Trigger Table | T3 (canon change): IAA = **NO**, CS2 Direct Review sufficient. T5 (knowledge patch): IAA = **NO**, self-attestation + CS2 spot-check. |
| **Tier 2 — Knowledge** | `iaa-trigger-table.md` v2.1.0 | CANON_GOVERNANCE: IAA = **YES — MANDATORY**. KNOWLEDGE_GOVERNANCE: IAA = **YES — MANDATORY**. |

**These two documents conflict.** Under the Three-Tier Knowledge Architecture, Tier 1 governs.
The canon's own Trigger Table states IAA is NOT required for T3/T5 PRs.

**Resolution for this wave**: IAA proceeds under **CS2 explicit mandate**. @APGI-cmy opened
this issue and assigned the Pre-Brief requirement directly. CS2 is the only authority above
the canon's own Trigger Table. CS2's explicit authorisation overrides the T3/T5 exemption.

**Action required from CS2 at merge time**: Resolve the conflict permanently by either:
- (a) updating the canon §Trigger Table to add T3/T5 as IAA-required categories, OR
- (b) updating the Tier 2 trigger table to align with the canon's T3/T5 exemptions

This conflict means the same governance system simultaneously says IAA IS and IS NOT required
for this exact PR type. This is a structural gap that will cause confusion in future waves.
**This is flagged as Scope Blocker SB-001.** Builder does not need to fix this — it requires CS2
governance decision. It does NOT block wave execution under CS2 explicit mandate.

---

## ⚠️ SELF-REFERENTIAL REVIEW NOTICE

This PR modifies IAA's own operational infrastructure:
- **Tier 1 canon** (`INDEPENDENT_ASSURANCE_AGENT_CANON.md`) — the governing document for IAA itself
- **Tier 2 knowledge** (`iaa-category-overlays.md`, `index.md`) — files IAA loads at every invocation

IAA is being asked to assure a change to the rules IAA itself will execute.

**Independence confirmation**: IAA (independent-assurance-agent) did NOT produce the content
of any changed file in this PR. Producer is CodexAdvisor-agent. Independence requirement is
**satisfied**. IAA may review this PR.

**Special review obligation**: Because the change modifies IAA's own operational rules,
IAA will apply heightened substance scrutiny to the design of OVL-INJ-001 specifically:
- Is the check design sound and unambiguous?
- Is the check enforceable by an agent reading the overlay file?
- Does it introduce circular logic (IAA checking for evidence of IAA's own prior invocation)?
- Does it create any bypass path or enforcement gap?

This is flagged as **Scope Advisory SA-001** — not a blocker, but builders should note that
the OVL-INJ-001 check design will receive 90%-effort scrutiny from IAA, not just existence
checks. Design it precisely.

---

## Task Classification Table

| Task ID | Description | Files Modified | IAA Trigger Category | Qualifying? | Tier |
|---------|-------------|----------------|---------------------|-------------|------|
| T-OVLINJ-001 | Add `OVL-INJ-001` overlay + `INJECTION_AUDIT_TRAIL` section to `iaa-category-overlays.md` v3.1.0→v3.2.0 | `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md` | KNOWLEDGE_GOVERNANCE | ✅ YES | T5 |
| T-OVLINJ-002 | Update `INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.3.0→v1.4.0 — add §INJECTION_AUDIT_TRAIL mandatory PREHANDOVER check; link with AGCFPP-001 | `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` | CANON_GOVERNANCE | ✅ YES | T3 |
| T-OVLINJ-003 | Bump IAA knowledge `index.md` v2.6.0→v2.7.0 — reflect updated `iaa-category-overlays.md` version | `.agent-workspace/independent-assurance-agent/knowledge/index.md` | KNOWLEDGE_GOVERNANCE | ✅ YES | T5 |
| T-OVLINJ-004 | Update `governance/CANON_INVENTORY.json` — refresh hashes for `INDEPENDENT_ASSURANCE_AGENT_CANON.md` | `governance/CANON_INVENTORY.json` | CANON_GOVERNANCE | ✅ YES | T3 |

**PR Tier determination**: T3 governs (T-OVLINJ-002 and T-OVLINJ-004 are T3; T-OVLINJ-001 and
T-OVLINJ-003 are T5; highest tier present is T3 per canon tier determination rules).

**Bundling rule**: All 4 tasks are in one PR — the T3 ceremony (Three-Phase: 1, 2, 4) applies
to the entire bundle.

---

## Per-Task IAA Audit Requirements at Handover

---

### T-OVLINJ-001 — `iaa-category-overlays.md` v3.1.0→v3.2.0

**File**: `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md`
**Builder**: CodexAdvisor-agent
**IAA Trigger Category**: KNOWLEDGE_GOVERNANCE
**Applicable Overlays**: Universal Ceremony Gate (CERT-001–CERT-004) + KNOWLEDGE_GOVERNANCE Overlay

**Specific Checks IAA Will Execute at Handover**:

| Check ID | Check Name | What IAA Will Look For |
|----------|------------|------------------------|
| CERT-001 | PREHANDOVER proof exists | File present on branch |
| CERT-002 | Session memory exists | CodexAdvisor session memory file present on branch |
| CERT-003 | FAIL-ONLY-ONCE attestation | `fail_only_once_attested: true` declared in session memory preamble |
| CERT-004 | IAA token field | `iaa_audit_token` field in PREHANDOVER proof — pre-populated per A-029 |
| OVL-KG-001 | Rule clarity — OVL-INJ-001 design | Is OVL-INJ-001 stated clearly enough for an agent to apply it without ambiguity? Does it specify: what to check, what constitutes PASS, what constitutes FAIL, what remediation is required? A vague rule is not a rule. |
| OVL-KG-001 | INJECTION_AUDIT_TRAIL section structure | Is the section header, check ID, check name, and pass/fail criteria present and unambiguous? Does it integrate correctly into the overlay file structure without breaking existing sections? |
| OVL-KG-002 | Incident grounding | Is OVL-INJ-001 traceable to a real incident or confirmed pattern (e.g., a specific wave where injection audit trail was absent and caused issues)? If no incident exists — is the rationale stated? Rules with no grounding belong in canon strategy sections, not operational check registries. |
| OVL-KG-003 | No duplication | Does OVL-INJ-001 duplicate any existing overlay check? Check against: OVL-CG-001–005, OVL-KG-001–004, CORE-013, CORE-018. Cross-check that "Injection Audit Trail" is not already partially covered by an existing check. |
| OVL-KG-004 | Cross-reference consistency | If OVL-INJ-001 references AGCFPP-001, any workflow file, any specific audit trail format — those references must exist in the repository. Dangling references = REJECTION-PACKAGE. |
| OVL-KG-ADM-002 | Version bumped | File header shows version `3.2.0` |
| OVL-KG-ADM-003 | Index.md updated | `.agent-workspace/independent-assurance-agent/knowledge/index.md` table reflects `iaa-category-overlays.md` at version `3.2.0` |

**IAA Substantive Focus (90% effort on this task)**:
> Primary question: **Is OVL-INJ-001 a correctly designed, enforceable governance check?**
>
> IAA will specifically assess:
> 1. **What is "injection audit trail"?** — The check must define this unambiguously. Is it a
>    file? A comment? A workflow run? An artifact in `.agent-admin/`? If it is undefined,
>    the check is meaningless.
> 2. **How does an agent prove compliance?** — The check must state exactly what evidence
>    satisfies it. "Audit trail present" is insufficient. "File at path X with fields Y and Z"
>    is sufficient.
> 3. **Self-referential risk** — Does the check require IAA to verify its own prior invocation?
>    If yes, is that circular? IAA will assess whether this creates a bypass risk.
> 4. **Enforcement gap** — Can this check be run autonomously by IAA without CS2 input?
>    If not, it is not operable as a standalone gate check.
> 5. **AGCFPP-001 linkage** — If OVL-INJ-001 references AGCFPP-001, IAA will verify the
>    connection is substantive (not just a citation). Does AGCFPP-001 actually govern what
>    OVL-INJ-001 is checking?

**Notes for Builder (CodexAdvisor-agent)**:
- Design OVL-INJ-001 with complete pass/fail criteria, not just a description.
- The check should fit the existing overlay table format: `Check ID | Check Name | What IAA Does`.
- The `INJECTION_AUDIT_TRAIL` section should integrate cleanly into the existing overlay file
  without disrupting the section ordering or version history table at the bottom.
- Version history entry for v3.2.0 must be added to the `## Version History` table.

---

### T-OVLINJ-002 — `INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.3.0→v1.4.0

**File**: `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`
**Builder**: CodexAdvisor-agent
**IAA Trigger Category**: CANON_GOVERNANCE
**Amendment Authority**: This canon may only be amended by CS2. IAA will verify CS2 authorisation.
**Applicable Overlays**: Universal Ceremony Gate (CERT-001–CERT-004) + CANON_GOVERNANCE Overlay

**Specific Checks IAA Will Execute at Handover**:

| Check ID | Check Name | What IAA Will Look For |
|----------|------------|------------------------|
| OVL-CG-001 | Strategy alignment | Does the §INJECTION_AUDIT_TRAIL addition correctly serve the governance strategy? Is there an obvious gap between what the strategy requires and what is delivered? |
| OVL-CG-002 | No contradictions | Does the addition contradict any existing canon section? Specifically: does it contradict §Risk-Tiered Ceremony Table, §Trigger Table, §PREHANDOVER proof requirements, or §Hard-Trigger Authority? |
| OVL-CG-003 | Enforcement gap | Is the new §INJECTION_AUDIT_TRAIL rule enforceable as written? If IAA must verify it without further specification, does the canon provide sufficient basis for IAA to make a binary PASS/FAIL determination? |
| OVL-CG-004 | Ripple impact assessed | Does this canon change require updates in any other canon, agent contract, or knowledge file beyond the 4 tasks in this wave? If yes — are those identified and flagged in the PREHANDOVER proof? |
| OVL-CG-005 | ISMS layer-down scope | Are all ripple-affected files within this wave covered by T-OVLINJ-001 through T-OVLINJ-004? Has any affected file been missed? |
| OVL-CG-ADM-001 | CANON_INVENTORY updated | `governance/CANON_INVENTORY.json` reflects the new `INDEPENDENT_ASSURANCE_AGENT_CANON.md` hash (T-OVLINJ-004) |
| OVL-CG-ADM-002 | Version bump | Canon header shows `v1.4.0`; amendment history entry added |
| AGCFPP-001 link | AGCFPP-001 linkage verified | If the addition references AGCFPP-001 (`governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md`), IAA will verify the linkage is substantive and AGCFPP-001 governs the injection audit trail concern |

**IAA Substantive Focus (90% effort on this task)**:
> Primary question: **Does the canon addition correctly codify OVL-INJ-001 as a mandatory
> PREHANDOVER gate, and is it coherent with the rest of the canon?**
>
> IAA will specifically assess:
> 1. **Does the §INJECTION_AUDIT_TRAIL section sit correctly in the canon structure?** —
>    Which section does it belong in? (§PREHANDOVER protocol? §Hard-Trigger Authority?
>    A new §INJECTION_AUDIT_TRAIL section?) The placement must be logical.
> 2. **Is the AGCFPP-001 linkage substantive?** — AGCFPP-001 is the Agent Contract File
>    Protection Policy. What does injection audit trail have to do with contract file
>    protection? IAA will assess whether the linkage is genuine or a citation without substance.
> 3. **Does this addition change the ceremony requirements?** — If OVL-INJ-001 adds a new
>    mandatory PREHANDOVER check, does the canon's §Five-Phase Delivery Proof Protocol or
>    §PREHANDOVER proof sections need updating? If yes and they are not updated = gap.
> 4. **Amendment authority compliance** — This canon states: "Only CS2 may amend this canon."
>    The wave-current-tasks.md confirms CS2 authorised this change. IAA will verify the PR
>    description or commit history contains a CS2 authorisation reference.

**Notes for Builder (CodexAdvisor-agent)**:
- The amendment history block at the top of the canon (`**Amended**: YYYY-MM-DD — vX.Y.Z`) must
  include a v1.4.0 entry.
- The AGCFPP-001 connection must be explained, not just cited. If the connection is not
  substantive, remove the citation and reference the actual applicable canon.
- Ensure the injection audit trail requirement is placed in the canon section where it will
  logically be discovered by agents reading the canon to understand PREHANDOVER requirements.

---

### T-OVLINJ-003 — `knowledge/index.md` v2.6.0→v2.7.0

**File**: `.agent-workspace/independent-assurance-agent/knowledge/index.md`
**Builder**: CodexAdvisor-agent
**IAA Trigger Category**: KNOWLEDGE_GOVERNANCE
**Applicable Overlays**: KNOWLEDGE_GOVERNANCE Overlay (Admin Checks only — T-OVLINJ-003 is administrative)

**Specific Checks IAA Will Execute at Handover**:

| Check ID | Check Name | What IAA Will Look For |
|----------|------------|------------------------|
| OVL-KG-ADM-002 | Version bumped | File header shows `v2.7.0` |
| OVL-KG-ADM-003 | Table updated | `iaa-category-overlays.md` row in the Tier 2 Knowledge Contents table updated to `3.2.0` |
| CORE-007 | No placeholder content | No TBD/TODO/FIXME in the index entry for the updated files |

**IAA Substantive Focus**:
> This is an administrative version bump. IAA will spend minimal time on this task.
> Primary check: does the index.md correctly reflect the new versions of all files changed
> in this wave? Secondary check: is the version history table at the bottom of index.md
> updated with a v2.7.0 entry?

**Notes for Builder (CodexAdvisor-agent)**:
- Update both (1) the `iaa-category-overlays.md` row in the Tier 2 Knowledge Contents table
  and (2) the version history table at the bottom of the file.
- The version history entry should summarise what changed in v2.7.0 (e.g., "iaa-category-overlays.md
  → v3.2.0 — OVL-INJ-001 INJECTION_AUDIT_TRAIL section added").

---

### T-OVLINJ-004 — `governance/CANON_INVENTORY.json`

**File**: `governance/CANON_INVENTORY.json`
**Builder**: CodexAdvisor-agent
**IAA Trigger Category**: CANON_GOVERNANCE
**Applicable Overlays**: CANON_GOVERNANCE Overlay (Admin Checks) + CORE invariants

**Specific Checks IAA Will Execute at Handover**:

| Check ID | Check Name | What IAA Will Look For |
|----------|------------|------------------------|
| CORE-002 | No null/placeholder hashes | All `file_hash_sha256` values are real SHA256 hex strings — 64 characters, no nulls, no empty strings, no `000000` padding, no placeholder values. Any placeholder = HALT-002 |
| OVL-CG-ADM-001 | Hash updated | `INDEPENDENT_ASSURANCE_AGENT_CANON.md` entry in CANON_INVENTORY shows the real SHA256 of the new v1.4.0 file (not a placeholder) |
| CORE-007 | No incomplete entries | All required fields populated for every modified entry |

**IAA Substantive Focus**:
> Critical check: the SHA256 hash for `INDEPENDENT_ASSURANCE_AGENT_CANON.md` must be the
> **actual computed hash** of the committed v1.4.0 file — not a placeholder, not the prior
> hash, not a manually estimated value.
>
> IAA will independently compute `sha256sum governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`
> and compare it to the CANON_INVENTORY entry. If they do not match = immediate REJECTION-PACKAGE.
>
> Similarly for `iaa-category-overlays.md` if it is listed in CANON_INVENTORY (check whether
> it is a tracked file — if not, no CANON_INVENTORY update needed for it).

**Notes for Builder (CodexAdvisor-agent)**:
- Use `sha256sum governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` to compute the actual
  hash **after** all other changes are committed to the branch.
- Do NOT update CANON_INVENTORY until all other files are in their final committed state.
- T-OVLINJ-004 must be the **last task committed** in this wave — hash values are invalidated
  by any subsequent changes to the hashed files.

---

## FFA Checks at Handover (T3 Tier — Governance PR)

Per the Risk-Tiered Ceremony Table, T3 PRs require FFA-01 and FFA-03 adapted to governance context:

| FFA Check | Governance Adaptation | What IAA Will Assess |
|-----------|----------------------|----------------------|
| **FFA-01** — Delivery Completeness | Are all 4 declared tasks fully delivered in the PR diff? No partial delivery — all version bumps, section additions, hash updates, and index updates must be present. | Cross-reference wave-current-tasks.md task list against actual `git diff origin/main...HEAD --name-only`. Every declared file change must appear. |
| **FFA-03** — Integration Fit | Does the governance change fit correctly into the existing IAA operational system? Does OVL-INJ-001 sit coherently alongside OVL-CG-001–005, OVL-KG-001–004, and the existing KNOWLEDGE_GOVERNANCE overlay? Does the canon addition integrate cleanly without breaking existing ceremony requirements? | Read the modified files as a whole. Assess whether OVL-INJ-001 is operable alongside the existing checks without contradiction or confusion. |

---

## PREHANDOVER Proof Structure Required

CodexAdvisor-agent must produce a PREHANDOVER proof file committed to the branch before
invoking IAA at handover. The file must contain the following fields and sections:

### Required File
**Path**: `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-waveOVLINJ-20260307.md`
(or equivalent PREHANDOVER path for CodexAdvisor-agent)

### Required Fields (per A-029 — PREHANDOVER Immutability)

```markdown
| Field | Value |
|-------|-------|
| `wave` | Wave OVL-INJ |
| `session_id` | session-waveOVLINJ-20260307 (or CodexAdvisor session ID) |
| `branch` | copilot/add-injection-audit-trail-check |
| `producer_agent` | CodexAdvisor-agent |
| `iaa_audit_token` | IAA-session-waveOVLINJ-20260307-PASS ← PRE-POPULATED per A-029 |
| `fail_only_once_attested` | true |
| `scope_declaration_verified` | true — matches git diff output (A-026) |
| `pre_iai_commit_gate` | CONFIRMED — all files committed and pushed before IAA invocation (A-021) |
```

### Required Sections

**Phase 1 — Preflight**:
- CodexAdvisor-agent identity, class, contract version
- Tier 1 canon(s) loaded: `INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.4.0 (post-change), `CANON_INVENTORY.json` (updated)
- FAIL-ONLY-ONCE self-attestation: complete — list applicable rules

**Phase 2 — Governance**:
- Canon files governing this delivery: list all with versions
- Hash verification: `sha256sum` command output for `INDEPENDENT_ASSURANCE_AGENT_CANON.md` matching CANON_INVENTORY entry
- Protected file confirmation: `.github/agents/independent-assurance-agent.md` not modified
- CS2 authorisation reference: issue number or commit reference confirming CS2 approved this change

**Phase 4 — Handover**:
- Task completion table: T-OVLINJ-001 through T-OVLINJ-004 each with status DONE + evidence
- Version bump confirmation: `iaa-category-overlays.md` at `3.2.0`, `INDEPENDENT_ASSURANCE_AGENT_CANON.md` at `1.4.0`, `index.md` at `2.7.0`
- CANON_INVENTORY hash confirmed: `sha256sum` output matching committed file
- SCOPE_DECLARATION.md verified (A-026): matches `git diff --name-only origin/main...HEAD` exactly
- Ripple assessment: are any additional files affected by this wave beyond the 4 declared tasks?
- Green state declaration: "All 4 tasks committed. Branch is in GREEN state. IAA invocation authorised."

**SCOPE_DECLARATION.md** (per A-026 + A-028):
- Must be present as a committed file on the branch
- Must list all and only the files modified in this PR
- Must not carry forward entries from prior waves
- Must match `git diff --name-only origin/main...HEAD` exactly at invocation time

---

## Scope Blockers and Governance Conflicts

### SB-001 — CANON vs TIER 2 TRIGGER CONFLICT (Governance Conflict — CS2 Decision Required)

**Severity**: Advisory (does not block wave execution under CS2 explicit mandate)
**Description**: The canon Trigger Table (T1) and the Tier 2 iaa-trigger-table.md are in direct
conflict over whether IAA is required for T3/T5 PRs. This creates ambiguity in future waves.
**Action required**: CS2 must resolve this conflict at merge time by updating one of the two
documents to align. See §Governance Conflict section above for resolution options.
**Impact on this wave**: None — CS2 explicit mandate authorises IAA involvement.

### SB-002 — T-OVLINJ-004 MUST BE LAST COMMIT (Ordering Constraint)

**Severity**: Hard constraint — if violated, CANON_INVENTORY hash will be stale/wrong
**Description**: CANON_INVENTORY.json must be updated with the SHA256 hash of the **final
committed state** of `INDEPENDENT_ASSURANCE_AGENT_CANON.md`. Any change to that file after
CANON_INVENTORY is updated will invalidate the hash.
**Action required**: CodexAdvisor-agent must commit T-OVLINJ-001, T-OVLINJ-002, T-OVLINJ-003
first, then compute the actual SHA256 and commit T-OVLINJ-004 last.
**Impact on this wave**: Failure to observe this ordering = CORE-002 HALT at IAA handover.

### SB-003 — OVL-INJ-001 DESIGN PRECISION REQUIRED (Quality Advisory)

**Severity**: Advisory (will be assessed at handover — poor design = REJECTION-PACKAGE)
**Description**: OVL-INJ-001 modifies IAA's own operational overlay. IAA will apply 90% scrutiny
to the design. If OVL-INJ-001 does not clearly define (1) what constitutes an injection audit
trail, (2) how an agent proves compliance, (3) what the exact pass/fail criteria are, and
(4) how it integrates with existing checks — it will receive OVL-KG-001 FAIL.
**Action required**: CodexAdvisor-agent must design OVL-INJ-001 with complete pass/fail
criteria before committing. Review the design against §SA-001 guidance in this Pre-Brief.

### SA-001 — SELF-REFERENTIAL REVIEW (Scope Advisory — Not a Blocker)

**Severity**: Advisory — independence is confirmed, no blocker
**Description**: This PR modifies IAA's own Tier 1 and Tier 2 operational files. Independence
is confirmed (CodexAdvisor-agent = producer; IAA = reviewer — different agents). However,
IAA has a special substantive obligation to assess the OVL-INJ-001 design as it will govern
IAA's own future operation.
**Action required**: None from builder. IAA notes this obligation.

---

## Checks IAA Will Run at Handover — Full List

### Universal Ceremony Gate (CERT — all 4)

| Check | Description |
|-------|-------------|
| CERT-001 | PREHANDOVER proof file present on branch |
| CERT-002 | CodexAdvisor session memory file present on branch |
| CERT-003 | `fail_only_once_attested: true` declared in session memory preamble |
| CERT-004 | `iaa_audit_token` field present in PREHANDOVER proof (A-029 pre-populated) |

### Core Invariants (CORE — applicable subset)

| Check | Applied to |
|-------|-----------|
| CORE-002 | CANON_INVENTORY hashes — all real SHA256, no nulls/placeholders |
| CORE-007 | No TBD/TODO/FIXME/placeholder content in delivered governance text |
| CORE-013 | IAA invocation evidence present in PREHANDOVER proof |
| CORE-015 | Session memory present — CodexAdvisor session memory on branch |
| CORE-016 | IAA dedicated token file path declared in PREHANDOVER proof |
| CORE-018 | Complete evidence artifact sweep — all required files present before overlays |
| CORE-021 | Zero-severity-tolerance — any finding → REJECTION-PACKAGE |

### KNOWLEDGE_GOVERNANCE Overlay (T-OVLINJ-001, T-OVLINJ-003)

| Check | Applied to |
|-------|-----------|
| OVL-KG-001 | Rule clarity — OVL-INJ-001 design (primary substantive focus) |
| OVL-KG-002 | Incident grounding — is OVL-INJ-001 traceable to a real incident? |
| OVL-KG-003 | No duplication — OVL-INJ-001 does not duplicate existing checks |
| OVL-KG-004 | Cross-reference consistency — AGCFPP-001 and any other references exist |
| OVL-KG-ADM-002 | Version bump — `iaa-category-overlays.md` shows v3.2.0 |
| OVL-KG-ADM-003 | `index.md` updated — table reflects v3.2.0 |

### CANON_GOVERNANCE Overlay (T-OVLINJ-002, T-OVLINJ-004)

| Check | Applied to |
|-------|-----------|
| OVL-CG-001 | Strategy alignment — §INJECTION_AUDIT_TRAIL serves stated governance strategy |
| OVL-CG-002 | No contradictions — no conflict with existing canon sections |
| OVL-CG-003 | Enforcement gap — OVL-INJ-001 is enforceable as written |
| OVL-CG-004 | Ripple impact assessed — all downstream effects identified |
| OVL-CG-005 | ISMS layer-down scope — no affected file missed |
| OVL-CG-ADM-001 | CANON_INVENTORY updated with real SHA256 |
| OVL-CG-ADM-002 | Canon version bump to v1.4.0 with amendment history entry |

### FFA (T3 governance adaptation)

| Check | Description |
|-------|-------------|
| FFA-01 | All 4 tasks delivered — no partial delivery |
| FFA-03 | OVL-INJ-001 integrates coherently with existing IAA overlay and canon structure |

**Total checks at handover**: ~24 (CERT × 4, CORE × 7, KG overlay × 6, CG overlay × 7, FFA × 2, merge gate parity × 1)

---

## Merge Gate Parity Check (§4.3 — at handover)

IAA will run the following locally before issuing verdict:

| Check | What IAA runs |
|-------|---------------|
| YAML validation | N/A — no YAML agent contracts modified in this wave |
| SHA256 hash verification | `sha256sum governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` vs CANON_INVENTORY.json entry |
| SCOPE_DECLARATION match | `git diff --name-only origin/main...HEAD` vs SCOPE_DECLARATION.md content |
| Evidence artifacts exist | `ls .agent-admin/assurance/iaa-token-session-waveOVLINJ-*.md` (expected after ASSURANCE-TOKEN issued) |
| No placeholder hashes | `python3 -c "import json; ..."` to verify no null/000000/empty hashes in CANON_INVENTORY |

---

## Expected IAA Token Reference (A-029 Compliance)

Per FAIL-ONLY-ONCE A-029, the PREHANDOVER proof must be committed with the **expected** IAA
token reference pre-populated in the `iaa_audit_token` field:

```
iaa_audit_token: IAA-session-waveOVLINJ-20260307-PASS
```

The actual IAA token file (if ASSURANCE-TOKEN is issued) will be written to:
```
.agent-admin/assurance/iaa-token-session-waveOVLINJ-20260307.md
```

**The PREHANDOVER proof is READ-ONLY after commit.** IAA will NOT modify it. If REJECTION-PACKAGE
is issued, CodexAdvisor-agent creates a correction addendum (per A-030) and re-invokes IAA.

---

## Pre-Brief Status

| Item | Status |
|------|--------|
| Wave tasks read | ✅ COMPLETE |
| Trigger categories declared | ✅ CANON_GOVERNANCE + KNOWLEDGE_GOVERNANCE (MIXED) |
| PR tier classified | ✅ T3 (T3 governs over T5) |
| IAA trigger confirmed | ✅ YES — under CS2 explicit mandate |
| FFA checks declared | ✅ FFA-01, FFA-03 (T3 governance adaptation) |
| PREHANDOVER structure declared | ✅ Three-Phase (1, 2, 4) |
| Scope blockers identified | ✅ SB-001 (governance conflict), SB-002 (hash ordering), SB-003 (OVL-INJ-001 design) |
| Governance conflicts flagged | ✅ SB-001 — Canon vs Tier 2 trigger conflict — CS2 decision required at merge |
| Self-referential review noted | ✅ SA-001 — independence confirmed, special scrutiny declared |
| Pre-Brief artifact committed | ✅ THIS FILE |

**ISSUED — CodexAdvisor-agent may proceed to build. All acceptance criteria are declared above.**

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Agent**: independent-assurance-agent v6.2.0
**Pre-Brief Version**: 1.0.0
**Date**: 2026-03-07
**PHASE_B_BLOCKING**: Hard gate ACTIVE at handover
