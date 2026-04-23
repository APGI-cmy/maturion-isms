# MMM Storage Model — Architecture Decision Record

**Document ID**: MMM-ADR-001
**Wave**: mmm-storage-model-codification-20260422
**Issue**: maturion-isms#1458
**Date**: 2026-04-22
**Status**: ACTIVE — CANONICAL DECISION
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Architecture Reference**: `modules/MMM/04-architecture/architecture.md` §A8.2, §A5.8, §A5.6

---

## 1. Context — Legacy Drift

The MMM module encountered an unresolved storage model ambiguity inherited from two distinct
legacy MAT implementation phases:

### 1.1 — Legacy MAT Deployment Expectation (older)
The older MAT deployment/setup evidence anticipated distinct semantic storage buckets:
- `criteria-documents` — for criteria/framework source uploads
- `evidence-files` — for general evidence documents
- `evidence-audio` — for audio/voice evidence recordings
- `evidence-photos` — for photo evidence capture

### 1.2 — Legacy MAT Repo-Backed Implementation (later)
The later MAT repo-backed implementation consolidated these into:
- `audit-documents` (private, 50 MB) — single bucket for all criteria and evidence uploads
- `organisation-assets` (public, 10 MB) — branding assets only
- Path-based segregation within `audit-documents` using `/{org_id}/...` prefix

**Migration evidence**: `apps/maturion-maturity-legacy/supabase/migrations/20260303000004_storage_buckets.sql`
(later hardened by `20260303000005_audit_documents_rls_hardening.sql` for org-level path isolation)

### 1.3 — Live Dashboard State
The live Supabase project dashboard may contain manually-created buckets reflecting either
or both models above. This document establishes that the repo-backed migration is the
source of truth; any manual dashboard bucket not backed by a migration in this repository
is considered implementation drift and is not canonical.

---

## 2. Decision

**MMM chooses Option C — MMM-native consolidated bucket model.**

This is a deliberate architectural decision that:
- Does NOT adopt the legacy MAT semantic-bucket model (Option A)
- Does NOT directly replicate the legacy MAT consolidated model (Option B)
- Defines a new, MMM-prefixed, purpose-scoped bucket structure

---

## 3. Canonical MMM Storage Model

### 3.1 — Required Buckets

| Bucket Name | Visibility | File Size Limit | Purpose |
|------------|-----------|----------------|---------|
| `mmm-evidence` | Private (authenticated only) | 50 MB per file | All audit evidence uploads: documents, photos, voice/audio recordings, transcripts |
| `mmm-framework-sources` | Private (authenticated only) | 100 MB per file | Framework source documents for AI parsing; published framework snapshots |

**No other storage buckets are required or canonical for MMM v1.0.**

Reports are generated on-demand (Journey J-13: `/assessments/:id/report`) and are either
downloaded directly or routed to PIT export. Generated reports are NOT stored in a
separate reports bucket in MMM v1.0.

Organisation branding assets (logos) are managed at the MMM module level via the
`mmm_organisations.logo_url` column in the database, which references an external URL
or a future `mmm-org-assets` bucket (deferred to a future enhancement wave, per scope of
this ADR).

### 3.2 — Bucket Configuration

#### `mmm-evidence`
```
id: mmm-evidence
public: false
file_size_limit: 52428800  (50 MB)
allowed_mime_types:
  # Documents
  - image/jpeg
  - image/png
  - image/gif
  - image/webp
  - application/pdf
  - application/msword
  - application/vnd.openxmlformats-officedocument.wordprocessingml.document
  - application/vnd.ms-excel
  - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  - application/vnd.ms-powerpoint
  - application/vnd.openxmlformats-officedocument.presentationml.presentation
  - text/plain
  - text/csv
  - application/zip
  - application/json
  # Voice / audio evidence (architecture §A5.6 evidence_type: "voice")
  - audio/mpeg        (MP3)
  - audio/wav         (WAV)
  - audio/mp4         (M4A/AAC in MP4 container)
  - audio/webm        (WebM audio, browser-native)
  - audio/ogg         (OGG Vorbis)
  # Video evidence (walkabout mode captures)
  - video/mp4
  - video/webm
```

