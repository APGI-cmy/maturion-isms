# IAA Pre-Brief — Wave PS-B: Foreman FAIL-ONLY-ONCE v4.2.0

**Artifact Type**: IAA Pre-Brief (Phase 0 output)
**Wave Slug**: `ps-b-fail-only-once-v420-20260407`
**Branch**: `copilot/ps-b-foreman-fail-only-once`
**Issue**: maturion-isms#1268
**Issue Title**: [PS-B] Foreman FAIL-ONLY-ONCE v4.2.0 — dedup + new A-rules
**IAA Session**: session-prebrief-ps-b-fail-only-once-v420-20260407
**Date**: 2026-04-07
**IAA Agent Version**: independent-assurance-agent v6.2.0 / contract v2.4.0
**Invocation Trigger**: IAA Pre-Brief request — foreman-v2-agent wave-current-tasks.md
**CS2 Authorization**: Issue #1268 opened and assigned by @APGI-cmy (CS2)
**Requesting Agent**: foreman-v2-agent
**Status**: ISSUED — foreman-v2-agent may proceed with FAIL-ONLY-ONCE.md update
**Pre-Brief Phase Mode**: PHASE_B_BLOCKING (verdicts at handover are hard-blocking)

---

## PHASE 0 BOOTSTRAP ATTESTATION

