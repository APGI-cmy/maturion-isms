# AIMC Knowledge Upload Centre — Governance Specification

**Document Type**: Governance Artefact — CL-5 Deliverable  
**Status**: APPROVED — CP-5 Decisions Recorded — 2026-03-01  
**Version**: 1.1.0  
**Effective Date**: 2026-03-01  
**CP-5 Date**: 2026-03-01  
**Owner**: Maturion Engineering Leadership (Johan Ras, CS2)  
**Location**: `governance/aimc/AIMC_KNOWLEDGE_UPLOAD_CENTRE_SPECIFICATION.md`

**Programme**: AIMC  
**Source**: AIMC Audit Plan §8 (Knowledge Upload Centre gap); GAP-007; T-D-001 to T-D-006  
**Combined Plan Reference**: Wave CL-5 — `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md`  
**ARC Protocol Reference**: `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md`  
**GRS Reference**: `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md`  
**AAD Reference**: `governance/aimc/AIMC_ARTEFACT_ARCHITECTURE_DESCRIPTION.md`  
**APS Reference**: `governance/aimc/AIMC_AGENT_PROTOCOL_SPECIFICATION.md`  
**Schema Reference**: `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql`  
**Inventory Reference**: `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md`

> ⚠️ **IMPLEMENTATION GATE — HARD BLOCK**
>
> CL-10 (Upload Endpoint Implementation) and CL-11 (Module Integration with Knowledge Retrieval)
> MUST NOT begin until this specification has received CS2 approval at Checkpoint CP-5.
> No builder agent may implement the upload endpoint or any dependent feature without a
> Foreman-issued wave-start authorisation citing this document's CS2-approved status.
> This is an absolute gate. Time pressure does not override it.

---

## 1. Purpose

This document defines the **Knowledge Upload Centre Governance Specification** — the complete, governed specification for the ongoing mechanism by which knowledge items are submitted to the Maturion AIMC Knowledge Base via the `POST /api/ai/knowledge/upload` API endpoint family.

This specification governs:
- The REST API contract for all upload endpoints
- Authentication and authorisation requirements
- The automated ARC trigger protocol that activates upon every upload
- Batch upload semantics and partial success handling
- The step-by-step approval workflow from submission to ARC decision
- Rate limiting, quotas, and abuse prevention
- Validation rules for all input fields
- The dependency relationship with CL-10 (endpoint build) and CL-11 (module integration)

**This specification is distinct from the LKIAC one-time migration** (CL-6). The LKIAC migration (CL-6) is a one-time operation to port knowledge from the legacy Supabase project (`dmhlxhatogrrrvuruayv`). The Knowledge Upload Centre is the **ongoing, governed, operational mechanism** through which new and updated knowledge items enter the Knowledge Base after the LKIAC migration is complete. Both mechanisms ultimately write to the same `ai_knowledge` table and both require ARC review before items are approved, but they differ in invocation, auth, tooling, and governance accountability.

No knowledge item submitted via this upload API may be used in AI context injection until it has completed the ARC review workflow defined in `AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` and reached `approval_status = 'approved'`.

---

## 2. Scope and Boundaries

### 2.1 In Scope

| Area | Description |
|---|---|
| Upload API endpoints | `POST /api/ai/knowledge/upload`, `POST /api/ai/knowledge/upload/batch`, `GET /api/ai/knowledge/upload/{id}/status` |
| ARC trigger protocol | Automatic GitHub issue creation and notification upon every upload |
| Approval workflow | Full lifecycle from upload submission to ARC decision to `ai_knowledge` row update |
| Batch upload semantics | Multi-item upload, partial success, ordering, and response contract |
| Authentication & authorisation | JWT-based auth, role requirements, org scoping |
| Validation rules | All field-level constraints and required-field enforcement |
| Rate limiting & quotas | Per-org upload rate limits and content size limits |
| Traceability | Mapping to ARC protocol, GRS requirements, GAP-007 |

### 2.2 Out of Scope

| Area | Reason |
|---|---|
| LKIAC one-time migration (CL-6) | Separate governance stream; service-role direct insert; governed by LKIAC-001 §5 Wave 3 |
| KnowledgeRetrieverImpl runtime filtering | Already specified and implemented; governed by ARC protocol §5 |
| Freshness monitoring and retirement (Steps 5–6) | Governed by ARC protocol §4 Steps 5–6 |
| AI context assembly order | Governed by AAD §5.8 and APS §7.5 |
| Embedding generation pipeline | Implementation detail for CL-10; deferred to CL-10 architecture review |
| Supabase pgvector indexing | Schema concern; governed by `006_ai_knowledge_metadata.sql` and CL-4 schema audit |

### 2.3 Distinct from LKIAC Migration (CL-6)

| Dimension | Knowledge Upload Centre (CL-5/CL-10) | LKIAC Migration (CL-6) |
|---|---|---|
| **Trigger** | On-demand API call from authorised principal | One-time batch script execution |
| **Auth model** | Supabase JWT + org-scoped role | Service role direct insert |
| **ARC trigger** | Automatic on every upload | Manual ARC review batch submitted post-migration |
| **Frequency** | Ongoing; indefinite operational lifetime | One-time; decommissioned after completion |
| **Content origin** | New knowledge authored or curated by authorised team | Legacy knowledge from `dmhlxhatogrrrvuruayv` |
| **Governance gate** | This specification (CP-5) | LKIAC-001 §5 Wave 3 gate (CP-6) |
| **Governed by** | CL-5-D1 (this document) + CL-10/CL-11 | CL-6-D1 through CL-6-D4 |

---

## 3. API Endpoint Specification

### 3.1 Single Upload — `POST /api/ai/knowledge/upload`

#### 3.1.1 Request

**Method**: `POST`  
**Path**: `/api/ai/knowledge/upload`  
**Content-Type**: `application/json`

**Request Body Schema**:

```json
{
  "content":      "<string>  REQUIRED. The knowledge text content.",
  "domain":       "<string>  REQUIRED. Domain classification. See §7.1 for enum values.",
  "module":       "<string>  REQUIRED. Maturion module this knowledge serves. See §7.2 for enum values.",
  "standard_ref": "<string>  REQUIRED. Governing standard reference. See §7.3 for format.",
  "source":       "<string>  REQUIRED. Source document identifier (free text, ≤ 500 chars).",
  "metadata":     "<object>  OPTIONAL. Arbitrary key-value metadata for additional context.",
  "organisation_id": "<uuid> OPTIONAL. Defaults to the organisation extracted from the JWT claim.",
  "reason":       "<string>  OPTIONAL. Brief justification for inclusion (sent to ARC reviewer). ≤ 1000 chars."
}
```

