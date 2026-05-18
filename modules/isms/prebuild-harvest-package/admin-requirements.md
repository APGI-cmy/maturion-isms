# Admin/IAA/ECAP Requirements Declaration — ISMS Public Landing Harvest

**Wave**: isms-public-landing-harvest-20260514
**Issue**: #1645
**PR**: #1646
**Authority**: foreman-v2-agent contract v6.2.0; CANON_INVENTORY.json
**Version**: v1.0.0

---

## 1. Wave Classification

| Field | Value |
|---|---|
| Wave type | App delivery (UI harvest) |
| Protected paths touched | None — no governance/canon/agent-contract changes |
| CI workflow changes | No |
| Agent contract changes | No |
| Governance canon changes | No |
| ISMS app description update | YES — non-protected governance planning doc |
| App code changes | YES — apps/isms-portal/src/ |

---

## 2. Required Governance Ceremonies

### 2.1 IAA Pre-Brief (MANDATORY)

| Item | Status |
|---|---|
| IAA pre-brief required | YES — all waves require IAA pre-brief per Foreman contract Phase 1 Step 1.8 |
| Pre-brief artifact path | `.agent-admin/assurance/iaa-wave-record-isms-public-landing-harvest-20260514.md` |
| Wave record status | PENDING — IAA invocation in progress |
| Pre-brief completing agent | independent-assurance-agent |

### 2.2 IAA Final Assurance (MANDATORY — blocking)

| Item | Status |
|---|---|
| IAA final assurance required | YES — all wave handovers require IAA per Foreman contract Phase 4 Step 4.3b |
| Expected verdict | ASSURANCE-TOKEN (PASS) after QP pass and ECAP bundle |
| Token location | `iaa-wave-record-isms-public-landing-harvest-20260514.md` `## TOKEN` section |

### 2.3 ECAP Admin Ceremony

| Item | Value |
|---|---|
| ECAP required | Conditional — required if protected paths are in scope |
| Protected paths in scope | NONE in this wave (no governance/canon/agent-contract changes) |
| ECAP triggered | NO — app delivery wave; no protected paths |
| Note | If ISMS app description update triggers ECAP gate → escalate to CS2 for clarification |

**Assessment**: `modules/isms/00-app-description/ISMS_app_description.md` is a module planning document, NOT a `governance/canon/` or `.github/agents/` protected path. ECAP is NOT triggered.

### 2.4 PR Admin Manifest

| Item | Status |
|---|---|
| PR manifest required | YES — per validate-simple-pr-admin pattern |
| Manifest path | `.admin/prs/pr-1646.json` |
| Status | CREATED |

### 2.5 Per-PR Scope Declaration

| Item | Status |
|---|---|
| Scope declaration required | YES — per scope-declaration-parity gate |
| Declaration path | `.agent-admin/scope-declarations/pr-1646.md` |
| Status | CREATED |
| FILES_CHANGED declared | YES (40 files) |

---

## 3. POLC Boundary Compliance

### 3.1 NO-IMPLEMENT-001 Compliance

Foreman does NOT write production code in this wave. All React/TypeScript app code is delegated to `ui-builder`.

Foreman creates ONLY:
- Governance/planning documentation (harvest-map.md, route-boundary-map.md, etc.)
- Admin/scope files
- Stage documents (QA-to-Red, PBFAG, Builder Checklist, IAA pre-brief package)

### 3.2 Builder appointment authority

| Builder | Task | Authority |
|---|---|---|
| `ui-builder` | React UI harvest — all `apps/isms-portal/src/` files | Foreman Phase 3 delegation |

### 3.3 Separation of duties

| Role | Responsibility |
|---|---|
| foreman-v2-agent | Governance artifacts, QP evaluation, ECAP appointment, IAA invocation |
| ui-builder | All React/TypeScript code in apps/isms-portal/ |
| independent-assurance-agent | Pre-brief and final assurance |
| execution-ceremony-admin-agent | PREHANDOVER proof and session memory (if ECAP triggered) |

---

## 4. Merge Gate Compliance Plan

| Gate | Expected State | Notes |
|---|---|---|
| `preflight/phase-1-evidence` | GREEN | Phase 1 evidence in PR admin + scope declaration |
| `preflight/iaa-prebrief-existence` | GREEN | IAA wave record at declared path |
| `preflight/iaa-token-self-certification` | GREEN | IAA token written by IAA only (not self-certified) |
| `preflight/hfmc-ripple-presence` | GREEN | Ripple assessment section in proof (if ECAP triggered) |
| `preflight/evidence-exactness` | GREEN | FILES_CHANGED declared in scope declaration |
| `preflight/iaa-final-assurance` | GREEN | IAA PASS token in wave record |
| `preflight/ecap-admin-ceremony` | GREEN | ECAP not required for this wave (no protected paths) |
| `preflight/scope-declaration-parity` | GREEN | Scope declaration matches diff |
| `preflight/mmm-pr-admin` | GREEN | PR manifest at `.admin/prs/pr-1646.json` |
| `merge-gate/verdict` | GREEN | All above GREEN |
| `governance/alignment` | GREEN | No canon drift |
| `stop-and-fix/enforcement` | GREEN | No active stop-and-fix orders |
| `foreman-implementation-check` | GREEN | Foreman has NOT written code |
| `builder-involvement-check` | GREEN | ui-builder delegated |
| `session-memory-check` | GREEN | Session memory filed at handover |

---

## 5. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Legacy hooks (useAuth, useSubscriptionModules) not available in isms-portal | MEDIUM | HIGH | Create minimal stubs for hooks |
| Tailwind/shadcn/ui not configured in isms-portal | HIGH | HIGH | ui-builder to configure per legacy pattern |
| Route protection gate test failures | LOW | MEDIUM | Route boundary map explicitly documents correct pattern |
| ECAP gate triggered by app description update | LOW | LOW | App description is not a protected path |
| Subscribe.tsx uses Supabase/real backend | MEDIUM | MEDIUM | Use stub implementation; note backend integration as deferred |

---

**Authority**: foreman-v2-agent | Wave: isms-public-landing-harvest-20260514
