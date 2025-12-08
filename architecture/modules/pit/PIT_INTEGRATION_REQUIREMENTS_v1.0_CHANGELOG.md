# PIT Integration Requirements - Changelog

This file tracks all changes to the PIT Integration Requirements architecture document.

---

## Version 1.0 - 2025-12-08

**Status:** Architecture Approved  
**Type:** Initial Release

### Added

- **Section 0: Context**
  - Defined PIT as the central execution engine of the ISMS
  - Outlined core responsibilities: turning gaps, risks, and decisions into projects, tasks, and milestones
  - Documented input sources: Maturity, Risk, WRAC, Incident, Controls
  - Specified output targets: Maturity, Remote Assurance, Analytics, Dashboards
  - Established PIT ownership of project creation, task allocation, progress tracking, audit trail, and procurement references

- **Section 1: Integration Principles**
  - Single Source of Truth: PIT as sole implementation work tracker
  - Event-Driven architecture where possible
  - Bidirectional linking between PIT entities and originating objects
  - Non-blocking analytic flows
  - No business logic duplication

- **Section 2: Core Entities & IDs**
  - **2.1:** Defined minimal PIT entities (projects, milestones, tasks, task_comments, task_links, project_roles, audit_log)
  - **2.2:** Established origin linking model with origin_module, origin_type, origin_id, origin_path

- **Section 3: Integration with Maturity Module**
  - **3.1:** Documented 5 triggers from Maturity → PIT
  - **3.2:** Defined 3 event specifications with complete JSON payloads:
    - `maturity.criteria_gap_detected`
    - `maturity.approval_with_conditions`
    - `maturity.external_audit_finding`
  - **3.3:** Established data contract for PIT → Maturity feedback with status metrics

- **Section 4: Integration with Risk, WRAC and Controls**
  - **4.1:** Documented Threat/Vulnerability/Risk → WRAC → PIT flow
  - **4.2:** Specified Controls & CCR (Critical Control Register) integration requirements

- **Section 5: Integration with Incident & Intelligence**
  - Defined incident event triggers: `incident.new_case` and `incident.repeated_pattern_detected`
  - Established origin module support for incident integration

- **Section 6: Integration with Analytics & Remote Assurance**
  - **6.1:** Specified Analytics read requirements and queryable aggregates
  - **6.2:** Documented Remote Assurance integration flow for control validation

- **Section 7: User Roles & Permissions (Cross-Module)**
  - Defined 5 key roles: Org Lead/Owner, Domain Implementer, Evidence Manager, PIT Manager, External Auditor
  - Established permission rules and assignment authority

- **Section 8: Error Handling & Edge Cases**
  - Documented handling for deleted/archived tasks
  - Specified behavior for target level upgrades
  - Addressed duplicate gap merging requirements

- **Section 9: QA Requirements for Integration**
  - Defined 6 criteria for "green" integration status
  - Specified required integration test locations

- **Section 10: Versioning & Evolution**
  - Established version 1.0 baseline
  - Documented change management requirements

### Notes

- This is the initial comprehensive integration requirements document for the PIT module
- Defines how PIT integrates with all other ISMS modules
- Establishes event-driven architecture patterns and data contracts
- Provides foundation for PIT implementation and cross-module integration testing
- Must be updated alongside Maturity Module Architecture and PIT Module Architecture for consistency

---

**End of Changelog**
