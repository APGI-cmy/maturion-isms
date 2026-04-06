---
agentId: cl7-fixture-missing-version
description: Test fixture — missing version field (CL-7 RED gate)
module: test
last_reviewed: 2026-01-01
owner: QA
---
# CL-7 Test Fixture — Missing version

This file is a QA test fixture for CL-7 RED gate tests (CL-7-T-004).
It intentionally omits the required `version` YAML front-matter field.

Required fields per AIMC_PERSONA_LIFECYCLE.md §5.1:
  agentId, description, module, version (MISSING), last_reviewed, owner

DO NOT use in production. This file exists only to support CL-7 RED gate validation.
