Below is the complete THREAT_EXPORT_SPEC_v1.0.md, aligned with the architecture, schema, edge functions, component map, wireframes, and QA plan.
This is the authoritative export specification for the Threat Module.

Place in:
/Modules/Risk Management/ThreatModule/THREAT_EXPORT_SPEC_v1.0.md

THREAT_EXPORT_SPEC_v1.0.md

Threat Module — Export Specification
Version: 1.0
Aligned with:

THREAT_TRUE_NORTH_v1.0.md

THREAT_DATABASE_SCHEMA_v1.1.md

THREAT_EDGE_FUNCTIONS_v1.1.md

THREAT_FRONTEND_COMPONENT_MAP_v1.1.md

THREAT_WIREFRAMES_v1.1.md

THREAT_QA_IMPLEMENTATION_PLAN_v1.1.md

SRMF Reporting & RA → WRAC → PIT Integration Rules

Maturion One-Time Build Philosophy

0. PURPOSE

This specification defines all export formats, file structures, data extraction rules, checksum logic, and security requirements for all Threat Module exports.

Exports support:

External audits

ERM reviews

Intelligence briefings

RA / WRAC integration

PIT project origination

Inter-company anonymised analytics

Disaster recovery

Forensics

Exports must be deterministic, stable, and version-controlled.

1. EXPORT TYPES

The Threat Module supports the following export types:

Export Type	Description	Format
Threat Version Bundle	Complete, structured export of a threat version	ZIP
Threat JSON Export	Machine-readable export	JSON
Threat YAML Export	Machine-readable export	YAML
Threat PDF Brief	Human-readable brief	PDF
Classification CSV	Matrix of classification values	CSV
TTP Mapping CSV	List of mapped TTPs	CSV
Audit Log CSV	Audit history	CSV
Threat Intelligence Snapshot	AI-assist intelligence bundle	JSON / PDF
2. EXPORT ROUTES

Edge function route prefix:

POST /export/threat/:version_id


With supported paths:

/export/threat/:version_id/json
/export/threat/:version_id/yaml
/export/threat/:version_id/pdf
/export/threat/:version_id/csv/classification
/export/threat/:version_id/csv/ttp
/export/threat/:version_id/csv/audit
/export/threat/:version_id/bundle
/export/threat/:version_id/intelligence


All exports require:

Authenticated user

Permission: THREAT_ANALYST or above

RLS: org_id match

Threat version must be published (except audit)

3. EXPORT RULES (CORE)
3.1 Source of Truth

Exports must use:

Published threat version

Immutable data

No draft or pending data unless explicitly allowed (audit export)

3.2 Deterministic Order

All arrays must follow deterministic sorting:

By field name

Then by UUID

3.3 Schema Stability

Every version of the export must follow the same structure.

3.4 Checksum Requirement

Each export bundle must include:

export_checksum.txt


Format:

SHA256: <hash>
GeneratedAt: <timestamp>
GeneratedBy: <user_id>
ThreatVersion: vX.Y.Z

3.5 AI Safety

Exports must NOT include:

Raw AI prompts

Intermediate embeddings

Internal model names

AI training/debug logs

They may include:

AI suggestions accepted

AI confidence values

AI-generated fields included in the final published version

4. EXPORT STRUCTURES
4.1 Threat JSON Export
{
  "threat_id": "UUID",
  "org_id": "UUID",
  "version": "v1.3",
  "status": "published",
  "metadata": {
    "name": "...",
    "code": "T-000132",
    "category": "adversarial",
    "subcategory": "criminal_opportunistic",
    "description": "..."
  },
  "classification": {
    "threat_type": "adversarial",
    "capability_level": 4,
    "motivation_level": 4,
    "opportunity_level": 3,
    "resource_level": 3,
    "historical_frequency": 47,
    "domain_relevance": {
      "security": true,
      "safety": false,
      "operational": true,
      "financial": false
    }
  },
  "actor_profile": {
    "actor_type": "syndicate",
    "skill_level": 4,
    "resources": "...",
    "capabilities": [
      {
        "name": "Surveillance Avoidance",
        "severity": 4,
        "evidence": "...",
        "ai_suggested": true
      }
    ],
    "behaviour_vector": { ... },
    "risk_factor_vector": { ... }
  },
  "ttp_mappings": [
    {
      "ttp_id": "UUID",
      "code": "T1059",
      "name": "Command Execution",
      "confidence": 0.83,
      "ai_generated": true
    }
  ],
  "drift_metrics": {
    "drift_score": 0.61,
    "drift_vector": { ... },
    "drift_reason": "Increase in armed robbery incidents",
    "source": "incident",
    "timestamp": "..."
  },
  "links": {
    "facilities": [
      {
        "facility_id": "UUID",
        "relevance": 0.8,
        "justification": "Historically targeted"
      }
    ],
    "processes": [
      {
        "process_id": "UUID",
        "relevance": 0.4,
        "justification": "Potential weak access points"
      }
    ]
  },
  "usage": {
    "in_ra_records": 17,
    "in_wrac_entries": 4,
    "in_pit_projects": 3
  }
}

