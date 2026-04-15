# Foreman ECAP Appointment Template

**Agent**: execution-ceremony-admin-agent
**Knowledge Version**: 1.0.0
**Last Updated**: 2026-04-15
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Ref**: ECAP-001 §10.1, §10.2

---

## Purpose

Minimal appointment brief template for Foreman use when delegating to ECAP.
All fields are mandatory. ECAP will HALT-004 if any field is absent.

---

## Pre-Delegation Hygiene Gate (Foreman completes before filling template)

Before completing this template, Foreman certifies:

- [ ] QP PASS accepted
- [ ] §4.3 merge-gate parity PASS accepted
- [ ] `git status --porcelain` → empty output (clean working tree)
- [ ] All primary deliverables committed at HEAD
- [ ] No uncommitted primary artifacts in working tree
- [ ] Scope declaration at `.agent-workspace/foreman-v2/personal/scope-declaration-wave-{N}.md`
  lists both ECAP bundle paths (see `expected_return_artifact_paths` below)

**Do not delegate until all six items are checked.**

---

## Appointment Brief Template

```yaml
ceremony_admin_appointed: true
appointment_timestamp: YYYY-MM-DDTHH:MM:SSZ   # ISO 8601 UTC

wave_identifier: "{wave-id}"                   # e.g. mmm-stage4-trs-20260415
job_scope: |
  {Describe the wave/job scope in 1-2 sentences.
   List the artifacts that are ready for ceremony bundle preparation.}

assigned_scope:
  - {artifact-path-1}                          # e.g. modules/MMM/03-trs/technical-requirements-specification.md
  - {artifact-path-2}
  # list all primary deliverables Foreman has QP-signed-off

expected_return_artifact_paths:
  - .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-{NNN}-{YYYYMMDD}.md
  - .agent-workspace/execution-ceremony-admin-agent/bundles/session-{NNN}-{YYYYMMDD}.md

# Pre-delegation certifications (Foreman completes before delegating)
qp_pass: true
parity_pass: true
working_tree_clean: true
scope_declaration_path: .agent-workspace/foreman-v2/personal/scope-declaration-wave-{N}.md
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-{wave}-{date}.md
```

---

## Handback Recording Template (Foreman completes after ECAP returns bundle)

After ECAP returns the bundle, Foreman records in session memory:

```yaml
handback_accepted: true
handback_accepted_timestamp: YYYY-MM-DDTHH:MM:SSZ   # ISO 8601 UTC
bundle_returned_paths:
  - .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-{NNN}-{YYYYMMDD}.md
  - .agent-workspace/execution-ceremony-admin-agent/bundles/session-{NNN}-{YYYYMMDD}.md
handback_notes: "{Any residual notes from ECAP, or 'none'}"
```

---

## Usage Notes

1. **Do not compress the template** — all keys must be present or ECAP will HALT-004.
2. **appointment_timestamp** must be set at delegation time, not back-filled later.
3. **expected_return_artifact_paths** must use the actual session number and date (substitute `{NNN}` and `{YYYYMMDD}` before sending).
4. **working_tree_clean** must be `true` — if it cannot be `true`, fix the working tree before delegating.
5. After handback, Foreman reviews the bundle (Steps 4.2 and 4.3) before invoking IAA.

---

## What Foreman Does After Receiving the Bundle

Per foreman-v2-agent.md Steps 4.2–4.3c:

1. Review PREHANDOVER proof at ECAP bundle path
2. Review session memory at ECAP bundle path
3. If approved: commit accepted copies to `.agent-workspace/foreman-v2/memory/`
4. Run Step 4.3a pre-IAA commit-state gate
5. Invoke IAA (Step 4.3b) — this is Foreman-only, not ECAP
6. Record token after IAA issues verdict (Step 4.3c)

---

**Authority**: CS2 | **Ref**: ECAP-001 §10.1–§10.2, foreman-v2-agent.md Step 4.1a