> "I am independent-assurance-agent, class: assurance, version 6.2.0.
> My role: Independent final-gate assurance before merge of qualifying PRs.
> STOP-AND-FIX mandate: ACTIVE. No class exceptions. Ambiguity resolves to mandatory invocation.
> Authority: CS2 only (@APGI-cmy). This Pre-Brief is issued under CS2 explicit mandate
> (issue #1268, @APGI-cmy is assignor).
> I did NOT produce any artifact in this PR. This pre-brief serves as Phase 0 only —
> I will not proceed to Phase 2–4 assurance until foreman-v2-agent delivers the PREHANDOVER proof."

---

## Wave Overview

**Wave type**: KNOWLEDGE_GOVERNANCE
**Producing agent**: foreman-v2-agent
**Target file**: `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md`
**Version change**: v4.1.0 → v4.2.0
**Number of changes**: 6 (PS-B-01 through PS-B-06)

### Declared Deliverables

| # | Deliverable | Type |
|---|-------------|------|
| 1 | Updated `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` (v4.2.0) | QUALIFYING |
| 2 | Updated `.agent-workspace/foreman-v2/knowledge/index.md` (v4.2.0 reference) | QUALIFYING |
| 3 | Updated `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | QUALIFYING |
| 4 | Foreman session memory | CEREMONY |
| 5 | PREHANDOVER proof | CEREMONY |

---

## TASK CLASSIFICATION

### Task T-01: Update FAIL-ONLY-ONCE.md v4.1.0 → v4.2.0

**Description**: Apply 6 changes (PS-B-01 through PS-B-06) to the Foreman Tier 2
knowledge file. Specific changes:

| Change ID | Description | Nature |
|-----------|-------------|--------|
| PS-B-01 | Rename second A-004 → A-018 in canonical registry; update ID Namespace Note in ISMS-local file | ID deduplication fix |
| PS-B-02 | Rename second A-016 → A-019 in canonical registry; add canonical A-019 layer-down in ISMS-local file | ID deduplication fix |
| PS-B-03 | Add A-033: Foreman ceremony files declared in SCOPE_DECLARATION; A-031 carve-out for IAA artifacts | New rule |
| PS-B-04 | Add A-034: Canon file modifications require CANON_INVENTORY.json update in same wave | New rule |
| PS-B-05 | Add A-035: DELEGATION-ISSUE-REQUIRED — every builder delegation requires GitHub issue | New rule |
| PS-B-06 | Add corrective action completion marker `[ ]`/`[x]` convention for incident log | Convention addition |

**Note on renumbering**: The current file has A-033 (NO-COMPLEXITY-THRESHOLD-EXEMPTION), A-034
(CI-FIX-NO-EXEMPTION), and A-035 (COPILOT-BUILDER-ROLE-LABEL-BYPASS-PROHIBITION). Per the
wave declaration, these will be renumbered to A-036, A-037, A-038 respectively to make room
for the new PS-B-03/04/05 rules at A-033/A-034/A-035.

**IAA Trigger Category**: **KNOWLEDGE_GOVERNANCE — MANDATORY**
**Trigger condition satisfied**: `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` is a
`.agent-workspace/*/knowledge/` file. Any modification to this file activates the
KNOWLEDGE_GOVERNANCE trigger per `iaa-trigger-table.md` v2.2.0 Classification Decision Flow Step 6.

---

## TRIGGER CLASSIFICATION

```
Classification Decision Flow:
  Step 1: .github/agents/ or governance/agents/ changes? → NO
  Step 2: governance/canon/ or CANON_INVENTORY.json changes? → NO
  Step 3: .github/workflows/ changes? → NO
  Step 4: AAWP/MAT deliverable artifacts? → NO
  Step 5: governance/quality/agent-integrity/ changes? → NO
  Step 6: .agent-workspace/*/knowledge/ file changes? → YES ✓
  → CATEGORY: KNOWLEDGE_GOVERNANCE
  → IAA: MANDATORY
```

**PR Category**: **KNOWLEDGE_GOVERNANCE**
**IAA Triggered at Handover**: **YES — MANDATORY**
**Ambiguity**: NONE — classification is unambiguous. The target file is explicitly in
`.agent-workspace/foreman-v2/knowledge/` — the exact path pattern for KNOWLEDGE_GOVERNANCE.

**Additional trigger check**: Does the wave also update `wave-current-tasks.md`?
→ Yes — `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` is a personal/admin file,
not a knowledge file. It does NOT independently trigger KNOWLEDGE_GOVERNANCE, but it is part
of the PR bundle. Classification remains **KNOWLEDGE_GOVERNANCE** (single-category, no MIXED
resolution needed).

**Does `index.md` update independently trigger?**: Yes — `.agent-workspace/foreman-v2/knowledge/index.md`
is itself a `.agent-workspace/*/knowledge/` file. The KNOWLEDGE_GOVERNANCE trigger stands.

---

## APPLICABLE OVERLAYS AT HANDOVER

IAA will apply the following overlay layers during Phase 3 assurance:

| Layer | Overlay | Checks |
|-------|---------|--------|
| Universal Ceremony Gate | CERT-001 through CERT-004 | Existence checks: PREHANDOVER proof, session memory, FFA attestation, iaa_audit_token field |
| Core Invariants | CORE-001 through CORE-024 | Applicable subset (CORE-005, CORE-006, CORE-007, CORE-013, CORE-014, CORE-015, CORE-016, CORE-018, CORE-019, CORE-020, CORE-021, CORE-023, CORE-024) |
| KNOWLEDGE_GOVERNANCE | OVL-KG-001 through OVL-KG-004 | Substance checks: rule clarity, incident grounding, no duplication, cross-reference validity |
| KNOWLEDGE_GOVERNANCE Admin | OVL-KG-ADM-001 through OVL-KG-ADM-003 | Admin: PREHANDOVER ceremony, version bumped and consistent, index.md updated |
| PRE_BRIEF_ASSURANCE | OVL-INJ-001, OVL-INJ-ADM-001, OVL-INJ-ADM-002 | Pre-Brief artifact existence and non-empty, references correct wave |

---

## FFA CHECKS — IAA WILL VERIFY AT HANDOVER

These are the specific Foreman Fail-Only-Once Attestation checks IAA will execute during Phase 3.
Foreman-v2-agent MUST be able to satisfy each of these at PREHANDOVER time.

### Structural Integrity Checks (FFA-SIC)

| Check ID | Description | What IAA will verify |
|----------|-------------|---------------------|
| FFA-SIC-001 | No duplicate A-rule IDs post-change | IAA will scan the complete A-rule table in the final FAIL-ONLY-ONCE.md and verify every A-ID appears exactly once. PS-B-01 and PS-B-02 must have resolved the canonical duplicate issue; any remaining duplicate is a REJECTION-PACKAGE. |
| FFA-SIC-002 | Renumbering correctness | Old A-033 → A-036, old A-034 → A-037, old A-035 → A-038: IAA will verify each old rule's content (NO-COMPLEXITY-THRESHOLD-EXEMPTION, CI-FIX-NO-EXEMPTION, COPILOT-BUILDER-ROLE-LABEL-BYPASS-PROHIBITION) now appears under the new IDs. Original A-name labels must be preserved under new IDs. |
| FFA-SIC-003 | New rules at correct IDs | A-033, A-034, A-035 must be the NEW PS-B-03, PS-B-04, PS-B-05 rules respectively. No swapped ordering. |
| FFA-SIC-004 | ID Namespace Note accuracy | The "ID Namespace Note" in the ISMS-local file must correctly describe the canonical registry series after PS-B-01 and PS-B-02 (A-018 and A-019 now canonical-registered IDs). The note must be internally consistent with the rule table. |
| FFA-SIC-005 | No ID gaps introduced | The A-rule sequence must not introduce new unexplained gaps. Current gaps (A-019 through A-026, A-032) must either be explained in the Namespace Note or filled by this wave. New gaps are not permitted without explanation. |
| FFA-SIC-006 | PS-B-06 marker convention declared | The `[ ]`/`[x]` corrective action completion marker must be formally declared as a convention in the file (section header, description, or rule text). It must not merely appear as ad hoc formatting. |

### Rule Quality Checks (FFA-RQC)

| Check ID | Description | What IAA will verify |
|----------|-------------|---------------------|
| FFA-RQC-001 | New A-033 rule clarity (PS-B-03) | The rule must state clearly: (a) which ceremony files must be declared in SCOPE_DECLARATION, (b) the exact A-031 carve-out for IAA artifacts — what is exempted and why. Ambiguity in the carve-out boundary = REJECTION-PACKAGE. |
| FFA-RQC-002 | New A-034 rule clarity (PS-B-04) | The rule must state clearly: (a) what constitutes a "canon file modification", (b) the requirement to update CANON_INVENTORY.json in the same wave, (c) the violation class if not done. |
| FFA-RQC-003 | New A-035 rule clarity (PS-B-05) | The rule must state clearly: (a) what constitutes a "builder delegation", (b) that a GitHub issue is required (not optional), (c) what the issue must contain (minimal spec). |
| FFA-RQC-004 | New rules have incident grounding | Each of A-033, A-034, A-035 must cite a real incident, INC reference, or confirmed violation pattern as the authority for the rule (OVL-KG-002). A rule without grounding does not belong in FAIL-ONLY-ONCE. |
| FFA-RQC-005 | No duplication with existing rules | Each new A-033/A-034/A-035 must be distinct from all existing rules. IAA will specifically check: (a) A-035 vs existing delegation rules (A-009, A-017); (b) A-034 vs existing canon/governance rules; (c) A-033 vs A-029 (SCOPE_DECLARATION-FRESH-OVERWRITE). |
| FFA-RQC-006 | Cross-references resolve | All rule IDs cited within new/changed rules must exist in the file. Specifically: (a) A-033's A-031 carve-out citation must point to actual A-031 text; (b) any INC references must match entries in Section 2 Incident Log. Dangling references = REJECTION-PACKAGE (OVL-KG-004). |

### Version and Index Checks (FFA-VIC)

| Check ID | Description | What IAA will verify |
|----------|-------------|---------------------|
| FFA-VIC-001 | FAIL-ONLY-ONCE.md header version = 4.2.0 | The file's `**Version**: X.Y.Z` field must read 4.2.0. |
| FFA-VIC-002 | FAIL-ONLY-ONCE.md version history entry | A version history entry for 4.2.0 must be present at the bottom of the file, summarising PS-B-01 through PS-B-06 changes. |
| FFA-VIC-003 | index.md table row updated | The `| FAIL-ONLY-ONCE.md | ... | 4.1.0 |` row in `.agent-workspace/foreman-v2/knowledge/index.md` must be updated to `4.2.0`. |
| FFA-VIC-004 | index.md version history entry | The index.md version history must have a new entry for the knowledge version bump corresponding to this FAIL-ONLY-ONCE.md update. |

### Ceremony Checks (FFA-CER)

| Check ID | Description | What IAA will verify |
|----------|-------------|---------------------|
| FFA-CER-001 | PREHANDOVER proof present (CERT-001) | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-NNN-ps-b-fail-only-once-v420-20260407.md` or equivalent path exists on branch. |
| FFA-CER-002 | Session memory present (CERT-002) | Foreman session memory for this wave exists on branch. |
| FFA-CER-003 | FFA attestation declared (CERT-003) | Session memory preamble declares `fail_only_once_attested: true`. |
| FFA-CER-004 | iaa_audit_token pre-populated (CERT-004 + A-028) | PREHANDOVER proof contains `iaa_audit_token:` field with expected reference in format `IAA-session-NNN-YYYYMMDD-PASS` (not PENDING, not blank). Pre-populated at commit time per A-028. |
| FFA-CER-005 | wave-current-tasks.md updated | The Foreman's `personal/wave-current-tasks.md` reflects this wave as active, with tasks T-01 through T-05 declared. |
| FFA-CER-006 | Pre-Brief artifact present (OVL-INJ-001) | This artifact (`.agent-admin/assurance/iaa-prebrief-ps-b-fail-only-once-v420-20260407.md`) must be present and committed BEFORE any FAIL-ONLY-ONCE.md changes are committed. IAA will verify commit order via branch history. |

### Governance Ceremony Gate Checks (FFA-GCG)

The `governance-ceremony-gate.yml` workflow covers `.agent-workspace/foreman-v2/knowledge/*.md` paths.
Foreman MUST satisfy these CI-level requirements in addition to IAA checks:

| Check ID | Description | Requirement |
|----------|-------------|-------------|
| FFA-GCG-001 | Not draft PR | PR must be in non-draft state at handover |
| FFA-GCG-002 | PREHANDOVER proof + IAA token | PREHANDOVER proof must exist; iaa_audit_token must be resolved (non-PENDING); `## IAA Agent Response (verbatim)` section must be non-empty **OR** a dedicated IAA token file at `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md` must exist (§4.3b architecture). IAA will verify compliance with whichever architecture the prehandover-template.md currently mandates. |
| FFA-GCG-003 | PR body governance block | PR body must contain `## Governance` block with: `IAA Category: KNOWLEDGE_GOVERNANCE`, `IAA Audit Token: IAA-session-NNN-YYYYMMDD-PASS`, `PREHANDOVER Proof: <path>` |
| FFA-GCG-004 | PHASE_B_BLOCKING_TOKEN field | The dedicated IAA token file (if written per §4.3b) must contain `PHASE_B_BLOCKING_TOKEN:` with a non-empty, non-PENDING value (CORE-024 / FAIL-ONLY-ONCE A-037 in IAA registry). |

---

## PREHANDOVER STRUCTURE REQUIREMENTS

The Foreman's PREHANDOVER proof for this wave MUST include:

### Mandatory Sections

1. **Header metadata**
   - `session_id`: canonical session number (NNN format)
   - `wave`: `ps-b-fail-only-once-v420-20260407`
   - `date`: actual execution date
   - `issue`: #1268
   - `iaa_audit_token`: pre-populated at commit time in format `IAA-session-NNN-YYYYMMDD-PASS`
     (not PENDING — per A-028 PREHANDOVER-PROOF-IMMUTABILITY)

2. **FAIL-ONLY-ONCE Self-Attestation** — required preamble before any phase execution

3. **Wave Deliverables Manifest** — declare each file path modified with before/after version

4. **§4.3 Merge Gate Parity Check** — confirm local execution of governance-ceremony-gate
   equivalent checks (per A-018 §4.3-EXECUTE-BEFORE-PR). For a governance-only PR (no compiled
   code), the local equivalent is:
   - YAML/Markdown lint on modified files
   - Verify no placeholder/STUB content in new rules (CORE-007 equivalent)
   - Verify version bump from 4.1.0 to 4.2.0 is present
   - Verify index.md is updated

5. **IAA Pre-Brief Confirmation** — cite this artifact path:
   `.agent-admin/assurance/iaa-prebrief-ps-b-fail-only-once-v420-20260407.md`

6. **`## IAA Agent Response (verbatim)` OR IAA Token file reference** — per the
   governance-ceremony-gate.yml requirements (FFA-GCG-002 above). Foreman must check
   which architecture is active in the current prehandover-template.md (v1.7.0).

### Prohibited Content

- `iaa_audit_token: PENDING` — hard violation of A-028
- `iaa_audit_token: PHASE_A_ADVISORY` — hard violation (PHASE_B_BLOCKING is active)
- Any self-certification that IAA assurance has been obtained without actually invoking IAA
- Retroactive pre-brief commitment (pre-brief committed AFTER file changes — per A-031)

---

## SCOPE BLOCKERS

### ⚠️ SB-001 (ADVISORY — Does Not Block Execution): ID Namespace Note Pre-Read

**Issue**: The ID Namespace Note in the current FAIL-ONLY-ONCE.md v4.1.0 states local IDs
are "A-001–A-008" but the file actually contains rules A-001 through A-035. This Namespace
Note is stale. PS-B-01 says "update ID Namespace Note" as part of the change.

**Impact on wave**: The Foreman must ensure the Namespace Note accurately reflects:
(a) the ISMS-local ID range after all renumbering (A-001 through A-038 after PS-B changes),
and (b) the canonical registry IDs including newly-resolved A-018 and A-019.

**Resolution**: Foreman updates the Namespace Note as part of PS-B-01. IAA will verify
the updated note is internally consistent (FFA-SIC-004).

**Blocker status**: ADVISORY — does not block wave start. Must be resolved in the PR.

---

### ⚠️ SB-002 (ADVISORY — Does Not Block Execution): Existing A-033/A-034/A-035 Reference Audit

**Issue**: Existing rules A-033, A-034, A-035 (being renumbered to A-036, A-037, A-038) may be
cited by rule ID in other documents: PREHANDOVER proofs, session memories, CI workflows,
and other Tier 2 files. Renumbering without updating cross-file citations creates dangling
references that could confuse future agents.

**Impact on wave**: IAA will check whether any other `.agent-workspace/foreman-v2/` or
`.agent-admin/` files reference `A-033`, `A-034`, or `A-035` in contexts that would break
after renumbering. If found, Foreman must update those references in the same PR or document
them as known pre-existing cross-references that are being grandfathered.

**Resolution**: Foreman should conduct a targeted search for A-033/A-034/A-035 citations
in governed paths before committing the renumbering. Document the audit result in session memory.

**Blocker status**: ADVISORY — does not block wave start. Cross-reference audit recommended
before final commit.

---

### ✅ SB-003 (CLEARED): Self-Referential Review

**Issue**: IAA is assuring a change to the Foreman's FAIL-ONLY-ONCE.md. IAA did not produce
this content. Independence requirement is fully satisfied.

**Status**: CLEARED — no action required.

---

### ✅ SB-004 (CLEARED): CS2 Authorization

**Issue**: Is this wave CS2-authorized?

**Status**: CLEARED — Issue #1268 opened and assigned by @APGI-cmy (CS2). The PS-B wave
series is part of the CS2-approved MMM Pre-Implementation Upgrade strategy.

---

## PHASE REQUIREMENTS AT HANDOVER

| Phase | Required? | Notes |
|-------|-----------|-------|
| Phase 1 (Preflight) | YES | Standard IAA Phase 1 at full assurance invocation |
| Phase 2 (Alignment) | YES | KNOWLEDGE_GOVERNANCE classification confirmed |
| Phase 3 (Assurance Work) | YES | All FFA checks above + CERT + CORE + OVL-KG checks |
| Phase 4 (Verdict + Handover) | YES | ASSURANCE-TOKEN or REJECTION-PACKAGE; token file written |
| §4.1 Merge Gate Parity | YES (governance equivalent) | Markdown lint + version bump check + no-placeholder check |

**IAA invocation instruction** (for Foreman to use at Phase 4 Step 4.3a):
```
task(
  agent_type: "independent-assurance-agent",
  name: "iaa-ps-b-fail-only-once-v420",
  prompt: "Invoke IAA for full assurance review of PR on branch copilot/ps-b-foreman-fail-only-once.
  PR category: KNOWLEDGE_GOVERNANCE.
  Pre-Brief artifact: .agent-admin/assurance/iaa-prebrief-ps-b-fail-only-once-v420-20260407.md
  Deliverables: FAIL-ONLY-ONCE.md v4.2.0 update (PS-B-01 through PS-B-06).
  PREHANDOVER proof: [insert path at time of invocation]"
)
```

---

## SUMMARY

| Item | Value |
|------|-------|
| Wave | ps-b-fail-only-once-v420-20260407 |
| Issue | maturion-isms#1268 |
| Trigger Category | KNOWLEDGE_GOVERNANCE |
| IAA Required at Handover | YES — MANDATORY |
| FFA Checks Declared | 22 (FFA-SIC: 6, FFA-RQC: 6, FFA-VIC: 4, FFA-CER: 6) |
| Ceremony Checks | CERT-001–004, OVL-KG-001–004, OVL-KG-ADM-001–003, OVL-INJ-001 |
| Governance Gate | governance-ceremony-gate.yml (4 CI checks) |
| Scope Blockers | SB-001 (advisory), SB-002 (advisory), SB-003 (cleared), SB-004 (cleared) |
| Pre-Brief Phase Mode | PHASE_B_BLOCKING |
| Adoption Phase | PHASE_B — hard gate ACTIVE |

**Foreman-v2-agent may proceed.** This Pre-Brief artifact satisfies A-031
(PRE-BRIEF-BEFORE-DELEGATION). All required checks are declared above. IAA will verify
each at full assurance invocation upon PREHANDOVER proof delivery.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Contract**: v2.4.0
**Pre-Brief issued**: 2026-04-07
**PHASE_B_BLOCKING status**: ACTIVE — verdicts at handover are hard-blocking
