# CASCADING FAILURE CIRCUIT BREAKER

## Status
Canonical Governance Rule  
Version: v1  
Authority: Governance  
Applies To: All PRs

---

## 1. Purpose

This rule prevents PRs from accumulating non-local failures
that destroy diagnostic clarity.

Repeated failures with different root causes indicate scope explosion
or architectural uncertainty.

---

## 2. Core Rule

If a PR experiences:

- More than 3 CI failures
- With different failure signatures

The PR MUST be closed and restarted.

Not fixed.
Not patched.
Closed.

---

## 3. Failure Signature

A failure signature is defined as:
- The primary failing CI job name
- Or the first failing QA gate
- Or a declared FAILURE_SIGNATURE in governance artifacts

Distinct signatures count independently.

---

## 4. Enforcement

CI MUST block:
- Further merges
- Further retries

Once the threshold is exceeded.

---

## 5. Rationale

Big changes destroy causality.
Small changes preserve it.

Governance exists to preserve causality.

---

End of CASCADING FAILURE CIRCUIT BREAKER
