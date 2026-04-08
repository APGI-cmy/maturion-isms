THREAT_WATCHDOG_LOGIC_v1.0.md

Threat Module — Watchdog & Autonomous Monitoring Logic
Version: 1.0
Aligned with:

THREAT_TRUE_NORTH_v1.0.md

THREAT_DATABASE_SCHEMA_v1.1.md

THREAT_EDGE_FUNCTIONS_v1.1.md

THREAT_FRONTEND_COMPONENT_MAP_v1.1.md

SRMF Proactive Governance Framework

Maturion One-Time Build & Zero Regression

0. PURPOSE

The Threat Watchdog is a background monitoring and enforcement subsystem that guarantees:

Data integrity

Workflow integrity

Model safety

Drift stability

Downstream alignment (RA, WRAC, PIT, Intelligence)

Governance compliance

It operates continuously and autonomously, escalating issues to:

Analysts

Reviewers

Managers

PIT (if required)

Remote Assurance module

Intelligence module

The Watchdog ensures no silent failures, no stale threats, and no broken data chains.

1. WATCHDOG RESPONSIBILITIES

The Watchdog performs:

1.1 Data Integrity Monitoring

Checks for:

Orphaned records

Missing references

Invalid category/subcategory combos

Missing TAP for adversarial threat

Missing drift metrics

Invalid TTP references

1.2 Workflow Enforcement

Ensures:

Draft threats don’t stay idle > 30 days

Pending review versions escalate if stuck

Published versions remain immutable

Version cloning rules upheld

1.3 AI Behavior Monitoring

Ensures:

All AI suggestions stored in ai_log

AI confidence in valid range (0–1)

No AI auto-writes to DB

Drift/Classification/TAP suggestions consistent

1.4 Drift Anomaly Detection

Triggers:

Unexpected sharp drift increase

Drift values outside expected seasonal range

Drift > 0.75 → auto-escalate to PIT

Drift regression (sudden drop due to data loss)

1.5 TTP Integrity

Monitors:

Missing TTP definitions

Deprecated MITRE TTPs

TTP-confidence mismatches

Excessive reliance on AI-generated TTP mappings

1.6 Downstream Alignment

Verifies:

RA Engine likelihood computations match threat inputs

WRAC UE generation using correct threat version

PIT projects linked to threat drift escalations

Vulnerability-threat mappings in sync

1.7 SLA & Latency Health

Monitors:

API latency

TTP fetch performance

Drift timeline query performance

If a breach occurs → automatic alert.

2. WATCHDOG ARCHITECTURE

The Watchdog runs as:

Scheduled Background Functions (CRON + serverless triggers)
       +
Event-Based Listeners (DB triggers + edge function observers)
       +
AI-Assisted Anomaly Detection

3. WATCHDOG TRIGGER SCHEDULE
Every 5 minutes

Drift anomalies

AI safety checks

Workflow transitions stuck > threshold

Every 1 hour

TTP integrity checks

TAP completeness

Every 24 hours

Full schema integrity scan

Downstream RA/WRAC/PIT alignment check

Export pipeline health check

Real-Time (Event-driven)

On threat publish

On drift update

On TTP update

On TAP update

On incident → threat promotion

4. WATCHDOG FUNCTIONS (LOGIC)

Below are the functions grouped by responsibility.

4.1 Data Integrity Functions
watchdog_check_orphaned_records()

Detects:

Threat versions without parent threat

TAP without classification

Drift without version linkage

Resolution:

Auto-report to Threat Manager

If critical → lock editing

watchdog_validate_enums()

Ensures category/subcategory mapping remains valid.

Resolution:

Warning: Analyst review

Critical: Block publishing

watchdog_missing_components()

Checks whether key structures missing:

Missing TAP (adversarial threats)

Missing classification fields

Missing drift metrics

Missing or empty TTP list (if adversarial)

Resolution:

Auto-flag in dashboard

Email notification to responsible analyst

4.2 Workflow Watchdog
watchdog_stuck_drafts()

Draft > 30 days
→ Notify analyst & reviewer
→ Add UI banner

watchdog_stuck_reviews()

Pending review > 7 days
→ Escalate to Threat Manager

watchdog_published_immutability()

Detects updates attempted on published versions.
If detected → critical alert + auto-lock offender API key.

4.3 AI Watchdog
watchdog_ai_activity_log_consistency()

Checks that:

Every AI suggestion has a user acceptance flag

No missing ai_log entries

