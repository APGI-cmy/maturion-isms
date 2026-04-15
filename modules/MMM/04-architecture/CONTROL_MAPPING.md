# MMM — Control Mapping

**Module**: MMM (Maturity Management Module)  
**Version**: 1.0.0  
**Stage**: Architecture (Stage 5)  
**Date**: 2026-04-14  
**Authority**: TR-037 (FR-071)  
**Status**: COMPLETE

---

## Overview

This document provides end-to-end control-to-requirement traceability for the MMM module.
Each identified ISO 27001, ISO 31000, and NIST CSF control is mapped to the specific MMM
TRS requirement(s) that implement it, and to the FRS requirement(s) that sourced it.

Traceability chain: **Compliance Control → MMM TRS Requirement → MMM FRS Requirement → Architecture Section**

---

## Authentication Controls

### Control: ISO 27001 A.5.16 / NIST CSF PR.AA-01 — Identity Management

| Field | Value |
|-------|-------|
| **MMM TRS Requirement** | TR-029 — Authentication Provider |
| **MMM FRS Requirement** | FR-060 — Core Role Model |
| **Architecture Section** | §A7.1 — Authentication and JWT Flow |
| **Implementation** | Supabase Auth as sole authentication provider; email/password, magic link, Google OAuth, Microsoft OAuth |
| **Acceptance Criterion** | All auth flows route through Supabase Auth; zero alternative auth code paths |
| **QA-to-Red Test** | Auth provider isolation test; verify no alternative auth endpoint exists |

### Control: ISO 27001 A.5.17 / NIST CSF PR.AA-06 — Authentication Information

| Field | Value |
|-------|-------|
| **MMM TRS Requirement** | TR-030 — JWT Token Requirements |
| **MMM FRS Requirement** | FR-060 — Core Role Model |
| **Architecture Section** | §A7.1 — Authentication and JWT Flow |
| **Implementation** | JWT access token (1-hour TTL); refresh token (7-day TTL); `sub`, `role`, `org_id` claims |
| **Acceptance Criterion** | All Edge Functions validate JWT; expired token → HTTP 401; no unauthenticated endpoints except `/api/health` |
| **QA-to-Red Test** | Expired token returns 401; missing `Authorization` header returns 401 |

### Control: ISO 27001 A.8.24 — Cryptography (Invitation Tokens)

| Field | Value |
|-------|-------|
| **MMM TRS Requirement** | TR-035 — Invitation Security Model |
| **MMM FRS Requirement** | FR-061 — Invitation Model |
| **Architecture Section** | §A7.3 — Invitation Security Model |
| **Implementation** | `pgcrypto.gen_random_bytes(32)` — 256-bit entropy tokens; 72-hour TTL; single-use |
| **Acceptance Criterion** | Token entropy test; expired invite → 401; replayed (accepted) token → 401 |
| **QA-to-Red Test** | Replay attack test; expiry test; entropy verification |

---

## Row-Level Security (RLS) Controls

### Control: ISO 27001 A.5.15 / A.8.3 / NIST CSF PR.AA-05 — Access Control

| Field | Value |
|-------|-------|
| **MMM TRS Requirement** | TR-031 — Row-Level Security (RLS) Policy Baseline |
| **MMM FRS Requirement** | FR-062 — Scope-Based Permissions; FR-073 — Audit Log Design |
| **Architecture Section** | §A5.3 — Row-Level Security (RLS) Policy Architecture |
| **Implementation** | RLS enabled on all MMM tables; org isolation (`organisation_id = auth.jwt() ->> 'org_id'`); audit log INSERT-only via service role |
| **Acceptance Criterion** | RLS policies present on all tables; cross-org access test confirms isolation |
| **QA-to-Red Test** | User in org A cannot SELECT/INSERT/UPDATE/DELETE any row with different `organisation_id` |

### Control: ISO 27001 A.5.34 / NIST CSF PR.DS-01 — Data Isolation (Multi-Tenant)

