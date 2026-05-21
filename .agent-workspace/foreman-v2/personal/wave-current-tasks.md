# Wave Current Tasks — foreman-v2-agent

Wave: mmm-domainauditbuilder-legacy-harvest-red-recovery
Session ID: session-mmm-domainauditbuilder-legacy-harvest-red-recovery-20260521
Date: 2026-05-21
Branch: copilot/red-recovery-legacy-harvest-fix
Issue: PENDING — RED recovery: classify MMM DomainAuditBuilder as legacy harvest and record PR1700/PR1711 parity failure
PR: PENDING
CS2 Authorization: Direct CS2 instruction in active issue context (@APGI-cmy)
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-mmm-domainauditbuilder-legacy-harvest-red-recovery-20260521.md
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-mmm-domainauditbuilder-legacy-harvest-red-recovery-20260521.md
ceremony_admin_appointed: NO

IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-mmm-domainauditbuilder-legacy-harvest-red-recovery-20260521.md
IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: 2026-05-21T10:32:49Z
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: yes

FOREMAN_DECISIONS:
  DECISION-001: This wave is governance RED recovery only; no runtime UI implementation is authorized.
  DECISION-002: DomainAuditBuilder scope must be explicitly split into HARVEST (legacy source-of-truth parity) and BUILD/ADAPT (current-app compatibility wiring).
  DECISION-003: PR1700/PR1711 outcomes must be recorded as partial plumbing success with legacy behavioural parity failure.

BUILDER_DELEGATION:
  primary_builder: governance-liaison-isms-agent
  scope: modules/MMM governance and pre-build artifacts only
  pre_build_gates: governance recovery wave; Stage-6 RED parity specification required
  iaa_prebrief_path_for_builder: .agent-admin/assurance/iaa-wave-record-mmm-domainauditbuilder-legacy-harvest-red-recovery-20260521.md

TASKS:
  1. [BUILDER] Record PR1700/PR1711 parity failure and failure mode in MMM progress/governance artifacts.
  2. [BUILDER] Add/update a HARVEST vs BUILD/ADAPT classification artifact for DomainAuditBuilder recovery work.
  3. [BUILDER] Create legacy harvest manifest with exact required legacy source files and explicit missing-file handling rule.
  4. [BUILDER] Add RED/parity test specification covering three-card UX, generated-card lifecycle, loading/error visibility, and save/refresh lifecycle.
  5. [BUILDER] Add hard instruction prohibiting thin-shell redesign claims as legacy restoration.
  6. [BUILDER] Link follow-up implementation issue placeholder/reference in the updated artifacts.
  7. [FOREMAN] Re-run targeted governance checks and update PR admin/scope artifacts as needed.
