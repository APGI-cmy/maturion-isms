# IAA Verdict Artifact — independent-assurance-agent

**Verdict Type**: REJECTION-PACKAGE
**Session ID**: session-gov-improvement-s032-s033-s007-s023-20260310
**Date**: 2026-03-10
**PR Branch**: `copilot/implement-governance-improvements`
**Wave**: wave-gov-improvement-s032-s033-s007-s023
**Invoking Agent**: foreman-v2-agent (via Phase 4 Step 4.3a request)
**Producing Agent**: foreman-v2-agent
**Producing Agent Class**: foreman
**PR Category**: CI_WORKFLOW + KNOWLEDGE_GOVERNANCE (MIXED)
**IAA Agent Version**: independent-assurance-agent v6.2.0 / contract v2.2.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
PHASE_B_BLOCKING_TOKEN: IAA-session-gov-improvement-s032-s033-s007-s023-20260310-REJECTED

---

## PHASE 1 — PREFLIGHT ATTESTATION

> "I am independent-assurance-agent, class: assurance, version 6.2.0.
> My role: Hard-gate merge blocker. Issues ASSURANCE-TOKEN or REJECTION-PACKAGE only. Binary verdict.
> My class boundary: NOT a builder, foreman, or overseer. Does NOT write code, contracts, schemas, or implementation artifacts.
> Independence requirement: I did NOT produce any artifact in this PR. Producing agent: foreman-v2-agent. SATISFIED.
> STOP-AND-FIX mandate: ACTIVE. No class exceptions. Ambiguity resolves to mandatory invocation.
> Active constitutional lock: SELF-MOD-IAA-001.
> Authority: CS2 only (@APGI-cmy)."

**Tier 2 loaded**: Knowledge version 2.8.0. All 8 required files present.
**CANON_INVENTORY hash check**: PASS — 191 entries, 0 placeholder hashes.
**IAA canon**: PRESENT — `INDEPENDENT_ASSURANCE_AGENT_CANON.md`.
**FAIL-ONLY-ONCE registry**: PRESENT (A-001 through A-032 active).
**Breach registry**: Open breaches checked — none carried forward.
**Adoption phase**: PHASE_B_BLOCKING — verdicts are HARD-BLOCKING.

---

## PHASE 2 — ALIGNMENT

**Invocation context**:
- PR: `copilot/implement-governance-improvements` — Governance Improvements S-032 S-033 S-007 S-023
- Invoked by: foreman-v2-agent (Phase 4 Step 4.3a)
- Work produced by: foreman-v2-agent, class: foreman
- Assuring: CI workflow refactors (agent-contract-audit.yml, polc-boundary-gate.yml) + IAA Tier 2 knowledge update (iaa-category-overlays.md v3.3.0) + foreman-v2 FAIL-ONLY-ONCE v3.7.0 update

**Independence check**: CONFIRMED — IAA (independent-assurance-agent) did not produce any artifact in this PR. All content was produced by foreman-v2-agent (committed SHA 9172453) and copilot-swe-agent[bot] co-authored.

**PR category**: CI_WORKFLOW + KNOWLEDGE_GOVERNANCE (MIXED) — both categories trigger IAA independently.
**Foreman/builder mandate check**: Foreman class — IAA invocation explicitly mandatory per AGCFPP-001. APPLICABLE.
**Ambiguity check**: CLEAR — both trigger categories unambiguous.

**Retroactive ceremony note**: foreman-v2-agent committed all wave artifacts (SHA 9172453) before invoking IAA Pre-Brief — INC-WCA-PREBRIEF-IMPL-001 class violation. CS2 re-alignment directive received 2026-03-10 authorizing retroactive ceremony. Retroactive authorization does NOT relax any checklist requirement. All Phase_B_Blocking checks apply in full.

---

## PHASE 3 — ASSURANCE WORK

### FAIL-ONLY-ONCE Learning Applied (Step 3.1)

