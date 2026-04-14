# MMM — Compliance Scope

**Module**: MMM (Maturity Management Module)  
**Version**: 1.0.0  
**Stage**: Architecture (Stage 5)  
**Date**: 2026-04-14  
**Authority**: TR-037 (FR-071)  
**Status**: COMPLETE

---

## Overview

This document defines the compliance scope for the MMM module against three control frameworks:
ISO 27001 (Information Security Management), ISO 31000 (Risk Management), and NIST CSF
(Cybersecurity Framework). It maps MMM features to specific controls within each framework,
using FRS requirements (FR-060 through FR-073) and TRS requirements (TR-029 through TR-038)
as the authoritative requirement source.

---

## ISO 27001 Control Scope

**Framework version**: ISO/IEC 27001:2022  
**Relevant Annex A control areas**: Access Control (A.5), Cryptography (A.8), Operations (A.8),
Physical and Environmental (out of scope — cloud-hosted), Incident Response (A.5), Audit Logging (A.8)

### A.5 — Organisational Controls

| Control | Control Description | MMM Feature | MMM Requirement(s) |
|---------|--------------------|--------------|--------------------|
| A.5.15 | Access control — policy for access to information assets | Role model (ADMIN / ASSESSOR / VIEWER); org-scoped isolation | FR-060, TR-029, TR-036 |
| A.5.16 | Identity management — management of identities throughout lifecycle | Supabase Auth as sole identity provider; invitation-based user onboarding | FR-060, FR-061, TR-029 |
| A.5.17 | Authentication information — use of secret authentication information | JWT-based API authentication; 1-hour access token TTL; 7-day refresh TTL; no shared credentials | TR-030 |
| A.5.18 | Access rights — provisioning and deprovisioning | Role-scoped invitations; org-level permission enforcement; ADMIN-only user management | FR-061, FR-062, TR-035, TR-036 |
| A.5.33 | Protection of records — protection against loss, destruction, falsification | Immutable audit log (`mmm_audit_logs`); no DELETE/UPDATE RLS pathway; 7-year retention | TR-023, TR-038 |
| A.5.34 | Privacy and protection of PII | Org-scoped RLS on all tables; no cross-org data access paths | FR-062, TR-031, TR-032 |
| A.5.36 | Compliance with security policies and standards | Compliance artifact set (COMPLIANCE_SCOPE, CONTROL_MAPPING, EVIDENCE_CATALOG); Architecture gate-pass requirement | TR-037 |

### A.8 — Technological Controls

| Control | Control Description | MMM Feature | MMM Requirement(s) |
|---------|--------------------|--------------|--------------------|
| A.8.2  | Privileged access rights — restriction of privileged access | ADMIN-only override capability; service role key restricted to Edge Functions; VIEWER read-only | TR-036 |
| A.8.3  | Information access restriction — restriction of access to information and application functions | Scope-based permission matrix enforced at both RLS and Edge Function level | TR-031, TR-036 |
| A.8.5  | Secure authentication — implementation of secure authentication | Supabase Auth (JWT); no alternative auth provider; OAuth (Google, Microsoft) via CS2 config | TR-029, TR-030 |
| A.8.6  | Capacity management — monitoring and adjustment of capacity | QIW dashboard monitoring; commissioning checks before ACTIVATED state | FR-068, FR-072 |
| A.8.15 | Logging — record events and generate evidence | `mmm_audit_logs` table capturing all 8 event categories; 7-year retention | TR-038 |
| A.8.16 | Monitoring activities — monitor networks and systems | Health endpoint (`/api/health`); QIW dashboard real-time status indicators | FR-067, FR-068 |
| A.8.17 | Clock synchronisation | Supabase-managed `created_at timestamptz` with `DEFAULT now()`; UTC throughout | TR-038 |
| A.8.19 | Installation of software on operational systems | Supabase migrations with numbered naming convention; CI pipeline gates before merge | TR-050 |
| A.8.24 | Use of cryptography | 256-bit random invitation tokens via `pgcrypto.gen_random_bytes(32)` | TR-035 |
| A.8.28 | Secure coding — secure coding principles | Edge Function business logic only; zero frontend business logic; Zod payload validation | TR-031, TR-036 |
| A.8.32 | Change management — changes to information processing facilities | Schema migrations via `supabase/migrations/`; CI gates on all changes | TR-050 |
| A.8.33 | Test information — protection of test information | Staging Supabase project separate from production; CI uses staging env | TR-048 |

### Data Handling Scope (ISO 27001)

