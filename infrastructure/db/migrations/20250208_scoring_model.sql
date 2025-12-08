-- ================================================
-- MATURION ISMS – SCORING MODEL DATABASE MIGRATION
-- Version: 1.0
-- Author: Foreman (Generated for Johan)
-- ================================================

-- ================================================
-- 0. SAFETY
-- ================================================
set check_function_bodies = off;

-- ================================================
-- 1. EVIDENCE TYPE WEIGHTS (CONFIGURABLE)
-- ================================================
create table if not exists evidence_type_weights (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  code text not null,                      -- 'POLICY', 'SOP_PLUS_LOG', ...
  label text not null,
  base_weight numeric(3,2) not null check (base_weight >= 0 and base_weight <= 1),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  unique (org_id, code)
);

-- Insert default global weights (optional)
insert into evidence_type_weights (org_id, code, label, base_weight, is_default)
values
  (null, 'POLICY', 'Policy Document Only', 0.20, true),
  (null, 'SOP_PLUS_LOG', 'SOP + Implementation Logs', 0.50, true),
  (null, 'INTERNAL_AUDIT', 'Internal Audit', 0.70, true),
  (null, 'EXTERNAL_AUDIT', 'External Audit or Certification Evidence', 0.90, true),
  (null, 'BEHAVIORAL_DATA', 'Behavioral or Telemetry Evidence', 1.00, true)
on conflict do nothing;

-- ================================================
-- 2. MATURITY SCORE THRESHOLDS
-- ================================================
create table if not exists maturity_score_thresholds (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  level int not null check (level between 1 and 5),
  min_score numeric(3,2) not null check (min_score >= 0 and min_score <= 1),
  max_score numeric(3,2) not null check (max_score >= 0 and max_score <= 1),
  label text not null,
  created_at timestamptz not null default now(),
  unique (org_id, level)
);

insert into maturity_score_thresholds (org_id, level, min_score, max_score, label)
values
  (null, 1, 0.00, 0.19, 'Basic'),
  (null, 2, 0.20, 0.39, 'Reactive'),
  (null, 3, 0.40, 0.59, 'Compliant'),
  (null, 4, 0.60, 0.79, 'Proactive'),
  (null, 5, 0.80, 1.00, 'Resilient')
on conflict do nothing;

-- ================================================
-- 3. WEIGHTS FOR CRITERIA, MPS, DOMAINS
-- ================================================
create table if not exists criteria_weights (
  criterion_id uuid primary key references criteria(id) on delete cascade,
  weight numeric(4,2) not null default 1.0
);

create table if not exists mps_weights (
  mps_id uuid primary key references mps(id) on delete cascade,
  weight numeric(4,2) not null default 1.0
);

create table if not exists domain_weights (
  domain_id uuid primary key references domains(id) on delete cascade,
  weight numeric(4,2) not null default 1.0
);

-- ================================================
-- 4. AI EVIDENCE SCORING TABLE
-- ================================================
create table if not exists evidence_ai_scores (
  id uuid primary key default gen_random_uuid(),
  evidence_id uuid not null references evidence(id) on delete cascade,
  cycle_id uuid references maturity_cycles(id) on delete set null,
  model_name text,
  evidence_type_code text,
  base_weight numeric(3,2),
  recency_factor numeric(3,2),
  metadata_factor numeric(3,2),
  confidence numeric(3,2) not null,
  issues text[],             -- e.g. {'too_old','missing_signature'}
  comments text,
  suggested_level int check (suggested_level between 1 and 5),
  created_at timestamptz not null default now()
);

-- ================================================
-- 5. CRITERION SCORES
-- ================================================
create table if not exists criteria_scores (
  id uuid primary key default gen_random_uuid(),
  criterion_id uuid not null references criteria(id) on delete cascade,
  cycle_id uuid not null references maturity_cycles(id) on delete cascade,
  numeric_score numeric(3,2) not null check (numeric_score >= 0 and numeric_score <= 1),
  maturity_level int not null check (maturity_level between 1 and 5),
  target_level int not null check (target_level between 1 and 5),
  gap int not null,
  evidence_count int not null default 0,
  avg_evidence_confidence numeric(3,2),
  computed_at timestamptz not null default now(),
  unique (criterion_id, cycle_id)
);

-- ================================================
-- 6. MPS & DOMAIN SCORES
-- ================================================
create table if not exists mps_scores (
  id uuid primary key default gen_random_uuid(),
  mps_id uuid not null references mps(id) on delete cascade,
  cycle_id uuid not null references maturity_cycles(id) on delete cascade,
  numeric_score numeric(3,2) not null,
  maturity_level int not null check (maturity_level between 1 and 5),
  target_level int not null check (target_level between 1 and 5),
  gap int not null,
  computed_at timestamptz not null default now(),
  unique (mps_id, cycle_id)
);

create table if not exists domain_scores (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references domains(id) on delete cascade,
  cycle_id uuid not null references maturity_cycles(id) on delete cascade,
  numeric_score numeric(3,2) not null,
  maturity_level int not null check (maturity_level between 1 and 5),
  target_level int not null check (target_level between 1 and 5),
  gap int not null,
  computed_at timestamptz not null default now(),
  unique (domain_id, cycle_id)
);

-- ================================================
-- 7. ORGANIZATION SCORE
-- ================================================
create table if not exists organization_maturity_scores (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  cycle_id uuid not null references maturity_cycles(id) on delete cascade,
  numeric_score numeric(3,2) not null,
  maturity_level int not null check (maturity_level between 1 and 5),
  computed_at timestamptz not null default now(),
  unique (org_id, cycle_id)
);

-- ================================================
-- END OF MIGRATION
-- ================================================
