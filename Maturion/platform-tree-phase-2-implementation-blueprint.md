# PLATFORM TREE — PHASE 2 IMPLEMENTATION BLUEPRINT  
Version: 1.0  
Status: Build Orchestration Specification  
Owner: Johan  
Last Updated: YYYY-MM-DD  

--------------------------------------------------------------------------------
# 1. PURPOSE OF PHASE 2

Phase 2 transforms the Platform Tree from a **static UI** into a **live, dynamic,
data-driven operational system**.

Phase 2 introduces:

- Real-time node status colours (green/amber/red/purple/grey/blue)  
- Node completion percentage  
- Watchdog signal indicators  
- IWMS incident overlays  
- Autonomy state indicators  
- Performance metrics  
- Live data binding via Platform Tree API  
- Push-based real-time updates (WebSocket/SSE)  
- Node-level health summaries  

This is the first phase where the tree behaves like a **living governance organism**.

--------------------------------------------------------------------------------
# 2. OBJECTIVES OF PHASE 2

Phase 2 must:

1. Replace static JSON with **live API integration**  
2. Render correct node status colours  
3. Render completion % values  
4. Display incident indicators (small badges)  
5. Display watchdog warning icons  
6. Subscribe to **/tree/events** for live updates  
7. Update parent-node status based on child-node aggregation  
8. Populate Node Details panel with live data  

Phase 2 DOES NOT yet implement:

- Maturion’s full diagnostics workflow  
- Autonomy modification actions  
- Interactive remediation  
- Cross-tenant tree instances  
- Risk depth visualisations  
- Performance history graphs  

These come in Phase 3+.

--------------------------------------------------------------------------------
# 3. SCOPE OF PHASE 2 (STRICT)

### IN SCOPE
- API integration (GET /tree, GET /tree/status)
- WebSocket/SSE event streaming
- Status colour rendering
- Incident badges per node
- Watchdog badges per node
- Completion percentage rendering
- Autonomy state display
- Performance metrics display
- NodeDetailsPanel real-time population
- Aggregation logic (worst child status)
- Status change animation (optional)
- Placeholder UI for Maturion diagnostics

### OUT OF SCOPE
- Diagnostics logic
- “Fix node” capabilities
- Structural changes to the tree
- Tenant-specific tree views
- History graphs or timeline visualisations
- ARC review workflows

--------------------------------------------------------------------------------
# 4. TECHNICAL DELIVERABLES

### 4.1 Integration With API Clients

The following functions must be implemented in `treeService.ts`:

getTree(): Promise<TreeNode[]>
getTreeStatus(): Promise<NodeStatus[]>
getNode(nodeId): Promise<TreeNode>
getNodeStatus(nodeId): Promise<NodeStatus>
openEventsStream(): WebSocket | EventSource

markdown
Copy code

### 4.2 Revised State Hook

Implement `usePlatformTree()` with:

- `treeStructure`
- `statusById`
- `aggregatedStatusById`
- event-stream listener
- merge logic for partial updates

### 4.3 Node Status Aggregation Engine

Create:

/src/features/platformTree/models/statusAggregation.ts

markdown
Copy code

Responsibilities:

1. Compute child → parent roll-up  
2. Prioritise statuses:

priority: red > purple > amber > blue > green > grey

markdown
Copy code

3. Recompute on every event update  
4. Efficient memoisation (avoid re-render explosions)

### 4.4 UI Rendering of Status Colour

In `TreeNodeView.tsx`, add:

statusIndicator: circle
colour uses NodeStatus.status

markdown
Copy code

Colour mapping:

| Status | Colour |
|--------|---------|
| green | #2ECC71 |
| amber | #F1C40F |
| red | #E74C3C |
| purple | #9B59B6 |
| blue | #3498DB |
| grey | #BDC3C7 |

### 4.5 Incident Badge

If a node has `incidents.length > 0` → show red/amber icon.

### 4.6 Watchdog Badge

If `watchdogSignals.length > 0` → show small triangular warning symbol.