| Data Category | Classification | Control Mechanism | Retention |
|---------------|---------------|------------------|-----------|
| Evidence files | Confidential | Supabase Storage `mmm-evidence` bucket (private, authenticated) | 7 years |
| Audit logs | Confidential | Immutable RLS; service-role INSERT only | 7 years |
| Maturity scores | Confidential | Org-scoped RLS; HITL-confirmed only | Indefinite |
| Framework snapshots | Internal | `mmm-framework-sources` bucket (private, authenticated) | Indefinite |
| AI interaction logs | Internal | Org-scoped RLS; soft-delete | 3 years |
| Invitation tokens | Secret | Single-use, 72-hour TTL; `pgcrypto` entropy | 30 days (unaccepted) |
| Service keys (SUPABASE_SERVICE_ROLE_KEY, AIMC_SERVICE_TOKEN, PIT_SERVICE_TOKEN) | Secret | Never logged; never exposed to frontend; environment variable only | N/A — rotated per deployment |

---

## ISO 31000 Control Scope

**Framework version**: ISO 31000:2018  
**Clause references**: §5 (Framework), §6 (Process), §6.4 (Risk Assessment), §6.6 (Risk Treatment)

### Risk Management Context

MMM's primary risk management context is the assessment of an organisation's maturity against a
published framework (Domain → MPS → Criteria hierarchy). MMM does not replace an organisation's
ISMS risk register but provides the structured maturity scoring infrastructure that feeds into it.
The PIT module is the downstream risk treatment and threat-intelligence consumer of MMM data.

### §6.3 — Risk Identification Linkages

| ISO 31000 Process | MMM Feature | MMM Requirement(s) |
|-------------------|-------------|--------------------|
| Context establishment | Organisation registration; framework selection; domain scoping | FR-060, FR-062 |
| Risk identification | Evidence submission and capture per criterion; AI-assisted gap analysis | FR-064, FR-065 |
| Risk analysis | Scoring cascade: criterion → MPS → domain → organisation score | FR-040, TR-004 |
| Risk evaluation | HITL score confirmation; ADMIN-only override for L4/L5 doc-only | TR-033, TR-036 |
| Risk treatment | Findings generation; PIT export for downstream treatment | TR-015, TR-016, TR-017 |
| Monitoring and review | QIW dashboard; audit log; maturity score history | FR-067, FR-068, TR-038 |
| Communication and consultation | Report generation; PIT integration export | TR-015 |
| Recording and reporting | `mmm_audit_logs`; export payloads; evidence submissions | TR-038 |

### §6.4 — Risk Assessment Linkages

| Risk Category | MMM Control | TRS Mapping |
|---------------|------------|-------------|
| Data loss risk | Immutable audit logs; 7-year evidence retention; soft-delete for most entities | TR-023, TR-038 |
| Unauthorised access risk | RLS on all tables; JWT auth; org isolation | TR-029, TR-031, TR-032 |
| AI output risk (AI governance) | HITL mandatory; score proposals non-binding; override log | TR-033, TR-034 |
| Integration failure risk | Circuit breaker on AIMC/PIT; health endpoint; fallback degraded mode | FR-070, TR-009 |
| Supply chain / third-party risk | AIMC as sole AI gateway (CS2 governed); Supabase as sole backend | FR-063, TR-029 |
| Compliance evidence risk | Evidence catalog; control traceability; 7-year retention | TR-037 |

---

## NIST CSF Control Scope

**Framework version**: NIST CSF 2.0  
**Core Function mapping**: GV (Govern), ID (Identify), PR (Protect), DE (Detect), RS (Respond), RC (Recover)

### GV — Govern

| CSF Subcategory | Description | MMM Feature | MMM Requirement(s) |
|----------------|-------------|-------------|--------------------|
| GV.OC-01 | Organisational context for cybersecurity risk management | Commissioning model; compliance baseline artifacts | FR-071, FR-072, TR-037 |
| GV.RM-01 | Risk management objectives aligned to mission | Maturity scoring cascade tied to domain/MPS/criteria structure | FR-040 |
| GV.OV-01 | Cybersecurity risk management strategy results reviewed | QIW dashboard; AI telemetry; health endpoint | FR-067, FR-068 |

### ID — Identify

| CSF Subcategory | Description | MMM Feature | MMM Requirement(s) |
|----------------|-------------|-------------|--------------------|
| ID.AM-01 | Asset inventory maintained | Framework structure: domains, MPS, criteria, evidence files catalogued in Supabase | FR-017 |
| ID.AM-07 | Inventories of data and services | `mmm_*` table namespace; all data catalogued in schema migrations | TR-022 |
| ID.RA-01 | Vulnerabilities identified and documented | Evidence submission per criterion; AI gap analysis | FR-064, FR-065 |
| ID.RA-05 | Risk register maintained | Findings generation; PIT export as downstream risk register feed | TR-015, TR-016 |
| ID.IM-01 | Improvements to organisation-wide cybersecurity risk management identified | Maturity roadmap (PIT integration); improvement recommendations | TR-017 |

### PR — Protect

