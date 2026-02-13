# Risk Assessment – True North Architecture v0.1

## 1. Purpose
Define the full, end-to-end architecture for Security Risk Assessment according to the SRMF, ISO 31000 and NIST SP 800-30, incorporating Foreman build philosophy, QA, wiring, and integration with Threat, Vulnerability, Controls, ERM, PIT, and Maturity Roadmap.

This document reflects a **fully deployed and working system**, including backend, frontend, workflows, AI logic, and data structures.

---

# 2. Core RA Concept
Risk Assessment =  
**Threats** + **Vulnerabilities** → **Unwanted Events** → **Assessment** → **Quantification** → **Control Evaluation** → **Residual Risk** → **Reporting/Workflow**

No human guesswork; all probability and impact calculations use:
- NIST adversarial & non-adversarial scales  
- Dynamic data from incidents, intelligence, public domain data, and internal analytics  
- Quantification (ALE/Risk Value)  
- Control availability, performance, and maturity (remote assurance)

---

# 3. High-Level Workflow

1. **Select RA Scope**  
   - Select organisational node (company → division → mine → zone → process → component).
   - Select RA type:
     - Baseline (WRAC)
     - Issue-based (Bowtie)
     - Combined

2. **Import/Generate Threats**
   - From Threat module

3. **Import/Generate Vulnerabilities**
   - From Vulnerability module

4. **Generate Unwanted Events**  
   Automated many-to-many matching:
   - Threat X can exploit Vulnerability Y  
   - Construct descriptive statements

5. **Assess Unwanted Events**  
   Per NIST:
   - Relevance of TTP  
   - Likelihood of initiation (adversarial)  
   - Likelihood of occurrence (non-adversarial)  
   - Likelihood of adverse impacts  
   All auto-mapped to ERM likelihood scale.

6. **Quantify the Risk (Optional but recommended)**  
   - Select asset class  
   - Assign asset value  
   - Exposure rate  
   - Annual rate of occurrence  
   - Calculate ALE = SLE × ARO  
   - Map ALE → ERM impact scale

7. **Identify Existing Controls**  
   - From Control Library  
   - Manual additions  
   - AI-proposed controls based on risk type

8. **Evaluate Control Effectiveness**  
   - 3×5 design vs implementation  
   - Control efficacy % (0–90%)  
   - Remote assurance feeds availability & performance into efficacy

9. **Residual Risk Calculation**  
   - New L and I (lowered by control effectiveness)  
   - Residual heatmap cell  
10. **Appetite Check**  
    - Compare with ERM appetite thresholds  
    - Auto-flag above-appetite risks

11. **Propose Additional Controls**  
    - AI uses control hierarchy (Eliminate → Substitute → Engineer → Admin → PPE)  
    - Projected risk if applied  
    - Export to PIT

12. **Approval Workflow**  
    - Custodians approve  
    - Risk Owner approves  
    - Escalation rules apply if above appetite  

13. **Reporting**  
    - Full RA report export (PDF/HTML)  
    - RA dashboard  
    - Heatmap  
    - Control performance view  
    - Contribution of each threat/vulnerability pair  

---

# 4. Core Modules inside RA

### 4.1 Unwanted Event Generator  
- Many-to-many mapping engine  
- NLP to construct sentences  
- Auto-reject meaningless pairs  
- Audit trail of all generated relations

### 4.2 NIST Scoring Engine  
- Built-in adversarial & non-adversarial scales  
- Numerical mapping → ERM scales  
- Supports dynamic recalibration

### 4.3 Quantification Engine  
- ALE formula  
- Exposure selector  
- ARO selector  
- Currency-aware  
- Maps value → impact level

### 4.4 Control Environment Engine  
- Uses control hierarchy  
- Control library  
- Control evaluation matrix  
- Control efficacy (0–90%)  
- Remote assurance integration

### 4.5 Risk Calculation Engine  
- Inherent risk computation  
- Residual risk computation  
- Projected risk after proposed controls

### 4.6 ERM Integration  
- Uses fully custom likelihood & impact scales  
- Uses heatmap config  
- Uses appetite thresholds  
- Uses governance rules

### 4.7 PIT Exporter  
- Creates PIT project  
- Links milestones/deliverables/tasks  
- Sync status back into RA

---

# 5. Dynamic Components (AI/Analytics)

### 5.1 Real-Time Threat Drift  
- Intelligence & incidents update TTP relevance  
- Adjusts likelihood input automatically

### 5.2 Vulnerability Drift  
- Process changes  
- New equipment  
- Maintenance failures  
- Adjust severity

### 5.3 Control Performance Drift  
- Remote assurance feeds availability (%)  
- Updates control effectiveness % live

### 5.4 Risk Dashboard  
- Live risk picture based on:
  - controls  
  - threats  
  - vulnerabilities  
  - incidents  
  - intelligence  
  - PIT completion  

---

# 6. Architecture Layers

### Backend
- Supabase (PostgreSQL + Edge Functions)
- Node edge functions for calculations
- Background jobs for recalculations
- AI orchestration (OpenAI, etc.)

### Frontend
- React + Tailwind  
- Component library  
- Dynamic graphs  
- Heatmap renderer  

### Integrations
- ERM module  
- PIT module  
- Incident & Intelligence  
- Remote Assurance  
- Maturity Roadmap  

---

# 7. QA Requirements (Foreman)

Foreman checks:

- All fields required by RA are captured  
- All engines wired  
- All organisational levels respected  
- All ERM integrations active  
- All calculations match specification  
- All workflows (approvals, escalations) operate  
- Control values restricted (max 90%)  
- PIT export works  
- Reporting module fully functional  

---

# 8. Success Criteria
A risk assessment must:

- Respond dynamically to changes
- Be complete (all threats × all vulnerabilities tested)
- Be objective and data-driven
- Provide quantification and ROI
- Integrate fully with controls and PIT
- Produce predictable ERM-aligned results
