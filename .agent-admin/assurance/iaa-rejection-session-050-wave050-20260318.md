# IAA REJECTION-PACKAGE — Session 050 — Wave 050 — 2026-03-18

**Agent**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**IAA Session**: session-050-wave050-20260318
**Date**: 2026-03-18
**Adoption Phase**: PHASE_B_BLOCKING — hard gate ACTIVE

**PR Branch**: `copilot/implement-structural-gate-iaa-pre-brief`
**Issue**: "Implement structural gate for IAA Pre-Brief enforcement: hard-stop before build actions, CI preflight verification, and workflow/contract updates" — opened by @APGI-cmy
**Invoking Agent**: CodexAdvisor-agent (session-050-20260318)
**Producing Agent**: CodexAdvisor-agent (session-050-20260318), class: overseer
**Invocation**: Second attempt (first rate-limited; this is first effective invocation)

**PHASE_B_BLOCKING_TOKEN: PHASE_B_BLOCKING_REJECTION**

---

## Verdict

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/implement-structural-gate-iaa-pre-brief
    "Implement structural gate for IAA Pre-Brief enforcement"
    CodexAdvisor-agent session-050-20260318 (second invocation attempt)
5 check(s) FAILED. Merge blocked. STOP-AND-FIX required.
Adoption Phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════════════════════════════
```

**Token reference**: IAA-session-050-20260318-REJECTION

---

## Checks Summary

| Category | Checks | PASS | FAIL |
|----------|--------|------|------|
| FAIL-ONLY-ONCE learning | 7 | 7 | 0 |
| Core invariants (CORE-001–023) | 23 | 22 | 1 |
| AGENT_CONTRACT overlay | 11 | 10 | 1 |
| CANON_GOVERNANCE overlay | 6 | 4 | 2 |
| CI_WORKFLOW overlay | 5 | 4 | 1 |
| KNOWLEDGE_GOVERNANCE overlay | 7 | 5 | 2 |
| PRE_BRIEF_ASSURANCE overlay | 1 | 1 | 0 |
| Merge gate parity | 9 | 6 | 3 |
| **Total** | **~54** | **~49** | **5 distinct** |

---

## Failures (All Blocking — PHASE_B_BLOCKING)

### FAILURE-1 — CORE-003 / Merge Gate Parity: Contract version YAML/footer mismatch

**Finding**: `contract_version: 2.7.0` in YAML frontmatter of `.github/agents/foreman-v2-agent.md`
contradicts `**Contract**: 2.8.0` in the contract footer. The YAML field was not updated when
the footer was bumped. Automated governance tools reading the YAML will retrieve v2.7.0 while
the contract declares v2.8.0.

**Fix required**: In `.github/agents/foreman-v2-agent.md` YAML frontmatter, change:
`contract_version: 2.7.0` → `contract_version: 2.8.0`

---

### FAILURE-2 — OVL-CG-ADM-001 / Merge Gate Parity: CANON_INVENTORY.json stale

**Finding**: `governance/CANON_INVENTORY.json` was not updated on this branch.
`IAA_PRE_BRIEF_PROTOCOL.md` was bumped from v1.1.0 to v1.2.0, but CANON_INVENTORY still
records the old hash `c4f8d171ca9c9683025f6e7a14cf7c6908362a9c1e24f3c6ed0735453ef7238f`.
Actual file hash is `db7c3ff310586f759c1338dcfb8335c6568a31c359b2648377296d77f8794b6c`.
CANON_INVENTORY integrity is broken for this canon file.

**Fix required**: Update `governance/CANON_INVENTORY.json` entry for `IAA_PRE_BRIEF_PROTOCOL.md`:
- `version`: `1.1.0` → `1.2.0`
- `file_hash` and `file_hash_sha256`: update to `db7c3ff310586f759c1338dcfb8335c6568a31c359b2648377296d77f8794b6c`
- `last_updated`: update to `2026-03-18`
- `change_note`: add v1.2.0 change summary (removed PHASE_A_ADVISORY escape hatch, CS2-escalation-only IAA Unavailability Protocol, iaa_prebrief_path field, IAA Token Self-Certification Guard)

---

### FAILURE-3 — OVL-KG-ADM-002/003 / Merge Gate Parity: Foreman index.md version stale

**Finding**: `.agent-workspace/foreman-v2/knowledge/index.md` was not updated on this branch.
`prehandover-template.md` was bumped to v1.7.0 (IAA Token Self-Certification Guard section added),
but the foreman knowledge index still shows `prehandover-template.md | 1.6.0`.
Declared-state integrity fails. A foreman agent running preflight will load incorrect version
metadata for this template.

**Fix required**: Update `.agent-workspace/foreman-v2/knowledge/index.md`:
1. Row for `prehandover-template.md`: change version from `1.6.0` to `1.7.0`
2. Update description to include: `IAA Token Self-Certification Guard section added (iaa_token_self_cert_guard record in PREHANDOVER; PHASE_B_BLOCKING_TOKEN check)`
3. Bump the index `Knowledge Version` header to reflect this update.

---

### FAILURE-4 — OVL-CI-005: CI evidence — self-referential exception not invoked

**Finding**: `preflight-evidence-gate.yml` uses `pull_request_target` trigger, which runs
the workflow from the base branch. The two new jobs (`iaa-prebrief-check`,
`iaa-token-self-cert-check`) will NOT execute until the PR is merged. This is a self-referential
CI workflow PR. The PREHANDOVER proof does not invoke the OVL-CI-005 self-referential exception
clause. Three required substitutes are absent:
(a) Only `python3 yaml.safe_load` provided — not `actionlint` or `yamllint` as required
(b) No pattern parity evidence documented in PREHANDOVER
(c) `workflow_dispatch:` trigger is absent from the workflow — CS2 cannot manually validate
    the new jobs post-merge without creating a test PR

**Fix required**:
1. Add `workflow_dispatch:` to `preflight-evidence-gate.yml` `on:` section (enables CS2 manual validation)
2. Run `yamllint` or `actionlint` on the workflow file. Since PREHANDOVER is read-only post-commit
   (§4.3b), include the output in the new PREHANDOVER proof for the resolution commit
3. Document pattern parity evidence (new jobs follow same structural pattern as existing
   `preflight-evidence-check` job) explicitly invoking the OVL-CI-005 exception clause
   with all three substitutes present in the new PREHANDOVER proof

---

### FAILURE-5 — OVL-AC-007 / OVL-CG-004/005: IAA agent contract ripple missing

**Finding**: `IAA_PRE_BRIEF_PROTOCOL.md` v1.2.0 and the CI gate (`iaa-token-self-cert-check`)
introduce a new mandatory requirement: all IAA token files must contain a `PHASE_B_BLOCKING_TOKEN:`
field. This requirement ripples to `.github/agents/independent-assurance-agent.md` Phase 4 Step
4.2b, which specifies the token file output format. IAA's contract was NOT updated to explicitly
include this field in Phase 4 output. `.github/agents/independent-assurance-agent.md` is absent
from the PR diff. The CI gate will enforce what IAA's contract does not mandate — a governance
gap in the enforcement chain.

**Fix required** (one of the following):
**Option A** (preferred): Update `.github/agents/independent-assurance-agent.md` Phase 4 Step 4.2b
token file output specification to explicitly require the `PHASE_B_BLOCKING_TOKEN: PHASE_B_BLOCKING`
field in all ASSURANCE-TOKEN files. CodexAdvisor-agent must perform this update (AGCFPP-001).
A new IAA invocation will be required for that contract change.

**Option B** (CS2 waiver path): If CS2 determines the canon obligation on IAA is self-sufficient
without contract amendment, include verbatim CS2 written authorisation in the updated PREHANDOVER
proof explicitly granting this waiver. Quote the CS2 comment verbatim.

---

## Passing Checks (Substantive Summary)

- **HALT-008 implementation**: Correctly implemented in YAML (halt_conditions entry) and Phase 3
  Step 2.7 (explicit HARD STOP). CI enforcement logic is sound.
- **PHASE_A_ADVISORY abolition**: Cleanly removed from canon and Foreman contract. CS2-escalation-only
  path correctly substituted. No escape hatch remains.
- **iaa_prebrief_path field**: Correctly added to template and both active wave files. CI logic
  correctly checks for PENDING state.
- **IAA Token Self-Certification Guard**: Canon section is well-structured. CI enforcement logic
  is correct. The guard design (PHASE_B_BLOCKING_TOKEN as unforgeable signal) is sound.
- **CI workflow logic**: Both new jobs correctly implement their stated policies. Exit codes
  correct. No silent failure paths. Existing gate not weakened.
- **Character count**: 29,953 / 30,000 — within limit.
- **AGCFPP-001**: CodexAdvisor correctly authorized by CS2 issue.
- **Independence**: IAA did not produce any artifact reviewed in this PR. No HALT-001 condition.

---

## Resolution Protocol

1. Fix all 5 failures above (FAILURE-1 through FAILURE-5)
2. Re-commit all changed files including governance/CANON_INVENTORY.json, foreman index.md, workflow_dispatch addition
3. Re-generate PREHANDOVER proof (fresh file, §4.3b immutability — new file, not an edit to the prior PREHANDOVER)
4. Re-invoke IAA via CodexAdvisor session handover
5. IAA will issue ASSURANCE-TOKEN if all 5 failures are resolved

**This PR must not be opened until ASSURANCE-TOKEN is issued.**

---

*Authority: CS2 (Johan Ras / @APGI-cmy)*
*IAA Version: 6.2.0 | Contract: 2.3.0*
*STOP-AND-FIX mandate: ACTIVE — No class exceptions*
