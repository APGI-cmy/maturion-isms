# MANUAL AUDIT TOOL (MAT) – PERFORMANCE ARCHITECTURE v1.0.0

| Field            | Value                                      |
|------------------|--------------------------------------------|
| Module           | MAT – Manual Audit Tool                    |
| Version          | v1.0.0                                     |
| Status           | DRAFT                                      |
| Classification   | Internal – Architecture                    |
| Owner            | Maturion Platform Team                     |
| Last Updated     | 2025-01-01                                 |
| Governance       | Domain 3.8 – Performance and Scalability   |
| TRS Coverage     | TR-007, TR-008, TR-009, TR-010, TR-011     |

---

## 1. Purpose

This document defines the performance architecture for the Manual Audit Tool (MAT) module. It specifies performance targets, API response time requirements, AI processing constraints, scalability parameters, resource limits, and CI-enforced performance budgets that govern all MAT implementation and operational work.

---

## 2. Performance Targets (TR-007)

### 2.1 Page Load and Navigation

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial page load (cold, 4G) | < 3 seconds | Lighthouse, WebPageTest |
| SPA navigation | < 500ms | Performance API |
| Criteria modal open | < 500ms | Performance API |
| Dashboard render | < 3 seconds | Performance API |
| Largest Contentful Paint (LCP) | < 2.5 seconds | Web Vitals |
| First Input Delay (FID) | < 100ms | Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Web Vitals |
| Initial JS bundle (gzipped) | < 300KB | Build output |

### 2.2 Optimization Strategies

- Code splitting with `React.lazy()` and dynamic imports
- Route-based chunking via Vite
- Tree shaking to eliminate dead code
- Image optimization: WebP/AVIF with fallback, `srcset`, lazy loading
- Brotli/gzip compression on CDN
- Content-hash fingerprinting for cache busting
- Preload critical resources
- Service Worker caching for repeat visits

---

## 3. API Response Time Targets (TR-008)

| Operation | Target (p95) | Strategy |
|-----------|-------------|----------|
| CRUD operations | < 200ms | PostgREST direct, indexed queries |
| List/search (paginated) | < 500ms | Cursor pagination, indexed columns |
| Dashboard aggregation | < 1 second | Materialized views, database functions |
| File upload initiation | < 200ms | Direct Supabase Storage upload |
| Realtime subscription | < 5 seconds | Supabase Realtime channels |

### 3.1 Database Performance

- Indexes on: `audit_id`, `criterion_id`, `organisation_id`, `status`, `created_at`
- Materialized views for dashboard aggregation queries
- PgBouncer connection pooling (20–100 connections)
- `EXPLAIN ANALYZE` for all critical query paths
- Query timeout: 30 seconds max

---

## 4. AI Processing Performance (TR-009)

| Operation | Target | Strategy |
|-----------|--------|----------|
| Document parsing (≤50 pages) | < 60 seconds | Chunked processing, parallel chunks |
| Maturity scoring per criterion | < 30 seconds | Single API call per criterion |
| Audio transcription | < 2× real-time | Whisper API streaming |
| Video processing | < 3× video duration | FFmpeg + Whisper in parallel |
| Report generation (≤500 criteria) | < 2 minutes | Streaming generation |
| Large audit compilation (1000+) | < 5 minutes | Parallel processing, batched |

### 4.1 AI Processing Strategy

- All AI operations are asynchronous with progress polling
- Progress tracked in database with percentage and status
- Webhook callback option for completion notification
- Job queue (Celery/Bull) for video/audio processing
- Max 2 concurrent video processing jobs per container instance
- Token-aware chunking to stay within model context limits

---

## 5. Throughput and Scalability (TR-010)

| Metric | Target |
|--------|--------|
| Concurrent users | 100+ per deployment |
| Concurrent file uploads per user | 10+ |
| Max criteria per audit | 2,000+ |
| Max evidence items per audit | 10,000+ |
| Database connection pool | 20–100 (auto-scaling) |
| API rate limit (per user) | 100 requests/second |
| API rate limit (global) | 1,000 requests/second |

### 5.1 Scaling Strategy

- **Frontend**: Horizontal via CDN (Vercel auto-scales edge network)
- **Supabase**: Vertical (upgrade plan tier) + read replicas for analytics
- **AI Gateway**: Horizontal auto-scaling (1–10 container instances based on CPU/request metrics)
- **Storage**: Supabase Storage auto-scales with plan tier

### 5.2 Auto-scaling Triggers

| Component | Metric | Scale-up Threshold | Scale-down Threshold |
|-----------|--------|-------------------|---------------------|
| AI Gateway | CPU utilization | > 70% for 2 minutes | < 30% for 5 minutes |
| AI Gateway | Request queue depth | > 50 pending | < 10 pending |
| AI Gateway | Response time | p95 > 60 seconds | p95 < 30 seconds |

---

## 6. Resource Limits (TR-011)

| Resource | Limit | Enforcement |
|----------|-------|-------------|
| Document upload | 50MB per file | Client + server validation |
| Image upload | 50MB per file | Client + server validation |
| Video upload | 500MB per file | Client + server validation |
| Audio recording | 120 minutes | Client-side timer |
| Storage per audit | 50GB | Database constraint + pre-upload check |
| Storage per organisation | 500GB (configurable) | Admin-managed quota |
| AI prompt size | 128K tokens | Token counting before API call |
| JSON payload | 1MB | API middleware validation |

---

## 7. Known Bottlenecks and Mitigation

| Bottleneck | Impact | Mitigation |
|-----------|--------|------------|
| Large criteria document parsing | AI processing delay | Chunk documents, parallel processing |
| Video file uploads (500MB) | Bandwidth, timeout | Resumable uploads (tus protocol), chunked upload |
| Dashboard with 2000+ criteria | Query performance | Materialized views, virtual scrolling, pagination |
| Concurrent AI scoring | OpenAI rate limits | Request queue, circuit breaker, batching |
| Offline sync with 1000+ items | Network bandwidth on reconnect | Prioritized sync (metadata first, files second), delta sync |
| Report generation (500+ criteria) | Memory, processing time | Streaming generation, server-side rendering |
| Audit trail queries (7-year data) | Query performance | Monthly partitioning, archival policy |

---

## 8. Performance Budgets (CI-enforced)

| Budget | Threshold | Action on Violation |
|--------|-----------|-------------------|
| Bundle size (initial JS) | 300KB gzipped | Build fails |
| Bundle size (total) | 1MB gzipped | Warning |
| LCP | 2.5 seconds | Build fails |
| CLS | 0.1 | Warning |
| API p95 response time | Per-endpoint target | Performance test fails |
| Memory usage (AI Gateway) | 4GB per container | Alert + auto-restart |

---

## 9. Revision History

| Version | Date       | Author                 | Changes         |
|---------|------------|------------------------|-----------------|
| v1.0.0  | 2025-01-01 | Maturion Platform Team | Initial release |
