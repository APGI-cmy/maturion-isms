# CROSS-REPO RIPPLE TRANSPORT PROTOCOL

## Status
**Type**: Canonical Governance Policy  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.0.0  
**Effective Date**: 2026-02-10  
**Owner**: Governance Administrator  
**Precedence**: Subordinate to GOVERNANCE_RIPPLE_MODEL.md, GOVERNANCE_RIPPLE_DETECTION_PROTOCOL.md

---

## 1. Purpose

This canon defines the **mandatory transport protocol** for governance ripple events. It ensures that governance changes propagate deterministically, with **push-based dispatch** and **scheduled fallback**.

---

## 2. Mandatory Transport Modes

1. **Push Ripple (Mandatory)**
   - Triggered by governance repo changes
   - Uses `repository_dispatch` with canonical payload

2. **Scheduled Fallback (Mandatory)**
   - Runs hourly in consumer repos
   - Recovers from missed dispatch events

Both modes are required. Fallback is not optional.

---

## 3. Ripple Triggers (Governance Repo)

Dispatch must trigger when any of the following changes on `main`:
- `governance/canon/`
- `governance/CANON_INVENTORY.json`
- `governance/GATE_REQUIREMENTS_INDEX.json`
- `governance/CONSUMER_REPO_REGISTRY.json`
- `governance/executable/`

---

## 4. Dispatch Payload Format

Payload (JSON) MUST include:

```
{
  "event_type": "governance_ripple",
  "source_repo": "APGI-cmy/maturion-foreman-governance",
  "commit_sha": "<sha>",
  "commit_message": "<message>",
  "timestamp": "<iso-8601>"
}
```

---

## 5. Consumer Expectations

On receipt of a ripple dispatch:
1. Start alignment workflow immediately
2. Record payload to `.agent-admin/governance/ripple-log.json`
3. Update `.agent-admin/governance/sync_state.json`
4. Create a PR if drift is detected

---

## 6. Retry, Backoff, Circuit Breaker

**Dispatch retry policy**:
- Max attempts: 3
- Backoff: 30s, 2m, 5m

**Circuit breaker**:
- After 3 consecutive failures, stop dispatch to that repo
- Create a Governance Change Request issue for CS2 review

---

## 7. Deterministic Targeting

Target repositories are defined **only** in `governance/CONSUMER_REPO_REGISTRY.json`.
- Order is deterministic
- Disabled entries are skipped
- Tags may be used for staged rollout

---

## 8. SLA Expectations

- Push ripple dispatch within 10 minutes of merge
- Scheduled fallback every 60 minutes
- Alignment PR created within 30 minutes of drift detection

SLA violations must be logged and escalated.
