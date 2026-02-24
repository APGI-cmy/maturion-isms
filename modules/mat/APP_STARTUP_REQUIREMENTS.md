# Application Startup Requirements Declaration

## Application Information

| Field | Value |
|---|---|
| **Application Name** | MAT — Manual Audit Tool |
| **Application ID** | mat-v2 |
| **Application Type** | web-app (Next.js + Supabase) |
| **Deployment Target** | Vercel Production + Supabase Cloud |
| **Risk Profile** | high |
| **Declaration Version** | 1.0.0 |
| **Last Updated** | 2026-02-24 |
| **Authority** | `APP_STARTUP_REQUIREMENTS_DECLARATION.md` v1.0 |
| **Module Root** | `modules/mat/` |

---

## Purpose

MAT is the Manual Audit Tool — a multi-tenant SaaS application enabling organizations to conduct structured compliance audits against ISMS standards (ISO 27001, NIST CSF, SOC 2, LDCS). It manages audit lifecycle, domain/MPS/criteria scoring, evidence collection, approval workflows, and reporting.

MAT is a **high-risk** production application because:
- It handles multi-tenant compliance audit data with strict isolation requirements
- It enforces Row-Level Security at the database layer
- It integrates with authentication, AI services (blocked), and offline sync
- Incorrect commissioning could expose one tenant's data to another

---

## Governance Authority

This declaration implements:
- **`APP_STARTUP_REQUIREMENTS_DECLARATION.md`** v1.0 — Declaration schema and validation requirements
- **`SYSTEM_COMMISSIONING_AND_PROGRESSIVE_ACTIVATION_PROTOCOL.md`** — Commissioning phases
- **`MANDATORY_CROSS_APP_COMPONENTS.md`** v1.0.0 — Category 7 (Startup & Commissioning)
- **`PLATFORM_AI_REQUIREMENTS.md`** v1.0.0 — AI feature declaration (blocking justification below)
- **`maturion-tenant-isolation-standard.md`** — Tenant isolation requirements
- **`WATCHDOG_AUTHORITY_AND_SCOPE.md`** v1.0.0 — Watchdog service requirements

---

## AI Feature Status Declaration

**Per `PLATFORM_AI_REQUIREMENTS.md` v1.0.0 §7 — Exclusion and Blocking Process**

MAT's AI feature implementation is **constitutionally BLOCKED** pending upstream AIMC prerequisite waves. This is not an exemption — it is a sequencing constraint.

| AI Feature | AIMC Prerequisite | Status | Unblocks When |
|---|---|---|---|
| Wave 7 — Advisory Integration (FR-072, TR-072) | AIMC Wave 3 — Advisory Gateway | **BLOCKED** | AIMC Wave 3 complete |
| Wave 8 — Analysis Integration (scoring, parsing) | AIMC Wave 4 — Analysis Gateway | **BLOCKED** | AIMC Wave 4 complete |
| Wave 9 — Embeddings/RAG Integration | AIMC Wave 5 — Embeddings/RAG | **BLOCKED** | AIMC Wave 5 complete |

**Scaffold components present**: `EmbeddedAIAssistant.tsx`, `AIParsingProgress.tsx`, `AIScoringResults.tsx`  
**Constitutional authority**: `ai-architecture.md` v2.0.0, `AIMC_STRATEGY.md` v1.0.0  
**Formal blocking notice**: Documented in `modules/mat/02-architecture/ai-architecture.md` §2 (AIMC Integration Barrier)

---

## Commissioning Phase Requirements

### Phase 2: VALIDATED (INSTALLED → VALIDATED)

#### Technical Validation

- [ ] **Application Builds Successfully** (MANDATORY)
  - **Purpose**: Verify TypeScript compiles without errors; Next.js frontend builds
  - **Validation Method**: `pnpm build` from repository root; `pnpm --filter mat build`
  - **Success Criteria**: Zero TypeScript errors, zero build failures
  - **Failure Impact**: BLOCKING
  - **Evidence**: Build logs

- [ ] **Test Suite Passes** (MANDATORY)
  - **Purpose**: Verify all unit/integration tests pass
  - **Validation Method**: `pnpm --filter mat test` (vitest)
  - **Success Criteria**: All tests pass; zero unexpected failures
  - **Failure Impact**: BLOCKING
  - **Evidence**: Test output log

- [ ] **Supabase Schema Migration Applied** (MANDATORY)
  - **Purpose**: Verify database schema is current; all tables and indexes created
  - **Validation Method**: Run `supabase db push` or migration script; verify schema version
  - **Success Criteria**: All migrations applied without conflict; schema version matches `data-architecture.md`
  - **Failure Impact**: BLOCKING — Application will not function without correct schema
  - **Evidence**: Migration output log, schema version confirmation

