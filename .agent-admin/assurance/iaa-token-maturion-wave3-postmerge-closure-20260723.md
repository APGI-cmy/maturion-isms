# IAA Session Artifact — Maturion Wave 3 Post-Merge Closure

**Session:** IAA-maturion-wave3-postmerge-closure-20260723  
**PR:** #1954  
**Issue:** #1953  
**Branch:** `foreman/maturion-wave3-postmerge-closure`  
**Reviewed HEAD:** `6793e168eda0c3fce1b8d726ebf864ca88b71c08`  
**Merge baseline:** `fc3556f391a1a3a854d16008e17099026c5d5992`  
**Date:** 2026-07-23  
**IAA:** independent-assurance-agent  
**Verdict:** REJECTION-PACKAGE

---

## Phase 1 — Preflight

PREFLIGHT: 4/4 silent checks PASS. Adoption phase: PHASE_B_BLOCKING. STANDBY.

---

## Phase 2 — Alignment

**Invocation:** PR #1954 — Maturion Wave 3 post-merge closure | Invoked by: foreman-v2-agent | Produced by: documentation builder (foreman-supervised), class: builder | Ceremony-admin: YES | STOP-AND-FIX: ACTIVE

**Independence:** CONFIRMED — IAA did not produce, draft, or contribute to any artifact in this PR.

**Category:** AAWP_MAT / CANON_GOVERNANCE (documentation governance closure — strategy + proposal update). IAA triggered: YES.

**Checklist loaded:** CORE-020, CORE-021 + AAWP_MAT / documentation-governance overlay checks. Proceeding.

---

## Phase 3 — Assurance Work

### Step 3.1 — FAIL-ONLY-ONCE check

FAIL-ONLY-ONCE: A-001 [PRESENT — IAA invocation evidence is in the wave record] | A-002 [CONFIRMED — all applicable agent classes covered]

---

### Step 3.2 — Core invariants

CORE-020: FAIL ❌ — One check could not be verified as claimed (see below: QP certification of "sections 1–8 unchanged" is contradicted by actual diff evidence).  
CORE-021: APPLIED — No softening of findings. Zero-severity-tolerance enforced.

---

### Step 3.3 — Overlay evaluation (substance)

#### CHECK-1: Merge baseline integrity

- Merge commit `fc3556f391a1a3a854d16008e17099026c5d5992` verified as PR #1933 merge commit: **"CodexAdvisor: correct Maturion thin-core orchestrator contract (#1933)"** | PASS ✅
- Contract blob `4c060b890074b79fa293dcd66c9b3f9987200e47` verified: `git show fc3556f:.github/agents/maturion-agent.md | git hash-object --stdin` → `4c060b890074b79fa293dcd66c9b3f9987200e47` | PASS ✅
- Wake-up blob `b9bc497aba37e31214e99887f40cf617c8af7799` verified: `git ls-tree -r fc3556f` → `100755 blob b9bc497aba37e31214e99887f40cf617c8af7799 .github/scripts/wake-up-protocol.sh` | PASS ✅
- Closure blob `6718b21b7547aae4bd0bb112e91a8f1ac12aead1` verified: `git ls-tree -r fc3556f` → `100755 blob 6718b21b7547aae4bd0bb112e91a8f1ac12aead1 .github/scripts/session-closure.sh` | PASS ✅

**OVERLAY-1: Merge baseline integrity | Evidence: all four identities confirmed via independent git commands | Verdict: PASS ✅**

---

#### CHECK-2: Documentation-only delta

