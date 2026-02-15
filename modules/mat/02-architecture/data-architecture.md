# MANUAL AUDIT TOOL (MAT) – DATA ARCHITECTURE v1.0.0

| Field            | Value                                      |
|------------------|--------------------------------------------|
| Module           | MAT – Manual Audit Tool                    |
| Version          | v1.0.0                                     |
| Status           | Approved                                   |
| Classification   | Internal – Architecture                    |
| Owner            | Maturion Platform Team                     |
| Last Updated     | 2025-01-01                                 |
| Governance       | Domain 3.4                                 |
| TRS Requirements | TR-012, TR-013, TR-014, TR-015             |

---

## 1. Database Schema Design (TR-012)

This section defines the complete relational schema for the MAT module, hosted on PostgreSQL 15+ via Supabase managed instance. All tables enforce Row Level Security (RLS) scoped to `organisation_id`.

### 1.1 Core Tables

#### 1.1.1 `organisations`

| Column                 | Type              | Constraints                        |
|------------------------|-------------------|------------------------------------|
| id                     | UUID              | PRIMARY KEY, DEFAULT gen_random_uuid() |
| name                   | VARCHAR(255)      | NOT NULL                           |
| slug                   | VARCHAR(100)      | NOT NULL, UNIQUE                   |
| settings               | JSONB             | DEFAULT '{}'::jsonb                |
| retention_policy_years | INT               | NOT NULL, DEFAULT 7                |
| created_at             | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |
| updated_at             | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |

#### 1.1.2 `profiles`

User profiles extending Supabase Auth (`auth.users`).

| Column          | Type              | Constraints                        |
|-----------------|-------------------|------------------------------------|
| id              | UUID              | PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE |
| organisation_id | UUID              | NOT NULL, REFERENCES organisations(id) |
| role            | TEXT              | NOT NULL, CHECK (role IN ('lead_auditor', 'domain_auditor', 'mps_auditor', 'evidence_contributor')) |
| display_name    | VARCHAR(255)      | NOT NULL                           |
| mfa_enabled     | BOOLEAN           | NOT NULL, DEFAULT false            |
| created_at      | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |
| updated_at      | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |

#### 1.1.3 `audits`

| Column               | Type              | Constraints                        |
|----------------------|-------------------|------------------------------------|
| id                   | UUID              | PRIMARY KEY, DEFAULT gen_random_uuid() |
| organisation_id      | UUID              | NOT NULL, REFERENCES organisations(id) |
| title                | VARCHAR(255)      | NOT NULL                           |
| organisation_name    | VARCHAR(255)      | NOT NULL                           |
| facility_location    | VARCHAR(255)      |                                    |
| audit_lead_id        | UUID              | REFERENCES profiles(id)           |
| audit_period_start   | DATE              |                                    |
| audit_period_end     | DATE              |                                    |
| status               | TEXT              | NOT NULL, DEFAULT 'not_started', CHECK (status IN ('not_started', 'in_progress', 'under_review', 'completed', 'archived')) |
| criteria_approved    | BOOLEAN           | NOT NULL, DEFAULT false            |
| criteria_approved_at | TIMESTAMPTZ       |                                    |
| criteria_approved_by | UUID              | REFERENCES profiles(id)           |
| created_by           | UUID              | NOT NULL, REFERENCES profiles(id) |
| created_at           | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |
| updated_at           | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |
| deleted_at           | TIMESTAMPTZ       | NULL (soft delete)                 |

#### 1.1.4 `domains`

| Column              | Type              | Constraints                        |
|---------------------|-------------------|------------------------------------|
| id                  | UUID              | PRIMARY KEY, DEFAULT gen_random_uuid() |
| audit_id            | UUID              | NOT NULL, REFERENCES audits(id) ON DELETE CASCADE |
| organisation_id     | UUID              | NOT NULL, REFERENCES organisations(id) |
| number              | INT               | NOT NULL                           |
| title               | TEXT              | NOT NULL                           |
| description         | TEXT              |                                    |
| sort_order          | INT               | NOT NULL                           |
| assigned_auditor_id | UUID              | REFERENCES profiles(id)           |
| created_at          | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |
| updated_at          | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |

**Unique constraint**: `UNIQUE (audit_id, number)`

#### 1.1.5 `mini_performance_standards` (mps)

| Column              | Type              | Constraints                        |
|---------------------|-------------------|------------------------------------|
| id                  | UUID              | PRIMARY KEY, DEFAULT gen_random_uuid() |
| domain_id           | UUID              | NOT NULL, REFERENCES domains(id) ON DELETE CASCADE |
| audit_id            | UUID              | NOT NULL, REFERENCES audits(id) ON DELETE CASCADE |
| organisation_id     | UUID              | NOT NULL, REFERENCES organisations(id) |
| number              | VARCHAR(20)       | NOT NULL (e.g. "1.1")             |
| title               | TEXT              | NOT NULL                           |
| description         | TEXT              |                                    |
| sort_order          | INT               | NOT NULL                           |
| assigned_auditor_id | UUID              | REFERENCES profiles(id)           |
| created_at          | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |
| updated_at          | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |

