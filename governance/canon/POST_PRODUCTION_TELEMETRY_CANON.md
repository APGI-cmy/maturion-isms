# POST-PRODUCTION TELEMETRY CANON

## Status
**Type**: Tier-1 Canonical Governance Standard
**Authority**: CS2 (Johan Ras)
**Version**: 1.0.0
**Effective Date**: 2026-02-26
**Owner**: Maturion Engineering Leadership (Johan Ras)
**Layer-Down Status**: PUBLIC_API
**Applies To**: All Foreman Instances, All Application Repositories, All Wave Executions, All Builders, All QA/Audit Processes, Commissioning Layers, Progressive Activation Governance

---

## 1. Purpose

This document establishes **mandatory post-production health verification and telemetry governance requirements** for all Maturion applications after production deployment. Previously, governance focused exclusively on pre-production quality gates. Once an application was deployed, no canonical requirement existed for scheduled regression testing, telemetry health snapshots, or incident-free verification periods.

This canon closes that gap by defining:
- Post-production telemetry gate requirements
- Incident-free verification period requirements before commissioning milestones
- Scheduled regression testing cadences
- Health snapshot requirements at commissioning and progressive-activation governance layers

**Canonical Gap Addressed**: The ACTIVATION_STATE_MODEL.md defines activation states (DORMANT → SHADOW → LIMITED → GENERAL → FULL) and the FINAL_COMPLETE_WAVE_TEST_PROTOCOL.md covers pre-production validation — but no canon governed the health verification requirements after activation transitions. This canon governs the health verification obligations that apply at each activation layer and on an ongoing basis.

---

## 2. Constitutional Authority

This canon derives authority from and integrates with:

- **LIVING_AGENT_SYSTEM.md v6.2.0** — Supreme governance authority
- **ACTIVATION_STATE_MODEL.md** — Activation state definitions and transition requirements
- **BUILD_PHILOSOPHY.md** — One-Time Build Law: delivered means working 100%
- **FINAL_COMPLETE_WAVE_TEST_PROTOCOL.md** — Pre-production FCWT requirements
- **FULLY_FUNCTIONAL_DELIVERY_STANDARD.md** — Three definitions of "fully functional"
- **PROGRESSIVE_DISCLOSURE_AND_ACTIVATION.md** — Progressive activation governance (if applicable)

---

## 3. Core Concepts

### 3.1 Telemetry Health Gate

A **Telemetry Health Gate** is a mandatory checkpoint that evaluates the health of a deployed application against defined thresholds before:
- Advancing to the next activation state
- Signing off a commissioning milestone
- Closing a post-production observation window
- Releasing the next version

### 3.2 Health Snapshot

A **Health Snapshot** is a point-in-time record of key application health metrics, produced at scheduled intervals or at governance-defined checkpoints. It serves as immutable evidence of the application's operational health.

### 3.3 Observation Window

An **Observation Window** is the mandatory period after a deployment or activation transition during which the application is actively monitored for errors, performance degradation, or functional failures before the transition is certified as stable.

---

## 4. Telemetry Infrastructure Requirements

### REQ-PPT-001 — Mandatory Telemetry Instrumentation

**Requirement**: All production applications MUST be instrumented with telemetry before production deployment. Minimum telemetry instrumentation includes:

1. **Error tracking**: Unhandled exceptions and errors captured with stack traces and context
2. **Request tracing**: HTTP request/response times, error rates, status code distribution
3. **Application logs**: Structured logs (JSON preferred) shipped to a centralized log store
4. **Availability monitoring**: Uptime / health-check endpoint monitored at ≤ 5-minute intervals
5. **Business metric events**: Key user actions tracked (user registrations, transactions, key workflow completions)

**Evidence Required**: Telemetry configuration file; dashboard showing all 5 categories instrumented.

**Gate**: Pre-production deployment. BLOCKING — no application may enter production without telemetry instrumentation.

---

### REQ-PPT-002 — Health Check Endpoint

**Requirement**: All production applications MUST expose a `/health` (or equivalent) HTTP endpoint that:

1. Returns HTTP 200 when the application is healthy
2. Returns HTTP 503 when the application is degraded or unhealthy
3. Includes at minimum: status (healthy/degraded/unhealthy), version, uptime duration, and dependent service status
4. Is unauthenticated (publicly accessible for monitoring systems)
5. Responds within 500ms under normal load

**Evidence Required**: Health endpoint verified in FCWT evidence; monitoring configured to alert on non-200 response.

---

### REQ-PPT-003 — Telemetry Baseline Registration

**Requirement**: Within 7 days of initial production deployment, the team MUST register a **telemetry baseline** including:

1. P50, P95, P99 response times for all critical endpoints (measured from production traffic)
2. Baseline error rate (errors per 1,000 requests)
3. Baseline availability percentage
4. Expected peak traffic shape (daily/weekly patterns)
5. Critical business metric baseline (e.g., expected daily active users, transaction volume)

**File**: `monitoring/telemetry-baseline.json` (or equivalent in the application repository).

**Evidence Required**: Telemetry baseline registered and FM-approved within 7 days of production launch.

---

## 5. Activation State Health Gates

### REQ-PPT-004 — Shadow Activation Health Gate

**Requirement**: Before transitioning from SHADOW to LIMITED activation:

1. Application MUST have been in SHADOW mode for a minimum of **48 hours**
2. Zero Critical errors detected during the observation window
3. P95 response time MUST be within 10% of FCWT benchmark
4. Availability MUST be ≥ 99.5% during observation window
5. All automated health checks MUST be passing

**Health Snapshot Required**: A formal Health Snapshot MUST be produced covering the 48-hour SHADOW window, recording all 5 metrics above.

**Gate**: BLOCKING — transition to LIMITED requires FM sign-off on the Health Snapshot.

---

### REQ-PPT-005 — Limited Activation Health Gate

**Requirement**: Before transitioning from LIMITED to GENERAL activation:

1. Application MUST have been in LIMITED mode for a minimum of **7 days**
2. Zero Critical errors detected during the observation window
3. Maximum 1 High-severity error per 10,000 requests
4. P95 response time MUST remain within 15% of the registered telemetry baseline
5. Availability MUST be ≥ 99.9% during the observation window
6. Business metric performance within 20% of projected baseline
7. Scheduled regression test MUST have run and passed during this window

**Health Snapshot Required**: A formal Health Snapshot covering the 7-day LIMITED window, recording all 7 metrics above.

**Gate**: BLOCKING — transition to GENERAL requires FM sign-off and CS2 review of the Health Snapshot.

---

### REQ-PPT-006 — General to Full Activation Health Gate

**Requirement**: Before transitioning from GENERAL to FULL activation:

1. Application MUST have been in GENERAL mode for a minimum of **14 days**
2. Zero Critical errors in the past 7 days
3. Availability ≥ 99.95% over the 14-day window
4. P99 response time MUST remain within 20% of baseline
5. Two scheduled regression test runs MUST have passed during this window
6. No open P1/P2 incidents related to the application
7. Business metric performance within 10% of projected baseline

**Health Snapshot Required**: Formal Health Snapshot covering the 14-day GENERAL window.

**Gate**: BLOCKING — CS2 sign-off required for FULL activation.

---

## 6. Observation Window Requirements

### REQ-PPT-007 — Post-Deployment Observation Window

**Requirement**: Every production deployment (including hotfixes, minor updates, and configuration changes) MUST have a mandatory observation window:

| Deployment Type | Observation Window | Monitoring Intensity |
|-----------------|--------------------|---------------------|
| Major release (new features) | 24 hours | Active — FM and builder on call |
| Minor release (bug fixes, improvements) | 4 hours | Active — builder monitors |
| Hotfix / emergency patch | 2 hours | Active — builder + FM monitors |
| Configuration-only change | 1 hour | Passive — automated monitoring only |

**Early Termination**: An observation window may be terminated early only if:
- Zero errors detected in the first half of the window
- All health check metrics within baseline thresholds
- FM explicitly approves early termination with documented rationale

**Gate**: Observation window completion is required before the deployment is marked STABLE. No subsequent deployments to the same environment until the current window completes (or is FM-approved early terminated).

---

### REQ-PPT-008 — Incident-Free Verification Period

**Requirement**: An **Incident-Free Verification Period (IFVP)** of **72 hours** is required before:

1. Closing a commissioning milestone (application sign-off)
2. Transitioning from SHADOW → LIMITED
3. Releasing the application to external users for the first time

During the IFVP:
- Zero Critical or High severity incidents recorded
- Zero health check failures lasting > 5 minutes
- All automated regression tests passing (most recent scheduled run)
- FM actively reviewing telemetry daily

**If IFVP is broken** (a Critical/High incident occurs):
- IFVP resets to zero hours
- Incident MUST be resolved and root-caused before IFVP resumes
- CS2 notification required if IFVP is broken more than twice

**Evidence Required**: IFVP completion record with timestamps and health metric summary.

---

## 7. Scheduled Regression Testing

### REQ-PPT-009 — Scheduled Regression Test Cadence

**Requirement**: All production applications MUST have scheduled (automated, time-triggered) regression tests running against the production environment at the following minimum cadence:

| Activation State | Minimum Cadence | Test Scope |
|-----------------|----------------|------------|
| SHADOW | Daily | Full automated test suite |
| LIMITED | Daily | Full automated test suite + contract tests |
| GENERAL | Weekly (minimum) | Full automated test suite + contract tests + performance benchmarks |
| FULL | Weekly (minimum) | Full automated test suite + contract tests + performance benchmarks + smoke E2E |

**Implementation**: Scheduled regression tests MUST be triggered by a time-based CI/CD pipeline trigger (cron job, scheduled workflow), not manually.

**Gate**: Missed scheduled regression tests are flagged as a governance gap within 48 hours. After 2 consecutive missed runs, a CS2 escalation is required.

---

### REQ-PPT-010 — Regression Test Result Recording

**Requirement**: Every scheduled regression test run MUST produce a recorded result including:

1. Timestamp and duration
2. Pass/Fail status per test case
3. Any newly failing tests (regressions) identified
4. Performance metric comparison vs. baseline
5. Link to test run artifact in CI

**Storage**: Results MUST be stored in the application repository's `monitoring/regression-history/` directory (or equivalent). At minimum the last 30 run results must be retained.

**Evidence Required**: Regression history directory with ≥ 1 passing run per required cadence window.

---

### REQ-PPT-011 — Regression on New Critical Path Detection

**Requirement**: If production telemetry detects an anomaly in a previously passing critical path (error rate spike > 5x baseline, P95 response time increase > 50%), an **immediate unscheduled regression run** MUST be triggered:

1. Automatically via alerting rule (preferred)
2. Manually triggered by FM within 30 minutes of alert

The unscheduled regression run result MUST be:
- Completed within 2 hours of trigger
- Reviewed by FM
- Used to determine whether an incident should be declared

---

## 8. Health Snapshot Requirements

### REQ-PPT-012 — Health Snapshot Format

**Requirement**: All formal Health Snapshots (REQ-PPT-004 to REQ-PPT-006, REQ-PPT-008) MUST follow this structure:

```markdown
# Health Snapshot — [Application Name] — [Date]

## Snapshot Context
- Activation State: [SHADOW|LIMITED|GENERAL|FULL]
- Snapshot Purpose: [Activation Gate|IFVP|Commissioning|Scheduled]
- Observation Window: [Start Datetime] to [End Datetime]
- Produced By: [Role + Agent/Person]
- Approved By: [FM/CS2 as applicable]

## Health Metrics
| Metric | Threshold | Actual | Status |
|--------|-----------|--------|--------|
| Availability | ≥ 99.X% | XX.X% | ✅ / ❌ |
| P95 Response Time | ≤ Xms | Xms | ✅ / ❌ |
| P99 Response Time | ≤ Xms | Xms | ✅ / ❌ |
| Error Rate | ≤ X/1000 | X/1000 | ✅ / ❌ |
| Critical Incidents | 0 | N | ✅ / ❌ |
| Scheduled Regression | Passed | Pass/Fail | ✅ / ❌ |

## Incidents During Window
[None | List of incident titles, severity, resolution status]

## Regression Test Results
[Link to most recent scheduled regression run result]

## Business Metrics
[Key metric name]: [Baseline] vs [Actual] — [✅ Within range | ⚠️ Deviation noted]

## Approval
- FM Approval: [Name, Date, Signature/Attestation]
- CS2 Approval: [Required for GENERAL→FULL only]

## Snapshot Status
[PASSED | FAILED — with reason]
```

**Evidence Required**: Health Snapshot file in `monitoring/health-snapshots/` directory.

---

### REQ-PPT-013 — Commissioning Health Snapshot

**Requirement**: At the **commissioning milestone** (application sign-off, production go-live), a comprehensive commissioning Health Snapshot MUST be produced covering:

1. All telemetry metrics from the IFVP window (72 hours minimum)
2. FCWT evidence summary (linking to FCWT artifacts)
3. Security scan evidence (SAST, DAST, penetration test — per AUTOMATED_QUALITY_TOOLING_CANON.md)
4. Contract test verification (per CONTRACT_TESTING_CANON.md)
5. Code coverage confirmation (per CODE_COVERAGE_THRESHOLD_CANON.md)
6. Any open exceptions and their disposition
7. FM and CS2 sign-off

**This snapshot serves as the formal commissioning evidence artifact.**

**Gate**: BLOCKING — commissioning milestone cannot close without an approved Commissioning Health Snapshot.

---

### REQ-PPT-014 — Progressive Activation Health Snapshots