No invalid JSON payloads

watchdog_ai_confidence_range()

Ensures:

Confidence between 0–1

No null or malformed confidence

watchdog_ai_drift_anomaly()

Detects:

AI drift recommendations far outside expected envelope

4.4 Drift Monitoring Watchdog
watchdog_drift_trend_analysis()

Checks:

Drift trending upward too fast

Seasonal anomalies

Incident-driven drift spikes

Escalation:

If drift_score > 0.75 →

Auto-create PIT Project (Threat Drift Escalation)

Notify Threat Manager

Notify RA Engine

watchdog_drift_regression()

Detects sudden drift drops, indicating data loss.

4.5 TTP Integrity Watchdog
watchdog_ttp_reference_health()

Checks:

Deprecated MITRE TTP codes

Missing or unresolvable TTP references

watchdog_ttp_confidence_monitor()

Detects:

Over-reliance on low-confidence TTPs

50% AI-generated with low confidence

4.6 Downstream Integration Watchdog
watchdog_ra_alignment()

Ensures RA likelihood matches threat version.

If mismatch detected:

Auto-regenerate RA likelihood

Notify RA module

Flag for analyst review

watchdog_wrac_alignment()

Checks WRAC entries referencing outdated threat versions.

If mismatch:

Auto-flag WRAC record

Notify WRAC owner

watchdog_pit_alignment()

Ensures drift escalations propagate to PIT.

If missing:

Create PIT project automatically

4.7 Performance Watchdog
watchdog_api_latency_monitor()

Triggers when:

250ms for threat API

350ms for intelligence queries

150ms for TTP fetch

Actions:

Log incident

Suggest caching

Suggest DB index tuning

5. WATCHDOG ALERTING & NOTIFICATION

Alerts follow a tiered structure:

Tier 1 — Information

Stuck draft

No TTPs for non-adversarial threat

Missing TAP in non-adversarial threat

Tier 2 — Warning

Drift rising

Low-confidence AI suggestions

Out-of-date WRAC referencing old threat version

Tier 3 — Critical

Attempted mutation of published version

Orphaned essential tables

Drift >0.75 (auto-PIT escalation)

Broken TTP references

AI log missing for AI-based functions

Alert Targets:

Threat Analyst

Threat Reviewer

Threat Manager

RA & WRAC owners (when impacted)

PIT Project Manager (on escalation)

6. WATCHDOG UI COMPONENTS

Displayed in Threat Intelligence Dashboard:

Drift anomaly warnings

TTP integrity alerts

TAP completeness indicator

Workflow stuck items

RA alignment indicators

PIT escalation flags

AI activity health

Displayed in ISMS Global Watchdog Panel:

Cross-module alert map

Threat module health indicators

7. WATCHDOG FAILSAFE ACTIONS

If a major corruption or inconsistent state is detected:

7.1 Auto-Lock Threat Version

Version becomes read-only until reviewed.

7.2 Auto-Clone Recovery Draft

A draft version is cloned from last known-good state.

7.3 Auto-Correct References

For missing TTP or vulnerability mappings.

7.4 Auto-Escalate to PIT

For high drift.

7.5 Auto-Notify SRMF Admin

For any failed integrity check.

8. WATCHDOG LOGGING

All watchdog findings are recorded in:

watchdog_event_log


Fields:

id

event_type

severity

message

details JSON

timestamp

resolved (boolean)

resolved_by

Every alert must have:

Ticket number (automatically generated)

Resolution workflow

9. RECOVERY WORKFLOWS
9.1 Data Inconsistency Recovery

Auto-create ticket

Analyst review

Foreman approval

Patch edge functions or data

Close ticket

9.2 Drift Spike Recovery

Trigger PIT project

Analyst reviews threat

Manager approves drift interpretation

RA recomputation

9.3 AI Misalignment

Retrain or adjust model

Update guardrails

Manual review of impacted threats

9.4 TTP Migration

For MITRE updates (e.g., v14 → v15)

Auto-deprecate obsolete TTPs

Auto-map successors (if defined)

Analyst confirmation required

10. ACCEPTANCE CRITERIA

Threat Watchdog is complete when:

All checks implemented

All alert levels functioning

All escalation paths validated

PIT escalation works

RA/WRAC alignment validated

Drift anomaly detection operational

AI safety validations active

Zero false-positive hard failures

Full QA checks pass

✔ END OF THREAT_WATCHDOG_LOGIC_v1.0.md