| CSF Subcategory | Description | MMM Feature | MMM Requirement(s) |
|----------------|-------------|-------------|--------------------|
| PR.AA-01 | Identities and credentials managed for authorised users | Supabase Auth; invitation model; role-scoped access | FR-060, FR-061, TR-029 |
| PR.AA-02 | Identities proofed and bound to credentials | Email-verified Supabase Auth accounts; 256-bit invitation tokens | TR-029, TR-035 |
| PR.AA-05 | Access permissions managed, incorporating principles of least privilege | ADMIN/ASSESSOR/VIEWER permission matrix; scope-based permissions | FR-062, TR-036 |
| PR.AA-06 | Physical access to assets managed | Cloud-hosted (Supabase/Vercel); physical access is provider responsibility | Out of MMM scope |
| PR.DS-01 | Data-at-rest protected | Supabase managed encryption; private storage buckets | TR-031 |
| PR.DS-02 | Data-in-transit protected | HTTPS enforced for all endpoints; Supabase TLS | TR-030 |
| PR.DS-10 | Data used during processing protected | Service role key never exposed to frontend; `VITE_` prefix prohibited for secrets | TR-053 |
| PR.PS-01 | Configuration management policy established | Environment variable documentation (`.env.example`); commissioning checks | TR-053, TR-064 |
| PR.PS-04 | Log records created and maintained | Immutable `mmm_audit_logs`; 7-year retention; all 8 event categories | TR-038 |

### DE — Detect

| CSF Subcategory | Description | MMM Feature | MMM Requirement(s) |
|----------------|-------------|-------------|--------------------|
| DE.CM-01 | Networks and environment monitored | Health endpoint (`/api/health`); QIW dashboard | FR-067, FR-068 |
| DE.CM-03 | Personnel activity and technology usage monitored | AI interaction audit log (`mmm_ai_interactions`); admin telemetry dashboard | TR-034, FR-066 |
| DE.CM-06 | External service provider activities monitored | Circuit breaker state in health endpoint; AIMC/PIT reachability checks | FR-070, TR-009 |
| DE.CM-09 | Computing hardware and software monitored | Commissioning state machine (5 checks); health endpoint per-service status | FR-072, TR-051 |
| DE.AE-02 | Potentially adverse events analysed | Audit log review; AI governance override log | TR-034, TR-038 |
| DE.AE-06 | Information on adverse events communicated | QIW dashboard RED/AMBER/GREEN status; health endpoint structured response | FR-068 |

### RS — Respond

| CSF Subcategory | Description | MMM Feature | MMM Requirement(s) |
|----------------|-------------|-------------|--------------------|
| RS.MA-01 | Incident management processes executed | HITL enforcement — no auto-applied AI outputs; override requires ADMIN role | TR-033, TR-036 |
| RS.MA-02 | Incident reports investigated | Audit log provides before/after state for incident reconstruction | TR-038 |
| RS.CO-02 | Internal and external stakeholders notified of incidents | PIT export for downstream incident sharing; report generation | TR-015, TR-016 |
| RS.MI-01 | Incidents contained | Circuit breaker OPEN state prevents AIMC calls during failure; fallback response returned | FR-070, TR-009 |

### RC — Recover

| CSF Subcategory | Description | MMM Feature | MMM Requirement(s) |
|----------------|-------------|-------------|--------------------|
| RC.RP-01 | Recovery plan executed | Commissioning state machine rejects startup until all checks pass (CHK-001 to CHK-005) | FR-072, TR-051 |
| RC.RP-03 | Recovery actions documented and communicated | Health endpoint reports DEGRADED/DOWN per service; rollback guidance in deployment runbook | TR-052 |
| RC.CO-03 | Recovery activities communicated to stakeholders | QIW dashboard; health endpoint accessible post-incident | FR-067, FR-068 |

---

## Compliance Scope Summary

| Framework | Controls In Scope | Key MMM Features Covered |
|-----------|------------------|--------------------------|
| ISO 27001:2022 | A.5.15, A.5.16, A.5.17, A.5.18, A.5.33, A.5.34, A.5.36, A.8.2, A.8.3, A.8.5, A.8.6, A.8.15, A.8.16, A.8.17, A.8.19, A.8.24, A.8.28, A.8.32, A.8.33 | Auth, RLS, audit logs, cryptography, data retention, access control |
| ISO 31000:2018 | §6.3 (risk process), §6.4 (risk assessment) | Scoring cascade, evidence, findings, PIT export, AI governance |
| NIST CSF 2.0 | GV.OC-01, GV.RM-01, GV.OV-01, ID.AM-01/07, ID.RA-01/05, ID.IM-01, PR.AA-01/02/05/06, PR.DS-01/02/10, PR.PS-01/04, DE.CM-01/03/06/09, DE.AE-02/06, RS.MA-01/02, RS.CO-02, RS.MI-01, RC.RP-01/03, RC.CO-03 | Full lifecycle: Identify, Protect, Detect, Respond, Recover |

---

*Control implementation verification occurs in QA-to-Red (Stage 6). This document covers Architecture-stage control scope only.*
