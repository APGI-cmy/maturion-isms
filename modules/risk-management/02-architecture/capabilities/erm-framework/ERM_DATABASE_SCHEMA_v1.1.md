ERM_DATABASE_SCHEMA_v1.1.md

Enterprise Risk Management — Database Schema
Version 1.1
Aligned with: ERM_TRUE_NORTH_v1.0.md, SRMF, Maturion ISMS Architecture

0. PURPOSE

This schema defines all tables, relationships, constraints, enums, indexes, and versioning logic required for the complete ERM module.

It covers:

ERM Profiles

Likelihood Levels

Impact Levels

Risk Matrix Cells

Appetite Thresholds

ERM Domains

Hierarchy inheritance

Approvals & audit logs

AI interaction logs

This schema is the single source of truth governing all risk scoring downstream.

1. ERM DESIGN PRINCIPLES (APPLIED TO SCHEMA)

Immutable active profiles
Once published, ERM profiles cannot be edited.

Strict version control
All profile changes → new version.

Hierarchical inheritance
Child organisations inherit parent ERM unless overridden by approved change.

Scales must be deterministic
No duplicated numeric ranges, no overlaps.

Heatmap geometry must be stable
All cells precomputed & locked.

Audit everything
Every change must have:

who,

when,

what changed,

previous value,

new value.

AI must not overwrite parameters
AI can suggest, not enforce.

2. ENTITY RELATIONSHIP DIAGRAM (LOGICAL VIEW)
ERM_PROFILE 1───∞ ERM_LIKELIHOOD_LEVEL
ERM_PROFILE 1───∞ ERM_IMPACT_LEVEL
ERM_PROFILE 1───∞ ERM_RISK_MATRIX_CELL
ERM_PROFILE 1───∞ ERM_APPETITE_RULE
ERM_PROFILE 1───∞ ERM_DOMAIN_CONFIG

ERM_PROFILE 1───∞ ERM_APPROVAL_RECORD
ERM_PROFILE ∞───1 ORGANISATION
ERM_PROFILE 1───∞ ERM_AUDIT_LOG

3. ENUMS
3.1 risk_level_enum

(Describes final classification band)

('Extreme', 'High', 'Medium', 'Low', 'Very Low')

3.2 ermapproval_status_enum
('draft', 'pending_approval', 'approved', 'rejected', 'published', 'archived')

3.3 appetite_condition_enum
('within_appetite', 'approaching_appetite', 'breach')

3.4 ermdomain_enum
('safety', 'security', 'environmental', 'operational', 'financial', 'reputation')

4. TABLE DEFINITIONS
4.1 Table: erm_profiles

Stores every ERM version created per organisation.

id (uuid) PK
org_id (uuid) FK → organisations.id
version_major int NOT NULL
version_minor int NOT NULL
status ermapproval_status_enum NOT NULL DEFAULT 'draft'
created_by uuid NOT NULL FK → users.id
approved_by uuid FK → users.id
published_at timestamptz
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
is_active boolean DEFAULT false
notes text
hash text UNIQUE  -- checksum of full profile

Constraints

Unique profile per (org_id, version_major, version_minor)

Only one active profile allowed per org

Notes

ERM profiles are immutable once published.
Any update → new version.

4.2 Table: erm_likelihood_levels

Stores the likelihood scale per ERM profile.

id (uuid) PK
profile_id (uuid) FK → erm_profiles.id
level int NOT NULL  -- ordinal position
score numeric(5,2) NOT NULL  -- numeric value
descriptor text NOT NULL
guidance text
colour_hex text
created_at timestamptz DEFAULT now()

Constraints

Unique (profile_id, level)

Unique (profile_id, score)

NOT NULL score

CHECK score > 0

Notes

Adversarial & non-adversarial distinctions can be configured using domain-specific entries stored in domain_config.

4.3 Table: erm_impact_levels

Stores the impact scale per domain.

id (uuid) PK
profile_id (uuid) FK → erm_profiles.id
domain ermdomain_enum NOT NULL
level int NOT NULL
score numeric(8,2) NOT NULL
descriptor text NOT NULL
financial_threshold numeric NULL  -- ALE or EBITDA mapping
guidance text
colour_hex text
created_at timestamptz DEFAULT now()

Constraints

Unique (profile_id, domain, level)

Unique (profile_id, domain, score)

CHECK score > 0

4.4 Table: erm_risk_matrix_cells

Precomputed heatmap geometry.