**Field Definitions**:

| Field | Type | Required | Max Length | Description |
|---|---|---|---|---|
| `content` | `string` | ✅ Yes | 10,000 chars | The knowledge text to be stored and indexed. Must be plain text or Markdown. No executable code. |
| `domain` | `string` | ✅ Yes | Enum | Domain classification from approved taxonomy (§7.1). |
| `module` | `string` | ✅ Yes | Enum | Maturion module this knowledge primarily serves (§7.2). |
| `standard_ref` | `string` | ✅ Yes | 200 chars | Governing standard reference in canonical format (§7.3). |
| `source` | `string` | ✅ Yes | 500 chars | Source document identifier (document name, version, URL). |
| `metadata` | `object` | ❌ No | — | Arbitrary key-value pairs. Stored as JSONB. Not indexed. |
| `organisation_id` | `uuid` | ❌ No | UUID | Defaults to `organisation_id` from JWT. Admins only may override. |
| `reason` | `string` | ❌ No | 1,000 chars | Rationale for inclusion; passed to ARC reviewer in the GitHub issue. |

#### 3.1.2 Response

**Success — `202 Accepted`**:

```json
{
  "item_id":        "<uuid>   The UUID of the newly created ai_knowledge row.",
  "approval_status": "pending",
  "arc_request_id": "<string> The GitHub issue number/URL created to track ARC review.",
  "message":        "Knowledge item submitted. ARC review has been triggered.",
  "submitted_at":   "<iso-8601 timestamp>"
}
```

> **Note**: The endpoint returns `202 Accepted` (not `201 Created`) because the knowledge item
> is not yet active — it is pending ARC review. The item will not be used in AI interactions
> until `approval_status` transitions to `'approved'`.

#### 3.1.3 Error Responses

| HTTP Status | Error Code | Condition |
|---|---|---|
| `400 Bad Request` | `VALIDATION_ERROR` | Missing required field, field fails validation rule, or enum value not recognised |
| `400 Bad Request` | `CONTENT_TOO_LONG` | `content` exceeds 10,000 characters |
| `400 Bad Request` | `INVALID_STANDARD_REF` | `standard_ref` does not match canonical format (§7.3) |
| `401 Unauthorised` | `AUTH_REQUIRED` | No valid Supabase JWT present in `Authorization` header |
| `403 Forbidden` | `INSUFFICIENT_PERMISSIONS` | JWT present but principal does not hold the `knowledge_uploader` role or higher |
| `403 Forbidden` | `ORG_SCOPE_VIOLATION` | `organisation_id` in request body does not match JWT claim (non-admin principal) |
| `409 Conflict` | `DUPLICATE_CONTENT` | Identical `content` + `domain` + `module` combination already exists with `approval_status = 'pending'` or `'approved'` for this organisation |
| `429 Too Many Requests` | `RATE_LIMIT_EXCEEDED` | Organisation upload quota exceeded (§6) |
| `500 Internal Server Error` | `ARC_TRIGGER_FAILED` | Item inserted but GitHub issue creation failed; item remains `pending`; ARC chair is notified via fallback channel |
| `500 Internal Server Error` | `INTERNAL_ERROR` | Unexpected server error; request may be retried |
| `503 Service Unavailable` | `SERVICE_UNAVAILABLE` | Supabase or embedding pipeline temporarily unavailable |

**Error Response Body Schema**:

```json
{
  "error":   "<string> VALIDATION_ERROR | AUTH_REQUIRED | etc.",
  "message": "<string> Human-readable description of the error.",
  "field":   "<string> (OPTIONAL) The specific field that failed validation.",
  "details": "<object> (OPTIONAL) Additional diagnostic context."
}
```

---

### 3.2 Batch Upload — `POST /api/ai/knowledge/upload/batch`

#### 3.2.1 Request

**Method**: `POST`  
**Path**: `/api/ai/knowledge/upload/batch`  
**Content-Type**: `application/json`

**Request Body Schema**:

```json
{
  "items": [
    {
      "content":      "<string> REQUIRED.",
      "domain":       "<string> REQUIRED.",
      "module":       "<string> REQUIRED.",
      "standard_ref": "<string> REQUIRED.",
      "source":       "<string> REQUIRED.",
      "metadata":     "<object> OPTIONAL.",
      "reason":       "<string> OPTIONAL."
    }
  ]
}
```

**Constraints**:
- Maximum batch size: **25 items** per request (see §6.3)
- All items in a batch must belong to the same `organisation_id` (extracted from JWT)
- Each item is validated independently; validation rules from §7 apply to every item

#### 3.2.2 Response

**Success (all items accepted) — `202 Accepted`**:

```json
{
  "batch_id":       "<uuid>  Unique identifier for this batch submission.",
  "total":          5,
  "accepted":       5,
  "rejected":       0,
  "submitted_at":   "<iso-8601>",
  "items": [
    {
      "index":          0,
      "item_id":        "<uuid>",
      "approval_status": "pending",
      "arc_request_id": "<string>",
      "status":         "accepted"
    }
  ]
}
```

**Partial Success — `207 Multi-Status`**:

```json
{
  "batch_id":     "<uuid>",
  "total":        5,
  "accepted":     3,
  "rejected":     2,
  "submitted_at": "<iso-8601>",
  "items": [
    {
      "index":          0,
      "item_id":        "<uuid>",
      "approval_status": "pending",
      "arc_request_id": "<string>",
      "status":         "accepted"
    },
    {
      "index":          1,
      "status":         "rejected",
      "error":          "VALIDATION_ERROR",
      "message":        "Field 'domain' is required.",
      "field":          "domain"
    }
  ]
}
```

#### 3.2.3 Batch Semantics

