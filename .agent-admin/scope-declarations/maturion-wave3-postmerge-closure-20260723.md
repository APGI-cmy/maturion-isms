# Scope Declaration — Maturion Wave 3 Post-Merge Closure

**Scope ID:** MATURION-W3-POSTMERGE-CLOSURE-20260723  
**Issue:** #1953  
**PR:** PENDING  
**Branch:** `foreman/maturion-wave3-postmerge-closure`  
**Owner:** foreman-v2-agent  
**Builder:** bounded documentation/evidence builder  
**Date:** 2026-07-23  
**State:** PREBUILD_ACTIVE

---

## Responsibility domain

Close the Maturion Wave 3 programme record after merge of PR #1933 by aligning documentation, establishing an authoritative tracker, preserving historical evidence, and obtaining independent post-merge assurance.

## Exact baseline

- Merge commit under assurance: `fc3556f391a1a3a854d16008e17099026c5d5992`
- Merged PR head: `fe97ee74c272fb496b19371a585762930dd6822a`
- Maturion contract blob: `4c060b890074b79fa293dcd66c9b3f9987200e47`
- Wake-up protocol blob: `b9bc497aba37e31214e99887f40cf617c8af7799`
- Session-closure protocol blob: `6718b21b7547aae4bd0bb112e91a8f1ac12aead1`

## In scope

- `Maturion/BUILD_PROGRESS_TRACKER.md`
- `Maturion/strategy/Maturion_ecosystem_orchestrator_and_agent_file_system_strategy.md`
- `Maturion/strategy/Wave3_Maturion_thin_core_contract_correction_proposal_20260710.md`
- `Maturion/prebuild/wave3-postmerge-closure/MW3-PMC-prebuild-and-QA-to-Red-v0.1.md`
- this scope declaration
- current-wave builder appointment
- current-wave IAA wave record
- current-wave QP record
- current-wave ECAP record
- one current-wave prehandover proof and Foreman session/PREHANDOVER record if required by active gates
- one final CS2/proxy signoff after IAA PASS
- one exact independent-IAA session-memory artifact
- minimal PR manifest and wave-current-task records if required by active gates after PR creation

## Out of scope

- any `.github/agents/*` file;
- any `.agent-workspace/<agent>/knowledge/*` file;
- governance canon;
- `governance/CANON_INVENTORY.json`;
- any PR #1933 artifact;
- runtime/application code;
- tests or test configuration;
- schema, migration, RLS or database change;
- CI/workflow or gate-logic change;
- Supabase, Vercel, deployment or production state;
- registry, routing or specialist activation;
- Wave 4 implementation;
- correction of the runtime six-domain defect.

## QA-to-RED binding

The builder must make the current-wave documentation conditions `MW3-PMC-RED-001` through `MW3-PMC-RED-004`, `MW3-PMC-RED-007`, `MW3-PMC-RED-008` and `MW3-PMC-RED-009` green.

`MW3-PMC-RED-005` becomes green only through independent IAA.

Runtime QA obligations and canon provenance remain explicitly RED/BLOCKED because their implementation is outside this issue.

## Historical evidence rule

All evidence created for PR #1933 is immutable history for this wave. It must be cited, not edited.

## Final path parity

The exact final path inventory will be frozen after the PR number and independent IAA session path are known. It must include only the path classes authorised by Issue #1953 and its CS2 clarification.

## Handover rule

Handover is prohibited until:

- builder evidence is complete;
- Foreman QP is PASS;
- ECAP admin validation is PASS;
- hosted checks are terminal green;
- unresolved review conversations are zero;
- independent IAA issues an `ASSURANCE-TOKEN`;
- post-token drift is administrative/assurance-only;
- CS2 disposition is recorded.