**Unique constraint**: `UNIQUE (audit_id, number)`

#### 1.1.6 `criteria`

| Column                 | Type              | Constraints                        |
|------------------------|-------------------|------------------------------------|
| id                     | UUID              | PRIMARY KEY, DEFAULT gen_random_uuid() |
| mps_id                 | UUID              | NOT NULL, REFERENCES mini_performance_standards(id) ON DELETE CASCADE |
| domain_id              | UUID              | NOT NULL, REFERENCES domains(id) ON DELETE CASCADE |
| audit_id               | UUID              | NOT NULL, REFERENCES audits(id) ON DELETE CASCADE |
| organisation_id        | UUID              | NOT NULL, REFERENCES organisations(id) |
| number                 | VARCHAR(20)       | NOT NULL (e.g. "1.1.1")           |
| title                  | TEXT              | NOT NULL                           |
| description            | TEXT              |                                    |
| sort_order             | INT               | NOT NULL                           |
| is_not_used            | BOOLEAN           | NOT NULL, DEFAULT false            |
| not_used_reason        | TEXT              |                                    |
| not_used_justification | TEXT              |                                    |
| status                 | TEXT              | NOT NULL, DEFAULT 'not_started', CHECK (status IN ('not_started', 'in_progress', 'submitted', 'ai_scored', 'confirmed', 'not_used')) |
| source_anchor          | TEXT              |                                    |
| confidence             | DECIMAL(3,2)      |                                    |
| needs_human_review     | BOOLEAN           | NOT NULL, DEFAULT false            |
| created_at             | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |
| updated_at             | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |

**Unique constraint**: `UNIQUE (audit_id, number)`

#### 1.1.7 `evidence`

| Column              | Type              | Constraints                        |
|---------------------|-------------------|------------------------------------|
| id                  | UUID              | PRIMARY KEY, DEFAULT gen_random_uuid() |
| criterion_id        | UUID              | NOT NULL, REFERENCES criteria(id) ON DELETE CASCADE |
| audit_id            | UUID              | NOT NULL, REFERENCES audits(id) ON DELETE CASCADE |
| organisation_id     | UUID              | NOT NULL, REFERENCES organisations(id) |
| evidence_type       | TEXT              | NOT NULL, CHECK (evidence_type IN ('text', 'voice', 'photo', 'document', 'video')) |
| content_text        | TEXT              | (for text evidence)                |
| file_path           | TEXT              | (for file evidence)                |
| file_name           | VARCHAR(255)      |                                    |
| file_size           | BIGINT            |                                    |
| mime_type           | VARCHAR(100)      |                                    |
| sha256_hash         | VARCHAR(64)       |                                    |
| storage_url         | TEXT              |                                    |
| metadata            | JSONB             | DEFAULT '{}'::jsonb                |
| is_offline_captured | BOOLEAN           | NOT NULL, DEFAULT false            |
| sync_status         | TEXT              | NOT NULL, DEFAULT 'synced', CHECK (sync_status IN ('synced', 'pending', 'syncing', 'failed')) |
| uploaded_by         | UUID              | NOT NULL, REFERENCES profiles(id) |
| created_at          | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |
| updated_at          | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |
| deleted_at          | TIMESTAMPTZ       | NULL (soft delete)                 |

#### 1.1.8 `ai_scoring_results`

| Column                       | Type              | Constraints                        |
|------------------------------|-------------------|------------------------------------|
| id                           | UUID              | PRIMARY KEY, DEFAULT gen_random_uuid() |
| criterion_id                 | UUID              | NOT NULL, REFERENCES criteria(id) ON DELETE CASCADE |
| audit_id                     | UUID              | NOT NULL, REFERENCES audits(id) ON DELETE CASCADE |
| organisation_id              | UUID              | NOT NULL, REFERENCES organisations(id) |
| maturity_level               | TEXT              | NOT NULL, CHECK (maturity_level IN ('basic', 'reactive', 'compliant', 'proactive', 'resilient')) |
| confidence                   | DECIMAL(3,2)      | NOT NULL                           |
| rationale                    | TEXT              | NOT NULL                           |
| gap_analysis_immediate       | TEXT              |                                    |
| gap_analysis_medium_term     | TEXT              |                                    |
| gap_analysis_long_term       | TEXT              |                                    |
| evidence_ids                 | UUID[]            | NOT NULL                           |
| model_used                   | VARCHAR(100)      | NOT NULL                           |
| model_version                | VARCHAR(50)       | NOT NULL                           |
| prompt_tokens                | INT               | NOT NULL                           |
| completion_tokens            | INT               | NOT NULL                           |
| latency_ms                   | INT               | NOT NULL                           |
| cost_estimate                | DECIMAL(10,6)     | NOT NULL                           |
| human_confirmed              | BOOLEAN           | NOT NULL, DEFAULT false            |
| human_override_level         | TEXT              | CHECK (human_override_level IN ('basic', 'reactive', 'compliant', 'proactive', 'resilient')) |
| human_override_justification | TEXT              |                                    |
| override_category            | TEXT              | CHECK (override_category IN ('evidence_quality', 'ai_misinterpretation', 'domain_nuance', 'other')) |
| created_at                   | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |

#### 1.1.9 `transcripts`

| Column            | Type              | Constraints                        |
|-------------------|-------------------|------------------------------------|
| id                | UUID              | PRIMARY KEY, DEFAULT gen_random_uuid() |
| evidence_id       | UUID              | NOT NULL, REFERENCES evidence(id) ON DELETE CASCADE |
| audit_id          | UUID              | NOT NULL, REFERENCES audits(id) ON DELETE CASCADE |
| organisation_id   | UUID              | NOT NULL, REFERENCES organisations(id) |
| raw_text          | TEXT              | NOT NULL                           |
| edited_text       | TEXT              |                                    |
| segments          | JSONB             | (array of `{start_time, end_time, speaker, text}`) |
| language_detected | VARCHAR(10)       |                                    |
| is_edited         | BOOLEAN           | NOT NULL, DEFAULT false            |
| created_at        | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |
| updated_at        | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |

#### 1.1.10 `audit_trail`

Append-only immutable log. RLS permits INSERT only — no UPDATE or DELETE.

| Column          | Type              | Constraints                        |
|-----------------|-------------------|------------------------------------|
| id              | UUID              | PRIMARY KEY, DEFAULT gen_random_uuid() |
| audit_id        | UUID              | REFERENCES audits(id)             |
| organisation_id | UUID              | NOT NULL, REFERENCES organisations(id) |
| user_id         | UUID              | NOT NULL, REFERENCES profiles(id) |
| action          | VARCHAR(100)      | NOT NULL                           |
| entity_type     | VARCHAR(100)      | NOT NULL                           |
| entity_id       | UUID              | NOT NULL                           |
| before_state    | JSONB             |                                    |
| after_state     | JSONB             |                                    |
| hash            | VARCHAR(64)       | NOT NULL (SHA-256 of previous entry for hash chain) |
| ip_address      | INET              |                                    |
| user_agent      | TEXT              |                                    |
| created_at      | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |

**RLS Policy**: INSERT only. No UPDATE or DELETE permitted. Hash chain ensures tamper detection.

**Partitioning**: Range-partitioned by `created_at` (monthly).

#### 1.1.11 `ai_invocation_logs`

| Column          | Type              | Constraints                        |
|-----------------|-------------------|------------------------------------|
| id              | UUID              | PRIMARY KEY, DEFAULT gen_random_uuid() |
| audit_id        | UUID              | REFERENCES audits(id)             |
| criterion_id    | UUID              | REFERENCES criteria(id)           |
| organisation_id | UUID              | NOT NULL, REFERENCES organisations(id) |
| task_type       | VARCHAR(50)       | NOT NULL                           |
| model           | VARCHAR(100)      | NOT NULL                           |
| model_version   | VARCHAR(50)       | NOT NULL                           |
| prompt_tokens   | INT               | NOT NULL                           |
| completion_tokens | INT             | NOT NULL                           |
| latency_ms      | INT               | NOT NULL                           |
| cost_estimate   | DECIMAL(10,6)     | NOT NULL                           |
| status          | VARCHAR(20)       | NOT NULL                           |
| error_message   | TEXT              |                                    |
| created_at      | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |

**Partitioning**: Range-partitioned by `created_at` (monthly).

#### 1.1.11.1 `ai_circuit_breaker_state`

| Column              | Type              | Constraints                        |
|---------------------|-------------------|------------------------------------|
| id                  | UUID              | PRIMARY KEY, DEFAULT gen_random_uuid() |
| organisation_id     | UUID              | NOT NULL, REFERENCES organisations(id) |
| task_type           | VARCHAR(50)       | NOT NULL                           |
| state               | VARCHAR(20)       | NOT NULL, CHECK (state IN ('CLOSED', 'OPEN', 'HALF_OPEN')) |
| error_count         | INT               | NOT NULL, DEFAULT 0                |
| success_count       | INT               | NOT NULL, DEFAULT 0                |
| last_error_at       | TIMESTAMPTZ       | NULL                               |
| last_state_change   | TIMESTAMPTZ       | NOT NULL                           |
| window_start        | TIMESTAMPTZ       | NOT NULL                           |
| created_at          | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |
| updated_at          | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |

**Unique Constraint**: `UNIQUE (organisation_id, task_type)` — One circuit breaker state per organisation per AI task type.

**Purpose**: Persistent storage for AI circuit breaker state management. Replaces in-memory state tracking to enable:
- State persistence across service restarts
- Multi-instance deployment support
- Audit trail of circuit breaker state transitions
- Recovery and reconciliation scenarios

**Retention**: No retention policy (current state table, not historical log)

#### 1.1.12 `report_outputs`

| Column          | Type              | Constraints                        |
|-----------------|-------------------|------------------------------------|
| id              | UUID              | PRIMARY KEY, DEFAULT gen_random_uuid() |
| audit_id        | UUID              | NOT NULL, REFERENCES audits(id) ON DELETE CASCADE |
| organisation_id | UUID              | NOT NULL, REFERENCES organisations(id) |
| format          | TEXT              | NOT NULL, CHECK (format IN ('docx', 'pdf', 'json', 'xlsx')) |
| file_path       | TEXT              | NOT NULL                           |
| file_size       | BIGINT            | NOT NULL                           |
| version         | INT               | NOT NULL, DEFAULT 1                |
| generated_by    | UUID              | NOT NULL, REFERENCES profiles(id) |
| approved_by     | UUID              | REFERENCES profiles(id)           |
| approved_at     | TIMESTAMPTZ       |                                    |
| is_published    | BOOLEAN           | NOT NULL, DEFAULT false            |
| created_at      | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |

#### 1.1.13 `consent_records`

| Column          | Type              | Constraints                        |
|-----------------|-------------------|------------------------------------|
| id              | UUID              | PRIMARY KEY, DEFAULT gen_random_uuid() |
| user_id         | UUID              | NOT NULL, REFERENCES profiles(id) |
| organisation_id | UUID              | NOT NULL, REFERENCES organisations(id) |
| consent_type    | VARCHAR(100)      | NOT NULL                           |
| granted         | BOOLEAN           | NOT NULL                           |
| scope           | TEXT              |                                    |
| ip_address      | INET              |                                    |
| created_at      | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |

#### 1.1.14 `watchdog_metrics`

| Column           | Type              | Constraints                        |
|------------------|-------------------|------------------------------------|
| id               | UUID              | PRIMARY KEY, DEFAULT gen_random_uuid() |
| organisation_id  | UUID              | REFERENCES organisations(id)      |
| metric_type      | VARCHAR(100)      | NOT NULL                           |
| metric_value     | DECIMAL(10,4)     | NOT NULL                           |
| threshold        | DECIMAL(10,4)     | NOT NULL                           |
| alert_triggered  | BOOLEAN           | NOT NULL, DEFAULT false            |
| window_start     | TIMESTAMPTZ       | NOT NULL                           |
| window_end       | TIMESTAMPTZ       | NOT NULL                           |
| created_at       | TIMESTAMPTZ       | NOT NULL, DEFAULT NOW()            |

---

### 1.2 Indexes

