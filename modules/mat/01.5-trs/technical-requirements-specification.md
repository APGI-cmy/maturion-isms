# MAT — Technical Requirements Specification (TRS)

**Module**: MAT (Manual Audit Tool)
**Artifact Type**: Technical Requirements Specification
**Status**: COMPLETE
**Version**: v2.0.0  
**Owner**: Foreman (FM)  
**Authority**: Derived from FRS v2.2.0 (`modules/mat/01-frs/functional-requirements.md`)
**Applies To**: MAT module within maturion-isms repository
**Created**: 2026-02-13
**Last Updated**: 2026-03-09

---

## 0. Document Purpose

This document specifies all **technical constraints, performance requirements, integration specifications, security controls, compliance obligations, and tool validation rules** for the Manual Audit Tool (MAT) module. Every technical requirement derives from the finalized Functional Requirements Specification (FRS v1.0.0, 69 requirements: FR-001 to FR-069).

The TRS bridges the gap between the FRS (what the system must do) and Architecture (how the system will be structured). It provides implementation-ready constraints for the architecture stage.

### Derivation Statement

All technical requirements in this document derive from the MAT FRS v1.0.0 (`modules/mat/01-frs/functional-requirements.md`). No technical requirement exists without a traceable source in the FRS. Cross-cutting technical requirements that apply to multiple FRS items are explicitly mapped in the traceability matrix (`frs-to-trs-traceability.md`).

### Technical Requirement ID Convention

All requirements use the format `TR-NNN` where NNN is a three-digit sequential number. Requirements are grouped by technical domain.

### Governance Reference

- **FRS**: `modules/mat/01-frs/functional-requirements.md`
- **App Description**: `modules/mat/00-app-description/MAT_Manual_Audit_Tool_Updated.md`
- **Lifecycle Strategy**: `governance/strategy/MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md` §4.1

---

## 1. Technology Stack Requirements

### TR-001: Frontend Framework

**Derives From**: FR-010, FR-011, FR-033, FR-039, FR-062, FR-063
**Priority**: P0

The frontend MUST be built with React 18+ using TypeScript in strict mode.

**Constraints**:
1. React 18+ with concurrent rendering support.
2. TypeScript 5.0+ with `strict: true` compiler option.
3. Build tooling: Vite 5+ for development and production builds.
4. Component library: Shadcn/UI or equivalent with Tailwind CSS 3+.
5. State management: Zustand or TanStack Query for server state.
6. No class-based components; functional components with hooks only.

---

### TR-002: Backend Platform

**Derives From**: FR-001, FR-002, FR-043, FR-050, FR-051
**Priority**: P0

The backend MUST use Supabase as the primary backend-as-a-service platform.

**Constraints**:
1. Supabase PostgreSQL 15+ for relational data storage.
2. Supabase Auth for authentication and session management.
3. Supabase Storage for file/evidence storage with signed URLs.
4. Supabase Realtime for live dashboard updates.
5. Supabase Edge Functions (Deno runtime) for serverless business logic.
6. Direct PostgREST API for CRUD operations with RLS enforcement.

---

### TR-003: AI/ML Microservices

**Derives From**: FR-005, FR-017, FR-023, FR-028, FR-029
**Priority**: P0

AI and ML processing MUST be implemented as Python microservices.

**Constraints**:
1. Python 3.11+ with type hints enforced.
2. FastAPI framework for REST API endpoints.
3. OpenAI API (GPT-4 Turbo, GPT-4 Vision, Whisper) as primary AI provider.
4. Pydantic v2 for request/response schema validation.
5. AI microservices MUST be stateless; all state persisted in Supabase.
6. Containerized via Docker with multi-stage builds.
7. Each AI capability (parsing, transcription, scoring, reporting) MUST be a separate service or module.

---

### TR-004: Runtime and Platform Constraints

**Derives From**: FR-062, FR-063, FR-047
**Priority**: P0

The system MUST operate within the following platform constraints.

**Constraints**:
1. **Browser Support**: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+.
2. **Mobile OS**: iOS 14+ (Safari), Android 10+ (Chrome).
3. **Node.js**: 20 LTS for build tooling and Edge Functions.
4. **Python**: 3.11+ for AI microservices.
5. **PostgreSQL**: 15+ (via Supabase managed instance).
6. **Docker**: 24+ for container runtime.

---

### TR-005: Deployment Targets

**Derives From**: FR-069, FR-068
**Priority**: P0

The system MUST support the following deployment model.

**Constraints**:
1. Frontend: Static build deployed to Vercel, Netlify, or equivalent CDN-backed host.
2. Backend: Supabase managed cloud (primary) with self-hosted option for enterprise.
3. AI Microservices: Containerized deployment on cloud infrastructure (AWS ECS, GCP Cloud Run, or Azure Container Apps).
4. CI/CD: GitHub Actions for build, test, and deployment pipelines.
5. Infrastructure-as-Code: Terraform or Pulumi for reproducible deployments.

---

### TR-006: Package Management and Monorepo

**Derives From**: FR-055
**Priority**: P0

The project MUST use pnpm workspaces within the maturion-isms monorepo.

**Constraints**:
1. pnpm 8+ as the package manager.
2. Workspace packages in `apps/` (frontend) and `packages/` (shared libraries).
3. Shared TypeScript configuration via `tsconfig.base.json`.
4. Shared ESLint and Prettier configuration at monorepo root.
5. Turborepo or pnpm workspace scripts for task orchestration.

---

## 2. Performance Requirements

### TR-007: Page Load and Navigation Performance

**Derives From**: FR-010, FR-011, FR-039
**Priority**: P0

The system MUST meet the following page load and navigation performance targets.

**Constraints**:
1. Initial page load (cold): < 3 seconds on 4G connection.
2. Subsequent navigation (SPA): < 500ms.
3. Criteria modal open: < 500ms (per FR-011).
4. Dashboard render: < 3 seconds (per FR-039).
5. Largest Contentful Paint (LCP): < 2.5 seconds.
6. First Input Delay (FID): < 100ms.
7. Cumulative Layout Shift (CLS): < 0.1.
8. Bundle size (initial JS): < 300KB gzipped.

---

### TR-008: API Response Time Targets

**Derives From**: FR-001, FR-002, FR-039, FR-042
**Priority**: P0

Backend API endpoints MUST meet the following response time targets.

**Constraints**:
1. CRUD operations (create, read, update): < 200ms p95.
2. List/search queries (paginated): < 500ms p95.
3. Dashboard aggregation queries: < 1 second p95.
4. File upload initiation: < 200ms p95.
5. Real-time subscription latency: < 5 seconds (per FR-039).

---

### TR-009: AI Processing Performance

**Derives From**: FR-005, FR-017, FR-023, FR-035
**Priority**: P0

AI processing endpoints MUST meet the following performance targets.

**Constraints**:
1. Criteria structure parsing (single document): < 60 seconds for documents ≤ 50 pages.
2. AI maturity scoring per criterion: < 30 seconds (per FR-023).
3. Audio transcription: < 2× real-time duration (e.g., 5-min recording → < 10 min).
4. Video processing (snapshot extraction + transcription): < 3× video duration.
5. Report generation (full audit, ≤ 500 criteria): < 2 minutes (per FR-035).
6. Large audit compilation (1000+ criteria): < 5 minutes (per FR-068).
7. AI processing MUST be asynchronous with progress polling or webhook callback.

---

### TR-010: Throughput and Scalability

**Derives From**: FR-018, FR-068, FR-069
**Priority**: P0

The system MUST handle the following throughput and concurrency targets.

**Constraints**:
1. Concurrent users: 100+ per deployment without degradation (per FR-069).
2. Concurrent file uploads: 10+ per user (per FR-018).
3. Maximum criteria per audit: 2000+ (per FR-068).
4. Maximum evidence items per audit: 10,000+ (per FR-068).
5. Database connection pool: minimum 20 connections, auto-scaling to 100.
6. API rate limit: 100 requests/second per user, 1000 requests/second global.

---

### TR-011: Resource Limits

**Derives From**: FR-004, FR-015, FR-016, FR-017
**Priority**: P0

The system MUST enforce the following resource limits.

**Constraints**:
1. Document upload: max 50MB per file (per FR-004).
2. Image upload: max 50MB per file (per FR-015).
3. Video upload: max 500MB per file (per FR-017).
4. Audio recording: max 120 minutes per recording.
5. Total storage per audit: max 50GB.
6. Total storage per organisation: configurable, default 500GB.
7. AI prompt size: max 128K tokens per request (model-dependent).

---

## 3. Data Architecture Requirements

### TR-012: Database Schema Design

**Derives From**: FR-001, FR-002, FR-009, FR-043, FR-050, FR-054
**Priority**: P0

The database schema MUST enforce data integrity and support the application domain model.

**Constraints**:
1. PostgreSQL with UUID primary keys for all tables.
2. `organisation_id` column on all tenant-scoped tables for RLS enforcement.
3. Audit lifecycle states enforced via PostgreSQL CHECK constraints or enum types.
4. Criteria numbering enforced via database constraints (immutability after approval per FR-009).
5. Temporal tables or trigger-based history tracking for audit trail (per FR-051).
6. Foreign key constraints with cascading rules defined per relationship.
7. Indexes on frequently queried columns: `audit_id`, `criterion_id`, `organisation_id`, `status`, `created_at`.
8. Partitioning strategy for audit trail tables (by date or organisation).

---

### TR-013: File Storage Architecture

**Derives From**: FR-004, FR-013, FR-016, FR-017, FR-053
**Priority**: P0

Evidence files MUST be stored in Supabase Storage with integrity guarantees.

**Constraints**:
1. Storage bucket structure: `{organisation_id}/{audit_id}/{criterion_id}/{evidence_type}/{filename}`.
2. SHA-256 hash computed on upload and stored in metadata (per FR-053).
3. Files are immutable after upload; soft delete only (per FR-013).
4. Signed URLs for file access with configurable TTL (default: 1 hour).
5. Storage policies enforce per-file size limits (50MB documents, 500MB video).
6. Virus/malware scanning on upload (via ClamAV or cloud-native scanning).
7. Content-type validation on upload (whitelist of allowed MIME types).

---

### TR-014: Data Serialization and Schemas

**Derives From**: FR-005, FR-023, FR-036, FR-056, FR-057
**Priority**: P0

All data exchange MUST use validated schemas.

**Constraints**:
1. Internal API: JSON with JSON Schema validation.
2. AI input/output: Pydantic models (Python) / Zod schemas (TypeScript).
3. Report export (JSON): Versioned JSON schema with backward compatibility.
4. Integration APIs (PIT, Maturity Roadmap): OpenAPI 3.1 specification.
5. Database migrations: Versioned SQL migrations via Supabase CLI or Flyway.
6. Schema changes MUST be backward-compatible or include migration scripts.

---

### TR-015: Offline Data Storage

**Derives From**: FR-047, FR-048
**Priority**: P0

Offline evidence capture MUST use client-side storage with sync capability.

**Constraints**:
1. IndexedDB for structured offline data (criteria state, metadata).
2. Cache API / OPFS for offline file storage (evidence files).
3. Minimum 1000 evidence items stored locally before sync required (per FR-047).
4. Service Worker for offline request interception and caching.
5. Sync queue with retry logic and conflict resolution (last-writer-wins per FR-048).
6. Offline storage capacity: minimum 2GB reserved.
7. Sync protocol MUST be idempotent (no duplicates on reconnect per FR-048).

---

## 4. Integration Requirements

### TR-016: Supabase Integration

**Derives From**: FR-001, FR-002, FR-043, FR-050, FR-051
**Priority**: P0

The frontend MUST integrate with Supabase using the official client SDK.

**Constraints**:
1. `@supabase/supabase-js` v2+ client library.
2. Auth: Supabase Auth with JWT tokens; MFA via Supabase Auth MFA (per FR-049).
3. Database: PostgREST for CRUD, Supabase Realtime for subscriptions.
4. Storage: Supabase Storage SDK for file upload/download.
5. Edge Functions: Invoked via `supabase.functions.invoke()`.
6. All Supabase calls MUST pass through RLS (no service-role key in frontend).

---

### TR-017: AI Service Integration

**Derives From**: FR-005, FR-017, FR-023, FR-028, FR-029
**Priority**: P0

The system MUST integrate with AI services through a unified gateway.

**Constraints**:
1. AI Gateway service (Python FastAPI) mediates all AI API calls.
2. OpenAI API integration:
   - GPT-4 Turbo for document parsing and maturity evaluation.
   - GPT-4 Vision for image interpretation.
   - Whisper API for audio/video transcription.
   - GPT-4o Mini for cost-optimized routine tasks.
3. API keys stored in environment variables or secret manager (never in code).
4. Request/response logging for every AI invocation (per FR-029).
5. Retry with exponential backoff (per FR-031).
6. Circuit breaker: 10% error rate over 5-minute window triggers fallback (per FR-031).
7. Fallback model configuration per task type.
8. Token usage tracking for cost monitoring.

---

### TR-018: PIT Module Integration

**Derives From**: FR-056
**Priority**: P2

The system MUST expose REST API endpoints for PIT module integration.

**Constraints**:
1. Export endpoint: `GET /api/v1/audits/{audit_id}/findings/export?format=pit`.
2. Response schema defined in OpenAPI 3.1 specification.
3. Organisation isolation enforced via RLS on export queries.
4. Versioned API (`/v1/`) with backward compatibility guarantee.
5. Authentication: Supabase service-role token for inter-module calls.

