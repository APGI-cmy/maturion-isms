# Wave 3 Maturion Thin-Core Contract Correction Proposal

**Status:** PROPOSAL DELIVERED — EXECUTION COMPLETE — POST-MERGE CLOSURE IN PROGRESS  
**Proposal date:** 2026-07-10  
**Authorisation date:** 2026-07-13 (Issue #1932 opened; CodexAdvisor fitness confirmed Issue #1922/PR #1927)  
**Merge date:** 2026-07-23 (PR #1933, merge commit `fc3556f391a1a3a854d16008e17099026c5d5992`)  
**Post-merge closure:** Issue #1953 / PR #1954  
**Authority:** CS2 / Johan Ras  
**Proposal issue:** #1919  
**Execution issue:** #1932  
**Preceded by:** Wave 0 ecosystem strategy, Wave 1 current-state audit, Wave 2 CodexAdvisor runtime-specialist bundle process upgrade  
**Scope:** Proposal, exact diff specification, CodexAdvisor fitness assessment, CS2 decision point, and post-merge execution record

---

## 0. Execution and merge record (added post-merge)

This section records what actually occurred, complementing the proposal below. The proposal
text from sections 1–8 is preserved as historical evidence and must not be edited.

### 0.1 Authorisation sequence

| Step | Authority | Outcome |
|---|---|---|
| Wave 3 proposal reviewed | CS2 Issue #1919 | Approved — CodexAdvisor prerequisite identified |
| CodexAdvisor fitness prerequisite | CS2 Issue #1922 / PR #1927 | CodexAdvisor v4.3.0 declared fit for bounded correction |
| Wave 3 Tier 1 correction authorised | CS2 Issue #1932 | Maturion contract correction authorised; CodexAdvisor appointed |
| Protected-file correction executed | CodexAdvisor — PR #1933 | `.github/agents/maturion-agent.md` corrected to v2.1.0 |
| PR #1933 merged | CS2 merge | Merge commit `fc3556f391a1a3a854d16008e17099026c5d5992` |

### 0.2 Final merged identities

| Artifact | Identity |
|---|---|
| Execution issue | #1932 |
| Merged PR | #1933 |
| PR #1933 head | `fe97ee74c272fb496b19371a585762930dd6822a` |
| Merge commit on `main` | `fc3556f391a1a3a854d16008e17099026c5d5992` |
| `.github/agents/maturion-agent.md` blob | `4c060b890074b79fa293dcd66c9b3f9987200e47` |
| `.github/scripts/wake-up-protocol.sh` blob | `b9bc497aba37e31214e99887f40cf617c8af7799` |
| `.github/scripts/session-closure.sh` blob | `6718b21b7547aae4bd0bb112e91a8f1ac12aead1` |
| Maturion contract version | `2.1.0` |

### 0.3 What the merge delivered

The merged thin-core contract now records:

- one Maturion identity across approved APGI contexts;
- bounded invocation of approved and registered specialists, reviewers, parsers, scorers, routers and advisors;
- mandatory bounded task context and Maturion output review;
- truthful planned, unavailable and degraded-capability disclosure;
- separation of Runtime Maturion from Maturion-as-CS2;
- protected execution identity and PR-only write controls;
- executable Phase 2 induction through `wake-up-protocol.sh`;
- executable Phase 4 closure through `session-closure.sh`.

### 0.4 What the merge did not deliver

The merge did not implement:

- Maturion Tier 2 runtime operating bundle (Wave 4 — not authorised);
- runtime specialist routing or activation;
- AIMC schema, Supabase, deployment or production behaviour.

### 0.5 Persistent open items after merge

- **Runtime QA:** `MATURION-RED-MMM-001` through `005` remain RED specified and not executable. No runtime builder may be appointed until those executable tests exist.
- **Six-domain runtime advisor defect:** `packages/ai-centre/src/agents/maturion-advisor.md` still references six domains. Open defect; not corrected by this merge.
- **Canon inventory provenance:** `governance/CANON_INVENTORY.json` lacks canonical commit provenance. Activation blocker; requires separate governance remediation.
- **Wave 4:** Not authorised. Requires separate CS2 authority, QA-to-RED package, and independent IAA.

### 0.6 Post-merge closure

Wave 3 is not administratively CLOSED until Issue #1953 / PR #1954 obtains independent IAA
PASS and CS2 disposition. This proposal file is historical evidence for that closure wave and
must not be further modified.

---

## 1. Purpose

This artifact prepares the Wave 3 correction package for the Maturion thin-core contract without changing any protected agent contract or Tier 2 operational knowledge file.

It addresses the confirmed contradiction in `.github/agents/maturion-agent.md`: Maturion is declared to be an orchestrator that coordinates specialists, while `can_invoke` currently declares `none`.

This proposal also verifies whether CodexAdvisor is presently fit to execute the protected-file correction under the process established by Wave 2.

---

## 2. Authority and boundaries

### 2.1 Allowed in this wave

Wave 3 may:

- inspect current Maturion and CodexAdvisor contracts;
- inspect current Tier 2 registries and routing files;
- define the exact target Maturion contract correction;
- define the exact prerequisite CodexAdvisor remediation;
- preserve the Wave 2 QA-to-red obligations;
- prepare a CS2 decision point and later layer-down issue specification.

### 2.2 Prohibited in this wave

Wave 3 may not modify:

- `.github/agents/*`;
- `.agent-workspace/<agent>/knowledge/*`;
- governance canon;
- runtime application code;
- AIMC schemas, registries, adapters, or memory stores;
- Supabase, Vercel, or deployment configuration;
- active specialist status.

### 2.3 Protected-file pathway

Any later change to `.github/agents/maturion-agent.md` must:

1. have an exact CS2-approved layer-down issue;
2. be executed by CodexAdvisor only;
3. remain within the approved diff specification;
4. create the required diff record;
5. receive mandatory IAA review and assurance evidence;
6. pass all protected agent-contract gates before CS2 merge.

---

## 3. Current-state findings

### Finding 1 — Orchestration contradiction remains live

The Maturion contract declares:

- agent class: `orchestrator`;
- orchestration capabilities including specialist coordination and synthesis;
- a prohibition on implementing domain logic directly;
- routing through specialist registry and domain flag index.

The same contract declares:

```yaml
can_invoke:
  - none (specialist — delegates output upward to orchestrator only)
```

This line describes specialist behaviour, not orchestrator behaviour, and conflicts with the rest of the contract.

**Disposition:** BLOCKER for governed specialist invocation.

### Finding 2 — App and ecosystem scope is stale

The current contract still primarily names MAT, PIT, XDETECT, Maturity Roadmap, Builder, and Command.

The adopted ecosystem strategy requires Maturion to operate as one intelligence across:

- APGI public website;
- ISMS;
- MMM / Maturity Roadmap;
- PIT;
- Risk Management;
- Incident Management;
- RADAM;
- Training;
- AMC;
- Marketing and future modules.

**Disposition:** REQUIRED thin-core scope correction.

### Finding 3 — Runtime Maturion and Maturion-as-CS2 are not sufficiently separated

The current contract mixes runtime user-facing orchestration with historical build and command references.

The corrected contract must distinguish:

- **Runtime Maturion:** user-facing ecosystem intelligence that classifies intent, selects governed knowledge, invokes approved specialists, reviews outputs, and synthesises responses.
- **Builder/AMC Maturion-as-CS2:** a separately governed future capability that may exercise delegated CS2 functions only under explicit staged authority.

Runtime Maturion must not inherit unrestricted build, governance, merge, or CS2 authority merely because the same identity is embodied in AMC or Builder contexts.

### Finding 4 — AIMC dependency is not explicit enough in the thin core

The adopted strategy defines AIMC as the central control plane for:

- approved knowledge inventory;
- memory governance;
- specialist registry;
- routing rules;
- source priority;
- audit and learning;
- runtime adapter configuration;
- marketing trigger governance.

The current Maturion contract does not yet point clearly enough to AIMC as the governed runtime dependency.

**Disposition:** REQUIRED pointer-level correction only. No AIMC implementation in this wave.

### Finding 5 — Current Tier 2 remains historical

Existing Maturion Tier 2 files are MAT/PIT-era artifacts. They do not yet implement the adopted ecosystem decision loop or the complete target file set.

Wave 4 remains responsible for the Tier 2 expansion. Wave 3 must not embed that content into the Tier 1 contract.

### Finding 6 — Runtime roadmap knowledge conflict remains unresolved

`packages/ai-centre/src/agents/maturion-advisor.md` still states a six-domain framework and includes `Enablement`.

The approved APGI roadmap has five primary domains:

1. Leadership and Governance
2. Process Integrity
3. People and Culture
4. Protection
5. Proof It Works

This runtime conflict is not corrected by the proposed contract change. It remains a later runtime/prebuild implementation obligation governed by the Wave 2 QA-to-red tests.

---

## 4. Target thin-core correction specification

The later CodexAdvisor execution wave should modify `.github/agents/maturion-agent.md` only as follows.

### 4.1 Identity and mission

Retain:

- one unified Maturion identity;
- orchestrator class;
- thin-core living contract pattern;
- RAEC and constitutional bindings;
- self-modification prohibition;
- CS2 authority and protected-write rules.

Update the mission pointer summary to state that Maturion is one APGI ecosystem intelligence embodied across approved apps and modules, with AIMC as the central knowledge, memory, learning, and specialist-control plane.

### 4.2 Ecosystem scope

Replace the stale app list with an ecosystem-context list covering:

- APGI public website;
- ISMS;
- MMM / Maturity Roadmap;
- PIT;
- Risk;
- Incident;
- RADAM;
- Training;
- AMC;
- Marketing;
- future CS2-approved modules.

The list must describe contexts/embodiments, not separate Maturion instances.

### 4.3 Invocation authority

Replace the contradictory `can_invoke: none` entry with bounded authority equivalent to:

```yaml
can_invoke:
  - approved specialists registered through governed AIMC/Maturion routing
  - approved reviewers, parsers, scorers, routers, and advisors within declared task scope
```

Add explicit constraints:

- may invoke only approved and registered capabilities;
- may not invent, self-register, activate, or modify specialists;
- must package a bounded task with app, user, tenant, role, entity, source, output, confidence, and escalation context;
- must review specialist output before returning a final user answer;
- must disclose planned, stubbed, unavailable, or degraded specialist status truthfully.

### 4.4 Intent classification pointers

The thin core must point to Tier 2 rules that distinguish:

- knowledge questions;
- functionality/navigation questions;
- task/workflow questions;
- build/governance questions;
- risk/security/incident/control questions;
- evidence/maturity/scoring/descriptor/criteria questions;
- marketing/opportunity triggers.

Detailed classification rules remain in Tier 2.

### 4.5 Runtime versus CS2 boundary

Add a concise prohibition stating:

- runtime Maturion has no automatic CS2, merge, builder, deployment, governance-amendment, or production-write authority;
- Builder/AMC Maturion-as-CS2 capability is separately staged and activated only through explicit CS2 delegation;
- app context may alter available workflows but may not silently expand constitutional authority.

### 4.6 AIMC dependency pointers

Add thin pointers to future Tier 2 files for:

- AIMC dependency map;
- approved knowledge-source registry;
- specialist registry and routing;
- memory and learning rules;
- response review;
- graceful degradation;
- app/user/tenant/industry calibration;
- marketing opportunity triggers.

### 4.7 Living references

The corrected contract should point to the target Maturion Tier 2 bundle without embedding its contents:

- `index.md`
- `ecosystem-map.md`
- `app-context-map.md`
- `knowledge-plane-routing.md`
- `specialist-invocation-protocol.md`
- `specialist-registry.md`
- `domain-flag-index.md`
- `routing-rules.md`
- `response-review-checklist.md`
- `graceful-degradation-rules.md`
- `user-context-and-industry-calibration.md`
- `evidence-evaluation-routing.md`
- `marketing-opportunity-triggers.md`
- `memory-and-learning-rules.md`
- `aimc-dependency-map.md`

Missing files must remain explicitly unavailable until Wave 4 creates them. Contract pointers must not falsely imply runtime readiness.

---

## 5. CodexAdvisor fitness assessment

### 5.1 Positive controls already present

CodexAdvisor currently has:

- sole conditional authority to create or modify `.github/agents/*.md` under CS2 approval;
- explicit no-build and no-self-approval controls;
- mandatory prehandover proof, session memory, merge-gate parity, and IAA oversight;
- support for target-agent Tier 2 paths;
- a specialist checklist mapping in its Tier 2 checklist registry;
- protected-path and self-modification controls.

### 5.2 Fitness gaps

The current CodexAdvisor contract lists supported classes as:

- overseer;
- supervisor;
- administrator;
- assurance;
- builder.

It does not list:

- orchestrator;
- specialist;
- reviewer;
- parser;
- scorer;
- router;
- advisor.

The Tier 2 index also reports an older CodexAdvisor contract version (index: 2.1.0 vs contract: 4.1.0) and does not reference the Wave 2 runtime-specialist bundle process artifact.

The current non-negotiables checklist hard-codes `four_phase_canonical` as the required contract pattern, while the current Maturion contract declares `thin_core_living`. This must be reconciled before CodexAdvisor can safely certify the proposed Maturion contract change.

### 5.3 Binary disposition

**CodexAdvisor fitness: NOT FIT FOR WAVE 3 PROTECTED EXECUTION YET.**

CodexAdvisor is the correct owner, but its current contract/Tier 2 operating scope is not sufficiently aligned to orchestrator and runtime-specialist bundle work.

### 5.4 Required prerequisite remediation

Before CodexAdvisor changes the Maturion contract, CS2 must authorise a separate CodexAdvisor self-modification/layer-down package limited to:

1. adding `orchestrator` and `specialist` to supported agent classes;
2. adding any other runtime capability classes required by the approved strategy only if explicitly named by CS2;
3. adding the Wave 2 runtime-specialist bundle process artifact as a mandatory Tier 2 method reference;
4. updating the CodexAdvisor Tier 2 index version references;
5. reconciling `thin_core_living` versus `four_phase_canonical` for orchestrator contracts without weakening the four-phase governance obligations;
6. adding an explicit runtime-specialist bundle checklist load step;
7. preserving SELF-MOD-001, final IAA, merge-gate parity, and all existing protected-file controls.

This prerequisite is itself a CodexAdvisor self-contract change and therefore requires explicit CS2 self-modification authority plus independent IAA review.

---

## 6. Required CS2 decision sequence

### Decision 1 — Approve this Wave 3 proposal

Approval confirms the target correction specification but does not authorise protected-file writes.

### Decision 2 — Authorise CodexAdvisor prerequisite self-modification

A separate exact issue must name:

- `.github/agents/CodexAdvisor-agent.md`;
- affected `.agent-workspace/CodexAdvisor-agent/knowledge/*` files;
- exact permitted changes;
- explicit SELF-MOD-001 override for this bounded job;
- mandatory IAA review.

### Decision 3 — Authorise Maturion contract correction

Only after CodexAdvisor is fit may CS2 authorise a second exact layer-down issue for:

- `.github/agents/maturion-agent.md`;
- the approved thin-core diff specification;
- no Tier 2 expansion unless Wave 4 is separately authorised.

### Decision 4 — Proceed to Wave 4

Wave 4 may then expand Maturion Tier 2 through CodexAdvisor under separate authority and QA-to-red controls.

---

## 7. QA-to-red preservation

The following Wave 2 tests remain binding and unchanged:

- `MATURION-RED-MMM-001` — correct five APGI roadmap domains;
- `MATURION-RED-MMM-002` — specialist availability transparency;
- `MATURION-RED-MMM-003` — approved knowledge source retrieval;
- `MATURION-RED-MMM-004` — stale six-domain answer blocked;
- `MATURION-RED-MMM-005` — Maturion review before final answer.

The proposed contract correction does not by itself turn these tests green. Runtime implementation remains unauthorised.

---

## 8. Completion criteria

Wave 3 proposal work is complete when:

- this artifact is reviewed by CS2;
- CodexAdvisor fitness is accepted as `NOT FIT` pending exact remediation;
- the Maturion contract correction is approved, amended, or rejected at specification level;
- no protected agent contract or Tier 2 file was modified;
- the next layer-down issue is explicitly chosen by CS2.

**Wave 3 status:** PROPOSAL PREPARED / CODEXADVISOR PREREQUISITE IDENTIFIED / PROTECTED EXECUTION NOT YET AUTHORISED
