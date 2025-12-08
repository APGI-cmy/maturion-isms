# 📄 Maturity Scoring – API Contract v1.0

**Version:** 1.0  
**Owner:** Foreman  
**Applies To:**

- ISMS Portal (apps/isms-portal)
- Supabase Edge Functions
- DB Scoring Tables
- AI Scoring Services
- PIT Integration

---

## 0. Purpose

This API contract defines the complete interface through which the ISMS portal and Supabase backend compute:

- Evidence-level AI scores
- Criterion scores
- MPS scores
- Domain scores
- Organization-wide maturity score

The contract ensures:

- Deterministic scoring
- Predictable API surfaces
- Consistent data flow
- Full compatibility with PIT triggers
- Architecture → QA → Build alignment

---

## 1. API Overview

| Purpose | Method | Endpoint | Component |
|---------|--------|----------|-----------|
| AI score evidence | POST | /evidence-ai-score | Edge Function |
| Run full scoring cycle | POST | /score-maturity-cycle | Edge Function |
| Get criterion score | GET | /maturity/criterion/:id/score | Supabase RPC |
| Get MPS score | GET | /maturity/mps/:id/score | Supabase RPC |
| Get domain score | GET | /maturity/domain/:id/score | Supabase RPC |
| Get org maturity | GET | /maturity/organization/score | Supabase RPC |
| Trigger PIT gaps | POST | /pit/evaluate-gaps | Edge Function |

---

## 2. Evidence AI Scoring API

This corresponds to the Edge Function you already generated:

```
infrastructure/supabase/functions/evidence-ai-score/index.ts
```

---

### 2.1 **POST /evidence-ai-score**

#### **Request Body**

```json
{
  "org_id": "uuid",
  "cycle_id": "uuid",
  "criterion": {
    "id": "uuid",
    "text": "string",
    "target_level": 3
  },
  "evidence_item": {
    "id": "uuid",
    "title": "Training Log",
    "description": "…",
    "uploaded_at": "2025-02-14T15:32:00.000Z",
    "last_updated_at": "2025-02-20T13:00:00.000Z",
    "owner_role": "Security Manager",
    "file_type": "pdf",
    "tags": ["training"],
    "linked_systems": ["LMS"]
  }
}
```

#### **Response Body**

```json
{
  "id": "uuid",
  "evidence_id": "uuid",
  "cycle_id": "uuid",
  "model_name": "gpt-4.1",
  "evidence_type_code": "SOP_PLUS_LOG",
  "base_weight": 0.5,
  "recency_factor": 0.9,
  "metadata_factor": 0.8,
  "confidence": 0.36,
  "issues": ["missing_signature"],
  "comments": "Evidence is moderately strong.",
  "suggested_level": 3,
  "created_at": "2025-02-08T12:00:00Z"
}
```

---

## 3. Full Scoring Pipeline API

### **POST /score-maturity-cycle**

This corresponds to:

```
infrastructure/supabase/functions/score-maturity-cycle/index.ts
```

#### **Request Body**

```json
{
  "org_id": "uuid",
  "cycle_id": "uuid"
}
```

#### **Response**

```json
{
  "message": "Scoring pipeline complete."
}
```

---

## 4. Read-Only Scoring APIs (RPCs)

These are SQL functions you add to Supabase.

Place these functions in:

```
infrastructure/db/migrations/20250208_scoring_api_views.sql
```

I will generate this file *after* the contract.

---

### 4.1 Criterion Score RPC

```
GET /maturity/criterion/:id/score
```

SQL definition:

```sql
create or replace function get_criterion_score(c_id uuid, cycle uuid)
returns jsonb
language sql stable as $$
  select to_jsonb(cs.*)
  from criteria_scores cs
  where cs.criterion_id = c_id
    and cs.cycle_id = cycle
$$;
```

---

### 4.2 MPS Score RPC

```
GET /maturity/mps/:id/score
```

SQL:

