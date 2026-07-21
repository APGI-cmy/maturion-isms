# Protected Agent Contract Diff Record

## Authority

- Issue: #1932
- Implementer role: CodexAdvisor
- Protected target: `.github/agents/maturion-agent.md`
- STOP_AND_FIX authority: CS2 direction following IAA session 1283 and Codex review on 2026-07-20

## Current protected implementation

- Base branch: `main`
- Current substantive protected-file commit: `6ad1a892dbb47f758e036c99cc29a0e8df402e40`
- Current protected contract blob: `4c060b890074b79fa293dcd66c9b3f9987200e47`
- Contract version: `2.1.0`
- Current immutable PREHANDOVER: `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-068-20260721.md`

## Substantive corrections present

1. Bounded approved-and-registered specialist invocation.
2. Mandatory bounded delegation context and Maturion response review.
3. Runtime Maturion versus Maturion-as-CS2 authority separation.
4. Truthful handling of planned, incomplete, unavailable and degraded capabilities.
5. Required identity/governance fields and structured constitutional self-modification prohibition.
6. Mandatory Phase 2 executable induction through `.github/scripts/wake-up-protocol.sh maturion-agent`.
7. Phase 2 loading of the last five sessions, canonical integrity, environment health, merge-gate readiness and working-contract output.
8. Mandatory Phase 4 executable closure through `.github/scripts/session-closure.sh maturion-agent`.
9. Phase 4 evidence generation, memory capture/rotation, environment-health verification and learning capture.
10. Restored mandatory `execution_identity` block with bot identity and explicit `never_push_main` / `write_via_pr_by_default` controls.
11. Phase 2 executable wake-up now fails nonzero when `governance/CANON_INVENTORY.json` is missing, invalid, or degraded under placeholder-hash enforcement.
12. Phase 4 executable closure now validates every `merge_gate_interface.required_checks` entry from runtime check evidence and fails nonzero on missing, failed, pending, or unverifiable checks.
13. Orchestrator class, thin-core pattern, four phases, RAEC, scope boundaries and independent IAA retained.
14. Phase 3 wake-up now degrades and blocks when canonical commit SHA provenance is absent in `governance/CANON_INVENTORY.json` under placeholder-hash enforcement.
15. Phase 4 closure now binds supplied check evidence (`head_sha` / `sha`) to current HEAD and rejects stale or unverifiable evidence.

## Current PR scope

The PR inventory contains 16 authorised paths: prior reconciled governance evidence paths plus `.github/scripts/wake-up-protocol.sh`, `.github/scripts/session-closure.sh`, and `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-068-20260721.md`.

No product code, runtime adapter, schema, migration, test, CI workflow, Tier 2 expansion, AIMC implementation, Supabase, Vercel, deployment, registry, routing or specialist activation change is included.

## Validation disposition

- Authority match: PASS
- Protected owner route: PASS
- Contract format: PASS
- Executable induction binding: PASS
- Executable closure binding: PASS
- Current protected commit/blob recorded: PASS
- Current immutable PREHANDOVER: PASS
- Scope comparison: 16 paths declared
- Fresh independent IAA (session 1284): REJECTION-PACKAGE on frozen head `09bde7c60f3897479de2a805d302aaffcec097d1`
- Renewed independent IAA: REQUIRED after hosted checks on latest STOP_AND_FIX head

## Merge boundary

This is implementation evidence, not an assurance token. Merge remains prohibited until a genuinely independent IAA issues a final `ASSURANCE-TOKEN` against the frozen current state, all hosted checks pass, review threads are resolved, and CS2 exercises merge authority.