Severity colour rules:

- "error" → red  
- "warn" → amber  
- "info" → blue  

### 4.7 Node Details Panel Real-Time Data

Populate:

- health summary  
- autonomy state  
- incident list  
- watchdog telemetry  
- performance metrics  
- completeness %  

Do not yet implement:

- diagnostics  
- remediation  
- full reasoning chains  

--------------------------------------------------------------------------------
# 5. UI CHANGES REQUIRED

### 5.1 Tree Node Styling

Add:

- status circle  
- badge cluster (incidents + watchdogs)  
- faded text for grey/inactive nodes  
- hover tooltip enhanced with:  
  - Node status  
  - Last update timestamp  
  - Key incident summary  

### 5.2 Node Details Panel

Replace previous placeholder with:

Node Name
Node Type
Status Colour + Completion %
Summary
Incidents (list)
Watchdog Signals (list)
Autonomy State
Performance Metrics
Linked Documents (static from JSON)

css
Copy code

Diagnostics button remains disabled:

diagnostics disabled (Phase 3)

markdown
Copy code

### 5.3 Animation

Use subtle animations:

- Fade transition for colour changes  
- Slide transition for updated badges  
- Optional: pulse effect on node receiving new event  

--------------------------------------------------------------------------------
# 6. WEB SOCKET / EVENT STREAM INTEGRATION

### When `/tree/events` sends an update:

Steps:

1. Parse event  
2. Identify node  
3. Merge new data into `statusById[nodeId]`  
4. Recompute aggregated statuses  
5. Trigger re-render for affected nodes only  

Event example:

{
"eventType": "watchdog.warning",
"nodeId": "risk-model-root",
"payload": {
"watchdogSignal": {...}
}
}

markdown
Copy code

Must support event types:

- watchdog.warning  
- watchdog.error  
- incident.created  
- incident.updated  
- node.status.update  
- autonomy.changed  
- metrics.changed  

--------------------------------------------------------------------------------
# 7. TESTING REQUIREMENTS

### 7.1 Status Rendering Tests
Verify:

- red status renders correctly  
- amber status renders correctly  
- parent becomes red if any child red  
- grey for unknown nodes  

### 7.2 Badge Rendering Tests
- incident badge appears when needed  
- watchdog badge appears when needed  

### 7.3 WebSocket Tests
Mock incoming events:

- Watchdog event  
- Incident event  
- Status update event  

Ensure UI updates in < 100ms.

### 7.4 Aggregation Tests
Test:

children: [green, amber, green] → amber
children: [red, green, green] → red
children: [] → own status
own=green, child=purple → purple

markdown
Copy code

### 7.5 Node Details Panel Tests

Ensure:

- clicking node loads dynamic status  
- metrics appear  
- autonomy state appears  

--------------------------------------------------------------------------------
# 8. ACCEPTANCE CRITERIA

Phase 2 is complete when ALL of the following are true:

### 8.1 Live Status Display Works
- Colours update automatically  
- Status does not require page refresh  
- Parent-node aggregation correct  

### 8.2 Events Integrate Smoothly
- WebSocket/SSE connection stable  
- Incoming events update nodes in real time  
- No stale UI rendering  

### 8.3 Incident & Watchdog Badges Working
- Visible badges  
- Hover info correct  
- Panel details correct  

### 8.4 Performance Acceptable
- Tree renders < 150ms  
- Status update < 100ms  
- No UI freezes  

### 8.5 No Diagnostics Yet (placeholder only)
- “Ask Maturion” disabled  
- Maturion receives no requests  

--------------------------------------------------------------------------------
# 9. TRANSITION TO PHASE 3

Phase 3 introduces:

- full Maturion diagnostics  
- remediation workflow  
- incident resolution from tree  
- autonomy-level controls  
- world-model consistency alerts  
- deep analytics visualisations  

Phase 2 MUST be complete before Phase 3 begins.

--------------------------------------------------------------------------------
# END OF FILE
