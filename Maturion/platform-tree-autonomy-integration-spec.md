# PLATFORM TREE AUTONOMY STATE INTEGRATION SPECIFICATION  
Version: 1.0  
Status: Autonomy Governance & Visualisation Spec  
Owner: Johan  
Last Updated: YYYY-MM-DD  

--------------------------------------------------------------------------------
# 1. PURPOSE

This document defines **how autonomy levels are represented, controlled, validated,  
and monitored** inside the Maturion Platform Tree.

It ensures:

- full transparency over Maturion’s autonomy  
- understanding of what autonomy is in effect & where  
- constraint enforcement (no silent escalation)  
- clear visual indicators  
- bidirectional integration with Governance API  
- safe, reviewable actions for Johan  

Autonomy is **never implicit**.  
Autonomy is **always visible, logged, justified, and bounded**.

--------------------------------------------------------------------------------
# 2. AUTONOMY MODEL OVERVIEW

Maturion operates with **five autonomy levels**, defined in the Role Behaviour Matrix:

| Level | Name | Description |
|-------|-------|-------------|
| 0 | No Autonomy | Maturion cannot act; observation only |
| 1 | Passive Autonomy | Can diagnose but cannot repair |
| 2 | Guided Autonomy | Can perform non-invasive actions with approval |
| 3 | Active Autonomy | Can perform repairs within module boundaries |
| 4 | Strategic Autonomy | Can coordinate multi-module workflows (rare, heavily restricted) |

Highest allowed level is determined by:

- node type  
- governance tier  
- incident severity  
- current risk posture  
- Johan’s global settings  

**Constitutional nodes can never exceed Level 1.**  
**Embodiment nodes can never exceed Level 3 without Johan’s explicit override.**

--------------------------------------------------------------------------------
# 3. AUTONOMY DATA MODEL

Autonomy state flows to the tree via Platform Tree API.

### 3.1 AutonomyState Object

```ts
AutonomyState {
  embodiment: "Builder" | "Risk" | "Command" | "Marketing";
  level: 0 | 1 | 2 | 3 | 4;
  allowed: boolean;
  justification?: string;
  setBy: "Johan" | "GovernanceAPI" | "Maturion" | "System";
  lastChanged: string; // ISO timestamp
}
3.2 NodeStatus Integration
NodeStatus.autonomyState is used to:

render autonomy indicators

flag violations

display autonomy trend history

4. VISUAL REPRESENTATION IN TREE UI
Autonomy appears at two UI levels:

Node-Level Autonomy Chip

Global Autonomy Overlay Panel

4.1 Autonomy Chip (per-node)
Rendered next to the node label:

csharp
Copy code
[A2]   → "Autonomy Level 2"
[A3*]  → Level 3 but not allowed (violation)
Styling rules:

Colours:

Grey (A0)

Blue (A1)

Green (A2)

Orange (A3)

Purple (A4)

If allowed = false:

Chip glows red

Tooltip: “Autonomy exceeds governance allowance — violation”

4.2 Tooltip Contents
yaml
Copy code
Autonomy Level: 2 (Guided Autonomy)
Allowed by Governance: Yes
Embodiment: Risk-Maturion
Last Changed: 2025-02-21T14:20Z
Justification: “Automated control effectiveness recalibration”
4.3 NodeDetailsPanel — Autonomy Section
Shows:

Current Autonomy Level

Allowed (Yes/No)

“Why is autonomy enabled here?”

“Who enabled it?”

“When did it last change?”

“What actions are currently permitted?”

5. AUTONOMY ACTION CONTROLS (UI)
For authorised users (Johan):

Controls exposed in NodeDetailsPanel:
Increase Autonomy Level

Decrease Autonomy Level

Set Autonomy to Default for Node Type

Suspend Autonomy Temporarily (X minutes/hours)

Suspend Autonomy Until Incident Closed

All controls must:

call Governance API

require ARC approval for Levels 3–4

log decisions

Confirmation modal:

pgsql
Copy code
Are you sure you want to set autonomy to Level 3?
This requires ARC validation and may allow Maturion to execute repairs.
6. BACKEND REQUIREMENTS — GOVERNANCE API
6.1 Check Autonomy
bash
Copy code
GET /governance/autonomy/node/{id}
Returns:

current level

allowed level

restrictions

required approvals

6.2 Set Autonomy
bash
Copy code
POST /governance/autonomy/node/{id}/set-level
{
  "requestedLevel": 2,
  "requestedBy": "Johan"
}
Governance API must:

validate identity

enforce Role Behaviour Matrix

enforce constitutional constraints

require ARC approval when required

log all changes

6.3 Autonomy Violation Reporting
If actual > allowed:

bash
Copy code
POST /tree/node/{id}/update
{
  autonomyState: { allowed: false, level: n }
}
This immediately:

turns node partially red or amber

triggers IWMS incident

notifies Johan

restricts certain Maturion actions

7. AUTONOMY HISTORY & TRENDS (Phase 4 Integration)
Autonomy changes become events in:

History Timeline

Hotspot Analysis

Trend Metrics

Metrics introduced:

AutonomyChangeFrequency

AutonomyViolationCount

AutonomyRiskScore (already defined in Metrics Engine)

Timeline Icon
A diamond marker:

Blue → increase

Grey → decrease

Red → a violation event

8. AUTONOMY & INCIDENT OVERLAY INTERACTION
Incidents may force autonomy reduction:

HIGH/CRITICAL governance or safety incidents:

automatically reduce autonomy to Level 0 or 1

lock it there until resolved

UI must show:

“Autonomy temporarily restricted due to active CRITICAL incident.”

9. MATURION’S AUTONOMY-SAFE BEHAVIOUR
Maturion must check:

pgsql
Copy code
autonomyState.allowed
autonomyState.level
governance constraints
node type restrictions
role behaviour matrix
before acting.

If autonomy not allowed:

“I cannot proceed with this action due to governance restrictions.”

If autonomy reduction is advisable:

“I recommend reducing autonomy here due to repeated drift in the last 24 hours.”

10. GOVERNANCE & SAFETY RULES
R1 – No Silent Escalation
Autonomy level can never increase without:

a recorded event

an explanation

approval (if required)

R2 – No Cross-Layer Escalation
Autonomy cannot exceed allowed levels based on:

node type

role

risk class

constitutional boundaries

R3 – Violations Trigger Immediate Incidents
Any mismatch → IWMS CRITICAL incident.

R4 – No Autonomy at Constitutional Layer
Constitution, Philosophy, Identity nodes → permanently capped at Level 1.

R5 – No Autonomy for Multi-Tenant Operations
Global/dashboard actions must always require Johan-level confirmation.

11. TESTING REQUIREMENTS
11.1 UI Tests
autonomy chip renders correctly

violation chip displays red glow

NodeDetailsPanel populates autonomy details

disabling/enabling autonomy works as expected

11.2 Governance Tests
checkActionPermission must block forbidden autonomy changes

forbidden cross-layer changes rejected

autonomy escalation correctly triggers ARC gate

11.3 Event Tests
autonomy change event updates node

autonomy violation event updates status

timeline records autonomy history

11.4 Metrics Tests
AutonomyRiskScore updates based on history

hotspot calculations include autonomy metrics

12. ACCEPTANCE CRITERIA
Autonomy Integration is complete when:

Every node shows autonomy level accurately.

Autonomy violations are visualised and logged.

Johan can safely adjust autonomy through UI.

Governance API enforces restrictions correctly.

Autonomy history is included in Phase 4 analytics.

Maturion always checks autonomy before acting.

END OF FILE
