# PIT Stage 8 — Build Authorization Clearance Path (Positive Path, Not Cleared Yet)

Current state: **Build Authorization = NOT CLEARED**.

This file defines how Build Authorization may become cleared in a future authorized wave. It does not clear authorization now.

## Required positive path (all mandatory)

1. **Stage 9 gate-pass required**
   - Builder checklist must be completed and gate-passed with all mandatory acknowledgements.

2. **Stage 10 IAA Pre-Brief gate-pass required**
   - IAA pre-brief artifact must be present, complete, and accepted for the active wave.

3. **Stage 11 builder appointment required**
   - Formal appointment must be recorded in tracker with explicit scope and authority chain.

4. **CS2 explicit tracker clearance required**
   - CS2 (`@APGI-cmy`) must explicitly update `modules/pit/BUILD_PROGRESS_TRACKER.md` to clear Build Authorization.

5. **Builder acknowledgement package required**
   - Signed/acknowledged package confirming scope, guardrails, evidence, and no-overclaim constraints.

6. **No implied authorization from Stage 8/9/10 alone**
   - Stage 8 planning, Stage 9 checklist, or Stage 10 pre-brief do not independently grant build start authority.

7. **No build-surface changes before clearance**
   - No runtime/source code, DB migrations, deployment config, or active workflow installation before explicit clearance.

## Clearance evidence checklist

- [ ] Stage 9 gate-pass evidence linked
- [ ] Stage 10 pre-brief gate-pass evidence linked
- [ ] Stage 11 appointment record linked
- [ ] CS2 explicit clearance statement in tracker
- [ ] Builder acknowledgement package linked
- [ ] Scope declaration and admin parity updated for active PR

## Rejection conditions

If any required element above is missing or stale, Build Authorization remains **NOT CLEARED** and build execution is blocked.
