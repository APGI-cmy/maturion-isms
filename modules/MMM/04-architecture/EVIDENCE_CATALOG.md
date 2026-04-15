# MMM — Evidence Catalog

**Module**: MMM (Maturity Management Module)  
**Version**: 1.0.0  
**Stage**: Architecture (Stage 5)  
**Date**: 2026-04-14  
**Authority**: TR-037 (FR-071)  
**Status**: COMPLETE

---

## Overview

This document catalogs the evidence types accepted per compliance control within the MMM module.
For each control, it specifies:
- What evidence the MMM system captures and stores
- The storage mechanism and table/bucket reference
- The retention period
- The audit trail mechanism

Evidence sources: `mmm_audit_logs` table, evidence submission workflows, score confirmation,
override log, and AI interaction telemetry.

---

## Evidence Types Master List

| Evidence Type ID | Type Name | Description | Primary Storage |
|-----------------|-----------|-------------|-----------------|
| EVT-001 | Document Evidence | PDF, DOCX, or image file submitted as criterion evidence | `mmm-evidence` Supabase Storage bucket |
| EVT-002 | Voice Note Evidence | Audio recording submitted as criterion evidence | `mmm-evidence` Supabase Storage bucket |
| EVT-003 | Photo Evidence | Image capture submitted as criterion evidence | `mmm-evidence` Supabase Storage bucket |
| EVT-004 | Integration Evidence | Automated data pull from third-party integration | `mmm_evidence` table (`source = 'integration'`) |
| EVT-005 | Audit Log Entry | Immutable system record of any action | `mmm_audit_logs` table |
| EVT-006 | Score Confirmation Record | Human-confirmed maturity score with `confirmed_by` user ID | `mmm_maturity_scores` table |
| EVT-007 | Score Proposal Record | AI-generated score proposal (non-binding until confirmed) | `mmm_score_proposals` table |
| EVT-008 | Override Log Entry | ADMIN-level score override with justification and before/after state | `mmm_override_log` table |
| EVT-009 | AI Interaction Log | Full AI call record: operation, model, token count, duration, status | `mmm_ai_interactions` table |
| EVT-010 | PIT Export Record | Serialised export payload sent to PIT with handshake confirmation | `mmm_pit_exports` table |
| EVT-011 | Report Generation Record | Structured audit report or maturity report generated from assessment data | `mmm_reports` table |
| EVT-012 | Framework Snapshot | Immutable compiled framework version stored at publication | `mmm-framework-sources` Storage bucket |
| EVT-013 | Invitation Record | Invitation issuance, acceptance, and scope grant records | `mmm_invitations` table |
| EVT-014 | Parse Job Record | AI-assisted framework parse job: status, ambiguities, source document | `mmm_parse_jobs` table |

---

## Evidence Catalog by Compliance Control

### Authentication Controls (TR-029, TR-030)

| Control Reference | ISO 27001 | NIST CSF |
|------------------|-----------|----------|
| | A.5.16, A.5.17 | PR.AA-01, PR.AA-06 |

**Evidence Captured by MMM**:

| Evidence Item | Evidence Type | Source Table / Storage | Retention | Notes |
|--------------|---------------|------------------------|-----------|-------|
| Successful authentication event | EVT-005 (Audit Log) | `mmm_audit_logs` (`action_type = USER_ACCEPT_INVITE` or session start) | 7 years | Supabase Auth manages auth events; MMM logs downstream consequences |
| Failed authentication | — | Supabase Auth logs (not MMM-managed) | Per Supabase Auth defaults | Outside MMM control boundary |
| Token refresh | — | Supabase Auth (not MMM-managed) | Per Supabase Auth defaults | MMM Edge Functions validate JWT on each call |
| Role claim in JWT | EVT-005 (Audit Log) | `mmm_audit_logs` (USER_ROLE_CHANGE) | 7 years | Role changes explicitly logged |

**Evidence Gap**: Direct authentication event logging is Supabase Auth's responsibility. MMM captures downstream evidence (invitation acceptance, role grants) rather than raw auth events.

---

### RLS and Data Isolation Controls (TR-031, TR-032)

| Control Reference | ISO 27001 | NIST CSF |
|------------------|-----------|----------|
| | A.8.3, A.5.34 | PR.AA-05, PR.DS-01 |