| Behaviour | Rule |
|---|---|
| **Ordering** | Items are processed in array order. Index 0 is processed first. |
| **Partial success** | Each item is validated and inserted independently. Failure of one item does NOT abort the batch. |
| **ARC trigger** | One ARC GitHub issue is created per **accepted** item. Items sharing a `domain` and `module` in the same batch MAY be grouped into a single ARC issue at the implementer's discretion; this must be documented in the ARC issue body. |
| **Atomicity** | Batch is NOT atomic. Accepted items are persisted even if some items are rejected. |
| **Rate limit** | Each item in the batch counts individually against the per-org daily upload quota (§6.1). |
| **Duplicate check** | Duplicate detection (§3.1.3 `DUPLICATE_CONTENT`) applies to each item independently. |
| **Max size enforcement** | If `items.length > 25`, the entire request is rejected with `400 Bad Request` / `BATCH_TOO_LARGE`. |

---

### 3.3 Upload Status Query — `GET /api/ai/knowledge/upload/{id}/status`

#### 3.3.1 Request

**Method**: `GET`  
**Path**: `/api/ai/knowledge/upload/{id}/status`  
**Path Parameter**: `id` — the UUID of a knowledge item returned by a prior upload response

#### 3.3.2 Response

**Success — `200 OK`**:

```json
{
  "item_id":        "<uuid>",
  "organisation_id": "<uuid>",
  "domain":         "<string>",
  "module":         "<string>",
  "standard_ref":   "<string>",
  "source":         "<string>",
  "approval_status": "pending | approved | retired",
  "arc_request_id": "<string | null>",
  "arc_reviewed_by": "<string | null>",
  "arc_reviewed_at": "<iso-8601 | null>",
  "arc_notes":       "<string | null>",
  "freshness_date":  "<iso-8601 | null>",
  "submitted_at":    "<iso-8601>",
  "updated_at":      "<iso-8601>"
}
```

**Error Responses**:

| HTTP Status | Error Code | Condition |
|---|---|---|
| `401 Unauthorised` | `AUTH_REQUIRED` | No valid Supabase JWT |
| `403 Forbidden` | `ORG_SCOPE_VIOLATION` | Item belongs to a different organisation than the requesting principal's JWT claim |
| `404 Not Found` | `ITEM_NOT_FOUND` | No `ai_knowledge` row exists for the given `id` within the requesting organisation |

---

## 4. Authentication and Authorisation

### 4.1 Authentication Mechanism

All Knowledge Upload Centre endpoints use **Supabase JWT authentication** consistent with the existing AIMC API endpoints (`api/ai/request.ts`, `api/ai/health.ts`).

| Component | Value |
|---|---|
| **Header** | `Authorization: Bearer <supabase_jwt>` |
| **JWT issuer** | Supabase project JWT issuer (`VITE_SUPABASE_URL`) |
| **JWT verification** | Server-side via Supabase service role key (`SUPABASE_SERVICE_ROLE_KEY`) or `VITE_SUPABASE_ANON_KEY` + RLS |
| **Organisation scope** | `organisation_id` is extracted from the JWT claim `organisation_id`. All database writes are scoped to this value. |
| **Token lifetime** | Standard Supabase session token lifetime (configurable per project). Upload endpoints do not refresh tokens. |

### 4.2 Authorisation — Permitted Roles

| Role | Upload (Single) | Upload (Batch) | Status Query | Notes |
|---|---|---|---|---|
| `knowledge_uploader` | ✅ Yes | ✅ Yes | ✅ Yes | Standard upload role. Cannot override `organisation_id`. |
| `knowledge_admin` | ✅ Yes | ✅ Yes | ✅ Yes | May upload on behalf of their own organisation only. Inherits `knowledge_uploader` permissions. |
| `org_admin` | ✅ Yes | ✅ Yes | ✅ Yes | May override `organisation_id` to any sub-org within their tenant boundary. |
| `service_role` | ✅ Yes | ✅ Yes | ✅ Yes | For programmatic/scripted use. Used by LKIAC migration script (CL-6) with distinct governance path. |
| `anonymous` / no auth | ❌ No | ❌ No | ❌ No | All unauthenticated requests are rejected with `401 Unauthorised`. |

### 4.3 Org Scoping Invariants

The following rules are **non-negotiable** and MUST be enforced at both the API handler level and by Supabase RLS (consistent with GRS-008):

1. A principal with role `knowledge_uploader` or `knowledge_admin` MAY ONLY upload knowledge items tagged with their own `organisation_id` (from JWT claim). Any attempt to supply a different `organisation_id` in the request body MUST be rejected with `403 Forbidden / ORG_SCOPE_VIOLATION`.
2. A principal performing a status query MAY ONLY query items belonging to their own organisation. Cross-org status queries MUST return `404 Not Found` (not `403`) to avoid org ID enumeration.
3. The Supabase RLS policy on `ai_knowledge` MUST enforce `organisation_id = auth.jwt()->>'organisation_id'` for all INSERT, SELECT, UPDATE, and DELETE operations.
4. The service role bypass of RLS is permitted for LKIAC migration (CL-6) only and MUST NOT be exposed through the upload API endpoints specified here.

### 4.4 RLS Policy Requirement

The `ai_knowledge` table RLS policy MUST include the following (addition to existing policy from migration `006_ai_knowledge_metadata.sql`):

```sql
-- INSERT policy: only authenticated users may insert their own org's knowledge items
-- Cast required: auth.jwt()->>'organisation_id' returns TEXT; ai_knowledge.organisation_id is UUID.
CREATE POLICY "knowledge_upload_insert_own_org"
  ON ai_knowledge
  FOR INSERT
  WITH CHECK (organisation_id = (auth.jwt()->>'organisation_id')::uuid);

-- SELECT policy: users may only read their own org's knowledge items
CREATE POLICY "knowledge_select_own_org"
  ON ai_knowledge
  FOR SELECT
  USING (organisation_id = (auth.jwt()->>'organisation_id')::uuid);
```

> **Note**: The exact RLS policy implementation is the responsibility of the `schema-builder`
> agent in CL-10. This specification defines the required behaviour; the SQL above is illustrative.
> The final implementation must be validated by the `qa-builder` RED gate suite before CL-10 merges.

---

## 5. ARC Trigger Protocol

### 5.1 Overview

Every successfully inserted knowledge item (single or batch) MUST automatically trigger an ARC review request. This trigger is non-optional. An upload that succeeds in inserting to the database but fails to trigger the ARC process is a **partial failure** and MUST be handled per §5.4.

