# PLATFORM TREE — PHASE 1 IMPLEMENTATION BLUEPRINT  
Version: 1.0  
Status: Build Orchestration Specification  
Owner: Johan  
Last Updated: YYYY-MM-DD  

--------------------------------------------------------------------------------
# 1. PURPOSE OF PHASE 1

Phase 1 is the **foundation build phase** of the Platform Tree system.

The objective of Phase 1 is:

Render the static tree structure (platform hierarchy) in the UI,
with full expand/collapse behavior and correct parent/child mapping,
WITHOUT dynamic data, status colours, watchdog integration,
or live metrics.

markdown
Copy code

This is the **UI skeleton** of the entire oversight system.

The output of Phase 1 is a **structural-only tree** that:

- loads from static JSON  
- is fully navigable  
- mirrors the philosophy hierarchy exactly  
- supports unlimited drill-down  
- establishes component architecture for later phases  

No live backend integration yet.  
No health indicators.  
No metrics.  
No incidents.  
No Maturion diagnostics.

Just the **scaffold**.

--------------------------------------------------------------------------------
# 2. ARTIFACTS REQUIRED FOR PHASE 1

### 2.1 Static Tree Structure File

A JSON file containing the entire hierarchical model:

/public/data/platform-tree.json

markdown
Copy code

The file must reflect:

- Level 0 (Johan)  
- Level 1 (True North)  
- Level 2 (Constitutional Layer)  
- Level 3 (Intelligence Layer)  
- Level 4 (Governance Execution Layer)  
- Level 5 (Embodiment Layer)  
- Level 6 (Platform Architecture Layer)  
- Level 7 (Module Architecture Layer)  
- Level 8 (Module Implementation Layer)  

This must be an **exact** 1:1 encoding of:

- `maturion-philosophy-tree.md`  
- `platform-tree-structure.md`

### 2.2 TypeScript Domain Models

From Part C:

TreeNode
NodeType
NodeStatusColour (stubbed, not used yet)

markdown
Copy code

### 2.3 Base Components

- `TreeCanvas.tsx`
- `TreeNodeView.tsx`
- `TreeFiltersPanel.tsx`
- `StatusLegend.tsx` (empty placeholder)
- `NodeDetailsPanel.tsx` (empty placeholder)

### 2.4 State Management

UI-only state:

expandedNodeIds: string[]
selectedNodeId: string | null
activeFilters: {...} (placeholder)

markdown
Copy code

### 2.5 Page Container

`PlatformTreePage.tsx`  

This component:

- loads the static JSON  
- holds state  
- passes tree data to TreeCanvas  
- renders basic layout  

--------------------------------------------------------------------------------
# 3. SCOPE OF PHASE 1 (STRICT)

### IN SCOPE

- Build static tree from JSON  
- Render full hierarchy  
- Expand/collapse nodes  
- Select a node  
- Show node name and icon  
- Basic styling  
- Component architecture  

### OUT OF SCOPE

Everything dynamic:

- colours  
- status indicators  
- incidents  
- watchdog telemetry  
- autonomy violations  
- performance metrics  
- diagnostic button  
- Maturion integration  
- API integration  
- live event stream  
- backend  

These will be added in Phase 2–5.

--------------------------------------------------------------------------------
# 4. FILES TO BE CREATED IN PHASE 1

/public/data/platform-tree.json

/src/features/platformTree/models/tree.ts
/src/features/platformTree/hooks/useStaticTree.ts
/src/features/platformTree/state/treeUiState.ts

/src/features/platformTree/components/TreeCanvas.tsx
/src/features/platformTree/components/TreeNodeView.tsx
/src/features/platformTree/components/TreeFiltersPanel.tsx
/src/features/platformTree/components/NodeDetailsPanel.tsx
/src/features/platformTree/components/StatusLegend.tsx

/src/features/platformTree/pages/PlatformTreePage.tsx

/src/features/platformTree/tests/*

pgsql
Copy code

--------------------------------------------------------------------------------
# 5. STATIC TREE JSON FORMAT (PHASE 1)

[
{
"id": "root",
"name": "Maturion Platform",
"type": "root",
"parentId": null,
"children": [...]
}
]

markdown
Copy code

Each node must include:

- id  
- name  
- type  
- parentId  
- children[]

NO dynamic fields yet.

--------------------------------------------------------------------------------
# 6. PHASE 1 UI BEHAVIOUR REQUIREMENTS

### 6.1 Expand/Collapse

Each node must:

- show a caret for children  
- be expandable  
- recursively render subtrees  

### 6.2 Node Selection

Clicking a node:

- highlights it  
- opens the **NodeDetailsPanel** (empty for now)

### 6.3 Layout

Tree canvas must:

- support scroll  
- support indentation  
- support long hierarchies  

### 6.4 Icons

Use simple placeholder icons based on:

- type: root, layer, subsystem, module, leaf  

Replace with real icons in Phase 2.

### 6.5 Filtering (stub)

Filters panel appears but is non-functional in Phase 1.  
UI only.

--------------------------------------------------------------------------------
# 7. ENGINEERING TASKS (BUILDER-FRIENDLY)

Below is the builder-facing task breakdown.

### 7.1 Create Static Tree JSON
From the structural `.md`, manually encode tree structure into JSON.

### 7.2 Build Models
Using definitions from Part C.

### 7.3 TreeCanvas + NodeView
- recursive rendering  
- basic styling  
- indentation logic  
- expand/collapse  

### 7.4 Tree State
Use local state or Zustand/Redux — builder choice.

### 7.5 NodeDetailsPanel
Render placeholder UI:

Selected Node:
Name: <node.name>
Type: <node.type>
Description: (empty)

markdown
Copy code

### 7.6 TreeFiltersPanel
Render placeholder controls.

### 7.7 Page Wiring
`PlatformTreePage.tsx` must:

- import JSON  
- load into memory  
- initialize UI state  
- pass tree → canvas  
- include all placeholder panels  

--------------------------------------------------------------------------------
# 8. TEST REQUIREMENTS

Phase 1 tests focus ONLY on static rendering:

### Test 1 — Tree Loads Successfully
- verifies JSON imports  
- verifies root node is rendered  

### Test 2 — Expand/Collapse
- simulate clicking caret  
- ensure children toggle visibility  

### Test 3 — Selection
- select node  
- ensure UI highlights  
- ensure details panel updates  

### Test 4 — Hierarchy Integrity
- verify parent-child relationships render consistently  

### Test 5 — Component Rendering
- TreeNodeView renders name + icon  
- NodeDetailsPanel renders selected node  

--------------------------------------------------------------------------------
# 9. ACCEPTANCE CRITERIA

Phase 1 is accepted when:

### 9.1 Structural Rendering Works
- Entire hierarchy loads from JSON  
- All nodes visible when expanded  
- Node selection works  

### 9.2 Navigation Works
- Expand/collapse works  
- Drill-down works  
- No performance degradation  

### 9.3 No Dynamic Behaviour Yet
- No colours  
- No health indicators  
- No metrics  
- No real-time feeds  

### 9.4 UI Architecture Ready For Extension
- component skeletons exist  
- file layout matches design  
- code ready for Phase 2 integration  

--------------------------------------------------------------------------------
# 10. TRANSITION TO PHASE 2

Phase 2 implements:

- live status colours  
- API integration  
- health overlays  
- dynamic metrics  
- incident markers  
- watchdog signal badges  

Phase 1 MUST BE COMPLETE before Phase 2 begins.

--------------------------------------------------------------------------------
# END OF FILE
