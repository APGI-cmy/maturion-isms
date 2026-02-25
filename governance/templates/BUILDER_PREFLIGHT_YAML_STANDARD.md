# Builder Phase 1 Preflight Attestation — YAML Standard

**Version**: 1.0.0  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Scope**: All builder-class agents (api-builder, qa-builder, schema-builder, ui-builder, integration-builder)  
**Governance reference**: LIVING_AGENT_SYSTEM.md v6.2.0, AGENT_PREFLIGHT_PATTERN.md v1.0.0  
**Derived from**: IAA advisory A-F-1 (session-002-20260225), Foreman session-055 parking station entry  

---

## Purpose

Standardises the Phase 1 preflight attestation block that every builder-class agent MUST
record in its session memory file. Using a consistent YAML structure enables deterministic
IAA verification and CI audit without manual interpretation.

---

## Canonical YAML Block

Every builder session memory file MUST include this block under the heading
`## Phase 1 Preflight Attestation`:

```yaml
phase_1_preflight:
  agent_file_read: YES
  agent_file_path: ".github/agents/<agent-id>.md"
  agent_identity_declared:
    agent_id: "<agent-id>"
    agent_class: "builder"
    agent_version: "<version from agent YAML>"
    identity_role: "<identity.role from agent YAML>"
    identity_class_boundary: "<identity.class_boundary from agent YAML — full text>"
    lock_id: "<identity.lock_id from agent YAML>"

  canon_inventory_verified: YES
  canon_inventory_path: "governance/CANON_INVENTORY.json"
  canon_inventory_result: "PASS — <N> canons, zero degraded"
  canon_inventory_total_canons: <N>
  canon_inventory_placeholder_count: 0
  canon_inventory_degraded_mode: false

  sessions_reviewed:
    - "<session-id> — <one-line summary>"
    - "<session-id> — <one-line summary>"
  unresolved_escalations: NONE
  unresolved_blockers: NONE

  preflight_complete: YES
  preflight_declaration: "PREFLIGHT COMPLETE. Proceeding to <next phase>."
```

---

## Field Definitions

| Field | Required | Description |
|-------|----------|-------------|
| `agent_file_read` | YES | Must be `YES`. Confirms contract was read. |
| `agent_file_path` | YES | Exact path to agent contract file read this session. |
| `agent_identity_declared.agent_id` | YES | Extracted from agent YAML `agent.id` — NOT from memory. |
| `agent_identity_declared.agent_class` | YES | Must be `builder` for all builder-class agents. |
| `agent_identity_declared.agent_version` | YES | Extracted from agent YAML `agent.version`. |
| `agent_identity_declared.identity_role` | YES | Full text of `identity.role` from agent YAML. |
| `agent_identity_declared.identity_class_boundary` | YES | Full text of `identity.class_boundary` from agent YAML. |
| `agent_identity_declared.lock_id` | YES | Value of `identity.lock_id` from agent YAML. |
| `canon_inventory_verified` | YES | Must be `YES`. Confirms CANON_INVENTORY.json was read. |
| `canon_inventory_result` | YES | `PASS — N canons, zero degraded` or `FAIL — <reason>`. |
| `canon_inventory_total_canons` | YES | Total number of entries in CANON_INVENTORY.json. |
| `canon_inventory_placeholder_count` | YES | Count of null/empty/000000 file_hash_sha256 values. |
| `canon_inventory_degraded_mode` | YES | Must be `false` to proceed. |
| `sessions_reviewed` | YES | List of prior session IDs and one-line summaries reviewed. |
| `unresolved_escalations` | YES | `NONE` or list of open escalations carried forward. |
| `unresolved_blockers` | YES | `NONE` or list of open blockers. If non-NONE, agent must halt. |
| `preflight_complete` | YES | Must be `YES`. Failure = agent is BLOCKED. |
| `preflight_declaration` | YES | Explicit PREFLIGHT COMPLETE statement with next action. |

---

## Placement in Session Memory

The attestation block MUST appear:
1. After the `## Agent Metadata` block
2. Before the `## Task Description` block
3. Under the exact heading `## Phase 1 Preflight Attestation`

---

## Non-Compliance

A session memory file that uses prose narrative instead of this YAML block is
non-compliant with this standard. IAA will flag it as `ATTESTATION-FORMAT-FAIL`
during assurance verification.

Prose format was used in some earlier api-builder sessions (pre-standard). Any new
session memory committed after this standard is published MUST use YAML format.

---

## Migration

Existing session memories committed before this standard was published are grandfathered.
New sessions from the publication date forward must comply. If a builder agent's prior
session used prose, the next session's memory must switch to YAML — no corrective rewrite
of old files is required.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Published**: 2026-02-25  
**Applies to**: All builder-class agent session memories from this date forward