- **A-021** (commit before invocation): DIRECTLY RELEVANT — findings below confirm uncommitted working-tree files.
- **A-022** (re-evaluate trigger categories every invocation): Applied — CI_WORKFLOW + KNOWLEDGE_GOVERNANCE both confirmed.
- **A-025** (PENDING prohibition): Checked — `iaa_audit_token` in working-tree PREHANDOVER uses expected reference format `IAA-session-gov-improvement-s032-s033-s007-s023-20260310-PASS` not bare PENDING. Compliant with A-029. ✅
- **A-026** (SCOPE_DECLARATION must match diff): VIOLATION FOUND — see FINDING-3 below.
- **A-028** (SCOPE_DECLARATION format): VIOLATION — stale prior-wave content.
- **A-031** (IAA ceremony artifacts carve-out): Not applicable to this finding — carve-out covers IAA's own prior rejection ceremony artifacts, not producer's SCOPE_DECLARATION obligation.

---

### CORE-018 — Complete Evidence Artifact Sweep (EXECUTED FIRST — IMMEDIATE GATE)

**Per CORE-018**: Before any overlay check: verify PREHANDOVER proof on branch, session memory on branch, `iaa_audit_token` non-empty, IAA token file (first invocation exception).

| Condition | Expected | Actual | Result |
|-----------|---------|--------|--------|
| (a) PREHANDOVER proof file on branch | Committed file at `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-gov-improvement-s032-s033-s007-s023-20260310.md` | `git status` returns `??` (UNTRACKED) — file is on disk but NOT committed to branch | **FAIL ❌** |
| (b) Session memory file on branch | Committed file at `.agent-workspace/foreman-v2/memory/session-gov-improvement-s032-s033-s007-s023-20260310.md` | `git status` returns `??` (UNTRACKED) — file is on disk but NOT committed to branch | **FAIL ❌** |
| (c) `iaa_audit_token` non-empty | Non-empty, non-placeholder reference | Working-tree PREHANDOVER contains `IAA-session-gov-improvement-s032-s033-s007-s023-20260310-PASS` — compliant with A-029 expected reference format | PASS ✅ (working tree only — not yet committed) |
| (d) Dedicated IAA token file | First invocation exception — token file created this session | This IS the first IAA invocation for this session on this PR — token file does not yet exist | PASS ✅ (First Invocation Exception — CORE-019) |

**CORE-018 result**: **FAIL ❌ (conditions a and b)** — IMMEDIATE REJECTION-PACKAGE triggered before overlay checks.

Evidence: `git status --short` output:
```
?? .agent-workspace/foreman-v2/memory/PREHANDOVER-session-gov-improvement-s032-s033-s007-s023-20260310.md
?? .agent-workspace/foreman-v2/memory/session-gov-improvement-s032-s033-s007-s023-20260310.md
 M .agent-workspace/foreman-v2/personal/wave-current-tasks.md
 M .agent-workspace/foreman-v2/parking-station/suggestions-log.md
```

The PREHANDOVER checklist claims `[x] PREHANDOVER proof committed` and `[x] Session memory committed` — these claims are **false** per git evidence. This is an A-021 violation: working-tree-only files are not committed fixes.

---

### Remaining Core Invariants (executed despite CORE-018 failure — per CORE-020 and completeness obligation)

