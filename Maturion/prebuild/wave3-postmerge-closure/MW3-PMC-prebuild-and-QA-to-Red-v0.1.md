# Maturion Wave 3 Post-Merge Closure — Pre-Build and QA-to-RED v0.1

**Artifact ID:** MW3-PMC-PREBUILD-QA-001  
**Version:** 0.1.0  
**Status:** PREBUILD — QA-TO-RED BASELINE ACTIVE  
**Authority:** Issue #1953 / CS2 — Johan Ras  
**Foreman:** foreman-v2-agent  
**Date:** 2026-07-23  
**Repository:** `APGI-cmy/maturion-isms`

---

## 1. Purpose

This artifact defines the bounded documentation and assurance closure required after PR #1933 merged the Maturion thin-core contract correction.

The wave does not re-open the protected implementation. It aligns the programme record, establishes an authoritative tracker, records the exact merged identities, preserves historical PR evidence, and obtains fresh independent assurance against the exact merged state.

Core rule:

```text
Make the closure documentation GREEN.
Keep runtime QA RED until executable tests and runtime implementation are separately authorised.
Keep canon provenance BLOCKED until a separately authorised governance remediation is completed.
```

---

## 2. Exact authority and reviewed baseline

- CS2 issue: #1953
- Prior implementation issue: #1932
- Prior merged PR: #1933
- Merged PR head: `fe97ee74c272fb496b19371a585762930dd6822a`
- Merge commit under post-merge assurance: `fc3556f391a1a3a854d16008e17099026c5d5992`
- Maturion contract blob: `4c060b890074b79fa293dcd66c9b3f9987200e47`
- Wake-up protocol blob: `b9bc497aba37e31214e99887f40cf617c8af7799`
- Session-closure protocol blob: `6718b21b7547aae4bd0bb112e91a8f1ac12aead1`

The closure PR may add or update documentation/evidence only. It may not change the four identities above.

---

## 3. In scope

1. Create `Maturion/BUILD_PROGRESS_TRACKER.md`.
2. Reconcile the Maturion ecosystem strategy status and Wave 0–10 progress.
3. Reconcile the Wave 3 proposal to its truthful approved, implemented and merged history.
4. Record the exact merged contract and lifecycle-script identities.
5. Create the current-wave scope, builder appointment, QP, ECAP, assurance and final CS2 disposition records.
6. Preserve all PR #1933 records as historical evidence without rewriting them.
7. Obtain independent IAA against the merge baseline plus the documentation-only delta.
8. Record runtime tests as RED specified but not executable.
9. Record canonical inventory provenance as an activation blocker.

---

## 4. Explicit exclusions

This wave must not modify:

- `.github/agents/*`;
- `.agent-workspace/<agent>/knowledge/*`;
- governance canon;
- `governance/CANON_INVENTORY.json`;
- runtime or application code;
- tests or test configuration;
- schemas, migrations or RLS;
- CI workflows or gate logic;
- Supabase or Vercel configuration;
- deployment or production state;
- specialist contracts, registries, routing or activation;
- any artifact created for PR #1933.

Wave 4 and every runtime implementation wave remain separately gated.

---

## 5. QA-to-RED baseline

The closure wave starts RED for the following observable reasons.

| Closure test | RED condition | Expected GREEN condition | Evidence |
|---|---|---|---|
| `MW3-PMC-RED-001` — authoritative tracker | No programme-level Maturion tracker records Waves 0–10 and current blockers. | `Maturion/BUILD_PROGRESS_TRACKER.md` exists, is declared primary, and records one coherent programme state. | Tracker review and path check. |
| `MW3-PMC-RED-002` — strategy status | Strategy still says proposed/unmerged and contains obsolete next actions. | Strategy states approved authority and contains truthful Wave 0–10 states plus current next decisions. | Strategy diff and semantic review. |
| `MW3-PMC-RED-003` — Wave 3 proposal state | Proposal still says protected execution is not authorised and no protected file was changed. | Proposal preserves original lineage but records Issue #1932, PR #1933, exact merge outcome and current closure boundary. | Proposal diff and lineage check. |
| `MW3-PMC-RED-004` — final merged identity | No fresh closure record binds the exact final contract and script blobs to merge commit `fc3556f...`. | Tracker, proposal, PR body and IAA record agree on all exact identities. | SHA/blob parity check. |
| `MW3-PMC-RED-005` — independent assurance | Existing PASS predates the final lifecycle-script correction and merge ceremony. | New independent IAA reviews the merge baseline plus documentation-only delta and issues a binary PASS token. | New IAA wave record and session evidence. |
| `MW3-PMC-RED-006` — runtime truth | QA obligations are described in strategy but no executable RED suite exists; stale six-domain advisor remains. | Closure documents state this truth consistently and do not claim runtime GREEN. | Tracker, proposal, strategy and PR body. |
| `MW3-PMC-RED-007` — canon provenance truth | Canon inventory entries lack required canonical commit provenance while lifecycle scripts now block degraded inventory. | Closure documents record the blocker, prohibit bypass, and route remediation to a separate governance wave. | Tracker and prebuild review. |
| `MW3-PMC-RED-008` — old evidence integrity | Reconciliation could be attempted by rewriting PR #1933 historical artifacts. | No PR #1933 artifact changes; new closure evidence links to history instead. | Changed-path comparison against issue scope. |
| `MW3-PMC-RED-009` — next-step authority | Programme record could imply Wave 4 or runtime work is authorised by Wave 3 closure. | Every artifact states Wave 4 and runtime implementation require separate exact CS2 authority. | Semantic review. |

