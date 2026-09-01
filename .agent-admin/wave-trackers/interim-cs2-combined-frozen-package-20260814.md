# Governed Wave Record — Interim CS2 Combined Frozen Package

**Wave status**: `FROZEN_PACKAGE_AWAITING_PR_AND_REASSURANCE`
**Frozen package SHA**: `35a888f478fa2c8cd6d83fd41255dd48271fa4a3`
**Base SHA**: `96f79ee524dc374a85e03b8fc748a92144b3f678`
**Declared delta**: 26 paths, as enumerated in `SUCCESSOR_EVIDENCE_interim-cs2-combined-package-35a888f4-20260814.md`

## Current Facts

| Field | Value |
|---|---|
| PR | Not created yet |
| Current package commit | Exists |
| Hosted workflow runs | Not available until a PR exists and workflows run on its current head |
| Renewed IAA invocation | Not invoked |
| IAA result/token | Not available; no result is inferred |

## Required Future Record Fields

After the PR is opened and changed workflows run, record only factual values:

| Field | Required value |
|---|---|
| PR number and URL | Actual created PR reference |
| PR-head SHA evaluated by hosted workflows | Exact SHA at each run |
| Hosted workflow name | Actual workflow name |
| Hosted run URL and ID | Actual provider evidence |
| Hosted conclusion | Actual result |
| Independent IAA invocation reference | Actual invocation evidence |
| IAA result/token | IAA-authored result only |

## Re-assurance Controls

- The hosted checks must validate the then-current PR head, not assume the frozen package SHA remains the head.
- Normal failure must route to Foreman; no autonomous remediation is authorized.
- Reruns and concurrent events must be deduplicated or safely handled.
- Artifact validation and wake-up behavior must fail closed.
- No cron or scheduled autonomous path is authorized.

## Next Action

Commit the successor evidence bundle, open the PR, run the changed workflows on the current PR head, then complete the fields above before independent IAA re-invocation.
