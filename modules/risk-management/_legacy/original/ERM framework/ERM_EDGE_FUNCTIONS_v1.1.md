Here’s ERM_EDGE_FUNCTIONS_v1.1.md, aligned with the ERM True North and DB schema, and in the same style as PIT/WRAC.

Place in:
/Modules/Risk Management/ERM framework/ERM_EDGE_FUNCTIONS_v1.1.md

ERM_EDGE_FUNCTIONS_v1.1.md

Enterprise Risk Management — Edge Functions & API Specification
Version 1.1
Aligned with:

ERM_TRUE_NORTH_v1.0.md

ERM_DATABASE_SCHEMA_v1.1.md

ERM_HEATMAP_CONFIG_v0.1.md

ERM_LIKELIHOOD_SCALE_v0.1.md

ERM_IMPACT_SCALE_v0.1.md

ERM_RISK_APPETITE_v0.1.md

ERM_RISK_MATRIX_v0.1.md

ERM_ROLES_RESPONSIBILITIES_v0.1.md

ERM_INTEGRATION_SPEC_v0.1.md

0. PURPOSE

This document defines all backend functions required to implement the ERM module as a service inside Maturion ISMS.

It specifies:

Function names

Responsibilities

Inputs / outputs

Security & RLS rules

Side effects

Integration contracts

AI helper functions (suggestions only, no direct writes)

ERM functions are governance-grade. Any change here affects all downstream risk logic (Threat, Vulnerability, RA, WRAC, Controls, PIT, Bowtie, Incident, Audit, Remote Assurance).
Precision is non-negotiable.

1. DESIGN PRINCIPLES FOR ERM EDGE FUNCTIONS

Read-Heavy, Write-Guarded
Most consumers read ERM. Writes are rare and tightly controlled.

Versioned, Never Retroactively Mutated
No editing of published ERM profiles. Only new versions.

Role-based & RLS-Safe
Only specific ERM roles may create/approve/publish.

Deterministic Outputs
Same inputs → same ERM output. No randomness.

AI is Advisory Only
AI endpoints propose, humans approve.

Strict Downstream Contract
Functions consumed by RA, WRAC, PIT etc must be stable and versioned.

2. FUNCTION GROUPS (OVERVIEW)

ERM functions are grouped as:

Profile Lifecycle

Likelihood & Impact Management

Heatmap & Matrix Generation

Appetite & Domain Rules

Hierarchy & Inheritance

Approvals & Publishing

Read-Only Consumption APIs (for RA/WRAC/PIT/etc.)

AI-Assisted Suggestion Functions

Audit & Diagnostics

Each group is detailed below.

3. PROFILE LIFECYCLE FUNCTIONS
3.1 erm_create_profile

Purpose: Start a new ERM profile (draft) for an organisation.

Input:

{
  "org_id": "uuid",
  "version_major": 1,
  "version_minor": 1,
  "notes": "Initial ERM baseline"
}


Output:

{
  "profile_id": "uuid",
  "status": "draft"
}


Rules:

Caller must have ERM_ADMIN or higher for org_id.

Validates no duplicate version for that org.

Creates initial audit entry: PROFILE_CREATED.

3.2 erm_clone_profile

Purpose: Create a new profile by cloning an existing one (for revision or another org).

Input:

{
  "source_profile_id": "uuid",
  "target_org_id": "uuid | null", 
  "increment_minor": true
}


Behaviour:

Clones all related tables: likelihood, impact, heatmap, appetite, domain_config.

If target_org_id null → same org, version bump.

If target_org_id specified → cross-org copy as draft.

Output:

{
  "profile_id": "uuid",
  "status": "draft",
  "copied_from": "source_profile_id"
}

3.3 erm_get_profiles_for_org

Purpose: List all profiles for an organisation.

Input:

{ "org_id": "uuid" }


Output:
Array of profiles with status & version.

3.4 erm_get_active_profile

Purpose: Get the currently active/published profile for an organisation.

Input:

{ "org_id": "uuid" }


Output:

{
  "profile_id": "uuid",
  "version": "1.1",
  "status": "published"
}


Use:
All downstream modules call this when they need the current ERM config.

4. LIKELIHOOD & IMPACT MANAGEMENT FUNCTIONS
4.1 erm_set_likelihood_levels

Purpose: Define or update the likelihood scale for a draft profile.

Input:

{
  "profile_id": "uuid",
  "levels": [
    { "level": 1, "score": 0.1, "descriptor": "Rare", "guidance": "...", "colour_hex": "#D4E6F1" },
    { "level": 2, "score": 0.5, "descriptor": "Unlikely", ... }
  ]
}


Constraints:

