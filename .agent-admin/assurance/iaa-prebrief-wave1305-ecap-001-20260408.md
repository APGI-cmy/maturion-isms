# IAA Pre-Brief — Wave: ecap-001-layer-down-implementation

**Artifact Type**: Pre-Brief  
**Wave**: ecap-001-layer-down-implementation  
**Issue**: maturion-isms#1305  
**Branch**: copilot/ecap-001-layer-down-implementation  
**Date**: 2026-04-08  
**IAA Version**: independent-assurance-agent v6.2.0 / contract 2.5.0  
**Pre-Brief Mode**: Phase 0 ONLY — IAA has not executed Phases 1–4 assurance  
**Authority**: CS2 (Johan Ras / @APGI-cmy) — Issue #1305 opened and assigned by CS2  

---

## Step 0.1 — Pre-Brief Invocation Confirmed

Triggered by comment on Issue #1305 containing `IAA PRE-BRIEF REQUEST`.  
PRE-BRIEF mode active. Phases 1–4 assurance will NOT execute this session.  
This artifact is the sole output of this invocation.

---

## Step 0.2 — Wave Context

**Wave**: `ecap-001-layer-down-implementation`  
**Source**: Issue #1305 — "Foreman follow-up: complete ECAP-001 layer-down implementation in maturion-isms after PR #1296"  
**Background**: PR #1296 (`[Ripple] Propagate governance layer-down`) introduced ECAP-001 canon into maturion-isms but with incomplete/inconsistent implementation. This wave corrects six specific defects identified by CS2.