```sql
create or replace function get_mps_score(m_id uuid, cycle uuid)
returns jsonb
language sql stable as $$
  select to_jsonb(ms.*)
  from mps_scores ms
  where ms.mps_id = m_id
    and ms.cycle_id = cycle
$$;
```

---

### 4.3 Domain Score RPC

```
GET /maturity/domain/:id/score
```

SQL:

```sql
create or replace function get_domain_score(d_id uuid, cycle uuid)
returns jsonb
language sql stable as $$
  select to_jsonb(ds.*)
  from domain_scores ds
  where ds.domain_id = d_id
    and ds.cycle_id = cycle
$$;
```

---

### 4.4 Organization Score RPC

```
GET /maturity/organization/score?cycle_id=<uuid>&org_id=<uuid>
```

SQL:

```sql
create or replace function get_organization_maturity(o_id uuid, cycle uuid)
returns jsonb
language sql stable as $$
  select to_jsonb(os.*)
  from organization_maturity_scores os
  where os.org_id = o_id
    and os.cycle_id = cycle
$$;
```

---

## 5. Event Triggers

### 5.1 Evidence Upload → AI Scoring

**Trigger:** User uploads new evidence in the portal  
**Source Table:** `evidence`  
**Event:** `INSERT` or `UPDATE`  
**Action:** 

```sql
create or replace function trigger_evidence_ai_scoring()
returns trigger
language plpgsql
as $$
begin
  -- Enqueue AI scoring job for the new/updated evidence
  perform pg_notify(
    'evidence_scoring_queue',
    json_build_object(
      'evidence_id', NEW.id,
      'org_id', NEW.org_id,
      'cycle_id', (select id from maturity_cycles where org_id = NEW.org_id and status = 'active' limit 1)
    )::text
  );
  return NEW;
end;
$$;

create trigger on_evidence_change
  after insert or update on evidence
  for each row
  execute function trigger_evidence_ai_scoring();
```

**Edge Function:** Listens to `evidence_scoring_queue` channel and calls `/evidence-ai-score`.

---

### 5.2 AI Score Complete → Criterion Rollup

**Trigger:** New AI score inserted  
**Source Table:** `evidence_ai_scores`  
**Event:** `INSERT`  
**Action:**

```sql
create or replace function trigger_criterion_rollup()
returns trigger
language plpgsql
as $$
begin
  -- Recalculate criterion score for affected criterion
  perform pg_notify(
    'criterion_scoring_queue',
    json_build_object(
      'criterion_id', (
        select criterion_id 
        from evidence_criteria_mapping 
        where evidence_id = NEW.evidence_id 
        limit 1
      ),
      'cycle_id', NEW.cycle_id
    )::text
  );
  return NEW;
end;
$$;

create trigger on_ai_score_insert
  after insert on evidence_ai_scores
  for each row
  execute function trigger_criterion_rollup();
```

**Edge Function:** Updates `criteria_scores` table with weighted average of evidence AI scores.

---

### 5.3 Criterion Score → MPS Rollup

**Trigger:** Criterion score updated  
**Source Table:** `criteria_scores`  
**Event:** `INSERT` or `UPDATE`  
**Action:**

```sql
create or replace function trigger_mps_rollup()
returns trigger
language plpgsql
as $$
begin
  perform pg_notify(
    'mps_scoring_queue',
    json_build_object(
      'mps_id', (
        select mps_id 
        from criteria 
        where id = NEW.criterion_id
      ),
      'cycle_id', NEW.cycle_id
    )::text
  );
  return NEW;
end;
$$;

create trigger on_criterion_score_change
  after insert or update on criteria_scores
  for each row
  execute function trigger_mps_rollup();
```

**Edge Function:** Updates `mps_scores` table with weighted average of criteria scores.

---

### 5.4 MPS Score → Domain Rollup

**Trigger:** MPS score updated  
**Source Table:** `mps_scores`  
**Event:** `INSERT` or `UPDATE`  
**Action:**

