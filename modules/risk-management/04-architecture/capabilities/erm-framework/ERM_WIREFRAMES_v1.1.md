ERM_WIREFRAMES_v1.1.md

Enterprise Risk Management — UI Wireframes (ASCII Layouts)
Version 1.1
Aligned with:

ERM_TRUE_NORTH_v1.0.md

ERM_DATABASE_SCHEMA_v1.1.md

ERM_EDGE_FUNCTIONS_v1.1.md

ERM_FRONTEND_COMPONENT_MAP_v1.1.md

These wireframes define the visual and interaction blueprint for the ERM module.
They are technology-agnostic but assume the Maturion design language: minimalistic, high signal, low noise.

0. GENERAL LAYOUT PATTERN

All ERM pages follow the standard ISMS shell:

+----------------------------------------------------------------------------------+
| TOP NAV: [Maturion Logo] | [ISMS] [Risk Mgmt] [PIT] [WRAC] [ERM]* [More...] [User]|
+----------------------------------------------------------------------------------+
| LEFT NAV (ERM)           | MAIN CONTENT                                         |
|--------------------------+------------------------------------------------------|
| > Dashboard              | [Page-specific content]                              |
|   Profiles               |                                                      |
|   Scales                 |                                                      |
|   Heatmap                |                                                      |
|   Appetite               |                                                      |
|   Hierarchy              |                                                      |
|   Approvals              |                                                      |
|   Audit                  |                                                      |
|   Compare                |                                                      |
+--------------------------+------------------------------------------------------+


The ERM Profile Selector sits near the top of most pages, just under the header.

1. ERM DASHBOARD
1.1 /erm/dashboard

Purpose: High-level ERM governance overview for the selected organisation.

+----------------------------------------------------------------------------------+
| [ERM] Dashboard                                          [Org Selector v]        |
+----------------------------------------------------------------------------------+
| ERM Profile: [Active Profile v]     Status: [Published]  Version: [v1.3]         |
| [View Profile] [Compare Profiles] [Export]                                      |
+----------------------------------------------------------------------------------+
| [Card] Active Profile Summary     | [Card] Appetite Summary                     |
|-----------------------------------+---------------------------------------------|
| - Created: 2024-01-10             | - Domains: Safety, Security, Financial...   |
| - Created by: Risk Admin          | - Appetite: Security = High, Safety = Low   |
| - Linked Orgs: 5                  | - #Risks above appetite: 12 (link)          |
+----------------------------------------------------------------------------------+
| [Card] Integration Status         | [Card] Pending Actions                      |
|-----------------------------------+---------------------------------------------|
| - RA Engine: ✔                    | - Profiles pending approval: 1              |
| - WRAC: ✔                         | - Appetite anomalies to review: 3           |
| - PIT: ✔                          | - Overrides requiring parent signoff: 2     |
| - Bowtie: ✔                       |                                             |
+----------------------------------------------------------------------------------+
| [Heatmap Snapshot]                                                   [View full]|
|                                                                              v  |
|   Simple mini heatmap preview using active profile.                             |
+----------------------------------------------------------------------------------+

2. PROFILES LIST & CREATE
2.1 /erm/profiles/list
+----------------------------------------------------------------------------------+
| ERM Profiles for: [Org Selector v]                       [ + New ERM Profile ]   |
+----------------------------------------------------------------------------------+
| Filter: [Status v] [Version Range v] [Search by note/name ...............] [🔍] |
+----------------------------------------------------------------------------------+
| Version | Status         | Created By   | Published At     | Active | Actions    |
|---------+----------------+--------------+------------------+--------+------------|
| v1.3    | Published      | J. Ras       | 2024-02-01 09:10 |  ✔     | [View]     |
| v1.2    | Archived       | J. Ras       | 2023-11-01       |        | [View]     |
| v1.1    | Approved       | M. Smith     | -                |        | [View/Edit]|
| v1.0    | Draft          | M. Smith     | -                |        | [Edit]     |
+----------------------------------------------------------------------------------+