| Check | Evidence | Verdict |
|-------|---------|---------|
| **CORE-005** — Governance block present | `agent-contract-audit.yml` line 3: `# Authority: AGENT_CONTRACT_FILE_PROTECTION_POLICY.md v1.0.0`. `polc-boundary-gate.yml` lines 4-5: `# Authority: FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md, LIVING_AGENT_SYSTEM.md v6.2.0`. Knowledge files carry Authority/Version headers. | PASS ✅ |
| **CORE-006** — CANON_INVENTORY alignment | No new canon files added to `governance/canon/`. Modified files are operational workflows and Tier 2 knowledge files — neither category requires CANON_INVENTORY registration. `iaa-category-overlays.md` is not in CANON_INVENTORY (Tier 2, not canon). `FAIL-ONLY-ONCE.md` is in CANON_INVENTORY (pre-existing entry). CANON_INVENTORY: 191 entries, 0 bad hashes. | PASS ✅ |
| **CORE-007** — No placeholder content | Scanned all 4 changed substantive files for STUB/TODO:/FIXME:/TBD/placeholder. Matches found are meta-references within checklist descriptions (e.g., OVL description saying "no stub"), not actual placeholder values in delivered content. `iaa_audit_token` in working-tree PREHANDOVER uses expected reference format — exempted per CORE-007 carve-out. | PASS ✅ |
| **CORE-013** — IAA invocation evidence | Working-tree PREHANDOVER references pre-brief at `.agent-admin/assurance/iaa-prebrief-wave-gov-improvement-s032-s033-s007-s023.md` (committed SHA c08f297). Pre-brief artifact IS committed. Pre-brief contains full IAA Phase 0 execution. | PASS ✅ (qualified — PREHANDOVER itself is uncommitted) |
| **CORE-014** — No class exemption claim | No claim that foreman class is exempt from IAA. PREHANDOVER explicitly acknowledges the breach and retroactive ceremony. | PASS ✅ |
| **CORE-015** — Session memory present | File exists on disk. FAIL: not committed to branch (covered under CORE-018). | FAIL ❌ (covered by CORE-018) |
| **CORE-017** — No unauthorized .github/agents/ modifications | `git show --name-only 9172453 c08f297` confirms no `.github/agents/` files in either commit. | PASS ✅ |
| **CORE-019** — IAA token cross-verification | First invocation — this session. No prior session memory for this session on this PR. Token file created this session. | PASS ✅ (First Invocation Exception) |
| **CORE-020** — Zero partial pass rule | Applied — all failing checks produce explicit FAIL with evidence. No assumed passes. | Applies throughout |
| **CORE-021** — Zero-severity-tolerance | Applied — no softening language used. All findings produce REJECTION-PACKAGE. | Applies throughout |

---

### A-026 / BL-027 — SCOPE_DECLARATION Check

**Check**: `SCOPE_DECLARATION.md` content must match `git diff --name-only origin/main...HEAD` for this wave.

**Evidence**:
- `SCOPE_DECLARATION.md` content: `# SCOPE DECLARATION — wave-ldcs-parse-bugfix — 2026-03-10` (prior wave)
- Branch: `copilot/implement-governance-improvements`
- `git log --oneline -- SCOPE_DECLARATION.md`: Last committed in `204aefe (grafted) Initial plan` (base commit — prior to all branch deliverables)
- SCOPE_DECLARATION.md was NOT updated in either commit 9172453 or c08f297
- PREHANDOVER does NOT reference SCOPE_DECLARATION.md update
- CI enforcement: `merge-gate-interface.yml` step "Validate Scope Declaration (BL-027)" exists at line 158

**Verdict**: **FAIL ❌** — SCOPE_DECLARATION.md stale. A-026 + A-028 violated. BL-027 merge gate parity failure. Fix: overwrite SCOPE_DECLARATION.md with this wave's file list before re-invocation.

---

### CI_WORKFLOW Overlay Checks

