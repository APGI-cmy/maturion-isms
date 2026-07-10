# Wave 1 Maturion Current-State Audit

**Status:** Wave 1 audit artifact  
**Date:** 2026-07-01  
**Authority:** CS2 / Johan Ras  
**Scope:** Audit only — no agent contract, Tier 2, canon, runtime, AIMC schema, Supabase, Vercel, or deployment changes  
**Strategy authority:** `Maturion/strategy/Maturion_ecosystem_orchestrator_and_agent_file_system_strategy.md`

---

## 1. Purpose

This audit records the current state of Maturion's agent/orchestrator readiness after Wave 0 strategy adoption.

The triggering production symptom was observed in the ISMS/Maturion user interface:

- Maturion incorrectly answered the APGI roadmap domains as generic domains: Governance, Risk Management, Compliance, Performance Management, Capability Development.
- Maturion failed to identify or access a roadmap specialist agent when asked whether it could consult one.

The correct APGI Maturity Roadmap primary domains are:

1. Leadership and Governance
2. Process Integrity
3. People and Culture
4. Protection
5. Proof It Works

The symptom shows that the runtime Maturion surface is not yet connected to governed roadmap knowledge, the Maturion specialist registry, or a functioning specialist invocation path.

---

## 2. Audit boundaries

This wave inspects and reports only.

Wave 1 may inspect:

- `.github/agents/*`
- `.agent-workspace/maturion-agent/knowledge/*`
- `.agent-workspace/CodexAdvisor-agent/knowledge/*`
- relevant Maturion strategy files
- relevant governance canon/checklist files
- existing runtime advisor files
- existing Maturity Roadmap knowledge files

Wave 1 may create this audit artifact and a PR for CS2 review.

Wave 1 may not:

- edit `.github/agents/*` agent contracts;
- edit `.agent-workspace/<agent>/knowledge/*` Tier 2 files;
- edit governance canon;
- edit runtime code;
- edit AIMC schema or runtime registry;
- edit Supabase functions/tables;
- edit Vercel/deployment workflows;
- activate specialists;
- claim runtime Maturion functionality is fixed.

---

## 3. Sources inspected

### 3.1 Maturion contract

- `.github/agents/maturion-agent.md`

### 3.2 Maturion Tier 2 operational files

- `.agent-workspace/maturion-agent/knowledge/constitutional-bindings.md`
- `.agent-workspace/maturion-agent/knowledge/specialist-registry.md`
- `.agent-workspace/maturion-agent/knowledge/domain-flag-index.md`
- `.agent-workspace/maturion-agent/knowledge/routing-rules.md`

### 3.3 CodexAdvisor contract and Tier 2 checklist

- `.github/agents/CodexAdvisor-agent.md`
- `.agent-workspace/CodexAdvisor-agent/knowledge/agent-file-non-negotiables-checklist.md`

### 3.4 Governance canon references

