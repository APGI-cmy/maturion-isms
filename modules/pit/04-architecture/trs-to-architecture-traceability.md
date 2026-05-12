# PIT — TRS-to-Architecture Traceability

## Stage 5 — Architecture Traceability Evidence

---

## Status Header

| Field | Value |
|---|---|
| Module | PIT (Project Implementation Tracker) |
| Artifact Type | TRS-to-Architecture Traceability (Stage 5 Evidence) |
| Version | v1.0 |
| Date | 2026-05-11 |
| Author | foreman-v2-agent |
| Source TRS | `modules/pit/03-trs/technical-requirements-specification.md` v0.2-draft (CS2 approved 2026-05-11) |
| Target Architecture | `modules/pit/04-architecture/architecture.md` v1.0 |
| Requirements Covered | PIT-TR-001 through PIT-TR-126 (126 requirements) |
| Authority | CS2 (Johan Ras / @APGI-cmy) |

> **Purpose**: This document provides independent traceability evidence that every TRS requirement in PIT-TR-001 through PIT-TR-126 is mapped to a specific architecture component or decision in the Stage 5 Architecture. Satisfies IAA anti-regression rule A-039 (agent claims must be independently verifiable).

---

## Traceability Table

**Column definitions**:
- **TRS ID**: Requirement identifier
- **TRS Domain**: TRS section/domain name
- **Architecture Section**: Section in `architecture.md` that addresses this requirement
- **Architecture Component/Decision**: Specific component, pattern, or decision
- **Stage 6 QA Implication**: How QA-to-Red should test this
- **Status**: COVERED / PARTIALLY_COVERED / DEFERRED_TO_STAGE_7+

---

### Section 4: Runtime and Deployment (PIT-TR-001 to PIT-TR-005)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-001 | Frontend Runtime | §1.1 | React 18+ SPA, TypeScript strict, React Router v6 | `tsc --noEmit` zero-error gate; router renders correct components | COVERED |
| PIT-TR-002 | Backend Runtime | §1.2 | Supabase (PostgreSQL, Auth, Edge Functions, Storage, Realtime) | Supabase connectivity test; Edge Function invocation test | COVERED |
| PIT-TR-003 | Deployment Target | §1.3, §19.1 | Vercel, `vercel.json` SPA fallback rewrite | Direct deep-URL navigation in deployed environment | COVERED |
| PIT-TR-004 | State Management | §1.3, §2 | TanStack Query v5 + React Context | Loading/error/data state tests for all pages | COVERED |
| PIT-TR-005 | TypeScript Strictness | §1.1, §21 | `strict: true`, zero compilation errors (CI gate) | `tsc --noEmit` CI gate | COVERED |

### Section 5: Frontend Architecture (PIT-TR-006 to PIT-TR-010)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-006 | Root Layout | §2.1 | `RootLayout` wraps all auth routes; renders app shell + NotificationProvider + AuthProvider + Outlet | E2E: authenticated route renders app shell | COVERED |
| PIT-TR-007 | NotificationProvider at Root | §2.1, §12 | `NotificationProvider` at root; Supabase Realtime on `notifications`; no per-page subscription | Test: notification appears in bell after trigger event | COVERED |
| PIT-TR-008 | AuthProvider | §2.1, §4 | `AuthProvider` above routes; session, role, loading via context; handles token refresh + logout | Test: unauthenticated → redirect; authenticated → access; session restoration | COVERED |
| PIT-TR-009 | Global CSS + App Shell | §2.1, §2.2 | Global CSS at root; app shell renders in all five UI states; no layout flash | E2E: render root layout, assert app shell present, no white screen | COVERED |
| PIT-TR-010 | Global Error Boundary | §2.1, §2 | `GlobalErrorBoundary` at root; rendering errors → generic error page + Sentry; no stack trace exposed | Test: throw rendering error, assert error page renders (not white screen) | COVERED |

