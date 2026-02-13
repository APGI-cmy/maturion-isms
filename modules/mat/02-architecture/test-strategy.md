# MAT Module — Test Strategy

| Field | Value |
|-------|-------|
| **Module** | MAT (Maturity Assessment Tool) |
| **Version** | v1.0.0 |
| **Status** | Draft |
| **Governance Domains** | 3.10 (Test Strategy and QA Domains), 3.5 (Non-Testable Configuration Failure Boundaries), 3.14 (QA Catalog Alignment) |
| **TRS References** | TR-051 through TR-060 |

---

## 1. QA Domains

| QA Domain | Scope | Priority |
|-----------|-------|----------|
| Functional Correctness | Audit lifecycle, evidence collection, AI scoring, reporting | P0 |
| Security | Authentication, authorization, RLS, encryption, input validation | P0 |
| Performance | Load times, API response times, AI processing times | P0 |
| Accessibility | WCAG 2.1 AA compliance, keyboard nav, screen readers | P1 |
| Offline/Sync | Offline capture, sync on reconnect, conflict resolution | P0 |
| Integration | Supabase, OpenAI API, PIT module, Maturity Roadmap | P0 |
| Data Integrity | SHA-256 hashing, audit trail hash chain, evidence immutability | P0 |
| Compliance | GDPR, POPIA, data retention, consent management | P1 |
| Usability | Responsive design, multi-viewport, i18n | P1 |

---

## 2. Unit Testing (TR-051)

- **Frontend**: Vitest + React Testing Library
  - All React components tested for rendering, user interaction, state changes
  - Zustand stores tested for state management logic
  - Utility functions tested with edge cases
  - Zod schemas tested for validation logic
- **Edge Functions**: Deno test runner
  - Business logic functions tested
  - Request/response validation tested
  - MFA enrollment and validation logic tested
- **AI Services**: pytest + pytest-asyncio
  - Pydantic model validation
  - Service function logic
  - Error handling paths
  - Mock external API calls
- **Coverage Targets**:
  - Overall: 80% line coverage, 70% branch coverage
  - Critical paths (auth, RLS, scoring): 90% line, 80% branch
- **Deterministic**: All tests must be deterministic (no flaky tests)
- **Mocked External APIs**: All external APIs mocked in unit tests
- **Snapshot Testing**: For component rendering verification

---

## 3. Integration Testing (TR-052)

- **Local Supabase**: Docker-based Supabase for integration tests
  - `supabase start` for local development/testing environment
  - Real PostgreSQL with real RLS policies
- **RLS Policy Verification**: Automated tests verify:
  - Organisation isolation (user A cannot see org B data)
  - Role-based write restrictions (evidence contributor cannot approve)
  - Audit trail append-only enforcement
- **MFA Integration**: End-to-end MFA enrollment and verification flows tested against local Supabase Auth
- **AI Contract Tests**: VCR (Video Cassette Recorder) pattern
  - Record real AI responses, replay in tests
  - Verify API request/response schemas match expectations
- **File Upload/Download**: End-to-end with Supabase Storage
  - Upload file → verify hash → download → verify integrity
- **Offline/Online Sync**:
  - Simulate offline → capture evidence → go online → verify sync
  - Conflict resolution verification
- **OpenAPI Contract Validation**: PIT and Maturity Roadmap endpoints match spec

---

## 4. End-to-End Testing (TR-053)

- **Framework**: Playwright
- **Cross-Browser**: Chrome, Firefox, Safari (WebKit)
- **Key Workflows Tested**:
  1. Audit creation → criteria upload → AI parsing → human approval
  2. Evidence collection → AI scoring → human confirmation → report generation
  3. Offline evidence capture → reconnect → sync → verification
  4. User authentication → MFA → role-based navigation
  5. Dashboard drill-down → domain → MPS → criterion
  6. Review table editing → Excel export
- **Visual Regression**: Screenshot comparison at desktop (1024px), tablet (768px), mobile (375px)
- **Duration Target**: Full E2E suite < 15 minutes
- **Test Data**: Seeded test database with known audit, criteria, evidence data

---

## 5. Performance Testing (TR-054)

- **Tool**: k6 or Artillery
- **Load Scenarios**:

  | Scenario | Virtual Users | Duration | Success Criteria |
  |----------|--------------|----------|-----------------|
  | Normal load | 50 concurrent | 5 minutes | p95 < targets (see performance-architecture.md) |
  | Peak load | 100 concurrent | 10 minutes | p95 < targets (see performance-architecture.md), 0% errors |
  | Stress test | 200 concurrent | 5 minutes | Graceful degradation, no crashes |
  | Spike test | 0 → 100 in 10s | 2 minutes | Recovery within 30s |

- **Data Scenarios**:
  - Audit with 2,000 criteria
  - Audit with 10,000 evidence items
  - Dashboard with 100 concurrent viewers
- **Database**: EXPLAIN ANALYZE for all critical queries
- **Memory Profiling**: AI Gateway memory usage under load
- **Performance Budgets**: Enforced in CI (bundle size, LCP, API response times)

---

## 6. Linting and Static Analysis (TR-055, TR-056)

- **TypeScript**: ESLint + @typescript-eslint with eslint-plugin-react, eslint-plugin-react-hooks
- **Python**: Ruff for linting and formatting
- **CSS**: Stylelint for Tailwind CSS
- **SQL**: sqlfluff for SQL migrations
- **Markdown**: markdownlint
- **Formatting**: Prettier (TS/JS), Ruff formatter (Python), pg_format (SQL)
- **Pre-commit**: lint-staged + husky for pre-commit hooks
- **CI**: Zero warnings policy; any warning fails the build

