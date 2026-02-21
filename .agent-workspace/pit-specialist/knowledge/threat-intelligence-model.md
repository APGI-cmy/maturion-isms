# Threat Intelligence Model

**Agent**: pit-specialist  
**Domain**: PIT Threat Intelligence  
**Version**: 1.0.0  
**Date**: 2026-02-21  
**Authority**: CS2 (Johan Ras)

---

## Overview

This knowledge file defines the threat intelligence model used by the PIT specialist for ingesting, normalising, and correlating threat data within the Maturion ISMS platform.

---

## Threat Intelligence Feed Types

### 1. STIX/TAXII Feeds
- **Format**: STIX 2.1 (Structured Threat Information Expression)
- **Transport**: TAXII 2.1 server
- **Ingestion**: Automated pull via scheduled job
- **Normalisation**: Map to Maturion threat object schema
- **Storage**: `supabase:table=threat_intelligence_feeds`

### 2. MITRE ATT&CK
- **Source**: MITRE ATT&CK Enterprise, Mobile, ICS matrices
- **Usage**: TTP mapping, adversary profiling, coverage gap analysis
- **Reference**: `ttp-correlation.md`
- **Update frequency**: Quarterly sync

### 3. Custom Feeds
- **Format**: JSON, CSV, plain text IOC lists
- **Ingestion**: Manual upload or API endpoint
- **Normalisation**: Field mapping configuration required
- **Validation**: Deduplication against existing IOC registry

### 4. NVD (National Vulnerability Database)
- **Source**: NIST NVD API v2
- **Usage**: CVE enrichment, CVSS scoring
- **Linkage**: Maps to `supabase:table=vulnerabilities`
- **Reference**: `vulnerability-tracking.md`

---

## Threat Object Schema

```json
{
  "threat_id": "<uuid>",
  "source": "<feed-name>",
  "type": "threat_actor | malware | campaign | vulnerability | indicator",
  "severity": "critical | high | medium | low",
  "confidence": 0-100,
  "first_seen": "<ISO8601>",
  "last_seen": "<ISO8601>",
  "tags": ["<tag>"],
  "ttps": ["<mitre-attack-id>"],
  "iocs": ["<ioc-ref>"],
  "description": "<free text>",
  "tenant_id": "<tenant-uuid>"
}
```

---

## Normalisation Rules

| Source Field | Maturion Field | Transformation |
|---|---|---|
| STIX `type` | `type` | Map STIX type to Maturion type vocab |
| STIX `confidence` | `confidence` | Numeric 0-100 |
| NVD `cvssMetricV31.cvssData.baseScore` | `severity` | ≥9.0→critical, ≥7.0→high, ≥4.0→medium, <4.0→low |
| ATT&CK `technique.id` | `ttps[]` | Prefix `ATTACK:` |

---

**Authority**: CS2 | **Managed by**: pit-specialist | **Version**: 1.0.0
