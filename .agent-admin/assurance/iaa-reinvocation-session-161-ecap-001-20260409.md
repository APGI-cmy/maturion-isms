# IAA Re-Invocation Request — session-161-ecap-001-20260408 (follow-up)

**Artifact Type**: IAA-REINVOCATION-REQUEST
**Session**: session-161-ecap-001-20260408 (follow-up 2026-04-09)
**Wave**: ecap-001-layer-down-implementation
**Issue**: maturion-isms#1305
**Branch**: copilot/ecap-001-layer-down-implementation
**Requesting Agent**: foreman-v2-agent v6.2.0
**Prior IAA Verdict**: REJECTION-PACKAGE — 2 findings (HFMC-02 scope parity, SCOPE-FORMAT-001 em-dash)
**Rejection Artifact**: `.agent-admin/assurance/iaa-rejection-session-161-wave1305-ecap-001-20260408.md`

---

## Resolution of IAA Rejection Findings

### Finding 1 — HFMC-02: Scope parity miss — suggestions-log.md undeclared

**Fix applied**: Added the following entry to `SCOPE_DECLARATION.md` "Files Changed in This Wave" section:
```
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` — S-040 improvement suggestion and cross-repo-note appended (session 161 parking station ceremony)
```
**Status**: ✅ RESOLVED — file now declared in SCOPE_DECLARATION.md

### Finding 2 — SCOPE-FORMAT-001: Em-dash in SCOPE_DECLARATION title

**Fix applied**: Changed SCOPE_DECLARATION.md title from:
```
# SCOPE_DECLARATION — Wave ecap-001-layer-down-implementation
```
to:
```
# SCOPE_DECLARATION - Wave ecap-001-layer-down-implementation
```
(hyphen U+002D replaces em-dash U+2014)

**Status**: ✅ RESOLVED — title now uses hyphen separator

### NO-REPEAT-PREVENTABLE-001: SCOPE_DECLARATION_TITLE_FORMAT_CHECK

**Prevention action applied**: Added Enhancement 3 (QP-FAIL-008) to `FM_QP_ENHANCED_QUICK_REFERENCE.md`:
- New BLOCKING row requiring QP to verify hyphen separator before issuing PASS
- Version bumped: 1.0.0 → 1.1.0
**Status**: ✅ IMPLEMENTED

---

## CS2 Option B Implementation

**Follow-on analysis committed**: `.agent-admin/assurance/ecap-001-followon-analysis-20260409.md`

Per CS2 instruction (comment_id: 4212380015):
- PR scope narrowed to corrective follow-up for PR #1296
- Full ECAP downstream implementation analysis provided
- Follow-on issue required for: ceremony-admin agent contract + agent/tier updates

---

## IAA Re-Invocation Scope

IAA is requested to independently verify:
1. `SCOPE_DECLARATION.md` title now uses hyphen (not em-dash) — Finding 2 resolved
2. `SCOPE_DECLARATION.md` includes `suggestions-log.md` entry — Finding 1 resolved
3. `FM_QP_ENHANCED_QUICK_REFERENCE.md` v1.1.0 — NO-REPEAT-PREVENTABLE-001 check added
4. `ecap-001-followon-analysis-20260409.md` — CS2 Option B analysis committed
5. Original AC-001 through AC-006 remain intact (no regression)

Upon PASS verification → issue ASSURANCE-TOKEN per §4.3b.

---

*Re-invocation initiated by: foreman-v2-agent | 2026-04-09*
*Per AGENT_HANDOVER_AUTOMATION.md §4.3a — IAA mandatory for all wave handovers*
