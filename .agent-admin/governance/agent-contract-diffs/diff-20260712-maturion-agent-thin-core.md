# Protected Agent Contract Diff Record

## Authority

- Issue: #1932
- CS2 decision: CodexAdvisor contract v4.3.0 declared FIT for this separately authorised correction
- Proposal lineage: PR #1920
- Fitness lineage: Issue #1922 and merged PR #1927
- Implementer role: CodexAdvisor
- Protected target: `.github/agents/maturion-agent.md`
- STOP_AND_FIX authority: CS2 direction following IAA session 1283

## Current protected implementation

- Base branch: `main`
- Original implementation base SHA: `c3b16d812bc0aa3d8826a33e4f0c6fb889e77670`
- Original protected-file implementation commit: `dbdf1d41b759fb2333903d3f13c371d96c525959`
- Original contract blob: `cace19f9c9fd28ada324e39258a3d03fd0cfbca1`
- Current substantive protected-file commit: `213f5cb5b94461b19cbd860a706a99e5bdb45042`
- Current protected contract blob: `c6a6a086d192eee2e0c872ec268eee767a407637`
- Contract version: `2.1.0`

The protected contract was subsequently remediated to satisfy the active Agent Contract Format Gate. Those changes were substantive contract changes and are included in the current protected implementation identity above. The later merge from `main` did not change the protected contract blob.

## Exact substantive corrections now present

1. Replaced the stale ecosystem list with approved APGI ecosystem contexts.
2. Replaced contradictory `can_invoke: none` with bounded approved-and-registered specialist/capability invocation.
3. Added explicit no-invention, no-self-registration, no-activation, and no-specialist-modification controls.
4. Added the mandatory bounded delegation context package.
5. Added mandatory Maturion review before final user response.
6. Added truthful planned, incomplete, unavailable, and degraded capability handling without forbidden placeholder terminology.
7. Added the runtime-Maturion versus Maturion-as-CS2 authority boundary.
8. Added AIMC control-plane and future Wave 4 dependency pointers without claiming runtime readiness.
9. Added thin-core intent categories while retaining detailed classification in future Tier 2.
10. Added required `identity.role`, `identity.mission`, `identity.class_boundary`, and `governance.version` fields.
11. Converted prohibitions to structured entries and preserved `SELF-MOD-MATURION-001` with `CONSTITUTIONAL` enforcement.
12. Preserved the orchestrator class, `thin_core_living` pattern, all four phases, RAEC, protected-file controls, evidence, memory, merge-gate parity, and independent IAA.

## Current PR scope verification

The PR-scoped inventory contains 11 paths:

1. `.github/agents/maturion-agent.md`
2. `.agent-admin/governance/agent-contract-diffs/diff-20260712-maturion-agent-thin-core.md`
3. `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-064-20260712.md`
4. `.agent-workspace/CodexAdvisor-agent/memory/session-064-20260712.md`
5. `.agent-admin/assurance/iaa-wave-record-maturion-thin-core-20260712.md`
6. `.admin/prs/pr-1933.json`
7. `.agent-admin/scope-declarations/pr-1933.md`
8. `.agent-admin/prs/pr-1933/wave-current-tasks.md`
9. `.agent-admin/prehandover/proof-pr-1933-maturion-thin-core-20260713.md`
10. `.agent-workspace/independent-assurance-agent/memory/session-1283-20260720.md`
11. `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-065-20260720.md`

No product code, runtime adapter, schema, migration, test, workflow, Tier 2 expansion, AIMC implementation, Supabase change, Vercel change, deployment change, registry activation, routing activation, or specialist activation is part of PR #1933.

## Validation disposition

- Authority match: PASS
- Protected owner route: PASS
- Four phases present: PASS
- Bounded invocation controls present: PASS
- Runtime/CS2 boundary present: PASS
- Future dependencies marked unavailable: PASS
- Required contract-format fields present: PASS
- Structured constitutional self-modification lock present: PASS
- Current protected commit/blob recorded: PASS
- New immutable PREHANDOVER for current substantive state: PASS
- Scope comparison: 11 paths declared
- Independent IAA session 1283: REJECTION-PACKAGE retained as history
- Fresh independent IAA: REQUIRED after frozen-head hosted checks

## Merge boundary

This record is implementation evidence, not an assurance token. Merge remains prohibited until a genuinely independent IAA identity issues a final `ASSURANCE-TOKEN` against the frozen current substantive state, all required hosted checks pass, no review threads remain unresolved, and CS2 exercises merge authority.