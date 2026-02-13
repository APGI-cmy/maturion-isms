WRAC_WIREFRAMES_v0.1.md

Workplace Risk Assessment & Control – ASCII UI Wireframes
Version 0.1
Aligned with:

WRAC_TRUE_NORTH_v0.1

WRAC_DATABASE_SCHEMA_v0.1

WRAC_EDGE_FUNCTIONS_v0.1

WRAC_FRONTEND_COMPONENT_MAP_v0.1

Maturion True North & Build Philosophy

0. PURPOSE

These ASCII wireframes define:

Screen layout

Component placement

Functional grouping

Navigation expectations

Information hierarchy

They do not determine final styling — only the architectural layout.

All frontend components created must map exactly to these wireframes.

1. WRAC WORKSPACE LAYOUT
+----------------------------------------------------------------------------------+
|  [Breadcrumb: Risk Management > Risk Assessment > WRAC]  [Node Selector ▼]       |
+----------------------------------------------------------------------------------+
|  WRAC  |  Controls  |  CCR & Live Risk  |  Strategy                               |
+----------------------------------------------------------------------------------+
| GLOBAL FILTER BAR                                                                |
|----------------------------------------------------------------------------------|
| [Architecture ▼] [Threat ▼] [Vulnerability ▼] [Appetite ▼] [PUE only ☑] [Search] |
+----------------------------------------------------------------------------------+
| PAGE CONTENT (depends on selected tab)                                           |
+----------------------------------------------------------------------------------+

2. TAB 1: WRAC RISK-CENTRIC VIEW
2.1 Overall Layout
+--------------------------------------+-------------------------------------------+
|   LEFT PANEL (RISK TABLE)            |   RIGHT PANEL (DETAIL PANEL)              |
|--------------------------------------|-------------------------------------------|
|   <WracMetricsBar>                   |   Appears when a row is selected          |
|--------------------------------------|-------------------------------------------|
|   <WracRiskTable>                    |   <WracRiskDetailPanel>                   |
|                                      |                                           |
+--------------------------------------+-------------------------------------------+

2.2 Risk Metrics Bar (Top Summary Indicators)
+----------------------------------------------------------------------------+
| Risks: 143 | Above Appetite: 29 | PUEs: 7 | Avg Live Risk: High (14.2)   |
| ALE Total: R 48,230,000 | ROI (Avg): 21%                               |
+----------------------------------------------------------------------------+

2.3 WRAC Risk Table (Left Panel)
+----------------------------------------------------------------------------------+
| [ ] | Risk ID | Component | Unwanted Event (UE)            | PUE | Inh | Res | Prj | Live | ALE | ROI |
|-----+----------+-----------+--------------------------------+-----+-----+-----+-----+------+-----+-----|
| [ ] | R-00123  | PLT01     | Theft of concentrate due to... | ★   | H   | M   | L   | M    | 4.2M| 38% |
| [ ] | R-00877  | PLT02     | Armed robbery at vault entry...|     | E   | H   | M   | H    | 9.8M| -12%|
| [ ] | R-00219  | PRC-A     | Fuel diversion via bypass...   |     | M   | M   | M   | M    | 1.1M| 8%  |
| ...                                                                                       ...         |
+----------------------------------------------------------------------------------+
Actions: [Export] [Add Selected to Strategy]


Legend:

Inh = Inherent

Res = Residual

Prj = Projected (new controls)

Live = Real-time risk

ALE = Annual Loss Expectancy

ROI = Return on Investment

All risk cells follow ERM heatmap colours.

2.4 WRAC Risk Detail Panel (Right Side)
+------------------------------------ RISK DETAIL -------------------------------------+
| UE: Theft of concentrate due to inadequate control of access routes                  |
| Threat: Organised crime infiltration | Vulnerability: Blind spots on HA haul roads   |
+---------------------------------------------------------------------------------------+
| [ Overview | Controls | Implementation | CCR | Appetite | AI Explain ]               |
+---------------------------------------------------------------------------------------+