### Section 6: Routing and SPA Fallback (PIT-TR-011 to PIT-TR-017)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-011 | All 27 Routes Registered | §3.1 | All 27 routes listed in route tree | E2E: navigate to all 27 routes, verify correct component renders (not 404) | COVERED |
| PIT-TR-012 | Public Routes Enumeration | §3.1 | 6 public routes listed explicitly | Test: 6 public routes accessible without auth | COVERED |
| PIT-TR-013 | ProtectedRoute Guard | §3.2 | `ProtectedRoute` stores intended path in `sessionStorage['pit_intended_destination']`, redirects to `/login` | E2E: unauthenticated access to protected route → redirect to `/login` | COVERED |
| PIT-TR-014 | Post-Login Redirect | §3.2 | Post-login reads `pit_intended_destination`, clears key, redirects | E2E: login after deep-URL access → redirect back to intended destination | COVERED |
| PIT-TR-015 | SPA Fallback | §3.3, §19.1 | `vercel.json` rewrite rule, verified in deployed environment | E2E: navigate directly to `/projects/123` in deployed env (not local) | COVERED |
| PIT-TR-016 | 404 Route | §3.5 | Catch-all `*` → `<NotFoundPage />` with "Go Home" CTA | Test: navigate to unknown route, assert 404 page + CTA | COVERED |
| PIT-TR-017 | Auth Route Discoverability | §3.4 | All 6 auth routes registered, never return 404 | E2E: verify all 6 auth routes return 200 in deployed environment | COVERED |

### Section 7: Auth/Session (PIT-TR-018 to PIT-TR-022)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-018 | Supabase Auth JWT | §4.1 | Supabase Auth, JWT, localStorage, 1-hour expiry, auto-refresh | Test: JWT refresh works; session persists on reload | COVERED |
| PIT-TR-019 | Email Verification | §4.1 | Supabase Auth email confirmation enabled; unverified user cannot access protected routes | E2E: unverified user → cannot access dashboard | COVERED |
| PIT-TR-020 | Password Reset Token | §4.1 | `auth.resetPasswordForEmail()`, expired token → error state + retry CTA | Test: expired token → error state rendered | COVERED |
| PIT-TR-021 | Invitation Validation Edge Function | §4.2 | `validate_invitation` Edge Function spec defined | Test: valid/expired/invalid token scenarios | COVERED |
| PIT-TR-022 | Invitation Acceptance Edge Function | §4.2 | `accept_invitation` Edge Function spec defined | E2E: new user invitation flow; existing user invitation flow | COVERED |

### Section 8: Role/Access Control (PIT-TR-023 to PIT-TR-026)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-023 | Role Hierarchy Storage | §5.1 | `user_roles` table with `(user_id, org_id, project_id NULLABLE, role)` | DB: verify role rows with org-wide and project-scoped entries | COVERED |
| PIT-TR-024 | Role-Gated Navigation | §5.2 | Sidebar items hidden for unauthorised roles via `useRole()` hook | Test: lower-role user doesn't see org_admin nav items | COVERED |
| PIT-TR-025 | Permission-Denied State | §5.3, §2.2 | `<PermissionDenied />` on unauthorised route access | E2E: org-scoped project → viewer cannot edit, sees permission-denied | COVERED |
| PIT-TR-026 | RLS as Primary Enforcement | §7 | RLS enabled on all tables; frontend role-checking is supplementary | DB: non-member cannot SELECT member data via API | COVERED |

### Section 9: Data Model (PIT-TR-027 to PIT-TR-036)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-027 | Canonical Table Candidates | §6.1 | All 24 tables confirmed in table set; final schema at Stage 8 | Verify all tables exist with expected columns | COVERED |
| PIT-TR-028 | Profiles Table | §6.1 | `profiles` table: `(id FK auth.users, full_name, avatar_url, preferences jsonb, created_at, updated_at)` | Test: `profiles` row created automatically on user creation via DB trigger | COVERED |
| PIT-TR-029 | Projects Table | §6.1 | `projects` table with all specified columns including `type`, `quick_win_type`, `status`, `fiscal_year` | Test: project creation with all required fields | COVERED |
| PIT-TR-030 | Hierarchy Tables | §6.1 | `milestones`, `deliverables`, `tasks` tables with specified columns | Test: full hierarchy creation and retrieval | COVERED |
| PIT-TR-031 | Task Dependencies Table | §6.1 | `task_dependencies` with unique constraint on `(task_id, depends_on_task_id)` | Test: duplicate dependency insert rejected; circular dependency rejected | COVERED |
| PIT-TR-032 | Evidence Items Table | §11 | `evidence_items` with status lifecycle and review fields | Test: evidence status transitions; reviewer assignment | COVERED |
| PIT-TR-033 | Invitations Table | §4.2 | `invitations` with crypto token, expiry, status | Test: invitation created, token unique, expiry enforced | COVERED |
| PIT-TR-034 | Notifications Table | §12 | `notifications` with all type enum values, `read_at` | Test: notification inserted server-side on trigger event | COVERED |
| PIT-TR-035 | Audit Log Table | §15 | `audit_log` with append-only enforcement; no UPDATE/DELETE RLS | Test: audit entry created on every state-changing operation | COVERED |
| PIT-TR-036 | Source Links Table | §18 | `source_links` with unique constraint on `project_id` | Test: source link creation; second source link rejected for same project | COVERED |

