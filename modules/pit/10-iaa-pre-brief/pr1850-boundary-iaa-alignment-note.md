# PIT Stage 10 Addendum — PR #1850 Boundary IAA Alignment Note

| Field | Value |
|---|---|
| Module | PIT - Project Implementation Tracker |
| Stage | Stage 10 - IAA Pre-Brief alignment note |
| Status | ACTIVE IAA ALIGNMENT NOTE |
| Date | 2026-06-24 |
| Trigger | PR #1850 merged; W8.2 correction requires independent assurance focus on ISMS/PIT boundary |
| Applies to | PIT IAA pre-brief / next applicable IAA wave record |
| Authority consumed | PR #1850 boundary artifacts; PIT boundary RED tests and correction plan |

---

## 1. Purpose

This note records the IAA focus areas for the PIT PR #1850 alignment and future W8.2 correction wave.

It does not perform IAA final assurance and does not self-certify readiness.

---

## 2. IAA challenge questions for future correction

IAA should challenge the correction package on these points:

1. Does the evidence prove the canonical ISMS host journey, not only isolated PIT host behavior?
2. Is the PIT host policy explicit and implemented as governed?
3. Does checkout/auth/onboarding establish visible `project-implementation` entitlement before `/pit/tracker` opens?
4. Does the dashboard card open `/pit/tracker` for entitled users without returning to subscription?
5. Are non-entitled users still routed predictably to ISMS-owned marketing/subscription paths?
6. Are PIT and ISMS agent scopes separated unless a cross-module appointment exists?
7. Are cross-origin local-storage assumptions excluded from evidence conclusions?
8. Do role-aware admin/QA route checks still pass after the entitlement correction?
9. Does the evidence avoid W8.2 completion, functional pass, RLS final pass, production readiness, and Stage 12 completion overclaims?

---

## 3. IAA evidence expectation

The future IAA review should require a browser evidence pack that includes:

- canonical host URL trace;
- screenshots for each journey step;
- entitlement-visible dashboard state;
- direct-route denied and allowed cases;
- role matrix results;
- PIT host behavior evidence;
- clear defect disposition.

---

## 4. Non-completion notice

This note is not IAA final assurance. It is an alignment note for the future assurance package.
