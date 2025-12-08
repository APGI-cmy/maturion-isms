RISK_THREAT_DATABASE_SCHEMA_v0.1.md

Module: Risk Assessment Engine – Threat Module
Version: 0.1

0. Purpose

This schema defines all database tables used by the Threat Module of the Risk Assessment Engine:

Threat records (adversarial & non-adversarial)

Threat characterisation

Threat scoring & ratings

Data signals (internal/external)

Rating history (“threat shifting”)

Evidence snapshots

Links to other modules (BES, Unwanted Events, PIT, Maturity)

This schema must align with:

RISK_THREAT_MODULE_TRUE_NORTH_v0.1.md

RISK_THREAT_WIRING_MAP_v0.1.md

RISK_THREAT_QA_IMPLEMENTATION_PLAN_v0.1.md

1. Conventions

DB: Postgres

Naming: snake_case, singular table names

Timestamps: TIMESTAMPTZ

Soft delete via deleted_at where needed

FKs use *_id

2. ENUM Types
CREATE TYPE threat_type_enum AS ENUM ('adversarial', 'non_adversarial');

CREATE TYPE threat_status_enum AS ENUM ('active', 'archived');

CREATE TYPE threat_category_enum AS ENUM (
  'crime',
  'insider',
  'fraud',
  'terrorism',
  'sabotage',
  'public_disorder',
  'utility',
  'natural_hazard',
  'technical_failure',
  'health_safety',
  'other'
);

CREATE TYPE threat_source_enum AS ENUM (
  'malicious',
  'non_malicious',
  'accidental',
  'environmental',
  'unknown'
);

CREATE TYPE rating_type_enum AS ENUM ('baseline', 'dynamic');

CREATE TYPE threat_trend_enum AS ENUM ('down', 'stable', 'up', 'strong_up', 'strong_down');

CREATE TYPE driver_type_enum AS ENUM ('internal_data', 'external_data', 'manual');

CREATE TYPE data_source_enum AS ENUM (
  'incident_system',
  'pit',
  'access_control',
  'surveillance',
  'hr',
  'maintenance',
  'crime_api',
  'news_api',
  'regulator',
  'other'
);

3. Core Tables
3.1 threat

Represents a unique threat in the organisation/site context.

CREATE TABLE threat (
  id              UUID PRIMARY KEY,
  org_id          UUID NOT NULL,
  site_id         UUID NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  type            threat_type_enum NOT NULL,
  category        threat_category_enum NOT NULL,
  status          threat_status_enum NOT NULL DEFAULT 'active',
  is_priority     BOOLEAN NOT NULL DEFAULT FALSE,
  trend           threat_trend_enum NOT NULL DEFAULT 'stable',
  last_review_at  TIMESTAMPTZ,
  next_review_due TIMESTAMPTZ,
  created_by      UUID NOT NULL,
  updated_by      UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);


Indexes:

CREATE INDEX idx_threat_org_site ON threat (org_id, site_id);
CREATE INDEX idx_threat_status ON threat (status);
CREATE INDEX idx_threat_type ON threat (type);
CREATE INDEX idx_threat_priority ON threat (org_id, site_id, is_priority);

3.2 threat_characterisation

One per threat per site (can be versioned later if needed).

