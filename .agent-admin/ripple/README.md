# `.agent-admin/ripple/`

Layer-down dispatch log directory.

## Purpose

Stores `layer-down-received-<datestamp>.json` records created by the
`ripple-integration.yml` workflow each time a layer-down issue is processed
from the canonical governance repository (`APGI-cmy/maturion-foreman-governance`).

## Schema

Each record follows the schema produced by the upstream
`governance-layer-down-dispatch.yml` workflow:

```json
{
  "schema_version": "1.0.0",
  "type": "layer_down_received",
  "timestamp": "<ISO-8601>",
  "source_issue": "<issue-number>",
  "commit_sha": "<sha>",
  "requires_cs2_approval": true | false,
  "ripple_pr": "<pr-number>",
  "escalated": true | false
}
```

## Authority

`LAYERING_AND_RIPPLING_AUTOMATION_STRATEGY.md v1.0.0` §9.1  
`CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md`
