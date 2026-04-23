# Scope Declaration — Wave: mmm-storage-model-codification-20260422

**Foreman**: foreman-v2-agent v6.2.0
**Wave**: mmm-storage-model-codification-20260422
**Issue**: maturion-isms#1458
**Branch**: copilot/resolve-mmm-storage-model-drift
**Date**: 2026-04-22
**CS2 Authorization**: CONFIRMED — issue opened by CS2 (@APGI-cmy)

## Wave Summary

Resolve and codify the MMM storage bucket model, eliminating the legacy drift between
the older MAT deployment model and the later MMM architecture-defined model.

The MMM architecture (Stage 5, frozen) defines two MMM-native buckets:
- `mmm-evidence` (private) — stores all audit evidence files
- `mmm-framework-sources` (private) — stores framework source documents and snapshots

This wave codifies this decision with:
1. An Architecture Decision Record (ADR) at `modules/MMM/storage-model-decision.md`
2. A new migration adding missing audio MIME types to `mmm-evidence` (voice evidence support)
3. A new migration hardening RLS to org-level path isolation for `mmm-evidence`
4. Red QA tests validating audio MIME coverage
5. BUILD_PROGRESS_TRACKER.md update

## Approved Artifact Paths

```yaml
approved_artifact_paths:
  # Foreman-authored governance/architecture documentation
  - modules/MMM/storage-model-decision.md
  - modules/MMM/BUILD_PROGRESS_TRACKER.md
  - .agent-workspace/foreman-v2/personal/wave-current-tasks.md
  - .agent-workspace/foreman-v2/personal/scope-declaration-wave-mmm-storage-model-codification-20260422.md
  - .agent-admin/assurance/iaa-wave-record-mmm-storage-model-codification-20260422.md
  # Schema-builder: migration artifacts
  - supabase/migrations/20260420000004_mmm_storage_buckets.sql
  - supabase/migrations/20260422000001_mmm_evidence_audio_mime_fix.sql
  - supabase/migrations/20260422000002_mmm_evidence_rls_hardening.sql
  # QA-builder: test artifacts
  - modules/MMM/tests/B1-schema/b1-schema.test.ts
  # ECAP artifacts
  - .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-mmm-storage-model-codification-20260422.md
  - .agent-workspace/execution-ceremony-admin-agent/bundles/session-mmm-storage-model-codification-20260422.md
  - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-storage-model-codification-20260422.md
  - .agent-workspace/foreman-v2/memory/session-mmm-storage-model-codification-20260422.md
```

## Out of Scope

- Broad storage refactors unrelated to MMM
- Legacy MAT app bucket changes
- Frontend upload component changes (existing mmm-upload-evidence Edge Function already references mmm-evidence)
- Manual Supabase dashboard changes (no repo-backed codification)
- Changing product evidence requirements without documenting why
