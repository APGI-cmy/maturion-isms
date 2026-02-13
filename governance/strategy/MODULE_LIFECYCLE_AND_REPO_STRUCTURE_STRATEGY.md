# MODULE LIFECYCLE + REPOSITORY STRUCTURE — STRATEGY (ISMS MONOREPO)
**Strategy ID**: MLSRS-001  
**Status**: Strategy (authoritative once approved)  
**Owner / Authority**: Johan Ras (Human Authority)  
**Applies To**: APGI-cmy/maturion-isms  
**Last Updated**: 2026-02-13  

---

## 0) Strategic Objective

Create a **machine/AI-friendly monorepo structure** for ISMS where:

1. Every module has a deterministic governance lifecycle:
   **App Description → FRS → Architecture → Implementation Plan → Builder Appointment → Execute Build**.
2. Artifacts are easy for agents to locate without tribal knowledge.
3. Governance lineage is enforceable: upstream artifacts are unambiguous, and downstream build work is traceable.
4. Legacy prototypes are preserved and usable for learning/gap analysis, but never accidentally treated as authoritative.

---

## 1) Non-Negotiable Principles

### 1.1 Determinism over convenience
Agents must be able to infer where an artifact belongs from its type alone.

### 1.2 Governance-first lineage
No architecture or implementation is treated as authoritative unless an authoritative App Description exists for that module.

### 1.3 Separation of concerns
- `modules/` contains governance packs per module.
- `governance/` contains cross-cutting policies/standards/templates.
- `apps/` contains runnable code.

### 1.4 Prototype preservation without contamination
Legacy implementations are retained, but **explicitly labeled** as legacy/prototype and linked back to their module governance pack.

---

## 2) Canonical Directory Model (Target State)

### 2.1 Modules (governance packs)
All modules live under:

`modules/<module-slug>/`

**Naming standard**: `<module-slug>` MUST be `kebab-case` (no spaces).

Each module MUST contain these stage folders (even if empty placeholders initially):

- `00-app-description/`
- `01-frs/`
- `02-architecture/`
- `03-implementation-plan/`
- `04-builder-appointment/`
- `05-build-evidence/`
- `module.manifest.json`

### 2.2 Governance (cross-cutting)
Cross-module policies, standards, and templates live under `governance/`.

### 2.3 Apps (implementation)
Runnable code lives under `apps/`.

Legacy or learning-journey builds live under:

`apps/_legacy/<legacy-app-slug>/`

Legacy code MAY be runnable; runnability is a goal, not a guarantee.

---

## 3) Deprecation Plan for `Maturion/`

`Maturion/` is deprecated as a canonical structural root.

Migration rule:
- Any **module** content migrates to `modules/<module-slug>/...`
- Any **cross-cutting doctrine / standards / governance** migrates to `governance/...` or `docs/...`
- Legacy prototype code migrates to `apps/_legacy/...`

During migration:
- Temporary pointer stubs MAY remain in `Maturion/` for link stability, but must clearly state they are deprecated and point to the new canonical location.

---

## 4) Module Execution Workflow (Agent Contract)

For a module build, agents MUST proceed in this order:

1. **App Description** (authoritative intent, scope, users, outputs, constraints)
2. **FRS** (verifiable requirements derived from App Description)
3. **Architecture** (structures and decisions that satisfy the FRS; must include QA strategy)
4. **Implementation Plan** (phased plan + acceptance criteria + evidence plan)
5. **Builder Appointment** (explicit builder agent contract, responsibilities, constraints, deliverables)
6. **Execute Build** (implementation in `apps/` / `packages/` with evidence deposited in `05-build-evidence/`)

Agents MUST NOT skip stages by implementing first.

---

## 5) Gap Analysis Strategy (Legacy → Target)

Where legacy implementations exist:

1. Produce Architecture from App Description/FRS (do not retrofit architecture from legacy).
2. Create `modules/<module-slug>/02-architecture/gap-analysis-vs-legacy.md` containing:
   - Inventory of legacy assets (paths, brief description)
   - Mapping of legacy features to target architecture components
   - Gaps (functional + non-functional + governance)
   - Decision: salvage / hybrid / rebuild
   - Migration steps

This prevents accidental lock-in to early experiments.

---

## 6) Immediate Execution Plan (Current Priorities)

### 6.1 MAT
- Create `modules/mat/` skeleton.
- Place MAT App Description into `modules/mat/00-app-description/app-description.md`.

### 6.2 XDETECT
- Convert existing `Maturion/XDETECT` (single-file App Description) into:
  `modules/xdetect/00-app-description/app-description.md`

### 6.3 Legacy preservation (future step)
- Preserve and re-home `apps/maturion-maturity-legacy` under `apps/_legacy/` and link it from the Maturity Roadmap module pack.

---

## 7) Success Criteria

This strategy is considered successful when:

1. A new agent can locate any module’s App Description, FRS, and Architecture in under 60 seconds.
2. Module lineage is explicit and reviewable: App Description → FRS → Architecture → Implementation Plan → Evidence.
3. Legacy prototypes are preserved, discoverable, and referenced for gap analysis, without being authoritative by accident.

---
