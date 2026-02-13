# TRS-to-Architecture Traceability Matrix — MAT Module

| Field          | Value                                      |
|----------------|--------------------------------------------|
| **Version**    | v1.0.0                                     |
| **Module**     | MAT (Maturity Assessment Tool)             |
| **TRS Count**  | 70 (TR-001 – TR-070)                       |
| **Coverage**   | 70 / 70 — 100 %                            |
| **Created**    | 2025-07-15                                 |

---

## 1. Forward Traceability — TRS → Architecture

| TRS ID | TRS Title | Architecture Document | Architecture Section |
|--------|-----------|----------------------|---------------------|
| TR-001 | Frontend Framework | system-architecture.md | §1.1 |
| TR-002 | Backend Platform | system-architecture.md | §1.2 |
| TR-003 | AI/ML Microservices | system-architecture.md, ai-architecture.md | §1.3, §1 |
| TR-004 | Runtime and Platform Constraints | deployment-architecture.md | §1.4 |
| TR-005 | Deployment Targets | deployment-architecture.md | §1.1, §1.2, §1.3 |
| TR-006 | Package Management and Monorepo | deployment-architecture.md | §2.4 |
| TR-007 | Page Load and Navigation | performance-architecture.md | §1 |
| TR-008 | API Response Time Targets | performance-architecture.md | §2 |
| TR-009 | AI Processing Performance | performance-architecture.md | §3 |
| TR-010 | Throughput and Scalability | performance-architecture.md | §4 |
| TR-011 | Resource Limits | performance-architecture.md | §5 |
| TR-012 | Database Schema Design | data-architecture.md | §1 |
| TR-013 | File Storage Architecture | data-architecture.md | §2 |
| TR-014 | Data Serialization and Schemas | data-architecture.md | §3 |
| TR-015 | Offline Data Storage | data-architecture.md, offline-sync-architecture.md | §4, §2 |
| TR-016 | Supabase Integration | integration-architecture.md | §2 |
| TR-017 | AI Service Integration | integration-architecture.md | §3 |
| TR-018 | PIT Module Integration | integration-architecture.md | §4 |
| TR-019 | Maturity Roadmap Integration | integration-architecture.md | §5 |
| TR-020 | Authentication and Authorization | security-architecture.md | §1, §2 |
| TR-021 | External System Data Exchange | integration-architecture.md | §6 |
| TR-022 | Authentication Security | security-architecture.md | §1 |
| TR-023 | Row-Level Security | security-architecture.md | §2 |
| TR-024 | Encryption Requirements | security-architecture.md | §3 |
| TR-025 | Audit Trail Security | security-architecture.md | §4 |
| TR-026 | Evidence Integrity | security-architecture.md | §5 |
| TR-027 | Input Validation and Sanitization | security-architecture.md | §6 |
| TR-028 | API Security | security-architecture.md | §7 |
| TR-029 | GDPR Compliance | security-architecture.md | §8 |
| TR-030 | POPIA Compliance | security-architecture.md | §9 |
| TR-031 | Data Retention | security-architecture.md | §10 |
| TR-032 | Regulatory Standard Alignment | security-architecture.md | §11 |
| TR-033 | WCAG 2.1 Level AA | ui-component-architecture.md | §7 |
| TR-034 | Responsive Design | ui-component-architecture.md | §6 |
| TR-035 | Internationalization | ui-component-architecture.md | §8 |
| TR-036 | PWA Implementation | offline-sync-architecture.md | §4 |
| TR-037 | AI Document Parsing Pipeline | ai-architecture.md | §2 |
| TR-038 | AI Maturity Scoring Pipeline | ai-architecture.md | §3 |
| TR-039 | AI Transcription Pipeline | ai-architecture.md | §4 |
| TR-040 | AI Model Routing Configuration | ai-architecture.md | §5 |
| TR-041 | AI Rate Limiting and Circuit Breaker | ai-architecture.md | §6 |
| TR-042 | Report Generation Engine | reporting-architecture.md | §1 |
| TR-043 | Excel Export Engine | reporting-architecture.md | §2 |
| TR-044 | Pre-Report Review Table | reporting-architecture.md | §3 |
| TR-045 | Service Worker Architecture | offline-sync-architecture.md | §1 |
| TR-046 | Sync Protocol | offline-sync-architecture.md | §3 |
| TR-047 | Criteria Modal Component | ui-component-architecture.md | §2 |
| TR-048 | Dashboard Components | ui-component-architecture.md | §3 |
| TR-049 | Evidence Upload Component | ui-component-architecture.md | §4 |
| TR-050 | Navigation Component | ui-component-architecture.md | §5 |
| TR-051 | Unit Testing | test-strategy.md | §2 |
| TR-052 | Integration Testing | test-strategy.md | §3 |
| TR-053 | End-to-End Testing | test-strategy.md | §4 |
| TR-054 | Performance Testing | test-strategy.md | §5 |
| TR-055 | Linting and Static Analysis | test-strategy.md | §6 |
| TR-056 | Code Formatting | test-strategy.md | §6 |
| TR-057 | Security Scanning | test-strategy.md | §7 |
| TR-058 | CI/CD Pipeline | test-strategy.md | §8 |
| TR-059 | Code Coverage Thresholds | test-strategy.md | §9 |
| TR-060 | Build and Deploy Automation | test-strategy.md | §10 |
| TR-061 | Application Monitoring | observability-architecture.md | §3 |
| TR-062 | Watchdog Implementation | observability-architecture.md | §4 |
| TR-063 | Structured Logging | observability-architecture.md | §5 |
| TR-064 | Container Architecture | deployment-architecture.md | §1.3 |
| TR-065 | Database Infrastructure | deployment-architecture.md, data-architecture.md | §1.2, §5 |
| TR-066 | CDN and Static Asset Delivery | deployment-architecture.md | §1.1 |
| TR-067 | Consent Management System | security-architecture.md | §8 |
| TR-068 | Data Anonymization | security-architecture.md | §8 |
| TR-069 | Video Processing Pipeline | ai-architecture.md | §4 |
| TR-070 | Audio Processing | ai-architecture.md | §4 |

