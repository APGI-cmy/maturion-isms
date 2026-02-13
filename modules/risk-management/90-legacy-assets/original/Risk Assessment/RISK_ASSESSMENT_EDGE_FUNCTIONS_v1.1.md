Below is the complete, upgraded RISK_ASSESSMENT_EDGE_FUNCTIONS_v1.1.md, aligned with:

RISK_ASSESSMENT_TRUE_NORTH_v1.1.md

RISK_ASSESSMENT_DATABASE_SCHEMA_v1.1.md

ERM v1.1 (likelihood, impact, appetite, heatmap)

Threat v1.1 (TTPs, drift, adversarial/non-adversarial classification)

Vulnerability v1.1 (exploitability, TVRE, UE)

Control Library v1.1

Control Efficacy v1.1

WRAC v1.1

PIT v1.1

Remote Assurance (future)

Maturion One-Time Build & Zero Regression principles

SRMF deterministic scoring and governance

This is the full backend logic layer, suitable for Foreman + CoPilot implementation.

Place in:
/Modules/Risk Management/Risk Assessment/RISK_ASSESSMENT_EDGE_FUNCTIONS_v1.1.md

RISK_ASSESSMENT_EDGE_FUNCTIONS_v1.1.md

SRMF Risk Assessment Engine — Edge Functions Specification
Version: 1.1
Prepared for: Maturion ISMS / SRMF Architecture
Purpose: Define all backend/edge functions powering the RA Engine

0. PURPOSE

This document defines every backend function required to:

Create RA records

Calculate inherent, residual, and projected risk

Integrate with Threat, Vulnerability, and Control modules

Perform ALE, likelihood, impact, and UE intake processing

Connect WRAC, PIT, and future Remote Assurance updates

Support monitoring, Watchdog validation, and recalculation

Produce deterministic, auditable outputs

Edge Functions are separated into:

1. UE Intake Functions
2. Likelihood Engine Functions
3. Impact Engine Functions
4. ALE Calculation Functions
5. Control Effectiveness Functions
6. Residual Risk Functions
7. Projected Risk Functions
8. Workflow Functions
9. Watchdog Functions
10. Integration Functions (WRAC, PIT, Remote Assurance)
11. AI-Assisted Functions (staged only)
12. Utilities & Shared Logic

1. UE INTAKE FUNCTIONS
1.1 create_ra_from_ue(ue_id, actor_id)

Creates a new RA record each time a UE is approved.

Inputs:

ue_id

user/actor ID

Process:

Validate UE state (must be approved).

Pull threat/vulnerability data.

Pull architecture node.

Create RA draft.

Create empty sub-records:

likelihood

impact

control assessment

residual

projected

Log RA creation to AI log (baseline).

Output:
ra_id

1.2 validate_ue_integrity_for_ra(ue_id)

Checks:

UE has valid threat version

UE has valid vulnerability version

TVRE score not expired

UE sentence version matches underlying data

Throws Critical Watchdog alert if violated.

2. LIKELIHOOD ENGINE FUNCTIONS
2.1 compute_inherent_likelihood(ra_id)

Implements NIST 800-30 logic:

inherent_likelihood = f(threat capability,
                         vulnerability exploitability,
                         TVRE modifier,
                         threat drift,
                         historical data,
                         environment)


Steps:

Pull threat capability + actor type.

Pull vulnerability exploitability.

Apply TVRE relevance modifier.

Apply threat drift modifier.

Aggregate using calibrated formula:

Formula (canonical SRMF):
L = (Cthreat × Eexploit × Rrelevance × Ddrift)


Output:

numeric value (0–1)

mapped ERM likelihood level

descriptor

2.2 compute_residual_likelihood(ra_id)
L_residual = L_inherent × (1 − control_effectiveness)

2.3 compute_projected_likelihood(ra_id)

Uses projected control effectiveness:

L_projected = L_inherent × (1 − projected_control_effectiveness)

3. IMPACT ENGINE FUNCTIONS
3.1 compute_inherent_impact(ra_id)

If ALE override active → direct mapping.
Else → ERM qualitative matrix.

Pulls:

impact data (safety, environmental, regulatory, etc.)

ERM impact scales

EBITDA or company-defined metric

Formula:
I = max( financial_impact_level,
         safety_level,
         operational_level,
         env_level,
         regulatory_level )


Produces:

numeric normalized impact

ERM impact level

descriptor

3.2 compute_residual_impact(ra_id)
I_residual = I_inherent × (1 − control_impact_effectiveness)

3.3 compute_projected_impact(ra_id)
I_projected = I_inherent × (1 − projected_impact_effectiveness)

4. ALE ENGINE FUNCTIONS
4.1 compute_ale(ra_id)
Formula:
ALE = asset_value × exposure_rate × ARO


Writes result to:

risk_ale_quantification

risk_impact_analysis (if override active)

Triggers impact recalculation.

4.2 map_ale_to_impact_level(ale_value, company_id)

Uses ERM-defined thresholds:

IF ale >= catastrophic_threshold → Catastrophic
ELSE IF ale >= major_threshold → Major
...

