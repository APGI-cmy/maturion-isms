Below is the complete THREAT_DATABASE_SCHEMA_v1.1.md, rewritten to the same standard as ERM, WRAC, PIT, and aligned to the new THREAT_TRUE_NORTH_v1.0.md.

This schema is enterprise-grade, fully normalised, version-safe, multi-company, AI-augmented, governance-compliant, and ready for Foreman → Co-pilot implementation.

Place in:
/Modules/Risk Management/ThreatModule/THREAT_DATABASE_SCHEMA_v1.1.md

THREAT_DATABASE_SCHEMA_v1.1.md

Threat Module — Database Schema
Version: 1.1
Aligned with:

THREAT_TRUE_NORTH_v1.0.md

ERM_DATABASE_SCHEMA_v1.1.md

VULNERABILITY_DATABASE_SCHEMA_v1.1.md

RISK_ASSESSMENT_DATABASE_SCHEMA_v1.1.md

PIT_DATABASE_SCHEMA_v1.1.md

SRMF Architectural Principles

Maturion One-Time Build & Zero-Regression Philosophy

0. PURPOSE

This document defines the complete, authoritative database schema for the Threat Module.

It ensures:

Correctness

Integrity

Governance compliance

Perfect integration with Vulnerability, RA, WRAC, PIT, Bowtie, Incident & Intelligence, Remote Assurance

Zero regression

Multi-company isolation

Full auditability

AI safety and traceability

Threat data is foundational to risk scoring.
Therefore schema design must be stable, precise, conflict-free, and immutable after publication.

1. DATA MODEL OVERVIEW

The Threat Module consists of 11 primary tables:

1. threat_records
2. threat_versions
3. threat_classification
4. threat_ttp_mapping
5. threat_actor_profiles
6. threat_actor_capabilities
7. threat_drift_metrics
8. threat_facility_links
9. threat_process_links
10. threat_ai_log
11. threat_audit_log


Support tables:

12. threat_category_enum
13. threat_subcategory_enum
14. threat_severity_enum
15. ttp_reference_library

2. ENTITY RELATIONSHIP SUMMARY
Core Flow
threat_records 1—∞ threat_versions  
threat_versions 1—1 threat_classification  
threat_versions 1—∞ threat_ttp_mapping  
threat_versions 1—1 threat_actor_profiles  
threat_versions 1—∞ threat_actor_capabilities  
threat_versions 1—∞ threat_drift_metrics  

Spatial / Process Linking
threat_versions ∞—∞ facilities  
threat_versions ∞—∞ processes  

Governance
threat_versions 1—∞ threat_audit_log  
threat_versions 1—∞ threat_ai_log  

3. TABLE DEFINITIONS
3.1 TABLE: threat_records

Master table; threat identity persists even after version changes.

Column	Type	Notes
id	UUID PK	Global unique ID
org_id	UUID	Multi-company isolation
threat_code	TEXT	Human-readable code (e.g., T-000173)
created_by	UUID	User
created_at	TIMESTAMP	
is_active	BOOLEAN	Soft deletion
latest_version_id	UUID FK	Points to threat_versions.id
lock_state	TEXT	(“editable”, “pending_review”, “published”)
Rules

lock_state = published → immutable.

Versioning managed through threat_versions.

3.2 TABLE: threat_versions

Each update of the threat creates a new version.

Column	Type	Notes
id	UUID PK	
threat_id	UUID FK → threat_records.id	
version_major	INT	
version_minor	INT	
version_patch	INT	
name	TEXT	
description	TEXT	
category_code	TEXT FK → threat_category_enum	
subcategory_code	TEXT FK → threat_subcategory_enum	
status	TEXT	(“draft”, “pending”, “approved”, “published”)
published_at	TIMESTAMP	
published_by	UUID	
Rules:

Only one published version per threat per organisation.

Published versions immutable.

3.3 TABLE: threat_classification

Detailed classification per version.

Column	Type	Notes
id	UUID PK	
threat_version_id	UUID FK	
threat_type	TEXT	adversarial / non-adversarial
capability_level	INT	1–5
motivation_level	INT	1–5
opportunity_level	INT	1–5
resource_level	INT	1–5
historical_frequency	INT	count over timespan
domain_relevance	JSONB	{security: true, safety: false, ...}
3.4 TABLE: threat_ttp_mapping

Maps a threat version to known TTPs.

Column	Type	Notes
id	UUID PK	
threat_version_id	UUID FK	
ttp_id	UUID FK → ttp_reference_library	
confidence	NUMERIC	0–1
ai_generated	BOOLEAN	
approved	BOOLEAN	
3.5 TABLE: threat_actor_profiles

Threat Actor Profile (TAP) root.

Column	Type	Notes
id	UUID PK	
threat_version_id	UUID FK	
actor_type	TEXT	insider / syndicate / criminal / activist etc.
skill_level	INT	1–5
resources	TEXT	Free text
behaviour_vector	JSONB	AI-generated future-state model
risk_factor_vector	JSONB	{infiltration:1.2, persistence:0.9…}
last_ai_update	TIMESTAMP	
3.6 TABLE: threat_actor_capabilities

