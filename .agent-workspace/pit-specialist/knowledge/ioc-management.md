# IOC Management Guide

**Agent**: pit-specialist  
**Domain**: PIT Indicator of Compromise Management  
**Version**: 1.0.0  
**Date**: 2026-02-21  
**Authority**: CS2 (Johan Ras)

---

## Overview

This knowledge file defines the IOC (Indicator of Compromise) management workflow for the PIT specialist, covering ingestion, deduplication, enrichment, and lifecycle management.

---

## IOC Types

| Type | Example | Format |
|---|---|---|
| IP Address | `192.168.1.1`, `2001:db8::1` | IPv4 / IPv6 |
| Domain | `malicious.example.com` | FQDN |
| URL | `https://malicious.example.com/payload` | Full URL |
| File Hash (MD5) | `d41d8cd98f00b204e9800998ecf8427e` | 32 hex chars |
| File Hash (SHA1) | `da39a3ee5e6b4b0d3255bfef95601890afd80709` | 40 hex chars |
| File Hash (SHA256) | `e3b0c44...` | 64 hex chars |
| Email Address | `phishing@malicious.example.com` | RFC 5321 |
| Registry Key | `HKLM\Software\...` | Windows registry path |

---

## Ingestion Workflow

1. **Receive IOC batch** from orchestrator delegation
2. **Validate format** — reject malformed entries, log validation errors
3. **Deduplicate** — check against `supabase:table=indicators_of_compromise`
4. **Enrich** — cross-reference with threat intelligence feeds for context
5. **Tag** — apply threat actor, campaign, TTP tags
6. **Store** — write to `supabase:table=indicators_of_compromise` with tenant isolation
7. **Return** correlation report to orchestrator

---

## IOC Schema

```json
{
  "ioc_id": "<uuid>",
  "type": "ip | domain | url | md5 | sha1 | sha256 | email | registry_key",
  "value": "<indicator-value>",
  "threat_actor": "<optional>",
  "campaign": "<optional>",
  "ttps": ["<mitre-attack-id>"],
  "severity": "critical | high | medium | low",
  "confidence": 0-100,
  "first_seen": "<ISO8601>",
  "last_seen": "<ISO8601>",
  "source_feed": "<feed-name>",
  "expiry": "<ISO8601>",
  "tenant_id": "<tenant-uuid>",
  "status": "active | expired | false_positive | revoked"
}
```

---

## Lifecycle States

```
active → expired (TTL reached)
active → revoked (manual removal)
active → false_positive (analyst review)
false_positive → active (re-evaluation)
```

---

## Tenant Isolation

**CRITICAL**: Every IOC record MUST include `tenant_id`. Cross-tenant IOC data is prohibited. Supabase RLS enforces row-level isolation.

---

**Authority**: CS2 | **Managed by**: pit-specialist | **Version**: 1.0.0