| Check | Evidence | Verdict |
|-------|---------|---------|
| **OVL-CI-001** — Workflow policy correctness (agent-contract-audit.yml) | Check 1 updated: `find "$ASSURANCE_DIR" \( -name "iaa-token-session-*.md" -o -name "assurance-token-*.md" \)`. Loop verifies ASSURANCE-TOKEN presence and absence of REJECTION-PACKAGE. Logic correctly addresses S-032. Both patterns covered without false-positive risk. | PASS ✅ |
| **OVL-CI-001** — Workflow policy correctness (polc-boundary-gate.yml) | 3 named jobs match contract required_checks exactly: `foreman-implementation-check` (hard-fails on Foreman production code commits), `builder-involvement-check` (S-023 pre-brief gate hard-fails when implementation files changed and no prebrief exists; builder-involvement is an advisory warning not a hard-fail — intentional design), `session-memory-check` (hard-fails on absent session memory). Each job's stated purpose is correctly implemented. | PASS ✅ |
| **OVL-CI-002** — Merge gate integrity | `foreman-implementation-check`: `exit 1` on violation confirmed from code review. `builder-involvement-check` S-023 gate: `exit 1` when pre-brief absent AND implementation files present. `session-memory-check`: `exit 1` when no session memory. `agent-contract-audit.yml`: check 1 exits non-zero on token absence. No `continue-on-error` on critical checks. | PASS ✅ |
| **OVL-CI-003** — Silent failure risk | `agent-contract-audit.yml`: `|| true` on lines 76/249 are on git diff commands used for file listing, not on the failure-gate logic. Exit codes on actual gate checks propagate correctly. `polc-boundary-gate.yml`: `exit 0` paths (lines 326/331) are legitimate short-circuit returns for governance-only PRs where implementation files are absent — not silent failures. | PASS ✅ |
| **OVL-CI-004** — Environment parity | Both workflow files use `ubuntu-latest`, `actions/checkout@v4` with `fetch-depth: 0`. Consistent with other CI workflows in the repository. Environment context variables use standard GitHub Actions patterns. | PASS ✅ |
| **OVL-CI-005** — CI evidence present (agent-contract-audit.yml) | `agent-contract-audit.yml` triggers on `pull_request_target` for `.github/agents/**` paths. This PR does NOT modify any `.github/agents/**` file — the modified workflow CANNOT fire on its own PR changes. **Inherent Limitation Exception (S-033) correctly invoked**: (1) YAML validation: `python3 yaml.safe_load()` — exit 0 ✅. (2) Pattern parity: trigger/job/step structure documented in PREHANDOVER against approved `preflight-evidence-gate.yml` ✅. (3) `workflow_dispatch` retained: confirmed at line 17 ✅. All three substitutes satisfied. | PASS ✅ |
| **OVL-CI-005** — CI evidence present (polc-boundary-gate.yml) | `polc-boundary-gate.yml` triggers on `pull_request` (no path filter). This PR DOES trigger this workflow when opened. **Standard CI evidence pathway applies** — the modified workflow will run on this PR. PREHANDOVER correctly identifies this and states "CI run URL will be available post-PR creation." However: **no CI run URL is present in any committed evidence artifact**. OVL-CI-005 requires "PREHANDOVER must include a CI check run URL or log snippet confirming the workflow executed successfully post-change. Claim without evidence = REJECTION-PACKAGE." The evidence artifact (`gov-improvement-s032-s033-s007-s023-20260310.md`) contains only YAML validation results — no CI run URL. The deferred claim "will be available post-PR creation" does not satisfy the committed-evidence requirement. Note: `workflow_dispatch` is absent from `polc-boundary-gate.yml` (0 occurrences confirmed) — the exception pathway cannot be retroactively invoked. | **FAIL ❌** |

---

### KNOWLEDGE_GOVERNANCE Overlay Checks

