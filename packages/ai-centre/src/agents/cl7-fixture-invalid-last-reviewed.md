---
agentId: cl7-fixture-invalid-last-reviewed
description: Fixture persona — last_reviewed is not YYYY-MM-DD
module: test
version: 1.0.0
last_reviewed: 01/01/2026
owner: CS2
---

# CL-7 Fixture — Invalid last_reviewed

This fixture has all required YAML front-matter fields present, but
`last_reviewed` is not in YYYY-MM-DD format (`01/01/2026` instead of
`2026-01-01`).

Used by CL-7-T-016 to test that PersonaLoader rejects an invalid date format.
