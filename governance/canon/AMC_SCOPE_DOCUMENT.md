# APP MANAGEMENT CENTRE (AMC) — SCOPE DOCUMENT

## Status
Canonical Governance Standard  
Version: v1.0.0  
Authority: Johan Ras (CS2 / @APGI-cmy)  
Effective Date: 2026-03-01  
Applies To: All Maturion Systems, All Agents, All Operators  
Supersedes: "Foreman App" naming and informal governance definition

---

## 1. Name Change Record

| Old Name | New Name |
|---|---|
| Foreman App | **App Management Centre (AMC)** |
| Foreman Dashboard | **AMC Dashboard** |
| Foreman App governance | **AMC Governance** |
| `maturion-foreman-app` (repo) | **`maturion-amc`** (target rename) |

This change applies to all documentation, code, UI labels, governance artefacts, issue titles, and agent session memory from 2026-03-01 onwards.

---

## 2. Purpose

The **App Management Centre (AMC)** is the central governance and operational oversight platform for the Maturion system. It provides CS2 with real-time visibility and control over all governance-sensitive operations, ensuring that automation never runs ahead of human intent.

---

## 3. AMC Responsibilities

### 3.1 ARC Trigger Governance (Human-in-the-Loop)

- All ARC triggers from knowledge uploads are routed to AMC **before** any GitHub issue is created
- CS2 reviews each trigger in AMC and makes an explicit YES (create issue) or NO (dismiss with record) decision
- A Discussion UI allows CS2 to clarify details with Maturion before deciding
- CS2 is notified of the outcome of every decision
- **Default policy**: Option C (all triggers require explicit CS2 approval) — active until CS2 changes it in AMC settings
- **Progressive relaxation path**: Option C → Option B (auto for low-risk) → Option A (fully automatic) — each step requires explicit CS2 instruction

### 3.2 Dynamic Upload Quota Management

- AMC displays current quota usage per organisation in real time
- AMC alerts CS2 at 80% threshold and on quota exhaustion
- CS2 can adjust per-org or global quotas instantly from AMC (no code change required)
- **Default quotas**: 50 single / 5 batch per organisation per day
- **Scaling tiers** managed in AMC:
  - Tier 1: 50 single / 5 batch
  - Tier 2: 200 single / 20 batch
  - Tier 3: 500 single / 50 batch
  - Tier 4: unlimited
- All quota changes are audited with timestamp and CS2 identity

### 3.3 Alert Dashboard

- All system alerts route to AMC first
- Alert types include:
  - Quota threshold warnings (80% and 100%)
  - ARC backlog accumulation
  - Embedding pipeline failures
  - GitHub API failures
  - Global backlog warnings
- Weekly digest: Monday morning summary of quota usage across all organisations

### 3.4 Audit Trail

- Every ARC approval and dismissal is permanently recorded in AMC
- Every quota change is logged with timestamp and CS2 identity
- Every governance decision is timestamped and attributed
- Audit log is tamper-evident and exportable

### 3.5 Progressive Automation Control

- CS2 can set per-org or global automation levels from AMC settings
- No automation level change takes effect without explicit CS2 instruction
- All changes are logged and reversible

---

## 4. Governance Authority

| Dimension | Detail |
|---|---|
| **Controlling authority** | CS2 (Johan Ras / @APGI-cmy) |
| **Default mode** | ARC Option C (all triggers require explicit human approval) |
| **Automation relaxation** | Requires explicit CS2 instruction for each step |
| **Audit requirement** | All decisions, quota changes, and setting changes are permanently recorded |

---

## 5. Linked Governance Decisions

- CL-5 CP-5 spec amendment — OQ-001 through OQ-005
- PR APGI-cmy/maturion-isms#725 — AIMC Knowledge Upload Centre Specification
- Issue APGI-cmy/maturion-isms#735 — AMC Rename and Scope Definition (this issue)

---

## 6. Acceptance Criteria

- [ ] All references to "Foreman App" updated to "App Management Centre (AMC)" across all docs, code, UI, and governance artefacts
- [ ] AMC scope document created and linked from CANON_INVENTORY
- [ ] ARC Option C flow implemented and routing to AMC
- [ ] Dynamic quota management implemented and accessible in AMC
- [ ] Alert dashboard live in AMC with all threshold alerts configured
- [ ] Audit trail visible and exportable in AMC
- [ ] Progressive automation setting accessible in AMC settings panel

---

## 7. Activation State

| State | Value |
|---|---|
| **Current state** | GOVERNANCE_DEFINED |
| **Implementation state** | PENDING — subject to dedicated build waves |
| **Scope freeze** | FROZEN as of 2026-03-01 (CS2 authority) |

---

*Authority: CS2 (Johan Ras / @APGI-cmy) — 2026-03-01*
