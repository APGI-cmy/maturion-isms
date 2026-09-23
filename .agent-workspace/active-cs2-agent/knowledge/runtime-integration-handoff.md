# Active-CS2 — Runtime Integration Handoff

## Current delivery truth

This PR delivers the inactive active-CS2 contract and Tier 2 bundle. It does not deliver a live evaluator, event store, merge interface, safety supervisor, or activation package.

## Requirement-to-runtime map

| Requirement | Current repository evidence | Current state | Future owner |
|---|---|---|---|
| Durable parent job / wave record compatibility | `governance/schemas/ACTIVE_CS2_JOB_WAVE.schema.json`, `governance/templates/ACTIVE_CS2_JOB_WAVE_RECORD.template.json`, fixtures under `governance/schemas/fixtures/active-cs2-job-wave/` | Schema/templates present; runtime store not implemented | Foreman-appointed implementation |
| Deterministic evaluator, claims, idempotency, event ledger | Canon only: `ACTIVE_CS2_AUTOMATED_WORKFLOW_GOVERNANCE.md` §§3,5 | NOT IMPLEMENTED in this bundle | Foreman-appointed implementation |
| Versioned scoped merge policy and compare-and-set merge | `governance/schemas/ACTIVE_CS2_MERGE_POLICY.schema.json`, fixture `scoped-merge-policy.json` | Schema/fixture present; merge runtime not implemented | Foreman-appointed implementation |
| Current check + assurance verification | Existing repo gates, PR-scoped wave record, independent IAA route | PARTIAL — evidence model exists; runtime evaluator absent | Foreman-appointed implementation |
| Safety supervisor, kill switch, human reset | Canon + control map only | NOT IMPLEMENTED in this bundle | Foreman-appointed implementation + human CS2 |
| Conserved job-level runtime/spend/attempt counters | Canon + template envelope fields | NOT IMPLEMENTED in this bundle | Foreman-appointed implementation |
| Typed refusal / exactly-once successor dispatch | Canon refusal vocabulary + dispatch template | SPECIFIED, not implemented | Foreman-appointed implementation |
| Future App Management Centre integration | `MATURION_AGENT_NETWORK_ORGANIGRAM.md` and active-CS2 canon | ARCHITECTURAL TARGET only | Human CS2 + future implementation |

## Loadability and provider boundary

- Contract discovery is provided by `mcp-servers/agent-bootstrap/index.js`, which auto-discovers `.github/agents/*.md`.
- Full bundle validation requires both contract discovery and verification of Tier 2 required files.
- The current bootstrap surface loads the contract file directly; Tier 2 bundle verification is supplied by the repository wake-up protocol using the contract's `tier2_knowledge` declarations.

## Validation performed in PR #2057

| Check | Command / surface | Result | Meaning |
|---|---|---|---|
| Fresh-process bootstrap discovery | `cd mcp-servers/agent-bootstrap && node test-bootstrap.js` | PASS | A fresh `agent-bootstrap` server process discovered 21 agent contracts, including `active-cs2-agent`, and validated core lookup/boot behaviour. |
| Tier 2 bundle loadability | `.github/scripts/wake-up-protocol.sh active-cs2-agent` | PASS | The wake-up path resolved `.github/agents/active-cs2-agent.md`, loaded `.agent-workspace/active-cs2-agent/knowledge/index.md`, and verified all 10 declared Tier 2 required files exist. |
| Live MCP provider refresh | `agent_bootstrap(agent_id: \"active-cs2-agent\")` in the current already-running tool session | EXTERNAL PROVIDER BOUNDARY | The registered MCP server instance did not rescan `.github/agents/` after file creation and returned `Unrecognized agent_id 'active-cs2-agent'`. This is a session-refresh/provider limitation, not evidence that a fresh server process cannot load the contract. |

## Truthful Wave B conclusion

The repository proves real loadability of the new contract and required Tier 2 bundle through a fresh bootstrap-server process plus the wake-up protocol. The remaining limitation is provider refresh inside the already-running in-session MCP registration: the live tool list is stale until the server is restarted or a new session begins. No runtime/controller activation is implied by this proof.

## Runtime implementation handback

Any later implementation issue must name the controller/evaluator, durable record store, compare-and-set merge route, safety supervisor/reset surface, failure register, test plan, independent IAA path, and activation approval path explicitly. No new authority is created by this handoff document.