CREATE TABLE threat_characterisation (
  id              UUID PRIMARY KEY,
  threat_id       UUID NOT NULL REFERENCES threat (id) ON DELETE CASCADE,
  source_type     threat_source_enum NOT NULL,
  source_detail   TEXT,
  agent           TEXT, -- e.g. "Organised crime group"
  motivation      TEXT, -- e.g. "Financial gain"
  goal_outcome    TEXT, -- e.g. "Theft of diamonds"
  trust_level     TEXT, -- e.g. "Insider - admin"
  tactics         TEXT, -- high-level type e.g. "Social engineering, physical infiltration"
  tactics_detail  TEXT,
  notes           TEXT,
  created_by      UUID NOT NULL,
  updated_by      UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


Indexes:

CREATE UNIQUE INDEX uniq_threat_characterisation ON threat_characterisation (threat_id);

4. Scales & Configuration
4.1 threat_scale

Defines the 1–5 scale for each dimension.

CREATE TABLE threat_scale (
  id              UUID PRIMARY KEY,
  org_id          UUID NOT NULL,
  dimension       TEXT NOT NULL, -- 'capability', 'intent', 'targeting', 'occurrence', 'effects'
  value           INT NOT NULL CHECK (value BETWEEN 1 AND 5),
  qualitative     TEXT NOT NULL, -- e.g. "Rare", "Likely"
  range_min       NUMERIC,       -- optional, e.g. 0
  range_max       NUMERIC,       -- optional, e.g. 100
  description     TEXT NOT NULL, -- narrative
  is_adversarial  BOOLEAN NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


Indexes:

CREATE UNIQUE INDEX uniq_threat_scale_dim_val ON threat_scale (org_id, dimension, value);

4.2 threat_context

Represents an assessment context (e.g. “Karowe – 2026 Baseline Risk Assessment”).

CREATE TABLE threat_context (
  id              UUID PRIMARY KEY,
  org_id          UUID NOT NULL,
  site_id         UUID NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  year            INT,
  type            TEXT NOT NULL,  -- 'baseline_assessment', 'mid_year_review', 'special', etc.
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_by      UUID NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


Indexes:

CREATE INDEX idx_threat_context_org_site ON threat_context (org_id, site_id);
CREATE INDEX idx_threat_context_active ON threat_context (org_id, site_id, is_active);

5. Ratings & History
5.1 threat_rating

Holds current rating per threat/context/type.

CREATE TABLE threat_rating (
  id                  UUID PRIMARY KEY,
  threat_id           UUID NOT NULL REFERENCES threat (id) ON DELETE CASCADE,
  context_id          UUID NOT NULL REFERENCES threat_context (id) ON DELETE CASCADE,
  rating_type         rating_type_enum NOT NULL, -- 'baseline' or 'dynamic'

  -- Adversarial dimensions
  capability_score    INT CHECK (capability_score BETWEEN 1 AND 5),
  intent_score        INT CHECK (intent_score BETWEEN 1 AND 5),
  targeting_score     INT CHECK (targeting_score BETWEEN 1 AND 5),

  -- Non-adversarial dimensions
  occurrence_score    INT CHECK (occurrence_score BETWEEN 1 AND 5),
  effects_score       INT CHECK (effects_score BETWEEN 1 AND 5),

  overall_likelihood  NUMERIC(5,2),   -- numeric before banding
  overall_severity    NUMERIC(5,2),   -- optional; often later combined with assets
  overall_band        TEXT,           -- e.g. 'Low', 'Moderate', 'High', 'Extreme'

  ai_explanation      TEXT,           -- why AI suggested this rating
  approved_by         UUID,           -- user who approved
  approved_at         TIMESTAMPTZ,

  created_by          UUID NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


Indexes:

CREATE UNIQUE INDEX uniq_threat_rating_per_context
  ON threat_rating (threat_id, context_id, rating_type);

CREATE INDEX idx_threat_rating_band
  ON threat_rating (overall_band);

CREATE INDEX idx_threat_rating_approved
  ON threat_rating (approved_by, approved_at);

5.2 threat_rating_history

Logs all changes to underlying scores.

CREATE TABLE threat_rating_history (
  id              UUID PRIMARY KEY,
  threat_rating_id UUID NOT NULL REFERENCES threat_rating (id) ON DELETE CASCADE,
  threat_id       UUID NOT NULL,
  context_id      UUID NOT NULL,
  dimension       TEXT NOT NULL,      -- 'capability', 'intent', 'targeting', 'occurrence', 'effects', 'overall_likelihood', etc.
  old_value       NUMERIC,
  new_value       NUMERIC,
  driver_type     driver_type_enum NOT NULL,
  driver_reference_id UUID,          -- e.g. incident batch id, external data batch id
  change_reason   TEXT,              -- required when manual
  changed_by      UUID,             -- approver / actor
  changed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


Indexes:

CREATE INDEX idx_threat_rating_history_threat ON threat_rating_history (threat_id, context_id);
CREATE INDEX idx_threat_rating_history_dimension ON threat_rating_history (dimension);

6. Data Signals
6.1 threat_data_signal

Aggregated data used to drive dynamic scoring.

CREATE TABLE threat_data_signal (
  id              UUID PRIMARY KEY,
  threat_id       UUID NOT NULL REFERENCES threat (id) ON DELETE CASCADE,
  org_id          UUID NOT NULL,
  site_id         UUID NOT NULL,
  source          data_source_enum NOT NULL,
  metric_name     TEXT NOT NULL,    -- e.g. 'incidents_last_12m'
  metric_value    NUMERIC NOT NULL,
  metric_window   TEXT NOT NULL,    -- e.g. '12m', '3m'
  collected_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


Indexes:

CREATE INDEX idx_threat_data_signal_threat ON threat_data_signal (threat_id, collected_at);
CREATE INDEX idx_threat_data_signal_org_site ON threat_data_signal (org_id, site_id);

7. Integration Tables
7.1 threat_bes_link

Connects threats to BES context drivers.

CREATE TABLE threat_bes_link (
  id              UUID PRIMARY KEY,
  threat_id       UUID NOT NULL REFERENCES threat (id) ON DELETE CASCADE,
  bes_context_id  UUID NOT NULL,     -- references BES table (in BES module)
  driver_type     TEXT NOT NULL,     -- 'economic', 'regulatory', 'crime_stats', etc.
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

7.2 threat_unwanted_event_link

Links to unwanted events (in another module).

CREATE TABLE threat_unwanted_event_link (
  id              UUID PRIMARY KEY,
  threat_id       UUID NOT NULL REFERENCES threat (id) ON DELETE CASCADE,
  unwanted_event_id UUID NOT NULL,   -- references unwanted_event table (in Risk module)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

7.3 threat_pit_link

Links serious threats to PIT actions.

CREATE TABLE threat_pit_link (
  id              UUID PRIMARY KEY,
  threat_id       UUID NOT NULL REFERENCES threat (id) ON DELETE CASCADE,
  pit_project_id  UUID,  -- external reference to PIT project
  pit_task_id     UUID,  -- or PIT task
  link_type       TEXT NOT NULL, -- 'project', 'task', 'milestone'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

7.4 threat_evidence_snapshot

Used as evidence for Maturity & audits.

CREATE TABLE threat_evidence_snapshot (
  id              UUID PRIMARY KEY,
  org_id          UUID NOT NULL,
  site_id         UUID NOT NULL,
  context_id      UUID NOT NULL REFERENCES threat_context (id),
  name            TEXT NOT NULL,
  description     TEXT,
  snapshot_data   JSONB NOT NULL,   -- threats, ratings, history summary
  created_by      UUID NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

8. Indexing Strategy (Summary)

threat: by org/site, status, type, priority.

threat_rating: by threat/context, band, approval.

threat_rating_history: by threat/context/dimension.

threat_data_signal: by threat & collected_at.

Links: by threat_id for fast joins.

9. Versioning

This document:
RISK_THREAT_DATABASE_SCHEMA_v0.1

Later versions may introduce partitioning, multi-tenant constraints, and archival strategies.