Only allowed if profile status = 'draft'.

Levels must be contiguous (1..N).

Scores must be unique within profile.

Output: confirmation + validation summary.

4.2 erm_set_impact_levels

Purpose: Configure impact scales per domain.

Input:

{
  "profile_id": "uuid",
  "domain": "financial",
  "levels": [
    {
      "level": 1,
      "score": 100000,
      "descriptor": "Minor loss",
      "financial_threshold": 100000,
      "guidance": "...",
      "colour_hex": "#D4E6F1"
    }
  ]
}


Rules:

One call per domain or bulk supported.

Only allowed if profile is draft.

Levels must be contiguous & non-overlapping.

4.3 erm_get_likelihood_scale

Purpose: Allow RA/Threat modules to retrieve ERM likelihood scale.

Input:

{ "org_id": "uuid", "profile_id": "uuid | null" }


If profile_id null → use active profile.

Output: array of levels with scores & descriptors.

4.4 erm_get_impact_scale

Similar to likelihood, but per domain.

5. HEATMAP & RISK MATRIX FUNCTIONS
5.1 erm_generate_risk_matrix

Purpose: Generate full NxN matrix for a profile based on configured likelihood & impact levels and defined mapping rules.

Input:

{
  "profile_id": "uuid",
  "mapping_strategy": "standard_5x5"  // or "custom"
}


Behaviour:

Calculates every (likelihood_level, impact_level) cell.

Assigns:

risk_level_enum (Extreme/High/Medium/Low/Very Low),

colour,

descriptor,

numeric_min/max (if applicable),

default appetite markers.

Output:

{
  "profile_id": "uuid",
  "cells_created": N,
  "warnings": []
}


Rules:

Only allowed if profile is draft.

Ensures full NxN coverage, no missing cells.

5.2 erm_get_risk_matrix

Purpose: Give downstream modules access to the entire heatmap.

Input:

{ "org_id": "uuid", "profile_id": "uuid | null" }


Output:

{
  "matrix": [
    {
      "likelihood_level": 3,
      "impact_level": 4,
      "risk_level": "High",
      "colour_hex": "#E74C3C",
      "descriptor": "High risk"
    }
  ]
}

5.3 erm_get_risk_cell

Purpose: Given a likelihood & impact level, return the classification.

Input:

{
  "org_id": "uuid",
  "likelihood_level": 3,
  "impact_level": 4
}


Output:

{
  "risk_level": "High",
  "colour_hex": "#E74C3C",
  "descriptor": "High risk",
  "numeric_min": 12,
  "numeric_max": 16
}


Use:
RA Engine, WRAC, PIT (for visual mapping), Bowtie, etc.

6. APPETITE & DOMAIN RULE FUNCTIONS
6.1 erm_set_appetite_rules

Purpose: Set appetite thresholds per domain for a profile.

Input:

{
  "profile_id": "uuid",
  "rules": [
    {
      "domain": "financial",
      "appetite_level": "Medium",
      "trigger_score_min": 10,
      "trigger_score_max": 15,
      "workflow_requirement": "requires_senior_approval"
    }
  ]
}


Rules:

Only for draft profiles.

One appetite level per domain.

6.2 erm_get_appetite_rules

Purpose: For RA, WRAC, PIT, Bowtie, Incident, Audit, Remote Assurance.

Input:

{ "org_id": "uuid", "profile_id": "uuid | null" }


Output: array of appetite rules.

6.3 erm_evaluate_appetite

Purpose: Given a risk classification & domain, determine if within/approaching/breach.

Input:

{
  "org_id": "uuid",
  "domain": "security",
  "risk_level": "High",
  "numeric_score": 14
}


Output:

{
  "condition": "breach",
  "appetite_level": "Medium",
  "workflow_requirement": "requires_executive_signoff"
}


Use:
RA residual risk evaluation, WRAC, PIT prioritisation, Watchdog severity.

7. HIERARCHY & INHERITANCE FUNCTIONS
7.1 erm_link_profile_to_hierarchy

Purpose: Link an ERM profile to parent/child orgs and define inheritance.

Input:

{
  "profile_id": "uuid",
  "parent_org_id": "uuid",
  "child_org_id": "uuid",
  "inherit_all": true,
  "overrides": {
    "domain": "financial",
    "appetite_level": "High"
  }
}


Rules:

Requires parent org approval.

Overrides must be within allowed bounds.

7.2 erm_resolve_effective_profile_for_org

Purpose: Given any org node, resolve which ERM profile and rules apply (considering inheritance and overrides).

Input:

{ "org_id": "uuid" }


Output:

