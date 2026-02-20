# MAT — Technical Requirements Specification (TRS)

**Module**: MAT (Manual Audit Tool)
**Artifact Type**: Technical Requirements Specification
**Status**: COMPLETE
**Version**: v1.1.0
**Owner**: Foreman (FM)
**Authority**: Derived from FRS v1.1.0 (`modules/mat/01-frs/functional-requirements.md`)
**Applies To**: MAT module within maturion-isms repository
**Created**: 2026-02-13
**Last Updated**: 2026-02-16

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

### TR-072: Embedded AI Assistant Component

**Derives From**: FR-072, FR-028, FR-029, FR-065
**Priority**: P0

The MAT frontend MUST include an embedded AI assistant React component accessible from every application page, implementing the Maturion Platform AI Standard (LL-031).

**Constraints**:
1. Component location: `src/components/common/EmbeddedAIAssistant.tsx` within the MAT frontend application.
2. Agent/model selection: The component MUST expose a selector for at least 4 pre-configured agents derived from the AI routing table (TR-040): General Assistant (routine), Scoring Assistant (scoring), Document Parser (document_parsing), Report Writer (report_generation).
3. Chat UI: The component MUST provide a collapsible panel containing a message history log, text input, and send control.
4. Layout wiring: The component MUST be rendered in the application Layout so it is present on every authenticated page.
5. Routing: All assistant requests MUST specify the selected agent's `taskType` so the AI Gateway (TR-003) can route to the correct model per TR-040.
6. Graceful degradation: When the AI Gateway is unavailable the panel MUST display a placeholder/degraded-mode message without crashing the application (TR-009).
7. Accessibility: The panel MUST include ARIA labels, `aria-expanded`, `role="dialog"`, `role="log"` per WCAG 2.1 AA (TR-035).
8. No secrets exposed in frontend: API keys MUST NOT be included in the React bundle; all AI requests go through the server-side gateway.

> **Governance Note (2026-02-20)**: TR-072 added to address platform governance blocker LL-031 (Maturion/Platform/AI-Standard). Embedded AI assistant UI and agent/model selection were identified as absent from the MAT frontend in issue resolution. See BUILD_PROGRESS_TRACKER.md INC-002.

---

## Priority Summary

| Priority | TR Count | Description |
|----------|----------|-------------|
| P0       | 57       | Must Have — Core technical constraints for MVP |
| P1       | 11       | Should Have — Important for production readiness |
| P2       | 3        | Nice to Have — Future integration requirements |

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

This TRS is derived from the MAT FRS v1.2.0 (`modules/mat/01-frs/functional-requirements.md`, 72 requirements: FR-001 to FR-072).

**Governance Reference**: `governance/strategy/MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md` §4.1

**Upstream**: FRS → TRS (this document)
**Downstream**: TRS → Architecture (`modules/mat/02-architecture/`)

**Traceability**: Complete FRS-to-TRS mapping available in `frs-to-trs-traceability.md`.

**Change Log**:
- v1.2.0 (2026-02-20): Added TR-072 (Embedded AI Assistant Component) per platform governance blocker LL-031. See BUILD_PROGRESS_TRACKER.md INC-002.
- v1.1.0 (2026-02-16): Added TR-071 (Frontend Application as Deployable Artifact) per governance remediation. See BUILD_PROGRESS_TRACKER.md Deviation #9.
- v1.0.0 (2026-02-13): Initial TRS with 70 requirements (TR-001–TR-070).

---

*END OF TECHNICAL REQUIREMENTS SPECIFICATION*
