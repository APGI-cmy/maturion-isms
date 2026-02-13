# PLATFORM TREE ARCHITECTURE BLUEPRINT  
Version: 1.0  
Status: Frontend & Integration Architecture Spec  
Owner: Johan  
Last Updated: YYYY-MM-DD  

--------------------------------------------------------------------------------
# 1. PURPOSE

This document defines the **technical architecture** for the Maturion Platform Tree,
the “Christmas Tree” visualisation that shows:

- platform-wide health
- subsystem performance
- incident and watchdog overlays
- drill-down to modules and components
- live autonomy and governance status

It ties together:

- UI/UX spec  
- Platform Tree API  
- Governance / runtime systems  
- Maturion diagnostic flows  

This blueprint guides implementation in the `maturion-foreman-app` repo.

--------------------------------------------------------------------------------
# 2. ARCHITECTURE OVERVIEW

The Platform Tree is implemented as a **feature module** in the Foreman App:

- Frontend: React + TypeScript (assumed stack)
- State management: local component state + query/cache layer (e.g. React Query or equivalent)
- Data source: `platform-tree-api` endpoints
- Integration: Maturion interaction endpoints + IWMS + watchdog feeds (via API)

Key properties:

- Modular
- Testable
- Resilient to partial failures
- Strictly read-only for constitutional documents (no mutation from this UI)
- Driven entirely by governance + runtime data

--------------------------------------------------------------------------------
# 3. MODULE LOCATION & FOLDER STRUCTURE

Recommended folder structure inside `maturion-foreman-app`:

```text
/src
  /features
    /platformTree
      /components
      /hooks
      /services
      /models
      /state
      /pages
      /tests
Explanation:

components/ — React components (tree canvas, node card, details panel, filters)

hooks/ — custom hooks for data fetching, selection, diagnostics

services/ — API clients for Platform Tree + IWMS + Maturion

models/ — TypeScript types + mapping logic (TreeNode, NodeStatus, etc.)

state/ — local store (selection, expansion, filters)

pages/ — high-level route container for the dashboard

tests/ — unit/integration tests

4. DOMAIN MODEL (FRONTEND TYPES)
These mirror the Platform Tree API, with frontend-specific additions.

ts
Copy code
// models/tree.ts
export type NodeType = "root" | "layer" | "subsystem" | "module" | "leaf";

export interface TreeNode {
  id: string;
  parentId: string | null;
  name: string;
  type: NodeType;
  order: number;
  children?: TreeNode[];
  description?: string;
  linkedDocuments?: string[];
  linkedModules?: string[];
  linkedCodePaths?: string[];
}

export type NodeStatusColour =
  | "green"
  | "amber"
  | "red"
  | "grey"
  | "blue"
  | "purple";

export interface IncidentRef {
  id: string;
  category: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timestamp: string; // ISO string
}

export interface WatchdogSignal {
  source: "Guardian" | "Sentinel" | "Arbiter";
  type: string;
  severity: "info" | "warn" | "error";
  message: string;
  timestamp: string;
}

export interface AutonomyState {
  embodiment: "Builder" | "Risk" | "Command" | "Marketing";
  level: 0 | 1 | 2 | 3 | 4;
  allowed: boolean;
  justification?: string;
}

export interface PerformanceMetrics {
  latencyMs?: number;
  errorRate?: number;
  driftScore?: number;
  costUsage?: number;
  memoryLoad?: number;
}

export interface NodeStatus {
  nodeId: string;
  status: NodeStatusColour;
  completion: number | null;
  lastUpdated: string;
  healthSummary: string;
  incidents?: IncidentRef[];
  watchdogSignals?: WatchdogSignal[];
  autonomyState?: AutonomyState;
  performanceMetrics?: PerformanceMetrics;
}
models/ may also include:

mapping functions from raw API data → TreeNode/NodeStatus

helper utilities for aggregating status up the tree

5. KEY COMPONENTS
5.1 Page Component
File: /src/features/platformTree/pages/PlatformTreePage.tsx

Responsibilities:

Entry point for the tree dashboard route

Loads tree structure + statuses

Provides layout:

Filters sidebar

Main tree canvas

Node details drawer

Connects to WebSocket event stream (if available)

5.2 Tree Canvas
File: /src/features/platformTree/components/TreeCanvas.tsx

Responsibilities:

Renders the hierarchical tree

Handles zoom & pan

Handles expand/collapse

Displays node status colours

Emits events when nodes are:

clicked

hovered

expanded/collapsed

5.3 Tree Node Component
File: /src/features/platformTree/components/TreeNodeView.tsx

Responsibilities:

Renders a single node (with recursion or via virtualisation)

Shows:

name

icon

status badge (colour)

completion %

expand/collapse control

Accessible tooltips for hover content

5.4 Filters Panel
File: /src/features/platformTree/components/TreeFiltersPanel.tsx

Responsibilities:

Filter controls:

show only red/amber

hide green

show only nodes with incidents

show nodes with autonomy violations

Sends filter state to tree renderer

5.5 Node Details Panel
File: /src/features/platformTree/components/NodeDetailsPanel.tsx

Responsibilities:

Renders when a node is selected

Shows:

summary

health reason

incidents

watchdog signals

autonomy state

performance metrics

linked documents

linked modules / code

Contains “Ask Maturion” UI block:

question input

suggested questions

response pane

5.6 Status Legend
File: /src/features/platformTree/components/StatusLegend.tsx

Responsibilities:

Explains colour codes

Optional: shows counts by colour

6. STATE & HOOKS
6.1 Selection & UI State
File: /src/features/platformTree/state/treeUiState.ts

Tracks:

selectedNodeId

expandedNodeIds

activeFilters

layout preferences (e.g. compact vs full view)

6.2 Data Hooks
File: /src/features/platformTree/hooks/usePlatformTree.ts

Responsibilities:

Fetch /tree (structure)

Fetch /tree/status (status)

Optionally subscribe to /tree/events via WebSocket

Merge structural + status data into a consumable format

Provide:

nodesById

rootNodeId

childrenByParentId

getNodeStatus(id)

refresh()

File: /src/features/platformTree/hooks/useNodeDiagnostics.ts

Responsibilities:

Wrap /tree/node/{id}/diagnose

Expose:

diagnoseNode(nodeId) → returns diagnostics from Maturion

loading/error state

lastDiagnostic per node

7. SERVICES (API CLIENTS)
7.1 Tree Service
File: /src/features/platformTree/services/treeService.ts

Responsibilities:

getTree(): Promise<TreeNode[]>

getTreeStatus(): Promise<NodeStatus[]>

getNode(nodeId): Promise<TreeNode>

getNodeStatus(nodeId): Promise<NodeStatus>

openEventsStream(): WebSocket | EventSource

7.2 Diagnostics Service
File: /src/features/platformTree/services/diagnosticsService.ts

Responsibilities:

diagnoseNode(nodeId, userId): Promise<DiagnosticsResult>

resolveNode(nodeId, resolutionNotes): Promise<void>

DiagnosticsResult shape:

ts
Copy code
export interface DiagnosticsResult {
  summary: string;
  rootCause: string;
  recommendations: string[];
  suggestedActions: string[];
  confidence: number;
}
8. DATA FLOW
High-level flow:

On page load, PlatformTreePage:

calls usePlatformTree()

tree structure + statuses fetched

Tree Canvas renders nodes using structure + status.

WebSocket / events stream updates statuses as they change.

When a node is clicked:

selectedNodeId updated

NodeDetailsPanel fetches latest status + diagnostics

When “Ask Maturion” is used:

diagnostics service sends node context

Maturion responds with analysis + recommendations

UI displays response + allows follow-up actions

9. STATUS AGGREGATION LOGIC
A helper module:

File: /src/features/platformTree/models/statusAggregation.ts

Responsibilities:

compute a node’s own status (from NodeStatus)

aggregate child statuses upward

unify:

watchdog signals

incidents

autonomy state

performance metrics

Example (conceptual):

ts
Copy code
export function computeAggregatedStatus(
  node: TreeNode,
  statusById: Record<string, NodeStatus>,
  childrenByParentId: Record<string, TreeNode[]>
): NodeStatusColour {
  // 1. Start from node status
  const base = statusById[node.id]?.status ?? "grey";

  // 2. Look at child statuses (if any)
  const children = childrenByParentId[node.id] || [];
  const childStatuses = children.map(child =>
    computeAggregatedStatus(child, statusById, childrenByParentId)
  );

  // 3. worst() semantics:
  // any red → red
  // any purple → purple (ARC overrides)
  // any amber → amber
  // all green → green
  // no data → grey

  // (Implementation can be iterative to avoid recursion issues.)
}
This ensures parent branches glow red/amber when children are failing.

10. ERROR HANDLING & RESILIENCE
Requirements:

If /tree fails:

show error state with retry button

If /tree/status fails:

show structure but mark statuses as grey/unknown

If WebSocket connection fails:

fall back to polling (e.g. periodic status refresh)

If diagnostics endpoint fails:

show “Maturion unavailable” with retry option

No error should break the whole app — degrade gracefully.

11. SECURITY & PERMISSIONS
The tree is global/system-level and must:

require authenticated access

obey role-based access:

some nodes may be visible only to Johan or admins

NEVER expose tenant private data in node details

keep tenant-specific metrics separate (or behind strict checks)

Frontend logic must respect maturion-tenant-isolation-standard.md and only show:

global health

architecture health

aggregated risk posture (no per-tenant leak)

12. TESTING STRATEGY
12.1 Unit Tests
Location: /src/features/platformTree/tests/

Test:

status aggregation logic

mapping API responses → domain models

filter logic

node selection behaviour

12.2 Component Tests
Use test renderer or integration testing:

TreeCanvas renders nodes correctly

NodeDetailsPanel responds to status changes

Filters affect visible nodes

12.3 Integration Tests
Simulate API responses with:

red/amber incidents

watchdog warnings

autonomy violations

Ensure:

colours reflect correctly

parents turn red when children red

diagnostics flow triggers network calls

13. EXTENSIBILITY
The architecture must support:

new node types (e.g. future AI agents, specialised watchdogs)

deeper hierarchies (e.g. per-tenant tree in future)

new status dimensions (e.g. bias, fairness indicators)

new visual themes (e.g. condensed view, textual view)

This is achieved by:

clean separation of:

models

services

presentation components

state

using clear, versioned API contracts

keeping tree logic generic and philosophy-driven

14. ALIGNMENT WITH PHILOSOPHY TREE
The Platform Tree implementation must be consistent with:

maturion-philosophy-tree.md

platform-tree-structure.md

platform-tree-visualization-spec.md

platform-tree-api-spec.md

The root and branches MUST mirror the philosophy hierarchy:

Level 0: Johan

Level 1: True North

Level 2: Constitutional Layer

Level 3: Intelligence Layer

Level 4: Governance Execution

Level 5: Embodiments

Level 6: Platform Architecture

Level 7: Module Architecture

Level 8: Module Implementation

Any deviation must be considered a design bug.
