# 📘 **Maturity Module Migration Map v1.0**

**Version:** 1.0  
**Scope:** Migration plan for moving the legacy Maturity App (Genesis Forge) into the unified ISMS Portal.  
**Author:** Foreman  
**Status:** Approved

---

## 0. Purpose

This document defines **exactly how the legacy Maturity application** must be migrated, transformed, and integrated into the **ISMS monorepo**, aligning with:

- Maturity Module Architecture v1.0
- True North
- Integrated ISMS architecture
- Module Integration Map
- SRMF Build Philosophy

This migration eliminates all legacy structure and aligns the module with enterprise-grade ISMS standards.

---

## 1. Migration Overview

The legacy application located at:

```
apps/maturion-maturity-legacy/
```

contains:

- UI components
- Hooks
- Contexts
- Pages
- Integrations
- Evidence and scoring logic
- MPS and Criteria logic

The final destination is:

```
apps/isms-portal/src/modules/maturity/
```

Because **all modules live inside the ISMS Portal**, NOT as standalone apps.

The migration consists of:

| Phase   | Description                                        |
| ------- | -------------------------------------------------- |
| Phase 1 | Extract usable logic & UI from legacy app          |
| Phase 2 | Move assets into ISMS Portal module folder         |
| Phase 3 | Rewrite & align components to True North           |
| Phase 4 | Remove legacy Vite app scaffolding                 |
| Phase 5 | Integrate module with PIT, Analytics, Risk, Skills |
| Phase 6 | Implement QA testing suite                         |
| Phase 7 | Clean up and finalize                              |

---

## 2. File-by-File Migration Map

Below is the exact mapping Foreman expects.

### 2.1 Legacy Folder Structure (Source)

```
apps/maturion-maturity-legacy/src/
  agents/
  components/
  contexts/
  hooks/
  integrations/
  lib/
  pages/
  App.tsx
  main.tsx
  index.css
```

---

## 2.2 Target Structure in ISMS Portal

```
apps/isms-portal/src/modules/maturity/
│
├── components/
├── hooks/
├── contexts/
├── lib/
├── pages/
├── api/
└── integration/
```

---

## 2.3 Exact Migration Instructions

### **A. Components → components/**

Migrate all React UI components that directly support:

- Domain overview
- MPS management
- Criteria editing
- Evidence UI
- Assessment results
- Workflow modals
- Navigation elements
- Cards, lists, grids

These files go to:

```
apps/isms-portal/src/modules/maturity/components/
```

---

### **B. Hooks → hooks/**

Examples:

- `useMaturity()`
- `useDomain()`
- `useAssessment()`
- `useEvidence()`
- `useAI()`

Destination:

```
apps/isms-portal/src/modules/maturity/hooks/
```

Rewrite to use:

- React Query
- New ISMS routing
- New Supabase client wrapper
- True North state management patterns

---

### **C. Contexts → contexts/**

Legacy contexts must be rewritten to match ISMS global context patterns.

Examples:

- Assessment context
- Evidence context

Destination:

```
apps/isms-portal/src/modules/maturity/contexts/
```

---

### **D. Library logic → lib/**

Critical files such as:

- `maturityScoring.ts`
- `assessmentQuestions.ts`
- `domainStructures.ts`
- `criteriaGenerator.ts`

Destination:

```
apps/isms-portal/src/modules/maturity/lib/
```

Some logic will be moved to:

```
packages/common-data-model/
```

if shared across modules.

---

### **E. Pages → pages/**

Legacy pages must be mapped to ISMS routes:

Legacy → New Route

```
pages/MaturityOverview.tsx → /maturity
pages/MPSManager.tsx → /maturity/domains/:domainId/mps/:mpsId
pages/DomainOverview.tsx → /maturity/domains/:domainId
pages/CriteriaEditor.tsx → /maturity/domains/:domainId/mps/:mpsId/criteria/:criteriaId
pages/EvidenceManager.tsx → /maturity/domains/:domainId/evidence
pages/AssessmentResults.tsx → /maturity/reports
FreeAssessmentPage.tsx → /maturity/free-assessment
```