- [ ] **Environment Variables Configured** (MANDATORY)
  - **Purpose**: Verify all required env vars are set for target environment
  - **Validation Method**: Run env validation script or startup check
  - **Required Variables**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, deployment keys
  - **Success Criteria**: All required variables present and non-empty
  - **Failure Impact**: BLOCKING
  - **Evidence**: Env validation output (masked values)

- [ ] **Lint and Static Analysis Clean** (MANDATORY)
  - **Purpose**: Zero warnings discipline per `WARNING_DISCOVERY_BLOCKER_PROTOCOL.md`
  - **Validation Method**: `pnpm lint`
  - **Success Criteria**: Zero lint errors, zero TypeScript type errors
  - **Failure Impact**: BLOCKING
  - **Evidence**: Lint output log

#### Security Validation

- [ ] **RLS Policies Enabled on All Tenant-Scoped Tables** (MANDATORY)
  - **Purpose**: Enforce tenant isolation per `maturion-tenant-isolation-standard.md`
  - **Validation Method**: Query `pg_policies` for all tables listed in `data-architecture.md`; verify `organisation_id` RLS policy on each
  - **Success Criteria**: All tenant-scoped tables have `organisation_id` isolation policy enabled
  - **Failure Impact**: BLOCKING — CRITICAL SECURITY VIOLATION (cross-tenant data exposure)
  - **Evidence**: RLS policy audit output
  - **Authority**: `maturion-tenant-isolation-standard.md`, `security-architecture.md` §2

- [ ] **Authentication Configuration Verified** (MANDATORY)
  - **Purpose**: Verify Supabase Auth JWT configuration, MFA requirements, session settings
  - **Validation Method**: Verify Supabase Auth settings: JWT expiry 1h, refresh 7d, MFA enabled for lead_auditor role
  - **Success Criteria**: Auth settings match `security-architecture.md` §1
  - **Failure Impact**: BLOCKING
  - **Evidence**: Auth configuration audit

- [ ] **No Hardcoded Secrets in Source** (MANDATORY)
  - **Purpose**: Prevent credential exposure
  - **Validation Method**: Secret scanning in CI (`.github/workflows/merge-gate-interface.yml`)
  - **Success Criteria**: Zero secrets detected in source
  - **Failure Impact**: BLOCKING — CRITICAL SECURITY VIOLATION
  - **Evidence**: Secret scan report

- [ ] **CORS Configuration Correct** (MANDATORY)
  - **Purpose**: Prevent unauthorized cross-origin access
  - **Validation Method**: Verify CORS headers in Edge Functions match `security-architecture.md` §8
  - **Success Criteria**: Only approved origins allowed
  - **Failure Impact**: BLOCKING
  - **Evidence**: CORS configuration review

#### Compliance Validation

- [ ] **Tenant Isolation Test Suite Passes** (MANDATORY)
  - **Purpose**: Verify cross-tenant data isolation at application layer
  - **Validation Method**: `pnpm --filter mat test -- --testPathPattern=security-rls`
  - **Success Criteria**: All RLS and isolation tests pass
  - **Failure Impact**: BLOCKING — CRITICAL: cross-tenant data leakage risk
  - **Evidence**: Test output log
  - **Authority**: `maturion-tenant-isolation-standard.md` §3

- [ ] **Data Privacy (GDPR/POPIA) Compliance Verified** (MANDATORY)
  - **Purpose**: Verify DSAR export, data retention, and consent mechanisms present
  - **Validation Method**: `pnpm --filter mat test -- --testPathPattern=data-privacy`
  - **Success Criteria**: Data privacy compliance tests pass
  - **Failure Impact**: BLOCKING
  - **Evidence**: Test output log

---

### Phase 3: COMMISSIONED (VALIDATED → COMMISSIONED)

#### Operational Readiness

- [ ] **Watchdog Service Operational** (MANDATORY)
  - **Purpose**: Verify watchdog metrics collection and alerting functional per `WATCHDOG_AUTHORITY_AND_SCOPE.md`
  - **Validation Method**: `pnpm --filter mat test -- --testPathPattern=watchdog`
  - **Success Criteria**: Watchdog observability tests pass; alert thresholds configured
  - **Failure Impact**: BLOCKING
  - **Evidence**: Test output; watchdog configuration review
  - **Authority**: `WATCHDOG_AUTHORITY_AND_SCOPE.md`, `observability-architecture.md` §4