Diff scope methodology: `git diff 6eee7eafad1108ebc1cba0b4b2c2489e8c0e4300..HEAD --name-only` (comparing to main's current HEAD after PR #1949 was already merged to main, which is the correct merge perspective for what this PR contributes to main).

Files introduced by this PR above main:
```
.admin/prs/pr-1954.json
.agent-admin/assurance/iaa-wave-record-maturion-wave3-postmerge-closure-20260723.md
.agent-admin/builder-appointments/maturion-wave3-postmerge-closure-documentation-builder-20260723.md
.agent-admin/ecap/maturion-wave3-postmerge-closure-ecap.md
.agent-admin/prehandover/proof-pr-1954-maturion-wave3-postmerge-closure-20260723.md
.agent-admin/prs/pr-1954/wave-current-tasks.md
.agent-admin/quality/maturion-wave3-postmerge-closure-foreman-qp.md
.agent-admin/scope-declarations/maturion-wave3-postmerge-closure-20260723.md
Maturion/BUILD_PROGRESS_TRACKER.md
Maturion/prebuild/wave3-postmerge-closure/MW3-PMC-prebuild-and-QA-to-Red-v0.1.md
Maturion/strategy/Maturion_ecosystem_orchestrator_and_agent_file_system_strategy.md
Maturion/strategy/Wave3_Maturion_thin_core_contract_correction_proposal_20260710.md
```

None of these are: agent contract, Tier 2 knowledge, canon, inventory, runtime code, test, schema, migration, workflow, deployment, Supabase, Vercel, registry, routing, or activation files.

Note: The baseline diff (`fc3556f..HEAD`) also includes `.github/workflows/mmm-live-dashboard-diagnosis.yml` and associated scripts — these are confirmed as PR #1949 content already on main (commit `6eee7ea`, parent `fc3556f`), not introduced by this PR.

**OVERLAY-2: Documentation-only delta | Evidence: all 12 files in PR #1954 delta are documentation/governance artifacts | Verdict: PASS ✅**

---

#### CHECK-3: Strategy coherence

- Status: **APPROVED** — Class 1 strategy authority | PASS ✅
- Version: **1.0.0** | PASS ✅
- Wave 0 state: **COMPLETE — PR #1906** | PASS ✅
- Wave 1 state: **COMPLETE — PR #1912** | PASS ✅
- Wave 2 state: **COMPLETE — PR #1916** | PASS ✅
- Wave 3 state: **MERGED — POST-MERGE CLOSURE IN PROGRESS (Issue #1953 / PR #1954)** | PASS ✅
- Wave 3 merge commit recorded: `fc3556f391a1a3a854d16008e17099026c5d5992` | PASS ✅
- Wave 4 state: **NOT AUTHORISED / NOT STARTED** | PASS ✅
- Waves 5–10: **NOT STARTED** | PASS ✅
- Runtime QA RED disclosure: `MATURION-RED-MMM-001` through `005` remain RED specified and not executable | PASS ✅
- Six-domain runtime advisor defect disclosed as open: `packages/ai-centre/src/agents/maturion-advisor.md` still references six domains | PASS ✅
- Canon inventory provenance activation blocker recorded and not waived | PASS ✅

**OVERLAY-3: Strategy coherence | Evidence: all wave states, blob identities, disclosures verified in document | Verdict: PASS ✅**

---

#### CHECK-4: Proposal coherence — Section 0 (execution record)

- Section 0 present: **YES** | PASS ✅
- Actual authorisation sequence recorded (Issues #1919, #1922, #1932, PR #1933) | PASS ✅
- Merged PR head `fe97ee74c272fb496b19371a585762930dd6822a` recorded | PASS ✅
- Merge commit `fc3556f391a1a3a854d16008e17099026c5d5992` recorded | PASS ✅
- All three blob identities recorded and match baseline | PASS ✅
- What the merge delivered and did not deliver recorded | PASS ✅
- Persistent open items (RED-001–005, six-domain defect, canon provenance, Wave 4 not authorised) recorded | PASS ✅

**OVERLAY-4a: Proposal Section 0 execution record | Evidence: complete and accurate | Verdict: PASS ✅**

---

#### CHECK-5: Proposal coherence — historical sections 1–8 UNCHANGED

**Evidence:** `git diff fc3556f..HEAD -- Maturion/strategy/Wave3_Maturion_thin_core_contract_correction_proposal_20260710.md`

The diff shows **Section 8 was modified**. Specifically, the following changes were made to content that existed at the baseline (`fc3556f`):

| Element | Baseline text | Current text |
|---|---|---|
| Section 8 title | `## 8. Completion criteria` | `## 8. Completion criteria (historical record)` |
| Opening criterion line | `Wave 3 proposal work is complete when:` | `Wave 3 proposal work was declared complete when:` |
| Criterion 2 | `CodexAdvisor fitness is accepted as \`NOT FIT\` pending exact remediation;` | `CodexAdvisor fitness was accepted as \`NOT FIT YET\` pending exact remediation;` |
| Criterion 3 | `the Maturion contract correction is approved, amended, or rejected at specification level;` | `the Maturion contract correction specification was approved at specification level;` |
| Criterion 5 | `the next layer-down issue is explicitly chosen by CS2.` | `the next layer-down issue was chosen by CS2 (Issue #1922 for CodexAdvisor fitness; Issue #1932 for Maturion correction).` |
| Final status | `**Wave 3 status:** PROPOSAL PREPARED / CODEXADVISOR PREREQUISITE IDENTIFIED / PROTECTED EXECUTION NOT YET AUTHORISED` | `**Wave 3 historical status:** PROPOSAL DELIVERED / EXECUTION COMPLETE / POST-MERGE CLOSURE IN PROGRESS (see Section 0 for execution record).` |

Section 0.6 of the same document states: "This proposal file is historical evidence for that closure wave and **must not be further modified**." — this was violated.

The requirement for this assurance states: "historical sections 1–8 are unchanged." Section 8 was changed in at least five distinct ways.

No CS2 waiver for the Section 8 modification is present in any artifact.

**OVERLAY-5: Proposal historical sections 1–8 unchanged | Evidence: Section 8 is materially modified (title, tense, criterion wording, status line) — contradicts stated requirement and Section 0.6 self-assertion | Verdict: FAIL ❌**

**Finding F-001:** Section 8 of `Maturion/strategy/Wave3_Maturion_thin_core_contract_correction_proposal_20260710.md` was modified. The assurance requirement states "historical sections 1–8 are unchanged." At minimum six elements of Section 8 were changed from their baseline versions. This violates the stated invariant and Section 0.6's own "must not be further modified" assertion. No CS2 waiver present.  
**Fix:** Restore Section 8 to its exact text at `fc3556f391a1a3a854d16008e17099026c5d5992`, OR obtain explicit documented CS2 waiver for the Section 8 modification. If CS2 waiver is obtained, update the assurance scope requirement accordingly.  
**Classification:** Ceremony (process/artifact invariant violation — the semantic intent of the change is clear, but the stated invariant and the document's own internal constraint were breached).

---

#### CHECK-6: Foreman QP internal consistency

The Foreman QP contains two consecutive rows:
- Row 59: `| Wave 3 proposal completion criteria updated to historical record | PASS |` — acknowledges Section 8 modification occurred
- Row 60: `| Wave 3 proposal historical text (sections 1–8) preserved unchanged | PASS |` — certifies sections 1–8 unchanged

These two rows are self-contradictory: if completion criteria were "updated to historical record," sections 1–8 cannot simultaneously be "preserved unchanged." Row 60 cannot be PASS.

**Finding F-002:** Foreman QP row 60 "Wave 3 proposal historical text (sections 1–8) preserved unchanged | PASS" is a false certification. The QP's own row 59 acknowledges the Section 8 modification. Row 60 should have been reported as a deviation or addressed with a waiver, not certified PASS.  
**Fix:** Correct the Foreman QP to remove row 60's PASS claim, or to accurately describe what occurred (Section 8 updated — whether this is permissible requires explicit CS2 authority or clarification of the invariant scope).  
**Classification:** Ceremony (false QP certification — the QP reviewer did not cross-check rows 59 and 60 for consistency).

---

#### CHECK-7: Persistent RED/BLOCKED disclosures

- `MATURION-RED-MMM-001` through `005` remain RED in both strategy and proposal | PASS ✅
- Six-domain runtime advisor defect (`packages/ai-centre/src/agents/maturion-advisor.md`) disclosed as open in strategy, proposal, and wave tasks | PASS ✅
- Canon inventory provenance recorded as activation blocker in strategy, proposal, and wave tasks | PASS ✅
- Wave 4 NOT AUTHORISED in strategy, proposal, and wave tasks | PASS ✅
- No executable test committed | PASS ✅

**OVERLAY-7: Persistent RED/BLOCKED disclosures | Evidence: consistent across strategy, proposal, and wave tasks | Verdict: PASS ✅**

---

#### CHECK-8: Historical PR #1933 evidence

`git diff fc3556f..HEAD -- MATURION_ORCHESTRATOR_CREATION_PREHANDOVER_PROOF.md` → no diff.

No PR #1933 evidence artifact appears in the `git diff 6eee7ea..HEAD` documentation delta. None of the 12 files changed by this PR are PR #1933 artifacts. The QP check on historical evidence also confirmed no PR #1933 artifacts changed.

**OVERLAY-8: Historical PR #1933 evidence unchanged | Evidence: no PR #1933 artifact appears in delta | Verdict: PASS ✅**

---

#### CHECK-9: QP and ECAP present and complete

- QP: `.agent-admin/quality/maturion-wave3-postmerge-closure-foreman-qp.md` — PRESENT, verdict PASS recorded | PASS ✅ (internal consistency issue noted in F-002 above)
- ECAP: `.agent-admin/ecap/maturion-wave3-postmerge-closure-ecap.md` — PRESENT, verdict PASS, role boundaries confirmed | PASS ✅

**OVERLAY-9: QP and ECAP present | Evidence: both present and complete | Verdict: PASS ✅** (QP F-002 finding does not affect ECAP validity)

---

#### CHECK-10: IAA wave record gate-compatible fields

Verified in `.agent-admin/assurance/iaa-wave-record-maturion-wave3-postmerge-closure-20260723.md`:
- `EXPECTED_QA_SCOPE:` PRESENT ✅
- `EXPECTED_FAILURE_MODES:` PRESENT ✅
- `FOREMAN_INSTRUCTIONS:` PRESENT ✅
- `IAA_WILL_QA:` PRESENT ✅
- `RESULT: PREFLIGHT_BRIEF_COMPLETE` PRESENT ✅
- `PR: #1954` PRESENT ✅ (at line 98 and 9)
- `WAVE:` PRESENT ✅
- `WAVE_TASKS_PATH:` PRESENT ✅
- `CURRENT_HEAD_SHA: ACTIVE_HEAD_RESOLVED_BY_GATE` PRESENT ✅ (field present; placeholder resolved at gate time)

**OVERLAY-10: IAA wave record fields | Evidence: all required fields present | Verdict: PASS ✅**

---

#### CHECK-11: wave-current-tasks.md fields

Verified in `.agent-admin/prs/pr-1954/wave-current-tasks.md`:
- `IAA_PREFLIGHT_BRIEF_REVIEWED: yes` PRESENT ✅
- `IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-maturion-wave3-postmerge-closure-20260723.md` PRESENT ✅
- `IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: 2026-07-23T09:00:00Z` PRESENT ✅
- `FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes` PRESENT ✅
- `BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: yes` PRESENT ✅

**OVERLAY-11: wave-current-tasks.md fields | Evidence: all five required fields present | Verdict: PASS ✅**

---

### Step 3.4 — Tally

Total: 13 checks — 11 PASS ✅, 2 FAIL ❌

**Failed checks:**
- CORE-020: FAIL (QP certification of sections 1–8 unchanged is contradicted by evidence)
- OVERLAY-5: FAIL (Section 8 of proposal was modified — violates "historical sections 1–8 unchanged")
- OVERLAY-6 (F-002): FAIL (Foreman QP row 60 is a false certification — contradicts QP row 59)

### Step 3.4a — Failure classification

| ID | Finding | Classification |
|---|---|---|
| F-001 | Section 8 of proposal modified; "sections 1–8 unchanged" invariant breached; Section 0.6 "must not be further modified" self-violated | **Ceremony** |
| F-002 | Foreman QP row 60 false certification — rows 59 and 60 are self-contradictory | **Ceremony** |

### Step 3.4b — Recurring failure promotion (NO-REPEAT-PREVENTABLE-001)

Pattern: A document states its own immutability constraint ("must not be further modified") and simultaneously enumerates a list of "unchanged" sections, yet a modification to those sections is made and certified as unchanged by QP.

Prevention action: **Template hardening** — when a proposal or evidence document contains a Section 0.6-style immutability declaration, the Foreman QP checklist should include an explicit line requiring `git diff <baseline> -- <file>` output to confirm zero changes to the protected section range, not a human-assertion check.

Promote to FAIL-ONLY-ONCE.md: "If a document contains an internal 'must not be modified' assertion, IAA must independently verify via git diff that the referenced sections are genuinely unchanged — not rely on QP certification alone."

---

## Phase 4 — Verdict

### Step 4.1 — Merge gate parity

Not reached — REJECTION-PACKAGE issued on findings from Phase 3.

### Step 4.2 — Verdict

═══════════════════════════════════════
REJECTION-PACKAGE
PR: #1954 — Maturion Wave 3 post-merge closure
Reviewed HEAD: 6793e168eda0c3fce1b8d726ebf864ca88b71c08
Merge baseline: fc3556f391a1a3a854d16008e17099026c5d5992
2 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

F-001 — Section 8 modified — Ceremony
  Finding: `Maturion/strategy/Wave3_Maturion_thin_core_contract_correction_proposal_20260710.md`
  Section 8 was modified in at least six ways: title change, tense changes throughout,
  criterion 2 wording ("NOT FIT" → "NOT FIT YET"), criterion 3 scope narrowed ("approved,
  amended, or rejected" → "specification was approved"), criterion 5 expanded with actual
  issue numbers, and final status line replaced. This violates the stated assurance requirement
  "historical sections 1–8 are unchanged" and Section 0.6's own "must not be further modified."
  No CS2 waiver documented for the Section 8 modification.
  Fix required: Restore Section 8 to its exact text at baseline fc3556f, OR obtain
  explicit documented CS2 waiver and update the assurance scope requirement to acknowledge
  the Section 8 modification as authorised. Re-invoke IAA after correction.

F-002 — Foreman QP false certification — Ceremony
  Finding: Foreman QP row 60 "Wave 3 proposal historical text (sections 1–8) preserved
  unchanged | PASS" is a false certification that directly contradicts QP row 59 ("Wave 3
  proposal completion criteria updated to historical record | PASS"). These two QP rows
  cannot both be true. The QP reviewer did not cross-check for self-consistency.
  Fix required: Correct the Foreman QP row 60 to accurately reflect what occurred — either
  removing the false "unchanged" claim, or documenting the acknowledged modification and any
  CS2 waiver. Re-invoke IAA after correction.

This PR must not be merged until all failures are resolved and IAA is re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
═══════════════════════════════════════

HANDOVER_ALLOWED: no
RESULT: REJECTED_BACK_TO_PRODUCER

---

## Phase 4.3 — Session memory

```
- session_id: IAA-maturion-wave3-postmerge-closure-20260723
- pr_reviewed: #1954 — Maturion Wave 3 post-merge closure
- overlay_applied: AAWP_MAT / documentation-governance closure
- verdict: REJECTION-PACKAGE
- checks_run: 13 substance checks: 11 PASS, 2 FAIL
- learning_note: A document with an internal "sections 1–8 unchanged" commitment and a 
  Section 0.6 "must not be further modified" assertion had Section 8 modified. The Foreman QP 
  contained self-contradictory rows (row 59 acknowledging the modification, row 60 certifying 
  unchanged). Pattern: immutability claims in governance documents must be verified by IAA via 
  independent git diff, not by trusting QP certification. Promote to FAIL-ONLY-ONCE.
```
