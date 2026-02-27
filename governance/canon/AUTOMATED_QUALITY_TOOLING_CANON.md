# AUTOMATED QUALITY TOOLING CANON

## Status
**Type**: Tier-1 Canonical Governance Standard
**Authority**: CS2 (Johan Ras)
**Version**: 1.0.0
**Effective Date**: 2026-02-26
**Owner**: Maturion Engineering Leadership (Johan Ras)
**Layer-Down Status**: PUBLIC_API
**Applies To**: All Foreman Instances, All Application Repositories, All Wave Executions, All Builders, All QA/Audit Processes

---

## 1. Purpose

This document establishes **mandatory automated quality tooling requirements** for security, accessibility, and performance across the Maturion platform. Previously, SAST/DAST scanning, Lighthouse/axe scoring, and automated penetration testing evidence were advisory or manually triggered. This canon elevates all three categories to **mandatory, gate-enforced, pre-merge requirements**.

**Canonical Gap Addressed**: FINAL_COMPLETE_WAVE_TEST_PROTOCOL.md (FCWT) references UX validation including accessibility, performance, and cross-device testing — but without mandating minimum scores or gate enforcement. This canon establishes the binding thresholds and automated enforcement mechanisms that FCWT requires but does not itself define.

---

## 2. Constitutional Authority

This canon derives authority from and integrates with:

- **LIVING_AGENT_SYSTEM.md v6.2.0** — Supreme governance authority
- **BUILD_PHILOSOPHY.md** — One-Time Build Law: delivered means working 100%
- **FINAL_COMPLETE_WAVE_TEST_PROTOCOL.md** — FCWT UX and security validation requirements
- **FULLY_FUNCTIONAL_DELIVERY_STANDARD.md** — Three definitions of "fully functional"
- **WE_ONLY_FAIL_ONCE_DOCTRINE.md** — Structural prevention of repeat failures

---

## 3. Scope

### 3.1 Applicability

This canon applies to all Maturion application repositories that produce:

| Application Type | SAST | DAST | Lighthouse | axe | PenTest Evidence |
|-----------------|------|------|------------|-----|-----------------|
| Web application (user-facing UI) | MANDATORY | MANDATORY | MANDATORY | MANDATORY | MANDATORY |
| API service / backend | MANDATORY | MANDATORY | N/A | N/A | MANDATORY |
| Mobile application | MANDATORY | MANDATORY | N/A | MANDATORY | MANDATORY |
| Static documentation site | MANDATORY | ADVISORY | MANDATORY | MANDATORY | N/A |
| Internal tooling (no external users) | MANDATORY | ADVISORY | ADVISORY | ADVISORY | ADVISORY |

### 3.2 Exclusions

- Unit test utility files with no deployable artifact
- Pure governance/documentation repositories with no application code

---

## 4. SAST Requirements (Static Application Security Testing)

### REQ-AQT-001 — Mandatory SAST Scanning

**Requirement**: Every application repository MUST have SAST scanning configured and running on every PR targeting the main branch.

**Minimum Tool**: GitHub Advanced Security (CodeQL) or equivalent tool providing:
- Code scanning alerts with severity classification
- SARIF output for CI integration
- Automatic blocking of Critical and High findings

**Gate**: Pre-merge. BLOCKING for Critical and High severity findings.

---

### REQ-AQT-002 — SAST Finding Disposition

**Requirement**: All SAST findings MUST be dispositioned before merge:

| Severity | Disposition Required | Gate |
|----------|---------------------|------|
| Critical | Fix required OR documented false-positive with CS2 approval | BLOCKING |
| High | Fix required OR documented false-positive with FM approval | BLOCKING |
| Medium | Fix required OR documented exception with FM approval within 2 weeks | NON-BLOCKING (warning) |
| Low | Logged for backlog; no blocking | NON-BLOCKING |

**Evidence Required**: SAST report in CI artifacts; no unaddressed Critical/High findings.

---

### REQ-AQT-003 — SAST Coverage Minimum

**Requirement**: SAST coverage MUST include:

1. All application source code (not generated code from tooling)
2. All dependency vulnerability scanning (via Dependabot, npm audit, pip audit, or equivalent)
3. All secret detection (no credentials, tokens, or private keys in source)
4. Infrastructure-as-code scanning (Terraform, CloudFormation, Kubernetes manifests) where applicable

**Evidence Required**: SAST coverage report showing all four categories scanned.

---

### REQ-AQT-004 — Dependency Vulnerability Gate

**Requirement**: No PR may be merged if it introduces a dependency with a known Critical or High CVE. The CI pipeline MUST run dependency scanning and fail if:

1. A newly added dependency has a Critical or High CVE
2. An existing Critical or High CVE has an available patch and has been unpatched for > 14 days

**Exception**: If no patch is available, a documented exception with FM approval is required, with a 30-day re-evaluation reminder.

**Gate**: Pre-merge. BLOCKING for Critical/High unpatched CVEs.