```sql
-- organisations
CREATE UNIQUE INDEX idx_organisations_slug ON organisations(slug);

-- profiles
CREATE INDEX idx_profiles_organisation_id ON profiles(organisation_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- audits
CREATE INDEX idx_audits_organisation_id ON audits(organisation_id);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audits_audit_lead_id ON audits(audit_lead_id);
CREATE INDEX idx_audits_created_by ON audits(created_by);
CREATE INDEX idx_audits_deleted_at ON audits(deleted_at) WHERE deleted_at IS NULL;

-- domains
CREATE INDEX idx_domains_audit_id ON domains(audit_id);
CREATE INDEX idx_domains_organisation_id ON domains(organisation_id);
CREATE INDEX idx_domains_assigned_auditor_id ON domains(assigned_auditor_id);
CREATE UNIQUE INDEX idx_domains_audit_number ON domains(audit_id, number);

-- mini_performance_standards
CREATE INDEX idx_mps_domain_id ON mini_performance_standards(domain_id);
CREATE INDEX idx_mps_audit_id ON mini_performance_standards(audit_id);
CREATE INDEX idx_mps_organisation_id ON mini_performance_standards(organisation_id);
CREATE UNIQUE INDEX idx_mps_audit_number ON mini_performance_standards(audit_id, number);

-- criteria
CREATE INDEX idx_criteria_mps_id ON criteria(mps_id);
CREATE INDEX idx_criteria_domain_id ON criteria(domain_id);
CREATE INDEX idx_criteria_audit_id ON criteria(audit_id);
CREATE INDEX idx_criteria_organisation_id ON criteria(organisation_id);
CREATE INDEX idx_criteria_status ON criteria(status);
CREATE INDEX idx_criteria_needs_human_review ON criteria(needs_human_review) WHERE needs_human_review = true;
CREATE UNIQUE INDEX idx_criteria_audit_number ON criteria(audit_id, number);

-- evidence
CREATE INDEX idx_evidence_criterion_id ON evidence(criterion_id);
CREATE INDEX idx_evidence_audit_id ON evidence(audit_id);
CREATE INDEX idx_evidence_organisation_id ON evidence(organisation_id);
CREATE INDEX idx_evidence_uploaded_by ON evidence(uploaded_by);
CREATE INDEX idx_evidence_sync_status ON evidence(sync_status) WHERE sync_status != 'synced';
CREATE INDEX idx_evidence_deleted_at ON evidence(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_evidence_sha256_hash ON evidence(sha256_hash);

-- ai_scoring_results
CREATE INDEX idx_ai_scoring_criterion_id ON ai_scoring_results(criterion_id);
CREATE INDEX idx_ai_scoring_audit_id ON ai_scoring_results(audit_id);
CREATE INDEX idx_ai_scoring_organisation_id ON ai_scoring_results(organisation_id);
CREATE INDEX idx_ai_scoring_human_confirmed ON ai_scoring_results(human_confirmed);

-- transcripts
CREATE INDEX idx_transcripts_evidence_id ON transcripts(evidence_id);
CREATE INDEX idx_transcripts_audit_id ON transcripts(audit_id);

-- audit_trail
CREATE INDEX idx_audit_trail_audit_id ON audit_trail(audit_id);
CREATE INDEX idx_audit_trail_organisation_id ON audit_trail(organisation_id);
CREATE INDEX idx_audit_trail_user_id ON audit_trail(user_id);
CREATE INDEX idx_audit_trail_entity ON audit_trail(entity_type, entity_id);
CREATE INDEX idx_audit_trail_action ON audit_trail(action);
CREATE INDEX idx_audit_trail_created_at ON audit_trail(created_at);

-- ai_invocation_logs
CREATE INDEX idx_ai_invocation_audit_id ON ai_invocation_logs(audit_id);
CREATE INDEX idx_ai_invocation_organisation_id ON ai_invocation_logs(organisation_id);
CREATE INDEX idx_ai_invocation_task_type ON ai_invocation_logs(task_type);
CREATE INDEX idx_ai_invocation_created_at ON ai_invocation_logs(created_at);

-- ai_circuit_breaker_state
CREATE INDEX idx_circuit_breaker_organisation_id ON ai_circuit_breaker_state(organisation_id);
CREATE INDEX idx_circuit_breaker_task_type ON ai_circuit_breaker_state(task_type);
CREATE INDEX idx_circuit_breaker_state ON ai_circuit_breaker_state(state);
CREATE UNIQUE INDEX idx_circuit_breaker_org_task ON ai_circuit_breaker_state(organisation_id, task_type);

-- report_outputs
CREATE INDEX idx_report_outputs_audit_id ON report_outputs(audit_id);
CREATE INDEX idx_report_outputs_organisation_id ON report_outputs(organisation_id);

-- consent_records
CREATE INDEX idx_consent_records_user_id ON consent_records(user_id);
CREATE INDEX idx_consent_records_organisation_id ON consent_records(organisation_id);

-- watchdog_metrics
CREATE INDEX idx_watchdog_metrics_organisation_id ON watchdog_metrics(organisation_id);
CREATE INDEX idx_watchdog_metrics_metric_type ON watchdog_metrics(metric_type);
CREATE INDEX idx_watchdog_metrics_alert_triggered ON watchdog_metrics(alert_triggered) WHERE alert_triggered = true;
```

---

### 1.3 Constraints

#### Status Enum CHECK Constraints

All status-like columns use CHECK constraints instead of PostgreSQL ENUM types to allow additive changes without migrations:

```sql
-- audits.status
ALTER TABLE audits ADD CONSTRAINT chk_audits_status
  CHECK (status IN ('not_started', 'in_progress', 'under_review', 'completed', 'archived'));

-- criteria.status
ALTER TABLE criteria ADD CONSTRAINT chk_criteria_status
  CHECK (status IN ('not_started', 'in_progress', 'submitted', 'ai_scored', 'confirmed', 'not_used'));

-- evidence.evidence_type
ALTER TABLE evidence ADD CONSTRAINT chk_evidence_type
  CHECK (evidence_type IN ('text', 'voice', 'photo', 'document', 'video'));

-- evidence.sync_status
ALTER TABLE evidence ADD CONSTRAINT chk_evidence_sync_status
  CHECK (sync_status IN ('synced', 'pending', 'syncing', 'failed'));

-- ai_scoring_results.maturity_level
ALTER TABLE ai_scoring_results ADD CONSTRAINT chk_maturity_level
  CHECK (maturity_level IN ('basic', 'reactive', 'compliant', 'proactive', 'resilient'));

-- report_outputs.format
ALTER TABLE report_outputs ADD CONSTRAINT chk_report_format
  CHECK (format IN ('docx', 'pdf', 'json', 'xlsx'));
```

