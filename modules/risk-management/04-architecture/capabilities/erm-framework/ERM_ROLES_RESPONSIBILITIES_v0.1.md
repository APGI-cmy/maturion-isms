# ERM Roles & Responsibilities v0.1

## 1. Purpose

Clarify who does what in the Enterprise Risk Management (ERM) process, including the Security Risk Management Framework (SRMF), to ensure accountability, proper approvals, and effective governance.

---

## 2. Core Roles

### 2.1 Board / Group Executive

- Approves ERM policy and framework.
- Sets overall risk appetite.
- Reviews top enterprise risks.
- Ensures ERM is integrated into strategy and performance.

### 2.2 EXCO / Company Executive

- Owns company-level ERM profile.
- Approves:
  - ERM Global Settings.
  - Heatmap.
  - Scales.
  - Appetite thresholds.
- Approves high/critical risks that exceed appetite.
- Reviews consolidated risk reports.

### 2.3 ERM Manager / Risk Governance Lead

- Administers ERM configurations.
- Maintains ERM settings for:
  - Likelihood scales
  - Impact scales
  - Heatmap
  - Appetite
  - Risk matrix
- Facilitates alignment between Security, Safety, Operational and other RM domains.
- Ensures training and awareness on risk processes.
- Oversees quality of risk assessments.

### 2.4 Security Risk Manager

- Owns Security Risk Management domain.
- Ensures Security risks are assessed using ERM model.
- Oversees:
  - Threat assessments
  - Vulnerability assessments
  - Risk assessments at process/facility/zone levels.
- Ensures control environment and dynamic updates (remote assurance).

### 2.5 Risk Owner

- The accountable person for risk in a specific domain/area/node in the hierarchy.
- Approves:
  - Risk description and scope.
  - Assessment results.
  - Mitigation plans.
  - Acceptance or escalation decisions.
- Ensures implementation of assigned controls.

### 2.6 Risk Custodian / Team

- Group of people responsible for:
  - Participating in risk assessments.
  - Providing subject-matter expertise.
  - Proposing or reviewing controls.
- For Security, this includes:
  - Security SMEs
  - Plant/Process SMEs
  - HR, Legal, Finance, etc., as needed.

### 2.7 Control Owner

- Responsible for design, implementation, and performance of specific controls.
- Ensures control is:
  - Implemented as designed.
  - Monitored regularly.
  - Improved when weaknesses are detected.

### 2.8 ERM System Administrator

- Manages user access, roles and permissions.
- Maintains hierarchy data.
- Configures AI-assisted features.
- Manages ERM exports and backups.

---

## 3. Hierarchy Node Responsibilities

Each **hierarchy node** (e.g. Group, Company, Mine, Plant, Zone, Process, Component Interface) must have:

- A designated **Risk Owner**.
- Optionally a **Custodian Team**.

They are responsible for:

- Reviewing and approving risks associated with that node.
- Ensuring mitigation plans are realistic and implemented.
- Monitoring residual risk over time.

---

## 4. Parent / Child / Sibling Creation Governance

### 4.1 Add Child

- Allowed by node Risk Owner or higher with appropriate permission.
- No external approval required (within company policy limits).

### 4.2 Add Sibling

- Allowed if user has “Modify Peer” permission at that level.
- Otherwise, request is sent to parent node Risk Owner for approval.

### 4.3 Add Parent

- Always requires approval from the proposed parent-level Risk Owner.

All changes are logged with:

- User ID
- Timestamp
- Before/after state
- Approval chain

---

## 5. Conflict Resolution

When conflicts occur (e.g. overlapping responsibilities, hierarchy changes that affect risk rollup):

- ERM Manager coordinates discussion between affected Risk Owners.
- Changes must be aligned and approved before activation.
- The system may temporarily lock certain modifications until resolution.

---

## 6. Training & Competence

- ERM Manager is responsible for ensuring training materials exist.
- Security RM will contribute domain-specific training (threat models, vulnerabilities, control environment, insider threat).
- Risk Owners and Custodians must be trained before they can approve assessments.

