# CodexAdvisor — Agent File Non-Negotiables Checklist

**Agent**: CodexAdvisor-agent  
**Knowledge Version**: 1.5.0  
**Last Updated**: 2026-07-12  
**Authority**: CS2 (Johan Ras)

Compliance must be 100% before handover. `thin_core_living` is only an orchestrator subtype and never relaxes four-phase, authority, assurance, merge-gate, OPOJD, evidence, memory, size, or protected-path controls.

## Structure and Size

- [ ] YAML frontmatter is valid and complete.
- [ ] Required identity, governance, scope, capabilities, prohibitions, Tier 2, and metadata sections are present.
- [ ] Contract and knowledge versions are current.
- [ ] Actual character count is at or below 30,000; reduction is required above 25,000.
- [ ] All four executable phases are present.
- [ ] No unfinished or non-final text remains.

## Authority and Protected Paths

- [ ] Exact CS2 authority exists.
- [ ] Every changed path is authorised.
- [ ] No direct commit to `main` is used.
- [ ] Protected-file ownership is preserved.
- [ ] CodexAdvisor did not author, commit, approve, or self-assure its own Tier 1 change.
- [ ] `SELF-MOD-001` remains absolute, with no standing or issue-level override.

## Role and Bundle Rules

- [ ] The applicable canonical role checklist is loaded.
- [ ] Orchestrator and specialist mappings use the canonical checklist paths.
- [ ] Orchestrator or runtime-specialist bundle jobs also load `runtime-specialist-bundle-process.md`.
- [ ] The runtime method supplements rather than replaces the role checklist.
- [ ] The bundle is for another agent, not CodexAdvisor itself.
- [ ] Registry or routing output remains a proposal unless separate implementation authority exists.
- [ ] AIMC dependencies and QA-to-red obligations are mapped without implementation.
- [ ] Status distinguishes planned, unavailable, degraded, contract-ready, activation-ready, and active.
- [ ] A contract is never represented as activation.
- [ ] Maturion review of specialist output is required before user response.
- [ ] No product, schema, migration, test, CI, provider, Supabase, Vercel, deployment, runtime-adapter, routing-activation, registry-activation, or specialist-activation work is included.

## Quality, Evidence, and Assurance

- [ ] QP runs after every major draft and every failure is corrected before a full rerun.
- [ ] Local parity covers format, content completeness, four phases, taxonomy, authority, actor identity, size, bundle completeness, and assurance readiness.
- [ ] OPOJD has zero failures, skipped obligations, warnings, unauthorised paths, or missing evidence.
- [ ] Diff record lists every changed path and maps it to the issue.
- [ ] PREHANDOVER is committed and immutable.
- [ ] Session memory records continuity, unresolved items, role actions, IAA state, and a non-blank improvement suggestion.
- [ ] Improvement suggestions use only the exact issue-authorised parking-station path; no parking entry is required when no qualifying suggestion exists.
- [ ] IAA is independent from implementation and recommendation roles.
- [ ] Final assurance uses the approved active wave-record path.
- [ ] The PR remains draft until final IAA PASS.
- [ ] CS2 remains sole merge authority.

Any unchecked item is blocking. Correct the defect, rerun the checks, and create fresh immutable handover evidence after a material correction.