---

## 6. Runtime QA remains RED by design

The following tests remain binding requirements but are outside this documentation closure:

- `MATURION-RED-MMM-001` — exact five APGI roadmap domains;
- `MATURION-RED-MMM-002` — specialist availability transparency;
- `MATURION-RED-MMM-003` — approved knowledge-source retrieval;
- `MATURION-RED-MMM-004` — stale six-domain answer blocked;
- `MATURION-RED-MMM-005` — Maturion review before final answer.

Required current state:

```text
RED SPECIFIED
EXECUTABLE TESTS NOT YET COMMITTED
RUNTIME BUILD NOT AUTHORISED
```

No documentation wording, IAA token or Wave 3 closure may convert these obligations to GREEN.

---

## 7. Canon provenance remains blocked by design

`governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md` requires canonical commit provenance. The current inventory does not carry that field on the sampled entries. Maturion induction and closure must therefore fail closed when provenance enforcement applies.

Required current state:

```text
ACTIVATION_BLOCKED
NO BYPASS
SEPARATE GOVERNANCE REMEDIATION REQUIRED
```

This wave may record, explain and route the blocker. It may not modify the inventory, generator, policy or lifecycle-script enforcement.

---

## 8. Requirement-to-artifact traceability

| Requirement | Primary artifact | Secondary evidence |
|---|---|---|
| Programme state | `Maturion/BUILD_PROGRESS_TRACKER.md` | Strategy Wave 0–10 table and PR body |
| Strategy authority | `Maturion/strategy/Maturion_ecosystem_orchestrator_and_agent_file_system_strategy.md` | Tracker |
| Wave 3 merged history | `Maturion/strategy/Wave3_Maturion_thin_core_contract_correction_proposal_20260710.md` | Tracker and issue lineage |
| Exact merged identity | Tracker and proposal | IAA wave record |
| Scope control | Current-wave scope declaration | PR manifest if active gates require it |
| Builder separation | Current-wave builder appointment | Delegation evidence |
| Foreman QP | Current-wave QP record | Changed-path inventory and checks |
| ECAP administration | Current-wave ECAP record | PR/check metadata |
| Independent assurance | Current-wave IAA record | Independent IAA session memory |
| Final authority | Current-wave CS2/proxy signoff after PASS | Final PR handover comment |

---

## 9. Build-to-GREEN acceptance

The documentation/evidence build is GREEN only when:

- all nine `MW3-PMC-RED-*` conditions are satisfied in the intended manner;
- runtime tests remain clearly RED/not executable;
- canonical provenance remains clearly blocked and unwaived;
- no prohibited path changed;
- exact SHAs and blob identities are consistent across all current-wave artifacts;
- scope declaration and actual changed paths match;
- Foreman QP issues PASS;
- ECAP records administrative PASS without deciding readiness;
- hosted checks are terminal green on the frozen pre-IAA head;
- all review conversations are resolved;
- independent IAA issues a final `ASSURANCE-TOKEN`;
- no substantive drift occurs after the reviewed head;
- CS2 records final disposition.

---

## 10. Handover and closure rule

Before IAA PASS, the only truthful programme state is:

```text
WAVE 3 MERGED
POST-MERGE CLOSURE IN PROGRESS
HANDOVER NOT YET ALLOWED
```

After IAA PASS and CS2 disposition, the tracker may state:

```text
WAVE 3 CLOSED — POST-MERGE IAA PASS
WAVE 4 NOT AUTHORISED
RUNTIME QA RED
CANON PROVENANCE BLOCKED
```

No other closure claim is authorised.