{
  "profile_id": "uuid",
  "inherits_from_org_id": "uuid | null",
  "overrides": {...}
}


Use:
All downstream modules use this to know which ERM profile they are bound to.

8. APPROVAL & PUBLISHING FUNCTIONS
8.1 erm_submit_profile_for_approval

Purpose: Transition draft profile to pending_approval.

Input:

{ "profile_id": "uuid" }


Checks:

Likelihood levels complete

Impact levels complete

Matrix generated & full coverage

Appetite defined for all domains used

No schema inconsistencies

8.2 erm_review_profile

Purpose: Approver reviews and sets status.

Input:

{
  "profile_id": "uuid",
  "action": "approve" | "reject",
  "comment": "..."
}


Behaviour:

Creates erm_approval_records entry.

If approved, status → approved.

If rejected, stays draft with comment.

8.3 erm_publish_profile

Purpose: Activate profile and mark as the organisation’s ERM baseline.

Input:

{ "profile_id": "uuid" }


Checks:

status must be approved

no critical validation failures

RLS: ERM_ADMIN or higher

Behaviour:

status → published

is_active = true for this profile, false for others in same org

triggers ERM_PROFILE_CHANGED event for all dependent modules

9. READ-ONLY CONSUMPTION APIS

These are used by other modules; they must be stable and simple.

9.1 erm_get_effective_profile_bundle

Purpose: Return a ready-to-use bundle for a given org, containing all scales, heatmap, appetite.

Input:

{ "org_id": "uuid" }


Output:

{
  "profile": {...},
  "likelihood_scale": [...],
  "impact_scales": {...},
  "risk_matrix": [...],
  "appetite_rules": [...],
  "domain_config": [...]
}

9.2 erm_resolve_risk_classification

Purpose: Given likelihood level & impact level (& domain), return full risk classification and appetite condition in one call.

Input:

{
  "org_id": "uuid",
  "likelihood_level": 3,
  "impact_level": 4,
  "domain": "security"
}


Output:

{
  "risk_level": "High",
  "colour_hex": "#E74C3C",
  "descriptor": "High risk",
  "appetite_condition": "breach",
  "appetite_level": "Medium",
  "workflow_requirement": "requires_executive_signoff"
}


Use:
RA engine, WRAC, PIT, Incident, Audit, Bowtie, Remote Assurance.
This is the workhorse classification endpoint.

10. AI-ASSISTED SUGGESTION FUNCTIONS

These functions never write directly to ERM tables; they only propose.

10.1 erm_ai_suggest_likelihood_scale

Purpose: Suggest a likelihood scale based on historical incidents, threats, and organisation profile.

Input:

{
  "org_id": "uuid",
  "reference_data": {...}
}


Output:

{
  "suggested_levels": [...],
  "confidence": 0.82,
  "rationale": "..."
}

10.2 erm_ai_suggest_impact_scale

Similar to above, for impact per domain.

10.3 erm_ai_suggest_heatmap_mapping

Purpose: Suggest how to map the NxN corners & gradients to risk levels.

10.4 erm_ai_compare_profiles

Purpose: Compare two ERM profiles and highlight differences.

Input:

{
  "profile_id_a": "uuid",
  "profile_id_b": "uuid"
}


Output: diff summary.

10.5 erm_ai_calibrate_appetite

Purpose: Look at historical losses & near misses to suggest appetite adjustments.

11. AUDIT & DIAGNOSTIC FUNCTIONS
11.1 erm_get_audit_trail

Purpose: Fetch full audit history for a profile.

11.2 erm_get_profile_health_check

Purpose: Validate if a profile is structurally sound.

Output:

{
  "profile_id": "uuid",
  "valid": true,
  "warnings": [],
  "errors": []
}

11.3 erm_export_profile_bundle

Purpose: Export full ERM configuration in a portable format (JSON/YAML/PDF summary), aligned with a future ERM_EXPORT_SPEC_v1.0.md.

12. SECURITY & RLS RULES

All mutating functions require ERM_ADMIN / ERM_MANAGER role.

Read-only functions honour org_id RLS (no cross-org leaks).

AI functions are permission-controlled (ERM roles only).

Audit logging is mandatory for all mutating calls.

13. ERROR CODES

Standard ERM error codes:

ERM001 – profile_not_found
ERM002 – invalid_status_transition
ERM003 – incomplete_scale_definition
ERM004 – heatmap_incomplete
ERM005 – appetite_missing
ERM006 – approval_required
ERM007 – insufficient_permissions
ERM008 – immutable_profile
ERM009 – inheritance_conflict
ERM010 – ai_suggestion_low_confidence

✔ END OF ERM_EDGE_FUNCTIONS_v1.1.md