[Overview]
-----------------------------------------------------------------------------------------
| Inherent: HIGH (16)          Residual: MEDIUM (10)          Projected: LOW (5)        |
| Live Risk: MEDIUM (9)        Appetite Threshold: 8          Status: Above Appetite     |
-----------------------------------------------------------------------------------------
| Narrative (AI optional):                                                                   |
| "This risk remains above appetite primarily due to incomplete surveillance tiering..."     |
-----------------------------------------------------------------------------------------

[Controls]
-----------------------------------------------------------------------------------------
| CONTROL                                 | Design | Impl | Perf | CCR | Contribution    |
|-----------------------------------------+--------+-------+------+-----+-----------------|
| CCTV Perimeter Tier 1                   | 0.35   |  0.60 | 0.82 | G   | -16%            |
| Tier-2 Surveillance Management          | 0.15   |  0.20 | 0.50 | A   | -4%             |
| Recruitment Vetting (Syndicate Risk)    | 0.25   |  0.90 | 0.95 | G   | -22%            |
| Fuel Movement Analytics                 | 0.10   |  0.10 | 0.50 | R   | -1%             |
| ...                                                                                      |
-----------------------------------------------------------------------------------------

[Implementation & PIT]
-----------------------------------------------------------------------------------------
| Project: PLT01 - Surveillance Upgrade Phase 1                                          |
| Progress: ████████░░░░ 62%                                                             |
| Milestones: Plan ✔  / Procure ✔ / Install ■ / Integrate □ / QA □                      |
-----------------------------------------------------------------------------------------

[CCR]
-----------------------------------------------------------------------------------------
| Critical Controls: 3   Red: 1   Amber: 1   Green: 1                                    |
| Tier-2 Surveillance: RED (manual-only, insufficient frequency)                         |
| CCTV Tier-1: GREEN (auto-monitoring OK)                                                |
| Fuel Analytics: AMBER (system warnings triggered)                                      |
-----------------------------------------------------------------------------------------

[Appetite]
-----------------------------------------------------------------------------------------
| Decision: [ Treat ▼ ]                                                                  |
| Comment: ________________________________________________ [Submit Decision]           |
-----------------------------------------------------------------------------------------

[AI Explain]
-----------------------------------------------------------------------------------------
| [Why is this risk still high?] [Suggest immediate controls] [Draft owner email]       |
-----------------------------------------------------------------------------------------

3. TAB 2: CONTROL-CENTRIC VIEW
3.1 Overall Layout
+------------------------------------------+--------------------------------------------+
|       LEFT: Control Filters              |       RIGHT: Control Impact on Risks       |
+------------------------------------------+--------------------------------------------+
| <WracControlFiltersBar>                  | <WracControlImpactPanel>                   |
+------------------------------------------+--------------------------------------------+
| <WracControlList>                        |                                            |
|                                          |                                            |
|                                          |                                            |
+------------------------------------------+--------------------------------------------+

3.2 Control Filters
+--------------------------------------------------------------------------------------+
| [Domain ▼] [Control Type ▼] [Group ▼] [Monitoring ▼] [CCR Status ▼] [Search]         |
+--------------------------------------------------------------------------------------+

3.3 Control List
+------------------------------------------------------------------------------------------------------------+
| [ ] | Control Name                    | Domain     | Type     | Risks | Impl | Perf | CCR | Health Index |
|-----+----------------------------------+------------+----------+-------+------+-------+------+-------------|
| [ ] | CCTV Perimeter Tier-1           | Surveillance| Eng     | 24    | 68%  | 82%   | G    | ●●●●○      |
| [ ] | Tier-2 Surveillance Management   | Surveillance| Admin   | 19    | 21%  | 50%   | A    | ●●○○○      |
| [ ] | Monitored Access Control         | Access Ctrl| Eng     | 12    | 84%  | 97%   | G    | ●●●●●      |
| [ ] | Recruitment Vetting (Criminal)   | HR         | Admin   | 11    | 93%  | 92%   | G    | ●●●●○      |
| ...                                                                                                        |
+------------------------------------------------------------------------------------------------------------+


Each row can be clicked to open a dedicated control-side drawer.

