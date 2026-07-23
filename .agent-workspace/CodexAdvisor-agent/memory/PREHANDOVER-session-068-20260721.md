# PREHANDOVER — CodexAdvisor Session 068

## Job

- PR: #1933
- Issue: #1932
- Target: consolidated STOP_AND_FIX pass for current P1 findings
- Implementer role: CodexAdvisor under CS2 STOP_AND_FIX authority
- Protected-file commit: `6ad1a892dbb47f758e036c99cc29a0e8df402e40`
- Protected-file blob: `4c060b890074b79fa293dcd66c9b3f9987200e47`

## Substantive correction

- Restored mandatory YAML `execution_identity` block in `.github/agents/maturion-agent.md` with bot identity reference and explicit `never_push_main: true` / `write_via_pr_by_default: true` controls while preserving the descriptive `identity` block.
- Hardened `.github/scripts/wake-up-protocol.sh` so Phase 2 induction fails nonzero when `governance/CANON_INVENTORY.json` is missing, invalid JSON, or degraded under configured placeholder-hash enforcement.
- Hardened `.github/scripts/session-closure.sh` so Phase 4 closure validates every `merge_gate_interface.required_checks` entry from supplied check evidence and fails nonzero when a required check is failed, pending, missing, or cannot be verified.

## Scope

Authoritative scope is reconciled to 16 paths in `.admin/prs/pr-1933.json` and `.agent-admin/scope-declarations/pr-1933.md`.

No product code, runtime adapter, schema, migration, test, provider, Supabase, Vercel, deployment, Tier 2, specialist activation or CI workflow change is included.

## Validation

- Wake-up protocol happy path: PASS on repository head.
- Wake-up protocol failure fixtures: PASS (missing inventory, invalid inventory, placeholder-hash degraded inventory each fail nonzero).
- Session-closure required-check fixtures: PASS (no evidence fails nonzero, pending required check fails nonzero, all-success evidence passes).
- Secret scan on changed implementation files: PASS.
- Independent IAA required: PENDING.
- Hosted checks on frozen post-fix head: IN_PROGRESS.

This PREHANDOVER is immutable after commit. Any later substantive implementation change requires a new PREHANDOVER and renewed independent assurance.