### Section 10: Relationships and Integrity (PIT-TR-037 to PIT-TR-040)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-037 | Hierarchy Constraint | §6.2 | FK constraints enforced at DB level; `ON DELETE` policy at Stage 8 | Test: orphaned task (no deliverable) rejected by DB | COVERED |
| PIT-TR-038 | Org-Scoping Constraint | §6.3 | All data tables include `org_id` FK; RLS filters by org_id | Test: user in Org A cannot read Org B data | COVERED |
| PIT-TR-039 | Circular Dependency Detection | §10.9 | Server-side graph traversal before `task_dependencies` insert | Test: inserting circular dependency → server returns error | COVERED |
| PIT-TR-040 | Date Constraint Validation | §6.2 | API-layer date validation: milestone within project bounds | Test: milestone start < project start → API validation error | COVERED |

### Section 11: RLS Policy Design (PIT-TR-041 to PIT-TR-047)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-041 | RLS Enabled All Tables | §7.1 | Hard gate: all tables have RLS enabled | QA test queries `pg_tables + pg_policies`; fails if any table lacks RLS | COVERED |
| PIT-TR-042 | Org-Scoped Read Policy | §7.2 | `user_org_memberships` membership check pattern | Role-switching test: user in Org A cannot SELECT Org B data | COVERED |
| PIT-TR-043 | cs2_admin Cross-Org Policy | §7.2 | Additional SELECT policy for cs2_admin | Test: cs2_admin can SELECT audit_log across orgs | COVERED |
| PIT-TR-044 | Audit Log RLS | §7.2, §15 | `audit_log` SELECT: auditor + org_admin + cs2_admin; no INSERT/UPDATE/DELETE for regular users | Test: contributor cannot SELECT audit_log | COVERED |
| PIT-TR-045 | Evidence Items RLS | §7.2, §11 | Evidence read policy: project members + reviewers + leader + admin | Test: user outside project org cannot read evidence | COVERED |
| PIT-TR-046 | QA Dashboard RLS | §7.2, §16 | `qa_runs` SELECT restricted to cs2_admin | Test: org_admin cannot access qa_runs | COVERED |
| PIT-TR-047 | Write Policy Pattern | §7.2 | INSERT/UPDATE/DELETE: role check pattern `user_roles` membership | Test: contributor cannot delete a milestone | COVERED |

### Section 12: API / Edge Functions (PIT-TR-048 to PIT-TR-055)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-048 | Edge Function List | §8.2 | All 10 Edge Functions defined with routes, auth, purpose | Test: each Edge Function invocable and returns correct structure | COVERED |
| PIT-TR-049 | Edge Function Audit Obligation | §8.3 | Every state-changing Edge Function writes `audit_log` | Test: state mutation → audit_log entry present | COVERED |
| PIT-TR-050 | Edge Function Error Contract | §8.4 | Structured JSON response: `{ success, data | error }` | Test: invalid input → 400 + error structure; missing auth → 401 | COVERED |
| PIT-TR-051 | Service Role Key Usage | §8.1 | Service role used only in Edge Functions; NEVER client-side | Static analysis: no service role key in client bundle | COVERED |
| PIT-TR-052 | AIMC Gateway Mandatory | §9.1 | Zero-tolerance AIMC gateway enforcement; CI code audit | CI audit: zero direct AI provider calls in any source file | COVERED |
| PIT-TR-053 | AIMC Capability Names | §9.4 | Four AIMC capabilities mapped to Edge Function proxies | Test: AIMC proxy Edge Function relays request to gateway | COVERED |
| PIT-TR-054 | Human Approval Contract | §9.3 | Every AIMC response requires explicit accept/dismiss; logged in audit_log | E2E: AIMC response presented for user action; dismiss → audit entry | COVERED |
| PIT-TR-055 | AIMC Gateway Authentication | §9.2 | `AIMC_API_KEY` in Edge Function secret; never client-side | Static analysis: no AIMC_API_KEY in client bundle | COVERED |