3.4 Selected Controls Basket
+------------------------------------------------------------------------------+
| SELECTED CONTROLS                                                            |
+------------------------------------------------------------------------------+
| [x] CCTV Perimeter Tier 1                                                    |
| [x] Recruitment Vetting (Criminal)                                           |
| [ ] Add All to Strategy                                                      |
+------------------------------------------------------------------------------+
| Total Risks Mitigated: 31                                                    |
| Expected Combined Risk Reduction: 38%                                        |
| Combined ROI: 42%                                                            |
+------------------------------------------------------------------------------+
| [ Analyse Impact ]                                                           |
+------------------------------------------------------------------------------+

3.5 Control Impact Panel
+----------------------------------- CONTROL IMPACT ON RISKS -----------------------------------+
| CONTROL SET: [ CCTV Tier-1 ] + [ Recruitment Vetting ]                                       |
+-----------------------------------------------------------------------------------------------+
| Risk ID | UE Summary                           | Residual | With Controls | ALE Δ | ROI       |
|--------+----------------------------------------+----------+---------------+--------+-----------|
| R-00123| Theft of concentrate...                | M (10)   | L (6)         | -3.8M  | 38%       |
| R-00498| Syndicate asset diversion...           | H (15)   | M (9)         | -5.1M  | 44%       |
| R-00951| Fuel diversion...                      | M (11)   | M (10)        | -1.1M  | 9%        |
| ...                                                                                           |
+-----------------------------------------------------------------------------------------------+

4. TAB 3: CCR & LIVE RISK VIEW
4.1 CCR Overview Layout
+--------------------------------------------------------------------------------------+
|   [ CCR & Live Risk Dashboard ]                                                      |
+--------------------------------------------------------------------------------------+
|  Critical Controls: 58 | Green: 31 | Amber: 17 | Red: 10                             |
|  Live Risk Drift (Last 30 days): ↑ 13 risks | ↓ 9 risks                              |
+--------------------------------------------------------------------------------------+

4.2 CCR Controls Table
+--------------------------------------------------------------------------------------------------------+
| Control Name                 | Node  | CCR | Availability | Impl% | Perf% | Risks (Top 3)             |
|------------------------------+-------+-----+--------------+--------+--------+----------------------------|
| Tier-2 Surveillance Mgmt     | PLT01 | RED | 41%          | 22%    | 50%    | R-00123, R-00498, R-00219 |
| Fuel Movement Analytics       | PLT01 | AMB | 57%          | 12%    | 50%    | R-00219, R-00951          |
| Monitored Access Control      | PRC-B | GRN | 94%          | 80%    | 96%    | R-00876, R-01002          |
| ...                                                                                                    |
+--------------------------------------------------------------------------------------------------------+

4.3 Live Risk Trend Chart (ASCII)
LIVE RISK TREND (TOP 10 RISKS)
Last 30 days
--------------------------------------------------------------------------------
R-00123 | ███████████████▇▆▆▅▅▅▅▃▃▂▄ (drifting down)
R-00877 | ████▇▇▇▇███████████▇▇▇█ (stable high)
R-00498 | ████████▇▇▇▇▇██▆▅▄▃ (improving)
R-00219 | ████▇███████ (flat, medium risk)
...
--------------------------------------------------------------------------------

4.4 Alerts Panel
+--------------------------------------- ALERTS -------------------------------------+
| ! Critical control failure: Tier-2 Surveillance (PLT01) – risk R-00123 affected     |
| ! Appetite breach: Risk R-00877 remains HIGH for 14 days                            |
| ! PIT delay: Surveillance Upgrade Phase 1 – Install milestone overdue by 9 days     |
+-------------------------------------------------------------------------------------+

5. TAB 4: STRATEGY VIEW
5.1 Strategy Workspace Layout
+------------------------------------------+--------------------------------------------+
| LEFT: Strategy Summary Cards             | RIGHT: Selected Strategy Detail            |
+------------------------------------------+--------------------------------------------+
| <WracStrategySummaryCards>               | <WracStrategyDetailPanel>                  |
+------------------------------------------+--------------------------------------------+
| <WracStrategyList>                       |                                            |
+------------------------------------------+--------------------------------------------+