5. CONTROL ENVIRONMENT FUNCTIONS
5.1 calculate_control_effectiveness(ra_id)
Subcomponents:

Design effectiveness

Implementation effectiveness

Availability effectiveness

Formula:

CONTROL_EFFECTIVENESS = DESIGN × IMPLEMENTATION × AVAILABILITY


Hard cap: 0.90.

5.2 calculate_projected_control_effectiveness(ra_id)

Based on proposed controls:

uses dependencies

checks incompatibilities

ranks by hierarchy (Eliminate > Substitute > Engineering > Admin > PPE)

5.3 update_control_availability_from_remote_assurance(ra_id)

(future)

Pulls availability metrics for:

CCTV uptime

Access control uptime

Alarm system uptime

Detection sensors

Updates live residual risk.

6. RESIDUAL RISK ENGINE FUNCTIONS
6.1 compute_residual_risk(ra_id)
R_residual = MATRIX(L_residual, I_residual)


Maps to:

numeric risk

level

heatmap color

appetite flag

Also writes:

WRAC

Dashboard

7. PROJECTED RISK ENGINE FUNCTIONS
7.1 compute_projected_risk(ra_id)
R_projected = MATRIX(L_projected, I_projected)


Stored in:

risk_projected_risk

WRAC projected section

7.2 compute_projected_remaining_risk_pct(ra_id)
pct = R_projected / R_inherent × 100

7.3 compute_projected_roi(ra_id)
Formula:
ROI = (Expected_Loss_Prevented − Control_Cost) / Control_Cost


Expected loss prevented =
ALE_before – ALE_after (if ALE exists)
or
ERM impact mapped to currency diff.

8. WORKFLOW EDGE FUNCTIONS
8.1 ra_submit_for_review(ra_id, actor_id)

Validates that:

likelihood exists

impact exists

controls assessed

8.2 ra_approve(ra_id, approver_id)

Locks RA:

immutable

archived only via workflow

Triggers:

WRAC refresh

PIT suggestion if above appetite

8.3 ra_archive(ra_id, actor_id)

Only permitted when:

controls implemented OR

risk eliminated OR

risk no longer applicable

Stores snapshot to history.

9. WATCHDOG EDGE FUNCTIONS
9.1 ra_watchdog_likelihood_check(ra_id)

Checks:

missing components

drift changes requiring recalculation

out-of-sync TVRE

High severity if drift or TVRE mismatch.

9.2 ra_watchdog_impact_check(ra_id)

Checks:

impact not aligned with ALE

ERM definitions changed

missing financial reference

9.3 ra_watchdog_control_check(ra_id)

Checks:

90% effectiveness

missing dependencies

circular dependencies

invalid control types

9.4 ra_watchdog_roi_check(ra_id)

Checks:

ROI missing cost

projected ROI negative without justification

ALE not applied where needed

9.5 ra_watchdog_matrix_consistency_check(ra_id)

Checks:

consistency with ERM heatmap

appetite mismatch

9.6 ra_watchdog_escalation_to_pit(ra_id)

If risk > appetite & RA approved → auto-create PIT signal.

10. INTEGRATION EDGE FUNCTIONS
10.1 ra_push_to_wrac(ra_id)

Writes:

inherent

residual

projected

ROI

color bands

priority

All values deterministic.

10.2 ra_generate_pit_project(ra_id)

Creates PIT project with:

recommended controls

estimated cost

implementation timeline

10.3 ra_update_from_pit_progress(ra_id)

Recalculates:

residual risk

live risk

projected risk

ROI

Based on PIT progress.

10.4 ra_real_time_update_from_remote_assurance(ra_id)

(future)

Integrates system availability:

L_residual_live = L_inherent × (1 − live_control_effectiveness)

11. AI ASSISTED FUNCTIONS (STAGED — NO DIRECT COMMIT)
11.1 ai_summarize_ra_context(ra_id)

Generates human-readable contextual summary.
Stored in AI log only.

11.2 ai_validate_control_set(ra_id)

Provides recommendations, but never commits.

11.3 ai_assist_ue_clarity(ue_id)

Polishes UE descriptions; human must approve.

11.4 ai_risk_trend_prediction(ra_id)

(future)

Predicts risk trajectory.

12. UTILITIES & SHARED LOGIC
12.1 get_erm_settings(company_id)

Returns entire ERM profile.

12.2 matrix_lookup(likelihood_level, impact_level)

Returns deterministic risk values.

12.3 normalize(value,min,max)

Standard normalization.

13. PERFORMANCE REQUIREMENTS (MANDATORY)

All single RA calculations must complete < 150 ms

All batched recalculations < 2 seconds

All Watchdog checks < 80 ms

UE → RA generation < 120 ms

14. ACCEPTANCE CRITERIA (v1.1)

The RA Engine Edge Functions are complete when:

All sub-engines implemented

All validation + Watchdog functions live

Full WRAC & PIT integrations functional

AI staging functions operational

Deterministic computation verified

Foreman signs off

✔ END OF RISK_ASSESSMENT_EDGE_FUNCTIONS_v1.1.md