---

## 7. Security Scanning (TR-057)

- **Dependencies**: GitHub Dependabot or Snyk for vulnerability scanning
- **SAST**: CodeQL or Semgrep for static analysis
- **Secrets**: GitHub secret scanning for leaked credentials
- **Container**: Trivy for Docker image scanning
- **RLS Verification**: Automated tests verifying RLS policies
- **OWASP Top 10**: Coverage ensured through combination of tools

---

## 8. CI/CD Pipeline (TR-058)

Pipeline stages (all must pass):

1. **Lint** - ESLint, Ruff, Stylelint (< 1 min)
2. **Type Check** - `tsc --noEmit` (< 1 min)
3. **Unit Tests** - Vitest, pytest (< 3 min)
4. **Integration Tests** - Local Supabase + API tests (< 3 min)
5. **Build** - `pnpm build` + Docker build (< 2 min)
6. **Security Scan** - Dependabot, CodeQL, Trivy (< 2 min)
7. **E2E Tests** - Playwright on staging (< 15 min, parallel to deploy)
8. **Deploy** - Vercel (frontend), ECS (AI Gateway), Supabase (migrations)

- **Total Duration**: < 10 minutes (excluding E2E)
- **Branch Protection**: PR required, 1 review, all checks pass
- **Deployment Strategy**: Blue-green/rolling with automatic rollback on health check failure

---

## 9. Code Coverage (TR-059)

| Scope | Line Coverage | Branch Coverage |
|-------|--------------|----------------|
| Overall | ≥ 80% | ≥ 70% |
| Auth/RLS/Security | ≥ 90% | ≥ 80% |
| AI Scoring Logic | ≥ 90% | ≥ 80% |
| Offline/Sync | ≥ 85% | ≥ 75% |

- **Tracking**: Coverage tracked over time; regression blocks PRs
- **Reporting**: Coverage reports generated in CI and posted to PR

---

## 10. Build and Deploy Automation (TR-060)

- Frontend: `pnpm build` → Vercel deployment
- AI Gateway: Docker multi-stage build → Container registry → ECS deploy
- Migrations: `supabase db push` applied automatically in CI
- Config: Environment variables via deployment platform (12-factor app)
- Rollback: One-click rollback via Vercel (frontend) and ECS task revision (AI Gateway)
- Health Checks: `GET /health` endpoint on all services

---

## 11. Non-Testable Configuration Failure Boundaries (Domain 3.5)

### Non-Testable in CI:

| Configuration | Why Non-Testable | Verification Method |
|--------------|-----------------|-------------------|
| Vercel production env vars | Not available in CI | Post-deployment smoke test |
| DNS resolution | External dependency | Health check on custom domain |
| SSL/TLS certificates | Platform-managed | Certificate monitoring alert |
| Supabase production connection | Separate environment | Post-deployment connectivity check |
| OpenAI API production key | Separate credentials | Health check on AI Gateway |
| CDN cache invalidation | Platform-specific | Cache-busting via content hashes |
| CORS in production | Platform-specific | E2E test against staging (mirrors prod) |

### Runtime-Only Verification:

- Health check endpoints on all services: `GET /health`
- Smoke test suite runs post-deployment (login, create audit, upload evidence)
- Synthetic monitoring (Datadog Synthetics or UptimeRobot)

### Manual Verification Checklist (Post-Deployment):

- [ ] Application loads on production URL
- [ ] Login with test account succeeds
- [ ] MFA enrollment works
- [ ] File upload to Supabase Storage succeeds
- [ ] AI scoring returns result
- [ ] Dashboard displays real-time updates
- [ ] PWA install prompt appears on mobile

### Failure Detection Strategy:

- Health checks every 30 seconds on all services
- Sentry alerts on frontend errors
- Supabase Dashboard for database monitoring
- AI Gateway container health checks with auto-restart

### Rollback Triggers:

| Trigger | Action |
|---------|--------|
| Health check failures > 3 consecutive | Automatic rollback to previous deployment |
| Error rate > 5% for 5 minutes | Alert + manual rollback decision |
| Database migration failure | Automatic rollback via down migration |
| AI Gateway crash loop | Auto-restart; if > 3 restarts → rollback |

---

## 12. Test Data Strategy

- **Development**: Seeded via `supabase/seed.sql` with realistic sample data
- **Integration Tests**: Fixtures created per test, cleaned up after
- **E2E Tests**: Dedicated test organisation with known data
- **Performance Tests**: Generated test data matching production scale
- **Data Isolation**: Each test run uses unique organisation_id to prevent interference
- **No Production Data**: Test environments never use production data

---

## 13. QA Catalog Alignment (Domain 3.14)

- Architecture MUST be frozen before QA Catalog extension
- All QA components will have unique QA IDs, semantic descriptions, and architectural element references
- QA-to-Red tests will be created after architecture freeze (all initially RED)
- Wave planning validation will verify all QA IDs exist and match feature intent
- **MAT is single-wave**: All QA components delivered together

### QA-Catalog Alignment Gate (to be validated after architecture freeze):

- [ ] All assigned QA ranges verified in QA_CATALOG.md
- [ ] All QA definitions match feature intent
- [ ] No QA ID collisions
- [ ] Architecture sections frozen for all features
- [ ] QA-to-Red tests exist and are RED
- [ ] QA-to-Red precondition satisfied