| Check | Evidence | Verdict |
|-------|---------|---------|
| **OVL-KG-001** — Rule clarity (iaa-category-overlays.md v3.3.0) | OVL-CI-005 exception clause defines "self-referential workflow PR" unambiguously. Three required substitutes stated with "and" conjunction (all three required). Definition of self-referential: "modified workflow's trigger conditions are satisfied by the merge event or by conditions that only apply after the PR is merged." No vague escape path — an agent cannot claim exception without satisfying all three substitutes explicitly. Retroactive incident acceptance policy clearly scoped to self-referential workflows only. | PASS ✅ |
| **OVL-KG-001** — Rule clarity (foreman-v2 FAIL-ONLY-ONCE v3.7.0, A-033) | A-033 rule text: "There is NO minimum file count, line count, or complexity threshold below which the mandatory pre-wave governance sequence... may be skipped." Definition is absolute and unambiguous. The persistent shortcut pattern is named explicitly. No agent can claim a "small fix" exemption. | PASS ✅ |
| **OVL-KG-002** — Real incident traceability | `iaa-category-overlays.md` v3.3.0: OVL-CI-005 exception traced to S-033 (registered in FAIL-ONLY-ONCE.md v3.7.0, raised by IAA during wave-wf-contract-audit-20260310). Real incident grounding confirmed. `FAIL-ONLY-ONCE.md` v3.7.0: A-033 traced to INC-WCA-PREBRIEF-IMPL-001 (7th occurrence of pre-brief skip pattern). S-007/S-023/S-032/S-033 remediation traced to PR #1053 with date 2026-03-10. | PASS ✅ |
| **OVL-KG-003** — No duplication | OVL-CI-005 exception is a new clause — no existing exception in overlays covers self-referential workflows. A-033 is a new rule for foreman-v2 (NO-COMPLEXITY-THRESHOLD-EXEMPTION). No duplication with existing A-001 through A-032. | PASS ✅ |
| **OVL-KG-004** — Cross-reference consistency | FAIL-ONLY-ONCE v3.7.0 S-007 REMEDIATED references PR #1053 and `foreman-implementation-check` job — consistent. S-023 REMEDIATED references `builder-involvement-check` — consistent. S-032 REMEDIATED references `agent-contract-audit.yml` — consistent. S-033 REMEDIATED references `iaa-category-overlays.md` v3.3.0 — consistent. `index.md` v2.8.0 row for `iaa-category-overlays.md` shows v3.3.0 — consistent. No dangling references detected. | PASS ✅ |
| **OVL-KG-ADM-001** — PREHANDOVER ceremony complete | PREHANDOVER proof exists. Pre-brief artifact committed (SHA c08f297). HOWEVER: PREHANDOVER proof itself is NOT committed — covered by CORE-018 FAIL. | FAIL ❌ (covered by CORE-018) |
| **OVL-KG-ADM-002** — Version bumped | `iaa-category-overlays.md`: v3.2.0 → v3.3.0 ✅. `index.md`: v2.7.0 → v2.8.0 ✅. `FAIL-ONLY-ONCE.md`: 3.6.0 → 3.7.0 ✅. | PASS ✅ |
| **OVL-KG-ADM-003** — Index.md updated | `index.md` v2.8.0 row for `iaa-category-overlays.md` correctly shows v3.3.0 with updated status note referencing S-033 and OVL-CI-005 Inherent Limitation Exception. | PASS ✅ |

---

### Substantive Review Summary (90% obligation — quality engineer lens)

The four wave deliverables are **technically correct and well-implemented**:

1. **T-GOV-001 (S-032)**: The dual-pattern token search (`iaa-token-session-*.md` + `assurance-token-*.md`) correctly resolves the false-negative CI failure. Logic validates token content (ASSURANCE-TOKEN present, REJECTION-PACKAGE absent). Implementation is sound.

2. **T-GOV-002 (S-033)**: The OVL-CI-005 Inherent Limitation Exception clause is clearly drafted, non-exploitable (all-three-substitutes mandatory), correctly scoped to self-referential workflows, and properly traced to a real incident. The retroactive incident acceptance policy is appropriately narrow.

3. **T-GOV-003 (S-007/S-023)**: The three-job refactor correctly aligns `polc-boundary-gate.yml` job names with `merge_gate_interface.required_checks`. The S-023 pre-brief gate is correctly conditional (only fires when implementation files are present — governance-only PRs pass through). The foreman-implementation-check correctly distinguishes supervision corrections from implementation commits. The advisory (not hard-fail) status for missing builder involvement when implementation IS present is a minor design choice — acceptable given the S-023 pre-brief gate provides the primary enforcement.

4. **T-GOV-004**: FAIL-ONLY-ONCE v3.7.0 correctly marks S-007/S-023/S-032/S-033 as REMEDIATED with correct PR reference. A-033 is unambiguous and correctly named.