Destination:

```
apps/isms-portal/src/modules/maturity/pages/
```

---

### **F. Supabase network calls → integration/**

Move and rewrite:

- Data fetching
- Inserts
- Updates
- Evidence upload logic
- Approval workflow actions

Destination:

```
apps/isms-portal/src/modules/maturity/integration/
```

Replace raw Supabase calls with:

- new ISMS Supabase client
- global error handling
- unified RLS/permissions
- typed responses

---

## 3. Deletions — What must NOT be migrated

Remove the following (legacy-only):

### ❌ Legacy Vite app structure

```
App.tsx
main.tsx
index.html
vite-env.d.ts
```

### ❌ Any redundant global UI components

These belong in:

```
packages/common-ui/
```

### ❌ Any duplicated Supabase config

ISMS has a single global config.

### ❌ Old routing logic (React Router v6)

ISMS Portal has its own router and layout.

---

## 4. Rewrite Requirements (Mandatory)

The following MUST be rewritten during migration:

### 4.1 Routing

Replace all legacy routes with ISMS nested routing.

### 4.2 State Management

Remove legacy context-based global state where possible.  
Replace with:

- React Query
- Local component state
- Shared stores in ISMS Portal

### 4.3 UI Components

Replace:

- Material UI
- Custom raw components

With:

- shadcn/ui
- Common UI components from `packages/common-ui`

### 4.4 AI Integration

Remove direct OpenAI calls.  
Replace with:

```
supabase edge → maturion-ai → routed model selection
```

### 4.5 Form Handling

Replace uncontrolled forms with:

- React Hook Form
- Zod schemas
- True North validation rules

### 4.6 Evidence Scoring

Must pass through centralized:

```
evidence → ai_evaluator → watchdog → qa rules
```

---

## 5. New ISMS Database Mapping

Legacy tables like:

```
domainTable
mpsTable
criteriaTable
evidenceTable
```

must be replaced with new ISMS schema:

```
domains
mps
criteria
criteria_levels
evidence
evidence_ai_scores
approvals
maturity_cycles
```

Migration script will be created in:

```
infrastructure/db/migrations/
```

---

## 6. Integration Points

The Maturity Module must integrate with:

### 6.1 PIT (Process Integrity Tracker)

- Evidence from PIT flows into Maturity criteria
- Maturity scoring can trigger PIT workflow items
- Shared evidence library

### 6.2 Analytics Module

- Maturity scores feed dashboards
- Historical tracking
- Trend analysis

### 6.3 Risk Module

- Risk assessments reference maturity levels
- Controls validation ties to maturity evidence
- Shared compliance framework

### 6.4 Skills Module

- Skills gaps map to maturity gaps
- Training plans align with maturity roadmaps
- People & Culture domain linkage

### 6.5 Global AI Services

All AI calls routed through:

```
supabase/functions/maturion-ai/
```

with centralized:

- Model selection
- Token management
- Context construction
- Response validation

---

## 7. QA Requirements

Before migration is considered complete, ALL of the following MUST pass:

### 7.1 Unit Tests

- All business logic in `lib/` covered
- Scoring algorithms validated
- Data transformation tests

### 7.2 Integration Tests

- Component interactions
- Hook behavior
- Context provider patterns
- API call mocking

### 7.3 E2E Tests

- Full assessment workflow
- Evidence upload and approval
- Domain navigation
- MPS creation and editing
- Criteria management
- Report generation

### 7.4 Migration Validation

- Data integrity checks
- No orphaned records
- All relationships preserved
- Historical data accessible

### 7.5 Performance Tests

- Page load times
- API response times
- Large dataset handling
- Concurrent user scenarios