| Field | Value |
|-------|-------|
| **MMM TRS Requirement** | TR-032 — Data Isolation for Multi-Organisation Deployments |
| **MMM FRS Requirement** | FR-062 — Scope-Based Permissions |
| **Architecture Section** | §A7.2 — RLS Policy Model for Multi-Organisation Isolation |
| **Implementation** | Shared-schema multi-tenant; RLS as sole isolation mechanism; `organisation_id` FK on all org-scoped tables |
| **Acceptance Criterion** | RLS bypass test in QA-to-Red; zero cross-org data leakage confirmed |
| **QA-to-Red Test** | Mandatory RLS bypass test (TR-032): User A (org A) cannot read, write, or infer existence of org B data |

---

## Audit Log Controls

### Control: ISO 27001 A.5.33 / A.8.15 / NIST CSF PR.PS-04 — Logging and Protection of Records

| Field | Value |
|-------|-------|
| **MMM TRS Requirement** | TR-038 — Audit Log Technical Requirements |
| **MMM FRS Requirement** | FR-073 — Audit Log Design |
| **Architecture Section** | §A5.7 — Audit Log Architecture |
| **Implementation** | `mmm_audit_logs` table (8-column schema); no DELETE/UPDATE RLS pathway; 7-year retention; 30+ action types |
| **Acceptance Criterion** | All 7 columns present in migration; all 8 event types logged in QA |
| **QA-to-Red Test** | Verify action types: evidence decisions, scoring changes, overrides, approvals, PIT exports, report generation, framework lifecycle, user management |

**Audit Log 8-Column Schema** (TR-038):

| Column | Type | Requirement |
|--------|------|-------------|
| `id` | uuid PRIMARY KEY | Unique event identifier |
| `action_type` | text NOT NULL | One of the 30+ defined action type vocabulary |
| `actor_id` | uuid NOT NULL | User or service triggering the action |
| `target_entity_type` | text NOT NULL | Table name of the target entity |
| `target_entity_id` | uuid NOT NULL | ID of the specific affected record |
| `before_state` | jsonb | State before action (null for creates) |
| `after_state` | jsonb NOT NULL | State after action |
| `created_at` | timestamptz NOT NULL DEFAULT now() | Event timestamp (UTC) |

**8 Required Event Categories** (TR-038 / FR-073):

| Event Category | Action Types Covered |
|----------------|---------------------|
| Evidence decisions | `EVIDENCE_SUBMIT`, `EVIDENCE_ACCEPT`, `EVIDENCE_REJECT` |
| Scoring changes | `SCORE_PROPOSE`, `SCORE_CONFIRM` |
| Overrides | `SCORE_OVERRIDE` |
| Approvals | `FINDING_APPROVE` |
| PIT exports | `PIT_EXPORT_INITIATE`, `PIT_EXPORT_CONFIRM` |
| Report generation | `REPORT_GENERATE` |
| Framework lifecycle | `FRAMEWORK_CREATE`, `FRAMEWORK_COMPILE`, `FRAMEWORK_PUBLISH`, `FRAMEWORK_ARCHIVE` |
| User management | `USER_INVITE`, `USER_ACCEPT_INVITE`, `USER_ROLE_CHANGE`, `USER_REMOVE` |

### Control: ISO 27001 A.8.15 — AI Governance Logging

| Field | Value |
|-------|-------|
| **MMM TRS Requirement** | TR-034 — AI Governance Logging |
| **MMM FRS Requirement** | FR-065 — AI Governance Requirements; FR-073 — Audit Log Design |
| **Architecture Section** | §A7.6 — AI Governance Logging |
| **Implementation** | All AI calls logged in `mmm_audit_logs` (action_type: AI_*) AND `mmm_ai_interactions` (token_count, duration_ms, status) |
| **Acceptance Criterion** | All 7 AI action types appear in audit log after corresponding AI operations |
| **QA-to-Red Test** | Trigger each of the 7 AI operations; verify corresponding `mmm_audit_logs` and `mmm_ai_interactions` entries |

---

## Invitation Security Controls