#### `mmm-framework-sources`
```
id: mmm-framework-sources
public: false
file_size_limit: 104857600  (100 MB)
allowed_mime_types:
  - application/pdf
  - application/msword
  - application/vnd.openxmlformats-officedocument.wordprocessingml.document
  - text/plain
  - text/markdown
  - application/json
  - text/csv
```

### 3.3 — Path Convention for `mmm-evidence`

All files stored in `mmm-evidence` MUST follow this path convention:

```
{organisation_id}/{assessment_id}/{criterion_id}/{filename}
```

Examples:
```
org-uuid-123/assessment-uuid-456/criterion-uuid-789/interview-recording.mp3
org-uuid-123/assessment-uuid-456/criterion-uuid-789/policy-document.pdf
org-uuid-123/assessment-uuid-456/criterion-uuid-789/site-photo-001.jpg
```

This path convention serves as the basis for RLS org-level isolation.

### 3.4 — Path Convention for `mmm-framework-sources`

Framework source documents use:
```
sources/{framework_id}/{filename}
```

Framework published snapshots use (immutable):
```
snapshots/{framework_id}/v{version}.json
```

### 3.5 — RLS Policy Model

#### `mmm-evidence` — Org-Level Path Isolation

The RLS policies for `mmm-evidence` MUST enforce that users can only access files
under their own organisation's path prefix (`split_part(name, '/', 1) = org_id`).

This mirrors the pattern established in the legacy MAT `audit_documents_org_read_v2` /
`audit_documents_org_insert_v2` policies but is applied to the MMM-prefixed bucket.

Migration: `supabase/migrations/20260422000002_mmm_evidence_rls_hardening.sql`

#### `mmm-framework-sources` — Authenticated Access

Framework sources are accessible to any authenticated user (read) and restricted to
admins/framework owners (write). Framework snapshots are immutable post-publish.

---

## 4. Why This Model Was Chosen

### 4.1 — Why NOT Option A (semantic bucket separation)
- The legacy MAT semantic bucket model (`criteria-documents`, `evidence-files`,
  `evidence-audio`, `evidence-photos`) was the deployment/setup expectation, but
  it was NEVER implemented in repo-backed migrations.
- Separate buckets by evidence type add operational complexity without meaningful
  security or compliance benefit (all are private; RLS is path-based, not bucket-based).
- The consolidated bucket model (with path-based segregation) provides equivalent
  semantic separation through the `{org_id}/{assessment_id}/{criterion_id}/{filename}`
  path convention.

### 4.2 — Why NOT direct adoption of Option B (legacy MAT `audit-documents`)
- The legacy MAT bucket `audit-documents` is not MMM-namespaced.
- MMM operates as a separate module with its own Supabase project; it must not
  depend on or reference buckets from the legacy MAT deployment.
- The MMM architecture mandates a clean module boundary with no legacy artifact injection
  (architecture.md §One-Time-Build Integrity Guarantees point 4).

### 4.3 — Why Option C (MMM-native consolidated model)
- Consistent with the MMM architecture §A8.2 which explicitly names `mmm-evidence` and
  `mmm-framework-sources` as the only required buckets (architecture was FROZEN at Stage 5).
- MMM-prefixed naming avoids namespace collision with any legacy MAT bucket.
- Two purposes (evidence vs framework sources) map cleanly to two buckets.
- Path-based segregation within `mmm-evidence` provides semantic separation without
  the operational overhead of four+ buckets.
- Evidence types (document, voice, photo, integration) map to MIME type classes within
  one bucket, not to separate buckets.

---

## 5. Compatibility with MMM Product Flows

| Flow | Storage Bucket | Path Convention | MIME Support |
|------|--------------|----------------|--------------|
| Criteria attachments | `mmm-framework-sources` | `sources/{framework_id}/` | PDF, DOCX, TXT ✅ |
| Evidence uploads (documents) | `mmm-evidence` | `{org}/{assessment}/{criterion}/` | PDF, DOCX, XLSX ✅ |
| Audio evidence (voice recordings) | `mmm-evidence` | `{org}/{assessment}/{criterion}/` | audio/mpeg, wav, mp4, webm ✅ (after migration) |
| Photo evidence | `mmm-evidence` | `{org}/{assessment}/{criterion}/` | image/jpeg, png, webp ✅ |
| Generated reports | Not stored in bucket | On-demand generation → download or PIT export | N/A |
| Framework snapshots | `mmm-framework-sources` | `snapshots/{framework_id}/v{N}.json` | application/json ✅ |
| Organisation branding/assets | Not in bucket (v1.0) | `mmm_organisations.logo_url` column | N/A (future enhancement) |