2.2 /erm/profiles/create
+----------------------------------------------------------------------------------+
| Create New ERM Profile                                                           |
+----------------------------------------------------------------------------------+
| Organisation: [Org Selector v]                                                   |
| Version:      [Major: 1] . [Minor: 4]                                           |
| Notes:        [___________________________________________________________]      |
|                                                                                |
| [ ] Clone from existing profile  [Profile Selector v]                            |
+----------------------------------------------------------------------------------+
| [Cancel]                                                   [ Create Profile ]    |
+----------------------------------------------------------------------------------+

3. PROFILE VIEW / EDIT
3.1 /erm/profiles/view/:profile_id
+----------------------------------------------------------------------------------+
| ERM Profile: v1.3                    Status: [Published Badge]                   |
| [Back to Profiles] [Compare] [Export Bundle]                                     |
+----------------------------------------------------------------------------------+
| [Profile Summary Card]           [Lifecycle / Status Card]                       |
|---------------------------------+-----------------------------------------------|
| Org:   APGI Group               | Timeline:                                     |
| Created by: J. Ras              |  - Draft → 2023-10-12                         |
| Created at: 2023-10-12          |  - Approved → 2023-11-05                      |
| Active:  Yes                    |  - Published → 2023-11-10                     |
+----------------------------------------------------------------------------------+
| Quick Navigation: [Scales] [Heatmap] [Appetite] [Hierarchy] [Approvals] [Audit] |
+----------------------------------------------------------------------------------+
| Heatmap mini preview (non-editable if Published)                                 |
| Appetite summary per domain                                                      |
+----------------------------------------------------------------------------------+

3.2 /erm/profiles/edit/:profile_id (Draft)

Wizard pattern:

+----------------------------------------------------------------------------------+
| Editing ERM Profile v1.4  [Status: Draft]     [Save Draft] [Submit for Approval] |
+----------------------------------------------------------------------------------+
| Steps: [1 Likelihood] - [2 Impact] - [3 Heatmap] - [4 Appetite] - [5 Hierarchy] |
|        [6 Approvals] - [7 Publish]                                               |
+----------------------------------------------------------------------------------+
| [Active Step Content... (see next sections)]                                     |
+----------------------------------------------------------------------------------+

4. LIKELIHOOD SCALE EDITOR
4.1 /erm/scales/likelihood/:profile_id
+----------------------------------------------------------------------------------+
| Likelihood Scale — Profile v1.4                 [Status: Draft]                  |
| [Back to Profile] [Save Changes] [AI Suggest Scale]                              |
+----------------------------------------------------------------------------------+
| Levels:                                                                           |
|----------------------------------------------------------------------------------|
| Level | Score | Descriptor     | Colour  | Guidance               | Actions      |
|-------+-------+----------------+---------+------------------------+--------------|
|   1   | 0.1   | Rare           | [□]     | [View/Edit]            | [🖉] [✖]     |
|   2   | 0.5   | Unlikely       | [□]     | [View/Edit]            | [🖉] [✖]     |
|   3   | 1.0   | Possible       | [□]     | [View/Edit]            | [🖉] [✖]     |
|   4   | 2.0   | Likely         | [□]     | [View/Edit]            | [🖉] [✖]     |
|   5   | 3.0   | Almost certain | [□]     | [View/Edit]            | [🖉] [✖]     |
+----------------------------------------------------------------------------------+
| [ + Add Level ]                    [Drag handle ▤] to reorder                     |
+----------------------------------------------------------------------------------+
| Right panel:                                                                   |
|   - Inline preview of scale (1 → 5)                                             |
|   - Validation messages (no duplicates, contiguous levels)                     |
+----------------------------------------------------------------------------------+
| [AI Suggest Scale] → opens modal:                                              |
|   "Use historical incidents to propose a refined likelihood scale?" [Run]      |
+----------------------------------------------------------------------------------+

5. IMPACT SCALE EDITOR
5.1 /erm/scales/impact/:profile_id

Tabbed per domain:

+----------------------------------------------------------------------------------+
| Impact Scales — Profile v1.4                  [Status: Draft]                    |
| [Back to Profile] [Save Changes] [AI Suggest Scales]                             |
+----------------------------------------------------------------------------------+
| Domains: [ Safety ] [ Security ] [ Environmental ] [ Operational ] [ Financial ]|
|          [ Reputation ]                                                          |
+----------------------------------------------------------------------------------+
| (Example: Financial Tab)                                                         |
| Levels:                                                                          |
|----------------------------------------------------------------------------------|
| Level | Score   | Descriptor        | Financial Threshold   | Colour | Actions   |
|-------+---------+-------------------+-----------------------+--------+-----------|
| 1     | 100000  | Minor loss        | <= 100k               | [□]    | [🖉] [✖]  |
| 2     | 500000  | Moderate loss     | 100k–500k             | [□]    | [🖉] [✖]  |
| 3     | 2000000 | Major loss        | 500k–2m               | [□]    | [🖉] [✖]  |
| 4     | 5000000 | Severe loss       | 2m–5m                 | [□]    | [🖉] [✖]  |
| 5     | 9999999 | Catastrophic loss | > 5m                  | [□]    | [🖉] [✖]  |
+----------------------------------------------------------------------------------+
| [ + Add Level ]                                                                  |
+----------------------------------------------------------------------------------+
| Right panel:                                                                    |
|  - Domain description & guidance                                                |
|  - EBITDA reference explanation                                                 |
|  - Warning if thresholds overlap or leave gaps                                  |
+----------------------------------------------------------------------------------+

6. HEATMAP BUILDER
6.1 /erm/heatmap/:profile_id
+----------------------------------------------------------------------------------+
| Risk Matrix / Heatmap — Profile v1.4           [Status: Draft]                   |
| [Back to Profile] [Generate Matrix] [AI Suggest Mapping] [Save]                 |
+----------------------------------------------------------------------------------+
| Top Controls:                                                                     |
| - Matrix size: [5 x 5] (derived from scales, read-only)                          |
| - Mapping strategy: [Standard Gradient v]                                        |
+----------------------------------------------------------------------------------+
| Heatmap Matrix (clickable cells):                                                |
|    Impact →                                                                      |
| L  +--------+--------+--------+--------+--------+                                |
| i  |  Low   |  Med   |  High  |  High  | Extreme|                                |
| k  +--------+--------+--------+--------+--------+                                |
| e  |  Low   |  Med   |  Med   |  High  | High   |                                |
| l  +--------+--------+--------+--------+--------+                                |
| i  |  Low   |  Low   |  Med   |  Med   | High   |                                |
| h  +--------+--------+--------+--------+--------+                                |
| o  |  VeryL |  Low   |  Med   |  Med   | High   |                                |
| o  +--------+--------+--------+--------+--------+                                |
| d  |  VeryL |  VeryL |  Low   |  Med   | Med    |                                |
+----------------------------------------------------------------------------------+
| On cell click (e.g. Likelihood 4, Impact 5):                                     |
| Right Side Panel opens:                                                         |
|  ┌────────────────────────────────────────────┐                                  |
|  | Cell Editor                               |                                  |
|  |-------------------------------------------|                                  |
|  | Likelihood Level: 4                       |                                  |
|  | Impact Level: 5                           |                                  |
|  | Risk Level: [ High v ]                    |                                  |
|  | Colour:  [ ■ ]                            |                                  |
|  | Descriptor: [______________]             |                                  |
|  | Numeric Min: [ 12 ]                       |                                  |
|  | Numeric Max: [ 16 ]                       |                                  |
|  | Appetite default: [x] Yes                 |                                  |
|  └────────────────────────────────────────────┘                                  |
+----------------------------------------------------------------------------------+
| Bottom: [Legend: Very Low / Low / Medium / High / Extreme]                      |
+----------------------------------------------------------------------------------+