```sql
create or replace function trigger_domain_rollup()
returns trigger
language plpgsql
as $$
begin
  perform pg_notify(
    'domain_scoring_queue',
    json_build_object(
      'domain_id', (
        select domain_id 
        from mps 
        where id = NEW.mps_id
      ),
      'cycle_id', NEW.cycle_id
    )::text
  );
  return NEW;
end;
$$;

create trigger on_mps_score_change
  after insert or update on mps_scores
  for each row
  execute function trigger_domain_rollup();
```

**Edge Function:** Updates `domain_scores` table with weighted average of MPS scores.

---

### 5.5 Domain Score → Organization Score

**Trigger:** Domain score updated  
**Source Table:** `domain_scores`  
**Event:** `INSERT` or `UPDATE`  
**Action:**

```sql
create or replace function trigger_org_score_rollup()
returns trigger
language plpgsql
as $$
begin
  perform pg_notify(
    'org_scoring_queue',
    json_build_object(
      'org_id', (
        select org_id 
        from domains 
        where id = NEW.domain_id
      ),
      'cycle_id', NEW.cycle_id
    )::text
  );
  return NEW;
end;
$$;

create trigger on_domain_score_change
  after insert or update on domain_scores
  for each row
  execute function trigger_org_score_rollup();
```

**Edge Function:** Updates `organization_maturity_scores` table with weighted average of domain scores.

---

### 5.6 Organization Score → PIT Gap Evaluation

**Trigger:** Organization maturity score finalized  
**Source Table:** `organization_maturity_scores`  
**Event:** `UPDATE`  
**Action:**

```sql
create or replace function trigger_pit_gap_evaluation()
returns trigger
language plpgsql
as $$
begin
  -- Only trigger if score changed significantly or status changed to 'finalized'
  if (NEW.maturity_score <> OLD.maturity_score) or (NEW.status = 'finalized' and OLD.status <> 'finalized') then
    perform pg_notify(
      'pit_gap_evaluation_queue',
      json_build_object(
        'org_id', NEW.org_id,
        'cycle_id', NEW.cycle_id,
        'maturity_score', NEW.maturity_score
      )::text
    );
  end if;
  return NEW;
end;
$$;

create trigger on_org_score_finalized
  after update on organization_maturity_scores
  for each row
  execute function trigger_pit_gap_evaluation();
```

**Edge Function:** `/pit/evaluate-gaps` analyzes criteria with gaps (actual < target) and creates PIT projects/tasks.

---

## 6. PIT Integration API

### **POST /pit/evaluate-gaps**

This Edge Function analyzes maturity gaps and creates remediation work.

#### **Request Body**

```json
{
  "org_id": "uuid",
  "cycle_id": "uuid"
}
```

#### **Logic**

1. Query all criteria where `actual_level < target_level`
2. For each gap:
   - Check if a PIT project already exists for this criterion (via `pit_task_links`)
   - If not, create a new PIT project with:
     - `origin_module = 'maturity'`
     - `origin_type = 'criterion'`
     - `origin_id = criterion.id`
     - `origin_path = '/maturity/domains/{domain_id}/mps/{mps_id}/criteria/{criterion_id}'`
   - Create initial tasks based on gap severity
3. Emit analytics event: `maturity.gap_evaluation_complete`

#### **Response**

```json
{
  "gaps_found": 12,
  "projects_created": 8,
  "projects_updated": 4
}
```

---

## 7. Data Flow Summary

```
Evidence Upload
    ↓
[Trigger] → Evidence AI Scoring Queue
    ↓
POST /evidence-ai-score
    ↓
evidence_ai_scores table
    ↓
[Trigger] → Criterion Rollup
    ↓
criteria_scores table
    ↓
[Trigger] → MPS Rollup
    ↓
mps_scores table
    ↓
[Trigger] → Domain Rollup
    ↓
domain_scores table
    ↓
[Trigger] → Organization Rollup
    ↓
organization_maturity_scores table
    ↓
[Trigger] → PIT Gap Evaluation
    ↓
POST /pit/evaluate-gaps
    ↓
pit_projects + pit_tasks created
```

