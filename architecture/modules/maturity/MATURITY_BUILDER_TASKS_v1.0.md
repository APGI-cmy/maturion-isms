# 📘 Maturity Module – Builder Agent Implementation Task Breakdown v1.0

**Version:** 1.0  
**Audience:** Builder Agents (Copilot + Code Gen Agents)  
**Scope:** Step-by-step build instructions to migrate the legacy Maturity module into the ISMS portal and implement all required functionality.

---

## 🔥 GUIDING PRINCIPLES (BUILD PHILOSOPHY)

**Architecture → QA → Build → QA → Release**

- Do NOT implement anything until architecture + QA test exist.
- No regressions.
- No legacy structures.
- All AI calls must go through maturion-ai routing.
- All UI must follow True North UI guidelines (shadcn/ui, Tailwind, Vite, TS).
- All data access must follow ISMS Supabase client + RLS.

---

## 🧱 PHASE 0 — Setup & Preparation

### Task 0.1 — Create new module folder

Create:

```
apps/isms-portal/src/modules/maturity/
```

with subfolders:

```
components/
hooks/
contexts/
lib/
integration/
pages/
tests/
```

### Task 0.2 — Install required dependencies

Ensure:

- React Query
- React Hook Form
- Zod
- shadcn/ui
- Supabase JS client
- Recharts
- Testing tools (Vitest / Playwright)

### Task 0.3 — Link global ISMS context and Supabase client

Use the ISMS global providers for:

- User context
- Organization context
- Supabase client
- AI client

---

## 🧩 PHASE 1 — Code Extraction & Normalization (From Legacy App)

**This phase imports only usable logic, NOT layout, routing, or Vite app shell.**

### Task 1.1 — Extract domain logic

From legacy `/lib/`:

Move to:

```
lib/maturityScoring.ts
lib/assessmentUtils.ts
lib/criteriaUtils.ts
lib/mpsUtils.ts
```

Refactor:

- Convert to TS strict mode
- Remove UI references
- Isolate pure functions

### Task 1.2 — Extract domain → MPS → criteria structures

Refactor to match ISMS schema:

```
domains → mps → criteria → criteria_levels
```

### Task 1.3 — Extract evidence logic

Move:

- evidence upload helpers
- scoring utilities
- file validation

into:

```
integration/evidence.ts
lib/evidenceUtils.ts
```

### Task 1.4 — Extract minimal reusable components

Move into `components/`:

- DomainCard
- MPSCard
- CriteriaCard
- EvidenceCard

Rewrite all components to use:

- shadcn/ui
- True North spacing/typography
- Inline styles removed
- Import paths fixed

### Task 1.5 — DELETE legacy Vite app environment

Remove:

- App.tsx
- main.tsx
- index.css
- vite.config.ts (legacy)

---

## 🧭 PHASE 2 — Routing & Page Assembly (Inside ISMS Portal)

### Task 2.1 — Create Maturity routes

Add to ISMS router:

```
/maturity
/maturity/domains/:domainId
/maturity/domains/:domainId/mps/:mpsId
/maturity/domains/:domainId/mps/:mpsId/criteria/:criteriaId
/maturity/domains/:domainId/evidence/:evidenceId
/maturity/free-assessment
/maturity/reports
```

### Task 2.2 — Implement screens

Create pages:

```
pages/MaturityOverview.tsx
pages/DomainOverview.tsx
pages/MPSManager.tsx
pages/CriteriaEditor.tsx
pages/EvidenceManager.tsx
pages/ApprovalConsole.tsx
pages/MaturityReports.tsx
pages/FreeAssessment.tsx
```

Each page must:

- Use sidebar + topbar + AI side panel layout
- Use React Query for data loading
- Use Supabase type-safe queries
- Use shadcn/ui components

---

## 🧠 PHASE 3 — AI Integration (Maturion-AI Routing)

### Task 3.1 — Replace all direct OpenAI calls

Legacy code must NOT call `openai.createCompletion` etc.

Replace with:

```typescript
const response = await aiRouter.request({
  taskType: 'criteria-generation',
  payload: {...}
});
```

### Task 3.2 — Implement AI operations

Implement:

- Criteria generation
- Evidence evaluation
- MPS generation
- Improvement pathway generation
- Assessment explanations

### Task 3.3 — Integrate Watchdog checks

AI outputs must be tested for:

- Structure compliance
- No hallucinations
- No missing levels
- Domain alignment

---

## 📡 PHASE 4 — Supabase Integration

### Task 4.1 — Implement data access layers

Create:

```
integration/domains.ts
integration/mps.ts
integration/criteria.ts
integration/evidence.ts
integration/approvals.ts
```

Each file must expose:

- `list*`
- `get*`
- `create*`
- `update*`
- `delete*` (soft delete)

### Task 4.2 — Replace legacy SQL / fetch calls

All calls must use the global ISMS Supabase client.

### Task 4.3 — Implement new schema

Ensure mapping to:

```
domains
mps
criteria
criteria_levels
evidence
evidence_ai_scores
approvals
maturity_cycles
baseline_assessments
```

### Task 4.4 — Implement RLS enforcement

Builders must write:

- Row checks
- Column checks
- Organization isolation
- Role isolation (implementer/supervisor/approver/auditor)

---

## 🔄 PHASE 5 — Approval Workflow Implementation

**Approval chain:**

```
Implementer → Supervisor → Approver → External Auditor
```

### Task 5.1 — Implement approval UI

In `pages/ApprovalConsole.tsx`.

### Task 5.2 — Implement approval logic

Using:

```
integration/approvals.ts
```

### Task 5.3 — Implement approval states

- pending
- changes required
- approved
- rejected
- frozen

### Task 5.4 — Approval must trigger PIT tasks

When any approval is rejected:

```
→ create PIT tasks
→ assign according to Integration Map
```

---

## 🗃 PHASE 6 — Evidence Lifecycle Implementation

### Task 6.1 — Evidence upload

Using Supabase storage + metadata table.

### Task 6.2 — Evidence scoring

AI evaluates:

- sufficiency
- relevance
- maturity level

### Task 6.3 — Evidence → criteria mapping

Evidence must attach to criteria.

### Task 6.4 — Evidence approval

Implement evidence-level approval.

### Task 6.5 — Evidence log

Every action logs:

- user
- timestamp
- version
- score
- comments

---

## 📊 PHASE 7 — Reporting

### Task 7.1 — Maturity radar chart

Using Recharts.

### Task 7.2 — Domain status grid

Shows:

- completion
- score
- risk impact
- PIT integration

### Task 7.3 — Historical comparison

Year-over-year maturity comparison.

### Task 7.4 — Export

Generate:

- PDF
- CSV
- JSON

---

## 🧪 PHASE 8 — QA Implementation

### Task 8.1 — Write all architecture tests

Before coding logic.

### Task 8.2 — Write all routing tests

### Task 8.3 — Write RLS tests

### Task 8.4 — Write AI behavior tests

### Task 8.5 — Write evidence lifecycle tests

### Task 8.6 — Ensure 100% critical path coverage

---

## 🧹 PHASE 9 — Cleanup & Removal of Legacy App

**After full migration:**

### Task 9.1 — Remove folder

```
apps/maturion-maturity-legacy/
```

### Task 9.2 — Remove all unused files

Legacy utilities, unused contexts, old styles.

### Task 9.3 — Clean imports

Use absolute imports with:

```
@/modules/maturity/*
```

### Task 9.4 — Update architecture docs

Update changelog and version bump.

---

## 🟢 PHASE 10 — Final Validation

**Builder Agents must confirm:**

- All tests pass
- Watchdog reports clean
- No architecture violations
- Supabase logs clean
- No unused routes
- No console errors
- No missing components

**When ready:**

```
Foreman approves → merge → release candidate
```

---

✔ **END OF BUILDER AGENT IMPLEMENTATION TASK BREAKDOWN v1.0**