---

## 5. DAST Requirements (Dynamic Application Security Testing)

### REQ-AQT-005 — Mandatory DAST Scanning

**Requirement**: Every web application and API service MUST undergo DAST scanning before production release.

**Minimum**: DAST scanning MUST be performed:
1. As part of the FCWT (Final Complete Wave Test) before audit sign-off
2. On every release candidate (RC) build
3. Against a fully deployed staging environment (not mocked)

**Approved Tooling**: OWASP ZAP, Burp Suite (automated scan), or equivalent tool that:
- Supports active scanning (not passive only)
- Produces machine-readable output (JSON/XML/HTML report)
- Classifies findings by severity

**Gate**: Pre-production release. BLOCKING for Critical and High findings.

---

### REQ-AQT-006 — DAST Minimum Test Coverage

**Requirement**: DAST scans MUST cover:

1. All authentication endpoints (login, logout, token refresh, password reset)
2. All data input endpoints (forms, API POST/PUT/PATCH endpoints)
3. All authorization boundaries (admin vs. user, tenant isolation)
4. OWASP Top 10 vulnerability classes

**Evidence Required**: DAST scan report in release evidence showing all above categories covered.

---

### REQ-AQT-007 — DAST Finding Disposition

**Requirement**: All DAST findings MUST be dispositioned before production deployment:

| Severity | Disposition Required |
|----------|---------------------|
| Critical | Fix required before any production deployment |
| High | Fix required before production deployment; FM approval for exception with remediation plan |
| Medium | Fix required or documented exception within 30 days |
| Low/Informational | Logged; addressed in next maintenance cycle |

**Evidence Required**: DAST findings disposition log in release evidence.

---

## 6. Lighthouse Score Requirements (Web Applications)

### REQ-AQT-008 — Mandatory Lighthouse Scoring

**Requirement**: All user-facing web applications MUST achieve the following minimum Lighthouse scores on every production release build:

| Category | Minimum Score | Threshold Type |
|----------|--------------|----------------|
| Performance | 80 | BLOCKING (below 80 blocks release) |
| Accessibility | 95 | BLOCKING (below 95 blocks release) |
| Best Practices | 90 | BLOCKING (below 90 blocks release) |
| SEO | 85 | BLOCKING (below 85 blocks release) |

**Measurement Conditions**:
- Scores measured on production build (not development build)
- Measured in a clean browser profile (no extensions)
- Measured on the three most critical user-facing pages (minimum)
- Measured under simulated mobile network conditions (Lighthouse default)

**Evidence Required**: Lighthouse report JSON/HTML artifacts for each measured page.

**Gate**: Pre-release (FCWT). BLOCKING.

---

### REQ-AQT-009 — Lighthouse Regression Prevention

**Requirement**: Lighthouse scores MUST NOT degrade by more than 5 points from the previous release on any category. If a regression of >5 points is detected:

1. The regression MUST be investigated and root-caused
2. FM approval is required to release with the regression
3. A remediation item MUST be logged for the next sprint

**Evidence Required**: Lighthouse score comparison vs. previous release in release evidence.

---

### REQ-AQT-010 — Lighthouse Measurement Scope

**Requirement**: Lighthouse MUST be run against the following page types:

| Page Type | Required |
|-----------|----------|
| Landing / Home page | MANDATORY |
| Primary user workflow (most-used feature entry point) | MANDATORY |
| Form-heavy page (highest data input density) | MANDATORY |
| Report / data-heavy page (if applicable) | MANDATORY |
| Mobile breakpoint view | MANDATORY |

**Evidence Required**: One Lighthouse report per required page type per release.

---

## 7. Axe Accessibility Requirements

### REQ-AQT-011 — Mandatory Axe Accessibility Scanning

**Requirement**: All user-facing web and mobile applications MUST run axe accessibility scans as part of the CI pipeline on every PR.

**Minimum Score / Threshold**:
- **Zero violations of Critical or Serious severity** — BLOCKING pre-merge gate
- **Moderate violations**: Maximum 0 unaddressed after FCWT (must be fixed or documented exceptions)
- **Minor violations**: Logged; addressed within next 2-week cycle

**Tooling**: axe-core, @axe-core/playwright, or axe-cli — tool must:
- Run against rendered DOM (not source HTML)
- Cover WCAG 2.1 AA compliance at minimum
- Produce JSON report for CI integration

**Gate**: Pre-merge (Critical/Serious). BLOCKING.

---

### REQ-AQT-012 — Axe Coverage Scope

**Requirement**: Axe scans MUST cover:

1. All interactive UI components (buttons, forms, modals, navigation)
2. All dynamic content (content loaded via JavaScript/AJAX)
3. All error states (form validation errors, system error messages)
4. All modal and dialog states
5. Keyboard-only navigation paths

**Evidence Required**: Axe scan report showing coverage of all five categories.

---

### REQ-AQT-013 — WCAG Compliance Level

