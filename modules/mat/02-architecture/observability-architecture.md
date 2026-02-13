# MANUAL AUDIT TOOL (MAT) – OBSERVABILITY ARCHITECTURE v1.0.0

| Field            | Value                                      |
|------------------|--------------------------------------------|
| Module           | MAT – Manual Audit Tool                    |
| Version          | v1.0.0                                     |
| Status           | Approved                                   |
| Classification   | Internal – Architecture                    |
| Owner            | Maturion Platform Team                     |
| Last Updated     | 2025-01-01                                 |
| Governance       | Domain 3.9                                 |
| TRS Requirements | TR-061 through TR-063                      |

---

## 1. Error Classification

| Category | Examples | HTTP Code | User Action | Logging Level |
|----------|----------|-----------|-------------|---------------|
| User Error | Invalid input, missing field, unauthorized | 400, 401, 403 | Show validation message | INFO |
| System Error | Database error, internal exception | 500 | "Something went wrong" + retry | ERROR |
| External Dependency | OpenAI timeout, Supabase down | 502, 503 | "Service temporarily unavailable" + fallback | WARN/ERROR |
| Rate Limited | Too many requests | 429 | "Please slow down" + retry-after | WARN |
| Not Found | Invalid audit/criterion ID | 404 | "Resource not found" | INFO |
| Conflict | Sync conflict, concurrent edit | 409 | Show conflict resolution UI | WARN |

## 2. Error Response Format

Standard error response schema for all API endpoints:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error description",
    "details": [{ "field": "title", "message": "Title is required" }],
    "correlation_id": "uuid-v4",
    "timestamp": "ISO8601"
  }
}
```

## 3. Application Monitoring (TR-061)

- **Frontend**: Sentry for error tracking and performance monitoring
  - Automatic error boundary capture
  - Performance tracing (page loads, API calls)
  - Session replay for debugging
  - Release tracking for regression detection
- **Backend**: Datadog APM or Sentry for server-side monitoring
  - Request tracing with correlation IDs
  - Database query performance monitoring
  - Edge Function execution metrics
- **AI Services**: Custom monitoring
  - Token usage per model per organisation
  - Latency per AI operation type
  - Error rate per model
  - Cost tracking and alerting
- **Operational Dashboard**: Grafana or Datadog dashboard showing:
  - Request rate, error rate, response times
  - AI operation metrics
  - Storage usage
  - Active user count
  - Sync success/failure rates

## 4. Watchdog Implementation (TR-062)

### Storage

- Time-series data in partitioned Supabase table (watchdog_metrics)
- Alternatively: Prometheus/InfluxDB for high-frequency metrics

### Alert Thresholds

| Metric | Threshold | Alert Channel | Severity |
|--------|-----------|---------------|----------|
| AI refusal rate | > 15% | Email + Slack | Warning |
| AI override rate | > 25% | Email + Slack | Warning |
| Sync failure rate | > 5% | Email + Slack | Critical |
| Unauthorized access attempts | > 0 | Email + SMS | Critical |
| API response time | > p95 threshold | Email + Slack | Warning |
| Error rate (5xx) | > 1% | Email + Slack | Critical |
| Storage usage | > 80% quota | Email | Warning |
| Certificate expiry | < 30 days | Email | Warning |

### Alert Features

- Configurable thresholds per organisation
- Escalation chains (email → Slack → SMS)
- Alert deduplication (same alert suppressed for 15 minutes)
- Acknowledgment tracking
- Alert history and audit trail

## 5. Structured Logging (TR-063)

### Log Format (JSON)

```json
{
  "timestamp": "2026-02-13T13:40:29.582Z",
  "level": "INFO",
  "service": "mat-frontend|mat-ai-gateway|mat-edge-function",
  "correlation_id": "uuid-v4",
  "message": "Human-readable log message",
  "context": {
    "user_id": "uuid",
    "organisation_id": "uuid",
    "audit_id": "uuid",
    "criterion_id": "uuid"
  },
  "metadata": {}
}
```

### Log Levels

| Level | Usage | Examples |
|-------|-------|----------|
| DEBUG | Development debugging | Query parameters, full request/response |
| INFO | Normal operations | Audit created, evidence uploaded, scoring completed |
| WARN | Potential issues | AI confidence low, retry triggered, fallback used |
| ERROR | Failures requiring attention | Database error, AI API failure, hash mismatch |
| FATAL | System-critical failures | Database connection lost, unrecoverable error |

### PII Masking

- User names, email addresses, IP addresses masked in logs
- Pattern: `user@example.com` → `u***@e***.com`
- Audit content never logged (only IDs and metadata)
- Evidence file contents never logged

### Log Storage

- **Hot storage**: 90 days in CloudWatch Logs or Grafana Loki
- **Cold storage**: 1 year in S3/GCS (compressed)
- **Retention policy**: Automated lifecycle rules

### Correlation IDs

- Generated at request entry point (frontend or API gateway)
- Propagated through all service calls via `X-Correlation-ID` header
- Enables end-to-end request tracing across frontend, Edge Functions, AI Gateway

## 6. Debugging Support

- **Frontend**: React DevTools, Sentry session replay, structured console logging
- **Backend**: Supabase Dashboard (query inspector, logs viewer)
- **AI Gateway**: Request/response logging with correlation IDs, model invocation history
- **Production Debugging**: Log correlation ID search, trace visualization, error grouping by stack trace
- **Health Endpoints**: `GET /health` on all services returning status, version, uptime, dependency health
