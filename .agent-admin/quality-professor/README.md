# Quality Professor — Builder Referral Administration

**Directory**: `.agent-admin/quality-professor/`  
**Purpose**: Stores formal Builder Referral artifacts and the REFERRAL_INDEX for open/closed QP FAIL rejections.  
**Authority**: `governance/canon/FM_QUALITY_PROTOCOL_ENHANCED_SOP.md` v1.0.0  
**Created By**: governance-liaison-isms-agent (Layer-Down — canonical commit 7792913259b0)  
**Date**: 2026-03-02

---

## Directory Structure

```
.agent-admin/quality-professor/
├── README.md              ← this file
├── REFERRAL_INDEX.md      ← created at first QP FAIL by foreman-v2
└── builder-referral-*.md  ← individual referral artifacts (created per QP FAIL)
```

---

## Usage

This directory is created as part of the Layer-Down propagation of `FM_QUALITY_PROTOCOL_ENHANCED_SOP.md`.

**Foreman v2 responsibilities** (per SOP §3–§4):
- Create `REFERRAL_INDEX.md` at first QP FAIL event (if not already present)
- Create `builder-referral-<YYYYMMDD>-<builder>-<issue>.md` for each QP FAIL
- Update `REFERRAL_INDEX.md` status (OPEN → CLOSED) when builder re-submission passes QP

---

## References

- `governance/canon/FM_QUALITY_PROTOCOL_ENHANCED_SOP.md` — canonical SOP (Tier 3 authority)
- `.agent-workspace/foreman-v2/knowledge/FM_QP_ENHANCED_QUICK_REFERENCE.md` — Tier 2 stub
- `CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` — layer-down governance