5.2 Strategy Summary Cards
+------------------+---------------------+---------------------+
| SHORT TERM       | MEDIUM TERM         | LONG TERM           |
+------------------+---------------------+---------------------+
| Risks: 12        | Risks: 9            | Risks: 4            |
| Controls: 18     | Controls: 11        | Controls: 7         |
| ROI: 41%         | ROI: 29%            | ROI: 19%            |
| ALE Reduction:  | ALE Reduction:       | ALE Reduction:      |
|   R 14.4M        |   R 7.9M            |   R 5.3M            |
+------------------+---------------------+---------------------+

5.3 Strategy List
+---------------------------------------------------------------------------------------------------------+
| Strategy Name         | Type   | Risks | Controls | Cost | Expected Reduction | ROI | Actions           |
|-----------------------+--------+-------+----------+------+---------------------+-----+------------------|
| Immediate Gains       | Short  | 12    | 18       |1.1M | -14.4M              | 41% | [View] [Export]  |
| Surveillance Phase 1  | Medium |  9    | 11       |6.0M | -7.9M               | 29% | [View] [Export]  |
| Tier-3 Integration    | Long   |  4    | 7        |12.5M| -5.3M               | 19% | [View] [Export]  |
+---------------------------------------------------------------------------------------------------------+

5.4 Strategy Detail Panel
+---------------------------------------- STRATEGY DETAIL -------------------------------------------+
| Strategy: Immediate Gains (Short Term)                                                             |
+-----------------------------------------------------------------------------------------------------+
| RISKS IN SCOPE                                                                                     |
+---------+-----------------------------------------+---------+-----------+----------------------------+
| Risk ID | UE Summary                              | Residual | Projected | Improvement              |
|---------+------------------------------------------+----------+-----------+---------------------------|
| R-00123 | Theft of concentrate                     | M (10)   | L (6)     | -4                       |
| R-00498 | Syndicate diversion                      | H (15)   | M (9)     | -6                       |
| R-00951 | Fuel diversion                           | M (11)   | M (10)    | -1                       |
| ...                                                                                                 |
+-----------------------------------------------------------------------------------------------------+

| CONTROLS IN SCOPE                                                                                  |
+-------------------------------------------+----------------+----------------+------------------------+
| Control Name                              | Impl Progress  | Perf           | Contribution           |
|-------------------------------------------+----------------+----------------+------------------------|
| CCTV Tier-1 Perimeter                     | 62%            | 82%            | -16%                   |
| Recruitment Vetting – Criminal            | 93%            | 92%            | -22%                   |
| Lighting Upgrade                          | 11%            | 48%            | -4%                    |
+-----------------------------------------------------------------------------------------------------+

| PLANNED VS ACTUAL                                                               |
+---------------------------------------------------------------------------------+
| ████████░░░░░░ (62%)  vs plan ████████████░░░ (80%)                             |
+---------------------------------------------------------------------------------+

| [Export Strategy Report] [Export to PIT] [AI Summarise Strategy for ExCo]        |

6. AI ASSIST ELEMENTS

Small contextual AI interaction blocks, for risk, control, and strategy panels.

+--------------------------------------+
| AI Assist                            |
|--------------------------------------|
| [Explain this risk]                  |
| [Suggest rapid controls]             |
| [Draft email to owner]               |
+--------------------------------------+


Uses /wrac/ai/* endpoints with context objects (risk, control, strategy).

7. MOBILE ADAPTATION (Minimal Notes)

Although full mobile adaptation is not required for ASCII:

Tables collapse to stacked cards.

Control detail & risk detail become modal sheets.

CCR dashboard becomes vertically stacked.

Strategy view becomes collapsible accordion.

8. FOREMAN QA EXPECTATIONS

QA must verify:

Every component in the Component Map has a visual placeholder here.

Pages exactly match top-level grouping.

No extra components introduced during build.

No components missing.

All AI buttons connect to the correct Edge endpoints.

All risk/control/strategy sections include ERM & RA Engine values.

CCR, PIT, and Remote Assurance data appear in the contexts defined here.

✔ End of WRAC_WIREFRAMES_v0.1.md