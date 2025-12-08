# Database Migrations

This directory contains SQL migration files for the MATURION ISMS database schema.

## Structure

```
migrations/
├── 20250208_scoring_model.sql    # Scoring model tables and configurations
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

## Applying Migrations

For Supabase projects, migrations can be applied using the Supabase CLI:

```bash
supabase db push
```

Or by executing the SQL directly in the Supabase SQL Editor.

## Version History

- **v1.0** (2025-02-08) - Initial scoring model schema by Foreman