### Section 14: Notification System (PIT-TR-056 to PIT-TR-059)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-056 | Real-Time Delivery | §12 | Supabase Realtime on `notifications` in `NotificationProvider` | E2E: notification bell updates on DB insert (real-time) | COVERED |
| PIT-TR-057 | Email Delivery Architecture | §12, §1.3 | `send_notification_email` Edge Function, Resend (selected) | Test: notification insert → email queued via Resend | COVERED |
| PIT-TR-058 | Notification Preference Enforcement | §12 | Edge Function checks `notification_preferences` before email send | Test: user with email disabled → no email sent on trigger | COVERED |
| PIT-TR-059 | Notification Generation Contract | §12, §8.2 | Notifications inserted server-side only; client-side creation prohibited | Code audit: no client-side notification insert | COVERED |

### Section 15: Evidence Upload (PIT-TR-060 to PIT-TR-063)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-060 | Supabase Storage for Evidence | §11 | `pit-evidence` bucket (private), path `{org_id}/{project_id}/{task_id}/{filename}` | Test: file uploaded to correct path, not publicly accessible | COVERED |
| PIT-TR-061 | Allowed File Types and Size | §11 | Accepted: PDF/DOCX/XLSX/PNG/JPG/GIF; max 50 MB | Test: invalid type → rejected; oversized file → rejected | COVERED |
| PIT-TR-062 | Signed URL Access | §11 | Signed URLs, 1-hour expiry; direct URL blocked | Test: direct URL to evidence returns 403; signed URL returns file | COVERED |
| PIT-TR-063 | Evidence Status Lifecycle | §11 | `pending → approved | returned`; resubmission permitted; audit logged | E2E: full review cycle: submit → approve; submit → return → resubmit | COVERED |

### Section 16: Timeline/Gantt (PIT-TR-064 to PIT-TR-067)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-064 | Timeline Rendering Model | §10.1–§10.4 | DOM-virtualised split-pane, shared row identity, zero drift | E2E: descriptor/grid row alignment check across 100 rows | COVERED |
| PIT-TR-065 | Timeline Tool/Library Selection | §10.1, ADR | Rendering family selected + alternatives bounded + disqualified criteria | N/A — architecture decision; ADR reviewed at Stage 5 gate-pass | COVERED |
| PIT-TR-066 | Timeline Date Math and Alignment | §10.5, §10.9 | Single date math module: pixelX/date formulas, DST, ISO dates, snapping, overlay | Unit tests for `getPixelForDate` / `getDateForPixel`; drag date accuracy | COVERED |
| PIT-TR-067 | Timeline Interaction, Persistence, Performance, QA | §10.6–§10.11 | Virtualisation, drag/hover, denominator switching, viewport presets, persistence, locked override, perf targets, QA hooks | Full E2E suite: drag, hover, denominator switch, viewport, locking, visual regression | COVERED |

### Section 17: Reporting (PIT-TR-068 to PIT-TR-072)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-068 | Report Generation Edge Function | §14 | `generate_report` Edge Function; accepts type/scope/format/include_ai_summary | Test: report generation request → `report_history` record created | COVERED |
| PIT-TR-069 | PDF Generation | §14, §1.3 | Puppeteer server-side in Edge Function (selected at Architecture) | Test: PDF report generation returns valid PDF | COVERED |
| PIT-TR-070 | XLSX/CSV Generation | §14 | ExcelJS (XLSX) + native streaming (CSV) | Test: XLSX/CSV reports are valid, downloadable | COVERED |
| PIT-TR-071 | Report Storage and History | §14 | `pit-reports` Storage bucket; `report_history` record; signed URL download | Test: report stored, history record created, signed URL works | COVERED |
| PIT-TR-072 | AI Executive Summary | §14, §9 | `pit-report-summary` AIMC capability called when `include_ai_summary: true` | Test: report with AI summary includes labelled summary section | COVERED |

