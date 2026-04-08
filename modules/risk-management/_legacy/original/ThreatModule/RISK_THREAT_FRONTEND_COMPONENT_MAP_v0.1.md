RISK_THREAT_FRONTEND_COMPONENT_MAP_v0.1.md

Module: Risk Assessment Engine – Threat Module
Stack: Next.js (React 18) + TypeScript + TailwindCSS + shadcn/ui + Zustand + React Query
Version: 0.1

0. Purpose

This file defines all React components used by the Threat Module:

Page components

Layout & navigation components

Threat list & filters

Threat detail (tabs)

QA dashboard

Hooks & services integration

Foreman/Builders must match this mapping exactly.

1. Directory Structure
/src
  /modules
    /risk
      /threat
        pages/
          ThreatListPage.tsx
          ThreatDetailPage.tsx
          ThreatQADashboardPage.tsx
        components/
          ThreatSummaryCards.tsx
          ThreatFilterBar.tsx
          ThreatTable.tsx
          ThreatRow.tsx
          ThreatDetailHeader.tsx
          ThreatTabs.tsx
          tabs/
            ThreatOverviewTab.tsx
            ThreatCharacterisationTab.tsx
            ThreatScoringTab.tsx
            ThreatDataAITab.tsx
            ThreatHistoryTab.tsx
            ThreatLinksTab.tsx
          modals/
            ThreatCreateModal.tsx
            ThreatEditModal.tsx
        state/
          useThreatStore.ts
        services/
          threatService.ts
          threatQAService.ts
        hooks/
          useThreatList.ts
          useThreatDetail.ts
          useThreatQA.ts

2. Page Components
2.1 ThreatListPage

Route: /risk/threats

Purpose:
Overview of the threat environment for selected org/site/context.

Props:
None (context from global store / URL params).

Uses:

<ThreatSummaryCards />

<ThreatFilterBar />

<ThreatTable />

<ThreatCreateModal /> (open via button)

Events:

onSelectThreat(threatId) → navigation to /risk/threats/:id

onCreateThreat() → open create modal

onRunQA() → navigate /risk/threats/qa

2.2 ThreatDetailPage

Route: /risk/threats/[threatId]

Purpose:
Full detail view: overview, characterisation, scoring, data & AI, history, links.

Props:

params: { threatId: string }

Uses:

<ThreatDetailHeader />

<ThreatTabs />

Tab components:

<ThreatOverviewTab />

<ThreatCharacterisationTab />

<ThreatScoringTab />

<ThreatDataAITab />

<ThreatHistoryTab />

<ThreatLinksTab />

Events:

onUpdateCharacterisation(payload)

onSubmitRating(payload)

onApproveRating()

onLinkToPIT()

onCreateEvidenceSnapshot()

2.3 ThreatQADashboardPage

Route: /risk/threats/qa

Purpose:
Display Threat QA summary and failures.

Uses:

<ThreatQASummary />

<ThreatQAFailuresTable />

Events:

onRunThreatQA()

onViewThreat(threatId)

3. Core Components
3.1 ThreatSummaryCards

Purpose:
Top-level KPIs.

Props:

type ThreatSummaryCardsProps = {
  totalThreats: number;
  activeThreats: number;
  highExtremeThreats: number;
  increasingThreats: number;
  lastUpdated: string;
};

3.2 ThreatFilterBar

Props:

type ThreatFilterBarProps = {
  typeFilter: 'all' | 'adversarial' | 'non_adversarial';
  statusFilter: 'all' | 'active' | 'archived';
  bandFilter: 'all' | 'low' | 'moderate' | 'high' | 'extreme';
  onFilterChange: (filters: ThreatFilters) => void;
};

3.3 ThreatTable

Props:

type ThreatRowData = {
  id: string;
  name: string;
  type: 'adversarial' | 'non_adversarial';
  category: string;
  band: 'Low' | 'Moderate' | 'High' | 'Extreme';
  trend: 'down' | 'stable' | 'up' | 'strong_up' | 'strong_down';
  lastReviewAt?: string;
};

type ThreatTableProps = {
  threats: ThreatRowData[];
  onSelectThreat: (id: string) => void;
};


Contains:
<ThreatRow />

3.4 ThreatDetailHeader

Props:

type ThreatDetailHeaderProps = {
  name: string;
  type: 'adversarial' | 'non_adversarial';
  category: string;
  band: string;
  trend: string;
  lastReviewAt?: string;
  nextReviewDue?: string;
  onRunQA: () => void;
  onLinkToPIT: () => void;
  onCreateEvidenceSnapshot: () => void;
};

3.5 ThreatTabs

Tabs: Overview | Characterisation | Scoring | Data & AI | History | Links

Props:

type ThreatTabsProps = {
  activeTab: ThreatTabId;
  onTabChange: (tab: ThreatTabId) => void;
};

4. Tab Components
4.1 ThreatOverviewTab

Purpose:
Short narrative summary, key metrics.

Props:

type ThreatOverviewTabProps = {
  threat: ThreatDetail; // from threatService.getThreatDetail
};

4.2 ThreatCharacterisationTab

Purpose:
View and edit threat characterisation.

Props:

type ThreatCharacterisationTabProps = {
  characterisation: ThreatCharacterisation;
  onChange: (updated: ThreatCharacterisationInput) => void;
  onSave: () => void;
  onAISuggest: () => void;
};

4.3 ThreatScoringTab

Purpose:
Score threat dimensions (different layouts for adversarial vs non-adversarial).

Props:

type ThreatScoringTabProps = {
  type: 'adversarial' | 'non_adversarial';
  rating: ThreatRating;
  scales: ThreatScaleByDimension;
  onChangeScore: (dimension: ThreatDimension, value: number) => void;
  onSubmitRating: () => void;
  onApproveRating: () => void;
};

4.4 ThreatDataAITab

Purpose:
Show data signals & AI proposals.

Props:

type ThreatDataAITabProps = {
  dataSignals: ThreatDataSignal[];
  proposedRating?: ThreatRating;
  aiExplanation?: string;
  onRecalculate: () => void;
};

4.5 ThreatHistoryTab

Purpose:
Display rating history (“threat shifting”).

Props:

type ThreatHistoryTabProps = {
  history: ThreatRatingHistoryEntry[];
};

4.6 ThreatLinksTab

Purpose:
List linked BES contexts, Unwanted Events, PIT items.

Props:

type ThreatLinksTabProps = {
  besLinks: ThreatBESLink[];
  unwantedEventLinks: ThreatUnwantedEventLink[];
  pitLinks: ThreatPITLink[];
  onOpenBES: (id: string) => void;
  onOpenUnwantedEvent: (id: string) => void;
  onOpenPITItem: (id: string, type: 'project' | 'task' | 'milestone') => void;
};

5. Modals
5.1 ThreatCreateModal

Purpose:
Create new threat.

Props:

type ThreatCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (input: ThreatCreateInput) => void;
};

5.2 ThreatEditModal

Optional, if inline editing is not enough.

6. State & Hooks
6.1 useThreatStore

(Zustand)

type ThreatTabId = 'overview' | 'characterisation' | 'scoring' | 'data_ai' | 'history' | 'links';

type ThreatStore = {
  selectedThreatId?: string;
  activeTab: ThreatTabId;
  filters: ThreatFilters;
  setSelectedThreatId: (id?: string) => void;
  setActiveTab: (tab: ThreatTabId) => void;
  setFilters: (filters: ThreatFilters) => void;
};

6.2 React Query Hooks

useThreatList(contextId, filters)

useThreatDetail(threatId)

useThreatQA(contextId)

Each calls functions in threatService.ts or threatQAService.ts.

7. Services
7.1 threatService.ts

Wrapper around edge functions:

listThreats(contextId, filters)
→ EF_RISK_LIST_THREATS

getThreatDetail(threatId)
→ EF_RISK_GET_THREAT_DETAIL

createThreat(input)
→ EF_RISK_CREATE_THREAT

updateThreat(input)
→ EF_RISK_UPDATE_THREAT

updateCharacterisation(threatId, payload)
→ EF_RISK_UPDATE_THREAT_CHARACTERISATION

submitThreatRating(threatId, contextId, payload)
→ EF_RISK_SUBMIT_THREAT_RATING

approveThreatRating(ratingId)
→ EF_RISK_APPROVE_THREAT_RATING

recalculateThreatRating(threatId, contextId)
→ EF_RISK_AI_PROPOSE_THREAT_RATING

createThreatEvidenceSnapshot(contextId)
→ EF_RISK_CREATE_THREAT_EVIDENCE_SNAPSHOT

7.2 threatQAService.ts

runThreatQA(contextId) → EF_RISK_RUN_THREAT_QA

listThreatQAResults(contextId) → EF_RISK_LIST_THREAT_QA_RESULTS

8. Integration Navigation

From Threat screens user can:

Jump to BES context pages (/risk/bes/[contextId]).

Jump to Unwanted Events (/risk/events/[id]).

Jump to PIT projects/tasks (/pit/projects/[id], /pit/tasks/[id]).

Jump to Maturity evidence (/maturity/evidence/[snapshotId]).

Navigation is handled via Next.js router, with helpers in a shared navigation util.

9. Versioning

This file:
RISK_THREAT_FRONTEND_COMPONENT_MAP_v0.1

Will be updated once Vulnerability & RCCR modules are wired so that cross-module UI flows become richer.