**Requirement**: At each activation state transition (SHADOW→LIMITED, LIMITED→GENERAL, GENERAL→FULL), a Health Snapshot as defined in REQ-PPT-012 MUST be produced and archived in:

- `monitoring/health-snapshots/activation-shadow-to-limited-YYYYMMDD.md`
- `monitoring/health-snapshots/activation-limited-to-general-YYYYMMDD.md`
- `monitoring/health-snapshots/activation-general-to-full-YYYYMMDD.md`

These snapshots are **permanent governance artifacts** and MUST NOT be deleted or modified after approval.

---

## 9. Alert and Escalation Requirements

### REQ-PPT-015 — Mandatory Alert Configuration

**Requirement**: All production applications MUST have the following alerts configured and active before production deployment:

| Alert | Threshold | Notification Target | Response Time |
|-------|-----------|--------------------|----|
| Error rate spike | > 5x baseline for > 5 min | Builder + FM | 15 minutes |
| Availability degraded | < 99% for > 5 min | Builder + FM | 15 minutes |
| P95 response time spike | > 2x baseline for > 10 min | Builder | 30 minutes |
| Health check failure | Any failure lasting > 2 min | Builder + FM | 10 minutes |
| Critical error count | > 0 Critical errors | Builder + FM + CS2 | 5 minutes |
| Scheduled regression failure | Any test failure | Builder + FM | 1 hour |

**Evidence Required**: Alert configuration file (or dashboard screenshot) showing all 6 alert types configured.

---

### REQ-PPT-016 — Incident Escalation Path

**Requirement**: A documented incident escalation path MUST exist for all production applications, defining:

1. P1 (Critical) — response within 15 minutes, CS2 notified within 30 minutes
2. P2 (High) — response within 1 hour, FM notified within 2 hours
3. P3 (Medium) — response within 4 hours, next business day acceptable
4. P4 (Low) — logged for next maintenance cycle

**File**: `monitoring/incident-escalation.md` or equivalent.

---

## 10. Long-Term Governance

### REQ-PPT-017 — Quarterly Health Review

**Requirement**: Applications in FULL activation MUST undergo a **Quarterly Health Review** including:

1. Review of all telemetry trends over the quarter (P50/P95/P99 drift, error rate trends)
2. Review of all incidents and their root causes
3. Review of scheduled regression test pass rates
4. Coverage drift analysis (ensure test coverage has not regressed)
5. Security scan review (ensure no unaddressed Medium+ findings accumulated)
6. Dependency vulnerability review
7. Recommendations for the next quarter

**Evidence Required**: Quarterly Health Review document in `monitoring/quarterly-reviews/` directory.

**Approval**: FM review required; CS2 notified of any systemic concerns identified.

---

### REQ-PPT-018 — Telemetry Data Retention

**Requirement**: The following telemetry data retention periods are mandatory:

| Data Type | Minimum Retention |
|-----------|------------------|
| Application logs (production) | 90 days |
| Error tracking events | 12 months |
| Health Snapshot documents | Permanent (never delete) |
| Regression test results | 12 months |
| Incident records | 36 months |
| Quarterly Health Reviews | Permanent |

---

## 11. Responsibility Matrix

| Role | Responsibility |
|------|---------------|
| Builder | Instrument telemetry; configure alerts; run scheduled regressions; produce Health Snapshots |
| Foreman (FM) | Approve Health Snapshots and observation window completions; escalate anomalies |
| QA Agent | Validate telemetry instrumentation during QA; review regression test configurations |
| governance-repo-administrator | Maintain this canon; track compliance across repos; execute ripple on updates |
| CS2 | Approve activation transitions (GENERAL→FULL); sign off Commissioning Health Snapshot; review Quarterly Health Reviews |

---

## 12. Exception Process

If a project cannot meet a specific post-production telemetry requirement, the following process applies:

1. Document the specific requirement (REQ-PPT-NNN) that cannot be met
2. Provide technical justification and timeline for compliance
3. FM approval for exceptions up to 4 weeks
4. CS2 approval for extensions beyond 4 weeks
5. No exceptions for REQ-PPT-001 (telemetry instrumentation) — this is an absolute prerequisite for production deployment

---

## 13. Authority Reference

This document is part of the **Maturion Canonical Governance System**.

**Version**: 1.0.0
**Effective Date**: 2026-02-26
**Supreme Authority**: `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
**Approved By**: CS2 (Johan Ras)
**Maintained By**: governance-repo-administrator

All requirements in this document are **mandatory** unless explicitly noted as advisory. Violations of BLOCKING requirements prevent activation transitions and production deployments.

---

*Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | POST_PRODUCTION_TELEMETRY_CANON.md v1.0.0*
