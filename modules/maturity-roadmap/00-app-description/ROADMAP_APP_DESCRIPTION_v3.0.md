# Maturity Roadmap Module — App Description v3.0

| Field         | Value                                                  |
|---------------|--------------------------------------------------------|
| **Status**    | Draft                                                  |
| **Owner**     | Johan Ras                                              |
| **Date**      | 2026-03-20                                             |
| **Module Role** | Core Governance Engine — All other modules are dependencies of this module |
| **Version**   | 3.0.1-batch1                                           |
| **Supersedes**| ROADMAP_APP_DESCRIPTION_v2.0.md                        |
| **Remediation** | T-MRR-001 Batch 1 — Source fidelity, ambiguity preservation, evidence expansion (Issue #1186) |
| **Interoperability** | MAT, RADAM, PIT, Watchdog, Incident Management, Risk Management |

> *(Inferred Design Recommendation: The "Core Governance Engine" label used in the Module Role field above is not the term used in the source document. The source describes the Maturity Roadmap as the central compliance measurement tool against which all other modules produce evidence. This label is a reasonable editorial inference and is preserved for build clarity, but should be confirmed with the product owner before use in user-facing content.)*

---

## Table of Contents

1. [Purpose and Overview](#1-purpose-and-overview)
2. [Module Position in the ISMS Ecosystem](#2-module-position-in-the-isms-ecosystem)
3. [Pre-Subscription User Journey](#3-pre-subscription-user-journey)
4. [Post-Subscription Maturity Roadmap Workflow](#4-post-subscription-maturity-roadmap-workflow)
   - 4.1 [Part 1: Audit Configuration](#41-part-1-audit-configuration)
   - 4.2 [Part 2: Publication and Live Dashboard](#42-part-2-publication-and-live-dashboard)
   - 4.3 [Part 3: User Registration and Roles](#43-part-3-user-registration-and-roles)
5. [AI Integration and Real-Time Situational Awareness](#5-ai-integration-and-real-time-situational-awareness)
6. [Marketing Opportunities](#6-marketing-opportunities)
7. [Cross-Module References](#7-cross-module-references)
8. [Traceability to v2.0](#8-traceability-to-v20)
9. [Batch 1 Remediation Notes (T-MRR-001, Issue #1186)](#9-batch-1-remediation-notes-t-mrr-001-issue-1186)

---

## 1. Purpose and Overview

The **Maturity Roadmap** is the core module of the ISMS platform. It is represented as one of the module cards on the main landing page, which provides navigation access to all modules in the system. All other modules are designed as dependencies of this module.

In this module, the organisation sets the minimum performance standards it will comply with, structured as an audit tool. The principle is:

1. Minimum performance criteria are defined in a specific format and structure.
2. An evidence upload and connection portal is created to evaluate the organisation's compliance with these criteria across **5 Maturity Levels**.
3. With Maturion AI assistance — including a human-in-the-loop process — evidence is evaluated and a live, continuous score of the operation's maturity level is produced.

The tools designed across the ISMS platform are intended to help implement the evidence required for this module. For example, one criterion that an organisation must meet to reach the _Proactive_ or _Resilient_ maturity level is a structured Risk Management process — hence the Risk Management tool, which generates evidence that can be uploaded to demonstrate compliance with the Maturity Roadmap.

---

## 2. Module Position in the ISMS Ecosystem

| Module | Role Relative to Roadmap |
|---|---|
| **Maturity Roadmap** | Governance Engine — defines standards, criteria, and maturity targets |
| **MAT (Maturity Audit Tool)** | Audit Execution — generates structured audit evidence importable into Roadmap |
| **PIT (Project Implementation Tracker)** | Implementation Engine — receives action plans triggered by Roadmap findings |
| **RADAM** | Automation Layer — feeds automated evidence and integrations into Roadmap |
| **Watchdog** | AI Oversight — monitors AI scoring, overrides, and model drift |
| **Risk Management** | Evidence Source — risk assessment outputs serve as Roadmap evidence |
| **Incident Management** | Evidence Source — incident follow-up and closure records serve as Roadmap evidence |

> **Strategic Position:** The Roadmap is the Governance Brain. MAT is the Audit Execution layer. RADAM is the Automation Layer. PIT is the Implementation Engine. Watchdog provides AI Oversight. ISO 42001 alignment is mandatory.

> **[Inferred Design Recommendation]** The "Governance Brain / Audit Execution / Automation Layer / AI Oversight" framing and the term "Core Governance Engine" in the table above are editorial labels not used verbatim in the source document. The source describes the Maturity Roadmap as the central compliance measurement tool against which all other modules produce evidence. These labels are reasonable design inferences and preserved for build clarity, but should be confirmed with the product owner before use in user-facing content.

---

## 3. Pre-Subscription User Journey

![Pre-Subscription User Journey](./images/pre-subscription-user-journey.png)

> **Image 2 — Pre-Subscription User Journey:** Flowchart showing the pre-subscription user journey. Starting from "Pre-subscription" → "Main landing page" which branches to module cards: Maturity Roadmap (with Journey page), Risk Management, Project Implementation, Data Analytics and Assurance, Skills Development Portal, Incident Management, and Systems Data Extraction Tool. Each module has an explanation/marketing page. The Maturity Roadmap connects to a "Free Assessment". All modules connect to: Subscribe page → Sign-up → Get to know you.

On the ISMS landing page, users encounter a set of **Domain Cards**. Each domain card links to an explanation/marketing page. From that page, some modules — such as the Maturity Roadmap — offer a **practical exercise to entice subscription**. For the Maturity Roadmap, this practical exercise is a **free online assessment**.

### 3.1 Pre-Subscription Flow

```
Free Assessment
    └── Subscribe
            └── Sign-up
                    └── "Get to Know You" (Introduce Yourself)
                                └── Fork into subscribed modules (Module Landing Page)
```

The post-subscription module landing page mirrors the main landing page in layout — it shows all module cards with short tutorial pages. Modules with an active paid subscription are available for navigation. Modules not yet subscribed to link back to their tutorial pages and the **Subscribe → Sign-up → Get to Know You → Module** loop.

> **Note:** If a user subscribes without completing the free assessment, they should be prompted to complete it before beginning audit model configuration, because the free assessment establishes the baseline maturity level that informs all subsequent AI behaviour.

> **[Source Ambiguity]** The source document describes the free online assessment as the practical exercise for the Maturity Roadmap. It is unclear whether other modules will also offer practical exercises in the pre-subscription journey, or what form these would take. This is left open for product-owner confirmation.

---

## 4. Post-Subscription Maturity Roadmap Workflow

![Post-Subscription Maturity Roadmap Workflow](./images/maturity-roadmap-workflow.png)

> **Image 1 — Maturity Roadmap Workflow (Post-Subscription):** Flowchart showing the post-subscription Maturity Roadmap workflow. Starting from "Get to know you" → "Maturity Roadmap", which branches into 5 audit configuration domains: Leadership and Governance, Process Integrity, People & Culture, Protection, and Proof it Works. Each domain drills down to: Mini Performance Standards (MPSs) → Assessment Criteria → Evidence Management.

Clicking on the Maturity Roadmap module card navigates the user to the **audit configuration pages**. This workflow has three main parts:

- [Part 1: Audit Configuration](#41-part-1-audit-configuration)
- [Part 2: Publication and Live Dashboard](#42-part-2-publication-and-live-dashboard)
- [Part 3: User Registration and Roles](#43-part-3-user-registration-and-roles)

---

## 4.1 Part 1: Audit Configuration

### 4.1.1 The Five Audit Domains

The user lands on an **Audit Configuration Page** containing five Audit Domain cards:

| # | Domain |
|---|---|
| 1 | Leadership and Governance |
| 2 | Process Integrity |
| 3 | People and Culture |
| 4 | Protection |
| 5 | Proof it Works |

Each domain card displays summary metrics of its underlying components and is clickable, navigating the user to its underlying pages.

### 4.1.2 Domain Card Content

Each Domain card provides a description covering three areas, all using the **global platform tutorial principle**:

- **Hover** → single-line description
- **Click** → paragraph-level description with references
- **Ask Maturion** → AI-guided explanation with links to the online portal for short courses, certification, and credits toward a security professional qualification

The three content areas are:

1. **Maturity-Level Performance:** What this domain's performance looks like at each of the five maturity levels.
2. **Why This Domain Is Necessary:** Explanation of the domain's strategic importance, using the same level-up tutorial approach.
3. **Current State vs. Target State:** Based on the organisation's current maturity level — what is in place and what still needs to be achieved.

> **Note:** The user enters audit configuration with a **locked-in preliminary maturity level** established by the free assessment. If the user subscribed without completing the free assessment, they should be prompted to complete it before proceeding. The AI must always maintain real-time situational awareness of the organisation's current maturity level, regardless of which module it is operating in.
>
> *Example:* If a user asks, "Why should I implement risk management?", the AI's answer should be contextual: "The only way your organisation can evolve to a Proactive maturity level is through a structured risk management process. You are currently at the Compliant level, so implementing risk management will advance you into the Proactive domain."

### 4.1.3 Domain → MPS Configuration

Clicking a Domain card navigates to the **Mini Performance Standards (MPS)** pages.

**MPS Compilation Requirements:**

- Each domain has a **minimum of 5 MPSs**, compiled with Maturion AI assistance.
- AI-generated MPSs must be:
  - Industry-specific
  - Personalised to the organisation
  - Compliant with international best practices and standards for the domain
  - Reflective of real-time situational awareness (use the organisation's name; reflect a genuine understanding of the business)

**MPS Card Content** (same three-area, level-up tutorial approach as Domain cards):

1. What this MPS's performance looks like at each of the five maturity levels
2. Why this MPS is necessary
3. Current state vs. target state based on the organisation's maturity level

**MPS Editing — AI Proposed Altering Mechanism:**

Each MPS card provides: **Edit**, **Delete**, **Recompile**, and **AI Chat Interface** controls, allowing the user to refine the MPS iteratively until fully satisfied.

> **Definition:** The **AI Proposed Altering Mechanism** refers to the edit/delete/recompile/AI-chat interface available wherever the AI proposes structural audit configuration components. This mechanism must be consistently available at every relevant layer (MPSs, Intent Statements, Assessment Criteria).

### 4.1.4 Three-Tier Approval Process

The approval process applies at the MPS, Intent Statement, and Criteria levels.

#### Level 1 — Initial Approval (User)

- The user approves the component, but the model is **not locked**.
- This confirms the user's agreement with the AI proposal.
- The user may return and make changes, but all changes are recorded in an **audit trail**.
- Available at: MPS level, Intent Statement level, Criteria level.

#### Level 2 — Domain-Level Approval

- Once the user is fully satisfied with all MPSs, Intent Statements, and Criteria within a domain, they submit the **entire domain** for sign-off (dual responsibility / segregation of duties).
- After Level 2 sign-off, the user **cannot alter the domain** without a formal change management process.
- Approval at this level supports **back-and-forth communication**, all tracked in the database as an audit trail.
- The approver may suggest alternatives, which unlocks specific items for the user to revise and resubmit. This loop continues until the domain-level approver is fully satisfied.
- The domain is then locked pending Level 3 final sign-off.

#### Level 3 — Executive Sign-Off

- Once all domains are approved at Level 2, the complete Maturity Audit Roadmap (e.g., "XYZ Company Security Control Standard" or XSCS) is assigned to the highest organisational level for final sign-off.
- The same back-and-forth approval loop is used.
- If the Level 3 approver requests changes, these are referred back down through Levels 2 and 1, undoing any previous locks until the changes are implemented and resubmitted.
- **Final Level 3 sign-off locks the entire Security Control Standard.**
- Final sign-off **triggers an immediate policy implementation action** that is incorporated into the PIT module.

> See [Section 6 — Marketing Opportunities](#6-marketing-opportunities) for the PIT cross-sell trigger that fires at this point.

### 4.1.5 Intent Statements (Layer 2)

Intent Statements are configured **after** MPSs have been configured, following the same AI Proposed Altering Mechanism process.

- An Intent Statement describes **what the user wants to achieve** with the MPS.
- Intent Statements appear as a **collapsible paragraph** directly beneath the MPS, toggled via an "Intent Statement" button.
- Level 1 approval applies.

### 4.1.6 Layered Building Block Model

The audit model is configured in layers, like the building blocks of a house:

| Layer | Component |
|---|---|
| **Layer 1** | Domains and Domain Cards |
| **Layer 2** | MPSs and Intent Statements |
| **Layer 3** | Assessment Criteria |
| **Layer 4** | Maturity Level Descriptors and Level Evaluator |
| **Layer 5** | Evidence Management |
| **Layer 6** | Human Loop (Human Auditor Verification) |

### 4.1.7 UI/UX Requirements

- **Drill-down concept:** The user can see all layers at once or collapse individual layers for focused viewing.
- **Context awareness:** The user always knows their position — "I am in Domain X, MPS X, working on Criteria X."
- **Wireframe navigation diagram:** A collapsible wireframe diagram is displayed at the top of each page, showing the full structure and highlighting the user's current position. This diagram serves as both a navigation aid and an overview tool.
  - The wireframe includes high-level and sub-level diagrams, scaled to fit the page.
  - **Off-page flows** are highlighted using a **portal feature**: clicking a portal navigates to a completely new section; clicking content _within_ the wireframe navigates within the current workflow.
  - The wireframe is collapsible with a single click so that it can be hidden when not needed.
- **Screen detachment:** Pages and features can be detached and dragged to other screens. Even when detached, context must be maintained.
- **Numbered linking:** All components are numerically linked for precise navigation:
  - Domain: `1`
  - MPS: `1.1`
  - Criteria: `1.1.1`
  - Evidence: `1.1.1.1`

### 4.1.8 Assessment Criteria — Layer 3

> **Assessment Criteria is the most vital component of the entire project.**

Each MPS has multiple sets of Assessment Criteria. The type and format of criteria are informed by MPS documents uploaded in the Backoffice, which provide **directional guidance only** — they are not prescriptive. Maturion AI must use this guidance to compile its own industry-specific criteria.

**Assessment Criteria Generation:**

When prompted, the AI generates all Assessment Criteria for an MPS.

**Assessment Criteria Card Features:**

- **Tutorial component:** Hover, click, AI chat, and online portal referral (each portal referral is a marketing opportunity)
- **AI Proposed Altering Mechanism:** Edit, delete, recompile, AI chat interface
- **Sequence number:** Traces the criteria back to its Domain and MPS (e.g., `MPS 3.1`)
- **Summary card:** Shows a summary of what lies beneath — evidence status and the current maturity level for that criterion
- **Level Descriptors and Evidence Management:** These are the underlying layers (explained in Sections 4.1.9 and 4.1.10)
- **"Where you are now" vs. "Where you want to go":** High-level descriptors at Domain, MPS, and Criteria levels showing current state and the requirements for the next level
- **Three-tier approval:** Same process as MPSs (see Section 4.1.4)

### 4.1.9 Maturity Level Descriptors — Layer 4

![Maturity Levels DNA Spiral](./images/maturity-levels-dna-spiral.png)

> **Image 3 — Maturity Levels DNA Spiral:** DNA spiral diagram showing the 5 maturity levels ascending from bottom to top:
> - **Basic** → "Exposed" / "Vulnerable" — Majority of requirements not in place
> - **Reactive** → "Responsive" / "Awareness" — Some requirements in place but lacks consistency and a systematic approach
> - **Compliant** → "Preventative" / "Compliance" — Majority of requirements are in place and managed within a clear framework
> - **Proactive** → "Competent" — Processes are optimised and developed to enable anticipation of and response to future events
> - **Resilient** → "Generative" / "Excellence" — Integration has occurred; security is fully internalised and owned by everyone

For each Assessment Criteria item, the AI provides a description of what the criteria looks like at each of the five maturity levels. The criteria statement itself is a **neutral statement** (e.g., _"There is a policy that governs the way in which XXX is performed."_).

**Standard Level Descriptor Definitions:**

| Level | Title | Description |
|---|---|---|
| 1 | **Basic** | There is no policy in place. |
| 2 | **Reactive** | A policy exists but is not current; it is only updated periodically in response to events. |
| 3 | **Compliant** | A policy is in place, is current, has been signed off, is updated at regular intervals, is properly communicated, and is readily accessible to all stakeholders. |
| 4 | **Proactive** | All Compliant criteria are met; additionally, the policy is updated based on risk assessment findings and incorporates forward-looking criteria. |
| 5 | **Resilient** | Automation is in place: auto-flagging for policy updates, self-managing currency controls, and integration with systems such as an e-learning platform that automates annual policy review by all stakeholders. May be further enhanced with data analytics, automation, and rapid automated self-recovery systems. |

> **Note on Level 5:** The Resilient descriptor is a guide, not a fixed specification. It should be expanded to reflect the specific context of each criterion, including data analytics, automation capabilities, and self-recovery systems where applicable.

**Level Descriptor UI Behaviour:**

- The Level Descriptor section **automatically highlights** the current level at which the specific criterion is rated.
- If the criterion has not yet been evaluated (e.g., following only a free assessment, which focuses up to MPS level), this is clearly indicated.
- Each Level Descriptor card includes a **button linking to the Evidence Management section**.

### 4.1.10 Evidence Management — Layer 5

> **Note:** The Evidence Management system is built during audit configuration but becomes **active only after the model is published** (see Section 4.2).

Evidence Management is where evidence is attached for AI evaluation. Supported evidence types:

- **Uploaded documents** — all file types supported
- **System database linkup** — e.g., Incident Management system for AI verification of incident follow-up and closure
- **PIT or Risk Management platform linkup** — AI evaluates maturity levels based on implementation data
- **Other linkups or uploads** that verify criteria implementation (extensible by design)

> **Important:** Document uploads alone — particularly in a fully paper-driven process — can achieve at most a **Compliant** rating. Higher levels require system integrations and automated evidence.

#### 4.1.10.0 Evidence Classification

Evidence in the Maturity Roadmap is classified along two primary dimensions:

**Upload vs Connected Evidence:**

| Type | Description | Examples |
|---|---|---|
| **Document Evidence (Uploaded)** | Files manually uploaded by users — all file formats supported | Policies, procedures, screenshots, reports, certificates |
| **Live / System-Integrated Evidence** | Direct database linkups or platform integrations that feed evidence automatically | Incident Management linkup, PIT implementation data, Risk Management platform integration |

> **Important:** Higher maturity levels (Proactive, Resilient) require system-integrated evidence. Document-only evidence caps the organisation at the **Compliant** maturity level. This is a core constraint of the evidence model and must be reflected in AI evaluations and user-facing messaging.

**Source Classification:**

Each evidence item carries a source integrity record identifying:
- Who provided the evidence (the uploading or linked user)
- What system or process it originates from
- The date and provenance of the evidence

#### 4.1.10.1 Evidence Acceptance, Query, and Escalation Flow

1. Evidence is uploaded or connected; the AI evaluates it and provides:
   - A **maturity level rating**
   - A **descriptor** explaining why this rating was assigned and what is still outstanding to reach full compliance at this level or advance to the next
2. A **"Re-evaluate Evidence"** prompt allows the AI to be triggered again with updated evidence.
3. The user can **accept** the AI's rating or **query** it.
4. If queried, the matter is escalated to the **next level up** in the user hierarchy (see Section 4.3).

**Next-Level Reviewer Options:**

- Accept the AI rating as proposed
- Accept the AI rating with comments or additional requirements
- Deny the rating with a reason
- Refer to an **independent external auditor** (with a notice that this incurs costs)

**Audit Trail and Override Logging:**

- All decisions — accept, query, deny, override — are **logged in the database** with reason codes and the identity of the deciding user.
- AI may be overridden by a human reviewer, but **all human overrides are logged** and made available to the Maturion AI for continuous self-learning. This is the core Maturion self-learning mechanism: human judgements feed back into model improvement over time.

#### 4.1.10.2 Non-Acceptance Categories

| Category | Description | Resolution |
|---|---|---|
| **Evidence sufficient — disagree with AI** | The user believes the evidence supports a higher rating. | AI may be overridden, but the override must be escalated and resolved at a higher level. All overrides and reasons are tracked for Maturion self-learning. |
| **Evidence insufficient — unable to comply** | Compliance is delayed due to budget, resource, or skills constraints. | Due dates are postponed and the open item is tracked in the PIT as an implementation task. |
| **Criteria not relevant** | The user believes the criterion does not apply to the organisation. | A formal request for criteria removal or modification is raised, following the standard three-tier approval process. |

**Evidence Relevance Review:** If a specific piece of evidence is deemed entirely "not relevant" to the criterion it was submitted against — as distinct from the organisation claiming the *criterion itself* does not apply — it may be removed from the criterion record. This decision is logged in the audit trail with the reason and the identity of the reviewing user. Note: removal of evidence does not require the three-tier approval process; removal of a *criterion* (see "Criteria not relevant" row above) does.

#### 4.1.10.3 Evidence Freshness and Staleness

Evidence has a temporal validity dimension that must be tracked by the system:

- Each evidence item has an **effective date** (the date the evidence was produced or became valid) and a **review frequency** (how often it must be refreshed or re-confirmed).
- Evidence that has passed its review date is flagged as **stale** in the system.
- Stale evidence **may reduce a maturity rating** if the underlying criterion expires — the AI must factor evidence currency into its evaluation.

**Re-evaluation Workflow:**

1. The system notifies the responsible user that evidence is approaching or has passed its review date.
2. The user either **re-uploads updated evidence** or **confirms the existing evidence remains current**.
3. The AI **re-evaluates** the evidence against the criterion.
4. The maturity rating is **updated** based on the re-evaluation outcome.

> **Note:** The "Re-evaluate Evidence" prompt (see Section 4.1.10.1) is also the mechanism for re-evaluation following a staleness notification.

#### 4.1.10.4 Evidence Traceability and Audit Trail

Every evidence decision is recorded in the database to ensure full traceability:

- Each evidence item is linked to: the specific criterion it was submitted against, the user who uploaded or approved it, the date and time of each decision, and the reason code for any non-acceptance or override.
- Human overrides are **specifically flagged** in the audit trail and made available to the Maturion AI for continuous learning (see Section 4.1.10.1).
- The full evidence history — including superseded evidence, re-evaluations, and escalation chains — is retained and queryable.

> **[Suggested Enhancement]** Evidence provenance and tamper-evident handling: the source document suggests audit-grade evidence integrity but does not mandate specific technical mechanisms (e.g., cryptographic hashing, timestamping, immutable storage). These are suggested implementation enhancements for build consideration, particularly for organisations requiring defensible evidence at the Proactive or Resilient maturity levels.

#### 4.1.10.5 Budget, Resource, and Skills Constraints

When a user cannot comply with a criterion due to budget, resource, or skills limitations, the system handles this as a structured open item:

- The compliance item is tracked as an **open implementation task** in the PIT module.
- The **due date is postponed** with a formal reason recorded in the system.
- The constraint type is classified as one of: **Budget**, **Resource**, or **Skills** — and this classification is stored against the open item.
- The **review frequency** for these constrained items should be configurable in the system, so that they are periodically re-assessed and do not become permanently deferred without deliberate action.

#### 4.1.10.6 Independent Auditor Process

- Independent auditor requests must be **budgeted for** by the company and are escalatable within the department based on internal approval.
- The request is forwarded to the **APGI Independent Audit Coordinator** (currently Jorrie Jordaan; contact managed via a configurable role-based address in the platform — do not hard-code an individual's email address in the system), who assigns an auditor from APGI's auditor panel based on experience and background.
- The entire engagement occurs within the platform:
  1. The independent auditor is **invited** and provided user rights scoped to the relevant criteria sections.
  2. The auditor **registers as a user** — registration expires automatically upon submission of findings.
  3. The auditor accesses the Evidence Management section, reviews the evidence, and renders findings and a resolution.
  4. The auditor may **override** or **support** the AI decision.
  5. If the user remains unsatisfied, they may pursue one of the other resolution routes.

> **Best Practice Note:** Evidence management should align with international best practices for audit evidence, including ISO 19011 (guidelines for auditing management systems) and ISO/IEC 27001 Annex A controls for evidence of control implementation.

---

## 4.2 Part 2: Publication and Live Dashboard

### 4.2.1 Publication

After all domains have been configured and approved through the three-tier approval process, the **Maturity Audit Roadmap is ready for publication**.

> **Celebration Moment:** Publication is a significant milestone and should be marked with a celebration feature — for example, party images and firecracker animations. This can be deferred to a future version but should be planned for in the UI.

Upon publication:

- The platform becomes **live and operational**.
- Users begin actively managing their maturity development process.
- Evidence Management becomes **active** across all criteria.
- An action is triggered to incorporate findings into the **PIT module**.

### 4.2.2 Live Dashboard — "Your Operational Maturity House"

![Operational Maturity House Dashboard](./images/operational-maturity-house-dashboard.png)

> **Image 4 — Operational Maturity House Dashboard:** Dashboard mockup titled "Your Operational Maturity House". Shows a house structure with: Leadership & Governance as the roof (green triangle), Process Integrity, People & Culture, and Protection as the walls (coloured blocks), and Proof it Works as the foundation (red bar). An overall maturity badge is displayed at the top. Left panel: "Current State" description. Right panel: "Working on..." description showing the next target level. Below the house: five domain-level indicators (each showing their respective maturity level) with progress sliders.

The Live Dashboard visualises the organisation's Maturity Roadmap using a **house structure**:

| Position | Domain |
|---|---|
| **Roof** | Leadership & Governance |
| **Left Wall** | Process Integrity |
| **Centre Wall** | People & Culture |
| **Right Wall** | Protection |
| **Foundation** | Proof it Works |

**Dashboard Layout:**

- **Left panel:** "Current State" — description of the organisation's current maturity position
- **Right panel:** "Working On..." — description of the next target level and what needs to be achieved
- **Overall maturity level indicator** below the house structure, averaging out the five domain scores
- **Individual domain level indicators** — each domain may be at a different maturity level

### 4.2.3 Dashboard Drill-Down

| Level | Content |
|---|---|
| **First Level** | The 5 domains with the percentage of underlying MPSs at 100% compliance. "What has been achieved" and "what still needs to be achieved" per domain. |
| **Second Level** | MPSs per domain with the number of criteria feeding into each MPS that are at 100% compliance (based on evidence-level evaluations). "What has been achieved" and "what still needs to be achieved" per MPS. |
| **Third Level** | Criteria per MPS with a compliance percentage per criterion. "What has been achieved" and "what still needs to be achieved" per criterion. |

> **Note:** A full understanding of the dashboard scoring requires comprehension of how the maturity scoring system works. See dedicated scoring documentation (to be uploaded separately).

### 4.2.4 Company Hierarchy Filtering

The dashboard displays **overall company maturity** by default, with the ability to filter and drill down by organisational hierarchy:

- Sections and subsections
- Subsidiaries
- Operations

Each level in the hierarchy has its own dashboard view, selectable via the filter. Multiple operations can be combined in a filtered view for comparison.

### 4.2.5 Live Achievement Feed — "Wow Factor"

The achievement feed is designed for **company-wide visibility** — intended to be displayed on screens throughout the organisation so that anyone can see the current maturity roadmap status at any given time.

**Criteria Achievement:**

Each time a maturity level is reached for a criterion, it is **highlighted** with a short explanation:
> _"Evidence was recently uploaded to demonstrate progress in this area. Previously the organisation was performing this function in this way [previous description], but we have now advanced to Maturity Level X because we have been able to demonstrate [new evidence description]."_

- A **rolling list of the last 5 achievements** is displayed.
- Each achievement shows the **date it was flagged**.
- A **work-rate graph** shows the number of achievements over time.

**MPS and Domain Achievement:**

When an MPS is fully achieved, it is flagged in the same manner. When a Domain is fully achieved, it is similarly flagged and celebrated.

**Company Level-Up — Major Celebration:**

When the company advances an overall maturity level, the dashboard displays a **major achievement announcement**:

- The **date and time** of the level advancement is captured.
- A dedicated section **celebrates the individuals** who contributed, naming:
  - Domain Owners
  - MPS Owners
  - Criteria Evidence Managers
- Example announcement:
  > _"XYZ Company has now officially reached [Level] of maturity in its journey towards resilience. We congratulate the following people for their contribution in making this possible: [names and roles]."_

---

## 4.3 Part 3: User Registration and Roles

> **[Source Ambiguity]** The source document uses the terms "implementation users" and "build users" somewhat interchangeably when describing who manages audit configuration. Final product role naming should be confirmed with the product owner.

### 4.3.1 User Onboarding Model

- The **original user** signs up after subscription.
- All subsequent users are **invited** by an existing user already in the system.
- Invitations are **role-specific**: each invite is accompanied by a radio checklist that invites the new user to become the owner of specific areas.

> **[Source Ambiguity]** The source document suggests the main user may invite "other organisations" to the platform. It is unclear whether this refers to external third-party organisations, subsidiary companies, or internal organisational substructures. This requires confirmation before user hierarchy implementation.

### 4.3.2 User Hierarchy

| Level | Role | Invitation Rights | Assigned By |
|---|---|---|---|
| **Main User** | Platform owner / implementation lead | Invites domain-level users | Subscription sign-up |
| **Domain User** | Owns one or more audit domains | Invites MPS-level users | Main user |
| **MPS User** | Owns one or more MPSs within a domain | Assigns evidence managers | Domain user |
| **Evidence Manager** | Manages evidence for assigned criteria | — | MPS user |

**Domain User Invitation Flow:**

When a Domain User invites MPS-level users, the invite modal lists all MPSs for that domain, with a multi-select control. The new user's write permissions are automatically scoped to the selected MPSs upon sign-up.

### 4.3.3 Access Rights Model

| User Type | Read Rights | Write Rights |
|---|---|---|
| All signed-up users | Entire model | Assigned areas only |
| Approvers (invited for sign-off) | Entire model (read-only) | Approval workflow interface only |

### 4.3.4 Approval and Escalation

- Approval **always escalates one level up** in the hierarchy.
- If the approver is not yet a user (e.g., an EXCO member being invited for final sign-off), the approver is **invited with their designation** specified.
- Approvers receive:
  - Read access to the entire model
  - Access to the approval workflow interface (reject, recommend changes, accept)

---

## 5. AI Integration and Real-Time Situational Awareness

Maturion AI must maintain **constant real-time situational awareness** across all modules. Key requirements:

- The organisation's **current maturity level** must always be accessible to the AI, regardless of which module it is operating in.
- AI-generated content (MPSs, Intent Statements, Assessment Criteria, Level Descriptors) must be:
  - **Industry-specific**
  - **Personalised** to the organisation (using the organisation's name and reflecting genuine business understanding)
  - **Aligned with international best practices**
- **AI confidence scoring** is mandatory on all AI-generated ratings and evaluations.
- **Override tracking** is mandatory: all AI overrides, with reasons, must be recorded and made available for Maturion self-learning.
- **Model version tracking** is mandatory.
- **AI must be integrated with Watchdog** for AI oversight and **ISO 42001** alignment. ISO 42001 is the international standard for AI Management Systems; key requirements relevant to this module include: establishing AI risk management processes, maintaining records of AI decision-making and overrides, ensuring human oversight mechanisms (the human-in-the-loop approval process), and conducting regular reviews of AI model performance and bias. See Watchdog module documentation for the specific control mapping.

> **[Inferred Design Recommendation]** The requirements for "AI confidence scoring" and "model version tracking" as mandatory fields are implementation inferences drawn from best-practice AI governance (ISO 42001 alignment). The source document does not prescribe these specific technical mechanisms. They are included as design recommendations for build consideration.

> **[Suggested Enhancement]** Transcript anchor / metadata structures for AI-generated content are a suggested implementation enhancement not directly stated in the source. The source implies AI-generated content should be traceable; specific metadata architecture is an engineering inference.

> **[Source Note — Open for AI Proposals]** The source document explicitly invites AI suggestions for improvement in several areas. Some AI governance requirements in this section are conceptual and remain open to refinement through the build process.

---

## 6. Marketing Opportunities

The platform continuously creates **"wow moments"** that can be used as marketing trigger points. These triggers are pushed to the future Marketing App for automated outreach.

| Trigger Point | Opportunity |
|---|---|
| **Level 3 (Executive) sign-off of the Security Control Standard** | Cross-sell the PIT module (implementation tracking). Cross-sell the Policy & Procedure Development tool (for international standard compliance). Redirect to the PIT landing page card if not yet subscribed. |
| **Evidence portal referrals** (tutorial component links) | Cross-sell online courses, certifications, and credits toward a security professional qualification on the Maturion online portal. |
| **Publication of the Maturity Roadmap** | Trigger awareness of automation capabilities via RADAM. |

> **Note on PIT Cross-Sell:** Not subscribing to the PIT limits the organisation's ability to reach full operational resilience — specifically because automation (a key component of the _Resilient_ level) is best tracked and evidenced through the PIT. Using the Policy/Procedure Development tool ensures international best practice compliance. These benefits should be clearly communicated in the marketing trigger.

> **Future Integration:** The Marketing App (not part of the ISMS) will receive these event triggers for automated outreach campaigns.

---

## 7. Cross-Module References

| Reference | Module | Integration Point |
|---|---|---|
| **PIT** | Project Implementation Tracker | Receives implementation action plans triggered by Roadmap sign-off; tracks evidence insufficiency items; provides automated evidence linkup |
| **MAT** | Maturity Audit Tool | Structured audit imports into Roadmap; preserves evidence metadata, AI scoring, confidence scores, human overrides, and transcript anchors |
| **RADAM** | Automation Layer | Feeds automated evidence; future integration for Resilient-level automation validation |
| **Watchdog** | AI Oversight | Monitors AI scoring, override rates, and model drift; ISO 42001 alignment |
| **Incident Management** | Incident Tracking | Database linkup for AI verification of incident follow-up and closure records as evidence |
| **Risk Management** | Risk Platform | Database linkup for AI evaluation of risk management maturity as evidence |

---

## 8. Traceability to v2.0

The following table maps sections of this v3.0 document to their corresponding sections in `ROADMAP_APP_DESCRIPTION_v2.0.md`:

| v2.0 Section | v2.0 Title | v3.0 Section | Notes |
|---|---|---|---|
| §1 | Purpose | §1 | Significantly expanded; now includes the dependency model and evidence philosophy |
| §2 | Structural Model (Mandatory) | §4.1.6 | Layered Building Block Model; numbering conventions preserved |
| §3 | Criteria Creation Modes | §4.1.8 | AI-generated criteria expanded; Backoffice guidance model explained |
| §4 | Evidence Model | §4.1.10 | Evidence types expanded; approval and sign-off process added; independent auditor workflow added |
| §5 | Maturity Model (Shared Engine) | §4.1.9 | Five levels preserved; Level Descriptor definitions added; DNA spiral image added |
| §6 | Governance & Approval | §4.1.4 | Three-tier approval expanded with full loop descriptions and audit trail requirements |
| §7 | MAT Integration | §7 | Cross-Module References table |
| §8 | PIT Integration Hooks | §7, §6 | PIT integration in cross-references and marketing opportunities |
| §9 | AI Governance | §5 | AI Integration and Real-Time Situational Awareness section |
| §10 | Strategic Position | §2 | Module Position in the ISMS Ecosystem table |
| _(new)_ | Pre-Subscription Journey | §3 | Added from word_upload.md source |
| _(new)_ | Audit Configuration Domains | §4.1.1–4.1.3 | Domain cards, MPS configuration, UI/UX requirements |
| _(new)_ | Intent Statements | §4.1.5 | New in v3.0 |
| _(new)_ | Publication & Dashboard | §4.2 | Live dashboard, achievement feed, hierarchy filtering |
| _(new)_ | User Registration & Roles | §4.3 | User hierarchy and access rights model |
| _(new)_ | Marketing Opportunities | §6 | Cross-sell trigger points |

---

## 9. Batch 1 Remediation Notes (T-MRR-001, Issue #1186)

The following changes were made in this batch as part of the source-fidelity remediation:

| Change | Section | Description |
|--------|---------|-------------|
| Source labeling | Throughout | Inferred/enhanced content labeled with [Inferred Design Recommendation], [Suggested Enhancement], or [Source Note — Open for AI Proposals] tags |
| Ambiguity preservation | §3, §4.3, §5 | Source ambiguities around "implementation users"/"build users", "other organisations" phrasing, and open conceptual areas annotated with [Source Ambiguity] notes |
| Evidence section expansion | §4.1.10 | Evidence governance model expanded with: classification (4.1.10.0), freshness/staleness (4.1.10.3), traceability and audit trail (4.1.10.4), budget/skills constraints (4.1.10.5); Independent Auditor Process renumbered to 4.1.10.6 |
| Module role label | §2 | "Core Governance Engine" label annotated as Inferred Design Recommendation (header footer note and Section 2) |
| AI section labels | §5 | AI confidence scoring and model version tracking labeled as Inferred Design Recommendations; transcript anchors labeled as Suggested Enhancement; open AI proposal areas annotated |

---

*End of Document — ROADMAP_APP_DESCRIPTION_v3.0.md (v3.0.1-batch1)*
*Supersedes: ROADMAP_APP_DESCRIPTION_v2.0.md*
*Source: modules/maturity-roadmap/word_upload.md (commit 3541ea8)*