### Control: ISO 27001 A.5.18 / NIST CSF PR.AA-02 — Access Rights and Identity Proofing

| Field | Value |
|-------|-------|
| **MMM TRS Requirement** | TR-035 — Invitation Security Model |
| **MMM FRS Requirement** | FR-061 — Invitation Model |
| **Architecture Section** | §A7.3 — Invitation Security Model |
| **Implementation** | `pgcrypto.gen_random_bytes(32)` tokens; 72h TTL; single-use invalidation; email verification before org access |
| **Acceptance Criterion** | Replay attack fails; expired invite returns 401; token invalidated after first use |
| **QA-to-Red Test** | Three test scenarios: replay, expiry, token reuse |

---

## Permission Enforcement Controls

### Control: ISO 27001 A.8.2 / NIST CSF PR.AA-05 — Privileged Access

| Field | Value |
|-------|-------|
| **MMM TRS Requirement** | TR-036 — Scope-Based Permission Enforcement |
| **MMM FRS Requirement** | FR-060 — Core Role Model; FR-062 — Scope-Based Permissions |
| **Architecture Section** | §A7.4 — Scope-Based Permission Enforcement |
| **Implementation** | ADMIN/ASSESSOR/VIEWER permission matrix enforced at API/Edge Function level AND RLS level; route guards in frontend |
| **Acceptance Criterion** | Each permission boundary tested with unauthorized role; 403 returned for every prohibited action |
| **QA-to-Red Test** | 10 permission boundary tests (one per permission row in matrix); each unauthorized role attempt verified |

**Full Permission Matrix** (TR-036):

| Permission | ADMIN | ASSESSOR | VIEWER | TRS Mapping |
|-----------|-------|----------|--------|-------------|
| Read framework | ✅ | ✅ | ✅ | TR-031 |
| Write framework | ✅ | ❌ (403) | ❌ (403) | TR-031, TR-036 |
| Publish framework | ✅ | ❌ (403) | ❌ (403) | TR-036 |
| Submit evidence | ✅ | ✅ | ❌ (403) | TR-031 |
| Confirm score | ✅ | ✅ | ❌ (403) | TR-033 |
| Override score (L4/L5 doc-only) | ✅ | ❌ (403) | ❌ (403) | TR-033, TR-036 |
| Export to PIT | ✅ | ✅ | ❌ (403) | TR-036 |
| Manage users / invitations | ✅ | ❌ (403) | ❌ (403) | TR-035, TR-036 |
| View dashboard | ✅ | ✅ | ✅ | TR-031 |
| Admin AI interface | ✅ | ❌ (403) | ❌ (403) | TR-034, TR-036 |

---

## Compliance Artifact Controls

### Control: ISO 27001 A.5.36 / NIST CSF GV.OC-01 — Compliance with Security Policies

| Field | Value |
|-------|-------|
| **MMM TRS Requirement** | TR-037 — Compliance Baseline Artifacts |
| **MMM FRS Requirement** | FR-071 — Compliance Baseline |
| **Architecture Section** | §A7.5 — Compliance Artifacts Architecture |
| **Implementation** | Three Architecture stage artifacts: `COMPLIANCE_SCOPE.md`, `CONTROL_MAPPING.md`, `EVIDENCE_CATALOG.md` |
| **Acceptance Criterion** | All three files present at Architecture stage; control traceability end-to-end confirmed |
| **QA-to-Red Test** | PBFAG verifies file presence before Architecture gate-pass |

---

## AI Human Oversight Controls

### Control: NIST CSF RS.MA-01 / ISO 27001 A.8.28 — AI Score Proposal Non-Binding

| Field | Value |
|-------|-------|
| **MMM TRS Requirement** | TR-033 — AI Human Oversight Technical Requirements |
| **MMM FRS Requirement** | FR-064 — AI Human Oversight Rule |
| **Architecture Section** | §A4.3 — Business Logic Layer; §A6.1 — AI Human Oversight Architecture |
| **Implementation** | AI proposals stored in `mmm_score_proposals`; `maturity_scores` updated only with `confirmed_by` non-null; Edge Function requires `confirm: true` flag |
| **Acceptance Criterion** | Insert into `maturity_scores` without `confirmed_by` rejected by NOT NULL constraint |
| **QA-to-Red Test** | Attempt to bypass HITL via direct API call; verify rejection |