**Note**: `wave-current-tasks.md` currently reflects an older active wave (`opojd-comment-only-copilot-20260408` / Issue #1286). The Foreman must update `wave-current-tasks.md` to reflect this wave before committing ECAP-001 work. This is SB-006 below.

---

## Step 0.3 — Task Classification

### Qualifying Tasks

All six defect-fix tasks fall under **CANON_GOVERNANCE** — IAA invocation is MANDATORY for all.

| Task ID | Defect | Files | IAA Trigger Category | Qualifying |
|---------|--------|-------|---------------------|------------|
| AC-001 | Broken strategy reference in EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md | `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md` | CANON_GOVERNANCE | ✅ QUALIFYING |
| AC-002 | Section header at line 1103 says `v1.1.6` — should say `v1.0.0` | `governance/canon/AGENT_HANDOVER_AUTOMATION.md` | CANON_GOVERNANCE | ✅ QUALIFYING |
| AC-003 | Canon reference at line 1167 says `v1.1.6` — should say `v1.0.0` | `governance/canon/AGENT_HANDOVER_AUTOMATION.md` | CANON_GOVERNANCE | ✅ QUALIFYING |
| AC-004 | Phase 4 table missing §4.3c Pre-IAA Commit-State Gate row | `governance/canon/AGENT_HANDOVER_AUTOMATION.md` | CANON_GOVERNANCE | ✅ QUALIFYING |
| AC-005 | CANON_INVENTORY.json: AGENT_HANDOVER_AUTOMATION version `1.1.6`→`1.2.0`, hash stale | `governance/CANON_INVENTORY.json` | CANON_GOVERNANCE | ✅ QUALIFYING |
| AC-006 | GOVERNANCE_CANON_MANIFEST.md verification and reconciliation | `governance/canon/GOVERNANCE_CANON_MANIFEST.md` | CANON_GOVERNANCE | ✅ QUALIFYING |

**Trigger determination**: All files are in `governance/canon/` or `governance/CANON_INVENTORY.json`. Per trigger table §2: CANON_GOVERNANCE → IAA MANDATORY. No ambiguity.  
**Non-qualifying items**: None declared.

---

## Step 0.3b — Anti-Regression Obligations

### Known Recurring Failure Patterns from Prior Sessions

#### Pattern 1: CANON_INVENTORY hash stale post-amendment (HIGH RISK — this wave specifically)
- **Observed in**: session-056-govliaison-055-layer-down-20260406, session-055-layer-down-20260405
- **Pattern**: Builder fixes canon file content, then updates CANON_INVENTORY hash using a pre-fix snapshot of the file. Hash is wrong on first IAA invocation.
- **Anti-regression obligation**: Builder MUST compute `sha256sum governance/canon/AGENT_HANDOVER_AUTOMATION.md` AFTER ALL TEXT CHANGES (AC-002, AC-003, AC-004) are made to that file. The hash entered in CANON_INVENTORY (AC-005) must reflect the **final post-edit** version. If builder computes the hash at any intermediate stage, CANON_INVENTORY will fail IAA verification.
- **Mechanical verification required**: IAA will independently run `sha256sum` on the fixed file and compare against CANON_INVENTORY at audit time. Any mismatch = REJECTION-PACKAGE.

#### Pattern 2: PREHANDOVER proof not committed to git (A-033)
- **Observed in**: session-ci-gateway-fix-20260312, session-1277-mmm-39b-20260407
- **Pattern**: Builder creates PREHANDOVER proof on disk but does not `git add && git commit && git push` before invoking IAA. File appears to exist on disk but is not in the git tree.
- **Anti-regression obligation**: Before invoking IAA, builder MUST run `git ls-tree -r HEAD | grep PREHANDOVER` and confirm the file is present in the committed tree.
- **Mechanical verification required**: IAA will use `git ls-tree HEAD` (never `-f` disk check) for CORE-018 verification. Per A-033.

#### Pattern 3: PREHANDOVER proof missing Ripple/Cross-Agent Assessment (A-023)
- **Observed in**: session-052-20260406 (REJECTION-PACKAGE failure 1), sessions 084, 086, 088
- **Pattern**: PREHANDOVER proof is committed and present but lacks the `## Ripple/Cross-Agent Assessment` section.
- **Anti-regression obligation**: Builder MUST include a `## Ripple/Cross-Agent Assessment` section in the PREHANDOVER proof covering all agents and files that may be impacted by AGENT_HANDOVER_AUTOMATION.md amendments. ECAP-001 integration touches agent contracts and handover automation — ripple scope is non-trivial.
- **Mechanical verification required**: IAA will grep for `## Ripple/Cross-Agent Assessment` in PREHANDOVER proof. Absent = FAIL per A-023.

#### Pattern 4: Version string inconsistency survival (this wave's specific risk)
- **Observed in**: This wave's founding defect (AC-002, AC-003) — PR #1296 introduced v1.1.6 references that should have been v1.0.0
- **Pattern**: When fixing version strings, partial fixes are applied (one occurrence corrected, another missed).
- **Anti-regression obligation**: Builder MUST run `grep -n "v1\.1\.6" governance/canon/AGENT_HANDOVER_AUTOMATION.md` after applying AC-002 and AC-003 and confirm zero remaining occurrences of the stale version string in the integration section.
- **Mechanical verification required**: IAA will perform the same grep at audit time.

### No Recurring Patterns from Prior Sessions Applicable to AC-007

AC-007 (invariant text integrity) is a governance quality check with no prior recurring failure pattern. IAA will apply the CANON_GOVERNANCE overlay OVL-CG-007 independently.

---

## Step 0.4 — Pre-Brief Artifact

### Section A: Task-by-Task IAA Pre-Brief Declaration

---

#### AC-001 — Broken Strategy Reference Fix

| Field | Value |
|-------|-------|
| `task_id` | AC-001 |
| `task_summary` | Fix broken `maturion/strategy/Execution_Ceremony_Administration_Strategy.md` reference at lines 10 and 422 of EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md |
| `iaa_trigger_category` | CANON_GOVERNANCE |
| `required_phases` | Phase 2 (alignment), Phase 3 (assurance), Phase 4 (verdict) |
| `required_evidence_artifacts` | PREHANDOVER proof; session memory; corrected file committed; sha256 in CANON_INVENTORY updated |
| `applicable_overlays` | OVL-CG-001 (canon file present and committed), OVL-CG-002 (version bump), OVL-CG-ADM-001 (hash verification), OVL-CG-ADM-002 (metadata freshness) |
| `specific_rules` | SB-001 below; A-033; A-023 |

**IAA Pre-Brief Finding (pre-audit)**: `governance/strategy/` directory EXISTS in this repo (contains `MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md`). The referenced path uses the prefix `maturion/strategy/` which does NOT match any repo path structure. The file `Execution_Ceremony_Administration_Strategy.md` does NOT exist anywhere in this repo. The strategy lives in the canonical foreman-governance repo.

**Scope Blocker SB-001**: Before committing AC-001, the Foreman must DECIDE which fix approach to use:
- **Option A (Recommended)**: Create `governance/strategy/Execution_Ceremony_Administration_Strategy.md` as a stub referencing the canonical governance repo — this fulfils the reference and maintains the governance layer-down model.
- **Option B**: Change the reference to an absolute canonical path note (e.g., `APGI-cmy/maturion-foreman-governance: strategy/Execution_Ceremony_Administration_Strategy.md`) with a note that consumer repos do not carry this file.
- **Option C**: Change both occurrences (lines 10 and 422) to reference `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md` itself, noting the strategy has been superseded.

IAA will verify at audit time that the chosen fix (a) resolves the broken reference, (b) does not introduce a new broken path, and (c) is consistent between lines 10 and 422.

---

#### AC-002 — AGENT_HANDOVER_AUTOMATION.md Section Header Normalization

| Field | Value |
|-------|-------|
| `task_id` | AC-002 |
| `task_summary` | Change section header at line 1103 from `## Execution Ceremony Administration Integration (v1.1.6)` to `## Execution Ceremony Administration Integration (v1.0.0)` |
| `iaa_trigger_category` | CANON_GOVERNANCE |
| `required_phases` | Phase 2, Phase 3, Phase 4 |
| `required_evidence_artifacts` | PREHANDOVER proof; session memory; corrected AGENT_HANDOVER_AUTOMATION.md committed; CANON_INVENTORY hash updated (must be post-AC-004 hash) |
| `applicable_overlays` | OVL-CG-001, OVL-CG-002, OVL-CG-ADM-001 |
| `specific_rules` | Anti-regression Pattern 4 above; SB-002 below; SB-003 below |

**Pre-audit observation**: Line 1103 currently reads `## Execution Ceremony Administration Integration (v1.1.6)`. The ECAP-001 protocol is at v1.0.0. The `v1.1.6` here refers to the AGENT_HANDOVER_AUTOMATION version at which this section was added — which is also wrong because the file header now says v1.2.0. Either the parenthetical version should reflect the ECAP protocol version (v1.0.0) or be removed. Issue #1305 specifies v1.0.0 as the correct value.

---

#### AC-003 — AGENT_HANDOVER_AUTOMATION.md Canon Reference Normalization

| Field | Value |
|-------|-------|
| `task_id` | AC-003 |
| `task_summary` | Change canon reference at line 1167 from `...EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md - Execution ceremony admin role and handover sequence (v1.1.6)` to `(v1.0.0)` |
| `iaa_trigger_category` | CANON_GOVERNANCE |
| `required_phases` | Phase 2, Phase 3, Phase 4 |
| `required_evidence_artifacts` | Same as AC-002 — these are in the same file |
| `applicable_overlays` | OVL-CG-001, OVL-CG-002, OVL-CG-ADM-001 |
| `specific_rules` | Anti-regression Pattern 4 above; same grep verification applies |

**Pre-audit observation**: Line 1167 currently reads `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md - Execution ceremony admin role and handover sequence (v1.1.6)`. ECAP-001 is v1.0.0. This must be corrected to match the actual protocol version. CANON_INVENTORY confirms EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md is at v1.0.0.

---

#### AC-004 — Phase 4 Table §4.3c Row Addition

| Field | Value |
|-------|-------|
| `task_id` | AC-004 |
| `task_summary` | Add `§4.3c Pre-IAA Commit-State Gate` row to the Phase 4 Responsibilities table at line 1113 |
| `iaa_trigger_category` | CANON_GOVERNANCE |
| `required_phases` | Phase 2, Phase 3, Phase 4 |
| `required_evidence_artifacts` | PREHANDOVER proof; session memory; corrected file committed; CANON_INVENTORY hash updated |
| `applicable_overlays` | OVL-CG-001, OVL-CG-002, OVL-CG-ADM-001, OVL-CG-007 (no weakening) |
| `specific_rules` | AC-007 applies: new row must not weaken IAA independence or non-substitution invariants |

**Pre-audit observation**: The Phase 4 table currently contains:

```
| 4.1 | 4.2 | 4.3 | 4.3b | 4.4 | IAA invocation |
```

§4.3c is ABSENT. The AGENT_HANDOVER_AUTOMATION.md file header amendment note (line 5) states: "v1.2.0: Added §4.3c Pre-IAA Commit-State Gate (canonical blocking step)". The §4.3c section body EXISTS at line 548. However, the ECAP integration table at line 1113 does NOT include a 4.3c row, meaning agents appointed as ceremony-admin do not know that §4.3c must run before IAA invocation in the ECAP-enhanced flow.

**Expected fix**: Add a row between 4.3b and 4.4:
```
| 4.3c Pre-IAA Commit-State Gate | Producing agent | **execution-ceremony-admin-agent** (prepares); Foreman (verifies) |
```
The row positioning should follow the canonical order: §4.3 → §4.3c → IAA invocation → §4.3b → §4.4 (per the sequencing note at line 61).

**IAA will verify**: (a) the row is present, (b) the actor assignment does NOT remove IAA's independence, (c) the row placement respects canonical sequencing.

---

#### AC-005 — CANON_INVENTORY.json Hash and Version Correction

| Field | Value |
|-------|-------|
| `task_id` | AC-005 |
| `task_summary` | Update CANON_INVENTORY.json AGENT_HANDOVER_AUTOMATION.md entry: version `1.1.6` → `1.2.0`, hash `3b7f72b28...` → actual sha256 of fixed file |
| `iaa_trigger_category` | CANON_GOVERNANCE |
| `required_phases` | Phase 2, Phase 3, Phase 4 |
| `required_evidence_artifacts` | PREHANDOVER proof; session memory; corrected CANON_INVENTORY.json committed; both `file_hash` and `file_hash_sha256` fields updated |
| `applicable_overlays` | OVL-CG-ADM-001 (hash verification), OVL-CG-ADM-002 (metadata freshness) |
| `specific_rules` | Anti-regression Pattern 1 (hash sequencing); SB-002 below |

**Pre-audit finding (CRITICAL)**:

Current CANON_INVENTORY state for `AGENT_HANDOVER_AUTOMATION.md`:
```json
{
  "version": "1.1.6",
  "file_hash": "3b7f72b2839912fa03c46378d8c41c15927f60e4cda7286ad8e3a3b5c1e2b971",
  "file_hash_sha256": "3b7f72b2839912fa03c46378d8c41c15927f60e4cda7286ad8e3a3b5c1e2b971"
}
```

Actual file header: `v1.2.0`  
Actual file sha256 (pre-fix, current): `89b887ced3efb1c508edcf1875aef05f4cc9a75bab3c040c32327bdd1bca3f23`

**Scope Blocker SB-002 (CRITICAL — hash sequencing)**:  
AC-002, AC-003, and AC-004 WILL CHANGE the content of `AGENT_HANDOVER_AUTOMATION.md`.  
Therefore:
- The hash for AC-005 (`89b887ced...`) is the PRE-FIX hash — it will be WRONG after AC-002/003/004 are applied.
- The Foreman MUST NOT enter `89b887ced...` in CANON_INVENTORY for AC-005.
- The correct sequence is: **Apply AC-002 + AC-003 + AC-004 first → then run `sha256sum governance/canon/AGENT_HANDOVER_AUTOMATION.md` → enter that post-fix hash into CANON_INVENTORY**.
- Both `file_hash` and `file_hash_sha256` fields must be updated (they must be identical).

**Version field**:  
After fixes, `AGENT_HANDOVER_AUTOMATION.md` file header continues to say `v1.2.0` (AC-002/003/004 are corrections to an existing v1.2.0 release, not new features). CANON_INVENTORY version must be updated to `1.2.0`.

**Scope Blocker SB-003 (version bump decision)**:  
If the Foreman decides to bump the file version to `1.2.1` (treating the corrections as a patch release), then both the file header AND the CANON_INVENTORY version must reflect `1.2.1` consistently. IAA will flag any version mismatch between the file header and CANON_INVENTORY as an OVL-CG-002 failure.

---

#### AC-006 — GOVERNANCE_CANON_MANIFEST.md Verification and Reconciliation

| Field | Value |
|-------|-------|
| `task_id` | AC-006 |
| `task_summary` | Verify GOVERNANCE_CANON_MANIFEST.md entries for AGENT_HANDOVER_AUTOMATION.md and EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md are consistent with post-fix state |
| `iaa_trigger_category` | CANON_GOVERNANCE |
| `required_phases` | Phase 2, Phase 3, Phase 4 |
| `required_evidence_artifacts` | PREHANDOVER proof; session memory; corrected GOVERNANCE_CANON_MANIFEST.md committed (if changes required); CANON_INVENTORY hash for GOVERNANCE_CANON_MANIFEST.md updated if file changes |
| `applicable_overlays` | OVL-CG-ADM-001, OVL-CG-ADM-002 |
| `specific_rules` | SB-004 below; AC-007 cross-check |

**Pre-audit observation**: 

Current state of GOVERNANCE_CANON_MANIFEST.md (from grep):
- Line 83: `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md | 1.2.0 | PUBLIC_API | FM App | 2026-04-08` — **AGENT_HANDOVER_AUTOMATION.md entry NOT FOUND in this line range**
- Line 109: `EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md | 1.0.0 | PUBLIC_API | FM App, SlotMaster, All Repos | 2026-04-08` — ECAP entry present

**Scope Blocker SB-004**:  
IAA could not confirm whether GOVERNANCE_CANON_MANIFEST.md currently lists AGENT_HANDOVER_AUTOMATION.md with its version. Foreman must:
1. Search GOVERNANCE_CANON_MANIFEST.md for `AGENT_HANDOVER_AUTOMATION` entry  
2. If present: verify version matches post-fix CANON_INVENTORY version  
3. If absent: this is itself a defect — add the entry  
4. If manifest totals are stated: verify they are consistent with actual entry count

Additionally, if GOVERNANCE_CANON_MANIFEST.md itself is modified (step 4), its own CANON_INVENTORY hash entry (`53c8f4d26...`) will change and must be updated. Current CANON_INVENTORY hash for this file already matches the actual file — do not corrupt it by making unneeded changes.

---

#### AC-007 — Invariant Integrity Check (Cross-Cutting)

| Field | Value |
|-------|-------|
| `task_id` | AC-007 |
| `task_summary` | Verify no downstream text weakens Foreman accountability, PREHANDOVER immutability, IAA independence, or non-substitution rule |
| `iaa_trigger_category` | CANON_GOVERNANCE (quality gate applied across all other ACs) |
| `required_phases` | Phase 3 (applied during substantive review of all changed files) |
| `required_evidence_artifacts` | No dedicated artifact — IAA verifies inline against PR diff |
| `applicable_overlays` | OVL-CG-007 (invariant non-weakening) |
| `specific_rules` | Applied to AC-001 through AC-006 outputs |

**IAA will verify** (minimum checks):

1. **Foreman accountability**: Phase 4 table "IAA invocation" row still says Foreman (unchanged). The addition of §4.3c row must NOT transfer IAA invocation authority to ceremony-admin.

2. **PREHANDOVER immutability**: ECAP-001 invariants section (lines ~1125–1135) must still contain "once the PREHANDOVER proof is committed, it must not be mutated in-place" text. AC-001/002/003/004 must not touch or weaken this.

3. **IAA independence**: Invariant 2 ("IAA is invoked by the Foreman; IAA does NOT perform ceremony administration") must remain intact. The §4.3c row addition must not suggest that ceremony-admin can invoke IAA.

4. **Non-substitution rule**: No change may suggest that ceremony-admin is a substitute for IAA or can issue IAA verdicts.

---

### Section B: Required Evidence Artifacts for PREHANDOVER Proof

The Foreman's PREHANDOVER proof for this wave MUST contain all of the following:

```markdown
## Required PREHANDOVER Proof Sections

1. Standard metadata fields (session_id, wave, issue, branch, date, iaa_audit_token)
   - iaa_audit_token MUST be pre-populated as: IAA-session-NNN-wave1305-ecap-001-20260408-PASS
   - (per A-029 §4.3b architecture — PENDING is the OLD pattern, superseded)

2. ## Scope Declaration
   - List all modified files matching git diff --name-only origin/main...HEAD

3. ## Acceptance Criteria Evidence
   - AC-001: Evidence of strategy reference fix (grep output or diff showing correction)
   - AC-002: Evidence of v1.1.6→v1.0.0 section header fix (line 1103 diff)
   - AC-003: Evidence of v1.1.6→v1.0.0 canon reference fix (line 1167 diff)
   - AC-004: Evidence of §4.3c row addition in Phase 4 table
   - AC-005: Evidence showing:
       (a) sha256sum of FIXED AGENT_HANDOVER_AUTOMATION.md (post-AC-002/003/004)
       (b) that value entered in both file_hash and file_hash_sha256 fields of CANON_INVENTORY
       (c) version field updated to 1.2.0 (or 1.2.1 if Foreman applies patch bump per SB-003)
   - AC-006: Evidence showing GOVERNANCE_CANON_MANIFEST.md entry state for AGENT_HANDOVER_AUTOMATION

4. ## Ripple/Cross-Agent Assessment (MANDATORY per A-023)
   - Assess impact on: all agent contracts (any that reference AGENT_HANDOVER_AUTOMATION §4.3c)
   - Assess impact on: consumer repos expecting AGENT_HANDOVER_AUTOMATION v1.2.0 hash
   - Assess impact on: governance-liaison-isms-agent (maintains alignment with canonical repo)
   - State ripple obligation: does this amendment require a new ripple dispatch? (YES/NO + reason)

5. ## §4.3c Commit-State Evidence
   - git status --short (should show empty working tree before IAA invocation)
   - git log --oneline -1 (confirm all artifacts in latest commit)
   - git ls-tree HEAD PREHANDOVER_PATH (confirm PREHANDOVER proof is committed — A-033)
```

---

### Section C: Scope Blockers Summary

| ID | Severity | Description | Owner | Resolution Required Before |
|----|----------|-------------|-------|---------------------------|
| SB-001 | MEDIUM | Strategy reference fix approach — three options, Foreman must choose (see AC-001) | Foreman | First commit |
| SB-002 | CRITICAL | Hash sequencing — CANON_INVENTORY hash must be computed from POST-FIX file, not current or pre-fix state | Foreman | CANON_INVENTORY commit |
| SB-003 | LOW | Version bump decision — 1.2.0 (correction-in-place) vs 1.2.1 (patch release); must be consistent across file header, CANON_INVENTORY, and GOVERNANCE_CANON_MANIFEST | Foreman | Before committing AGENT_HANDOVER_AUTOMATION.md |
| SB-004 | MEDIUM | GOVERNANCE_CANON_MANIFEST.md — AGENT_HANDOVER_AUTOMATION entry presence unconfirmed; Foreman must verify/add before IAA invocation | Foreman | GOVERNANCE_CANON_MANIFEST.md commit |
| SB-005 | MEDIUM | Ripple obligation — if AGENT_HANDOVER_AUTOMATION.md is amended, Foreman must declare ripple dispatch status in PREHANDOVER proof | Foreman | PREHANDOVER proof |
| SB-006 | LOW | wave-current-tasks.md not updated for this wave (still shows opojd wave) | Foreman | Before PREHANDOVER commit |

---

### Section D: FFA (Foreman Follow-up Actions)

Required actions before invoking IAA, in recommended execution sequence:

```
FFA-001: Update wave-current-tasks.md for wave ecap-001-layer-down-implementation (SB-006)
FFA-002: Decide strategy reference fix approach — Option A, B, or C (SB-001)
FFA-003: Apply AC-001 fix to EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md
FFA-004: Apply AC-002 fix to AGENT_HANDOVER_AUTOMATION.md (line 1103: v1.1.6 → v1.0.0)
FFA-005: Apply AC-003 fix to AGENT_HANDOVER_AUTOMATION.md (line 1167: v1.1.6 → v1.0.0)
FFA-006: Apply AC-004 fix to AGENT_HANDOVER_AUTOMATION.md (add §4.3c row to Phase 4 table)
FFA-007: Run grep -n "v1\.1\.6" governance/canon/AGENT_HANDOVER_AUTOMATION.md — confirm zero matches in integration section (Anti-regression Pattern 4)
FFA-008: Decide version string for AGENT_HANDOVER_AUTOMATION.md — 1.2.0 or 1.2.1 (SB-003) — update file header if bumping
FFA-009: Run sha256sum governance/canon/AGENT_HANDOVER_AUTOMATION.md — record POST-FIX hash
FFA-010: Update CANON_INVENTORY.json — version field to 1.2.0 (or 1.2.1), both hash fields to POST-FIX sha256, change_note updated (SB-002)
FFA-011: Verify/update GOVERNANCE_CANON_MANIFEST.md AGENT_HANDOVER_AUTOMATION entry (SB-004)
FFA-012: If GOVERNANCE_CANON_MANIFEST.md changed: update its CANON_INVENTORY hash entry
FFA-013: Prepare PREHANDOVER proof with all required sections (Section B above)
FFA-014: Commit ALL artifacts (MUST include PREHANDOVER proof) via git add + git commit + git push (A-033)
FFA-015: Verify PREHANDOVER committed: git ls-tree -r HEAD | grep PREHANDOVER (A-033)
FFA-016: Run §4.3c Commit-State Gate checks
FFA-017: Invoke IAA
```

---

### Section E: IAA Verification Plan (what IAA will check at Phase 3 audit)

IAA will independently execute the following checks at Phase 3 (not pre-declared as PASS):

1. **AC-001 verification**: Search ECAP for `maturion/strategy/` — confirm zero occurrences. Verify chosen fix path exists in repo (if Option A) or is properly qualified (Option B/C).

2. **AC-002 + AC-003 verification**: Grep AGENT_HANDOVER_AUTOMATION.md for `v1\.1\.6` — confirm zero occurrences in the ECAP integration section. Confirm v1.0.0 appears at both lines 1103 and 1167 equivalents.

3. **AC-004 verification**: Confirm Phase 4 table contains `§4.3c` row. Confirm row placement is between 4.3 and 4.3b (canonical order). Confirm actor assignment does not weaken IAA independence (AC-007 co-check).

4. **AC-005 verification**: Run `sha256sum governance/canon/AGENT_HANDOVER_AUTOMATION.md` independently. Compare against both `file_hash` and `file_hash_sha256` in CANON_INVENTORY. Mismatch = REJECTION-PACKAGE. Verify version field = `1.2.0` (or `1.2.1` if SB-003 resolved to patch bump).

5. **AC-006 verification**: Check GOVERNANCE_CANON_MANIFEST.md for AGENT_HANDOVER_AUTOMATION entry. Verify version shown matches CANON_INVENTORY version. Verify GOVERNANCE_CANON_MANIFEST.md hash in CANON_INVENTORY matches actual file hash.

6. **AC-007 invariant scan**: Grep each amended file for presence of Foreman accountability, PREHANDOVER immutability, IAA independence, non-substitution invariant text. Flag any removal or weakening.

7. **PREHANDOVER proof checks** (A-001, A-023, A-029, A-033):
   - `git ls-tree HEAD` confirms proof is committed
   - `## Ripple/Cross-Agent Assessment` section present
   - `iaa_audit_token` has expected reference format (not PENDING)
   - All AC evidence sections present

8. **HFMC checks** (per iaa-high-frequency-checks.md): HFMC-01 through HFMC-06 applied to all artifacts.

---

## Step 0.5 — Commit Instruction

This Pre-Brief must be committed as a new file:

```
git add .agent-admin/assurance/iaa-prebrief-wave1305-ecap-001-20260408.md
git commit -m "docs(assurance): IAA Pre-Brief for wave ecap-001-layer-down-implementation (Issue #1305)"
git push
```

---

## Pre-Brief Summary

| Item | Value |
|------|-------|
| Wave | ecap-001-layer-down-implementation |
| Issue | maturion-isms#1305 |
| Total qualifying tasks | 6 (AC-001 through AC-006) |
| Trigger category | CANON_GOVERNANCE — all tasks |
| IAA invocation | MANDATORY |
| Scope blockers | 6 (SB-001 through SB-006) — SB-002 CRITICAL |
| Anti-regression obligations | 4 (hash sequencing, git-committed verification, ripple section, version grep) |
| Adoption phase at pre-brief | PHASE_B_BLOCKING |

**Status**: PRE-BRIEF COMPLETE — awaiting Foreman wave execution.  
**Next action (Foreman)**: Execute FFA-001 through FFA-017 in sequence, then invoke IAA.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**IAA Version**: independent-assurance-agent v6.2.0 / contract 2.5.0  
**Pre-Brief date**: 2026-04-08  