**Requirement**: All user-facing applications MUST achieve **WCAG 2.1 Level AA** compliance before production release. WCAG 2.1 Level AA is the minimum; Level AAA is advisory.

**Specific Requirements**:
- Colour contrast ratio ≥ 4.5:1 for normal text
- Colour contrast ratio ≥ 3:1 for large text (18pt / 14pt bold)
- All interactive elements keyboard accessible
- Focus indicators visible
- ARIA labels on all icon-only controls
- Image alt text for all informational images

**Evidence Required**: WCAG audit report (automated + manual spot-check) in FCWT evidence.

---

## 8. Automated Penetration Testing Evidence

### REQ-AQT-014 — Penetration Testing Cadence

**Requirement**: All production applications MUST have automated penetration testing evidence before initial production deployment and at the following cadence:

| Application Maturity | Minimum Cadence |
|---------------------|----------------|
| Pre-production (first release) | Before every production deployment |
| Production (established) | Quarterly minimum; on every major feature release |
| Post-incident | After any security incident, before returning to full production |

---

### REQ-AQT-015 — Penetration Test Scope

**Requirement**: Automated penetration testing MUST cover the OWASP Top 10 at minimum:

1. Injection (SQL, NoSQL, command, LDAP)
2. Broken Authentication
3. Sensitive Data Exposure
4. XML External Entities (XXE)
5. Broken Access Control
6. Security Misconfiguration
7. Cross-Site Scripting (XSS)
8. Insecure Deserialization
9. Using Components with Known Vulnerabilities
10. Insufficient Logging and Monitoring

**Evidence Required**: Penetration test report in release evidence covering all 10 OWASP categories.

---

### REQ-AQT-016 — Penetration Test Finding Disposition

**Requirement**: Penetration test findings MUST be dispositioned before production deployment following the same severity-based table as REQ-AQT-007.

**Evidence Required**: Findings disposition log signed off by FM and CS2 (for Critical findings).

---

## 9. Security Scanning Gate Integration

### REQ-AQT-017 — CI/CD Gate Integration

**Requirement**: The following automated quality checks MUST be integrated into the CI/CD pipeline as defined gate steps:

| Check | Pipeline Stage | Failure Action |
|-------|---------------|----------------|
| SAST (CodeQL or equivalent) | PR pre-merge | BLOCK merge for Critical/High |
| Dependency vulnerability scan | PR pre-merge | BLOCK merge for Critical/High CVEs |
| Secret detection | PR pre-merge | BLOCK merge for any secret found |
| Axe accessibility scan | PR pre-merge | BLOCK merge for Critical/Serious violations |
| Lighthouse scores | Release build (FCWT) | BLOCK release for below-threshold scores |
| DAST scan | Release build (FCWT) | BLOCK release for Critical/High findings |

**Evidence Required**: CI/CD gate configuration file showing all checks present and configured.

---

### REQ-AQT-018 — Evidence Artifact Requirements

**Requirement**: Every release MUST include the following quality tooling evidence artifacts:

1. SAST scan report (most recent run)
2. Dependency scan report (most recent run)
3. DAST scan report (most recent run)
4. Lighthouse reports for all required pages
5. Axe scan report for all required UI components
6. Penetration test report (or link to most recent if within cadence window)
7. Findings disposition log for all Critical/High findings

**Evidence Required**: All 7 artifacts present in FCWT evidence package before audit sign-off.

---

## 10. Responsibility Matrix

| Role | Responsibility |
|------|---------------|
| Builder | Configure and maintain automated tooling; address Critical/High findings; include evidence in PRs |
| Foreman (FM) | Verify tooling is configured; approve exception requests; evidence review |
| QA Agent | Validate quality gate results during QA phases; report unapproved violations |
| governance-repo-administrator | Maintain this canon; track compliance across repos; execute ripple on updates |
| CS2 | Approve Critical-finding exceptions; approve changes to threshold standards |

---

## 11. Exception Process

If a team cannot meet a threshold requirement, they MUST:

1. Document the exception with specific requirement reference (REQ-AQT-NNN)
2. Provide justification (technical constraint, tooling gap, timeline)
3. Obtain FM approval for exceptions up to 4 weeks
4. Obtain CS2 approval for exceptions beyond 4 weeks or for Critical-severity findings
5. Record the exception in the PR description and release evidence
6. Close the exception by the agreed date

No permanent threshold exceptions are permitted without CS2 approval.

---

## 12. Authority Reference

This document is part of the **Maturion Canonical Governance System**.

**Version**: 1.0.0
**Effective Date**: 2026-02-26
**Supreme Authority**: `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
**Approved By**: CS2 (Johan Ras)
**Maintained By**: governance-repo-administrator

All requirements in this document are **mandatory** unless explicitly noted as advisory. Violations of BLOCKING requirements prevent merge to main or production release.

---

*Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | AUTOMATED_QUALITY_TOOLING_CANON.md v1.0.0*
