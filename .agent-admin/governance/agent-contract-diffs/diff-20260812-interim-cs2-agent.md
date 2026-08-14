# Protected Agent Contract Diff Record — Interim CS2 Agent

## Authority and Scope

- **Authorization**: CS2-approved correction supplied in the current task context; no numeric issue identifier was provided.
- **Implementer**: CodexAdvisor-agent, acting only on the authorized target.
- **Protected target**: `.github/agents/interim-cs2-agent.md`
- **Canonical policy reviewed**: `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md`
- **CodexAdvisor-owned scope**: Correct the CS2-delegated review contract, its Tier 2 evidence method, continuity records, and protected-change evidence. No product, runtime, canon, deployment, or activation artifact is in the CodexAdvisor-owned change.
- **Combined assurance scope**: The user-authorized package also includes the ten automation paths enumerated in the companion scope declaration. They are not asserted as CodexAdvisor-authored, but they must be committed and independently assured with this protected change.

## Target-State Review

The protected target is a tracked repository file and is currently modified but uncommitted in this workspace. The final IAA review must compare its frozen committed SHA and declared scope with the eventual PR base; no commit SHA or final diff is asserted by this record.

| Correction | Result |
|---|---|
| Preserve narrow interim-CS2 write boundary | PASS — `scope.write_paths` remains the agent workspace; the contract itself is changed only by CS2-authorized CodexAdvisor work |
| Forbid contract self-write and product takeover | PASS — constitutional self-modification and no-build prohibitions remain |
| Preserve protected controls | PASS — canon, CI/workflow, product, runtime, deployment, activation, IAA, merge, and waiver authority remain prohibited |
| Correct approval model | PASS — human CS2 authorizes scope; CodexAdvisor performs the bounded protected change; independent IAA reviews the frozen committed bundle; human CS2 retains merge/release authority |
| Normalize execution identity | PASS — `execution_identity` exists and now uses the repository-standard `secret_env_var: "MATURION_BOT_TOKEN"` field; no secret value is stored in the contract |
| Add bootstrap hard-stop method | PASS — Tier 1 and Tier 2 require a structured matrix for every contract-required bootstrap input and prohibit review on non-`PASS` status |
| Require frozen-scope independent assurance | PASS — Tier 1 requires the complete declared scope to be committed and its immutable commit/PR-base delta recorded before an independent non-contributor IAA review |
| Preserve four phases and no assurance claim | PASS — independent IAA remains required before any merge-ready claim |

## Validation

- This record is an uncommitted correction artifact. Validation and final values must be rerun against the complete frozen committed scope before IAA invocation.
- The current contract contains `execution_identity.secret_env_var`, not `execution_identity.secret`; this conforms to the active repository convention.
- The current contract requires the bootstrap matrix and a halt on absent, stale, contradictory, or invalid required input.

## Blocking Remainder

- No commit, PR, hosted checks, or independent IAA review is asserted by this record. The combined package was rejected before a valid final IAA result; no IAA assurance token is created or claimed here.
- The work remains uncommitted and non-merge-ready. Before a new IAA invocation, the complete declared scope must be committed, the PR-base delta and current-head binding must be recorded, and the independent IAA must review that frozen scope.
