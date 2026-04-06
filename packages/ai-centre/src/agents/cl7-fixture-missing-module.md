---
agentId: cl7-fixture-missing-module
description: Test fixture — missing module field (CL-7 RED gate)
version: 0.0.1
last_reviewed: 2026-01-01
owner: QA
---
# CL-7 Test Fixture — Missing module

This file is a QA test fixture for CL-7 RED gate tests (CL-7-T-003).
It intentionally omits the required `module` YAML front-matter field.

Required fields per AIMC_PERSONA_LIFECYCLE.md §5.1:
  agentId, description, module (MISSING), version, last_reviewed, owner

DO NOT use in production. This file exists only to support CL-7 RED gate validation.
