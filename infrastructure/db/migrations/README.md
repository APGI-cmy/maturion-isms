# Database Migrations

This directory contains SQL migration files for the MATURION ISMS database schema.

## Structure

```
migrations/
├── 20250208_scoring_model.sql      # Scoring model tables and configurations
├── 20250208_scoring_api_views.sql  # Scoring API RPCs and views
└── [future migrations...]
```

## Migration Files

### 20250208_scoring_model.sql

**Purpose:** Implements the complete scoring model for the MATURION ISMS maturity assessment system.

**Tables Created:**

1. **evidence_type_weights** - Configurable weights for different evidence types (Policy, SOP+Log, Audits, etc.)
2. **maturity_score_thresholds** - Defines maturity level thresholds (Basic, Reactive, Compliant, Proactive, Resilient)
3. **criteria_weights** - Weighting configuration for individual criteria
4. **mps_weights** - Weighting configuration for Management Practice Standards (MPS)
5. **domain_weights** - Weighting configuration for maturity domains
6. **evidence_ai_scores** - AI-generated scoring and analysis of evidence items
7. **criteria_scores** - Computed scores for individual criteria per maturity cycle
8. **mps_scores** - Aggregated MPS scores per cycle
9. **domain_scores** - Domain-level maturity scores per cycle
10. **organization_maturity_scores** - Overall organization maturity score per cycle

**Key Features:**

- Supports org-specific configuration overrides
- Includes default global weights and thresholds
- Full referential integrity with cascading deletes
- Audit trail with timestamps
- Maturity levels 1-5 enforcement
- Score normalization to [0, 1] range

**Usage:**

This migration should be applied to a Supabase PostgreSQL database that already has the following base tables:
- `organizations`
- `criteria`
- `mps`
- `domains`
- `evidence`
- `maturity_cycles`

### 20250208_scoring_api_views.sql

**Purpose:** Implements read-only RPC functions and views for accessing maturity scoring results via the API.

**Functions Created:**

1. **get_criterion_score(c_id uuid, cycle uuid)** - Returns JSONB score for a specific criterion in a cycle
2. **get_mps_score(m_id uuid, cycle uuid)** - Returns JSONB score for a specific MPS in a cycle
3. **get_domain_score(d_id uuid, cycle uuid)** - Returns JSONB score for a specific domain in a cycle
4. **get_organization_maturity(o_id uuid, cycle uuid)** - Returns JSONB maturity score for an organization in a cycle

**Views Created:**

1. **v_current_criterion_scores** - Criterion scores with org hierarchy context
2. **v_current_mps_scores** - MPS scores with org hierarchy context
3. **v_current_domain_scores** - Domain scores with org context
4. **v_org_maturity_overview** - Organization maturity with domain breakdown as JSON array

**Key Features:**

- All RPCs are marked as `STABLE` for query optimization
- Functions return JSONB for flexible API consumption
- Permissions granted to `authenticated` and `service_role` roles
- Views provide denormalized data for efficient querying
- Organization maturity overview includes nested domain breakdown

**Dependencies:**

This migration requires `20250208_scoring_model.sql` to be applied first, as it depends on:
- `criteria_scores`
- `mps_scores`
- `domain_scores`
- `organization_maturity_scores`

## Applying Migrations

For Supabase projects, migrations can be applied using the Supabase CLI:

```bash
supabase db push
```

Or by executing the SQL directly in the Supabase SQL Editor.

## Version History

- **v1.0** (2025-02-08) - Initial scoring model schema by Foreman
- **v1.0** (2025-02-08) - Scoring API RPCs and views migration
