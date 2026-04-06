---
agentId: cl7-fixture-missing-last-reviewed
description: Test fixture — missing last_reviewed field (CL-7 RED gate)
module: test
version: 0.0.1
owner: QA
---
# CL-7 Test Fixture — Missing last_reviewed

This file is a QA test fixture for CL-7 RED gate tests (CL-7-T-005).
It intentionally omits the required `last_reviewed` YAML front-matter field.

Required fields per AIMC_PERSONA_LIFECYCLE.md §5.1:
  agentId, description, module, version, last_reviewed (MISSING), owner

DO NOT use in production. This file exists only to support CL-7 RED gate validation.