7. APPETITE EDITOR
7.1 /erm/appetite/:profile_id
+----------------------------------------------------------------------------------+
| Risk Appetite — Profile v1.4                   [Status: Draft]                   |
| [Back to Profile] [Save Appetite] [AI Suggest Appetite]                          |
+----------------------------------------------------------------------------------+
| Domain Appetite Cards:                                                            |
|----------------------------------------------------------------------------------|
| [ Safety ]                                                                        |
|   Appetite Level:  [ Low v ]                                                      |
|   Trigger Range:   [ Min: 8 ] – [ Max: 10 ]                                       |
|   Workflow Rule:   [ requires_executive_signoff v ]                               |
|   Warning: "Any High or Extreme risk in Safety domain automatically escalates."   |
|----------------------------------------------------------------------------------|
| [ Security ]                                                                      |
|   Appetite Level:  [ Medium v ]                                                   |
|   Trigger Range:   [ Min: 10 ] – [ Max: 15 ]                                      |
|   Workflow Rule:   [ requires_senior_approval v ]                                 |
|----------------------------------------------------------------------------------|
| [ Environmental ]                                                                 |
|  ...                                                                              |
+----------------------------------------------------------------------------------+
| Right panel:                                                                     |
|  - Appetite vs Risk Level legend                                                 |
|  - Live summary: "# of risks above appetite (from RA/WRAC feed)"                 |
+----------------------------------------------------------------------------------+

8. HIERARCHY & INHERITANCE
8.1 /erm/hierarchy/:profile_id
+----------------------------------------------------------------------------------+
| ERM Hierarchy & Inheritance — Profile v1.4                                       |
| [Back to Profile] [Save Hierarchy]                                               |
+----------------------------------------------------------------------------------+
| Left: Org Hierarchy Tree                                                         |
|----------------------------------------------------------------------------------|
| Group HQ (this profile) [P]                                                      |
|  ├─ Region A [inherits]                                                          |
|  │   ├─ Mine 1 [inherits]                                                        |
|  │   └─ Mine 2 [overrides appetite: Security = High]                             |
|  └─ Region B [inherits]                                                          |
+----------------------------------------------------------------------------------+
| Right: Node Details (on selecting "Mine 2")                                      |
|----------------------------------------------------------------------------------|
| Node: Mine 2                                                                     |
| Inherits from: Region A / Group HQ                                               |
| Effective Profile: v1.4                                                          |
| Overrides:                                                                       |
|   - Security domain appetite: Medium → High                                      |
|   - All other domains: inherited                                                 |
| [Edit Overrides] [Request Parent Approval]                                       |
+----------------------------------------------------------------------------------+
| [Parent Approval Banner]:                                                        |
|  "Changes pending approval from Group HQ (J.Ras)"                                |
+----------------------------------------------------------------------------------+

9. APPROVALS
9.1 /erm/approvals/:profile_id
+----------------------------------------------------------------------------------+
| Approvals — Profile v1.4                     [Status: Pending Approval]          |
| [Back to Profile]                                                                 |
+----------------------------------------------------------------------------------+
| Summary:                                                                          |
|  - Org: APGI Group                                                               |
|  - Created by: Risk Manager                                                      |
|  - Requested by: Risk Manager (2024-04-01)                                       |
+----------------------------------------------------------------------------------+
| Approval Actions (visible if user has ERM_REVIEWER / ERM_ADMIN):                 |
|   [ Approve Profile ]    [ Reject Profile ]                                      |
+----------------------------------------------------------------------------------+
| Comment Box (modal on click):                                                    |
|   [ Add decision comment ..................................... ] [Submit]        |
+----------------------------------------------------------------------------------+
| Approval History:                                                                 |
| Date       | User        | Action    | Comment                                   |
|------------+-------------+-----------+-------------------------------------------|
| 2024-04-01 | R. Manager  | submitted | "New appetite after 2023 incidents."      |
| 2024-04-03 | J. Ras      | approved  | "Aligned with group risk tolerance."      |
+----------------------------------------------------------------------------------+