4.2 Threat YAML Export

Must mirror JSON exactly.

Example:

threat_id: UUID
org_id: UUID
version: v1.3
status: published
metadata:
  name: "Armed robbery"
  code: "T-00123"
classification:
  threat_type: adversarial
  capability_level: 4
...

4.3 Threat PDF Brief

Audience: Managers, auditors, executives.

Sections:

Cover Page

Threat name

Version

Organisation

Status

Executive Summary

Category, subcategory

Drift summary

Key TTPs

TAP summary

Detailed Classification

TAP Details

TTP Mappings

Drift Timeline

Facility & Process Exposure

Usage Summary (RA/WRAC/PIT)

Page footer with:

Generated By

Timestamp

Checksum

4.4 Classification CSV

Headers:

threat_code,name,version,capability,motivation,opportunity,resources,historical_freq,security,safety,operational,financial

4.5 TTP Mapping CSV

Headers:

threat_code,version,ttp_code,ttp_name,domain,confidence,ai_generated

4.6 Audit Log CSV

Headers:

timestamp,user_id,action,old_value,new_value


old_value / new_value are JSON-escaped strings.

4.7 Threat Version Bundle (ZIP)

Structure:

threat_vX.Y.Z/
   ├── threat.json
   ├── threat.yaml
   ├── threat.pdf
   ├── classification.csv
   ├── ttp.csv
   ├── audit.csv
   ├── metadata.txt
   ├── export_checksum.txt

metadata.txt

Contains:

Threat: Armed Robbery
Version: v1.3
Org: <ORG>
Exported: <timestamp>

4.8 Intelligence Snapshot Export

Formats:

JSON

PDF (optional)

JSON structure:

{
  "threat_id": "UUID",
  "version": "v1.3",
  "intelligence": {
    "trend_summary": "...",
    "cluster_position": "...",
    "facility_exposure": [...],
    "controls_associated": [...],
    "projected_drift": 0.73,
    "ai_insights": "..."
  }
}


PDF includes:

Heatmaps

Timeline graphs

AI narrative summary

5. SECURITY REQUIREMENTS
5.1 Export Permissions

Only:

THREAT_ANALYST

THREAT_REVIEWER

THREAT_MANAGER

May generate exports.

ORG_READONLY may NOT.

5.2 RLS Enforcement

Exports may only include:

org_id = auth.org_id


If cross-company analytics are requested:

all threat_ids must be anonymised

no TAP capabilities exported

no facility/process mappings exported

5.3 Export Sanitisation

Before export:

Remove internal IDs referencing unrelated modules

Collapse embeddings

Remove AI raw prompts

Obfuscate user_id values unless explicitly requested by system administrators

6. ERROR HANDLING
6.1 Hard Failures

Threat version not published

User lacks permission

RLS violation

Broken reference (e.g., TTP missing)

Missing drift metrics or classification fields

6.2 Soft Failures (Warnings)

Missing TAP (non-adversarial allowed)

No TTPs for non-adversarial threats

No linked facilities

No linked processes

7. PERFORMANCE REQUIREMENTS

JSON/YAML/PDF generation: < 250ms

ZIP bundle generation: < 500ms

Audit CSV generation: streaming required for >10k events

PDF must be vector-based where possible

8. ACCEPTANCE CRITERIA

Exports will be accepted only if:

Structure matches this spec

All mandatory fields present

Checksum correct

Files deterministically sorted

PDF readable & properly formatted

No sensitive data leaks

No AI raw materials present

Foreman QA Checklist passes

✔ END OF THREAT_EXPORT_SPEC_v1.0.md