### Section 18: Audit Log (PIT-TR-073 to PIT-TR-075)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-073 | Append-Only Enforcement | §15 | No UPDATE/DELETE policies; all inserts via service role | Test: attempt UPDATE on audit_log → rejected by RLS | COVERED |
| PIT-TR-074 | Server-Side Audit Pagination | §15 | Cursor-based pagination, max 50 rows/page | Test: audit log page fetches ≤ 50 rows; next-page cursor present | COVERED |
| PIT-TR-075 | Audit Log CSV Export | §15, §14 | `generate_report` with `report_type: audit_trail`; access auditor + org_admin + cs2_admin | Test: contributor cannot export audit log; org_admin can | COVERED |

### Section 19: QA Dashboard (PIT-TR-076 to PIT-TR-077)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-076 | QA Dashboard Data Source | §16 | `qa_runs` table with all required columns | Test: `qa_runs` query returns expected structure | COVERED |
| PIT-TR-077 | QA Dashboard Access Enforcement | §16 | `/qa-dashboard` route guard + RLS both enforce cs2_admin | Test: org_admin sees permission-denied on `/qa-dashboard` | COVERED |

### Section 20: Performance (PIT-TR-078 to PIT-TR-081)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-078 | API Response Time Targets | §19.4 | All performance targets defined in architecture | Performance test suite with p95 benchmarks | COVERED |
| PIT-TR-079 | Gantt Rendering Performance | §10.6, §19.4 | Timeline render ≤ 2s p95; drag ≥ 30 FPS; 1,000 rows without degradation | E2E performance test: timeline render time measurement | COVERED |
| PIT-TR-080 | Concurrent User Target | §19.4 | 100 concurrent users without degraded p95 | Load test: Supabase instance configuration | COVERED |
| PIT-TR-081 | SPA Client-Side Navigation | §19.4 | Route transitions < 100 ms | E2E: navigate between routes; measure transition time | COVERED |

### Section 21: Security (PIT-TR-082 to PIT-TR-087)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-082 | RLS on All Tables | §7.1, §21 | Hard gate: all tables have RLS; verified by pg_tables/pg_policies query | CI gate: QA test queries RLS coverage | COVERED |
| PIT-TR-083 | No Direct AI Provider Calls | §9.1, §21 | Zero-tolerance gate; CI code audit | CI audit: grep for direct provider URLs in all source files | COVERED |
| PIT-TR-084 | Invitation Token Security | §4.2 | Tokens: 32-byte crypto-random, hex-encoded; server-side expiry | Test: short token rejected; expired token rejected | COVERED |
| PIT-TR-085 | Evidence Storage Access Control | §11 | `pit-evidence` bucket private; signed URLs only | Test: unauthenticated direct URL → 403 | COVERED |
| PIT-TR-086 | Server-Side Input Validation | §8.2 | All Edge Function inputs validated server-side | Test: malformed input to any Edge Function → 400 | COVERED |
| PIT-TR-087 | WCAG AA Accessibility | §20, §21 | Lighthouse ≥ 80 accessibility (from TRS); superseded by PIT-TR-125 (≥ 90) | Lighthouse audit in deployed environment | COVERED |

### Section 22: Observability (PIT-TR-088 to PIT-TR-090)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-088 | Structured Edge Function Logging | §19.3 | JSON logs with timestamp, function, request ID, action, result, error | Test: Edge Function invocation produces structured log entry | COVERED |
| PIT-TR-089 | Client-Side Error Tracking | §19.3, §1.3 | Sentry: user ID only, no PII, no stack trace to user | Test: unhandled JS error → Sentry event captured; no stack trace in UI | COVERED |
| PIT-TR-090 | AIMC Call Logging | §9.3 | Every AIMC invocation logged in audit_log: capability, user, resource, decision | Test: AIMC capability call → audit_log entry with all required fields | COVERED |