The ARC trigger protocol connects the upload API to the ARC Knowledge Promotion Protocol (`AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` §4 Step 2).

### 5.2 ARC Trigger Flow — AMC-Governed Approval (Option C)

> **CP-5 Decision (OQ-004) — Default Policy**: All ARC triggers are routed to the **App Management Centre (AMC)** FIRST. No GitHub issue is ever created without explicit **YES** or **NO** approval from CS2 in AMC. All ARC trigger events (not just failures) are queued in AMC before any GitHub issue is created. Approvals and dismissals are fully audited in AMC. This Option C default holds until CS2 explicitly changes it in AMC settings.

Upon successful database insertion, the upload handler MUST queue the ARC trigger data in the AMC for CS2 review. The flow is:

1. **Upload succeeds** → knowledge item row inserted with `approval_status = 'pending'`
2. **ARC trigger data queued in AMC** → the upload handler writes the trigger event (item_id, domain, module, standard_ref, source, uploader identity, submitted_at, reason, batch_id if applicable) to the AMC ARC review queue. No GitHub issue is created at this step.
3. **`202 Accepted` returned to caller** → response includes `item_id`, `approval_status: "pending"`, and `arc_request_id: null` (the arc_request_id is not yet available; see §5.3).
4. **CS2 reviews in AMC** → CS2 sees the pending ARC trigger in the AMC review queue and makes a **YES** (create GitHub issue) or **NO** (dismiss with audit record) decision.
5. **On YES** → AMC creates the GitHub issue per the template below; the `arc_request_id` field on the `ai_knowledge` row is updated with the GitHub issue URL; uploader may poll `GET /api/ai/knowledge/upload/{id}/status` to obtain the `arc_request_id` once available.
6. **On NO** → AMC records a dismissal with full audit trail (dismissal reason, CS2 identity, timestamp). The `arc_request_id` remains null. The item remains in `approval_status = 'pending'` or is updated per CS2 instruction recorded in AMC.

**ARC GitHub Issue Template** (created by AMC upon CS2 YES decision):

**Issue Title**: `[ARC] Knowledge Review Request — {domain} / {module} / {item_id}`

**Issue Body Template**:

```markdown
## ARC Knowledge Review Request

**Item ID**: {item_id}
**Organisation**: {organisation_id}
**Domain**: {domain}
**Module**: {module}
**Standard Ref**: {standard_ref}
**Source**: {source}
**Submitted By**: {uploader_identity}
**Submitted At**: {submitted_at}
**Reason for Inclusion**: {reason | "Not provided"}

---

## Content Preview

```
{content_preview}...
```
*(Truncated at word boundary, max 500 chars. Full content stored in ai_knowledge row — query by item_id.)*

---

## ARC Reviewer Actions

ARC Reviewer MUST update the `ai_knowledge` row with the following fields:
- `arc_reviewed_by`: reviewer identity
- `arc_reviewed_at`: review timestamp
- `arc_notes`: review notes (mandatory if rejecting)
- `approval_status`: set to `approved` or leave as `pending` if revision required

Review criteria: Accuracy, Relevance, Freshness, No sensitive data, Format quality, Scope compliance.
See: `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` §4 Step 3.

**ARC Chair**: @APGI-cmy
```

**Issue Labels**: `arc-review`, `knowledge-upload`, `{domain}`, `{module}` (if label exists; skip if not)  
**Issue Assignee**: `@APGI-cmy` (ARC Chair, CS2)

### 5.3 arc_request_id Population

Under the AMC-governed Option C flow (§5.2), the GitHub issue is created asynchronously after CS2 approves the ARC trigger in AMC. Consequently:

1. The initial upload response (`202 Accepted`) returns `arc_request_id: null` — the issue does not exist yet at upload time.
2. Once CS2 approves the trigger in AMC and AMC creates the GitHub issue, AMC MUST update the `ai_knowledge` row: store the GitHub issue URL in `arc_request_id` (implementation detail for CL-10).
3. The uploader MAY poll `GET /api/ai/knowledge/upload/{id}/status` to check when `arc_request_id` transitions from `null` to a populated issue URL, indicating the GitHub issue has been created.

### 5.4 ARC Trigger Failure Handling — AMC-Governed

Under the AMC Option C policy, all ARC trigger events are routed through AMC before any GitHub issue creation. AMC is the authoritative channel for all trigger events, including failure recovery. The fallback channel is governed by AMC, not by direct email/Slack notification.

If the AMC queue write fails after successful database insertion:

| Step | Action |
|---|---|
| 1 | Return `500 Internal Server Error` with error code `ARC_TRIGGER_FAILED` |
| 2 | Include the `item_id` in the response body so the caller can track the item |
| 3 | Log the failure with item_id, timestamp, and error detail to AIMC telemetry (`ai_telemetry` table) |
| 4 | The item remains in `approval_status = 'pending'` (correctly) |
| 5 | AMC handles all ARC trigger events including failures; no direct GitHub issue is ever created outside AMC approval. The ARC Chair (`@APGI-cmy`) is notified via AMC of the failure event for manual resolution. |
| 6 | The ARC Chair resolves the failure from within AMC (creating the review issue on YES, or dismissing on NO, with full audit record) |

> **Note**: The Option C default means all trigger events — including failure recovery — go through AMC before any GitHub issue creation. There is no direct bypass to GitHub issue creation under this policy.

### 5.5 Review Queue Management

ARC review issues are managed as a queue:
- Issues are reviewed in order of creation (oldest first) unless CS2 sets a priority label
- Bulk uploads from a single batch submission should reference the `batch_id` in each issue for traceability
- Maximum queue depth: no hard limit; however CS2 may pause upload capability (via `AIMC_UPLOAD_PAUSED` environment flag in the endpoint handler) if the review queue exceeds 50 outstanding items

### 5.6 Batch ARC Issue Grouping (OQ-003 — CP-5 Decision)

> **CP-5 Decision (OQ-003)**: The following grouping rules apply to ARC GitHub issues created for batch uploads (upon CS2 YES decision in AMC per §5.2). This supersedes the discretionary guidance in §3.2.3.

