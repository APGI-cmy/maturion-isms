---
description: Test fixture — missing agentId field (CL-7 RED gate)
module: test
version: 0.0.1
last_reviewed: 2026-01-01
owner: QA
---
# CL-7 Test Fixture — Missing agentId

This file is a QA test fixture for CL-7 RED gate tests (CL-7-T-001).
It intentionally omits the required `agentId` YAML front-matter field.

Required fields per AIMC_PERSONA_LIFECYCLE.md §5.1:
  agentId (MISSING), description, module, version, last_reviewed, owner

DO NOT use in production. This file exists only to support CL-7 RED gate validation.
