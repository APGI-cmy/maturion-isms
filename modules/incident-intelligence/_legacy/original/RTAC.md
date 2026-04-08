# RTAC — Real-Time Awareness & Control
## Integrated Security Management System (ISMS)
### Live Operational Awareness, Control State Monitoring & Trigger Engine
### Version: v1.0 (Design Locked)

---

## 1. PURPOSE & POSITIONING

RTAC (Real-Time Awareness & Control) is the **live operational awareness layer** of the ISMS.

RTAC:
- Maintains real-time visibility of operational states
- Monitors the availability and health of controls
- Detects immediate control failures or unsafe states
- Triggers governed workflows in IWMS
- Feeds assurance validation into RTAE
- Complements RADAM (state vs pattern)

RTAC answers the question:

> **“What is happening right now, and are controls currently effective?”**

---

## 2. DESIGN PHILOSOPHY

### 2.1 Awareness ≠ Assurance
- Awareness tells us **what is happening now**
- Assurance tells us **whether protection works over time**
- RTAC provides awareness
- RTAE provides assurance

Both are required for defensible security.

---

### 2.2 Minimum Human Dependency
- RTAC does not rely on operators watching screens
- Signals are filtered, prioritised, and action-driven
- Humans respond to governed alerts, not raw data

---

## 3. RTAC CORE FUNCTIONS

RTAC performs four core functions:

1. **State Awareness**
2. **Control Availability Monitoring**
3. **Trigger Detection**
4. **Workflow Initiation**

---

## 4. REAL-TIME STATE AWARENESS

RTAC ingests live state information from:

- Surveillance systems (camera online/offline, coverage state)
- Access control systems (doors, zones, permissions)
- Alarm systems
- Environmental sensors
- Asset tracking systems
- Safety systems
- Operational systems (where relevant)

RTAC normalises state information into:
- Online / Offline
- Active / Inactive
- Compliant / Non-Compliant
- Expected / Unexpected

---

## 5. CONTROL AVAILABILITY MONITORING

Controls are continuously monitored for availability.

Examples:
- Camera coverage in high-risk zones
- Access control enforced where required
- Safety interlocks operational
- Procedural controls activated

A control being **present but unavailable** is treated as a failure.

RTAC records:
- Control uptime
- Control downtime
- Degradation trends
- Repeated failures

---

## 6. RTAC TRIGGER MODEL

RTAC does not raise “alerts” in isolation.  
RTAC raises **governed triggers**.

Trigger types include:
- Control unavailable
- Control degraded
- Unexpected state
- Missing prerequisite for high-risk operation
- Unsafe operational condition

Each trigger:
- Has a severity
- Has a context
- Has a defined routing path

---

## 7. RTAC → IWMS WORKFLOW INITIATION

When a trigger meets defined conditions:
- RTAC automatically creates an incident in IWMS
- Source = RTAC
- Context is attached (state snapshot)
- Suggested category is provided
- ARC assigns accountability immediately
- Workflow is generated
- Timers start

RTAC never manages resolution directly.

---

## 8. RTAC DATA FLOW

```mermaid
flowchart LR
    A[Live Systems & Controls]
    B[RTAC State Engine]
    C[Trigger Detection]
    D[IWMS Incident]
    E[RTAE Assurance]

    A --> B --> C
    C --> D
    D --> E
9. RTAC & HIGH-RISK OPERATIONS
For high-risk operations:

RTAC validates prerequisite controls

Operation cannot proceed unless:

Required controls are available

Required states are compliant

If a control fails during execution:

Incident is created

Workflow is enforced

Assurance is required

RTAC elevates access management to rules-based access governance.

10. RTAC & ARC
RTAC respects ARC fully.

RTAC does not assign accountability

RTAC does not reroute responsibility

RTAC only triggers governed workflows

ARC determines who must act

11. RTAC & RADAM
RTAC and RADAM are complementary:

RTAC	RADAM
Real-time state	Historical & pattern analysis
Control availability	Behavioural deviation
Immediate triggers	Analytical triggers
“Is it on?”	“Is it working as intended?”

Both may independently generate incidents.

12. RTAC & RTAE
RTAC feeds RTAE with:

Control availability data

Downtime metrics

Trigger frequency

Real-time failure evidence

RTAE uses this to:

Validate control effectiveness

Quantify assurance strength

Detect control degradation

13. RTAC ESCALATION
RTAC does not escalate directly.

Escalation occurs via:

IWMS workflows

ARC hierarchy

Time-based rules

RTAC provides the signal; governance provides the response.

14. RTAC & OPERATIONAL MATURITY
RTAC contributes to maturity by revealing:

Control reliability

Operational discipline

Responsiveness to failures

Effectiveness of real-time governance

Frequent RTAC triggers without improvement indicate systemic weakness.

15. SECURITY & RESILIENCE
RTAC operates with least-privilege access

No control modification by default

All state reads are logged

Supports redundancy and failover

Designed for high-availability environments

16. SUMMARY
RTAC ensures that:

The organisation knows what is happening now

Control failures are detected immediately

High-risk operations cannot proceed blindly

Governance is activated in real time

Awareness feeds assurance and maturity

RTAC is the live nervous system of the ISMS.

END OF FILE — RTAC.md