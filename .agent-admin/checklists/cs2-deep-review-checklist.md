# CS2 Deep Review Checklist

This checklist is required when CS2 reviews a Foreman handover or any implementation batch. It enforces human-grade review, not checkbox compliance alone.

## 1. Exact-head and evidence continuity
- [ ] The review targets the exact live head in the PR or issue.
- [ ] `current_head_sha` matches the live PR head and the evidence bundle for the same head.
- [ ] No stale or substituted head is accepted as equivalent.
- [ ] The audit record explicitly states whether the work is exact-head or degraded.

## 2. Intent-fit review
- [ ] We can explain the app goal in one sentence.
- [ ] The delivered work actually advances that goal.
- [ ] The code or implementation is not merely “green” but good enough for the intended user outcome.
- [ ] If not, the review must stop and escalate with a gap analysis.

## 3. QA-to-red / build-to-green traceability
- [ ] The prebuild evidence exists and is current.
- [ ] QA-to-red was completed before implementation or rework.
- [ ] Build-to-green results are traceable to that same evidence set.
- [ ] There is no evidence of test dodging, convenient red/green gaps, or mock-only substitution.

## 4. Test debt and hidden gaps
- [ ] CWT and the relevant compatibility/security/compliance checks were run.
- [ ] A filed CWT closure report exists and is referenced in the final CS2 closure packet.
- [ ] Cross-wave anti-regression validation evidence exists and is referenced in the final CS2 closure packet.
- [ ] The final CS2 closure packet names the compatibility/security/compliance evidence paths used for acceptance.
- [ ] Any skipped test or deferred check is explicitly justified and recorded.
- [ ] The review checked for stale evidence, stale mocks, and “green by omission.”
- [ ] The implementation is not relying on unverified assumptions.

## 5. Best practice and international compatibility
- [ ] We followed established best practice for the scope.
- [ ] The solution is compatible with the intended international / cross-environment operating context.
- [ ] We have considered what would break a real-world deployment.

## 6. Improvement triage
- [ ] Any notable improvement opportunity is classified as either:
  - blocking and must be fixed now, or
  - non-breaking and should be parked for future improvement.
- [ ] If a gap breaks the intended app behavior, the review stops and returns to Foreman with an explicit explanation.
- [ ] Every corrective action updates the progress tracker to avoid repetition.

## 7. Final gate outcome
- [ ] No unresolved blocker remains.
- [ ] IAA final verification is still valid on the exact head.
- [ ] The final recommendation is merge-ready, stop-and-fix, or escalate.

## Escalation language
When the build is not good enough, CS2 must state:

> “We said the app should do X, but this is not good enough because Y. If we truly want an internationally compatible app, we should take this direction or fix this. May I proceed and make the adjustments?”

If the answer is yes, the work is re-routed to Foreman for correction and re-review.
