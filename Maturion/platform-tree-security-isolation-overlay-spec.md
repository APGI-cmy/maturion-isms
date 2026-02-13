# PLATFORM TREE SECURITY & TENANT ISOLATION OVERLAY SPECIFICATION  
Version: 1.0  
Status: Security & Governance Visualisation Spec  
Owner: Johan  
Last Updated: YYYY-MM-DD  

--------------------------------------------------------------------------------
# 1. PURPOSE

The **Security & Tenant Isolation Overlay** provides the full visual, analytic,  
and governance layer that ensures:

- tenant boundaries remain fully isolated  
- no cross-tenant leakage ever occurs  
- security incidents are visible instantly  
- isolation boundaries are enforced, monitored, and explainable  
- Johan has complete situational awareness of security posture  
- watchdogs (Guardian, Sentinel, Arbiter) integrate cleanly  
- Maturion always respects least-privilege boundaries  

This overlay is built on top of:

- the Platform Tree  
- Incident System  
- Metrics Engine  
- Autonomy System  
- Tenant Isolation Standard  

It enforces **the highest level of safety in the entire Maturion ecosystem**.

--------------------------------------------------------------------------------
# 2. SCOPE

The overlay covers:

### 2.1 System-Wide Security
- core platform nodes  
- constitutional layers  
- embodiment behaviour  
- world model boundaries  
- cross-repo behavioural restrictions  

### 2.2 Tenant Isolation
- per-tenant data flows  
- per-tenant context windows  
- per-tenant knowledge boundaries  
- strict cross-tenant firewalls  
- isolation enforcement indicators  

### 2.3 Real-Time Security Overlays
- active breach alerts  
- attempted boundary crossings  
- suspicious behaviour from any embodiment  
- unauthorized knowledge access  
- drift-induced leakage risks  

--------------------------------------------------------------------------------
# 3. SECURITY & ISOLATION DATA MODEL

### 3.1 SecurityState Object