#### Criteria Numbering Immutability Trigger

After `audits.criteria_approved = true`, criteria numbers are locked:

```sql
CREATE OR REPLACE FUNCTION prevent_criteria_number_change()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM audits
    WHERE id = NEW.audit_id AND criteria_approved = true
  ) AND OLD.number IS DISTINCT FROM NEW.number THEN
    RAISE EXCEPTION 'Cannot modify criteria number after criteria are approved';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_criteria_number_immutable
  BEFORE UPDATE ON criteria
  FOR EACH ROW
  EXECUTE FUNCTION prevent_criteria_number_change();
```

#### Cascading Deletes and Updates

| Parent Table                  | Child Table           | ON DELETE  | ON UPDATE  |
|-------------------------------|-----------------------|------------|------------|
| organisations                 | profiles              | RESTRICT   | CASCADE    |
| organisations                 | audits                | RESTRICT   | CASCADE    |
| audits                        | domains               | CASCADE    | CASCADE    |
| domains                       | mini_performance_standards | CASCADE | CASCADE    |
| mini_performance_standards    | criteria              | CASCADE    | CASCADE    |
| criteria                      | evidence              | CASCADE    | CASCADE    |
| criteria                      | ai_scoring_results    | CASCADE    | CASCADE    |
| evidence                      | transcripts           | CASCADE    | CASCADE    |
| audits                        | report_outputs        | CASCADE    | CASCADE    |
| profiles                      | consent_records       | CASCADE    | CASCADE    |

---

### 1.4 Partitioning

#### `audit_trail` — Range Partitioned by Month

```sql
CREATE TABLE audit_trail (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  audit_id UUID,
  organisation_id UUID NOT NULL,
  user_id UUID NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  before_state JSONB,
  after_state JSONB,
  hash VARCHAR(64) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Example monthly partitions
CREATE TABLE audit_trail_y2025m01 PARTITION OF audit_trail
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE audit_trail_y2025m02 PARTITION OF audit_trail
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
-- Additional partitions created via pg_partman or CI automation
```

#### `ai_invocation_logs` — Range Partitioned by Month

```sql
CREATE TABLE ai_invocation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  audit_id UUID,
  criterion_id UUID,
  organisation_id UUID NOT NULL,
  task_type VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  model_version VARCHAR(50) NOT NULL,
  prompt_tokens INT NOT NULL,
  completion_tokens INT NOT NULL,
  latency_ms INT NOT NULL,
  cost_estimate DECIMAL(10,6) NOT NULL,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Example monthly partitions
CREATE TABLE ai_invocation_logs_y2025m01 PARTITION OF ai_invocation_logs
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE ai_invocation_logs_y2025m02 PARTITION OF ai_invocation_logs
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
-- Additional partitions created via pg_partman or CI automation
```

---

## 2. File Storage Architecture (TR-013)

### 2.1 Supabase Storage Bucket Structure

All evidence files are stored in Supabase Storage with the following path convention:

```
{org_id}/{audit_id}/{criterion_id}/{evidence_type}/{filename}
```

**Example**:

```
a1b2c3d4/e5f6g7h8/i9j0k1l2/document/policy-manual-v3.pdf
```

### 2.2 Integrity Verification

- **SHA-256 hash** computed client-side on upload
- Hash stored in `evidence.sha256_hash`
- Server re-computes hash on receipt and compares to detect corruption
- Hash verified on download for tamper detection

### 2.3 Immutability

- Evidence files are **immutable** — once uploaded, they cannot be modified
- Deletion is **soft delete only** (`evidence.deleted_at` is set; file remains in storage)
- Hard deletion only via data retention policy enforcement (automated, post-retention-period)

### 2.4 Access Control

- **Signed URLs** with **1-hour TTL** for all file access
- URLs generated server-side; clients never access storage directly
- RLS on `evidence` table enforces organisation-scoped access
- Signed URL generation requires valid session and organisation membership

### 2.5 Security Scanning

- **ClamAV** scanning triggered on every file upload via Edge Function
- Infected files are quarantined and the upload is rejected
- Scan results logged in `audit_trail`

### 2.6 MIME Type Whitelist

