# IAA Pre-Brief — Issue #1990 Migration-Baseline Reconciliation

**Action:** PRE-BRIEF  
**Issue:** #1990  
**Branch:** `fix/issue-1990-migration-baseline-reconciliation`  
**IAA role:** independent-assurance-agent  
**Status:** PREFLIGHT_BRIEF_COMPLETE — foundational bootstrap correction active (draft-only)

## Assurance question

Does the change restore a replayable source baseline by reconciling migration *identities only*, without replaying or changing production schema semantics?

## Required QA

- prove the four exact production versions exist once in the source migration set;
- prove each approved SQL body is byte-identical before and after its filename change;
- prove no superseded timestamp remains;
- prove no additional migration file or DDL change is introduced;
- prove a disposable GitHub-backed preview completes source migration setup and exposes expected PIT and MMM schema;
- prove production remains read-only throughout this lane.

## Failure modes

- duplicating migrations rather than reconciling their identity;
- changing SQL body, policy predicates, grants, functions or application files;
- accepting source-only evidence without an isolated preview replay;
- allowing the preview to be merged to production;
- treating this as authority to advance #1959 or #1961.

## Final IAA gates

Frozen-head QP, ECAP, hosted checks, preview evidence and an independently reviewed final head must all pass before CS2 merge consideration.

## Active foundational-bootstrap correction binding

- refreshed canonical IAA pre-brief: `6432bc1e7ec2dfd8adaa823f4c7474efa9e23209`
- schema-builder appointment: `4af5e076bf14e3aabdc9ec5dc1da4acfee6cf52b`
- first bounded bootstrap implementation: `70774b337fcefb05d6d0fe81779d0ce7f8d90739`
- PR-scoped delegation evidence source: `.agent-admin/control/delegation-orders/pr-1992.json`

No ASSURANCE-TOKEN is issued in this wave record refresh. Final-assurance artefacts remain out of scope until fresh preview replay and exact-head independent verification complete.