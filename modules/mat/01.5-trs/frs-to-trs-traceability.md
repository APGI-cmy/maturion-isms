# MAT — FRS-to-TRS Traceability Matrix

**Module**: MAT (Manual Audit Tool)
**Artifact Type**: Traceability Matrix (FRS → TRS)
**Status**: COMPLETE
**Version**: v1.0.0
**Created**: 2026-02-13
**Last Updated**: 2026-02-13

---

## Purpose

This document provides a complete mapping between every Functional Requirement (FR-001 to FR-069) and the Technical Requirements (TR-001 to TR-070) that constrain its implementation. This traceability ensures:

1. Every FRS requirement has at least one corresponding TRS technical constraint.
2. Every TRS requirement traces back to one or more FRS requirements.
3. No functional requirement is left without technical guidance for the architecture stage.

---

## FRS → TRS Mapping

| FRS ID | FRS Title | TRS IDs | TRS Technical Domain |
|--------|-----------|---------|----------------------|
| FR-001 | Create New Audit | TR-002, TR-008, TR-012, TR-016, TR-020, TR-027 | Backend, Database, Integration, Security |
| FR-002 | Audit Status Lifecycle | TR-002, TR-008, TR-012, TR-016, TR-025 | Backend, Database, Audit Trail |
| FR-003 | Audit Deletion and Archival | TR-012, TR-025, TR-031 | Database, Audit Trail, Retention |
| FR-004 | Upload Criteria Document | TR-011, TR-013, TR-016, TR-026, TR-027, TR-049 | Storage, Security, Upload |
| FR-005 | AI Criteria Parsing | TR-003, TR-009, TR-014, TR-017, TR-037, TR-040 | AI Services, Parsing Pipeline |
| FR-006 | No Hallucination Rule | TR-037 | AI Parsing Pipeline |
| FR-007 | Coverage Rule | TR-037 | AI Parsing Pipeline |
| FR-008 | Human Approval of Compiled Structure | TR-001, TR-012, TR-025, TR-047 | Frontend, Database, Audit Trail |
| FR-009 | Criteria Numbering Immutability | TR-012 | Database Constraints |
| FR-010 | Hierarchical Navigation | TR-001, TR-007, TR-034, TR-050 | Frontend, Performance, Navigation |
| FR-011 | Criteria Modal | TR-001, TR-007, TR-033, TR-034, TR-047 | Frontend, Performance, Accessibility |
| FR-012 | "Not Used" Criteria Exclusion | TR-012, TR-025, TR-047 | Database, Audit Trail, UI |
| FR-013 | Multi-Format Evidence Capture | TR-011, TR-013, TR-026, TR-047, TR-049 | Storage, Security, UI |
| FR-014 | Voice Recording | TR-039, TR-047, TR-070 | Transcription, Audio Processing |
| FR-015 | Photo Capture | TR-011, TR-013, TR-034, TR-049 | Storage, Responsive Design, Upload |
| FR-016 | Document Upload as Evidence | TR-011, TR-013, TR-026, TR-049, TR-052 | Storage, Security, Integration Testing |
| FR-017 | Video Upload and Processing | TR-003, TR-009, TR-011, TR-013, TR-039, TR-049, TR-069 | AI Services, Video Pipeline |
| FR-018 | Concurrent Evidence Upload | TR-010, TR-049 | Throughput, Upload Component |
| FR-019 | Pre-Report Evidence Review | TR-001, TR-025, TR-044 | Frontend, Audit Trail, Review Table |
| FR-020 | Criterion-Level Interview | TR-039, TR-070 | Transcription, Audio Processing |
| FR-021 | Audit-Level Interview | TR-039, TR-070 | Transcription, Audio Processing |
| FR-022 | Interview Governance Rules | TR-038, TR-039 | AI Scoring, Transcription |
| FR-023 | AI Maturity Scoring per Criterion | TR-003, TR-009, TR-017, TR-038, TR-040 | AI Services, Scoring Pipeline |
| FR-024 | Evidence-First Scoring Rule | TR-038 | AI Scoring Pipeline |
| FR-025 | Human Confirmation of AI Scoring | TR-001, TR-012, TR-025 | Frontend, Database, Audit Trail |
| FR-026 | AI Override Logging for Learning | TR-025, TR-040, TR-068 | Audit Trail, AI Logging, Anonymization |
| FR-027 | Maturity Model Support | TR-012, TR-014, TR-038 | Database, Data Schemas, Scoring |
| FR-028 | Dynamic AI Task Routing | TR-003, TR-017, TR-040 | AI Services, Model Routing |
| FR-029 | AI Invocation Logging | TR-017, TR-040, TR-063 | AI Gateway, Logging |
| FR-030 | AI Confidence Flagging | TR-038, TR-040 | AI Scoring, Model Config |
| FR-031 | AI Rate Limiting and Circuit Breaker | TR-017, TR-041 | AI Gateway, Fault Tolerance |
| FR-032 | AI Model Versioning | TR-040 | Model Routing Config |
| FR-033 | Structured Review Table Generation | TR-001, TR-007, TR-044 | Frontend, Performance, Review Table |
| FR-034 | Review Table Editing | TR-025, TR-027, TR-044 | Audit Trail, Input Validation, Review Table |
| FR-035 | Final Report Generation | TR-009, TR-042 | Performance, Report Engine |
| FR-036 | Report Output Formats | TR-014, TR-021, TR-042 | Data Schemas, External Exchange, Report Engine |
| FR-037 | Excel Export of Review Table | TR-021, TR-043 | External Exchange, Excel Engine |
| FR-038 | Report Approval Gate | TR-020, TR-023, TR-025 | Auth, RLS, Audit Trail |
| FR-039 | Global Audit Dashboard | TR-001, TR-007, TR-008, TR-048 | Frontend, Performance, Dashboard |
| FR-040 | Domain Dashboard | TR-001, TR-048 | Frontend, Dashboard |
| FR-041 | MPS Dashboard | TR-001, TR-048 | Frontend, Dashboard |
| FR-042 | Maturity Distribution Overview | TR-001, TR-008, TR-048 | Frontend, Performance, Dashboard |
| FR-043 | Role-Based Access Control (RBAC) | TR-002, TR-016, TR-020, TR-023 | Backend, Auth, RLS |
| FR-044 | Permission Inheritance | TR-023 | RLS Policies |
| FR-045 | Assignment Flow | TR-012, TR-020, TR-023, TR-025 | Database, Auth, RLS, Audit Trail |
| FR-046 | Approval Authority Enforcement | TR-020, TR-023 | Auth, RLS |
| FR-047 | Offline Evidence Capture | TR-004, TR-015, TR-036, TR-045 | Platform, Offline Storage, PWA, Service Worker |
| FR-048 | Automatic Sync on Reconnect | TR-015, TR-036, TR-045, TR-046, TR-052 | Offline Storage, PWA, Sync Protocol, Integration Testing |
| FR-049 | Authentication | TR-020, TR-022, TR-028 | Auth, Security |
| FR-050 | Row-Level Security | TR-002, TR-016, TR-023, TR-052 | Backend, RLS, Integration Testing |
| FR-051 | Audit Trail | TR-025, TR-031, TR-063 | Audit Trail Security, Retention, Logging |
| FR-052 | Data Encryption | TR-024 | Encryption |
| FR-053 | Evidence Integrity Verification | TR-013, TR-026 | Storage, Evidence Integrity |
| FR-054 | Criterion Status Transitions | TR-012, TR-025 | Database Constraints, Audit Trail |
| FR-055 | Modular and Extensible Architecture | TR-006, TR-014, TR-021 | Monorepo, Schemas, External Exchange |
| FR-056 | Integration Hooks with PIT Module | TR-018, TR-052 | PIT Integration, Integration Testing |
| FR-057 | Integration Hooks with Maturity Roadmap | TR-019, TR-052 | Roadmap Integration, Integration Testing |
| FR-058 | Personal Profiling (Consent-Controlled) | TR-029, TR-067, TR-068 | GDPR, Consent, Anonymization |
| FR-059 | Watchdog Monitoring Metrics | TR-061, TR-062 | Monitoring, Watchdog |
| FR-060 | Watchdog Alert Thresholds | TR-062 | Watchdog Alerts |
| FR-061 | Override Analysis and Feedback Loop | TR-040, TR-068 | AI Logging, Anonymization |
| FR-062 | Multi-Viewport Support | TR-001, TR-004, TR-034 | Frontend, Platform, Responsive |
| FR-063 | Progressive Web App (PWA) Support | TR-004, TR-036, TR-045 | Platform, PWA, Service Worker |
| FR-064 | Accessibility Compliance | TR-033 | WCAG Accessibility |
| FR-065 | Internationalization Support | TR-035 | i18n |
| FR-066 | GDPR/POPIA Compliance | TR-029, TR-030, TR-031, TR-067 | Privacy, Compliance, Consent |
| FR-067 | Regulatory Compliance Alignment | TR-032 | ISO Alignment |
| FR-068 | Large Audit Compilation | TR-009, TR-010, TR-044, TR-054 | Performance, Throughput, Review Table, Performance Testing |
| FR-069 | Concurrent Auditor Support | TR-005, TR-010, TR-054 | Deployment, Throughput, Performance Testing |