| Category  | Allowed MIME Types                                                |
|-----------|-------------------------------------------------------------------|
| Document  | `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `text/plain` |
| Image     | `image/jpeg`, `image/png`, `image/webp`, `image/heic`           |
| Audio     | `audio/mpeg`, `audio/wav`, `audio/ogg`, `audio/mp4`             |
| Video     | `video/mp4`, `video/webm`, `video/quicktime`                    |

### 2.7 Size Limits

| Evidence Type       | Maximum Size |
|---------------------|-------------|
| Documents / Images  | 50 MB       |
| Video               | 500 MB      |
| Audio               | 50 MB       |
| Text                | N/A (stored in database) |

---

## 3. Data Serialization and Schemas (TR-014)

### 3.1 Internal API Serialization

- **Format**: JSON
- **Validation**: JSON Schema (Draft 2020-12) for all request/response payloads
- **Location**: `packages/schemas/json-schema/` directory
- Schemas published as npm package `@maturion/schemas` for shared use

### 3.2 Python AI Services

- **Validation**: Pydantic v2 models
- **Location**: `packages/ai-service/models/`
- Strict mode enabled (`model_config = ConfigDict(strict=True)`)
- All AI request/response models define explicit field types and validators

```python
class AiScoringRequest(BaseModel):
    model_config = ConfigDict(strict=True)

    criterion_id: UUID
    evidence_texts: list[str]
    transcript_texts: list[str] | None = None
    domain_context: str
    mps_context: str
```

### 3.3 TypeScript Frontend

- **Validation**: Zod schemas
- **Location**: `packages/schemas/zod/`
- Zod schemas generate TypeScript types via `z.infer<>`
- Shared between Next.js frontend and Edge Functions

```typescript
export const EvidenceSchema = z.object({
  id: z.string().uuid(),
  criterion_id: z.string().uuid(),
  evidence_type: z.enum(['text', 'voice', 'photo', 'document', 'video']),
  content_text: z.string().nullable(),
  file_name: z.string().max(255).nullable(),
  metadata: z.record(z.unknown()).default({}),
  sync_status: z.enum(['synced', 'pending', 'syncing', 'failed']).default('synced'),
});

