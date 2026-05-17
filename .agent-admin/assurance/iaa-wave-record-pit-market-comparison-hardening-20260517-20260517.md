# IAA Wave Record — pit-market-comparison-hardening-20260517

**Wave**: pit-market-comparison-hardening-20260517  
**Date**: 2026-05-17  
**Branch**: copilot/harden-pit-market-comparison  
**Issue**: (number unavailable in provided context)  
**Foreman request**: Harden PIT market-comparison feature inventory and product-level differentiators  
**Mode**: PRE-BRIEF (PHASE 0 only)

---

## PRE-BRIEF

Qualifying tasks: [Harden PIT market-comparison feature inventory; harden PIT product-level differentiators; prepare governance evidence package for subsequent full IAA assurance invocation.]

Applicable overlay: [PRE_BUILD_STAGE_MODEL (primary) with PRE_BUILD_GATES (OVL-PBG-001 through OVL-PBG-017); AMBIGUITY RULE ACTIVE — category upgrades to MIXED/PRODUCT_BUILD_ASSURANCE if runtime/build scope enters diff.]

Anti-regression obligations: [NO — FUNCTIONAL-BEHAVIOUR-REGISTRY.md (NBR-001..NBR-005) applies to BUILD/behavioural code-path risk patterns; current declared scope is governance/content hardening only.]

### Trigger categories (declared)
- Primary: `PRE_BUILD_STAGE_MODEL`
- Conditional upgrade: `MIXED` (if triggering artifacts co-exist) or `PRODUCT_BUILD_ASSURANCE` (if functional/runtime implementation scope appears)
- Ambiguity status: `MANDATORY IAA` (A-003)

### FFA checks (declared)
- FFA-01..FFA-06: **NOT APPLICABLE** at pre-brief classification under declared governance-only hardening scope
- If scope expands to product-facing runtime/code delivery: FFA checks become **MANDATORY**

### PREHANDOVER structure required before full IAA invocation
1. Session metadata: wave, branch, issue/PR references
2. Scope declaration reference with files-changed parity statement
3. Trigger classification evidence and overlay rationale
4. PIT market-comparison hardening evidence (feature inventory + differentiator traceability)
5. Stage-readiness declaration (pre-build posture and no gate leakage)
6. `iaa_audit_token` expected-reference format (A-029; not legacy `PENDING` token string in PREHANDOVER proof)
7. Ceremony-admin state declaration and ECAP references if appointed

### Scope blockers
1. `wave-current-tasks.md` has no active entry for wave `pit-market-comparison-hardening-20260517`
2. `ceremony_admin_appointed` is not declared for this wave (current active wave in tracker is unrelated)
3. No committed PREHANDOVER proof path is provided yet for this wave
4. No committed per-PR/per-wave scope declaration path is provided yet
5. PR number is unavailable in provided context (traceability gap for full-assurance invocation)

### Ceremony admin appointment check
- `wave-current-tasks.md` active wave entry is `mmm-phase6-post-merge-assurance-20260513` with `ceremony_admin_appointed: NONE`
- For this wave (`pit-market-comparison-hardening-20260517`): **NOT YET DECLARED**

---

## TOKEN

Status: PENDING — to be populated only after Phase 2–4 full assurance.

PHASE_B_BLOCKING_TOKEN: [pending-iaa-full-assurance]

---

## REJECTION_HISTORY

No rejections issued at PRE-BRIEF stage.