| Batch Size | ARC Issue Grouping Rule |
|---|---|
| **≤ 5 documents** | **1 individual ARC GitHub issue per document**. Each item in the batch gets its own issue, ensuring full individual traceability. |
| **> 5 documents** | **1 grouped ARC GitHub issue for the entire batch**. The grouped issue contains a checklist item per document (one `- [ ] item_id: {item_id} — {domain}/{module}` line per item). The `batch_id` is the issue title reference. |

**Grouped Issue Title** (for batches > 5): `[ARC] Batch Knowledge Review — batch_id: {batch_id} ({N} items)`

**Checklist Format** (within grouped issue body):
```markdown
## Items for Review

- [ ] `{item_id_1}` — {domain_1} / {module_1} — {source_1}
- [ ] `{item_id_2}` — {domain_2} / {module_2} — {source_2}
...
```

The ARC Reviewer marks each checklist item as reviewed and updates the corresponding `ai_knowledge` row individually. The grouped issue is closed when all checklist items are resolved.

---

## 6. Rate Limiting and Quotas

### 6.1 Per-Organisation Daily Upload Quota

> **CP-5 Decision (OQ-005)**: Default quota limits are AMC-controlled, not hardcoded. CS2 can adjust per-org or global quotas in real time from AMC settings without any code change or redeployment. See §6.6 for the full AMC quota management policy.

| Quota | Default Limit (AMC-controlled) | Reset | Enforcement |
|---|---|---|---|
| Single uploads per org per day | **50 items** *(AMC default — adjustable)* | Midnight UTC | API handler + `ai_telemetry` count query |
| Batch uploads per org per day | **5 batches** *(AMC default — adjustable)* | Midnight UTC | API handler + `ai_telemetry` count query |
| Total items per org per day (single + batch combined) | **100 items** *(AMC default — adjustable)* | Midnight UTC | Enforced at item insertion, not batch level |

### 6.2 Content Size Limits

| Field | Maximum | Enforcement |
|---|---|---|
| `content` | 10,000 characters | Request validation (pre-insert) |
| `source` | 500 characters | Request validation (pre-insert) |
| `standard_ref` | 200 characters | Request validation (pre-insert) |
| `reason` | 1,000 characters | Request validation (pre-insert) |
| `metadata` | 4,096 bytes (serialised JSON) | Request validation (pre-insert) |

### 6.3 Batch Size Limits

| Limit | Value | Enforcement |
|---|---|---|
| Maximum items per batch request | 25 | Immediate rejection if `items.length > 25` |
| Minimum items per batch request | 2 | If `items.length < 2`, use the single-upload endpoint |

### 6.4 Rate Limit Response

When a quota is exceeded, the endpoint MUST return:
- HTTP `429 Too Many Requests`
- Error code `RATE_LIMIT_EXCEEDED`
- `Retry-After` header set to the number of seconds until the daily quota resets

### 6.5 Emergency Pause

CS2 may set environment flag `AIMC_UPLOAD_PAUSED=true` on the Vercel deployment to pause all uploads (returns `503 Service Unavailable` with message "Knowledge upload is temporarily paused. Contact CS2."). This mechanism is reserved for ARC queue overflow or security incidents.

### 6.6 AMC-Controlled Dynamic Quota Management (OQ-005 — CP-5 Decision)

> **CP-5 Decision (OQ-005)**: Upload quotas are scalable and AMC-controlled. No code change or redeployment is required to scale quotas. All quota changes are fully audited.

| Capability | Description |
|---|---|
| **Real-time monitoring** | AMC monitors upload quota usage in real time per organisation and globally. CS2 can view current usage levels from the AMC dashboard at any time. |
| **80% threshold alert** | AMC automatically alerts CS2 when any organisation reaches 80% of its daily quota (single or batch). This provides advance warning before the quota is hit. |
| **Quota hit alert** | AMC alerts CS2 immediately when any organisation hits its quota limit (i.e., when a `429 RATE_LIMIT_EXCEEDED` response is generated). |
| **Per-org quota adjustment** | CS2 can increase or decrease the daily quota for a specific organisation directly from AMC settings in real time. No code change or redeployment required. |
| **Global quota adjustment** | CS2 can adjust the global default quota (applied to all organisations without a per-org override) from AMC settings in real time. No code change or redeployment required. |
| **Full audit trail** | Every quota change (who changed it, what value, when, and for which org) is recorded in the AMC audit log. No quota change can be made without an audit record. |
| **Scalability guarantee** | The quota system is designed to scale without code changes. CS2 can raise limits as usage grows by updating AMC settings alone. |

---

## 7. Validation Rules

### 7.1 Domain Enum Values

The `domain` field MUST be one of the following values (extends the taxonomy established in `AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` §4 Step 1 and the LKIAC CL-2 domain tagging map):

| Value | Description | Standards Most Commonly Referenced |
|---|---|---|
| `access-control` | Identity, authentication, authorisation, least privilege | ISO-27001-A.9, NIST-SP-800-53-AC-* |
| `risk-management` | Risk assessment, treatment, appetite, register management | ISO-27001-A.6, NIST-SP-800-53-RA-* |
| `vulnerability-management` | Vulnerability scanning, patching, remediation tracking | ISO-27001-A.12, NIST-SP-800-53-SI-* |
| `incident-management` | Incident response, classification, escalation, lessons learned | ISO-27001-A.16, NIST-SP-800-53-IR-* |
| `compliance` | Regulatory compliance mapping, evidence collection, audit trail | ISO-27001 general, PCI-DSS, SOC2 |
| `asset-management` | Asset inventory, classification, ownership, lifecycle | ISO-27001-A.8, NIST-SP-800-53-CM-* |
| `cryptography` | Encryption standards, key management, certificate lifecycle | ISO-27001-A.10, NIST-SP-800-53-SC-* |
| `business-continuity` | BCP, DRP, RTO/RPO targets, testing | ISO-27001-A.17, NIST-SP-800-53-CP-* |
| `supplier-management` | Third-party risk, vendor assessment, supply chain | ISO-27001-A.15, NIST-SP-800-53-SR-* |
| `physical-security` | Physical access controls, environmental controls | ISO-27001-A.11, NIST-SP-800-53-PE-* |
| `general` | Cross-domain knowledge not fitting a specific category | Any |

> **Extension Process**: Additional domain values require a CS2-approved taxonomy amendment.
> Submit extension requests to CS2 citing GAP-007 and the new domain's rationale.

