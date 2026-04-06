# MMM Legacy Capabilities — Recommendations

**Author**: governance-liaison-isms-agent  
**Wave**: pre-mmm-build-readiness  
**Branch**: copilot/pre-mmm-build-readiness-orchestration  
**Date**: 2026-04-06  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Status**: RECOMMENDATION ONLY — No moves performed in this wave. Actual execution requires CS2 authorization.

---

## 1. What Is in `modules/MMM/02-architecture/capabilities/`

The `capabilities/` directory contains 79 legacy architecture files organized across 5 subdirectories.
These are **Risk Management module artifacts** from before the MMM identity migration.
They are NOT MMM architecture assets.

### Subdirectory Summary

| Subdirectory | File Count | Nature |
|---|---|---|
| `erm-framework/` | 18 files | ERM (Enterprise Risk Management) framework specs — schemas, wireframes, edge functions, sprint plans, True North, QA plans, global settings |
| `risk-assessment/` | 11 files | Risk assessment module specs — schemas, edge functions, frontend maps, wireframes, True North (v0.1 and v1.1 versions both present) |
| `threat-module/` | 19 files | Threat module specs — schemas, edge functions, frontend maps, sprint plans, wireframes, integration maps, model routing, watchdog logic, implementation guides |
| `vulnerability-module/` | 19 files | Vulnerability module specs — schemas, edge functions, frontend maps, sprint plans, wireframes, integration maps, model routing, watchdog logic, implementation guides |
| `wrac/` | 10 files | WRAC (Workplace Risk Assessment and Control?) specs — schemas, edge functions, frontend maps, sprint plans, wireframes, implementation guides, export specs |

**Total**: 79 files, all named with `RISK_*`, `ERM_*`, `THREAT_*`, `VULNERABILITY_*`, or `WRAC_*` prefixes and versioned with `_v0.1` or `_v1.x` suffixes.

---

## 2. Recommended Treatment

These artifacts belong to the **Risk Management** module, not to MMM. MMM is a new module identity.
The recommended treatment per artifact group:

| Subdirectory | Recommended Treatment | Rationale |
|---|---|---|
| `erm-framework/` | **Archive → `modules/MMM/90-legacy-assets/architecture-legacy/erm-framework/`** | ERM framework is a Risk Management domain concept; not an MMM concept. Preserve for potential future reference if a Risk Management module re-emerges. |
| `risk-assessment/` | **Archive → `modules/MMM/90-legacy-assets/architecture-legacy/risk-assessment/`** | Risk assessment is a Risk Management domain concept; preserve in legacy assets for reference. |
| `threat-module/` | **Archive → `modules/MMM/90-legacy-assets/architecture-legacy/threat-module/`** | Threat module is a Risk Management domain concept; preserve for PIT module reference potential. |
| `vulnerability-module/` | **Archive → `modules/MMM/90-legacy-assets/architecture-legacy/vulnerability-module/`** | Vulnerability module is a Risk Management domain concept; preserve for PIT module reference potential. |
| `wrac/` | **Archive → `modules/MMM/90-legacy-assets/architecture-legacy/wrac/`** | WRAC is a Risk Management domain concept; preserve in legacy assets. |

**Summary Recommendation**: Move all 79 files from `modules/MMM/02-architecture/capabilities/`
to `modules/MMM/90-legacy-assets/architecture-legacy/` to preserve them as reference material
while cleanly separating the MMM architecture namespace for new FRS-driven architecture work.

Do NOT delete these files — they contain substantial specification work that may inform future
module development or provide reference context for the MMM FRS.

---

## 3. Rationale

1. **MMM is a new module identity**: The Maturity Management Module is NOT a renamed Risk Management module. The identity migration was a structural correction, not a content migration. MMM will have its own FRS, TRS, Architecture, and implementation — none of which are yet defined.

2. **Risk Management legacy artifacts are misplaced**: Having `ERM_*`, `RISK_*`, `THREAT_*`, `VULNERABILITY_*`, and `WRAC_*` artifacts in `modules/MMM/02-architecture/` creates an identity contradiction. Any builder appointed to MMM would encounter incorrect architecture context.

3. **`capabilities/` namespace is unregistered**: The canonical architecture location for MMM is `modules/MMM/02-architecture/architecture.md`. The `capabilities/` subdirectory was created by the Risk Management module structure and has no canonical role in MMM's architecture stage.

4. **Preservation over deletion**: All 79 files should be preserved in `90-legacy-assets/architecture-legacy/`. The Risk Management domain work is non-trivial and may re-emerge as a separate module or inform the PIT module (threat/vulnerability), or serve as reference for future ISMS development.

---

## 4. Recommended Action Before FRS Wave

**Before the MMM FRS wave begins**, Foreman should request CS2 authorization to execute:

```
Move: modules/MMM/02-architecture/capabilities/ 
  → modules/MMM/90-legacy-assets/architecture-legacy/capabilities/
```

This move:
- Preserves all 79 files without data loss
- Clears the architecture namespace for legitimate MMM architecture development
- Satisfies OVL-PBG-003 (architecture doc must not reference legacy module names)
- Aligns `modules/MMM/02-architecture/` with the canonical module structure

**⚠️ DO NOT PERFORM THIS MOVE in the current wave.** The actual move requires explicit CS2 authorization.
This document is a RECOMMENDATION ONLY.

---

## 5. Blocking Gate

Per the PRE_BUILD_GATES overlay (OVL-PBG-003): the presence of `modules/MMM/02-architecture/capabilities/`
containing Risk Management artifacts does NOT block the current wave as long as `architecture.md`
itself has been corrected (as done in this wave). The capabilities/ directory is legacy content;
the architecture.md file is the canonical architecture declaration.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Maintained by**: governance-liaison-isms-agent  
**Last Updated**: 2026-04-06
