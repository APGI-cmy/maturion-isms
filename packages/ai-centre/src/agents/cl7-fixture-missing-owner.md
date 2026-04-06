---
agentId: cl7-fixture-missing-owner
description: Test fixture — missing owner field (CL-7 RED gate)
module: test
version: 0.0.1
last_reviewed: 2026-01-01
---
# CL-7 Test Fixture — Missing owner

This file is a QA test fixture for CL-7 RED gate tests (CL-7-T-006).
It intentionally omits the required `owner` YAML front-matter field.

Required fields per AIMC_PERSONA_LIFECYCLE.md §5.1:
  agentId, description, module, version, last_reviewed, owner (MISSING)

DO NOT use in production. This file exists only to support CL-7 RED gate validation.
