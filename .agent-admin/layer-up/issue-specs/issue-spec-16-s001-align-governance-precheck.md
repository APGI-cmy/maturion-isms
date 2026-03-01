# Issue Spec: [Layer-Up] S-001 — align-governance.sh learning-retention pre-flight check

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: MEDIUM  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 6.1 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)  
**FAIL-ONLY-ONCE Ref**: S-001, GV-001-20260221

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7)  
GV-001-20260221 (Silent Removal of Recorded Learnings) incident proved that automated sync can silently delete validated learnings from consumer repos.

## Evidence

- **Incident**: GV-001-20260221 — PR #370 replaced local v1.4 of `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` with canonical v1.3, silently removing MAT Waves 5.5–5.7 learnings
- **Root cause**: `align-governance.sh` performs one-way layer-down without diff analysis for locally-added sections
- **Current state**: S-001 is OPEN in ISMS-local FAIL-ONLY-ONCE v1.8.0
- **File**: `.github/scripts/align-governance.sh` in APGI-cmy/maturion-isms

## Current Governance State

`align-governance.sh` performs a one-way layer-down sync without checking whether the local version has sections that are not present in canonical. Locally-added learnings (not yet upstreamed) are silently deleted on sync.

## Observed Gap/Conflict/Failure

GV-001 proved that 3 sections of validated MAT module learnings were silently deleted by automated sync. The Learning Retention Doctrine (A-006) prohibits this, but there is no machine enforcement — it relies entirely on agent/human awareness.

## Proposed Governance Improvement

Update canonical `align-governance.sh` (or equivalent governance sync script) with a pre-flight check:
1. Before syncing a file, compare section count of local vs. canonical version
2. If local has MORE sections than canonical: emit BLOCKER warning listing the additional sections
3. BLOCKER warning must be resolved (either: sections were intentionally local-only and should be cleared; OR sections need to be upstreamed first via layer-up)
4. Document the pre-flight check in `CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md`

**Breaking change**: NO — adds warning/blocker to existing sync script; does not break sync when no additional local sections exist.

## Impact Assessment

- **Scope**: All consumer repositories using `align-governance.sh` for governance sync
- **Urgency**: MEDIUM — every governance sync risks destroying locally-added learnings
- **Ripple required**: YES — script update needs to propagate to all consumer repos
- **Conflict signal**: NONE — adds safety check to existing mechanism

---

Reference: APGI-cmy/maturion-isms#707
