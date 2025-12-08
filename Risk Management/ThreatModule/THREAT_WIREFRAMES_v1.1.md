Below is the complete THREAT_WIREFRAMES_v1.1.md, fully aligned to the True North, Database Schema, Edge Functions, and Component Map.
This delivers high-fidelity structural wireframes, with ASCII diagrams that Foreman and Co-Pilot agents can translate directly into React components.

Place in:
/Modules/Risk Management/ThreatModule/THREAT_WIREFRAMES_v1.1.md

THREAT_WIREFRAMES_v1.1.md

Threat Module — Wireframes (Structural UX Blueprint)
Version 1.1
Aligned with:

THREAT_TRUE_NORTH_v1.0.md

THREAT_DATABASE_SCHEMA_v1.1.md

THREAT_EDGE_FUNCTIONS_v1.1.md

THREAT_FRONTEND_COMPONENT_MAP_v1.1.md

Maturion ISMS UI Language

SRMF Risk Lifecycle Architecture

0. PURPOSE

These wireframes define the exact visual structure of all screens required for the Threat Module.

They are:

Clear enough for engineers to build without ambiguity

Minimalistic but structurally complete

Consistent with WRAC, PIT, ERM UX

Fully aligned with the AI-Assist workflow

Compliant with One-Time Build & Zero Regression principles

These are not artistic mockups.
They are blueprints.

1. GLOBAL LAYOUT

All Threat Module pages follow a standard top + sidebar layout:

+--------------------------------------------------------------+
|  [ISMS Top Navigation]                                        |
+--------------------------------------------------------------+
| [Threat Sidebar Nav] | [Page Title + Content]                 |
|                      |                                        |
|                      |                                        |
+--------------------------------------------------------------+


Sidebar Items:

Dashboard
Threat Library
Create Threat
Intelligence


When inside a threat version:

Overview
Classification
Actor Profile (TAP)
TTP Mapping
Drift
Linking
Review & Approvals
Audit Log
Exports

2. WIREFRAME: THREAT DASHBOARD (/threats/dashboard)
+--------------------------------------------------------------+
| Threat Dashboard                                             |
+--------------------------------------------------------------+
| [Total Threats] [Adversarial] [Non-Adversarial] [High Drift]|
+--------------------------------------------------------------+
|  Threat Drift Overview (Line Chart)                          |
|                                                              |
|   ┌─────────────graph──────────────┐                         |
|   │                                 │                        |
|   └─────────────────────────────────┘                        |
+--------------------------------------------------------------+
|  Threat Categories Heatmap                                   |
+--------------------------------------------------------------+
|  Recent Alerts                                               |
|   - Syndicate activity increasing (Drift +0.13)              |
|   - Insider anomaly detected                                 |
+--------------------------------------------------------------+
| [ + Create Threat ]   [ View Threat Library ]                |
+--------------------------------------------------------------+

3. WIREFRAME: THREAT LIBRARY (/threats/library)
+--------------------------------------------------------------+
| Threat Library                                               |
+--------------------------------------------------------------+
| Search: [_____________] [Category ▼] [Subcategory ▼]         |
| [Status ▼] [Facility ▼] [Process ▼] [Drift Slider 0—1]       |
+--------------------------------------------------------------+
|  CODE   NAME            CAT   SUBCAT   VER   DRIFT   ACTION  |
|--------------------------------------------------------------|
| T-0021 Armed Robbery   Adv    Crim     1.3   0.61    [View]  |
| T-0148 Cable Theft     Adv    Crim     2.1   0.44    [View]  |
| T-0259 Storm Damage    Non    Env      1.0   0.22    [View]  |
+--------------------------------------------------------------+

4. WIREFRAME: VIEW THREAT (/threats/library/view/:id)
+--------------------------------------------------------------+
| Threat: Armed Robbery         [v1.3 Published]               |
| Category: Adversarial > Criminal                              |
+--------------------------------------------------------------+
| Version Timeline: v1.0 | v1.1 | v1.2 | [v1.3]                |
+--------------------------------------------------------------+
| Summary Cards:                                               |
|  ┌───────────────┐ ┌───────────────┐ ┌────────────────────┐ |
|  │Classification  │ │TAP Summary     │ │TTP Summary         │ |
|  └───────────────┘ └───────────────┘ └────────────────────┘ |
+--------------------------------------------------------------+
| Linked Entities: Facilities: 6 | Processes: 2                |
+--------------------------------------------------------------+
| Usage: In 17 RA records | 4 WRAC | 3 PIT Projects            |
+--------------------------------------------------------------+

