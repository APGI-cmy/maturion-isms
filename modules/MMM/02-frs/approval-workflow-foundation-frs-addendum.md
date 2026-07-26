# MMM Approval Workflow Foundation — FRS Addendum

**Issue:** #1961  
**Status:** Approved QA-to-RED authority  
**Date:** 2026-07-23

## 1. Purpose

Define the authoritative functional contract for a governed three-level MMM approval runtime after closure of the descriptor-generation lane.

This addendum authorises executable QA-to-RED only. It does not authorise production implementation before the red contract is reviewed and merged.

## 2. Governing principles

1. Approval is a server-enforced state machine, not a collection of visible buttons.
2. Every transition is tenant-scoped, role-scoped, assignment-scoped, idempotent and auditable.
3. A submitter may not approve the same package at a higher level.
4. Submitted and approved content is locked consistently in UI and all write paths.
5. Return and resubmission preserve prior history.
6. Level 3 may begin only when every required domain has valid Level 2 approval.
7. Signed framework content cannot be mutated silently; subsequent changes require revision and reapproval.
8. Stale clients must provide expected state/version and receive a conflict response when server truth has moved.
9. Reviewer reassignment is an explicit authorised transition with immutable evidence.
10. Existing descriptor persistence, learning and live-regression behavior must remain unchanged.

## 3. Canonical levels

### Level 1 — owner submission

Draft or Returned content may be edited by an accountable owner. Submission requires package completeness and a submission comment. Successful submission records actor, role, timestamp, previous state, next state and package version, then locks normal editing.

### Level 2 — domain review

Only the assigned Level 2 reviewer may return or approve. Return requires a reason and creates a controlled remediation state. Resubmission creates a new transition while preserving all prior transitions and comments. Approval locks the approved domain version.

### Level 3 — framework signoff

Only an assigned or explicitly authorised executive approver may act. Level 3 submission is blocked until every required domain has current Level 2 approval. Approval creates the signed framework version. Later content change invalidates current signoff through an explicit revision/reapproval mechanism.

## 4. Required transition model

Minimum domain states:

- `draft`
- `submitted_l1`
- `returned_l2`
- `resubmitted_l1`
- `approved_l2`
- `revision_required`

Minimum framework states:

- `draft`
- `ready_for_l3`
- `submitted_l3`
- `returned_l3`
- `approved_l3`
- `revision_required`

Allowed transitions must be declared centrally and rejected server-side when invalid.

## 5. Completion gates

A domain package is complete only when required MPS rows, intent statements, criteria and five maturity descriptors per criterion meet the active framework rules. Completeness must be calculated from persisted server truth.

A framework is ready for Level 3 only when all required domains are complete and hold current Level 2 approvals for the same framework revision.

## 6. Authorisation and segregation

- Actor organisation must match the package organisation.
- Actor must hold the required role and current assignment.
- The Level 1 submitter cannot be the Level 2 or Level 3 approver for the same revision.
- Level 2 and Level 3 approvers must be distinct unless a future explicit governance rule authorises an exception.
- UI visibility does not replace Edge Function and RLS enforcement.

## 7. Persistence and evidence

The runtime must preserve:

- approval request identity;
- package type and package ID;
- organisation and framework scope;
- current state and version;
- assigned reviewer/approver;
- submitter and approver identities;
- expected-state/version tokens;
- immutable transitions;
- immutable comments/return reasons;
- audit log entries;
- timestamps and correlation/idempotency keys.

## 8. Error behavior

- `400` malformed or incomplete request;
- `401` unauthenticated;
- `403` wrong tenant, role, assignment or self-approval;
- `404` scoped package not found;
- `409` stale expected state/version, duplicate conflicting transition or invalid state transition;
- `422` package incomplete or Level 3 prerequisites unmet.

Responses must be honest and must not report approval when persistence or audit recording failed.

## 9. Dependency

Issue #1959 must be resolved or explicitly dispositioned before production paths rely on direct authenticated RLS evaluation through `mmm_current_user_org_id()` or related identity helpers.

## 10. QA authority

The QA-to-RED wave must implement T-MMM-AWF-001 through T-MMM-AWF-018 from issue #1961 and prove the current runtime is incomplete before build-to-green begins.