---

### TR-019: Maturity Roadmap Integration

**Derives From**: FR-057
**Priority**: P2

The system MUST expose REST API endpoints for Maturity Roadmap module integration.

**Constraints**:
1. Export endpoint: `GET /api/v1/audits/{audit_id}/maturity/export?format=roadmap`.
2. Historical comparison endpoint: `GET /api/v1/organisations/{org_id}/maturity/history`.
3. Response schemas defined in OpenAPI 3.1 specification.
4. Organisation isolation enforced via RLS.
5. Versioned API with backward compatibility guarantee.

---

### TR-020: Authentication and Authorization Integration

**Derives From**: FR-043, FR-049, FR-050
**Priority**: P0

Authentication and authorization MUST be integrated end-to-end.

**Constraints**:
1. Supabase Auth as the identity provider.
2. JWT-based session tokens with configurable expiry (default: 1 hour, refresh: 7 days).
3. MFA enforcement for Lead Auditor role (per FR-049): TOTP or SMS.
4. Session timeout: 30 minutes of inactivity (per FR-049).
5. RBAC roles stored in Supabase `auth.users` metadata or custom roles table.
6. RLS policies reference `auth.uid()` and role claims from JWT.
7. Password policy: 12+ characters, uppercase, lowercase, number, special character (per FR-049).

---

### TR-021: External System Data Exchange

**Derives From**: FR-036, FR-037, FR-055
**Priority**: P1

Data exchange with external systems MUST follow standardized formats.

**Constraints**:
1. Report export: DOCX via `docx` npm library, PDF via Puppeteer or `@react-pdf/renderer`.
2. Excel export: `.xlsx` via `exceljs` or `sheetjs` library (per FR-037).
3. JSON export: Versioned schema with JSON Schema validation.
4. CSV export: RFC 4180 compliant for tabular data.
5. All exports include metadata: export timestamp, audit version, schema version.

---

## 5. Security Requirements

### TR-022: Authentication Security

**Derives From**: FR-049
**Priority**: P0

The system MUST implement secure authentication mechanisms.

**Constraints**:
1. Passwords hashed with bcrypt (cost factor ≥ 12) or Argon2id.
2. MFA via TOTP (RFC 6238) mandatory for Lead Auditors.
3. Account lockout after 5 failed login attempts (15-minute lockout).
4. Session tokens: HttpOnly, Secure, SameSite=Strict cookies or secure localStorage.
5. CSRF protection via SameSite cookies and anti-CSRF tokens.
6. Rate limiting on auth endpoints: 10 requests/minute per IP.

---

### TR-023: Row-Level Security Implementation

**Derives From**: FR-050, FR-043, FR-044
**Priority**: P0

RLS MUST be enforced at the database level for all tenant-scoped data.

**Constraints**:
1. Every table with tenant data MUST have RLS enabled.
2. RLS policies MUST use `auth.uid()` and `auth.jwt()` claims.
3. Organisation isolation: users can only read/write data within their organisation.
4. Role-based write restrictions: Domain Auditor writes only to assigned domains, etc.
5. Permission inheritance implemented via RLS policy hierarchy (per FR-044).
6. RLS policies MUST be tested with automated policy verification tests.
7. No `SECURITY DEFINER` functions that bypass RLS without explicit governance approval.

---

### TR-024: Encryption Requirements

**Derives From**: FR-052
**Priority**: P0

All data MUST be encrypted at rest and in transit.

**Constraints**:
1. Data at rest: AES-256 encryption (Supabase managed encryption).
2. Data in transit: TLS 1.3+ for all connections (API, database, storage).
3. Evidence files: Encrypted at rest via Supabase Storage encryption.
4. Database backups: Encrypted with separate encryption keys.
5. API keys and secrets: Stored in environment variables or cloud secret manager.
6. Certificate pinning for mobile PWA (where supported).

---

### TR-025: Audit Trail Security

**Derives From**: FR-051
**Priority**: P0

The audit trail MUST be tamper-evident and immutable.

**Constraints**:
1. Audit log table with append-only policy (no UPDATE or DELETE via RLS).
2. Each log entry includes: SHA-256 hash of the previous entry (hash chain).
3. Log entries include: user ID, timestamp (server-side UTC), action, entity type, entity ID, before state, after state.
4. Minimum retention: 7 years (per FR-051).
5. Log export in JSON and CSV formats for compliance review.
6. Separate database role for audit log access (read-only for auditors).

---

### TR-026: Evidence Integrity

**Derives From**: FR-053, FR-004
**Priority**: P0

Evidence files MUST maintain verifiable integrity.

**Constraints**:
1. SHA-256 hash computed server-side on every file upload.
2. Hash stored in evidence metadata record.
3. Integrity verification endpoint: `GET /api/v1/evidence/{id}/verify`.
4. Hash mismatch triggers a security alert and flags the evidence item.
5. Upload content-type validated against whitelist of allowed MIME types.
6. File extension validated against content-type (no mismatch allowed).
7. Antivirus scan on upload before storage.

---

### TR-027: Input Validation and Sanitization

**Derives From**: FR-001, FR-011, FR-034
**Priority**: P0

All user inputs MUST be validated and sanitized.

**Constraints**:
1. Server-side validation for all inputs (never trust client-side only).
2. SQL injection prevention via parameterized queries (PostgREST handles this).
3. XSS prevention: HTML sanitization on text inputs displayed in UI.
4. File upload validation: content-type, file size, file extension, magic bytes.
5. API request body validation via JSON Schema or Pydantic models.
6. Maximum input lengths enforced: audit title (255 chars), justification (5000 chars), notes (50000 chars).

---

### TR-028: API Security

**Derives From**: FR-029, FR-031
**Priority**: P0

All API endpoints MUST implement security best practices.