---

## 2. Reverse Traceability — Architecture Document → TRS IDs

| Architecture Document | TRS IDs Covered | Count |
|----------------------|----------------|-------|
| system-architecture.md | TR-001, TR-002, TR-003 | 3 |
| ai-architecture.md | TR-003, TR-037, TR-038, TR-039, TR-040, TR-041, TR-069, TR-070 | 8 |
| deployment-architecture.md | TR-004, TR-005, TR-006, TR-064, TR-065, TR-066 | 6 |
| performance-architecture.md | TR-007, TR-008, TR-009, TR-010, TR-011 | 5 |
| data-architecture.md | TR-012, TR-013, TR-014, TR-015, TR-065 | 5 |
| integration-architecture.md | TR-016, TR-017, TR-018, TR-019, TR-021 | 5 |
| security-architecture.md | TR-020, TR-022, TR-023, TR-024, TR-025, TR-026, TR-027, TR-028, TR-029, TR-030, TR-031, TR-032, TR-067, TR-068 | 14 |
| ui-component-architecture.md | TR-033, TR-034, TR-035, TR-047, TR-048, TR-049, TR-050 | 7 |
| offline-sync-architecture.md | TR-015, TR-036, TR-045, TR-046 | 4 |
| reporting-architecture.md | TR-042, TR-043, TR-044 | 3 |
| test-strategy.md | TR-051, TR-052, TR-053, TR-054, TR-055, TR-056, TR-057, TR-058, TR-059, TR-060 | 10 |
| observability-architecture.md | TR-061, TR-062, TR-063 | 3 |

---

## 3. Coverage Summary

| Metric | Value |
|--------|-------|
| Total TRS Requirements | 70 |
| Mapped to Architecture | 70 |
| **Coverage** | **100 %** |
| Architecture Documents Referenced | 12 |
| Cross-referenced TRS (mapped to >1 doc) | TR-003, TR-015, TR-020, TR-065 |
