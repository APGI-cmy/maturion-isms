# MATURITY_SCORING_API_CONTRACT_v1.0.md – Changelog

## Version 1.0 (2025-12-08)

**Initial Release**

### What's Included

- Complete API contract for maturity scoring system
- 7 core API endpoints defined:
  - POST /evidence-ai-score (Edge Function)
  - POST /score-maturity-cycle (Edge Function)
  - GET /maturity/criterion/:id/score (Supabase RPC)
  - GET /maturity/mps/:id/score (Supabase RPC)
  - GET /maturity/domain/:id/score (Supabase RPC)
  - GET /maturity/organization/score (Supabase RPC)
  - POST /pit/evaluate-gaps (Edge Function)

### Sections

0. **Purpose** – Contract scope and objectives
1. **API Overview** – Summary table of all endpoints
2. **Evidence AI Scoring API** – AI-powered evidence evaluation
3. **Full Scoring Pipeline API** – Complete cycle scoring orchestration
4. **Read-Only Scoring APIs (RPCs)** – SQL functions for score retrieval
5. **Event Triggers** – Database triggers for automatic scoring propagation
6. **PIT Integration API** – Gap analysis and remediation project creation
7. **Data Flow Summary** – Visual representation of scoring cascade
8. **Error Handling** – Standard error responses and codes
9. **Authentication & Authorization** – Security requirements
10. **Performance Considerations** – Batch loading, caching, debouncing
11. **Testing Contract** – Required test coverage and scenarios
12. **Versioning & Migration** – Version management strategy
13. **Implementation Checklist** – Builder agent roadmap
14. **References** – Links to related documents

### Key Features

- **Foreman-compliant format** – Ready for Builder Agents
- **Complete trigger chain** – Evidence → AI Score → Criterion → MPS → Domain → Org → PIT
- **Deterministic scoring** – Weighted averaging at each hierarchy level
- **Event-driven architecture** – Database triggers + Edge Function subscribers
- **Bidirectional linking** – PIT tasks link back to maturity gaps
- **Performance optimized** – Batch loading to avoid N+1 queries
- **Security first** – RLS enforced, JWT authentication required

### Dependencies

- Scoring Model Database Migration: `infrastructure/db/migrations/20250208_scoring_model.sql`
- Score Maturity Cycle Function: `infrastructure/supabase/functions/score-maturity-cycle/index.ts`
- PIT Integration Requirements: `architecture/modules/pit/PIT_INTEGRATION_REQUIREMENTS_v1.0.md`

### Next Steps

1. Generate SQL migration for RPC functions (`20250208_scoring_api_views.sql`)
2. Implement database triggers for automatic rollup
3. Create Edge Function for PIT gap evaluation
4. Implement Edge Function listeners for scoring queues
5. Add comprehensive test suite
6. Validate end-to-end scoring flow

---

**Status:** ✅ Architecture Approved  
**Owner:** Foreman  
**Target:** Builder Agents + QA Team