---

## TRS → FRS Reverse Mapping

| TRS ID | TRS Title | Derived From FRS |
|--------|-----------|------------------|
| TR-001 | Frontend Framework | FR-010, FR-011, FR-033, FR-039, FR-062, FR-063 |
| TR-002 | Backend Platform | FR-001, FR-002, FR-043, FR-050, FR-051 |
| TR-003 | AI/ML Microservices | FR-005, FR-017, FR-023, FR-028, FR-029 |
| TR-004 | Runtime and Platform Constraints | FR-062, FR-063, FR-047 |
| TR-005 | Deployment Targets | FR-069, FR-068 |
| TR-006 | Package Management and Monorepo | FR-055 |
| TR-007 | Page Load and Navigation Performance | FR-010, FR-011, FR-039 |
| TR-008 | API Response Time Targets | FR-001, FR-002, FR-039, FR-042 |
| TR-009 | AI Processing Performance | FR-005, FR-017, FR-023, FR-035 |
| TR-010 | Throughput and Scalability | FR-018, FR-068, FR-069 |
| TR-011 | Resource Limits | FR-004, FR-015, FR-016, FR-017 |
| TR-012 | Database Schema Design | FR-001, FR-002, FR-009, FR-043, FR-050, FR-054 |
| TR-013 | File Storage Architecture | FR-004, FR-013, FR-016, FR-017, FR-053 |
| TR-014 | Data Serialization and Schemas | FR-005, FR-023, FR-036, FR-056, FR-057 |
| TR-015 | Offline Data Storage | FR-047, FR-048 |
| TR-016 | Supabase Integration | FR-001, FR-002, FR-043, FR-050, FR-051 |
| TR-017 | AI Service Integration | FR-005, FR-017, FR-023, FR-028, FR-029 |
| TR-018 | PIT Module Integration | FR-056 |
| TR-019 | Maturity Roadmap Integration | FR-057 |
| TR-020 | Authentication and Authorization Integration | FR-043, FR-049, FR-050 |
| TR-021 | External System Data Exchange | FR-036, FR-037, FR-055 |
| TR-022 | Authentication Security | FR-049 |
| TR-023 | Row-Level Security Implementation | FR-050, FR-043, FR-044 |
| TR-024 | Encryption Requirements | FR-052 |
| TR-025 | Audit Trail Security | FR-051 |
| TR-026 | Evidence Integrity | FR-053, FR-004 |
| TR-027 | Input Validation and Sanitization | FR-001, FR-011, FR-034 |
| TR-028 | API Security | FR-029, FR-031 |
| TR-029 | GDPR Compliance | FR-066, FR-058 |
| TR-030 | POPIA Compliance | FR-066 |
| TR-031 | Data Retention | FR-051, FR-066 |
| TR-032 | Regulatory Standard Alignment | FR-067 |
| TR-033 | WCAG 2.1 Level AA Compliance | FR-064 |
| TR-034 | Responsive Design Implementation | FR-062 |
| TR-035 | Internationalization (i18n) Implementation | FR-065 |
| TR-036 | Progressive Web App (PWA) Implementation | FR-063, FR-047 |
| TR-037 | AI Document Parsing Pipeline | FR-005, FR-006, FR-007 |
| TR-038 | AI Maturity Scoring Pipeline | FR-023, FR-024, FR-027 |
| TR-039 | AI Transcription Pipeline | FR-014, FR-017, FR-020, FR-021 |
| TR-040 | AI Model Routing Configuration | FR-028, FR-029, FR-032 |
| TR-041 | AI Rate Limiting and Circuit Breaker | FR-031 |
| TR-042 | Report Generation Engine | FR-035, FR-036 |
| TR-043 | Excel Export Engine | FR-037 |
| TR-044 | Pre-Report Review Table | FR-033, FR-034 |
| TR-045 | Service Worker Architecture | FR-047, FR-048, FR-063 |
| TR-046 | Sync Protocol | FR-048 |
| TR-047 | Criteria Modal Component | FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017 |
| TR-048 | Dashboard Components | FR-039, FR-040, FR-041, FR-042 |
| TR-049 | Evidence Upload Component | FR-013, FR-018 |
| TR-050 | Navigation Component | FR-010 |
| TR-051 | Unit Testing | Cross-cutting (all FR) |
| TR-052 | Integration Testing | FR-016, FR-017, FR-048, FR-056, FR-057 |
| TR-053 | End-to-End Testing | FR-001, FR-002, FR-023, FR-035 |
| TR-054 | Performance Testing | FR-068, FR-069 |
| TR-055 | Linting and Static Analysis | Cross-cutting (all FR) |
| TR-056 | Code Formatting | Cross-cutting (all FR) |
| TR-057 | Security Scanning | FR-049, FR-050, FR-052, FR-053 |
| TR-058 | CI/CD Pipeline | Cross-cutting (all FR) |
| TR-059 | Code Coverage Thresholds | Cross-cutting (all FR) |
| TR-060 | Build and Deploy Automation | TR-005, TR-058 |
| TR-061 | Application Monitoring | FR-059, FR-060 |
| TR-062 | Watchdog Implementation | FR-059, FR-060 |
| TR-063 | Structured Logging | FR-029, FR-051, FR-059 |
| TR-064 | Container Architecture | TR-003, TR-005 |
| TR-065 | Database Infrastructure | TR-002, TR-012 |
| TR-066 | CDN and Static Asset Delivery | TR-005, TR-007 |
| TR-067 | Consent Management System | FR-058, FR-066 |
| TR-068 | Data Anonymization | FR-026, FR-058, FR-066 |
| TR-069 | Video Processing Pipeline | FR-017 |
| TR-070 | Audio Processing | FR-014, FR-020, FR-021 |

---

## Coverage Summary

| Metric | Value |
|--------|-------|
| Total FRS Requirements | 69 (FR-001 to FR-069) |
| Total TRS Requirements | 70 (TR-001 to TR-070) |
| FRS Requirements with TRS Coverage | 69 / 69 (100%) |
| TRS Requirements traced to FRS | 70 / 70 (100%) |
| Cross-cutting TRS (all FR) | 6 (TR-051, TR-055, TR-056, TR-058, TR-059, TR-060) |
| Infrastructure TRS (derived from TRS) | 3 (TR-064, TR-065, TR-066) |

**Coverage**: 100% — Every FRS requirement has at least one corresponding TRS technical constraint. Every TRS requirement traces back to one or more FRS requirements (or to other TRS requirements for infrastructure concerns).

---

## Document Authority

**FRS Source**: `modules/mat/01-frs/functional-requirements.md` v1.0.0
**TRS Source**: `modules/mat/01.5-trs/technical-requirements-specification.md` v1.0.0
**Governance Reference**: `governance/strategy/MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md` §4.1

---

*END OF FRS-TO-TRS TRACEABILITY MATRIX*
