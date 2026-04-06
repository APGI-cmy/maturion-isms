---
agentId: wrong-id
description: Fixture persona — agentId does not match filename
module: test
version: 1.0.0
last_reviewed: 2026-01-01
owner: CS2
---

# CL-7 Fixture — Wrong agentId

This fixture has all required YAML front-matter fields present, but `agentId`
does not match the filename (`cl7-fixture-wrong-agentid`).

Used by CL-7-T-014 to test that PersonaLoader rejects mismatched agentId.