- `governance/canon/AGENT_CREATION_BUNDLE_REQUIREMENTS.md`
- `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

### 3.5 Roadmap knowledge and runtime advisor evidence

- `Maturion/Maturity Roadmap/Maturity_Roadmap_Comprehensive.md`
- `packages/ai-centre/src/agents/maturion-advisor.md`

---

## 4. Key findings

### Finding 1 — Maturion contract is materially stale against the newly adopted ecosystem strategy

The current contract describes Maturion as a unified intelligence across MAT, PIT, XDETECT, Maturity Roadmap, Builder, and Command.

It does not yet reflect the full adopted ecosystem scope:

- APGI public website;
- ISMS portal shell;
- MMM / Maturity Roadmap;
- PIT;
- Risk Management;
- Incident Management;
- RADAM;
- Training platform;
- AMC / App Management Centre;
- Marketing and future modules.

The contract also lists `can_invoke: none`, while simultaneously describing Maturion as an orchestrator that coordinates specialist agents. This is a strategic contradiction and must be corrected by a later CodexAdvisor-governed agent-file-system wave.

**Impact:** Maturion can plausibly respond as though no specialist invocation exists, matching the user's screenshot.

**Disposition:** BLOCKER for runtime specialist orchestration readiness. Do not patch in this audit wave.

---

### Finding 2 — Maturion Tier 2 files exist, but are historical MAT/PIT-era files, not the adopted ecosystem operating model

The existing Tier 2 files are real and useful, but they predate the Wave 0 ecosystem strategy.

Observed files:

- constitutional bindings;
- specialist registry;
- domain flag index;
- routing rules.

Missing target Tier 2 files from the adopted strategy include:

- `ecosystem-map.md`
- `app-context-map.md`
- `knowledge-plane-routing.md`
- `specialist-invocation-protocol.md`
- `response-review-checklist.md`
- `marketing-opportunity-triggers.md`
- `user-context-and-industry-calibration.md`
- `graceful-degradation-rules.md`

**Impact:** Maturion does not yet have an operational Tier 2 basis to perform the eight-step ecosystem decision loop adopted in Wave 0.

**Disposition:** REQUIRED Wave 4 target, after CodexAdvisor process review and CS2 approval.

---

### Finding 3 — Specialist registry has only historical MAT stubs plus PIT active; no active Maturity Roadmap specialist exists

The specialist registry records:

- 6 MAT specialist stubs;
- 1 PIT specialist active;
- `maturity-roadmap-specialist` as future/planned.

The Maturity Roadmap specialist is not active and does not appear to have a full contract/Tier 2/registry/routing/pre-handover bundle.

**Impact:** When a user asks Maturion whether it can consult a roadmap specialist, the correct current state is that no active roadmap specialist is available. The UI answer should not say this generically; it should explain the governed status and offer a best-effort answer from approved roadmap strategy knowledge.

**Disposition:** REQUIRED specialist creation/activation candidate. Must be handled by CodexAdvisor under CS2 approval, not by Foreman/builders/general agents.

---

### Finding 4 — Existing routing rules do not cover the adopted ecosystem decision loop

Routing currently focuses on MAT, PIT, XDETECT, Maturity Roadmap, Builder, and Command.

It does not yet encode the adopted decision loop:

- knowledge question;
- functionality/navigation question;
- task/workflow question;
- build/governance question;
- risk/security/incident/control question;
- evidence/maturity/scoring/descriptor/criteria question;
- marketing/opportunity trigger.

It also does not cover APW, ISMS shell, Training, AMC, Risk, Incident, RADAM, or Marketing as first-class ecosystem contexts.

**Impact:** Maturion cannot reliably decide whether to answer, route, retrieve knowledge, invoke a specialist, ask for evidence, or trigger a marketing pathway.

**Disposition:** REQUIRED Maturion Tier 2 routing update in a later CodexAdvisor-authorised wave.

---

### Finding 5 — Roadmap knowledge exists, but is not connected to the active runtime answer path

The correct five roadmap domains are present in `Maturion/Maturity Roadmap/Maturity_Roadmap_Comprehensive.md`.

However, the UI answer produced incorrect generic domains, which indicates one or more of the following runtime gaps:

- active runtime Maturion is not retrieving this roadmap knowledge;
- active runtime Maturion is using a stale prompt or public-safe generic advisor file;
- active runtime Maturion has no AIMC/knowledge retrieval adapter;
- active runtime Maturion has no specialist invocation path;
- active runtime Maturion has no response-review check against known roadmap canon.

**Impact:** Knowledge authority exists in repository, but it is not available to the runtime Maturion answer surface.

**Disposition:** REQUIRED AIMC/runtime adapter design and QA-to-red before implementation.

---

### Finding 6 — Runtime advisor file conflicts with the adopted five-domain roadmap

`packages/ai-centre/src/agents/maturion-advisor.md` describes a six-domain framework and includes `Enablement` as a sixth domain.

The adopted/current APGI Maturity Roadmap source describes five primary domains:

1. Leadership and Governance;
2. Process Integrity;
3. People and Culture;
4. Protection;
5. Proof It Works.

**Impact:** If runtime Maturion uses the `maturion-advisor.md` file, it can produce domain answers inconsistent with the current roadmap.

**Disposition:** HIGH priority for Wave 1 follow-up issue. Do not edit in this audit wave.

---

### Finding 7 — Agent creation canon requires complete bundles; `governance/AGENT_REGISTRY.json` exists but appears empty

The agent creation canon requires all new agents to have:

1. agent contract file;
2. Tier 2 knowledge stubs;
3. global agent registry entry;
4. routing update;
5. pre-handover proof.

The repository does contain `governance/AGENT_REGISTRY.json`, but it currently reports an empty registry (`"total_agents": 0`, `"agents": []`).

**Impact:** Specialist activation may be blocked or inconsistent if the global registry is empty, stale, or not wired into the runtime layer-down path.

**Disposition:** REQUIRED follow-up verification by CodexAdvisor or governance audit wave.

---

### Finding 8 — CodexAdvisor is already framed as the correct agent-file-system owner, but its process must be updated for runtime specialist bundles

CodexAdvisor is defined as the agent factory overseer and is the only agent authorised to create or modify `.github/agents/*.md` files.

CodexAdvisor already has non-negotiable checklist coverage for agent file compliance, but the new strategy requires runtime-specialist bundle handling across:

- Maturion ecosystem orchestrator contract updates;
- app/domain specialist contract creation;
- Tier 2 operational knowledge creation;
- AIMC runtime registry dependency;
- specialist invocation and response-review routing;
- marketing opportunity triggers;
- user/industry calibration;
- app-context mapping.

**Impact:** CodexAdvisor is the right owner, but needs a scoped Wave 2 process upgrade before changing Maturion or specialist files.

**Disposition:** Wave 2 candidate.

---

## 5. Immediate explanation of the screenshot defect

The screenshot defect is explainable from the audit:

1. The correct roadmap domains exist in repository knowledge.
2. Maturion's active runtime response did not retrieve that knowledge.
3. The roadmap specialist is not active in the current specialist registry.
4. Routing rules and specialist registry are still MAT/PIT-era and do not reflect the adopted ecosystem model.
5. A stale runtime advisor file exists that describes a six-domain model, conflicting with the current five-domain roadmap.

Therefore, the screenshot should be treated as valid production evidence that Maturion is not yet connected to the required governed knowledge/specialist architecture.

---

## 6. Risk rating

| Risk | Severity | Notes |
|---|---:|---|
| Wrong roadmap answers | High | User-facing misinformation on core APGI model |
| No active roadmap specialist | High | Maturion cannot delegate the task it should delegate |
| Stale six-domain advisor prompt | High | Conflicts with current five-domain roadmap |
| Missing ecosystem routing files | High | Blocks adopted decision loop |
| Agent registry uncertainty | Medium/High | May block specialist activation |
| General agents modifying agent files | High | Controlled by Wave 0 boundaries; must remain prohibited |

---

## 7. Recommended next steps

### Step A — Open a Wave 1 closure / Wave 2 preparation issue

Purpose:

- record this audit;
- identify required CodexAdvisor work;
- preserve boundaries before any agent-file changes.

### Step B — Authorise CodexAdvisor Wave 2 only after CS2 approval

Wave 2 should upgrade the CodexAdvisor process for runtime-specialist bundles, not yet update Maturion itself.

### Step C — Prepare a CodexAdvisor-scoped Maturion bundle repair plan

The plan should cover:

- Maturion contract correction proposal;
- Maturion Tier 2 target files;
- specialist registry repair;
- roadmap specialist bundle creation;
- runtime advisor stale six-domain conflict;
- AIMC runtime registry dependency;
- QA-to-red for the screenshot defect.

### Step D — Do not implement runtime code yet

Runtime code must wait until:

- Maturion contract/Tier 2 alignment is approved;
- specialist registry model is approved;
- AIMC adapter model is defined;
- QA-to-red exists.

---

## 8. Recommended Wave 2 scope

**Wave 2 name:** CodexAdvisor Runtime Specialist Bundle Process Upgrade

**Scope:** CodexAdvisor process / audit only unless CS2 explicitly authorises modifications.

Expected outputs:

- CodexAdvisor process gap analysis;
- runtime specialist bundle checklist;
- Maturion contract correction proposal;
- target Tier 2 file creation plan;
- roadmap specialist creation plan;
- registry/routing repair plan;
- AIMC runtime registry dependency map;
- QA-to-red for Maturion roadmap-domain answer.

No active agent-file changes should be made until CS2 authorises a specific CodexAdvisor implementation wave.

---

## 9. Wave 1 closure status

Wave 1 audit objective is satisfied by this artifact.

This artifact does not repair the defect. It explains it, records current state, and identifies the required governed path forward.

**Wave 1 Status:** AUDIT COMPLETE / IMPLEMENTATION NOT AUTHORISED