### 7.2 Module Enum Values

The `module` field MUST be one of the following values:

| Value | Description |
|---|---|
| `MAT` | Maturion Maturity Assessment Tool |
| `PIT` | Penetration Intelligence Tool |
| `XDETECT` | Threat Detection and XDR Module |
| `Builder` | Maturion Builder / Low-Code Module |
| `Command` | Maturion Command Centre / Dashboard |
| `AIMC` | AI Management Centre itself (meta-knowledge) |
| `general` | Applies to multiple modules or no specific module |

### 7.3 standard_ref Format

The `standard_ref` field MUST conform to one of the following canonical formats:

| Standard | Format Pattern | Example |
|---|---|---|
| ISO/IEC 27001:2022 | `ISO-27001-A.<control>` | `ISO-27001-A.9.1` |
| NIST SP 800-53 Rev 5 | `NIST-SP-800-53-<family>-<control>` | `NIST-SP-800-53-AC-2` |
| PCI DSS v4.0 | `PCI-DSS-v4-<req>.<sub>` | `PCI-DSS-v4-8.2` |
| SOC 2 (AICPA) | `SOC2-<category>-<criterion>` | `SOC2-CC6-1` |
| ISO/IEC 27002:2022 | `ISO-27002-<section>.<control>` | `ISO-27002-8.2` |
| Custom / Internal | `CUSTOM-<identifier>` | `CUSTOM-MATURION-RISK-001` |

A `standard_ref` value that does not match any recognised pattern is rejected with `400 INVALID_STANDARD_REF`. Custom references using the `CUSTOM-` prefix are always accepted.

### 7.4 Content Rules

The `content` field MUST satisfy all of the following:

| Rule | Requirement |
|---|---|
| **Minimum length** | At least 50 characters |
| **Maximum length** | At most 10,000 characters |
| **Format** | Plain text or Markdown. HTML tags are stripped before storage. |
| **No credentials** | Must not contain API keys, passwords, tokens, or secrets. Rejected with `400 VALIDATION_ERROR` if a secret-pattern scan detects credential-like content. |
| **No PII** | Must not contain personally identifiable information. A basic PII pattern scan is run at ingestion. |
| **No executable code** | Content is informational. Code blocks in Markdown are permitted only as illustrative examples. |
| **Language** | Content must be in English. |

### 7.5 Required Field Enforcement

A request that omits any required field MUST be rejected immediately with `400 VALIDATION_ERROR` before any database write is attempted. The error response MUST identify the missing field name in the `field` property.

---

## 8. Approval Workflow

The upload API integrates with the ARC Knowledge Promotion Protocol. The complete end-to-end workflow from submission to knowledge activation is:

```
Principal (authorised)
   │
   ▼
[1] POST /api/ai/knowledge/upload
   │  ← JWT validated, org scoping enforced, fields validated
   │
   ▼
[2] ai_knowledge row inserted (approval_status = 'pending')
   │
   ▼
[3] ARC GitHub issue created (auto-trigger)
   │  ← Labels: arc-review, knowledge-upload, {domain}, {module}
   │  ← Assignee: @APGI-cmy (ARC Chair)
   │
   ▼
[4] 202 Accepted returned to caller (item_id + arc_request_id)
   │
   ▼
[5] ARC Reviewer reviews item against 6 criteria
   │  (Accuracy, Relevance, Freshness, No sensitive data,
   │   Format quality, Scope compliance)
   │  Ref: AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md §4 Step 3
   │
   ├─── APPROVED ────────────────────────────────────────────────────────┐
   │    ↓                                                                 │
   │   [6a] ARC Reviewer updates ai_knowledge row:                        │
   │        • approval_status = 'approved'                                │
   │        • freshness_date = now()                                      │
   │        • arc_reviewed_by = reviewer identity                         │
   │        • arc_reviewed_at = now()                                     │
   │        • arc_notes = approval notes                                  │
   │   [6b] AIMC_KNOWLEDGE_BASE_INVENTORY.md updated                      │
   │   [6c] Uploader notified (GitHub issue comment + close)              │
   │   [6d] Item now active: KnowledgeRetrieverImpl returns it            │
   │        (approvalStatus === 'approved' filter passes)                 │
   │                                                                      │
   └─── REJECTED / REVISION REQUIRED ────────────────────────────────────┘
        ↓
       [6e] ARC Reviewer updates ai_knowledge row:
            • approval_status remains 'pending'
            • arc_reviewed_by = reviewer identity
            • arc_reviewed_at = now()
            • arc_notes = MANDATORY rejection reason
       [6f] Uploader notified (GitHub issue comment — rejection reason)
       [6g] Uploader may correct content and re-submit (new upload)
            OR update the existing row and request re-review
       [6h] Item remains EXCLUDED from AI context injection
```

### 8.1 SLA Targets

| Step | Target | Owner |
|---|---|---|
| ARC issue creation after upload | < 30 seconds | Upload API (automated) |
| ARC Reviewer acknowledges review request | ≤ 3 business days | ARC Reviewer |
| ARC decision (approve/reject) | ≤ 5 business days | ARC Reviewer |
| Uploader notification after decision | < 24 hours | ARC Reviewer (GitHub issue comment) |

### 8.2 Escalation Path

Consistent with ARC protocol §7:

| Scenario | Escalation |
|---|---|
| ARC Reviewer unavailable | Escalate to ARC Chair (CS2 — @APGI-cmy) |
| Review criteria ambiguous for specific item | ARC Chair makes final determination; documents reasoning in `arc_notes` |
| ARC GitHub issue creation fails | Handler catches exception, logs to telemetry, notifies CS2 via fallback (§5.4) |
| Uploader disputes rejection | Uploader escalates to CS2 via GitHub issue; CS2 makes final determination |
| Bulk upload exceeds review capacity | CS2 approves prioritisation order; lower-priority items remain `pending` |

---

## 9. Architecture Review — Upload Endpoint

### 9.1 Current API Landscape

The existing AIMC API endpoints follow the Vercel serverless pattern at `api/ai/`:

| Endpoint | File | Method | Purpose |
|---|---|---|---|
| `GET /api/ai/health` | `api/ai/health.ts` | Health check | Reports gateway operational status |
| `POST /api/ai/request` | `api/ai/request.ts` | AI capability requests | Routes requests through AICentre gateway |
| `POST /api/ai/feedback` | `api/ai/feedback.ts` | Feedback submission | Records user feedback on AI responses |