id (uuid) PK
profile_id uuid FK → erm_profiles.id
likelihood_level int NOT NULL
impact_level int NOT NULL
risk_level risk_level_enum NOT NULL
colour_hex text NOT NULL
descriptor text NOT NULL
numeric_min numeric
numeric_max numeric
appetite_default boolean DEFAULT false
workflow_rule text
sort_order int DEFAULT 0
created_at timestamptz DEFAULT now()

Constraints

Composite unique: (profile_id, likelihood_level, impact_level)

Logical CHECK: numeric_min <= numeric_max

Notes

This is the single most critical ERM table.
All modules (RA, WRAC, PIT, Bowtie, Incident, Audit, Forecasting) map their outputs to this table.

4.5 Table: erm_appetite_rules

Defines appetite & threshold behaviour.

id uuid PK
profile_id uuid NOT NULL FK → erm_profiles.id
domain ermdomain_enum NOT NULL
appetite_level risk_level_enum NOT NULL
trigger_score_min numeric
trigger_score_max numeric
workflow_requirement text  -- e.g. "requires_senior_approval"
colour_hex text
created_at timestamptz DEFAULT now()

Constraints

Unique (profile_id, domain)

Appetite must match one of the ERM risk levels

4.6 Table: erm_domain_config

Custom settings per domain.

id uuid PK
profile_id uuid FK → erm_profiles.id
domain ermdomain_enum NOT NULL
enabled boolean DEFAULT true
weight numeric(5,2) DEFAULT 1.0  -- used for composite scoring
calculation_method text -- AI-suggested or deterministic
created_at timestamptz DEFAULT now()

Notes

Domains may be toggled off (e.g. a plant without environmental exposure).

4.7 Table: erm_hierarchy_link

Defines inheritance across organisational hierarchy.

id uuid PK
profile_id uuid FK → erm_profiles.id
parent_org_id uuid FK → organisations.id
child_org_id uuid FK → organisations.id
inherit_all boolean DEFAULT true
overrides jsonb
created_at timestamptz DEFAULT now()

4.8 Table: erm_approval_records

Workflow & approvals.

id uuid PK
profile_id uuid FK → erm_profiles.id
approver_id uuid FK → users.id
status ermapproval_status_enum NOT NULL
comment text
created_at timestamptz DEFAULT now()

Notes

Profiles require at least one “approved” record before publish.

4.9 Table: erm_audit_log

Full change tracking.

id uuid PK
profile_id uuid FK → erm_profiles.id
user_id uuid FK → users.id
action text NOT NULL
previous_value jsonb
new_value jsonb
created_at timestamptz DEFAULT now()

4.10 Table: erm_ai_log

Logs AI usage inside ERM.

id uuid PK
profile_id uuid FK → erm_profiles.id
model_used text
confidence numeric
input_hash text
output_hash text
action_type text  -- e.g. "suggest_likelihood_scale"
created_at timestamptz DEFAULT now()

5. INDEXING STRATEGY
Composite Indexes

idx_profile_version → (org_id, version_major DESC, version_minor DESC)

idx_likelihood_profile → (profile_id, level)

idx_impact_profile → (profile_id, domain, level)

idx_heatmap_profile → (profile_id, likelihood_level, impact_level)

idx_appetite_profile → (profile_id, domain)

idx_audit_profile → (profile_id, created_at DESC)

Full-Text Search Indexes

On descriptors

On guidance fields

On workflow rules

JSONB Partial Indexes

overrides @> '{}'

ai_log input_hash

6. DATA INTEGRITY RULES
6.1 Likelihood and impact levels must be complete

If 1–5 levels chosen, all levels 1–5 must exist.

6.2 Heatmap must be NxN complete

No missing cells allowed.

6.3 Appetite must use risk_level_enum

No custom descriptors allowed.

6.4 Profiles cannot be modified after publish

RLS and triggers enforce immutability.

6.5 All downstream modules must reference the active profile

RA, WRAC, PIT, Bowtie, etc. cannot bypass ERM logic.

7. AI SAFETY RULES (SCHEMA LEVEL)

AI suggestions logged but cannot modify ERM tables directly

Manual approval required

AI logs retained 10 years

AI confidence < 0.7 triggers a warning in audit log

8. FUTURE SCHEMA EXTENSIONS (v2.0+)

erm_composite_risk_formula table (custom scoring algorithms)

erm_calibration_history (historical model tuning)

erm_cross_company_comparison (anonymised analytics)

erm_dynamic_appetite (time-dependent appetite curves)

✔ END OF ERM_DATABASE_SCHEMA_v1.1.md