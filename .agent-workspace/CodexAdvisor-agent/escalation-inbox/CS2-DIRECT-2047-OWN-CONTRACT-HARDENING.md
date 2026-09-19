# CS2-DIRECT-2047 — CodexAdvisor Own-Contract Recovery Context

**Tier**: 3 — session-specific task context  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Fresh context mode**: FRESH_CONTEXT_ONLY  
**Purpose**: Repair the CodexAdvisor custom-agent configuration and entrench the continuous-improvement loop without importing historic session assumptions.

## Exact defect

The CodexAdvisor custom-agent configuration rejects the current contract because frontmatter `metadata.change_summary` is 215 characters. The configuration limit is 200 characters.

## Authorised scope

- `.github/agents/CodexAdvisor-agent.md`
- `.agent-workspace/CodexAdvisor-agent/knowledge/index.md`
- `.agent-workspace/CodexAdvisor-agent/knowledge/continuous-improvement-protocol.md`
- `.agent-workspace/CodexAdvisor-agent/knowledge/FAIL-ONLY-ONCE.md`
- this Tier 3 record

## Required outcomes

1. Shorten the offending metadata value to 200 characters or fewer.
2. Keep `SELF-MOD-001` absolute: this is CS2-direct execution, not a CodexAdvisor self-write.
3. Require the remediation ladder and convergent evidence rule in Tier 1 and Tier 2.
4. Require a future CS2-direct own-contract repair to use an exact Tier 3 record and, when marked `FRESH_CONTEXT_ONLY`, not load historic session memory or personal patterns.
5. Validate the configuration limit, contract structure, and continuous-improvement rule.

## Exclusions

No product code, database, deployment, secrets, merge authority, role expansion, weakened IAA, or unrelated agent-file changes.

## Handover requirement

Return the changed files, validation results, and a compact ripple record for independent assurance.