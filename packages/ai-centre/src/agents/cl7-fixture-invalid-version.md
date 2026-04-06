---
agentId: cl7-fixture-invalid-version
description: Fixture persona — version is not valid semver
module: test
version: not-semver
last_reviewed: 2026-01-01
owner: CS2
---

# CL-7 Fixture — Invalid Version

This fixture has all required YAML front-matter fields present, but `version`
is not valid semver (`not-semver` instead of `N.N.N`).

Used by CL-7-T-015 to test that PersonaLoader rejects an invalid semver version.
