# Protected Agent Contract Diff Record

## Authority

- Issue: #1932
- CS2 decision: CodexAdvisor contract v4.3.0 declared FIT for this separately authorised correction
- Proposal lineage: PR #1920
- Fitness lineage: Issue #1922 and merged PR #1927
- Implementer role: CodexAdvisor
- Protected target: `.github/agents/maturion-agent.md`

## Base and implementation

- Base branch: `main`
- Base SHA: `c3b16d812bc0aa3d8826a33e4f0c6fb889e77670`
- Protected-file implementation commit: `dbdf1d41b759fb2333903d3f13c371d96c525959`
- Resulting contract blob: `cace19f9c9fd28ada324e39258a3d03fd0cfbca1`
- Contract version: 2.1.0

## Exact substantive corrections

1. Replaced the stale ecosystem list with approved APGI ecosystem contexts.
2. Replaced contradictory `can_invoke: none` with bounded approved-and-registered specialist/capability invocation.
3. Added explicit no-invention, no-self-registration, no-activation, and no-specialist-modification controls.
4. Added the mandatory bounded delegation context package.
5. Added mandatory Maturion review before final user response.
6. Added truthful `PLANNED`, `STUB`, `UNAVAILABLE`, and `DEGRADED` handling.
7. Added the runtime-Maturion versus Maturion-as-CS2 authority boundary.
8. Added AIMC control-plane and future Wave 4 dependency pointers without claiming runtime readiness.
9. Added thin-core intent categories while retaining detailed classification in future Tier 2.
10. Preserved the orchestrator class, `thin_core_living` pattern, all four phases, SELF-MOD-MATURION-001, RAEC, protected-file controls, evidence, memory, merge-gate parity, and independent IAA.

## Scope verification

Current branch comparison after the protected write contained only:

- `.github/agents/maturion-agent.md`
- `.agent-admin/assurance/iaa-wave-record-maturion-thin-core-20260712.md`

This diff record and the required PREHANDOVER/session files are authorised evidence paths. No product code, runtime adapter, schema, migration, test, workflow, Tier 2 expansion, AIMC implementation, Supabase, Vercel, deployment, registry activation, routing activation, or specialist activation is included.

## Validation disposition

- Authority match: PASS
- Protected owner route: PASS
- Four phases present: PASS
- `can_invoke: none` removed: PASS
- Bounded invocation controls present: PASS
- Runtime/CS2 boundary present: PASS
- Future dependencies marked unavailable: PASS
- SELF-MOD-MATURION-001 preserved: PASS
- Scope comparison: PASS
- Independent IAA: PENDING
- Hosted checks: PENDING PR creation

## Merge boundary

This record is implementation evidence, not an assurance token. Merge remains prohibited until an independent IAA identity issues a final `ASSURANCE-TOKEN` against the unchanged implementation head and all required hosted checks pass.