10. AUDIT LOG
10.1 /erm/audit/:profile_id
+----------------------------------------------------------------------------------+
| Audit Trail — Profile v1.4                                                       |
| [Back to Profile] [Export Audit Log]                                             |
+----------------------------------------------------------------------------------+
| Filters: [Date range v] [User v] [Action type v] [Search..................] [🔍] |
+----------------------------------------------------------------------------------+
| Date & Time          | User        | Action              | Details [View]        |
|----------------------+-------------+---------------------+----------------------|
| 2024-03-30 10:12     | M. Smith    | SCALE_UPDATED       | Likelihood levels    |
| 2024-03-30 10:15     | M. Smith    | HEATMAP_GENERATED   | Matrix 5x5           |
| 2024-03-30 11:05     | AI Engine   | AI_SUGGESTED_APPET. | Security domain      |
| 2024-04-01 09:20     | R. Manager  | SUBMITTED_FOR_APPROV|                      |
+----------------------------------------------------------------------------------+
| On [Details View] click: diff modal:                                             |
|  - Before & After JSON-like diff                                                |
|  - [AI Explain Change] button                                                    |
+----------------------------------------------------------------------------------+

11. EXPORT PAGE
11.1 /erm/export/:profile_id
+----------------------------------------------------------------------------------+
| Export ERM Profile — v1.4                                                        |
| [Back to Profile]                                                                |
+----------------------------------------------------------------------------------+
| Export Options:                                                                  |
| [x] JSON Profile Bundle                                                           |
| [x] YAML Profile Bundle                                                           |
| [x] PDF Summary (for Board / Audit)                                              |
| [ ] CSV Likelihood & Impact Scales                                               |
| [ ] Heatmap-only JSON                                                            |
+----------------------------------------------------------------------------------+
| [ Generate Export ]                                                              |
+----------------------------------------------------------------------------------+
| Right side:                                                                      |
|   Export Preview / small text snippet                                            |
|   - File names                                                                   |
|   - Estimated size                                                               |
+----------------------------------------------------------------------------------+
| After success: [ExportSuccessModal] with download links.                         |
+----------------------------------------------------------------------------------+

12. PROFILE COMPARISON
12.1 /erm/compare
+----------------------------------------------------------------------------------+
| Compare ERM Profiles                                                             |
+----------------------------------------------------------------------------------+
| Left Profile:  [Org: APGI Group v] [Profile: v1.2 v]                             |
| Right Profile: [Org: APGI Group v] [Profile: v1.4 v]                             |
| [Load Comparison]                                                                |
+----------------------------------------------------------------------------------+
| Top Summary:                                                                     |
|  - Left:  v1.2 (Published 2023-11-10)                                            |
|  - Right: v1.4 (Approved 2024-04-05)                                             |
+----------------------------------------------------------------------------------+
| Tabs: [ Overview ] [ Likelihood ] [ Impact ] [ Heatmap ] [ Appetite ] [ Hierarchy]|
+----------------------------------------------------------------------------------+
| Example: Likelihood Comparison Tab:                                              |
|----------------------------------------------------------------------------------|
| Left (v1.2)                    | Right (v1.4)                                    |
| Level | Score | Desc           | Level | Score | Desc                            |
| 1     | 0.2   | Rare           | 1     | 0.1   | Rare                            |
| 2     | 0.6   | Unlikely       | 2     | 0.5   | Unlikely                        |
| ...                                                                               |
+----------------------------------------------------------------------------------+
| [AI Explain Differences] button → opens side modal summarising key changes       |
+----------------------------------------------------------------------------------+

13. RESPONSIVE & ACCESSIBILITY NOTES

On smaller screens, side panels collapse to drawers.

Tables are horizontally scrollable with fixed headers.

Colour is never the only signal: risk levels are also labelled textually.

Keyboard navigation:

Tab through inputs

Arrow keys to navigate heatmap cells

14. IMPLEMENTATION PRIORITY

For v1.0 ERM implementation, prioritise pages in this order:

Profiles List / View / Create

Likelihood & Impact Scales

Heatmap Builder

Appetite Editor

Approvals

Hierarchy

Audit

Export

Compare

Dashboard polish & AI helpers

✔ END OF ERM_WIREFRAMES_v1.1.md