Detailed capabilities linked to TAP.

Column	Type	Notes
id	UUID PK	
threat_actor_profile_id	UUID	
capability	TEXT	e.g., “Surveillance Avoidance”, “Bribery”, “Cyber Intrusion”
severity	INT	1–5
evidence	TEXT	Links or references
ai_suggested	BOOLEAN	
3.7 TABLE: threat_drift_metrics

Dynamic threat evolution.

Column	Type	Notes
id	UUID PK	
threat_version_id	UUID	
drift_score	NUMERIC	0–1
drift_reason	TEXT	
drift_vector	JSONB	Seasonal, crime rate, intel, incidents
drift_timestamp	TIMESTAMP	
source	TEXT	(“incident”, “intel”, “ai”, “manual”)
3.8 TABLE: threat_facility_links

Many-to-many linkage to facilities.

Column	Type
id	UUID PK
threat_version_id	UUID FK
facility_id	UUID
relevance	NUMERIC (0–1)
justification	TEXT
3.9 TABLE: threat_process_links

Threat → process mapping.

Column	Type
id	UUID PK
threat_version_id	UUID
process_id	UUID
relevance	NUMERIC
justification	TEXT

Used by RA Engine to generate valid Threat–Vulnerability → Unwanted Events.

3.10 TABLE: threat_ai_log

Records all AI interactions.

Column	Type	Notes
id	UUID PK	
threat_version_id	UUID	
ai_model	TEXT	
prompt_summary	TEXT	
output_summary	TEXT	
confidence	NUMERIC	
accepted	BOOLEAN	Must require human approval
timestamp	TIMESTAMP	
Rules:

Mandatory for all AI generation/suggestions.

Required for audit.

3.11 TABLE: threat_audit_log

Human and system audit logs.

Column	Type
id	UUID PK
threat_version_id	UUID
old_value	JSONB
new_value	JSONB
action	TEXT
user_id	UUID
timestamp	TIMESTAMP
4. ENUM TABLES
4.1 threat_category_enum

Examples:

adversarial

non_adversarial

4.2 threat_subcategory_enum

Examples:

Adversarial:

criminal_opportunistic

syndicate_organised

insider_malicious

insider_negligence

cyber_intrusion

sabotage

terrorism

Non-Adversarial:

natural

environmental

technical_failure

mechanical_failure

social_event

process_failure

safety_event

4.3 threat_severity_enum

Used for TAP and capability modelling.

Level	Description
1	Negligible
2	Low
3	Medium
4	High
5	Critical
5. REFERENCE TABLES
5.1 TABLE: ttp_reference_library

Holds MITRE-ATT&CK and custom TTP taxonomy.

Column	Type
id	UUID PK
code	TEXT
name	TEXT
domain	TEXT
description	TEXT
default_controls	JSONB
default_detection_methods	JSONB
references	JSONB
6. INTEGRITY RULES
6.1 Version Immutability

If a threat version is:

published

used in RA, WRAC, PIT, Bowtie, Incident, Control Assessments

then:

UPDATE, DELETE = REJECTED


Only cloning is permitted.

6.2 Multi-Company Isolation

RLS must enforce:

threat_records.org_id = current_user_org


except in anonymised trends.

6.3 AI Safety

AI suggestions MUST be logged.
Auto-save is forbidden.
No AI-generated attribute becomes authoritative without human approval.

6.4 Cascading Invalidations

If classification changes, recalculation is required:

Threat Drift

TTP mappings

TAP behaviour vectors

The DB must track which components require re-validation.

7. INDEXING STRATEGY
Essential Indexes

idx_threat_records_org

idx_threat_versions_threat_id

idx_threat_versions_status

idx_ttp_mapping_version

idx_threat_actor_profile_version

idx_threat_drift_metrics_timestamp

idx_threat_facility_links_facility

idx_threat_process_links_process

Full-Text Search Indexes

threat_records.threat_code

threat_versions.name

threat_versions.description

threat_classification.description

Vector Index (AI)

behaviour_vector (pgvector)

drift_vector (pgvector)

8. DATA FLOW ACROSS MODULES
To Vulnerability

Allowed threat categories

TTP-based vulnerability identification

To RA Engine

Threat likelihood (post-drift)

TAP-derived capability modifiers

TTP impact patterns

To WRAC

Threat description & likelihood

To PIT

Drift-driven priority changes

To Remote Assurance

TTP → Critical controls mapping

To Incident/Intel

Threat reinforcement learning from incidents

9. MIGRATION RULES (v0.1 → v1.1)

Migrate threat_classification to extended schema

Introduce drift and TAP tables

Introduce linking tables for processes and facilities

Introduce mandatory audit & AI logs

Introduce TTP reference library

Support pgvector embeddings

10. COMPLIANCE & GOVERNANCE

Full traceability

Append-only audit

Immutable published versions

AI safety logs mandatory

Org isolation strict

POPIA/GDPR-compliant storage

Separation of duties enforced via role model

✔ END OF THREAT_DATABASE_SCHEMA_v1.1.md