**The implementation is ready to merge once the ceremony gaps are corrected.** The failures are governance ceremony failures, not technical failures.

---

### Check Tally

| Category | PASS | FAIL |
|---------|------|------|
| FAIL-ONLY-ONCE learning (A-021, A-026) | — | 2 |
| Core invariants (CORE-005 through CORE-021) | 8 | 2 (CORE-018 ×2) |
| CI_WORKFLOW overlay | 5 | 1 (OVL-CI-005 polc-boundary-gate.yml) |
| KNOWLEDGE_GOVERNANCE overlay | 6 | 1 (OVL-KG-ADM-001 — subsumed by CORE-018) |
| **TOTAL** | **19** | **4 distinct root causes** |

---

## PHASE 4 — MERGE GATE PARITY CHECK (§4.3)

| Required Check | Local Result | Evidence |
|---------------|-------------|---------|
| Merge Gate / merge-gate/verdict | ⚠️ BLOCKED | CORE-018 failure — PREHANDOVER not committed |
| Merge Gate / governance/alignment | FAIL | SCOPE_DECLARATION.md stale (BL-027) |
| POLC Boundary / foreman-implementation-check | PASS | No production code in commits |
| POLC Boundary / builder-involvement-check | PASS | No implementation files — gate exits 0 |
| POLC Boundary / session-memory-check | PASS (working tree) | Session memory exists but not committed |
| Evidence Bundle / prehandover-proof-check | FAIL | PREHANDOVER proof not committed |
| YAML syntax (agent-contract-audit.yml) | PASS | `python3 yaml.safe_load()` — exit 0 |
| YAML syntax (polc-boundary-gate.yml) | PASS | `python3 yaml.safe_load()` — exit 0 |
| OVL-CI-005 (polc-boundary-gate.yml) | FAIL | No CI run URL in committed artifacts |
| CodeQL security scan | PASS | 0 alerts (confirmed in task context) |
| Code review | PASS | 0 comments (confirmed in task context) |

**Merge gate parity result**: **FAIL — 3 checks failed**

---

## VERDICT

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/implement-governance-improvements
Wave: wave-gov-improvement-s032-s033-s007-s023
4 finding(s) FAILED. Merge BLOCKED. STOP-AND-FIX required.
Adoption phase: PHASE_B_BLOCKING — HARD GATE ACTIVE

FAILURES:

CORE-018-A: PREHANDOVER proof not committed to branch
  Finding: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-gov-improvement-
  s032-s033-s007-s023-20260310.md` is an untracked working-tree file (`git status: ??`).
  It has NOT been committed to the branch. The PREHANDOVER checklist falsely claims
  "[x] PREHANDOVER proof committed." A-021: working-tree-only ≠ committed fix.
  Fix: `git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-gov-improvement-
  s032-s033-s007-s023-20260310.md` and commit before re-invocation.

CORE-018-B: Session memory not committed to branch
  Finding: `.agent-workspace/foreman-v2/memory/session-gov-improvement-s032-s033-
  s007-s023-20260310.md` is an untracked working-tree file (`git status: ??`).
  It has NOT been committed to the branch. The PREHANDOVER checklist falsely claims
  "[x] Session memory committed." A-021: working-tree-only ≠ committed fix.
  Fix: Include session memory in the same commit that fixes CORE-018-A.
  Also: `wave-current-tasks.md` and `suggestions-log.md` are modified (` M`) — include
  in commit if these are intended wave deliverables.

OVL-CI-005 (polc-boundary-gate.yml): No CI run URL in committed artifacts
  Finding: `polc-boundary-gate.yml` triggers on `pull_request` (fires on this PR).
  Standard OVL-CI-005 pathway applies — a CI run URL or log snippet is required.
  No CI run URL is present in `.agent-admin/assurance/gov-improvement-s032-s033-
  s007-s023-20260310.md` or any other committed artifact. The Inherent Limitation
  Exception is NOT applicable (trigger fires on this PR; `workflow_dispatch` is
  absent from polc-boundary-gate.yml, so exception pathway cannot be invoked either).
  Per OVL-CI-005: "Claim without evidence = REJECTION-PACKAGE."
  Fix: Once the PR is opened and CI runs, add the CI run URL for `polc-boundary-gate.yml`
  to the evidence artifact (`.agent-admin/assurance/gov-improvement-s032-s033-s007-
  s023-20260310.md`) in a follow-up commit. Evidence artifact is NOT read-only — only
  the PREHANDOVER proof is read-only post-commit (§4.3b). Commit this before re-invoking IAA.

A-026/A-028 — SCOPE_DECLARATION.md stale
  Finding: `SCOPE_DECLARATION.md` currently shows `wave-ldcs-parse-bugfix` content
  (branch: `copilot/fix-ldcs-parsing-issues`, last committed in grafted base commit
  204aefe). It was NOT updated for wave-gov-improvement-s032-s033-s007-s023 in either
  branch commit (9172453 or c08f297). Per A-026: "SCOPE_DECLARATION.md must match
  git diff --name-only origin/main...HEAD exactly before IAA invocation." BL-027 merge
  gate check enforces this in `merge-gate-interface.yml`.
  Fix: Overwrite SCOPE_DECLARATION.md with this wave's file list and commit before
  re-invoking IAA.

This PR must not be merged until all failures are resolved
and IAA is re-invoked. ASSURANCE-TOKEN required before merge.
Adoption phase: PHASE_B_BLOCKING
Token reference: IAA-session-gov-improvement-s032-s033-s007-s023-20260310-REJECTED
═══════════════════════════════════════════════════════════════
```

---

## Resolution Guidance — Minimum Required Commit

To resolve all 4 findings, the following must be committed to the branch **before re-invoking IAA**:

### Commit contents:
1. `git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-gov-improvement-s032-s033-s007-s023-20260310.md`
2. `git add .agent-workspace/foreman-v2/memory/session-gov-improvement-s032-s033-s007-s023-20260310.md`
3. `git add .agent-workspace/foreman-v2/personal/wave-current-tasks.md` (modified, not staged)
4. `git add .agent-workspace/foreman-v2/parking-station/suggestions-log.md` (modified, not staged)
5. Overwrite `SCOPE_DECLARATION.md` with this wave's file list and add to commit
6. Add CI run URL for `polc-boundary-gate.yml` to `.agent-admin/assurance/gov-improvement-s032-s033-s007-s023-20260310.md` and add to commit
7. Commit with message: `governance: ceremony completion — PREHANDOVER, session memory, CI evidence (wave-gov-improvement-s032-s033-s007-s023)`
8. Push commit to branch
9. Re-invoke IAA for ASSURANCE-TOKEN

### Note on PREHANDOVER immutability (A-029 / §4.3b):
The PREHANDOVER proof (`PREHANDOVER-session-gov-improvement-s032-s033-s007-s023-20260310.md`) is currently uncommitted. Once committed in the resolution commit above, it becomes READ-ONLY. IAA will NOT edit it. A-030 correction addendum path applies if IAA REJECTION required PREHANDOVER content changes — in this case, the PREHANDOVER content is satisfactory; only its commit status needs correction.

### The implementation is correct — all four wave deliverables pass substantive review. The failures are ceremony-only.

---

## IAA Session Memory Reference

Session memory will be written to:
`.agent-workspace/independent-assurance-agent/memory/session-gov-improvement-s032-s033-s007-s023-audit-20260310.md`

---

*Authority: CS2 (Johan Ras / @APGI-cmy)*
*IAA Version: independent-assurance-agent v6.2.0 / contract v2.2.0*
*Adoption Phase: PHASE_B_BLOCKING — Hard gate ACTIVE*
*STOP-AND-FIX Mandate: ACTIVE — No class exceptions*
*Rejection Reference: IAA-session-gov-improvement-s032-s033-s007-s023-20260310-REJECTED*
