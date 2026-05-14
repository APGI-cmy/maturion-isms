# PBFAG — Pre-Build Frozen Architecture Gate
## ISMS Public Landing Harvest

**Stage**: 6 (PBFAG)
**Wave**: isms-public-landing-harvest-20260514
**Issue**: #1645
**PR**: #1646
**Authority**: foreman-v2-agent contract v6.2.0 Phase 2 Step 2.5a
**Version**: v1.0.0

---

## 1. PBFAG Purpose

The Pre-Build Frozen Architecture Gate (PBFAG) certifies that the architecture is stable and forms a reliable foundation for the builder to implement against. No architecture changes are permitted after this gate is signed.

---

## 2. Architecture Reference Documents

| Document | Path | Status |
|---|---|---|
| ISMS App Description | `modules/isms/00-app-description/ISMS_app_description.md` v1.1.0 | FROZEN |
| ISMS Architecture | `modules/isms/04-architecture/architecture.md` | CURRENT |
| Legacy Harvest Map | `modules/isms/prebuild-harvest-package/harvest-map.md` | FROZEN |
| Route Boundary Map | `modules/isms/prebuild-harvest-package/route-boundary-map.md` | FROZEN |
| Module-Card Inventory | `modules/isms/prebuild-harvest-package/module-card-inventory.md` | FROZEN |
| UX Journey Contract | `modules/isms/prebuild-harvest-package/ux-journey-contract.md` | FROZEN |
| Implementation Map | `modules/isms/prebuild-harvest-package/implementation-map.md` | FROZEN |

---

## 3. Frozen Architecture Decisions

The following architecture decisions are **FROZEN** and cannot be changed without CS2 approval:

### 3.1 App Target

**Decision**: ISMS public landing is implemented in `apps/isms-portal/src/`.
**Rationale**: `isms-portal` is the designated ISMS application container in the monorepo.
**Immutable**: YES

### 3.2 Legacy Source

**Decision**: Legacy source is `apps/maturion-maturity-legacy/src/`. It is READ-ONLY.
**Rationale**: CS2 supplied this as the approved harvest source.
**Immutable**: YES

### 3.3 Public Route Boundary

**Decision**: All routes under `/marketing/*`, `/free-assessment`, `/journey`, `/modules`, `/subscribe`, `/subscribe/checkout` are PUBLIC (no ProtectedRoute).
**Rationale**: ISMS_app_description.md §16.4 — marketing pages must remain unauthenticated.
**Immutable**: YES — route protection decisions require CS2 approval to change.

### 3.4 Module Marketing Route Pattern

**Decision**: Marketing routes use `/marketing/<module-slug>` pattern.
**Examples**: `/marketing/risk-management`, `/marketing/project-implementation`
**Legacy routes** are redirected (not removed) for backward compatibility.
**Immutable**: YES

### 3.5 Module Card Model

**Decision**: 7 module cards are required. Card specifications in module-card-inventory.md are the build target.
**Immutable**: YES

### 3.6 UI Library

**Decision**: Tailwind CSS + shadcn/ui components (same as maturion-maturity-legacy).
**Rationale**: Harvest compatibility with existing components.
**Immutable**: YES

### 3.7 MMM Identity Boundary

**Decision**: MMM remains the Maturity Roadmap module page. ISMS landing is the top-level front door.
**Rationale**: ISMS_app_description.md §16.8
**Immutable**: YES — cannot be changed without CS2 approval.

### 3.8 Free Assessment → MMM Tie

**Decision**: Free Assessment at `/free-assessment` is tied to the MMM/Maturity Roadmap module.
**Rationale**: ISMS_app_description.md §16.8; issue #1645 non-goals.
**Immutable**: YES

---

## 4. Change Propagation Audit

| Upstream Stage | Document | Change Impact on This Wave |
|---|---|---|
| Stage 1 (App Description) | `ISMS_app_description.md` v1.1.0 | Added §16 Legacy Harvest Authority — is the BASIS for this wave. No further changes expected. |
| Stage 4 (Architecture) | `architecture.md` | General ISMS architecture unchanged. Not affected. |
| Legacy source | `apps/maturion-maturity-legacy/src/` | Read-only. No changes. |

---

## 5. Non-Goals (Architecture Boundary Enforcement)

The following are EXPLICITLY out of scope and must NOT be built in this wave:

- MMM Get-To-Know-You wizard (issue #1639)
- MMM framework/domain/criteria generation
- PIT workflow implementation
- Risk/Incident/RADAM/Skills module functionality
- Database migrations (unless absolutely required for routing)
- Payment gateway integration (stub only)
- Supabase backend integration (stub only)
- Admin/QA pages
- Authenticated workspace pages (Dashboard, Assessment, etc.)

---

## 6. PBFAG Gate Checklist

| Check | Status |
|---|---|
| Architecture documents referenced and FROZEN | ✅ CONFIRMED |
| Legacy source identified and read-only | ✅ CONFIRMED |
| Route boundary decisions frozen | ✅ CONFIRMED |
| Module card model frozen | ✅ CONFIRMED |
| MMM identity boundary enforced | ✅ CONFIRMED |
| Free Assessment → MMM tie enforced | ✅ CONFIRMED |
| Non-goals explicitly excluded | ✅ CONFIRMED |
| No upstream architecture changes pending | ✅ CONFIRMED |

---

## 7. PBFAG Gate Status

```
PBFAG: CONFIRMED
Architecture frozen: YES
Gate-pass status: READY FOR BUILDER APPOINTMENT
```

> **Note**: This gate allows the builder to proceed. Any architecture deviation during build must be reported to Foreman immediately and requires CS2 sign-off before continuing.

---

**Authority**: foreman-v2-agent | Wave: isms-public-landing-harvest-20260514
