# Parking Station — Improvement Suggestions Log

**Agent**: qa-builder
**Repository**: APGI-cmy/maturion-isms
**Purpose**: Append-only index of improvement suggestions from agent session handovers. One line per suggestion. Canonical detail in referenced session memory file.
**Pattern**: Per-agent parking station (migrated from global on 2026-03-03 per issue [Propagation][Parking Station]).
**Aggregation (planned)**: Future CI reporting will aggregate all `.agent-workspace/*/parking-station/suggestions-log.md` files once implemented.

---

| Date | Agent | Session | Summary | Detail |
|------|-------|---------|---------|--------|
| 2026-02-25 | qa-builder | session-001 | [SESSION-END] | Wave 5 RED-gate tests delivered — builder contract compliance (Phase 1/2/4) was initially skipped and corrected on re-delegation; locked-in learning recorded in lessons-learned.md | session-001-20260225.md |
| 2026-02-26 | qa-builder | session-wave7-red-20260226 | Wave 7 RED gate delivered — PerplexityAdapter import is the single-file RED trigger; when api-builder creates PerplexityAdapter.ts both wave7-cst.test.ts and ProviderAdapter.contract.test.ts will immediately become loadable and GREEN | session-wave7-red-20260226.md |
| 2026-02-26 | qa-builder | session-mat-wave8-red-20260226 | Delegation briefs should include actual grep output confirming target file state (not just line estimates) to prevent attribution errors in RED gate tests | session-mat-wave8-red-20260226.md |
| 2026-02-26 | qa-builder | session-005-20260226 | [SESSION-END] | Add 'wave_pattern_reference' field to architecture freeze docs pointing to prior wave test pattern files for faster qa-builder orientation | session-005-20260226.md |
| 2026-02-26 | qa-builder | session-010 | api-builder should add pyproject.toml to apps/mat-ai-gateway/ so pytest can resolve local imports without sys.path workaround in conftest | session-010-wave10-ai-gateway-red-20260226.md |
| 2026-03-04 | qa-builder | session-098 | readWaveMigrationSql() helper pattern (target-specific-file with clear RED STATE error) should be adopted as canonical RED gate test pattern; T-PBF2-008 pattern demonstrates correct structure for negative-assertion RED gates (positive assertion first) | session-098-20260304.md |
| 2026-10-05 | qa-builder | session-gov-2064-t2-gate-router-20261005 | Aggregate "all files must match narrow predicate set" gating functions (e.g. removed all_files_database_or_evidence) are a fail-open/fail-fallthrough risk pattern in the gate router; canon should recommend "any matching payload file escalates" + explicit manifest conflict-fail-closed as the preferred idiom instead | session-gov-2064-t2-gate-router-20261005.md |