---

## 8. Error Handling

All Edge Functions must return proper HTTP status codes:

- **200 OK** – Success
- **400 Bad Request** – Missing or invalid parameters
- **401 Unauthorized** – Invalid authentication
- **403 Forbidden** – Insufficient permissions
- **404 Not Found** – Resource not found
- **500 Internal Server Error** – Database or processing error

All errors must include a JSON response:

```json
{
  "error": "Description of what went wrong",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## 9. Authentication & Authorization

All endpoints require:

- **JWT token** from Supabase Auth
- **Row-Level Security (RLS)** enforced on all scoring tables
- Users can only access scores for organizations they belong to
- Service role key used for internal Edge Function → DB communication

---

## 10. Performance Considerations

### Batch Loading
The `score-maturity-cycle` function loads all data in batches to avoid N+1 queries:
- Load all evidence mappings
- Load all criteria scores
- Load all MPS scores
- Filter in memory

### Caching
- Organization maturity scores are cached in `organization_maturity_scores` table
- Portal can query cached scores instead of recomputing
- Cache invalidated by triggers when underlying data changes

### Debouncing
- Multiple rapid evidence uploads should not trigger multiple full scoring cycles
- Use database-level debouncing or queue deduplication

---

## 11. Testing Contract

All API endpoints must have:

1. **Unit Tests** – Test business logic in isolation
2. **Integration Tests** – Test full data flow from request to database
3. **E2E Tests** – Test from portal UI through to database update
4. **Performance Tests** – Ensure scoring completes within acceptable time

Test scenarios:
- Happy path: All data valid, scores computed correctly
- Missing data: Handle null/missing evidence gracefully
- Invalid data: Reject malformed requests
- Authorization: Reject unauthorized access
- Concurrent updates: Handle race conditions
- Large datasets: Scale to 1000+ criteria

---

## 12. Versioning & Migration

This is **v1.0** of the API contract.

Future changes:
- Breaking changes require new major version (v2.0)
- Backward-compatible additions can increment minor version (v1.1)
- Bug fixes increment patch version (v1.0.1)

Migration strategy:
- Old API versions supported for minimum 6 months
- Deprecation warnings added 3 months before removal
- Clear migration guides provided

---

## 13. Implementation Checklist

- [ ] Edge Function: `/evidence-ai-score` (✓ Already exists)
- [ ] Edge Function: `/score-maturity-cycle` (✓ Already exists)
- [ ] SQL RPC: `get_criterion_score`
- [ ] SQL RPC: `get_mps_score`
- [ ] SQL RPC: `get_domain_score`
- [ ] SQL RPC: `get_organization_maturity`
- [ ] Database Trigger: Evidence → AI Scoring
- [ ] Database Trigger: AI Score → Criterion Rollup
- [ ] Database Trigger: Criterion → MPS Rollup
- [ ] Database Trigger: MPS → Domain Rollup
- [ ] Database Trigger: Domain → Organization Rollup
- [ ] Database Trigger: Organization → PIT Gap Evaluation
- [ ] Edge Function: `/pit/evaluate-gaps`
- [ ] Unit Tests for all endpoints
- [ ] Integration Tests for full flow
- [ ] E2E Tests from portal
- [ ] Performance benchmarks
- [ ] Documentation updates

---

## 14. References

- **Scoring Model Migration:** `infrastructure/db/migrations/20250208_scoring_model.sql`
- **Score Maturity Cycle Function:** `infrastructure/supabase/functions/score-maturity-cycle/index.ts`
- **PIT Integration Requirements:** `architecture/modules/pit/PIT_INTEGRATION_REQUIREMENTS_v1.0.md`
- **Maturity Module Architecture:** `architecture/modules/maturity/MATURITY_MODULE_ARCHITECTURE_v1.0.md`

---

**Document Status:** ✅ Architecture Approved  
**Next Steps:** Generate SQL migration for RPC functions and triggers  
**Builder Agent:** Ready for implementation