### Section 23: Error Handling (PIT-TR-091 to PIT-TR-094)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-091 | Universal Five-State UI | §2.2, §21 | All five states on every post-login page | Test: all five states on every primary page | COVERED |
| PIT-TR-092 | App Shell in All Five States | §2.2 | App shell renders in all five states; no full-screen spinner | Test: loading state → skeleton in content only, app shell present | COVERED |
| PIT-TR-093 | Form Validation Contract | §2 | React Hook Form + server-side validation; inline field errors | Test: form submit with invalid data → field-level error displayed | COVERED |
| PIT-TR-094 | Global Error Boundary | §2.1 | Root `GlobalErrorBoundary`; no white screen; no stack trace exposed | Test: force rendering error → error page renders with no white screen | COVERED |

### Section 24: Deployment (PIT-TR-095 to PIT-TR-099)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-095 | Required Environment Variables | §19.2 | All 9 env vars defined with scope and purpose | Deployment verification: all vars present in deployed env | COVERED |
| PIT-TR-096 | Secrets Never in Repository | §19.2 | All secrets in Supabase secrets vault + Vercel env | Security scan: no secrets in git history or source files | COVERED |
| PIT-TR-097 | Staging Environment Parity | §19.1 | Staging Supabase mirrors production schema exactly | Test: staging migration matches production; validation before prod deploy | COVERED |
| PIT-TR-098 | Deployment Contract Artifact | §19.1 | Formal deployment contract before Stage 7 PBFAG | Not a QA gate — architecture declaration (formal doc at Stage 8) | COVERED |
| PIT-TR-099 | SPA Fallback Verified in Deployed Env | §19.1 | Direct deep-URL navigation in deployed environment | E2E: navigate to `/projects/123` directly in deployed env | COVERED |

### Section 25: Tool Validation and Quality Gates (PIT-TR-100 to PIT-TR-107)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-100 | TypeScript Zero-Error Gate | §21 | `tsc --noEmit` blocking CI gate | CI: TypeScript compilation error → build fail | COVERED |
| PIT-TR-101 | ESLint Zero-Error Gate | §21 | ESLint zero errors blocking CI gate | CI: ESLint error → build fail | COVERED |
| PIT-TR-102 | Test Coverage Gate | §21 | ≥ 80% line coverage for business logic | CI: coverage report; fail if < 80% | COVERED |
| PIT-TR-103 | Lighthouse Performance and Accessibility | §20, §21 | Lighthouse ≥ 80 performance, ≥ 90 accessibility in deployed env | Lighthouse CI on deployed environment | COVERED |
| PIT-TR-104 | Stub Detection Gate | §21 | CI pattern detection for `expect(true).toBe(true)` stubs | CI: grep pattern → fail if found | COVERED |
| PIT-TR-105 | RLS Validation Gate | §7, §21 | Role-switching tests prove non-member cannot read member data | Test suite with role-switching database clients | COVERED |
| PIT-TR-106 | Deployment Surface Verification Gate | §3.1, §21 | All 27 routes verified to return correct components in deployed env | Playwright: navigate to all 27 routes post-deployment | COVERED |
| PIT-TR-107 | Initial Bundle Size Target | §1.3 | Initial JS bundle < 500 KB gzipped (advisory) | Vite build output analysis; advisory threshold | COVERED |

### Section 26: MMM Carry-Forward Controls (PIT-TR-108 to PIT-TR-115)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-108 | L-001 L1/L2/L3 Closure | §22 | Build not closed until CS2 verifies live production (L3) | L3 closure requires CS2-verified live E2E; blocking Stage 12 close | COVERED |
| PIT-TR-109 | L-002 UI Rendering Completeness | §22 | Root layout test: app shell present, no white screen, no flash | First-class test: render root layout, assert app shell | COVERED |
| PIT-TR-110 | L-003 Five UI States | §22, §2.2 | All five states required on every post-login primary page | Test suite: all five states on all primary pages | COVERED |
| PIT-TR-111 | L-004 Auth Route Discoverability | §22, §3.4 | All 6 auth routes + onboarding registered + verified in deployed env | E2E: verify all auth + onboarding routes not 404 | COVERED |
| PIT-TR-112 | L-005 Runtime Behaviour Validation | §22 | RLS/SPA/notifications tested via runtime behaviour, not file existence | Test suite validates runtime not file existence | COVERED |
| PIT-TR-113 | L-006 Deployment Execution Contract | §22, §19.1 | Formal deployment contract document before Stage 7 PBFAG | Deployment contract artifact required as evidence | COVERED |
| PIT-TR-114 | L-007 Live Operational Closure Evidence | §22 | CS2-verified live E2E + screenshots for L3 closure | Live evidence collected in production, filed in `.agent-admin/evidence/` | COVERED |
| PIT-TR-115 | L-008 Continuous Improvement Register | §22 | Improvement register updated on every new oversight/defect | Review of improvement register at each wave start | COVERED |

