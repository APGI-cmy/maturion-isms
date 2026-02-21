# TTP Correlation Guide

**Agent**: pit-specialist  
**Domain**: PIT Tactics, Techniques & Procedures (TTP) Correlation  
**Version**: 1.0.0  
**Date**: 2026-02-21  
**Authority**: CS2 (Johan Ras)

---

## Overview

This knowledge file defines how the PIT specialist correlates observed threat behaviours to the MITRE ATT&CK framework for adversary profiling, coverage gap analysis, and defence prioritisation.

---

## MITRE ATT&CK Reference

**Matrices Supported**:
- Enterprise (Windows, macOS, Linux, Cloud, Network)
- Mobile (iOS, Android)
- ICS (Industrial Control Systems)

**Source**: https://attack.mitre.org  
**Update cycle**: Quarterly sync to Tier 3 (`supabase:table=ttp_mappings`)

---

## TTP Correlation Workflow

1. **Receive observed behaviours** from orchestrator (log data, alert data, IOC context)
2. **Tokenise behaviours** — extract action verbs, objects, context (e.g., "lateral movement via SMB")
3. **Match to ATT&CK techniques** — keyword + semantic matching against technique descriptions
4. **Map to ATT&CK IDs** — e.g., `T1021.002` (Remote Services: SMB/Windows Admin Shares)
5. **Build adversary profile** — group techniques by tactic phase
6. **Generate heat map** — visualise tactic coverage across ATT&CK matrix
7. **Identify gaps** — techniques not covered by current detection controls
8. **Return TTP analysis artifact** to orchestrator

---

## TTP Schema

```json
{
  "ttp_id": "ATTACK:T1021.002",
  "matrix": "enterprise",
  "tactic": "lateral-movement",
  "technique": "Remote Services: SMB/Windows Admin Shares",
  "sub_technique": true,
  "parent_id": "ATTACK:T1021",
  "observed_in": ["<ioc_id>", "<alert_id>"],
  "confidence": 0-100,
  "detection_coverage": "detected | partial | undetected",
  "tenant_id": "<tenant-uuid>"
}
```

---

## Tactic Phases (ATT&CK Kill Chain)

| Phase | ATT&CK Tactic | Example Techniques |
|---|---|---|
| Reconnaissance | `reconnaissance` | T1595, T1596 |
| Resource Development | `resource-development` | T1583, T1584 |
| Initial Access | `initial-access` | T1190, T1566 |
| Execution | `execution` | T1059, T1203 |
| Persistence | `persistence` | T1078, T1547 |
| Privilege Escalation | `privilege-escalation` | T1068, T1548 |
| Defence Evasion | `defense-evasion` | T1055, T1218 |
| Credential Access | `credential-access` | T1003, T1110 |
| Discovery | `discovery` | T1082, T1083 |
| Lateral Movement | `lateral-movement` | T1021, T1550 |
| Collection | `collection` | T1005, T1039 |
| Command & Control | `command-and-control` | T1071, T1105 |
| Exfiltration | `exfiltration` | T1041, T1048 |
| Impact | `impact` | T1486, T1499 |

---

## Heat Map Generation

**Output format**: JSON matrix keyed by tactic, with technique coverage scores

```json
{
  "matrix": "enterprise",
  "tenant_id": "<uuid>",
  "generated_at": "<ISO8601>",
  "tactics": {
    "initial-access": {
      "coverage_score": 72,
      "techniques_detected": 5,
      "techniques_total": 9
    }
  }
}
```

---

**Authority**: CS2 | **Managed by**: pit-specialist | **Version**: 1.0.0
