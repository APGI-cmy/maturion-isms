# Audit Lifecycle Guide — Stub v1.0.0

**Agent:** mat-specialist  
**Tier:** 2 (Cached / File-Based)  
**Status:** STUB — Phase 3 MVP  
**Authority:** CS2 (Johan Ras)  
**Date:** 2026-02-21

> **STUB NOTICE**: This knowledge base file is a placeholder. Full content to be authored in Phase 3 implementation sprint.

---

## Purpose

Defines the end-to-end MAT audit lifecycle used by the mat-specialist to guide users through planning, scheduling, conducting, and closing audits.

---

## Scope (Planned)

### Audit Phases
1. **Plan** — Define scope, select domains, assign auditors, set schedule
2. **Prepare** — Load criteria, load evidence checklists, brief audit team
3. **Conduct** — Evidence collection, site observations, interviews, scoring
4. **Review** — Findings collation, scoring validation, corrective action identification
5. **Report** — Draft audit report, findings summary, maturity heat map
6. **Close** — Management sign-off, corrective action tracking, audit record archival

### Key Concepts
- Audit scope and objective
- Domain → MPS → Criteria traceability
- Evidence collection protocols
- Corrective and Preventive Action (CAPA) workflow
- Audit closure criteria and sign-off requirements

### Integrations (Planned)
- `apps/mat/api/audits/**` for live audit state
- `supabase:table=audits` for persistent audit records
- `report-writer-agent` for audit report generation
- `maturity-scoring-agent` for real-time maturity scoring during audit

---

## Pointers

- **Tier 1 (live):** `apps/mat/api/audits/**`
- **Tier 3 (Supabase):** `supabase:table=audits` *(stub — Phase 4)*
- **Constitutional reference:** `Maturion/maturion-world-model.md`

---

**Authority:** CS2 | **Status:** STUB | **Phase:** 3 MVP | **Date:** 2026-02-21