```ts
SecurityState {
  level: "OK" | "WARNING" | "BREACH_ATTEMPT" | "BREACH_CONFIRMED";
  source: "Guardian" | "Sentinel" | "Arbiter" | "System" | "UserReport";
  message: string;
  timestamp: string; // ISO timestamp
  tenantContext?: string | null; 
}
3.2 IsolationState Object
ts
Copy code
IsolationState {
  nodeId: string;
  isolationStrength: "FULL" | "RESTRICTED" | "WEAKENED" | "VIOLATED";
  enforcementSource: "Policy" | "Runtime" | "Watchdog" | "Override";
  lastCheck: string;
  issues?: IsolationIssue[];
}
3.3 IsolationIssue Object
ts
Copy code
IsolationIssue {
  type: 
    | "CrossTenantKnowledgeLeak"
    | "CrossTenantContextRequest"
    | "ForbiddenDataAccess"
    | "MemoryBoundaryViolation"
    | "WorldModelContamination"
    | "UnsafeEmbodimentCrossTalk"
    | "UnapprovedAutonomyAtTenantLevel";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timestamp: string;
  description: string;
}
These objects feed into:

badges

overlays

metrics

watchlists

incident mappings

4. VISUAL OVERLAY ELEMENTS (TREE UI)
4.1 Isolation Shield Icon (per-node)
Appears next to every node that represents:

a tenant

a module interacting with tenant data

any embodiment operating within a tenant

Shield colours:

Shield	Meaning
🟢 Green Shield	Full isolation, no issues
🟡 Yellow Shield	Minor warnings, reduced isolation integrity
🔴 Red Shield	Isolation violation detected
🟣 Purple Shield	ARC review required (world-model/safety concern)

4.2 Security Badge (per-node)
A small badge indicating active security events:

🔴 red dot → active security incident

🟠 orange dot → suspicious behaviour flagged

🔵 blue dot → security updates ongoing

4.3 Node Highlighting
Node outline colours for severe cases:

Bright Red → confirmed breach

Pulsing Red → breach attempt

Orange → risky or degraded isolation

4.4 Tenant Boundary Visuals (for tenant-scoped trees)
A faint coloured boundary box surrounds all nodes belonging to the same tenant.

No tenant boundary may overlap.

5. INTERACTION DESIGN
5.1 Hover Tooltips
For isolation shield:

less
Copy code
Isolation: WEAKENED
Reason: Tenant cross-context request blocked by Guardian.
Last Check: 2025-03-07T13:32Z
For security badge:

yaml
Copy code
Security Alert: BREACH_ATTEMPT
Source: Arbiter
Message: Memory boundary violation detected and blocked
Timestamp: ...
5.2 NodeDetailsPanel — Security Section
Contents:

Current security level

All open security alerts

Isolation integrity score

Cross-tenant request logs

Memory boundary checks (last 10 events)

Watchdog telemetry (Guardian, Sentinel, Arbiter)

“View in IWMS” button

“Run Security Diagnostics” (Phase 5+)

6. BACKEND API EXTENSIONS
6.1 Get Security State
bash
Copy code
GET /tree/node/{id}/security
Returns SecurityState.

6.2 Get Isolation State
bash
Copy code
GET /tree/node/{id}/isolation
Returns IsolationState.

6.3 Get Security Hotspots
pgsql
Copy code
GET /tree/security/hotspots?window=7d
Returns highest-risk nodes.

6.4 Get Cross-Tenant Events
pgsql
Copy code
GET /tree/security/cross-tenant-events?window=24h
Shows blocked or suspected cross-tenant interactions.

7. WATCHDOG INTEGRATION
Guardian
Detects and halts:

inappropriate output

unsafe content generation

attempted boundary bypasses

Sentinel
Detects:

behavioural drift that risks privacy

pattern changes indicating misuse

anomalies in embodiment execution

Arbiter
Hard-stop systems enforcing:

world model memory boundary

tenant isolation

forbidden learning or cross-linking

Events from all three watchdogs update:

SecurityState

IsolationState

badges in the tree

8. METRICS & SCORING IMPACT
The following metrics from the Metrics Engine interact with this overlay:

Security-Related Metrics
SecurityViolationCount

IsolationViolationCount

CrossTenantAccessAttempts

BoundaryDriftScore

GuardianBlockRate

Trend & Risk Scoring
These metrics influence:

HotspotScore

AutonomyRiskScore

OverallHealthScore

9. GOVERNANCE RULES & HARD RESTRICTIONS
Rule 1 — No Cross-Tenant Data Access Ever
If such an attempt occurs:

Arbiter blocks it

Guardian logs it

Sentinel monitors follow-up behaviour

IWMS CRITICAL incident created

autonomy reduced

tree nodes marked in red

Rule 2 — Tenant Boundary is a Hard Boundary
Maturion must not:

read tenant A’s data when serving tenant B

use tenant B’s memory during tenant A tasks

use shared example data accidentally

Rule 3 — No Multi-Tenant Embodiment Cross-Talk
Embodiments must operate in isolated runtime sandboxes per tenant.

Rule 4 — No World Model Contamination
User content must never update the global world model unless:

approved by ARC

validated by Arbiter

processed via safe self-learning gates

Rule 5 — No Autonomy Beyond Tenant
Even at high autonomy, Maturion must NEVER:

create cross-tenant actions

make decisions affecting another tenant

combine tenant knowledge

Rule 6 — Transparency
All security events must appear:

in the tree

in IWMS

in watchdog dashboards

Rule 7 — Always Visible to Johan
Critical security events must always be surfaced:

on the dashboard

in mobile notifications

via immediate alert

10. TESTING REQUIREMENTS
10.1 UI Tests
correct rendering of shields

correct colours

correct badges

tenant boundaries visible and correct

10.2 API Tests
isolation state returned correctly

blocked cross-tenant events appear in logs

10.3 Governance Tests
autonomy correctly restricted when isolation violated

watchdog triggers create correct updates

10.4 Security Scenarios
Simulate:

memory boundary violation

cross-tenant query

unsafe embodiment communication

Ensure:

Arbiter blocks

Guardian alerts

Tree updates

IWMS incident created

11. ACCEPTANCE CRITERIA
The Security & Tenant Isolation Overlay is complete when:

Every node visually communicates isolation integrity.

All security incidents appear instantly and clearly.

Watchdog alerts propagate correctly.

Autonomy correctly responds to isolation issues.

No sensitive data is shown where not permitted.

Tenant boundaries are visible and enforced.

Johan can diagnose any isolation issue from the tree.

END OF FILE
yaml
Copy code