**Evidence Captured by MMM**:

| Evidence Item | Evidence Type | Source Table / Storage | Retention | Notes |
|--------------|---------------|------------------------|-----------|-------|
| RLS policy definitions | EVT-005 (Audit Log via migration) | `supabase/migrations/` | Indefinite (source control) | Schema migration records RLS policy creation |
| Cross-org isolation test results | EVT-005 (Audit Log) | QA-to-Red test output | QA artefact | Mandatory RLS bypass test per TR-032 |
| Organisation assignment | EVT-005 (Audit Log) | `mmm_audit_logs` (USER_INVITE, USER_ACCEPT_INVITE) | 7 years | `organisation_id` recorded at invitation and acceptance |

---

### Audit Log Controls (TR-038)

| Control Reference | ISO 27001 | NIST CSF |
|------------------|-----------|----------|
| | A.5.33, A.8.15 | PR.PS-04 |

**Evidence Captured by MMM**:

| Evidence Item | Evidence Type | Source Table / Storage | Retention | Notes |
|--------------|---------------|------------------------|-----------|-------|
| All system action events | EVT-005 (Audit Log) | `mmm_audit_logs` | 7 years | Immutable; no UPDATE/DELETE RLS pathway |
| Evidence submission decision | EVT-005 (Audit Log) | `mmm_audit_logs` (EVIDENCE_SUBMIT, EVIDENCE_ACCEPT, EVIDENCE_REJECT) | 7 years | Captures assessor and approver decisions |
| Score changes | EVT-005 + EVT-006 | `mmm_audit_logs` (SCORE_PROPOSE, SCORE_CONFIRM) + `mmm_maturity_scores` | 7 years | Full before/after state in `before_state` / `after_state` columns |
| Admin overrides | EVT-008 (Override Log) | `mmm_override_log` + `mmm_audit_logs` (SCORE_OVERRIDE) | 7 years | Immutable override record with ADMIN identity |
| PIT export events | EVT-010 | `mmm_pit_exports` + `mmm_audit_logs` (PIT_EXPORT_INITIATE, PIT_EXPORT_CONFIRM) | 3 years | 7-step handshake sequence fully logged |
| Report generation events | EVT-011 | `mmm_audit_logs` (REPORT_GENERATE) | 7 years | Report metadata captured; document in Storage |
| Framework lifecycle events | EVT-005 | `mmm_audit_logs` (FRAMEWORK_CREATE, FRAMEWORK_COMPILE, FRAMEWORK_PUBLISH, FRAMEWORK_ARCHIVE) | 7 years | Immutable framework snapshot at publish |
| User management events | EVT-013 | `mmm_audit_logs` (USER_INVITE, USER_ACCEPT_INVITE, USER_ROLE_CHANGE, USER_REMOVE) | 7 years | Full invitation lifecycle |
| AI operation events | EVT-009 | `mmm_audit_logs` (AI_*) + `mmm_ai_interactions` | 3 years | AI decision trail with model and confidence data |

**`mmm_audit_logs` Schema** (TR-038):

| Column | Type | Evidence Role |
|--------|------|---------------|
| `id` | uuid PK | Unique evidence item identifier |
| `action_type` | text NOT NULL | Event category identification |
| `actor_id` | uuid NOT NULL | Who performed the action (non-repudiation) |
| `target_entity_type` | text NOT NULL | What was affected |
| `target_entity_id` | uuid NOT NULL | Which specific record was affected |
| `before_state` | jsonb | State prior to change (for change evidence) |
| `after_state` | jsonb NOT NULL | State after change (current evidence of record) |
| `created_at` | timestamptz NOT NULL | When the event occurred (tamper-evident timestamp) |

---

### Invitation Security Controls (TR-035)

| Control Reference | ISO 27001 | NIST CSF |
|------------------|-----------|----------|
| | A.5.18, A.8.24 | PR.AA-02 |

**Evidence Captured by MMM**:

| Evidence Item | Evidence Type | Source Table / Storage | Retention | Notes |
|--------------|---------------|------------------------|-----------|-------|
| Invitation issuance | EVT-013 | `mmm_invitations` + `mmm_audit_logs` (USER_INVITE) | 7 years | Records inviter, role, scope, token hash (not plaintext), expiry |
| Invitation acceptance | EVT-013 | `mmm_audit_logs` (USER_ACCEPT_INVITE) | 7 years | Records acceptor identity, organisation grant |
| Token invalidation | EVT-013 | `mmm_invitations.used_at` | 7 years | Single-use enforcement: timestamp of first acceptance |
| Expired invitation cleanup | EVT-005 | `mmm_audit_logs` (scheduled cleanup) | 7 years | Hard-delete of unaccepted invitations after 30 days |

---

### Permission Enforcement Controls (TR-036)

| Control Reference | ISO 27001 | NIST CSF |
|------------------|-----------|----------|
| | A.8.2 | PR.AA-05 |

**Evidence Captured by MMM**:

| Evidence Item | Evidence Type | Source Table / Storage | Retention | Notes |
|--------------|---------------|------------------------|-----------|-------|
| Role assignment | EVT-013 | `mmm_profiles` (role column) + `mmm_audit_logs` (USER_INVITE) | 7 years | Role declared at invitation scope |
| Role change | EVT-005 | `mmm_audit_logs` (USER_ROLE_CHANGE) with before/after state | 7 years | ADMIN must authorise role changes |
| Permission denial (403) | — | Edge Function HTTP response log | Per Vercel/Supabase log retention | HTTP 403 returned; not explicitly stored in `mmm_audit_logs` |
| Score override authorisation | EVT-008 | `mmm_override_log` + `mmm_audit_logs` (SCORE_OVERRIDE) | 7 years | ADMIN identity mandatory for override |

---

### AI Governance Controls (TR-033, TR-034)

| Control Reference | ISO 27001 | NIST CSF |
|------------------|-----------|----------|
| | A.8.15, A.8.28 | RS.MA-01 |

**Evidence Captured by MMM**:

| Evidence Item | Evidence Type | Source Table / Storage | Retention | Notes |
|--------------|---------------|------------------------|-----------|-------|
| AI score proposal | EVT-007 | `mmm_score_proposals` | Until confirmed or expired | Non-binding; requires human confirmation before write to `mmm_maturity_scores` |
| Human score confirmation | EVT-006 | `mmm_maturity_scores` (`confirmed_by` non-null) + `mmm_audit_logs` (SCORE_CONFIRM) | 7 years | `confirmed_by` is the evidence of HITL enforcement |
| AI interaction telemetry | EVT-009 | `mmm_ai_interactions` (model, token_count, duration_ms, status, confidence) | 3 years | Full AI decision audit trail including model version |
| AI audit log entry | EVT-005 | `mmm_audit_logs` (action_type: AI_PARSE \| AI_GENERATE \| AI_EVALUATE \| AI_RECOMMEND \| AI_CHAT \| AI_EXPLAIN \| AI_INTERPRET) | 7 years | Dual-log: audit_logs + ai_interactions |
| Circuit breaker state | EVT-005 | Health endpoint `/api/health` (`services.aimc`) | Per health endpoint TTL | OPEN state prevents AI calls; logged in health response |

---

### Evidence Submission Controls (Core MMM Workflow)

| Control Reference | ISO 27001 | NIST CSF |
|------------------|-----------|----------|
| | A.5.33 (records protection) | ID.RA-01 (risk identification) |

**Evidence Captured by MMM**:

| Evidence Item | Evidence Type | Source Table / Storage | Retention | Notes |
|--------------|---------------|------------------------|-----------|-------|
| Document evidence file | EVT-001 | `mmm-evidence` Supabase Storage bucket | 7 years | Private bucket; authenticated access only |
| Voice note file | EVT-002 | `mmm-evidence` Supabase Storage bucket | 7 years | Private bucket; authenticated access only |
| Photo evidence file | EVT-003 | `mmm-evidence` Supabase Storage bucket | 7 years | Private bucket; authenticated access only |
| Integration evidence payload | EVT-004 | `mmm_evidence` table (`evidence_type = 'integration'`, `storage_ref` to external source) | 7 years | Automated pull; source URL captured |
| Evidence submission record | EVT-005 | `mmm_audit_logs` (EVIDENCE_SUBMIT) + `mmm_evidence` table | 7 years | Full submission context: criterion_id, assessor_id, timestamp |
| Evidence decision record | EVT-005 | `mmm_audit_logs` (EVIDENCE_ACCEPT / EVIDENCE_REJECT) | 7 years | Approver identity and decision captured |
| Evidence staleness state | EVT-005 | Computed on read; logged in audit_log if staleness changes state | 7 years | Freshness threshold per TR-025 |