- [ ] **Error Monitoring Configured** (MANDATORY)
  - **Purpose**: Verify Sentry or equivalent error monitoring operational
  - **Validation Method**: Trigger test error; confirm receipt in monitoring dashboard
  - **Success Criteria**: Errors captured with correlation IDs
  - **Failure Impact**: NON-BLOCKING (warn)
  - **Evidence**: Monitoring configuration confirmation

- [ ] **Performance Baseline Established** (MANDATORY)
  - **Purpose**: Verify application meets performance SLAs per `performance-architecture.md`
  - **Validation Method**: Load test or baseline measurement
  - **Success Criteria**: p95 response time < 500ms for API endpoints; Lighthouse score ≥ 70
  - **Failure Impact**: NON-BLOCKING (warn — record for improvement)
  - **Evidence**: Performance test results

#### Evidence Bundle

- [ ] **Prehandover Proof Present** (MANDATORY)
  - **Purpose**: Evidence bundle per `EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`
  - **Location**: `.agent-admin/prehandover/`
  - **Failure Impact**: BLOCKING
  - **Evidence**: Prehandover proof document

- [ ] **Gate Results Summary Present** (MANDATORY)
  - **Purpose**: Machine-readable gate results
  - **Location**: `.agent-admin/gates/`
  - **Failure Impact**: BLOCKING
  - **Evidence**: JSON gate summary

---

### Phase 4: ACTIVATED (COMMISSIONED → ACTIVATED)

#### Human Authorization (CS2 Required)

- [ ] **All MANDATORY Checks Passed** (MANDATORY)
- [ ] **No Critical or High Security Vulnerabilities Open** (MANDATORY)
- [ ] **Tenant Isolation Validation Signed Off** (MANDATORY)
- [ ] **Deployment Rollback Plan Prepared** (MANDATORY)
- [ ] **AI Blocking Justification Acknowledged** (MANDATORY — confirm AIMC wave dependency)

**Authorization Required**: YES  
**Authorizing Authority**: CS2 (Johan Ras) — explicit approval required for high-risk application  
**Authorization Evidence**: CS2 GitHub approval comment with timestamp  
**Bypass Conditions**: NONE

---

## Human Authorization Checkpoints

| Checkpoint | Transition | Required Authority | Bypass |
|---|---|---|---|
| CP-1 | INSTALLED → VALIDATED | FM (delegated) | NONE |
| CP-2 | VALIDATED → COMMISSIONED | FM (delegated) | NONE |
| CP-3 | COMMISSIONED → ACTIVATED | CS2 (explicit) | NONE |

---

## Application-Specific Risk Notes

1. **Multi-Tenancy**: MAT is strictly multi-tenant. Any failure in RLS policy or `organisation_id` scoping is a CRITICAL security incident. RLS must be verified at every commissioning and every schema migration.

2. **AI Blocking**: Three MAT AI waves (7–9) are constitutionally blocked on AIMC upstream dependencies. No AI feature should be enabled or wired until the corresponding AIMC wave is confirmed complete by CS2.

3. **Offline Sync**: The offline sync engine (`src/services/offline-sync.ts`) uses conflict resolution logic. Verify sync conflict tests pass before activation.

4. **Schema Migrations**: All Supabase migrations must be applied in order. Out-of-order migrations can corrupt RLS policies.

---

## Related Documents

| Document | Location |
|---|---|
| AI Architecture (AIMC blocking) | `modules/mat/02-architecture/ai-architecture.md` |
| Security Architecture (RLS, auth) | `modules/mat/02-architecture/security-architecture.md` |
| Data Architecture (schema, RLS tables) | `modules/mat/02-architecture/data-architecture.md` |
| Observability Architecture (watchdog) | `modules/mat/02-architecture/observability-architecture.md` |
| Tenant Isolation Standard | `Maturion/maturion-tenant-isolation-standard.md` |
| PLATFORM_AI_REQUIREMENTS | `governance/canon/PLATFORM_AI_REQUIREMENTS.md` |
| WATCHDOG_AUTHORITY_AND_SCOPE | `governance/canon/WATCHDOG_AUTHORITY_AND_SCOPE.md` |
| EVIDENCE_ARTIFACT_BUNDLE_STANDARD | `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` |
| MANDATORY_CROSS_APP_COMPONENTS | `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md` |
| APP_STARTUP_REQUIREMENTS_DECLARATION | `governance/canon/APP_STARTUP_REQUIREMENTS_DECLARATION.md` |
| Implementation Plan (Wave 6 commissioning) | `modules/mat/03-implementation-plan/implementation-plan.md` §2.7 |

---

*Declaration created: 2026-02-24*  
*Authority: CS2 via Governance Liaison (session-019)*  
*Remediation for: Platform Standards Layer-Down Status Report CG-001 + CG-002*