**Constraints**:
1. Authentication required for all endpoints (except health checks).
2. Rate limiting: 100 requests/second per user, 1000 requests/second global.
3. CORS: Restrict to known frontend origins only.
4. Request size limit: 50MB for file uploads, 1MB for JSON payloads.
5. Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`.
6. API versioning via URL path (`/api/v1/`).

---

## 6. Data Privacy and Compliance Requirements

### TR-029: GDPR Compliance

**Derives From**: FR-066, FR-058
**Priority**: P0

The system MUST implement GDPR technical requirements.

**Constraints**:
1. Data Subject Access Request (DSAR): Export all personal data in JSON within 72 hours.
2. Right to Erasure: Anonymize personal data while preserving audit integrity.
3. Consent management: Explicit consent recorded with timestamp and scope.
4. Data Processing Records: Maintained in system metadata.
5. Data minimization: Collect only data necessary for audit function.
6. Privacy by design: Default settings are most privacy-protective.

---

### TR-030: POPIA Compliance

**Derives From**: FR-066
**Priority**: P0

The system MUST implement POPIA (Protection of Personal Information Act) technical requirements.

**Constraints**:
1. Personal information processing aligned with POPIA Section 4 conditions.
2. Information Officer designation supported in system configuration.
3. Prior authorization for special personal information processing.
4. Cross-border data transfer controls configurable per organisation.
5. Breach notification workflow: automated alerting within 72 hours.

---

### TR-031: Data Retention

**Derives From**: FR-051, FR-066
**Priority**: P0

Data retention MUST be configurable and enforceable.

**Constraints**:
1. Default audit data retention: 7 years.
2. Audit trail retention: 7 years minimum (per FR-051).
3. Configurable retention policies per organisation.
4. Automated data expiry with soft-delete before permanent removal.
5. Retention policy changes logged in audit trail.
6. Retention compliance dashboard for administrators.

---

### TR-032: Regulatory Standard Alignment

**Derives From**: FR-067
**Priority**: P1

The system architecture MUST support ISO alignment.

**Constraints**:
1. ISO 27001: Information security controls evidenced in system design.
2. ISO 19011: Audit management principles embedded in workflow design.
3. Industry-specific compliance modules configurable per client deployment.
4. Compliance evidence exportable for external audit.

---

## 7. Accessibility and Internationalization Requirements

### TR-033: WCAG 2.1 Level AA Compliance

**Derives From**: FR-064
**Priority**: P1

The frontend MUST meet WCAG 2.1 Level AA standards.

**Constraints**:
1. All interactive elements MUST have ARIA labels.
2. Keyboard navigation MUST work for all functions (Tab, Enter, Escape, Arrow keys).
3. Color contrast ratio: minimum 4.5:1 for normal text, 3:1 for large text.
4. Focus indicators visible on all interactive elements.
5. Screen reader compatibility tested with NVDA, VoiceOver, and TalkBack.
6. Automated accessibility testing via `axe-core` in CI pipeline.
7. No information conveyed by color alone.

---

### TR-034: Responsive Design Implementation

**Derives From**: FR-062
**Priority**: P0

The UI MUST be fully responsive across defined breakpoints.

**Constraints**:
1. Breakpoints: Desktop (≥1024px), Tablet (768px–1023px), Mobile (<768px).
2. CSS: Tailwind CSS responsive utilities (`sm:`, `md:`, `lg:` prefixes).
3. Touch targets: minimum 44×44px for all interactive elements (per FR-062).
4. No horizontal scrolling on any viewport (except data tables with many columns).
5. Images and media: responsive with `srcset` and lazy loading.
6. Testing: Visual regression tests at all three breakpoints.

---

### TR-035: Internationalization (i18n) Implementation

**Derives From**: FR-065
**Priority**: P1

The system MUST support multiple languages.

**Constraints**:
1. i18n framework: `react-i18next` or equivalent.
2. Languages at launch: English (en), Afrikaans (af).
3. All user-facing strings externalized to translation files (JSON).
4. Date/time formatting: `Intl.DateTimeFormat` with locale support.
5. Number formatting: `Intl.NumberFormat` with locale support.
6. RTL layout support: CSS logical properties used throughout (future-ready).
7. Translation files loadable at runtime (code-split per locale).

---

### TR-036: Progressive Web App (PWA) Implementation

**Derives From**: FR-063, FR-047
**Priority**: P1

The system MUST be implemented as a Progressive Web App.

**Constraints**:
1. Service Worker for offline caching (Workbox or equivalent).
2. Web App Manifest with icons, theme color, display mode.
3. Install prompt on supported platforms (iOS, Android, Chrome desktop).
4. Cache strategy: Network-first for API, Cache-first for static assets.
5. Background sync for offline evidence upload (per FR-048).
6. Push notifications for sync completion and alerts (optional).

---

## 8. AI-Specific Technical Requirements

### TR-037: AI Document Parsing Pipeline

**Derives From**: FR-005, FR-006, FR-007
**Priority**: P0

> ⚠️ **PRODUCTION GAP — INC-WAVE15-PARSE-001 (2026-03-08)**: TR-037 constraints are **NOT YET VERIFIED IN PRODUCTION**. The Edge Function (`invoke-ai-parse-criteria`) was never deployed; `AI_GATEWAY_URL` not set; AI Gateway reachability unverified. Remediation: Wave 15R Batch A (api-builder). See `BUILD_PROGRESS_TRACKER.md` §INC-WAVE15-PARSE-001.

Document parsing MUST follow a validated pipeline.

**Constraints**:
1. Document ingestion: Apache Tika or equivalent for text extraction from .doc, .docx, .pdf, .xls, .xlsx, .ppt, .pptx.
2. Text chunking: Split documents into manageable chunks (max 8K tokens per chunk).
3. AI parsing prompt: Include criteria structure schema, no-hallucination rules, and coverage requirements.
4. Output validation: Pydantic model validates AI output against Criteria Structure Schema.
5. Confidence threshold: Items with confidence < 0.85 flagged as `needs_human_review` (per FR-005).
6. Source anchors: Every extracted criterion links to source document location.
7. Coverage report: All source blocks mapped or explicitly marked as non-criteria (per FR-007).
8. Hallucination check: Every criterion must have a `source_anchor` (per FR-006).

---

### TR-038: AI Maturity Scoring Pipeline

**Derives From**: FR-023, FR-024, FR-027
**Priority**: P0

Maturity scoring MUST follow a validated pipeline.

**Constraints**:
1. Evidence aggregation: Collect all evidence items for a criterion before scoring.
2. Evidence-first check: Refuse scoring if < 2 evidence items (per FR-024).
3. Scoring prompt: Include maturity model definitions (Basic through Resilient), evidence items, and scoring rubric.
4. Output validation: Pydantic model validates AI output against Scoring Schema.
5. Confidence threshold: Outputs with confidence < 0.70 flagged for human review (per FR-030).
6. Evidence weighting: Documentary evidence weighted higher than testimonial (per FR-022).
7. Gap analysis: AI must identify immediate, medium-term, and long-term actions.
8. Response time: < 30 seconds per criterion (per FR-023).

---

### TR-039: AI Transcription Pipeline

**Derives From**: FR-014, FR-017, FR-020, FR-021
**Priority**: P0

Audio and video transcription MUST follow a validated pipeline.

**Constraints**:
1. Audio formats: .mp3, .wav, .m4a (per FR-014).
2. Video formats: .mp4, .mov, .avi (per FR-017).
3. Transcription engine: OpenAI Whisper API or equivalent.
4. Output: Timestamped segments with speaker identification (where possible).
5. Language detection: Auto-detect language with manual override.
6. Video processing: Extract audio track via FFmpeg, then transcribe.
7. Snapshot extraction: FFmpeg for keyframe extraction at 10-second intervals (per FR-017).
8. Transcript editability: Transcripts stored as mutable text (per FR-019).

---

### TR-040: AI Model Routing Configuration

**Derives From**: FR-028, FR-029, FR-032
**Priority**: P0

AI model routing MUST be configurable and logged.

**Constraints**:
1. Routing configuration stored in database or config file (not hardcoded per FR-028).
2. Configuration schema:
   ```json
   {
     "task_type": "document_parsing|transcription|scoring|image_analysis|report_generation|routine",
     "primary_model": "gpt-4-turbo",
     "fallback_model": "gpt-4o-mini",
     "max_tokens": 4096,
     "temperature": 0.1
   }
   ```
3. Model version recorded per invocation (per FR-032).
4. Invocation log: model, prompt tokens, completion tokens, latency, cost estimate, timestamp, task type, audit ID, criterion ID (per FR-029).
5. Model upgrades require regression testing (per FR-032).

---

### TR-041: AI Rate Limiting and Circuit Breaker

**Derives From**: FR-031
**Priority**: P1

AI API calls MUST implement rate limiting and fault tolerance.

**Constraints**:
1. Rate limiting: Configurable per model and task type.
2. Retry strategy: Exponential backoff with jitter (base: 1s, max: 60s, max retries: 5).
3. Circuit breaker: Open when error rate > 10% over 5-minute window.
4. Circuit breaker recovery: Half-open after 30 seconds, close after 3 consecutive successes.
5. Fallback: Switch to fallback model when circuit breaker is open.
6. Manual mode: Offered to user when both primary and fallback fail (per FR-031).
7. Metrics: Error rate, circuit breaker state, and fallback usage tracked.

---

## 9. Reporting Technical Requirements

### TR-042: Report Generation Engine

**Derives From**: FR-035, FR-036
**Priority**: P0

Report generation MUST support multiple output formats.

**Constraints**:
1. DOCX generation: `docx` npm library or equivalent with template support.
2. PDF generation: Puppeteer (HTML-to-PDF) or `@react-pdf/renderer`.
3. JSON export: Structured, versioned schema.
4. Report template: Configurable per organisation.
5. Image embedding: Base64-encoded images in DOCX/PDF.
6. Hyperlinks: Evidence hyperlinks preserved in DOCX and PDF.
7. Large reports (500+ criteria): Streaming generation to avoid memory limits (per FR-035).
8. Report generation: Asynchronous with progress indicator.

---

### TR-043: Excel Export Engine

**Derives From**: FR-037
**Priority**: P0

Excel export MUST produce valid .xlsx files.

**Constraints**:
1. Library: `exceljs` for .xlsx generation.
2. All review table columns included (per FR-033).
3. Hyperlinks preserved in Excel cells.
4. Formatting: Headers, borders, column widths auto-sized.
5. Multiple sheets: Summary sheet + per-domain detail sheets.
6. File size optimization: Shared strings, minimal styling.

---

### TR-044: Pre-Report Review Table

**Derives From**: FR-033, FR-034
**Priority**: P0

The structured review table MUST be interactive and editable.

**Constraints**:
1. Virtual scrolling for tables with 1000+ rows (per FR-068).
2. Expandable rows for detailed view.
3. Inline editing with auto-save and audit trail (per FR-034).
4. Column sorting and filtering.
5. Real-time updates via Supabase Realtime subscriptions.
6. Export to Excel available at any time (per FR-037).

---

## 10. Offline and Sync Technical Requirements

### TR-045: Service Worker Architecture

**Derives From**: FR-047, FR-048, FR-063
**Priority**: P0

Offline functionality MUST be implemented via Service Worker.

**Constraints**:
1. Service Worker registration on first visit.
2. Cache strategy: App shell cached for offline access.
3. API caching: Request queue for offline mutations.
4. File caching: Evidence files stored in Cache API or OPFS.
5. Sync trigger: `navigator.onLine` event + periodic sync check.
6. Conflict resolution: Last-writer-wins with full history preserved (per FR-048).
7. Offline duration: 72+ hours without connectivity (per FR-047).

---

### TR-046: Sync Protocol

**Derives From**: FR-048
**Priority**: P0

Data synchronization MUST be reliable and idempotent.

**Constraints**:
1. Sync is idempotent: Retrying a sync operation produces the same result.
2. Deduplication: Client generates UUIDs for offline records; server ignores duplicates.
3. Conflict detection: Server checks `updated_at` timestamp against client version.
4. Conflict resolution: Last-writer-wins; both versions stored in audit trail.
5. Partial sync recovery: If connectivity drops during sync, remaining items sync on next connection.
6. Sync status: Per-item sync status tracked (pending, syncing, synced, failed).
7. Sync retry: Failed items retried with exponential backoff (max 5 retries).

---

## 11. UI Component Technical Requirements

### TR-047: Criteria Modal Component

**Derives From**: FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017
**Priority**: P0

The criteria modal MUST support all evidence types and workflows.

**Constraints**:
1. Modal framework: React Portal with focus trap and keyboard navigation.
2. Tabs/sections: Description, Not Used, Evidence (Text, Voice, Photo, Document, Video), Findings, Interview.
3. Unsaved data protection: Confirmation prompt on close with pending changes.
4. Responsive: Full-screen on mobile, dialog on desktop.
5. Performance: Lazy-load evidence attachments; render modal in < 500ms.
6. Accessibility: ARIA dialog role, focus management, escape-to-close.

---

### TR-048: Dashboard Components

**Derives From**: FR-039, FR-040, FR-041, FR-042
**Priority**: P0

Dashboard components MUST be performant and real-time.

**Constraints**:
1. Chart library: Recharts, Chart.js, or equivalent with React integration.
2. Real-time updates: Supabase Realtime subscriptions with max 5-second lag (per FR-039).
3. Drill-down navigation: Click-through from global → domain → MPS → criterion.
4. Virtual scrolling for large data sets.
5. Aggregation queries: Materialized views or database functions for performance.
6. Loading states: Skeleton loaders during data fetch.

---

### TR-049: Evidence Upload Component

**Derives From**: FR-013, FR-018
**Priority**: P0

The evidence upload component MUST support all evidence types with concurrent upload.

**Constraints**:
1. Drag-and-drop file upload support.
2. Camera capture via `getUserMedia` API (mobile).
3. Voice recording via `MediaRecorder` API.
4. Concurrent uploads: 10+ files simultaneously with individual progress (per FR-018).
5. Upload chunking for large files (> 5MB): Resumable uploads via tus protocol or Supabase resumable upload.
6. Client-side file validation before upload (type, size, extension).
7. Preview generation: Thumbnails for images, waveform for audio, first frame for video.

---

### TR-050: Navigation Component

**Derives From**: FR-010
**Priority**: P0

Hierarchical navigation MUST support the Domain → MPS → Criteria structure.

**Constraints**:
1. Tree view or accordion pattern for hierarchy navigation.
2. Breadcrumb trail showing current position.
3. Status indicators at each level (completion %, color coding).
4. Keyboard navigable (arrow keys, Enter to expand/collapse).
5. Lazy loading of children nodes for large audits (2000+ criteria).
6. Search/filter within navigation tree.

---

## 12. Testing Requirements

### TR-051: Unit Testing

**Derives From**: All FR requirements (cross-cutting)
**Priority**: P0

All code MUST have unit test coverage.

**Constraints**:
1. Frontend: Vitest with React Testing Library.
2. Backend (Edge Functions): Deno test runner.
3. AI Microservices: pytest with pytest-asyncio.
4. Minimum code coverage: 80% line coverage, 70% branch coverage.
5. Tests MUST be deterministic (no flaky tests allowed).
6. Mocking: External API calls mocked in unit tests.
7. Snapshot testing for critical UI components.

---

### TR-052: Integration Testing

**Derives From**: FR-016, FR-017, FR-048, FR-056, FR-057
**Priority**: P0

Integration points MUST have automated integration tests.

**Constraints**:
1. Database integration: Tests against local Supabase instance (via Docker).
2. RLS policy testing: Automated verification that RLS policies enforce correct access.
3. AI service integration: Contract tests with recorded responses (VCR pattern).
4. File upload/download: End-to-end upload, storage, retrieval, integrity check.
5. Sync protocol: Offline/online simulation tests.
6. API integration: OpenAPI contract validation tests.

---

### TR-053: End-to-End Testing

**Derives From**: FR-001, FR-002, FR-023, FR-035
**Priority**: P0

Critical user workflows MUST have E2E test coverage.

**Constraints**:
1. Framework: Playwright for cross-browser E2E testing.
2. Critical flows covered:
   - Audit creation → criteria upload → AI parsing → approval.
   - Evidence collection → AI scoring → human confirmation → report.
   - Offline capture → sync → verification.
3. Visual regression testing at desktop, tablet, and mobile breakpoints.
4. Tests run in CI against staging environment.
5. Maximum E2E test suite duration: 15 minutes.

---

### TR-054: Performance Testing

**Derives From**: FR-068, FR-069
**Priority**: P1

The system MUST undergo performance testing for scale requirements.

**Constraints**:
1. Load testing tool: k6 or Artillery.
2. Scenarios: 100 concurrent users, 2000 criteria per audit, 10000 evidence items.
3. Performance budgets enforced in CI (page load, API response times).
4. Database query performance: EXPLAIN ANALYZE for all critical queries.
5. Memory profiling for report generation and large audit handling.

---

## 13. Tooling and Quality Gate Requirements

### TR-055: Linting and Static Analysis

**Derives From**: All FR requirements (cross-cutting)
**Priority**: P0

All code MUST pass linting and static analysis.

**Constraints**:
1. TypeScript: ESLint with `@typescript-eslint` plugin, strict rules.
2. React: `eslint-plugin-react`, `eslint-plugin-react-hooks`.
3. Python: Ruff for linting and formatting; mypy for type checking.
4. CSS: Stylelint for Tailwind CSS.
5. SQL: sqlfluff for database migration linting.
6. Markdown: markdownlint for documentation.
7. Zero warnings policy: All warnings treated as errors in CI.

---

### TR-056: Code Formatting

**Derives From**: All FR requirements (cross-cutting)
**Priority**: P0

All code MUST be automatically formatted.

**Constraints**:
1. TypeScript/JavaScript: Prettier with consistent configuration.
2. Python: Ruff formatter (Black-compatible).
3. SQL: pg_format or sqlfluff fix.
4. Pre-commit hooks: lint-staged + husky for pre-commit formatting.
5. CI check: Formatting verification in CI pipeline (fail on unformatted code).

---

### TR-057: Security Scanning

**Derives From**: FR-049, FR-050, FR-052, FR-053
**Priority**: P0

Automated security scanning MUST be integrated into CI/CD.

**Constraints**:
1. Dependency scanning: GitHub Dependabot or Snyk for known vulnerabilities.
2. SAST: CodeQL or Semgrep for static application security testing.
3. Secret scanning: GitHub secret scanning enabled.
4. Container scanning: Trivy for Docker image vulnerability scanning.
5. RLS policy verification: Custom test suite validating RLS enforcement.
6. OWASP Top 10: Addressed in architecture and validated in testing.

---

### TR-058: CI/CD Pipeline

**Derives From**: All FR requirements (cross-cutting)
**Priority**: P0

The CI/CD pipeline MUST enforce quality gates.

**Constraints**:
1. Platform: GitHub Actions.
2. Pipeline stages:
   - Lint (TypeScript, Python, SQL, Markdown)
   - Type check (TypeScript strict, mypy)
   - Unit tests with coverage report
   - Integration tests
   - Build (frontend + AI services)
   - Security scan
   - E2E tests (on staging)
   - Deploy (staging → production with approval gate)
3. Pipeline duration target: < 10 minutes for lint + test + build.
4. Branch protection: PR required, 1+ review, all checks passing.
5. Deployment: Blue-green or rolling deployment with rollback capability.
6. Environment promotion: staging → production with manual approval.

---

### TR-059: Code Coverage Thresholds

**Derives From**: All FR requirements (cross-cutting)
**Priority**: P0

Code coverage MUST meet minimum thresholds.

**Constraints**:
1. Overall line coverage: ≥ 80%.
2. Overall branch coverage: ≥ 70%.
3. Critical paths (auth, RLS, AI scoring): ≥ 90% coverage.
4. Coverage reports generated in CI and tracked over time.
5. Coverage regression: PR blocked if coverage drops below threshold.

---

### TR-060: Build and Deploy Automation

**Derives From**: TR-005, TR-058
**Priority**: P0

Build and deployment MUST be fully automated.

**Constraints**:
1. Frontend build: `pnpm build` produces optimized static assets.
2. AI services build: Docker multi-stage build produces minimal images.
3. Database migrations: Applied automatically in deployment pipeline.
4. Environment configuration: Managed via environment variables (12-factor app).
5. Rollback: One-click rollback to previous version.
6. Health checks: `/health` endpoint on all services; deployment fails if health check fails.

---

## 14. Observability and Monitoring Requirements

### TR-061: Application Monitoring

**Derives From**: FR-059, FR-060
**Priority**: P1

The system MUST implement comprehensive monitoring.

**Constraints**:
1. Application Performance Monitoring (APM): Sentry, Datadog, or equivalent.
2. Frontend error tracking: Automatic capture of unhandled exceptions.
3. Backend error tracking: Structured logging with correlation IDs.
4. AI service monitoring: Token usage, latency, error rates per model.
5. Dashboard: Operational dashboard for system health metrics.

---

### TR-062: Watchdog Implementation

**Derives From**: FR-059, FR-060
**Priority**: P1

Watchdog metrics MUST be tracked and alertable.

**Constraints**:
1. Metrics storage: Time-series database or Supabase table with time-based partitioning.
2. Alert channels: Email, Slack/Teams webhook, SMS (configurable per alert type).
3. Alert thresholds per FR-060:
   - AI refusal rate > 15%.
   - AI override rate > 25%.
   - Sync failure rate > 5%.
   - Unauthorized access attempts > 0.
   - Response time > 95th percentile threshold.
4. Alert escalation: Configurable escalation chain.
5. Alert suppression: Deduplication within configurable window.

---

### TR-063: Structured Logging

**Derives From**: FR-029, FR-051, FR-059
**Priority**: P0

All services MUST implement structured logging.

**Constraints**:
1. Log format: JSON with consistent field names.
2. Required fields: `timestamp`, `level`, `service`, `correlation_id`, `message`.
3. Log levels: DEBUG, INFO, WARN, ERROR, FATAL.
4. Correlation ID: Propagated across frontend → backend → AI services.
5. PII protection: Personal data masked or excluded from logs.
6. Log aggregation: Centralized logging (CloudWatch, Loki, or equivalent).
7. Log retention: 90 days hot, 1 year cold storage.

---

## 15. Infrastructure Requirements

### TR-064: Container Architecture

**Derives From**: TR-003, TR-005
**Priority**: P0

AI microservices MUST be containerized.

**Constraints**:
1. Base images: `python:3.11-slim` for AI services.
2. Multi-stage builds: Separate build and runtime stages.
3. Image size: < 500MB per service image.
4. Health check: `/health` endpoint responding within 5 seconds.
5. Graceful shutdown: Handle SIGTERM with connection draining.
6. Resource limits: CPU and memory limits defined per container.

---

### TR-065: Database Infrastructure

**Derives From**: TR-002, TR-012
**Priority**: P0

Database infrastructure MUST support production requirements.

**Constraints**:
1. Supabase managed PostgreSQL (primary).
2. Connection pooling: PgBouncer (included in Supabase).
3. Backup: Daily automated backups with 30-day retention.
4. Point-in-time recovery: Enabled for production.
5. Read replicas: Available for reporting/analytics queries (if needed).
6. Database monitoring: Query performance, connection count, storage usage.

---

### TR-066: CDN and Static Asset Delivery

**Derives From**: TR-005, TR-007
**Priority**: P0

Static assets MUST be served via CDN.

**Constraints**:
1. CDN: Vercel Edge Network, Cloudflare, or equivalent.
2. Cache headers: Immutable for hashed assets, short TTL for HTML.
3. Compression: Brotli (preferred) or gzip for all text assets.
4. Image optimization: WebP/AVIF format with fallback.
5. Asset fingerprinting: Content hash in filenames for cache busting.

---

## 16. Consent and Privacy Technical Requirements

### TR-067: Consent Management System

**Derives From**: FR-058, FR-066
**Priority**: P0

Consent MUST be technically enforceable.

**Constraints**:
1. Consent records stored in database with: user ID, consent type, granted/revoked, timestamp, IP address.
2. Consent check: Enforced at API level before processing personal data.
3. Consent withdrawal: Immediately effective; stops all related processing.
4. Consent UI: Clear language, granular options, easy withdrawal.
5. Cookie consent: Banner with accept/reject/customize options.

---

### TR-068: Data Anonymization

**Derives From**: FR-026, FR-058, FR-066
**Priority**: P1

Personal data MUST be anonymizable for AI training and analytics.

**Constraints**:
1. Anonymization function: Replace personal identifiers with pseudonyms.
2. Anonymization is irreversible (one-way transformation).
3. Anonymized datasets usable for AI model improvement (per FR-026).
4. Anonymization scope: Client names, auditor names, organisation names, locations.
5. Audit trail entries: Anonymizable on request while preserving action sequence.

---

## 17. Video and Media Processing Requirements

### TR-069: Video Processing Pipeline

**Derives From**: FR-017
**Priority**: P0

Video processing MUST be implemented as an asynchronous pipeline.

**Constraints**:
1. FFmpeg for video processing (audio extraction, snapshot extraction, transcoding).
2. Audio extraction: Output as .wav or .mp3 for transcription.
3. Snapshot extraction: Keyframes every 10 seconds + scene change detection.
4. Thumbnail generation: 320×240px thumbnails for snapshot selection UI.
5. Metadata extraction: Duration, resolution, codec, frame rate, file size.
6. Processing queue: Background job queue (Celery, Bull, or equivalent).
7. Progress tracking: WebSocket or polling for processing status updates.
8. Error handling: Corrupt files detected and rejected before processing.
9. Resource limits: Maximum 2 concurrent video processing jobs per service instance.

---

### TR-070: Audio Processing

**Derives From**: FR-014, FR-020, FR-021
**Priority**: P0

Audio recording and processing MUST be implemented in the browser and backend.

**Constraints**:
1. Browser recording: `MediaRecorder` API with .webm or .wav output.
2. Recording controls: Start, pause, resume, stop with visual feedback.
3. Audio format conversion: Server-side conversion to .mp3 for storage optimization.
4. Transcription: Whisper API with language detection.
5. Timestamp alignment: Transcript timestamps aligned to recording timeline.
6. Maximum recording duration: 120 minutes per session.

---

### TR-071: Frontend Application as Deployable Artifact

**Derives From**: FR-070, FR-071, TR-001, TR-006
**Priority**: P0

The MAT frontend MUST be delivered as a complete, deployable React 18+ application within the monorepo workspace.

**Constraints**:
1. Application location: `apps/mat-frontend/` within the pnpm workspace (per TR-006).
2. Framework: React 18+ with Vite 5+ (per TR-001). This is the authoritative specification; App Description §16.3 (Next.js) is superseded.
3. Build output: `pnpm build` produces optimized static assets deployable to Vercel (per TR-005).
4. Development: `pnpm dev` starts a local development server with hot module replacement.
5. Package manifest: `package.json` with correct workspace dependencies and scripts.
6. All UI components specified in the UI Component Architecture (`ui-component-architecture.md`) are imported and rendered in the application.
7. Routing: Client-side routing for all major sections (audits, criteria, evidence, scoring, dashboards, reports).
8. Entry point: `src/main.tsx` bootstraps the React application with providers (auth, query client, store).

> **Governance Note (2026-02-16)**: This TR was added because the existing TRs (TR-001 through TR-070) define the technical constraints for individual components but do NOT require their assembly into a deployable application. Without this TR, all component-level tests could pass while no working application exists. See BUILD_PROGRESS_TRACKER.md Deviation #9.

---

### TR-072: Embedded AI Assistant Component (AIMC Advisory Integration)

**Derives From**: FR-072, FR-028, FR-029, FR-065
**Priority**: P0
**Constitutional Authority**: `AIMC_STRATEGY.md` v1.0.0
**AIMC Prerequisite**: **BLOCKED — Cannot be executed before AIMC Wave 3 (Advisory Gateway) is complete**

> **⚠️ AIMC BLOCKER**: This TR MUST NOT be implemented until `@maturion/ai-centre` exposes the
> Advisory Gateway (AIMC Wave 3). Direct provider SDK imports, API keys, or model strings in MAT
> are constitutionally prohibited. Builders MUST NOT proceed until POLC/CS2 confirms AIMC Wave 3
> is complete.

The MAT frontend MUST include an embedded AI assistant React component accessible from every
application page, consuming AI advisory capability exclusively via the `@maturion/ai-centre` Gateway.

**Constraints**:
1. Component location: `src/components/common/EmbeddedAIAssistant.tsx` within the MAT frontend application.
2. Persona selection: The component MUST expose a selector for personas sourced from the AIMC
   canonical agent directory — at minimum: Maturity Advisor, Scoring Assistant, Document Parser,
   Report Writer. Persona identifiers are defined by the AIMC package, not by MAT.
3. Chat UI: The component MUST provide a collapsible panel containing a message history log, text
   input, and send control.
4. Layout wiring: The component MUST be rendered in the application Layout so it is present on every
   authenticated page.
5. Gateway routing: All AI invocations MUST call `@maturion/ai-centre` Gateway methods. No direct
   provider calls are permitted. No provider API keys in the React bundle.
6. AIMC reference ID: The component MUST capture the AIMC invocation reference ID from Gateway
   responses for audit-domain logging per TR-017.
7. Accessibility: The panel MUST include ARIA labels, `aria-expanded`, `role="dialog"`, `role="log"`
   per WCAG 2.1 AA (TR-035).
8. Pre-AIMC-Wave-3 state: Until AIMC Wave 3 is delivered, the component renders a disabled/locked
   state with appropriate user messaging. The application MUST NOT crash.
9. No secrets in frontend: No AI provider API keys or model configuration in the React bundle.

> **Governance Note (2026-02-23)**: TR-072 realigned to AIMC Gateway pattern per `AIMC_STRATEGY.md`
> v1.0.0. Prior constraint describing placeholder responses wired to AI Gateway routing table
> (TR-040) is superseded — all AI routing is now an AIMC responsibility. Direct provider references
> removed. See BUILD_PROGRESS_TRACKER.md AIMC deviation entry and Issue #377 (superseded).

---

### TR-073: AI Gateway Persona Loading Implementation

**Derives From**: FR-073
**Priority**: P0
**Constitutional Authority**: `AIMC_STRATEGY.md` v1.0.0; `ai-architecture.md` v2.0.0
**AIMC Prerequisite**: AIMC Wave 2 (PersonaLoader) — **COMPLETE**

The `buildAICentre()` factory in `api/ai/request.ts` MUST wire the `PersonaLoader` class from `@maturion/ai-centre` as the `personaLoader` collaborator. The `nullPersonaLoader` stub MUST be removed.

**Constraints**:
1. Import: `import { PersonaLoader } from '../../packages/ai-centre/src/personas/PersonaLoader.js'`
2. Factory: `buildAICentre()` passes `new PersonaLoader()` as `personaLoader` in the `AICentreConfig`.
3. The null stub (`nullPersonaLoader`) MUST be removed entirely from the module.
4. Path traversal protection is provided by `PersonaLoader.validateAgentId()` — no additional sanitisation in the gateway.
5. `PersonaLoader.listAvailable()` MUST return the real directory listing from `packages/ai-centre/src/agents/`.

**Test Requirements** (must be RED before implementation, GREEN after):
- T-073-1: `buildAICentre()` uses a real `PersonaLoader` instance (not null stub) — verify via constructor name or behavioural test.
- T-073-2: Persona loading returns non-empty content for a known valid agent ID.

---

### TR-074: AI Gateway Session Memory Implementation

**Derives From**: FR-074
**Priority**: P1
**Constitutional Authority**: `AIMC_STRATEGY.md` v1.0.0

The `buildAICentre()` factory in `api/ai/request.ts` MUST wire the `SessionMemoryStore` class from `@maturion/ai-centre` as the `sessionMemory` collaborator. The `nullSessionMemory` stub MUST be removed.

**Constraints**:
1. Import: `import { SessionMemoryStore } from '../../packages/ai-centre/src/memory/SessionMemoryStore.js'`
2. Factory: `buildAICentre()` passes `new SessionMemoryStore()` as `sessionMemory`.
3. The null stub (`nullSessionMemory`) MUST be removed entirely from the module.
4. `getHistory(sessionId)` MUST return accumulated turns (not always empty `[]`).
5. Cross-invocation persistence: NOT required at Wave 10 (each serverless invocation creates a fresh instance; see Wave 11 Supabase scope).

**Test Requirements** (must be RED before implementation, GREEN after):
- T-074-1: `SessionMemoryStore` accumulates turns — `append()` followed by `getHistory()` returns non-empty array.
- T-074-2: Null stub behaviour no longer present — history is not always `[]` after append.

---

### TR-075: AI Gateway Persistent Memory Baseline

**Derives From**: FR-075
**Priority**: P1
**Constitutional Authority**: `AIMC_STRATEGY.md` v1.0.0; Wave 4 Supabase deferral plan

The `buildAICentre()` factory in `api/ai/request.ts` MUST wire the `PersistentMemoryAdapter` class from `@maturion/ai-centre` as the `persistentMemory` collaborator. The `nullPersistentMemory` stub MUST be removed.

**Constraints**:
1. Import: `import { PersistentMemoryAdapter } from '../../packages/ai-centre/src/memory/PersistentMemoryAdapter.js'`
2. Factory: `buildAICentre()` passes `new PersistentMemoryAdapter()` as `persistentMemory`.
3. The null stub (`nullPersistentMemory`) MUST be removed entirely from the module.
4. `retrieve()` MUST return stored entries (not always empty `[]`).
5. `persist()` MUST store entries in the backing store.
6. The Supabase-backed adapter (reading from `ai_memory` table — see `supabase/migrations/001_ai_memory.sql`) is Wave 11 scope; the in-memory baseline is Wave 10 scope.
7. The Supabase deferral MUST be documented in `AI_GATEWAY_MEMORY_RUNBOOK.md` with migration path.

**Test Requirements** (must be RED before implementation, GREEN after):
- T-075-1: `PersistentMemoryAdapter.persist()` then `retrieve()` returns stored entry (not always `[]`).
- T-075-2: Null stub behaviour no longer present — retrieve is not always `[]` after persist.

---

### TR-076: AI Gateway Health Check Endpoint

**Derives From**: FR-076
**Priority**: P1

The API MUST expose a serverless handler at `api/ai/health.ts` implementing the `GET /api/ai/health` endpoint.

**Constraints**:
1. File location: `api/ai/health.ts`.
2. Handler signature: `(req: IncomingMessage, res: ServerResponse) => Promise<void>` (mirrors `api/ai/request.ts` pattern).
3. `GET /api/ai/health` returns HTTP 200 with JSON body:
   ```json
   {
     "status": "ok",
     "personaLoader": "real",
     "sessionMemory": "in_memory",
     "persistentMemory": "in_memory",
     "supabaseWiring": "pending_wave11"
   }
   ```
4. Non-GET methods return HTTP 405 Method Not Allowed.
5. No authentication required on this endpoint.
6. Handler MUST be exported as both named `createHealthHandler` and default export.
7. Response `Content-Type: application/json` header MUST be set.

**Test Requirements** (must be RED before implementation — file doesn't exist — GREEN after):
- T-076-1: `GET /api/ai/health` returns HTTP 200.
- T-076-2: Response body contains `status: 'ok'`.
- T-076-3: Response body contains `personaLoader` field.
- T-076-4: Non-GET methods return 405.

---

### TR-077: AI Gateway Memory Architecture Runbook

**Derives From**: FR-077
**Priority**: P2

A Markdown runbook documenting the AI gateway memory, session, and persona architecture MUST exist at `api/ai/AI_GATEWAY_MEMORY_RUNBOOK.md`.

**Constraints**:
1. File location: `api/ai/AI_GATEWAY_MEMORY_RUNBOOK.md`.
2. MUST document: persona loading flow, session memory flow, persistent memory hierarchy, health check schema.
3. MUST document the Supabase deferral with references to `supabase/migrations/001_ai_memory.sql`.
4. MUST document Wave 10 (in-memory baseline) vs Wave 11 (Supabase wiring) scope boundary.
5. MUST document edge cases: cold-start session amnesia, multi-user concurrency, concurrent persona requests.
6. No version-controlled code in the runbook — architecture diagrams in ASCII or Mermaid.

---

## Priority Summary

| Priority | TR Count | Description |
|----------|----------|-------------|
| P0       | 58       | Must Have — Core technical constraints for MVP |
| P1       | 14       | Should Have — Important for production readiness |
| P2       | 4        | Nice to Have — Future integration requirements |

---

## Glossary

| Term | Definition |
|------|-----------|
| **TRS** | Technical Requirements Specification |
| **FRS** | Functional Requirements Specification |
| **RLS** | Row-Level Security — Database-enforced access control |
| **RBAC** | Role-Based Access Control |
| **PWA** | Progressive Web App |
| **CDN** | Content Delivery Network |
| **APM** | Application Performance Monitoring |
| **SAST** | Static Application Security Testing |
| **DSAR** | Data Subject Access Request |
| **TOTP** | Time-Based One-Time Password |
| **OPFS** | Origin Private File System |
| **E2E** | End-to-End testing |

---

## Document Authority

This TRS is derived from the MAT FRS v1.5.0 (`modules/mat/01-frs/functional-requirements.md`, 77 requirements: FR-001 to FR-077).

**Governance Reference**: `governance/strategy/MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md` §4.1

**Upstream**: FRS → TRS (this document)
**Downstream**: TRS → Architecture (`modules/mat/02-architecture/`)

**Traceability**: Complete FRS-to-TRS mapping available in `frs-to-trs-traceability.md`.

**Change Log**:
- v2.0.0 | 2026-03-09 | TR-103 through TR-110 added — completeness review gap traceability (wave-mat-gov-process). 8 new technical requirements covering: AI scoring Edge Function (TR-103, FR-104), report generation Edge Function (TR-104, FR-105), evidence collection page routing (TR-105, FR-106), feedback/recommendations UI (TR-106, FR-107), reports listing page (TR-107, FR-108), toast notification system (TR-108, FR-109), audit logging completeness (TR-109, FR-110), and scores/audit_scores RLS INSERT+UPDATE policies (TR-110, FR-111). TRS extended to 110 requirements. Derives from FRS v2.2.0.
- v1.9.0 (2026-03-08): TR-037 (AI Document Parsing Pipeline) and related TRs (TR-019, TR-031) annotated as NOT YET VERIFIED IN PRODUCTION (INC-WAVE15-PARSE-001). Production gap confirmed by CS2 on 2026-03-08. Remediation via Wave 15R. Derives from FRS v2.1.0.
- v1.8.0 (2026-03-04): Added TR-089 through TR-102 (Wave 14 gap waves — UX workflow, scoring, responsibility cascade). TRS extended to 102 requirements. Derives from FRS v1.9.0.
- v1.7.0 (2026-03-04): Added TR-084 through TR-088 (Wave postbuild-fails-02 — Full RLS Remediation, GAP-006–GAP-013). All 5 requirements marked 🔴 NEEDS REMEDIATION. TRS extended to 88 requirements.
- v1.6.0 (2026-03-04): Added TR-082, TR-083 (Wave postbuild-fails-01 — RLS Fix). TRS extended to 83 requirements.
- v1.5.0 (2026-03-03): Added TR-078 through TR-081 (Wave 14 Addendum A — Column Mapping Remediation INC-W14-COL-MAPPING-001). TRS extended to 81 requirements.
- v1.4.0 (2026-02-27): Added TR-073 through TR-077 (AI Gateway Persona Loading, Session Memory, Persistent Memory Baseline, Health Check, Memory Runbook) per FRS v1.5.0 additions FR-073–FR-077. TRS extended to 77 requirements. Architecture freeze effective on merge per CS2 directive.
- v1.3.0 (2026-02-23): Realigned TR-072 to AIMC Gateway pattern per `AIMC_STRATEGY.md` v1.0.0.
  TR-072 now blocked on AIMC Wave 3. Direct provider references, TR-040 routing table dependency,
  and placeholder scaffold language removed. Issue #377 superseded.
- v1.2.0 (2026-02-20): Added TR-072 (Embedded AI Assistant Component) per platform governance blocker LL-031. See BUILD_PROGRESS_TRACKER.md INC-002.
- v1.1.0 (2026-02-16): Added TR-071 (Frontend Application as Deployable Artifact) per governance remediation. See BUILD_PROGRESS_TRACKER.md Deviation #9.
- v1.0.0 (2026-02-13): Initial TRS with 70 requirements (TR-001–TR-070).

---

---

## Wave 14 Addendum A: Column Mapping Remediation Technical Requirements (INC-W14-COL-MAPPING-001)

**Added**: v1.5.0 (2026-03-03) | **Authority**: CS2 (Johan Ras) | **Incident**: INC-W14-COL-MAPPING-001

### TR-078: profiles table migration — extended columns

Migration MUST use `ADD COLUMN IF NOT EXISTS` for idempotency.
Columns: `full_name TEXT`, `preferences JSONB DEFAULT '{}'`.
Migration file: `20260304000000_profiles_add_full_name_and_preferences.sql`
Must be applied before any frontend Settings page smoke test.

### TR-079: audits table migration — criteria_approved and missing columns

Migration MUST use `ADD COLUMN IF NOT EXISTS` for idempotency.
Columns: `criteria_approved BOOLEAN NOT NULL DEFAULT false`, `organisation_name TEXT`, `facility_location TEXT`, `audit_lead_id UUID`.
Migration file: `20260304000001_audits_add_criteria_approved.sql`
Must be applied before any Audit Management smoke test.

### TR-080: Column-level drift test suite

All column-level tests MUST be file-based (no live Supabase env required).
All column-level tests MUST pass in CI without env vars.
Test IDs: T-W14-COL-001 to T-W14-COL-006.

### TR-081: audit_scores table migration

Migration MUST create `public.audit_scores` with `maturity_level`, `audit_id`,
`criterion_id`, `organisation_id`, RLS enabled, org-isolation policy.
Migration file: `20260304000002_audit_scores_table.sql`
Carry-forward from INC-W13-AUDIT-SCORES-001.

---

## Wave postbuild-fails-01: RLS Fix Technical Requirements (F-001, F-002)

**Added**: v1.6.0 (2026-03-04) | **Authority**: CS2 (Johan Ras) | **Issue**: #891

### TR-082: handle_new_user() trigger function and trigger

A SECURITY DEFINER PL/pgSQL function `public.handle_new_user()` MUST be created.
It MUST insert a row into `public.profiles` (`id`, `email`, `role = 'viewer'`) on new auth user creation, using `ON CONFLICT (id) DO NOTHING` for idempotency.
The trigger `on_auth_user_created` MUST fire `AFTER INSERT ON auth.users FOR EACH ROW`.
Migration file: `apps/maturion-maturity-legacy/supabase/migrations/20260304000003_fix_rls_policies_postbuild.sql`

### TR-083: profiles and audits RLS policy completeness

RLS policies MUST be added:
- `profiles_select_own`: `FOR SELECT USING (auth.uid() = id)`
- `profiles_insert_own`: `FOR INSERT WITH CHECK (auth.uid() = id)`
- `profiles_update_own`: `FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id)`
- `audits_insert_authenticated`: `FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by)`
All policies MUST use `IF NOT EXISTS` guards for idempotency.
Migration file: `apps/maturion-maturity-legacy/supabase/migrations/20260304000003_fix_rls_policies_postbuild.sql`

---

## Wave postbuild-fails-02: Full RLS Remediation Technical Requirements (GAP-006 to GAP-013) 🔴 NEEDS REMEDIATION

**Added**: v1.7.0 (2026-03-04) | **Authority**: CS2 (Johan Ras) | **Issue**: #897
**Reference**: `modules/mat/03-implementation-plan/supabase-sync-audit-20260304.md` GAP-006–GAP-013
**Status**: 🔴 RED SUITE — All requirements below are UNVERIFIED pending schema-builder migration delivery

### TR-084: evidence table RLS policies (INSERT + UPDATE + DELETE) 🔴 NEEDS REMEDIATION

RLS policies MUST be added to the `evidence` table:
- `evidence_insert_own`: `FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)` (authenticated users may upload evidence)
- `evidence_update_own`: `FOR UPDATE USING (auth.uid() = created_by OR auth.uid() = uploaded_by)` (owner may update)
- `evidence_delete_own`: `FOR DELETE USING (auth.uid() = created_by OR auth.uid() = uploaded_by)` (owner may delete)

All three policies are required. DELETE policy is not optional (see IAA Pre-Brief OVL-AM-008).
All policies MUST use `IF NOT EXISTS` or `DROP IF EXISTS` guards for idempotency.
**Status**: 🔴 RED — GAP-010 open
**Test**: T-PBF2-001
**Migration file**: To be created in `apps/maturion-maturity-legacy/supabase/migrations/`

### TR-085: scores table RLS policies (INSERT + UPDATE) 🔴 NEEDS REMEDIATION

RLS policies MUST be added to the `scores` table:
- `scores_insert_authenticated`: `FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = auditor_id)` (auditor submitting scores)
- `scores_update_authenticated`: `FOR UPDATE USING (auth.uid() = auditor_id)` (auditor updating their scores)

All policies MUST use `IF NOT EXISTS` guards.
**Status**: 🔴 RED — GAP-011 open
**Test**: T-PBF2-002
**Migration file**: To be created in `apps/maturion-maturity-legacy/supabase/migrations/`

### TR-086: audit_scores table RLS policies (INSERT + UPDATE) 🔴 NEEDS REMEDIATION

RLS policies MUST be added to the `audit_scores` table:
- `audit_scores_insert_authenticated`: `FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)`
- `audit_scores_update_authenticated`: `FOR UPDATE USING (auth.uid() IS NOT NULL)`

All policies MUST use `IF NOT EXISTS` guards.
**Status**: 🔴 RED — GAP-013 open
**Test**: T-PBF2-003
**Migration file**: To be created in `apps/maturion-maturity-legacy/supabase/migrations/`

### TR-087: organisation_settings table RLS policies (INSERT + UPDATE) 🔴 NEEDS REMEDIATION

RLS policies MUST be added to the `organisation_settings` table:
- `org_settings_insert_admin`: `FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)` (restrict to org admin in application logic; minimal DB-level INSERT guard)
- `org_settings_update_admin`: `FOR UPDATE USING (auth.uid() IS NOT NULL)`

All policies MUST use `IF NOT EXISTS` guards.
**Status**: 🔴 RED — GAP-012 open
**Test**: T-PBF2-004
**Migration file**: To be created in `apps/maturion-maturity-legacy/supabase/migrations/`

### TR-088: organisations, domains, criteria, mini_performance_standards RLS policy completeness 🔴 NEEDS REMEDIATION

RLS policies MUST be added or verified for:
- `organisations`: INSERT policy `organisations_insert_authenticated` + UPDATE policy `organisations_update_own` (scoped to org owner)
- `domains`: INSERT policy `domains_insert_admin` + UPDATE policy `domains_update_admin` (admin-scoped domain management)
- `criteria`: INSERT policy `criteria_insert_admin` + UPDATE policy `criteria_update_admin` (admin-scoped criteria management)
- `mini_performance_standards`: MUST NOT have INSERT or UPDATE policies for application-level users — read-only guard: only service-role key may write (enforce via RLS denial + explicit documentation)

All policies MUST use `IF NOT EXISTS` guards.
**Status**: 🔴 RED — GAP-006 (organisations), GAP-007 (domains), GAP-008 (mini_performance_standards), GAP-009 (criteria) open
**Tests**: T-PBF2-005 (criteria), T-PBF2-006 (domains), T-PBF2-007 (organisations), T-PBF2-008 (mini_performance_standards)
**Migration file**: To be created in `apps/maturion-maturity-legacy/supabase/migrations/`

---

## 22. UX Workflow Gap Remediation — Technical Requirements (GAP-W01–GAP-W14)

**Source authority**: `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` v1.0 (CS2 direct, 2026-03-04)
**Derives from FRS**: FR-089 to FR-102
**Added**: 2026-03-04
**Governance**: Issue #909 — Governance Remediation: FRS, TRS, and Red QA Suite for Unaddressed UX Workflow Gaps
**Status**: 🔴 RED SUITE — All 14 requirements below are UNIMPLEMENTED; new tables and endpoints not yet created

### TR-089: Sign-Up, Onboarding, and First-Use — DB and Guard Wiring (GAP-W01)

**Derives From**: FR-089
**Priority**: P0

The `OnboardingGuard` React component MUST be implemented in `App.tsx` routing to redirect all authenticated users without a non-null `profile.organisation_id` to `/onboarding`. The following wiring is mandatory:

1. Supabase Auth `signUp()` integration with redirect to `/onboarding` on success.
2. `public.organisations` RLS: INSERT policy for any authenticated user; SELECT scoped to `profiles.organisation_id = auth.uid()`-via-profiles join.
3. `public.profiles` RLS: UPSERT (INSERT + UPDATE) policy allowing the user to write their own row (`id = auth.uid()`).
4. React hook `useOnboarding()` in `useSettings.ts` wrapping the two-step INSERT flow.
5. `OnboardingGuard` reads `profile.organisation_id` from Supabase Realtime or a fresh query and gates all app routes.

**Constraints**:
1. Guard must be applied before any authenticated route renders — not inside individual components.
2. Organisation name must be `VARCHAR(255) NOT NULL` in `public.organisations`.
3. Onboarding must handle network failures gracefully (retry or error state — not silent failure).
4. All DB operations must execute within the authenticated user's RLS context — no service-role bypass.

**Migration file**: New migration adding `public.organisations` INSERT/SELECT RLS + `public.profiles` UPSERT RLS if not already present.
**Test**: T-W14-UX-001

---

### TR-090: Invite Auditor — Database Tables, Edge Function, and RLS (GAP-W02)

**Derives From**: FR-090
**Priority**: P0

New tables and infrastructure required for auditor invitation:

1. `public.audit_invitations` table: `id UUID PK DEFAULT gen_random_uuid()`, `audit_id UUID REFERENCES audits(id)`, `scope_type VARCHAR(20) CHECK ('domain','mps','criteria')`, `scope_id UUID NOT NULL`, `invitee_email TEXT NOT NULL`, `invitee_name TEXT NOT NULL`, `invitation_token UUID UNIQUE DEFAULT gen_random_uuid()`, `status VARCHAR(20) DEFAULT 'pending' CHECK ('pending','accepted','declined')`, `invited_by UUID REFERENCES profiles(id)`, `created_at TIMESTAMPTZ DEFAULT now()`, `accepted_at TIMESTAMPTZ`.
2. `public.domain_assignments` table: `id UUID PK`, `domain_id UUID`, `audit_id UUID`, `user_id UUID REFERENCES profiles(id)`, `assigned_at TIMESTAMPTZ DEFAULT now()`.
3. `public.mps_assignments` table: same structure scoped to `mps_id`.
4. Supabase Edge Function `send-invitation`: receives `invitation_id`, queries `audit_invitations`, constructs and sends email via configured email service.
5. React route `/accept-invite?token=...`: reads token, fetches invitation, creates or links account, creates assignment row, updates invitation status.
6. RLS on `domain_assignments`/`mps_assignments`: SELECT for org members; INSERT for Lead Auditor only; no DELETE by application users.

**Constraints**:
1. `invitation_token` must be UUID; never reused after acceptance.
2. Email sending must be async (Edge Function must not block the INSERT response).
3. Onboarding flow MUST support `?invite_token=...` param to skip org creation and join inviting org.
4. Scoped access enforcement: after acceptance, invitee's profile `role` and assignment row together gate their visible scope (RLS enforces at DB level).

**Migration file**: New migration `20260304000010_invitation_system.sql` (or next available timestamp).
**Test**: T-W14-UX-002

---

### TR-091: Toggle Exclude — DB Cascade, Trigger or Application Logic (GAP-W03)

**Derives From**: FR-091
**Priority**: P0

Exclusion cascade MUST be implemented as either a PostgreSQL trigger or consistent application-level logic:

1. `domains.excluded BOOLEAN NOT NULL DEFAULT false` column (already referenced; must be confirmed in schema).
2. `mps.excluded BOOLEAN NOT NULL DEFAULT false` column — same.
3. `criteria.excluded BOOLEAN NOT NULL DEFAULT false` column — same.
4. Cascade: When `domains.excluded` is set to `true`, all `mps` rows with `mps.domain_id = domains.id` and all `criteria` rows with `criteria.domain_id = domains.id` MUST also be set to `excluded = true` — either via a `BEFORE UPDATE` trigger or a guaranteed application-level cascade call.
5. Scoring queries MUST use `WHERE excluded = false` filter at each hierarchy level.
6. "Create Report" gating SQL MUST count `criteria WHERE excluded = false AND criteria_evaluations.status NOT IN ('confirmed','overridden')` — result must be 0 for button to activate.

**Constraints**:
1. Trigger-based cascade preferred over application-level (avoids race conditions on concurrent updates).
2. `excluded` reversal: un-toggling a parent domain must NOT automatically restore previously individually-excluded child items (restore only items that inherited from this toggle).
3. Cascade logic must be covered by T-W14-UX-003 test.

**Migration file**: New migration adding `excluded` columns and cascade trigger (or confirming existing columns + adding trigger).
**Test**: T-W14-UX-003

---

### TR-092: Invite Evidence Submitter — Criteria-Level Scope Table and RLS (GAP-W04)

**Derives From**: FR-092
**Priority**: P1

New table required for criteria-scoped access:

1. `public.criteria_assignments` table: `id UUID PK DEFAULT gen_random_uuid()`, `criteria_id UUID REFERENCES criteria(id)`, `audit_id UUID REFERENCES audits(id)`, `user_id UUID REFERENCES profiles(id)`, `assigned_at TIMESTAMPTZ DEFAULT now()`.
2. RLS on `criteria_assignments`: SELECT for org members; INSERT for Lead/Domain/MPS Auditor; no DELETE by application users.
3. RLS on `evidence` table: Evidence Submitter may INSERT/UPDATE/DELETE `evidence` rows where `criteria_id IN (SELECT criteria_id FROM criteria_assignments WHERE user_id = auth.uid())`.
4. React app route for `scope_type = 'criteria'` in the accept-invite flow must create a `criteria_assignments` row (not `domain_assignments` or `mps_assignments`).

**Constraints**:
1. Evidence Submitter role MUST have a `role = 'evidence_submitter'` value in `profiles.role` — add to CHECK constraint if not already present.
2. The restricted view for Evidence Submitters must be enforced at RLS level, not only in the frontend routing.

**Migration file**: New migration `20260304000011_criteria_assignments.sql` (or next available timestamp).
**Test**: T-W14-UX-004

---

### TR-093: Evidence Card — MediaRecorder API, Storage, and State Machine (GAP-W05)

**Derives From**: FR-093
**Priority**: P0

Frontend implementation requirements for the Evidence Upload Panel:

1. `MediaRecorder` API integration for voice notes: `new MediaRecorder(stream)`, `start()` on `mousedown`/`touchstart`, `stop()` on `mouseup`/`touchend`, `onstop` handler staging the `Blob` for upload.
2. Same pattern for video (`videoBitsPerSecond` constraint recommended at 1Mbps for mobile).
3. Supabase Storage upload: `supabase.storage.from('evidence-files').upload(path, blob)` using path `{organisation_id}/{audit_id}/{criteria_id}/{uuid}.{ext}`.
4. Evidence tile component: thumbnail/audio-player/video-player/file-icon based on `evidence.type`; Remove button calls soft-delete (`UPDATE evidence SET deleted = true`); Replace button re-triggers picker.
5. Findings text auto-save: debounced (400ms) `UPDATE public.evidence SET findings_text = $1 WHERE id = $2`.
6. `public.evidence` table: confirm all required columns exist (`id`, `criteria_id`, `audit_id`, `organisation_id`, `submitted_by`, `type` ENUM, `storage_path`, `findings_text`, `deleted` BOOLEAN, `submitted_at`, `updated_at`).

**Constraints**:
1. `MediaRecorder` must request `getUserMedia` permissions before first use — handle permission denied gracefully.
2. Storage paths must be org-isolated (`{organisation_id}/...`); never accessible cross-org.
3. `deleted = true` is a soft delete — no physical removal from storage until audit archival.

**Migration file**: Confirm/add `evidence` table columns and `evidence-files` storage bucket policy.
**Test**: T-W14-UX-005

---

### TR-094: AI Evaluation Endpoint — Pipeline, DB Writes, and Card Update (GAP-W06)

**Derives From**: FR-094
**Priority**: P0

AI evaluation endpoint and DB table requirements:

1. `POST /ai/evaluate-criteria` endpoint (Supabase Edge Function or Next.js API route): accepts `{ criteria_id, audit_id }`, fetches all non-deleted `evidence` rows, calls AI models per type (text → GPT-4 Turbo, audio → Whisper → GPT-4 Turbo, video → Whisper + GPT-4 Vision, image → GPT-4 Vision), produces structured response.
2. `public.criteria_evaluations` table: `id`, `criteria_id`, `audit_id`, `organisation_id`, `proposed_level` (ENUM: Basic/Reactive/Compliant/Proactive/Resilient), `confirmed_level` (same ENUM, nullable), `confidence_score INTEGER`, `rationale TEXT`, `findings_summary TEXT`, `next_level_guidance TEXT`, `next_plus_one_taster TEXT`, `ai_model_used TEXT`, `status` (ENUM: pending_review/confirmed/overridden), `evaluated_at TIMESTAMPTZ`.
3. `public.evaluation_overrides` table: `id`, `evaluation_id`, `original_level`, `overridden_level`, `justification TEXT NOT NULL`, `overridden_by UUID`, `overridden_at TIMESTAMPTZ`.
4. React hook `useEvaluateCriteria(criteriaId)`: calls endpoint, inserts evaluation row, updates criteria card state in Supabase Realtime subscription.
5. RLS on `criteria_evaluations`: SELECT for org members; INSERT for the evaluating user (or service role); UPDATE for Confirm/Override actions.

**Constraints**:
1. AI calls MUST route via the AI Gateway (TR-040) — no direct OpenAI calls from frontend or edge function.
2. `evaluation_overrides.justification` is mandatory (application-level and DB-level CHECK if possible).
3. Status transitions: `pending_review` → `confirmed` (Confirm button) or `pending_review` → `overridden` (Override submit). No direct `pending_review` → `overridden` without override form submission.

**Migration file**: New migrations for `criteria_evaluations` and `evaluation_overrides` tables.
**Test**: T-W14-UX-006

---

### TR-095: Next-Level Guidance Surface — Component and DB Source (GAP-W07)

**Derives From**: FR-095
**Priority**: P1

Frontend component and DB wiring for next-level guidance display:

1. Criteria card post-evaluation section: renders `criteria_evaluations.proposed_level` (or `confirmed_level` if confirmed) as a colour-coded badge; renders `next_level_guidance` as a "What to improve" section; renders `next_plus_one_taster` as a "Where you're heading" preview.
2. All content MUST come from the `criteria_evaluations` DB row — no hardcoded guidance text.
3. "Explore further levels" link/button: visible when `criteria_evaluations` row exists for the criteria; triggers opening the AI chat panel with context injection.
4. Component must handle loading state (skeleton) while evaluation is in progress.

**Constraints**:
1. `next_level_guidance` and `next_plus_one_taster` are populated by the AI evaluation endpoint (TR-094) — never manually entered.
2. If `proposed_level = 'Resilient'` (highest level), `next_level_guidance` and `next_plus_one_taster` must show "Maximum maturity level achieved" — no guidance needed.

**Test**: T-W14-UX-007

---

### TR-096: AI Chat Panel Context Injection (GAP-W08)

**Derives From**: FR-096
**Priority**: P1

Technical wiring for AI chat panel context injection from criteria card:

1. Existing AI chat panel component (LL-031 / FR-072) MUST accept a `contextPayload` prop: `{ criteria_name: string, current_level: string, next_level_guidance: string, audit_context: string }`.
2. When opened from criteria card, the panel initialises the chat session with a system prompt incorporating the `contextPayload` — injected BEFORE the user sends the first message.
3. The context injection must be visible to the AI for all turns in the session.
4. Chat panel opened without context (from the main navigation) must NOT include stale criteria context from a previous session.

**Constraints**:
1. Context must not exceed AI model token limits — truncate `next_level_guidance` at 500 tokens if necessary.
2. Chat history is NOT persisted across page refreshes for session-mode (no DB write unless user clicks "Save Chat").

**Test**: T-W14-UX-008

---

### TR-097: Audit Results Table — Query and RLS Scope (GAP-W09)

**Derives From**: FR-097
**Priority**: P0

Backend query and RLS requirements for the Audit Results table:

1. Results query: JOIN `audits → domains → mps → criteria → criteria_evaluations` on `audit_id`; include `excluded` flag on each level; include `confirmed_level` (or `proposed_level` if not confirmed) and `findings_summary`, `next_level_guidance` from `criteria_evaluations`.
2. Query MUST use `LEFT JOIN` on `criteria_evaluations` to surface Pending criteria (no evaluation row yet).
3. Sortable columns: Domain name/number, MPS name/number, Rating (`confirmed_level` enum order: Basic=1, Reactive=2, Compliant=3, Proactive=4, Resilient=5).
4. RLS scoping: Lead Auditor sees all criteria; Domain Auditor sees only criteria under their `domain_assignments.domain_id`; MPS Auditor sees only criteria under their `mps_assignments.mps_id`; Evidence Submitter sees only their assigned `criteria_assignments.criteria_id`.
5. React hook `useAuditResults(auditId)`: returns paginated results; updates via Supabase Realtime subscription on `criteria_evaluations`.

**Constraints**:
1. Results table MUST show excluded criteria greyed — not hidden — to preserve audit completeness awareness.
2. "Pending" criteria (no evaluation row) must be clearly badged and sortable to the top of the table.

**Test**: T-W14-UX-009

---

### TR-098: Dashboard Metrics Query and Create-Report Gate (GAP-W10)

**Derives From**: FR-098
**Priority**: P0

Backend aggregation and gate query requirements:

1. Dashboard metrics query: aggregate counts from `criteria` with LEFT JOIN on `criteria_evaluations` — compute Total Criteria, Submitted (has evaluation row), Outstanding (no evaluation row and `excluded = false`), Excluded.
2. Overall Maturity Rating: computed from `aggregate_scores` table (see TR-101) using `scoring_rules.aggregation_method`.
3. Maturity Distribution: COUNT of criteria grouped by `confirmed_level` — returned as array for chart rendering.
4. "Create Report" gate query: `SELECT COUNT(*) FROM criteria WHERE audit_id = $1 AND excluded = false AND id NOT IN (SELECT criteria_id FROM criteria_evaluations WHERE status IN ('confirmed','overridden'))` — must return 0 to activate the button.
5. React hook `useDashboardMetrics(auditId)`: provides all metrics; subscribes to Realtime for live updates.

**Constraints**:
1. Dashboard must use a single aggregate query (not N+1 queries per domain) for performance.
2. Gate query result must be cached client-side but refreshed on `criteria_evaluations` update events.
3. Drill-down navigation (click domain → MPS view) must be implemented as route-based navigation, not modal overlays.

**Test**: T-W14-UX-010

---

### TR-099: Report Generation Endpoint, PDF Export, and audit_reports Table (GAP-W11)

**Derives From**: FR-099
**Priority**: P0

Report generation technical requirements:

1. `POST /ai/generate-report` endpoint: accepts `{ audit_id }`, fetches all non-excluded confirmed/overridden evaluations, constructs structured report JSON via AI model, returns report HTML.
2. AI model: GPT-4 Turbo (report writer agent) via AI Gateway (TR-040).
3. PDF generation: server-side Supabase Edge Function `generate-pdf` using Puppeteer or wkhtmltopdf (decision: server-side preferred to avoid large client-side bundles).
4. `public.audit_reports` table: `id UUID PK`, `audit_id UUID REFERENCES audits(id)`, `organisation_id UUID`, `generated_at TIMESTAMPTZ DEFAULT now()`, `generated_by UUID REFERENCES profiles(id)`, `storage_path TEXT NOT NULL`, `status VARCHAR(20) DEFAULT 'final'`.
5. Supabase Storage bucket `reports`: org-isolated path `{organisation_id}/{audit_id}/{uuid}.pdf`.
6. RLS on `audit_reports`: SELECT for Lead Auditor of the audit; INSERT by the generating user (or service role); no UPDATE or DELETE by application users.

**Constraints**:
1. Report generation is a long-running operation (>5s) — must use async pattern with status polling or Supabase Realtime event on `audit_reports` insert.
2. `scoring_rules` and `aggregate_scores` must be readable at report time (RLS must allow SELECT for Lead Auditor).
3. PDF download link must be a signed URL (time-limited) from Supabase Storage — not a public URL.

**Migration file**: New migration for `audit_reports` table + `reports` storage bucket policy.
**Test**: T-W14-UX-011

---

### TR-100: Level Descriptor Tables and Aggregation Wiring (GAP-W12)

**Derives From**: FR-100
**Priority**: P1

New descriptor tables required:

1. `public.criteria_level_descriptors` table: `id UUID PK`, `criteria_id UUID REFERENCES criteria(id)`, `level` (ENUM: Basic/Reactive/Compliant/Proactive/Resilient), `descriptor_text TEXT NOT NULL`, UNIQUE constraint on `(criteria_id, level)`.
2. `public.mps_level_descriptors` table: same structure with `mps_id UUID REFERENCES mps(id)`.
3. `public.domain_level_descriptors` table: same structure with `domain_id UUID REFERENCES domains(id)`.
4. Descriptor population: AI criteria parsing endpoint (TR-037) MUST generate and INSERT descriptors for all 5 levels for each criteria/MPS/domain at parse time.
5. React hook `useLevelDescriptor(level, criteriaId|mpsId|domainId)`: queries the appropriate descriptor table and returns descriptor text for the current confirmed level.
6. RLS: SELECT for org members (read-only for application users); INSERT by parsing service role only.

**Constraints**:
1. Descriptor tables are append-only after initial population — no UPDATE or DELETE by application users.
2. MPS and Domain descriptors are derived by the AI from the aggregate level (not per-level pre-generation) — OR the AI can pre-generate all 5 levels; implementation decision for the architecture document.
3. Descriptor text must be non-empty (NOT NULL + CHECK `length(descriptor_text) > 0`).

**Migration file**: New migrations for all three descriptor tables.
**Test**: T-W14-UX-012

---

### TR-101: Maturity Levels, Scoring Rules, and Aggregate Scores Tables (GAP-W13)

**Derives From**: FR-101
**Priority**: P0

Scoring infrastructure tables:

1. `public.maturity_levels` table: `id UUID PK`, `name VARCHAR(20) UNIQUE NOT NULL` (values: Basic, Reactive, Compliant, Proactive, Resilient), `numeric_value INTEGER UNIQUE NOT NULL CHECK (numeric_value BETWEEN 1 AND 5)`, `colour_hex CHAR(7)`. Seeded via migration with all 5 rows.
2. `public.scoring_rules` table: `id UUID PK`, `organisation_id UUID REFERENCES organisations(id) NULL` (NULL = global default), `aggregation_method VARCHAR(20) NOT NULL CHECK ('weighted_average','minimum','majority')`, `weight_criteria NUMERIC(5,4) DEFAULT 1.0`, `weight_mps NUMERIC(5,4) DEFAULT 1.0`, `weight_domain NUMERIC(5,4) DEFAULT 1.0`. Seeded with one global default row (`organisation_id = NULL, aggregation_method = 'weighted_average'`).
3. `public.aggregate_scores` table: `id UUID PK`, `audit_id UUID REFERENCES audits(id)`, `level_type VARCHAR(20) CHECK ('criteria','mps','domain','audit')`, `scope_id UUID NOT NULL`, `computed_level VARCHAR(20)`, `numeric_score NUMERIC(5,2)`, `computed_at TIMESTAMPTZ DEFAULT now()`, UNIQUE constraint on `(audit_id, level_type, scope_id)`.
4. Score computation: a Supabase Edge Function or API endpoint `compute-scores(audit_id)` reads `scoring_rules` (org-specific first, falling back to global), applies the method over the hierarchy, and UPSERTS `aggregate_scores` rows.
5. RLS: `maturity_levels` and `scoring_rules` — SELECT for all authenticated users; INSERT/UPDATE by service role only. `aggregate_scores` — SELECT for org members of the audit; INSERT/UPDATE by the compute function (service role).

**Constraints**:
1. `maturity_levels` seed data MUST be in migration SQL — not inserted by application code at runtime.
2. `scoring_rules` global default MUST be present before any scoring call — enforced by the seed migration.
3. Frontend must NOT hardcode `{ 'Basic': 1, 'Compliant': 3, ... }` — always read from `maturity_levels` table.

**Migration file**: New migration for all three tables + seed data.
**Test**: T-W14-UX-013

---

### TR-102: Responsibility Cascade — View/Hook and Assignment Tables (GAP-W14)

**Derives From**: FR-102
**Priority**: P0

Technical implementation of the responsibility cascade:

1. `public.domain_assignments` and `public.mps_assignments` and `public.criteria_assignments` tables (shared with TR-090/TR-092 — confirm existence before creating).
2. PostgreSQL view or computed column `responsible_user_id` on each level:
   - For domains: `COALESCE((SELECT user_id FROM domain_assignments WHERE domain_id = d.id LIMIT 1), (SELECT created_by FROM audits WHERE id = d.audit_id))`.
   - For MPS: `COALESCE((SELECT user_id FROM mps_assignments WHERE mps_id = m.id LIMIT 1), domain_responsible_user_id)`.
   - For criteria: `COALESCE((SELECT user_id FROM criteria_assignments WHERE criteria_id = c.id LIMIT 1), mps_responsible_user_id)`.
3. React hook `useResponsibleUser(level: 'domain'|'mps'|'criteria', scopeId: string)`: calls the view/function and returns `{ userId, displayName, isCurrentUser }`.
4. Each card renders "Responsible: You" if `isCurrentUser = true`, else the assignee's `profiles.display_name`.

**Constraints**:
1. Responsibility display MUST be available even before anyone is invited — defaults to Lead Auditor from the first card render.
2. The cascade logic must not require a frontend loop — it must be resolvable in a single DB query per card.
3. When a domain auditor is removed (future feature), the cascade must revert to Lead Auditor — implement as a view (not a denormalised column) to avoid stale data.

**Migration file**: Cascade view/function added to migration file alongside assignment tables (see TR-090, TR-092).
**Test**: T-W14-UX-014

---

### TR-103: AI Scoring Edge Function (Deno Runtime)

**Derives From**: FR-104  
**Priority**: P1  
**Status**: 🔴 OPEN — BLOCKED on TR-105 (AIMC scoring wiring) completing first

Technical implementation of the AI criterion scoring Edge Function:

1. Runtime: Deno (Supabase Edge Function environment); deployed to `supabase/functions/invoke-ai-score-criterion/`.
2. Invocation: `supabase.functions.invoke('invoke-ai-score-criterion', { body: { audit_id: string, criteria_id: string } })` — called from the `useTriggerAIScoring()` hook in `ReviewTable`.
3. AIMC routing: The function calls the AIMC `scoring` capability via the `@maturion/ai-centre` Gateway using `aimc.scoring.scoreCriterion({ audit_id, criteria_id, criteria_text, evidence_ids })`.
4. Score persistence: On success, the function UPSERTS a row into the `scores` table with columns: `audit_id`, `criteria_id`, `organisation_id`, `maturity_level` (VARCHAR), `numeric_score` (NUMERIC), `gap_analysis` (JSONB — fields: `immediate: string[]`, `medium_term: string[]`, `long_term: string[]`), `created_by` (auth.uid()), `created_at`.
5. Task tracking: The function writes a `score_tasks` row (or updates a `parse_tasks`-pattern equivalent) with `status = 'processing'` on start and `status = 'complete'` or `status = 'failed'` on completion, enabling frontend polling.
6. Idempotency: Uses `ON CONFLICT (audit_id, criteria_id) DO UPDATE` to prevent duplicate score rows.
7. Error handling: Returns a structured JSON error `{ error: string, code: string }` on failure; never returns a 200 with an empty body on error.

**Constraints**:
1. No direct AI provider calls (no OpenAI, Anthropic, etc.) — all AI calls MUST route through the AIMC Gateway.
2. The `gap_analysis` JSONB MUST be written even if empty arrays — a NULL `gap_analysis` column is not acceptable.
3. Auth: The Edge Function MUST verify the caller is authenticated (JWT present and valid) before processing.

**Migration file**: If a new `score_tasks` table is required, a migration must be created; otherwise the existing `parse_tasks` pattern is reused.
**Test**: T-W16.3-API-001, T-W16.3-API-002

---

### TR-104: Report Generation Edge Function (Deno Runtime)

**Derives From**: FR-105  
**Priority**: P1  
**Status**: 🔴 OPEN — BLOCKED on TR-105 (AIMC reporting wiring) AND TR-103 (scoring complete)

Technical implementation of the audit report generation Edge Function:

1. Runtime: Deno (Supabase Edge Function environment); deployed to `supabase/functions/generate-audit-report/`.
2. Invocation: `supabase.functions.invoke('generate-audit-report', { body: { audit_id: string } })` — called from the "Create Report" button handler.
3. AIMC routing: The function calls the AIMC `reporting` capability via `aimc.reporting.generateAuditReport({ audit_id, domains_json, scores_json, evidence_summary })`.
4. Storage: The generated report (PDF or HTML) is uploaded to the `reports` Supabase Storage bucket at path `{organisation_id}/{audit_id}/{uuid}.{ext}`.
5. `audit_reports` row: After successful storage upload, INSERT a row with: `audit_id`, `organisation_id`, `storage_path`, `triggered_by` (auth.uid()), `generated_at` (now()), `status = 'final'`.
6. Return value: The function returns a JSON object `{ signed_url: string, report_id: string }` where `signed_url` is a time-limited (24 h) Supabase Storage signed URL for immediate download.
7. Failure handling: On AIMC or storage failure, sets `status = 'failed'` on the `audit_reports` row; returns structured error JSON; frontend surfaces a toast error.

**Constraints**:
1. No direct AI provider calls — all AI calls route through the AIMC Gateway.
2. Signed URLs MUST have an expiry of ≤ 24 hours; clients MUST re-request via the `/reports` listing page to obtain a fresh URL after expiry.
3. The function MUST gate on all non-excluded criteria having `status IN ('confirmed', 'overridden')` before generating the report; a 422 error is returned if the gating condition is not met.

**Migration file**: `audit_reports` table migration may already exist (TR-099); confirm before creating a new one.
**Test**: T-W16.4-API-001, T-W16.4-API-002

---

### TR-105: Evidence Collection Page Routing Fix

**Derives From**: FR-106  
**Priority**: P0  
**Status**: 🔴 OPEN — immediately actionable; Next.js routing fix only

Technical implementation of the evidence collection page routing fix:

1. Scope: Next.js route fix only — no backend or schema changes.
2. The file `modules/mat/frontend/src/pages/evidence.tsx` (or equivalent) MUST import and render `EvidenceCollection.tsx` from `modules/mat/frontend/src/components/EvidenceCollection.tsx` instead of the current stub component.
3. The navigation link for "Evidence" in the main `Navigation.tsx` component MUST point to `/evidence` and must apply the active-link style class when the current route matches `/evidence` or `/evidence/*`.
4. No props drilling required — `EvidenceCollection.tsx` reads `auditId` from the URL or from context (whichever pattern is used by the component).

**Constraints**:
1. The change MUST NOT modify `EvidenceCollection.tsx` itself — only the page route file.
2. If `auditId` is required and not in the URL, the page MUST redirect to the audit selection flow rather than rendering with `auditId = undefined`.

**Migration file**: None — frontend-only change.
**Test**: T-W16.1-UI-001, T-W16.1-UI-002

---

### TR-106: Feedback/Recommendations UI Component

**Derives From**: FR-107  
**Priority**: P1  
**Status**: 🔴 OPEN — immediately actionable once TR-103 delivers `gap_analysis` JSONB

Technical implementation of the feedback and recommendations UI:

1. New component `FeedbackRecommendations.tsx` (or equivalent) is added to `modules/mat/frontend/src/components/`.
2. Data fetching: The component uses a `useGapAnalysis(auditId)` TanStack Query hook that SELECT from `scores` (`gap_analysis`, `criteria_id`) and `criteria_evaluations` (`next_level_guidance`, `criteria_id`) for the given `audit_id`.
3. Render: Groups recommendations by Domain → MPS → Criteria hierarchy; for each criteria shows three accordions/sections: `immediate` actions, `medium_term` actions, `long_term` actions.
4. `criteria_evaluations.next_level_guidance` is rendered beneath the gap analysis for each criterion if present.
5. The component is accessible from a `/feedback` or `/recommendations` page route AND from an inline expandable panel in `ReviewTable.tsx`.
6. All JSONB field names accessed match the schema: `gap_analysis.immediate`, `gap_analysis.medium_term`, `gap_analysis.long_term` (not camelCase variants).

**Constraints**:
1. The component is read-only — no editing of AI-generated recommendations.
2. If `gap_analysis` is NULL for a criterion, the component renders "No AI analysis available" rather than crashing or showing empty.

**Migration file**: None — frontend-only change.
**Test**: T-W16.2-UI-001, T-W16.2-UI-002

---

### TR-107: Reports Listing Page

**Derives From**: FR-108  
**Priority**: P1  
**Status**: 🔴 OPEN — immediately actionable once TR-104 populates `audit_reports`

Technical implementation of the reports listing page:

1. A `useAuditReports(auditId)` TanStack Query hook queries the `audit_reports` table, selecting: `id`, `generated_at`, `triggered_by`, `storage_path`, `status`.
2. The `/reports` page renders a list of `audit_reports` rows with: formatted `generated_at` timestamp, `triggered_by` display name (joined from `profiles` or displayed as user ID), and a "Download" button.
3. The "Download" button triggers `supabase.storage.from('reports').createSignedUrl(storage_path, 86400)` on click and initiates a browser file download using the resulting signed URL.
4. Empty state: When `audit_reports` has no rows for the current audit, display the text "No reports generated yet. Use the 'Create Report' button on the dashboard when all criteria are assessed."
5. The reports page is reachable via the main navigation and is the target of the "Create Report" button's post-generation redirect.

**Constraints**:
1. Signed URLs MUST be requested on-demand (per click) — pre-fetching and caching signed URLs is prohibited to avoid serving expired URLs.
2. The page MUST filter by the current `auditId` — it must not display reports from other audits in the same organisation.

**Migration file**: None — frontend-only change.
**Test**: T-W16.2-UI-001, T-W16.2-UI-002

---

### TR-108: Toast Notification System

**Derives From**: FR-109  
**Priority**: P1  
**Status**: 🔴 OPEN — immediately actionable; standalone frontend change

Technical implementation of the toast notification system:

1. Package: `react-hot-toast` (or a project-approved equivalent such as `sonner` or `react-toastify`) is added to `modules/mat/frontend/package.json`.
2. Mount: A global `<Toaster />` component is added to `modules/mat/frontend/src/pages/_app.tsx` (or the equivalent root layout file) so notifications are available on all pages.
3. Migration: All 29 `window.alert()` calls across the frontend are replaced — `alert('success message')` → `toast.success(...)`, `alert('error message')` → `toast.error(...)`, loading states → `toast.loading(...)`.
4. Confirmation dialogs for destructive actions: Delete audit, delete evidence, and cancel assessment flows MUST call `window.confirm()` or render a custom confirmation modal before proceeding — they MUST NOT use `window.alert()` as a confirmation mechanism.
5. No `window.alert()` call remains in the codebase after Wave 16.2 is merged; a TypeScript lint rule or grep CI check enforces this.

**Constraints**:
1. Toast duration: success toasts ≥ 3 s; error toasts ≥ 5 s.
2. The Toaster position defaults to `top-right` unless the design system specifies otherwise.

**Migration file**: None — frontend-only change; package.json update only.
**Test**: T-W16.2-UI-001, T-W16.2-UI-002

---

### TR-109: Audit Logging Completeness

**Derives From**: FR-110  
**Priority**: P1  
**Status**: 🔴 OPEN — independently actionable across evidence, scoring, and report generation paths

Technical implementation of comprehensive audit logging:

1. `evidence_upload` event: In the `useUploadEvidence` hook (or equivalent), after a successful `supabase.storage.upload()` call, INSERT into `audit_logs`: `{ audit_id, organisation_id, action: 'evidence_upload', file_path: storagePath, created_by: user.id, details: { file_name, file_type, file_size } }`. `organisation_id` MUST NOT be NULL.
2. `score_confirmed` event: In the `useConfirmScore` hook (or equivalent), after a successful score confirmation DB write, INSERT into `audit_logs`: `{ audit_id, organisation_id, action: 'score_confirmed', created_by: user.id, details: { criteria_id, confirmed_level, previous_ai_level } }`.
3. `score_overridden` event: In the `useOverrideScore` hook (or equivalent), after a successful manual override write, INSERT into `audit_logs`: `{ audit_id, organisation_id, action: 'score_overridden', created_by: user.id, details: { criteria_id, overridden_level, previous_level, override_reason } }`.
4. `report_generated` event: In the `generate-audit-report` Edge Function, after a successful `audit_reports` INSERT, INSERT into `audit_logs`: `{ audit_id, organisation_id, action: 'report_generated', created_by: triggered_by_user_id, details: { report_id, storage_path } }`.
5. All INSERT column names MUST be validated against the `audit_logs` schema DDL (columns: `id`, `audit_id`, `organisation_id`, `action`, `file_path`, `details`, `created_by`, `created_at`) before implementation — no non-existent columns.

**Constraints**:
1. Audit log writes MUST use a non-fatal `try/catch` pattern — a failed audit log write must never cause the parent operation to fail.
2. `organisation_id NOT NULL` constraint must be satisfied for all four new action types — the `organisationId` value must be available in each hook/function context before the INSERT.

**Migration file**: None for audit_logs schema — existing table; new action values are data-level additions only.
**Test**: T-W16.6-SCH-001, T-W16.6-SCH-002

---

### TR-110: Scores/Audit Scores RLS INSERT + UPDATE Policies

**Derives From**: FR-111  
**Priority**: P0  
**Status**: 🔴 OPEN — independently actionable; schema migration only

Technical implementation of complete RLS policies on `scores` and `audit_scores`:

1. `scores` INSERT policy: `CREATE POLICY "scores_insert_lead_auditor" ON public.scores FOR INSERT WITH CHECK (organisation_id = auth.uid_to_organisation_id() AND EXISTS (SELECT 1 FROM public.audits WHERE id = scores.audit_id AND created_by = auth.uid()))` — or the pattern that matches existing SELECT policies on the table.
2. `scores` UPDATE policy: `CREATE POLICY "scores_update_lead_auditor" ON public.scores FOR UPDATE USING (organisation_id = auth.uid_to_organisation_id() AND EXISTS (SELECT 1 FROM public.audits WHERE id = scores.audit_id AND created_by = auth.uid()))`.
3. `audit_scores` INSERT policy: Same pattern as scores INSERT, scoped to `audit_scores.organisation_id`.
4. `audit_scores` UPDATE policy: Same pattern as scores UPDATE, scoped to `audit_scores.organisation_id`.
5. All four policies are in a single migration file named `{timestamp}_scores_audit_scores_rls_insert_update.sql`.
6. The migration MUST NOT alter or drop existing SELECT policies on either table.

**Constraints**:
1. The exact RLS helper function name (e.g., `auth.uid_to_organisation_id()` or inline subquery) MUST match the pattern used by existing SELECT policies on `scores` and `audit_scores` — copy the existing pattern, do not invent a new one.
2. After migration, an authenticated Lead Auditor MUST be able to INSERT and UPDATE scores for their own audit; a user from a different organisation MUST NOT be able to INSERT or UPDATE scores for another org's audit.

**Migration file**: New migration — `{timestamp}_scores_audit_scores_rls_insert_update.sql`.
**Test**: T-W16.6-SCH-001, T-W16.6-SCH-002

---

---

### TR-111: Criteria Parsing Pydantic Serialization Hardening (Wave 18 Post-Merge)

**Derives From**: FR-112  
**Priority**: P0  
**Status**: ✅ COMPLETE — PR #1116 (Wave 18 post-merge hotfix) merged 2026-03-16

Technical implementation of Pydantic model hardening in `apps/mat-ai-gateway/services/parsing.py`:

1. All five Pydantic models (`ParseRequest`, `CriterionResult`, `MpsResult`, `DomainResult`, `ParseResponse`) MUST have `model_config = ConfigDict(extra='ignore')` — unknown fields from the AI response are silently discarded rather than raising `ValidationError`.
2. `MpsResult.sort_order` and `DomainResult.sort_order` MUST have `default=0` — AI responses that omit `sort_order` must not cause `ValidationError`.
3. The AI system prompt `_SYSTEM_PROMPT` MUST apply the verbatim-only rule consistently to all fields including `title` — the instruction `title fields contain a SHORT label only (5-8 words)` contradicts verbatim-only and is replaced with a verbatim extraction instruction.

**Constraints**:
1. `extra='ignore'` MUST NOT be applied to fields that are actually required by the schema — only extra/unexpected fields are discarded.
2. Existing Pydantic field definitions (all required extraction fields) are preserved unchanged.

**Migration file**: None (Python code change only)  
**Test**: T-W18-QA-003, T-W18-QA-004, T-W18-QA-005

---

### TR-112: RLS Profiles Row Gap Fix (Wave 18 Post-Merge)

**Derives From**: FR-112, FR-002 (authentication / org isolation)  
**Priority**: P0  
**Status**: ✅ COMPLETE — PR #1116 (Wave 18 post-merge hotfix) merged 2026-03-16

Technical implementation of `profiles` row completeness for the `audit_documents_org_insert_v2` RLS policy:

1. A migration MUST backfill missing `public.profiles (id, email, role='staff')` rows for any `auth.users` entries with no corresponding profiles row (`ON CONFLICT DO NOTHING`).
2. A `profiles_insert_own` policy MUST exist (idempotent): `FOR INSERT WITH CHECK (auth.uid() = id)`.
3. A `profiles_update_own` policy MUST exist (idempotent): `FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id)` — required so the org-assignment flow can set `organisation_id`.
4. `audit_documents_org_insert_v2` (org-path-prefix: `split_part(name,'/',1) = profiles.organisation_id`) MUST remain unchanged — no permissive bypass added (INC-W13-BUCKET-RLS-001 protection).
5. Application contract: uploads MUST NOT be attempted before `profiles.organisation_id IS NOT NULL`; upload path MUST be prefixed `/{organisation_id}/`.

**Migration file**: `20260315000003_wave18_profiles_rls_fix.sql`  
**Test**: T-W18-QA-012

---

*END OF TECHNICAL REQUIREMENTS SPECIFICATION*