The upload endpoint family will extend this pattern. New files to be created in CL-10:

| Endpoint | File | Method | Purpose |
|---|---|---|---|
| `POST /api/ai/knowledge/upload` | `api/ai/knowledge/upload.ts` | Single knowledge item upload | Governed by this specification |
| `POST /api/ai/knowledge/upload/batch` | `api/ai/knowledge/upload/batch.ts` | Batch knowledge item upload | Governed by this specification |
| `GET /api/ai/knowledge/upload/[id]/status.ts` | `api/ai/knowledge/upload/[id]/status.ts` | Status query | Governed by this specification |

### 9.2 Integration Points

The upload endpoint must integrate with the following existing AIMC components:

| Component | Integration Point | Required For |
|---|---|---|
| Supabase client (`@supabase/supabase-js`) | Database INSERT to `ai_knowledge` table | Item persistence |
| JWT validation | `Authorization` header verification | Auth enforcement |
| `ai_telemetry` table | Rate limit tracking, ARC trigger failure logging | Quota enforcement, audit trail |
| GitHub REST API | Issue creation for ARC trigger | §5 ARC Trigger Protocol |
| `KnowledgeRetrieverImpl` | None at upload time — retriever reads only; approval_status = 'pending' on insert excludes new items | Runtime filter ensures new items not used until approved |

### 9.3 Architecture Constraints for CL-10 Implementation

The CL-10 implementation MUST observe the following architectural constraints derived from the AAD and APS:

| Constraint | Source | Requirement |
|---|---|---|
| **Tenant isolation** | GRS-008, APS §7.3 | Every INSERT to `ai_knowledge` MUST include `organisation_id` from JWT. RLS enforces this at database layer. |
| **No direct provider calls** | GRS-001, GRS-016, AAD §2 | Upload handler MUST NOT call any AI provider (no embedding at upload time unless explicitly authorised by CS2 in CL-10 wave-start). |
| **Package boundary** | GRS-009 | Upload endpoint handler lives in `api/ai/` (serverless layer), NOT in `packages/ai-centre/`. Knowledge schema operations belong to `packages/ai-centre/supabase/`. |
| **TypeScript strict compliance** | GRS-026, AAD §4 | All upload handler files MUST pass `tsc --strict` with zero errors. |
| **Telemetry** | GRS-012 | Upload events SHOULD generate a telemetry record in `ai_telemetry` for audit purposes. Capability type: `knowledge-upload`. |
| **Immutable telemetry** | GRS-013 | Upload telemetry records MUST NOT be modifiable after write. RLS DELETE and UPDATE MUST be denied. |
| **Vercel serverless pattern** | AAD §5, existing `api/ai/` handlers | Handlers export a default function or named `handler` compatible with Vercel serverless runtime. |

### 9.4 CL-11 Dependency Declaration

CL-11 (Module Integration with Knowledge Retrieval — domain specialist query routing) is directly dependent on:
1. This specification (CL-5) being CS2-approved (CP-5)
2. The upload endpoint (CL-10) being implemented, tested, and merged

CL-11 MUST NOT begin until both CL-5 and CL-10 are closed. The `KnowledgeRetrieverImpl` already enforces the `approval_status = 'approved'` filter; CL-11 wires domain specialist agents to use it. The upload API (CL-10) must be in place so that the knowledge base can be populated (via approved items) before CL-11 module integration is validated end-to-end.

---

## 10. Traceability

| Requirement | Source Document | Reference |
|---|---|---|
| Knowledge Upload Centre gap | AIMC Audit Plan | GAP-007 |
| CL-5 wave deliverable | Combined Execution Plan | `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` §CL-5 |
| ARC review workflow | ARC Knowledge Promotion Protocol | `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` §4 Steps 1–4 |
| Approval status schema | Schema migration | `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql` |
| Tenant isolation requirement | GRS | GRS-008 — org-scoped `organisation_id` isolation |
| Schema ownership | GRS | GRS-009 — all AI schema owned by `packages/ai-centre/` |
| Persona/knowledge segregation | GRS | GRS-011 — app agents vs. build agents namespace boundary |
| Telemetry for every request | GRS | GRS-012, GRS-013 — immutable telemetry requirement |
| Supabase schema + RLS | GRS | GRS-027 — all AI tables in `packages/ai-centre/supabase/migrations/` with RLS |
| Context assembly with domain knowledge | GRS | GRS-030 — domain knowledge as segment 4 of context window |
| API architecture pattern | AAD | `governance/aimc/AIMC_ARTEFACT_ARCHITECTURE_DESCRIPTION.md` §5, §8 |
| Authentication model | APS | `governance/aimc/AIMC_AGENT_PROTOCOL_SPECIFICATION.md` §7, §10 |
| Wave gate model | APS | APS §10.1 — GRS-019, GRS-023: no implementation without Foreman wave-start citing CS2 approval |
| Runtime knowledge gate | KnowledgeRetrieverImpl | `packages/ai-centre/src/memory/KnowledgeRetrieverImpl.ts` (approvalStatus filter) |
| CL-10 dependency (endpoint build) | Combined Plan | CL-10 MUST NOT begin until CP-5 (this document) is approved |
| CL-11 dependency (module integration) | Combined Plan | CL-11 MUST NOT begin until CL-10 is closed |
| Knowledge Base Inventory | Inventory doc | `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md` — updated on ARC approval |
| Upload endpoint test suite | CL-10 RED gate | `qa-builder` must produce RED gate tests (T-D-001 through T-D-006) before CL-10 implementation |

---

## 11. Open Questions — Resolved at CP-5 (2026-03-01)

All open questions from the original draft were resolved by CS2 at Checkpoint CP-5 on 2026-03-01. The decisions below are now binding and incorporated into the specification.

