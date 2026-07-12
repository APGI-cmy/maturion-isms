# CodexAdvisor Contract Diff Record — Clean Rebuild

**Issue**: #1922  
**PR**: #1927  
**Date**: 2026-07-12  
**Base**: `main` at `6f43c99d3e3cf03df315d0e57bdd062290afcf50`

## Authorised Changes

1. `.github/agents/CodexAdvisor-agent.md`
   - Contract 4.1.0 to 4.3.0.
   - Adds only orchestrator and specialist to supported classes.
   - Makes SELF-MOD-001 absolute and removes issue-level own-contract write authority.
   - Adds bounded other-agent runtime-specialist bundle capability.
   - Reconciles thin-core subtype with mandatory four-phase execution.
   - Preserves consumer provenance, execution identity, evidence, memory, gate, and handover controls.
2. `.agent-workspace/CodexAdvisor-agent/knowledge/index.md`
   - Aligns contract and knowledge versions and inventories the new method.
3. `.agent-workspace/CodexAdvisor-agent/knowledge/checklist-registry.md`
   - Adds canonical Orchestrator and Specialist mappings and mandatory method loading.
4. `.agent-workspace/CodexAdvisor-agent/knowledge/agent-file-non-negotiables-checklist.md`
   - Adds bounded subtype and runtime-bundle controls without weakening assurance.
5. `.agent-workspace/CodexAdvisor-agent/knowledge/runtime-specialist-bundle-process.md`
   - Adds the concise executable method required by Issue #1922.
6. This diff record, immutable PREHANDOVER, session memory, and active IAA wave record provide authorised implementation and assurance evidence.

## Exclusions Confirmed

No Maturion contract, product code, schema, migration, test, CI workflow, provider integration, Supabase, Vercel, deployment, registry activation, routing activation, specialist activation, or governance canon is changed.

## Clean-History Correction

The replacement branch begins at current `main`. The protected contract is changed once in commit `c5234c98082f1688fb0782631318465ec1efc747`; the historical unrecognised protected-file commit from the original PR ancestry is not included.

## Validation

- YAML: PASS
- Frontmatter: 188 lines
- Contract characters: 16,628
- Four phases: PASS
- Supported class additions: orchestrator and specialist only
- SELF-MOD-001 absolute: PASS
- Runtime bundle scope: other-agent contracts only
- Product/runtime/activation exclusion: PASS
- QP: PASS
- OPOJD: PASS
- Local merge-gate parity: PASS

**Result**: implementation bundle ready for independent final IAA review.