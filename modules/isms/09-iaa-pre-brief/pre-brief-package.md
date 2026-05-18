# IAA Pre-Brief Package — ISMS Public Landing Harvest

**Stage**: 9 (IAA Pre-Brief)
**Wave**: isms-public-landing-harvest-20260514
**Issue**: #1645
**PR**: #1646
**Authority**: foreman-v2-agent contract v6.2.0 Phase 1 Step 1.8 and Phase 2 Step 2.7
**Version**: v1.0.0

---

## 1. Pre-Brief Summary

**Wave**: ISMS Public Landing Harvest
**Branch**: copilot/harvest-legacy-isms-pages
**PR**: #1646
**Trigger issue**: #1645 — Harvest legacy ISMS pre-subscription landing and module marketing pages
**Opened by**: CS2 (APGI-cmy) — valid CS2 authorization
**Builder**: ui-builder
**Expected delivery**: isms-portal public landing + 7 module marketing pages

---

## 2. Trigger Categories

| Category | Present | Details |
|---|---|---|
| App delivery (UI harvest) | YES | React pages harvested from maturion-maturity-legacy into isms-portal |
| Governance documentation | YES | ISMS app description update + pre-build package |
| Protected path changes | NO | No governance/canon/agent-contract changes |
| CI/workflow changes | NO | No .github/workflows/ changes |
| Agent contract changes | NO | No .github/agents/ changes |
| Database migrations | NO | No Supabase migrations |
| ECAP required | NO | No protected paths |

---

## 3. FFA (First-Failure Analysis) Pre-Checks

| Check | Status | Notes |
|---|---|---|
| CS2 wave-start authorization | VALID | Issue #1645 opened by APGI-cmy directly, assigns Copilot |
| CANON_INVENTORY verified | PASS | Checked at Phase 1 Step 1.3 |
| FAIL-ONLY-ONCE registry | CLEAR | No open/in-progress incidents |
| Session memory unresolved items | NONE | Last 5 sessions clean |
| Architecture frozen (PBFAG) | YES | modules/isms/06-pbfag/pbfag.md: CONFIRMED |
| Red QA suite defined | YES | modules/isms/05-qa-to-red/qa-to-red-plan.md: QA-R-001 through QA-R-033 |
| Implementation plan | YES | modules/isms/07-implementation-plan/ + prebuild-harvest-package/ |
| Builder checklist | YES | modules/isms/08-builder-checklist/builder-checklist.md |
| Scope declaration | YES | .agent-admin/scope-declarations/pr-1646.md |
| PR manifest | YES | .admin/prs/pr-1646.json |

---

## 4. Pre-Brief Pre-Build Package Reference

| Artifact | Path |
|---|---|
| Harvest map | `modules/isms/prebuild-harvest-package/harvest-map.md` |
| Route boundary map | `modules/isms/prebuild-harvest-package/route-boundary-map.md` |
| Module-card inventory | `modules/isms/prebuild-harvest-package/module-card-inventory.md` |
| UX journey contract | `modules/isms/prebuild-harvest-package/ux-journey-contract.md` |
| Implementation map | `modules/isms/prebuild-harvest-package/implementation-map.md` |
| Accessibility requirements | `modules/isms/prebuild-harvest-package/accessibility-requirements.md` |
| Verification plan | `modules/isms/prebuild-harvest-package/verification-plan.md` |
| Admin/IAA/ECAP requirements | `modules/isms/prebuild-harvest-package/admin-requirements.md` |
| Handover checklist | `modules/isms/prebuild-harvest-package/handover-checklist.md` |
| QA-to-Red plan | `modules/isms/05-qa-to-red/qa-to-red-plan.md` |
| PBFAG | `modules/isms/06-pbfag/pbfag.md` |
| Builder checklist | `modules/isms/08-builder-checklist/builder-checklist.md` |

---

## 5. Evidence Required at Handover

IAA final assurance will check the following evidence:

| Evidence Item | Required |
|---|---|
| All 13 V-* verification items from verification-plan.md: YES | YES |
| Screenshots SS-1 through SS-10 attached | YES |
| Build passes: zero errors | YES |
| TypeScript passes: zero errors | YES |
| Zero ProtectedRoute on marketing pages (code review) | YES |
| ISMS app description §16 update confirmed | YES |
| Pre-build package complete (all 9 artifacts) | YES |
| Route boundary map alignment with implementation | YES |
| Module card canonical names confirmed | YES |
| IAA wave record pre-brief section populated | YES |

---

## 6. Qualifying Tasks for IAA Assurance

Per Foreman contract Phase 2 Step 2.7, the following tasks are flagged for IAA qualification:

| Task | IAA Assurance Type |
|---|---|
| Public route accessibility (no ProtectedRoute on marketing pages) | Code review + live verification |
| ISMS app description update (§16 present and correct) | Document review |
| Pre-build package completeness (all 9 artifacts) | Document review |
| Build and TypeScript pass | Evidence review |
| Screenshot evidence completeness | Screenshot review |

---

## 7. IAA Wave Record Path

IAA must commit its wave record to:
```
.agent-admin/assurance/iaa-wave-record-isms-public-landing-harvest-20260514.md
```

The wave record must include:
- `## PRE-BRIEF` section populated before builder delegation
- `## TOKEN` section populated after final assurance with `PHASE_B_BLOCKING_TOKEN` field

---

## 8. PREHANDOVER Proof Path

At Phase 4, the PREHANDOVER proof will be generated at:
```
.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-isms-public-landing-harvest-20260514.md
```

The accepted copy will be committed to:
```
.agent-workspace/foreman-v2/memory/PREHANDOVER-session-isms-public-landing-harvest-20260514.md
```

---

**IAA Pre-Brief Request**:

```
@independent-assurance-agent [IAA PRE-BRIEF REQUEST]
Wave: isms-public-landing-harvest | Branch: copilot/harvest-legacy-isms-pages | Issue: #1645 — Harvest legacy ISMS pre-subscription landing and module marketing pages
PR: #1646
Request: Declare trigger categories, FFA checks, PREHANDOVER structure, scope blockers.
Pre-build package: modules/isms/prebuild-harvest-package/
Scope declaration: .agent-admin/scope-declarations/pr-1646.md
Wave record path: .agent-admin/assurance/iaa-wave-record-isms-public-landing-harvest-20260514.md
```

---

**Authority**: foreman-v2-agent | Wave: isms-public-landing-harvest-20260514