| ID | Question | CS2 Decision (CP-5 — 2026-03-01) | Applied In |
|---|---|---|---|
| OQ-001 | Should the upload endpoint generate embeddings at upload time (synchronous) or defer to a background job? | **Background job** — Upload returns immediately (`202 Accepted`); embedding runs asynchronously. A status indicator is shown to the uploader until embedding is complete. | §9.3 (no direct provider calls at upload time), polling via `GET /api/ai/knowledge/upload/{id}/status` |
| OQ-002 | Should the `metadata` field accept nested objects or only flat key-value pairs? | **Flat key-value only** — No nested objects permitted. Key naming convention: `{domain}_{field}` (e.g. `source_org`, `author_role`). Nested objects MUST be rejected with `400 VALIDATION_ERROR`. | §7 Validation Rules (for implementation in CL-10) |
| OQ-003 | Should ARC issues for items in the same batch/domain/module be grouped into one issue or one issue per item? | **Hybrid** — Batches of ≤ 5 documents: 1 individual ARC issue per document. Batches of > 5 documents: 1 grouped ARC issue with a checklist item per document. | §5.6 |
| OQ-004 | Should the fallback channel for ARC trigger failures be email, Slack, or GitHub at-mention in a sentinel issue? | **AMC-governed, Option C** — No ARC issue is ever created without explicit YES/NO approval from CS2 in the App Management Centre (AMC). All ARC triggers (not just failures) are routed to AMC first. Approvals and dismissals are fully audited. This default holds until CS2 explicitly changes it in AMC settings. | §5.2, §5.3, §5.4 |
| OQ-005 | Is the 50-item/day per-org quota appropriate for the expected usage volume at launch? | **Scalable, AMC-controlled** — Default: 50 single / 5 batch per org per day. AMC alerts CS2 at 80% threshold and on quota hit. CS2 can adjust per-org or global quotas in real time from AMC settings. All changes are audited. No code change or redeployment required to scale. | §6.1, §6.6 |

---

## 12. Acceptance Criteria

The following criteria map directly to the CL-5 issue acceptance criteria and Combined Plan exit criteria:

- [ ] **AC-1**: `governance/aimc/AIMC_KNOWLEDGE_UPLOAD_CENTRE_SPECIFICATION.md` exists at the specified location in the `governance/aimc/` directory ✅ (this document)
- [ ] **AC-2**: API specification is fully defined for `POST /api/ai/knowledge/upload`, `POST /api/ai/knowledge/upload/batch`, and `GET /api/ai/knowledge/upload/{id}/status` including request schemas, response schemas, all HTTP status codes, and all error codes ✅ (§3)
- [ ] **AC-3**: Authentication and authorisation requirements are fully specified, including permitted roles, JWT mechanism, and org scoping invariants ✅ (§4)
- [ ] **AC-4**: ARC trigger protocol is fully specified, including GitHub issue template, failure handling, and queue management ✅ (§5)
- [ ] **AC-5**: Batch upload semantics are fully specified, including partial success handling, ordering, and batch size limits ✅ (§3.2)
- [ ] **AC-6**: Approval workflow is specified end-to-end from upload → ARC review → approve/reject → notification → status update ✅ (§8)
- [ ] **AC-7**: Rate limiting and quota rules are specified with reset periods and enforcement mechanisms ✅ (§6)
- [ ] **AC-8**: Validation rules are specified for all fields including content rules, enum values, and standard_ref format ✅ (§7)
- [ ] **AC-9**: Traceability to ARC protocol, GRS requirements, GAP-007, and Combined Plan CL-5 is complete ✅ (§10)
- [ ] **AC-10**: Architecture review section confirms CL-11 dependency on CL-10 and CL-10 dependency on this document's CS2 approval ✅ (§9.4)
- [ ] **AC-11**: Document explicitly states that CL-10 and CL-11 MUST NOT begin until this specification is CS2-approved (CP-5) ✅ (header gate notice)
- [x] **AC-12**: Document is reviewed and approved by CS2 (CP-5) — **CP-5 COMPLETE — Decisions recorded 2026-03-01** ✅

---

## 13. CS2 Approval Gate (CP-5)

> **Status**: CP-5 COMPLETE — Decisions recorded 2026-03-01
>
> CP-5 has been completed. CS2 (Johan Ras / @APGI-cmy) conducted the CP-5 review and recorded decisions
> on all 5 open questions (OQ-001 through OQ-005). This document has been updated to version 1.1.0
> to incorporate those decisions. CL-10 implementation may now commence upon Foreman-issued
> wave-start authorisation citing this document's CP-5 approved status.
>
> **CP-5 confirmed that**:
>
> 1. The API contract is complete and fit for implementation
> 2. The ARC trigger protocol is correctly specified (AMC Option C — §5.2)
> 3. The auth model is aligned with existing AIMC security posture
> 4. Rate limits and quotas are appropriate (AMC-controlled dynamic quotas — §6.1, §6.6)
> 5. The implementation dependency chain (CL-5 → CL-10 → CL-11) is correctly declared

### CP-5 Decisions Signed Off

The following CP-5 decisions were recorded by CS2 on 2026-03-01 and are now binding:

| Decision | Summary | Spec Location |
|---|---|---|
| OQ-001 | Background job for embeddings — upload returns immediately; async embedding with status indicator | §9.3, §11 |
| OQ-002 | Flat key-value metadata only; key naming `{domain}_{field}` convention; nested objects rejected | §11 |
| OQ-003 | Hybrid batch ARC grouping: ≤5 items = 1 issue each; >5 items = 1 grouped issue with checklist | §5.6, §11 |
| OQ-004 | AMC-governed Option C: all ARC triggers routed through AMC; no GitHub issue without CS2 YES/NO in AMC; fully audited | §5.2, §5.3, §5.4, §11 |
| OQ-005 | AMC-controlled dynamic quotas: 50/5 defaults; 80% and quota-hit alerts; real-time CS2 adjustment; fully audited; no redeployment required | §6.1, §6.6, §11 |

> **Gate notice**: CP-5 is now complete. CL-10 and CL-11 MUST NOT commence without a Foreman-issued
> wave-start authorisation citing this document (`AIMC_KNOWLEDGE_UPLOAD_CENTRE_SPECIFICATION.md` v1.1.0)
> as the approved CP-5 specification. Time pressure does not override this gate.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Governed By**: AIMC Audit Plan §8; GAP-007; Combined Plan CL-5  
**Process Owner**: Maturion Engineering Leadership  
**Next Review**: On CS2 approval (CP-5), or when CL-10 architecture deviates from this spec  
**Implementation Gate**: CL-10 and CL-11 MUST NOT commence until CP-5 is signed