---

### Score Confirmation Evidence (TR-033)

**Evidence Captured by MMM**:

| Evidence Item | Evidence Type | Source Table / Storage | Retention | Notes |
|--------------|---------------|------------------------|-----------|-------|
| Score proposal (AI-generated) | EVT-007 | `mmm_score_proposals` (`source = 'AI'`, `confirmed_by = null`) | Until confirmed | Pre-confirmation; non-binding |
| Confirmed maturity score | EVT-006 | `mmm_maturity_scores` (`confirmed_by` = user UUID) + `mmm_audit_logs` (SCORE_CONFIRM) | 7 years | `confirmed_by` is the legal confirmation evidence |
| Score cascade result | EVT-006 | `mmm_maturity_scores` (criterion / MPS / domain / org level) | 7 years | All levels of the scoring cascade stored |

---

### Infrastructure and Commissioning Evidence (TR-051, TR-053, TR-064)

**Evidence Captured by MMM**:

| Evidence Item | Evidence Type | Source Table / Storage | Retention | Notes |
|--------------|---------------|------------------------|-----------|-------|
| Commissioning check results | EVT-005 (health endpoint) | `/api/health` response + Edge Function logs | Per Vercel/Supabase log retention | CHK-001 through CHK-005; ACTIVATED state only on all-pass |
| Environment variable presence | — | Commissioning check CHK-001/CHK-002 runtime verification | Per health log | `.env.example` provides the documented contract |
| Schema migration state | — | Supabase `schema_migrations` system table (CHK-002) | Indefinite | Commissioning check queries current migration version |
| RLS policy activation | — | Spot-check query at startup (CHK-004) | Per health log | Commissioning check queries for presence of RLS policies |
| Storage bucket accessibility | — | Supabase Storage API check at startup (CHK-005) | Per health log | `mmm-evidence` bucket reachability verified |

---

## Evidence Retention Summary

| Evidence Category | Retention Period | Mechanism | Authority |
|------------------|-----------------|-----------|-----------|
| Evidence files (document, voice, photo, integration) | 7 years | Supabase Storage lifecycle policy | ISO 27001 A.5.33 |
| Audit logs (`mmm_audit_logs`) | 7 years | Immutable; no DELETE RLS pathway | ISO 27001 A.5.33, TR-038 |
| Override log entries | 7 years | Immutable; no DELETE RLS pathway | Non-repudiation requirement |
| Maturity scores | Indefinite (until org closure) | Soft-delete | Core assessment data |
| AI interaction logs (`mmm_ai_interactions`) | 3 years | Soft-delete | FR-065, TR-034 |
| PIT export payloads | 3 years | Soft-delete | TR-017 |
| Score proposals (unconfirmed) | Until confirmed or expired | Service role cleanup | TR-033 |
| Invitation records (unaccepted) | 30 days | Hard-delete via scheduled Edge Function | TR-035 |
| Framework snapshots | Indefinite | Immutable versioned storage | TR-027 |

---

## Evidence Integrity Guarantees

| Guarantee | Mechanism | MMM Implementation |
|-----------|-----------|-------------------|
| Tamper-evident audit log | No UPDATE/DELETE RLS on `mmm_audit_logs` | RLS policy: INSERT only via service role; no role has UPDATE/DELETE |
| Non-repudiation | `actor_id` (uuid) mandatory on every audit log entry | `actor_id uuid NOT NULL` constraint |
| Completeness | All 8 event categories covered by action type vocabulary | 30+ action types across all event categories (TR-038) |
| Temporal accuracy | UTC timestamps via `DEFAULT now()` on Supabase-managed `created_at` | Not modifiable by application code |
| AI decision trail | Dual-log to `mmm_audit_logs` AND `mmm_ai_interactions` | Both tables receive concurrent writes on each AI call |
| Before/after state | `before_state` / `after_state` jsonb columns on audit log | Full state snapshot captured on every scoring change and override |

---

*Evidence collection verification occurs in QA-to-Red (Stage 6). This document covers Architecture-stage evidence design only.*