---

## Infrastructure Controls

### Control: NIST CSF PR.PS-01 / ISO 27001 A.8.19 — Configuration Management

| Field | Value |
|-------|-------|
| **MMM TRS Requirement** | TR-053 — Environment Variables |
| **MMM FRS Requirement** | FR-072 — Commissioning Model |
| **Architecture Section** | §A8.4 — Environment Variables and Configuration Management |
| **Implementation** | 8 documented environment variables in `.env.example`; secrets never in source control; `VITE_` prefix prohibited for secrets |
| **Acceptance Criterion** | `.env.example` present with all 8 variables; secrets management rule enforced |
| **QA-to-Red Test** | CI scan for committed secrets; verify `VITE_` prefix not used on `SUPABASE_SERVICE_ROLE_KEY`, `AIMC_SERVICE_TOKEN`, `PIT_SERVICE_TOKEN` |

### Control: NIST CSF RC.RP-01 / DE.CM-09 — Commissioning and Startup Requirements

| Field | Value |
|-------|-------|
| **MMM TRS Requirement** | TR-051 — Commissioning State Machine; TR-064 — APP_STARTUP_REQUIREMENTS.md artifact |
| **MMM FRS Requirement** | FR-072 — Commissioning Model |
| **Architecture Section** | §A4.3 — Business Logic Layer (commissioning state machine) |
| **Implementation** | 5-check startup sequence (CHK-001 through CHK-005); ACTIVATED state blocked until all checks pass |
| **Acceptance Criterion** | `APP_STARTUP_REQUIREMENTS.md` present; failure of any check prevents ACTIVATED state |
| **QA-to-Red Test** | Simulate each check failure; verify application does not reach ACTIVATED state |

---

## Traceability Summary Matrix

| Compliance Control | Control Framework | MMM TRS | MMM FRS | Architecture §§ |
|-------------------|------------------|---------|---------|-----------------|
| Identity management | ISO 27001 A.5.16, NIST PR.AA-01 | TR-029 | FR-060 | §A7.1 |
| JWT authentication | ISO 27001 A.5.17, NIST PR.AA-06 | TR-030 | FR-060 | §A7.1 |
| RLS baseline | ISO 27001 A.8.3, NIST PR.AA-05 | TR-031 | FR-062, FR-073 | §A5.3, §A7.2 |
| Multi-org isolation | ISO 27001 A.5.34, NIST PR.DS-01 | TR-032 | FR-062 | §A7.2 |
| AI Human Oversight | NIST RS.MA-01, ISO 27001 A.8.28 | TR-033 | FR-064 | §A4.3, §A6.1 |
| AI governance logging | ISO 27001 A.8.15 | TR-034 | FR-065, FR-073 | §A7.6 |
| Invitation security | ISO 27001 A.8.24, NIST PR.AA-02 | TR-035 | FR-061 | §A7.3 |
| Permission enforcement | ISO 27001 A.8.2, NIST PR.AA-05 | TR-036 | FR-060, FR-062 | §A7.4 |
| Compliance artifacts | ISO 27001 A.5.36, NIST GV.OC-01 | TR-037 | FR-071 | §A7.5 |
| Audit log schema | ISO 27001 A.5.33, NIST PR.PS-04 | TR-038 | FR-073 | §A5.7 |
| Environment variables | NIST PR.PS-01, ISO 27001 A.8.19 | TR-053 | FR-072 | §A8.4 |
| Commissioning checks | NIST RC.RP-01, DE.CM-09 | TR-051, TR-064 | FR-072 | §A4.3, §A8.5 |

---

*Control implementation verification occurs in QA-to-Red (Stage 6). This document covers Architecture-stage traceability only.*