See **MATURITY_QA_TEST_SUITE_v1.0.md** for complete test specifications.

---

## 8. Timeline and Rollout

### Phase 1: Extract & Move (Week 1)

- Audit all legacy code
- Identify reusable components
- Create folder structure in ISMS Portal
- Begin moving non-dependent files

### Phase 2: Rewrite Core Logic (Week 2-3)

- Update hooks to React Query
- Rewrite contexts
- Migrate library functions
- Update Supabase calls

### Phase 3: UI Alignment (Week 4)

- Replace Material UI with shadcn/ui
- Update component patterns
- Implement new routing
- Update forms to React Hook Form + Zod

### Phase 4: Integration (Week 5)

- Wire up PIT connections
- Connect to Analytics
- Establish Risk linkage
- Configure AI services

### Phase 5: QA & Testing (Week 6-7)

- Execute full QA test suite
- Fix all identified issues
- Performance optimization
- Security audit

### Phase 6: Data Migration (Week 8)

- Run database migration scripts
- Validate data integrity
- Execute rollback tests
- Backup verification

### Phase 7: Deployment (Week 9)

- Staged rollout plan
- Feature flag configuration
- User acceptance testing
- Production deployment
- Legacy app deprecation

---

## 9. Risk Mitigation

### 9.1 Data Loss Prevention

- Complete database backups before migration
- Rollback scripts prepared
- Dual-run period (legacy + new in parallel)
- Data validation checkpoints

### 9.2 User Impact Minimization

- Feature flags for gradual rollout
- Comprehensive user documentation
- Training materials prepared
- Support team briefed

### 9.3 Technical Risks

- API compatibility layer for gradual migration
- Comprehensive error logging
- Monitoring and alerting configured
- Performance benchmarks established

### 9.4 Rollback Plan

If critical issues arise:

1. Disable new module via feature flag
2. Restore legacy app access
3. Restore database from backup if needed
4. Analyze failure points
5. Re-plan migration approach

---

## 10. Success Criteria

Migration is complete when:

✅ All legacy functionality replicated in ISMS Portal  
✅ 100% of QA tests passing  
✅ All integrations functioning  
✅ Data migration validated  
✅ Performance meets or exceeds legacy app  
✅ Security audit passed  
✅ User acceptance testing approved  
✅ Legacy app fully deprecated  
✅ Documentation complete  
✅ Support team trained

---

## 11. Post-Migration

### 11.1 Legacy Cleanup

- Remove `apps/maturion-maturity-legacy/` entirely
- Clean up old Supabase tables (after data retention period)
- Remove old dependencies
- Update documentation references

### 11.2 Continuous Improvement

- Monitor user feedback
- Track performance metrics
- Identify optimization opportunities
- Plan future enhancements

### 11.3 Documentation Maintenance

- Keep architecture docs updated
- Maintain migration notes for future reference
- Document lessons learned
- Update onboarding materials

---

## 12. References

This migration map aligns with and depends on:

- **MATURITY_MODULE_ARCHITECTURE_v1.0.md** - Target architecture
- **MATURITY_BUILDER_TASKS_v1.0.md** - Implementation tasks
- **MATURITY_QA_TEST_SUITE_v1.0.md** - Quality assurance
- **Module Integration Map v1.0** - Cross-module integration
- **True North Architecture v1.2** - Technical standards
- **ISMS Architecture v1.1** - System-wide patterns
- **Build Philosophy v1.1** - Development principles

---

## 13. Approval & Sign-off

**Document Owner:** Foreman  
**Status:** Approved  
**Version:** 1.0  
**Last Updated:** 2025-12-08

**Approved by:**

- [ ] Foreman (Architecture Lead)
- [ ] Development Team Lead
- [ ] QA Team Lead
- [ ] DevOps Lead
- [ ] Product Owner

**Migration Start Date:** TBD  
**Expected Completion:** TBD  
**Actual Completion:** TBD

---

**End of Document**