export type Evidence = z.infer<typeof EvidenceSchema>;
```

### 3.4 Integration APIs

- **Format**: OpenAPI 3.1 specification
- **Scope**: PIT integration, Maturity Roadmap integration
- **Location**: `docs/api/openapi/`
- Machine-readable spec used for client generation and documentation

### 3.5 SQL Migrations

- **Tool**: Supabase CLI
- **Location**: `supabase/migrations/`
- **Naming**: `YYYYMMDDHHMMSS_description.sql`
- **Versioned**: Each migration is a sequential, timestamped SQL file
- **Backward-compatible**: Additive changes preferred; destructive changes require multi-step migration

---

## 4. Offline Data Storage (TR-015)

### 4.1 IndexedDB Database

**Database name**: `mat-offline-db`

**Object Stores**:

| Store           | Key Path | Indexes                                    | Purpose                          |
|-----------------|----------|--------------------------------------------|----------------------------------|
| `audits`        | `id`     | `organisation_id`, `status`                | Cached audit metadata            |
| `domains`       | `id`     | `audit_id`, `sort_order`                   | Cached domain hierarchy          |
| `mps`           | `id`     | `domain_id`, `audit_id`, `sort_order`      | Cached MPS hierarchy             |
| `criteria`      | `id`     | `mps_id`, `audit_id`, `status`             | Cached criteria with status      |
| `evidence_queue`| `id`     | `criterion_id`, `sync_status`, `created_at`| Offline-captured evidence        |
| `sync_log`      | `id`     | `timestamp`, `status`                      | Sync operation history           |

### 4.2 Cache API

- **Static assets**: Cached via Service Worker using cache-first strategy
- **API responses**: Cached using stale-while-revalidate strategy
- **Cache versioning**: Cache name includes app version (`mat-cache-v{version}`)
- Old caches pruned on Service Worker activation

### 4.3 Origin Private File System (OPFS)

- Used for **offline evidence files** (photos, audio recordings, documents)
- **Minimum capacity**: 2 GB reserved via Storage Manager API
- Files stored with UUID-based naming: `{evidence_id}.{extension}`
- Files moved to Supabase Storage on sync, then removed from OPFS

### 4.4 Service Worker

- Intercepts all API requests (`/api/*` routes)
- **Online**: Passes requests through to server; caches responses
- **Offline**: Returns cached data for GET requests; queues mutations (POST/PUT/DELETE) in `evidence_queue`
- Background sync registered via `navigator.serviceWorker.ready.then(reg => reg.sync.register('sync-evidence'))`

### 4.5 Sync Queue and Conflict Resolution

- **Queue capacity**: Minimum 1,000 items before sync is required
- **Retry strategy**: Exponential backoff (1s, 2s, 4s, 8s, 16s, max 60s) with jitter
- **Conflict resolution**: Last-writer-wins based on `updated_at` timestamp
- **Idempotency**: All offline mutations use client-generated UUIDs (`crypto.randomUUID()`)
- **Sync order**: Evidence queue processed in FIFO order (oldest first)
- **Partial sync**: Sync continues even if individual items fail; failed items remain in queue

### 4.6 Sync Status Indicators

| Status    | Description                                           |
|-----------|-------------------------------------------------------|
| `synced`  | Successfully uploaded to server                       |
| `pending` | Queued for upload, waiting for connectivity           |
| `syncing` | Currently being uploaded                              |
| `failed`  | Upload failed after max retries; requires manual retry|

---

## 5. Migration Strategy (Domain 3.4)

### 5.1 Database Engine

- **Engine**: PostgreSQL 15+
- **Provider**: Supabase managed instance
- **Extensions**: `pgcrypto`, `pg_trgm`, `pg_partman` (for partition management)

### 5.2 Schema Location

All migration files reside in:

```
supabase/migrations/
├── 20250101000000_create_organisations.sql
├── 20250101000001_create_profiles.sql
├── 20250101000002_create_audits.sql
├── 20250101000003_create_domains.sql
├── 20250101000004_create_mps.sql
├── 20250101000005_create_criteria.sql
├── 20250101000006_create_evidence.sql
├── 20250101000007_create_ai_scoring_results.sql
├── 20250101000008_create_transcripts.sql
├── 20250101000009_create_audit_trail.sql
├── 20250101000010_create_ai_invocation_logs.sql
├── 202501010000101_create_ai_circuit_breaker_state.sql
├── 20250101000011_create_report_outputs.sql
├── 20250101000012_create_consent_records.sql
├── 20250101000013_create_watchdog_metrics.sql
├── 20250101000014_create_indexes.sql
├── 20250101000015_create_rls_policies.sql
├── 20250101000016_create_triggers.sql
└── 20250101000017_seed_reference_data.sql
```

### 5.3 Migration Tool

- **CLI**: `supabase migration new <name>` to create new migrations
- **Apply**: `supabase db push` for remote application
- **Local**: `supabase db reset` to tear down and rebuild local database

### 5.4 Execution Timing

- Migrations are applied **on deployment** via CI/CD pipeline
- CI pipeline validates migrations against a shadow database before production apply
- Zero-downtime migrations enforced (no table locks exceeding 5 seconds)

### 5.5 Responsibility Matrix

| Role     | Responsibility                                              |
|----------|-------------------------------------------------------------|
| Foreman  | Validates migration files, approves merge                   |
| CI/CD    | Executes migrations on staging and production               |
| DBA      | Reviews production migrations for performance impact        |
| Builder  | Authors migration files with up and down scripts            |

### 5.6 Rollback Strategy

- Each migration file has a corresponding **down migration** (rollback SQL)
- **Development**: Rollback via `supabase db reset` (full rebuild)
- **Staging**: Rollback via reverse migration script
- **Production**: Manual SQL execution after DBA review; automated rollback only for additive changes
- Destructive rollbacks require approval from Foreman and DBA

### 5.7 Data Seeding

- **File**: `supabase/seed.sql`
- Contains development/test data only
- Seed data includes: sample organisation, test users, demo audit with domains/MPS/criteria
- **Never executed in production**

### 5.8 Backup Strategy

| Aspect                | Detail                                  |
|-----------------------|-----------------------------------------|
| Automated Backups     | Supabase daily automated backups        |
| Retention             | 30-day retention                        |
| Point-in-Time Recovery| Enabled (PITR)                          |
| Backup Testing        | Monthly restore test to staging         |
| Disaster Recovery RTO | 4 hours                                 |
| Disaster Recovery RPO | 1 hour (via WAL archiving)              |

---

## Appendix A: Entity Relationship Summary

```
organisations
  ├── profiles (1:N)
  ├── audits (1:N)
  │     ├── domains (1:N)
  │     │     └── mini_performance_standards (1:N)
  │     │           └── criteria (1:N)
  │     │                 ├── evidence (1:N)
  │     │                 │     └── transcripts (1:1)
  │     │                 └── ai_scoring_results (1:N)
  │     ├── report_outputs (1:N)
  │     └── audit_trail (1:N)
  ├── consent_records (1:N)
  ├── watchdog_metrics (1:N)
  └── ai_invocation_logs (1:N)
```

---

## Appendix B: RLS Policy Summary

All tables enforce Row Level Security scoped to `organisation_id`:

```sql
-- Example: audits table RLS
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own organisation audits"
  ON audits FOR SELECT
  USING (organisation_id IN (
    SELECT organisation_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Lead auditors can insert audits"
  ON audits FOR INSERT
  WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM profiles
      WHERE id = auth.uid() AND role = 'lead_auditor'
    )
  );

-- audit_trail: INSERT only
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert audit trail entries"
  ON audit_trail FOR INSERT
  WITH CHECK (organisation_id IN (
    SELECT organisation_id FROM profiles WHERE id = auth.uid()
  ));

-- No SELECT/UPDATE/DELETE policies on audit_trail for non-admin roles
```

---

*End of Data Architecture – MAT Module v1.0.0*