5. WIREFRAME: CREATE/EDIT WIZARD
STEP NAV
[BASICS] → [CLASSIFICATION] → [ACTOR PROFILE] → [TTP] → 
[DRIFT] → [LINKING] → [REVIEW]

5.1 STEP 1 — BASICS
+--------------------------------------------------------------+
| Create Threat – Step 1: Basics                               |
+--------------------------------------------------------------+
| Name: [______________________________________]              |
| Description: [___________________________________________]  |
| Category: [Adversarial ▼]                                   |
| Subcategory: [Criminal ▼]                                   |
| Threat Type: (• Adversarial) (○ Non-Adversarial)            |
+--------------------------------------------------------------+
| [ Back ]                   [ Save Draft ]     [ Next → ]     |
+--------------------------------------------------------------+

5.2 STEP 2 — CLASSIFICATION
+--------------------------------------------------------------+
| Step 2: Threat Classification                                |
+--------------------------------------------------------------+
| Capability (1-5):  [----●-----]                              |
| Motivation (1-5):  [------●---]                              |
| Opportunity:       [--●-------]                              |
| Resources:         [----●-----]                              |
| Historical Freq:   [   47   ] per year                       |
+--------------------------------------------------------------+
| Domain Relevance:                                            |
| [x] Security   [ ] Safety   [x] Operational   [ ] Financial  |
+--------------------------------------------------------------+
|  Classification Preview (Radar Chart)                         |
+--------------------------------------------------------------+
| [ AI Suggest Classification ]                                 |
+--------------------------------------------------------------+
| [ Back ]                  [ Save Draft ]    [ Next → ]       |
+--------------------------------------------------------------+

5.3 STEP 3 — ACTOR PROFILE (TAP)
+--------------------------------------------------------------+
| Step 3: Threat Actor Profile                                 |
+--------------------------------------------------------------+
| Actor Type: [Syndicate ▼]                                    |
| Skill Level: [----●-----]                                    |
| Resources:                                                   |
| [ Armed weapons, vehicles, local network ]                   |
+--------------------------------------------------------------+
| Capabilities:                                                |
|  NAME                       SEV   EVIDENCE      AI? ACTION   |
| ------------------------------------------------------------|
|  Surveillance Avoidance     4    Report xyz     A.I. [Edit]  |
|  Bribery / Coercion         3    Case abc       No  [Edit]   |
|  Armed Response             5    --             A.I. [Edit]   |
+--------------------------------------------------------------+
| [ + Add Capability ]                                          |
+--------------------------------------------------------------+
| [ AI Generate TAP ]                                           |
+--------------------------------------------------------------+
| [ Back ]             [ Save Draft ]      [ Next → ]          |
+--------------------------------------------------------------+

5.4 STEP 4 — TTP MAPPING
+--------------------------------------------------------------+
| Step 4: TTP Mapping                                          |
+--------------------------------------------------------------+
| Search TTP: [______________]  [Domain: Physical ▼]           |
+--------------------------------------------------------------+
| Selected TTPs:                                               |
|  CODE    NAME                  CONF   AI?   ACTION          |
|  T1059   Command Execution      0.83   A.I.  [Remove]        |
|  T1105   Remote File Copy       0.76   No    [Remove]        |
+--------------------------------------------------------------+
| TTP Reference Table:                                         |
|  CODE   NAME                DOMAIN     ADD?                  |
|  T1027  Obfuscated Files     Cyber    [Add]                 |
|  T1200  Hardware Additions   Hybrid   [Add]                 |
+--------------------------------------------------------------+
| [ AI Suggest TTPs ]                                          |
+--------------------------------------------------------------+
| [ Back ]             [ Save Draft ]      [ Next → ]          |
+--------------------------------------------------------------+