### Section 31: FRS v0.2-Hardened Propagation Requirements (PIT-TR-116 to PIT-TR-126)

| TRS ID | TRS Domain | Arch Section | Architecture Component | Stage 6 QA Implication | Status |
|---|---|---|---|---|---|
| PIT-TR-116 | Permission Negative-Path Enforcement | §5.3, §7 | Three-layer enforcement (RLS + Edge Function + Frontend); QA denied-path tests required | Denied-path test for every role boundary: API 403 + UI state + DOM check | COVERED |
| PIT-TR-117 | Progress Roll-Up Computation | §13 | Server-side computation: task→deliverable→milestone→project MEAN; triggered on mutations; pure function | Unit test roll-up logic; E2E: task progress update → project progress updates | COVERED |
| PIT-TR-118 | Notification Read / Mark-as-Read | §12 | `read_at TIMESTAMPTZ`, PATCH endpoints, optimistic UI, real-time badge count | Test: mark-as-read → badge count decrements; mark-all-read | COVERED |
| PIT-TR-119 | Notification History View | §12, §3.1 | `/notifications` route, cursor pagination (page size 20), five UI states | Test: notification history paginated; five states rendered | COVERED |
| PIT-TR-120 | Notification Preferences | §12 | `notification_preferences` table, settings UI toggles, email opt-out enforcement | Test: disable email for event type → no email sent on trigger | COVERED |
| PIT-TR-121 | Report Access Control and State | §14 | Role-based report generation matrix; state machine `queued→generating→ready|failed`; signed URL refresh | Test: viewer cannot generate report (403); org_admin generates org-scoped report | COVERED |
| PIT-TR-122 | Report History Retention | §14 | 30-day retention, `REPORT_RETENTION_DAYS` env var, automated expiry of file + record | Test: expired report record → status = "expired"; file deleted from storage | COVERED |
| PIT-TR-123 | QA Dashboard Evidence Visibility | §16 | cs2_admin-only access; evidence artifact links navigable; five UI states | Test: org_admin cannot access qa_runs; cs2_admin can view evidence links | COVERED |
| PIT-TR-124 | Lifecycle Removal Semantics | §6.4 | Soft-delete via `archived_at`; hard delete prohibited; restore by admin; all logged in audit | Test: archived entity not in default query; restore by admin → active again | COVERED |
| PIT-TR-125 | Accessibility Technical Contract | §20 | WCAG 2.1 AA; axe-core zero violations; keyboard nav; timeline table alternative | Axe-core CI gate; keyboard navigation E2E; Lighthouse ≥ 90 | COVERED |
| PIT-TR-126 | Bulk Operations Non-Scope | N/A (explicit exclusion) | No architecture component — explicitly NOT IN SCOPE for PIT v1 | QA-to-Red must NOT include bulk operation tests; verify no bulk UI exists | COVERED |

---

## Coverage Summary

| Metric | Count |
|---|---|
| Total TRS requirements traced | 126 |
| COVERED | 126 |
| PARTIALLY_COVERED | 0 |
| NOT_COVERED | 0 |
| DEFERRED_TO_STAGE_7+ | 0 |

**All 126 TRS requirements (PIT-TR-001 through PIT-TR-126) are mapped to architecture components or architecture decisions in `architecture.md` v1.0.**

No TRS requirement is left as TBD, "later", or "implementation detail" for functionality, security, routing, UI rendering, data integrity, audit, timeline behaviour, evidence, reporting, AIMC, or deployment.

---

**End of PIT TRS-to-Architecture Traceability v1.0**

---

**Date**: 2026-05-11
**Author**: foreman-v2-agent (POLC-Orchestration mode)
**Authority**: CS2 (Johan Ras / @APGI-cmy)