---

## 6. Legacy Drift Resolution

| Legacy State | Resolution |
|-------------|-----------|
| `criteria-documents` bucket (legacy MAT deployment expectation) | NOT adopted in MMM. `mmm-framework-sources` serves the same purpose. |
| `evidence-files` bucket (legacy MAT deployment expectation) | NOT adopted in MMM. `mmm-evidence` with path segregation serves the same purpose. |
| `evidence-audio` bucket (legacy MAT deployment expectation) | NOT adopted in MMM. `mmm-evidence` with `audio/*` MIME types serves the same purpose. |
| `evidence-photos` bucket (legacy MAT deployment expectation) | NOT adopted in MMM. `mmm-evidence` with `image/*` MIME types serves the same purpose. |
| `audit-documents` bucket (legacy MAT repo-backed implementation) | NOT adopted in MMM. Naming and namespace belong to legacy MAT app only. |
| `organisation-assets` bucket (legacy MAT repo-backed implementation) | NOT adopted in MMM v1.0. Organisation branding deferred to future wave. |
| `reports` bucket (implied in legacy MAT model) | NOT adopted in MMM v1.0. Reports are generated on-demand. |
| Live Supabase dashboard buckets (manually created) | Any bucket not backed by an MMM migration in `supabase/migrations/` is implementation drift and not canonical. |

---

## 7. Implementation Gaps Resolved by This Wave

The B1 migration `supabase/migrations/20260420000004_mmm_storage_buckets.sql` originally
created the `mmm-evidence` and `mmm-framework-sources` buckets with two gaps. In this
wave, the initial migration is amended so fresh installs from `main` receive the corrected
configuration directly, and follow-up migrations remain in place to repair environments
that had already applied the earlier B1 version.

### Gap 1 — Missing audio MIME types in `mmm-evidence`
**Problem**: The architecture requires `evidence_type: "voice"` support (§A5.6), but the
originally merged B1 migration omitted `audio/mpeg`, `audio/wav`, `audio/mp4`,
`audio/webm`.

**Resolution**: This wave amends
`supabase/migrations/20260420000004_mmm_storage_buckets.sql` so fresh installs include
the required audio MIME types from the outset, and migration
`supabase/migrations/20260422000001_mmm_evidence_audio_mime_fix.sql` remains the repair
step for environments that had already applied the earlier B1 migration (also adding the
corresponding video MIME types).

### Gap 2 — RLS policies lacked org-level path isolation
**Problem**: The B1 migration's `mmm_evidence_bucket_select/insert/update/delete` policies
only checked `auth.uid() IS NOT NULL` — any authenticated user could read/write any
evidence file regardless of organisation.

**Resolution**: Migration `supabase/migrations/20260422000002_mmm_evidence_rls_hardening.sql`
replaces the weak policies with org-path-isolation policies that enforce
`split_part(name, '/', 1) = user's organisation_id`.

---

## 8. Canonical Source of Truth

The canonical MMM storage configuration is encoded in:
1. **This document** (architecture decision)
2. **`supabase/migrations/20260420000004_mmm_storage_buckets.sql`** (initial bucket creation)
3. **`supabase/migrations/20260422000001_mmm_evidence_audio_mime_fix.sql`** (audio MIME fix)
4. **`supabase/migrations/20260422000002_mmm_evidence_rls_hardening.sql`** (RLS hardening)

Any discrepancy between the live Supabase dashboard state and the above migrations
constitutes implementation drift. The migrations are the source of truth and must be
applied to bring any dashboard state into alignment.

---

*Document Authority*: CS2 (Johan Ras / @APGI-cmy)
*Approved*: CS2 — issue #1458 opened by CS2 and this ADR codifies the frozen MMM architecture decision