5.5 STEP 5 — DRIFT
+--------------------------------------------------------------+
| Step 5: Threat Drift                                         |
+--------------------------------------------------------------+
| Current Drift Score: [ 0.61 ]                                |
| Drift Reason: [Increase in armed robbery incidents]          |
| Source: [Incident ▼]                                         |
+--------------------------------------------------------------+
| Drift Timeline:                                              |
|  (Line Chart: Month vs Drift Score)                          |
+--------------------------------------------------------------+
| [ AI Compute Drift from Incidents ]                          |
| [ AI Compute Drift from Intel ]                              |
+--------------------------------------------------------------+
| [ Back ]             [ Save Draft ]      [ Next → ]          |
+--------------------------------------------------------------+

5.6 STEP 6 — LINKING (Processes & Facilities)
+--------------------------------------------------------------+
| Step 6: Linking                                               |
+--------------------------------------------------------------+
| Tabs: [ Facilities ] [ Processes ]                           |
+--------------------------------------------------------------+
| Facilities Tree:                                             |
|  - Mine A                                                    |
|     - Plant 1      [x]                                       |
|     - Plant 2      [ ]                                       |
|     - Admin Block  [x]                                       |
|  - Mine B                                                    |
|     - Plant 3      [ ]                                       |
+--------------------------------------------------------------+
| Selected Facility Details:                                   |
|  Relevance: [-----●---]                                      |
|  Justification: [______________________________________]     |
+--------------------------------------------------------------+
| [ Back ]             [ Save Draft ]      [ Next → ]          |
+--------------------------------------------------------------+

6. WIREFRAME: REVIEW & APPROVALS
+--------------------------------------------------------------+
| Threat Review & Approvals                                    |
+--------------------------------------------------------------+
| Review Checklist:                                             |
|  [x] Basics complete                                          |
|  [x] Classification valid                                     |
|  [x] TAP present (adversarial)                                |
|  [x] TTP mappings added                                       |
|  [x] Drift initialised                                        |
|  [x] Linked to facility/process                               |
+--------------------------------------------------------------+
| Summary Table (collapsible cards):                            |
|  - Basics                                                     |
|  - Classification                                             |
|  - TAP                                                        |
|  - TTP                                                        |
|  - Drift                                                      |
|  - Links                                                      |
+--------------------------------------------------------------+
| Reviewer Actions:                                             |
|  [Approve] [Reject]                                           |
+--------------------------------------------------------------+
| Manager Actions:                                              |
|  [Publish Threat Version]                                     |
+--------------------------------------------------------------+
| Comments/Timeline:                                            |
|  Reviewer A: Please refine TAP                                |
|  Analyst B: Updated                                           |
+--------------------------------------------------------------+

7. AUDIT LOG
+--------------------------------------------------------------+
| Threat Audit Log                                              |
+--------------------------------------------------------------+
| Filters: [Action ▼] [User ▼] [Date]                           |
+--------------------------------------------------------------+
| TIMESTAMP      USER     ACTION          VIEW DIFF            |
|--------------------------------------------------------------|
| 2025-01-04     Analyst  Updated TTP     [View]                |
| 2025-01-03     AI       Suggested TAP   [View]                |
+--------------------------------------------------------------+
| [AI Explain Change] (Modal)                                   |
+--------------------------------------------------------------+

8. EXPORTS
+--------------------------------------------------------------+
| Threat Exports                                                |
+--------------------------------------------------------------+
| [x] JSON   [x] YAML   [x] PDF   [x] ZIP Bundle               |
+--------------------------------------------------------------+
| [Generate Exports]                                           |
+--------------------------------------------------------------+
| Downloads:                                                   |
|  - threat_v1.3.json                                          |
|  - threat_v1.3.yaml                                          |
|  - threat_v1.3.pdf                                           |
|  - threat_v1.3_bundle.zip                                    |
| Checksum: e35a9fa3ce…                                        |
+--------------------------------------------------------------+

9. INTELLIGENCE
+--------------------------------------------------------------+
| Threat Intelligence                                           |
+--------------------------------------------------------------+
| Filters: [Category] [Severity] [Facility] [Drift 0-1]        |
+--------------------------------------------------------------+
| Threat Cluster Visualisation                                 |
|   (Graph of threats clustered by TAP/TTP similarity)         |
+--------------------------------------------------------------+
| Facility Exposure Map                                        |
|   (Heatmap by site)                                          |
+--------------------------------------------------------------+
| AI Insights:                                                 |
|  "Increase in syndicate activity predicted next 90 days."    |
|  [Regenerate Insights]                                       |
+--------------------------------------------------------------+

✔ END OF THREAT_WIREFRAMES_v1.1.md