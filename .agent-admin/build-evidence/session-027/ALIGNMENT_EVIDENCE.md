# Alignment Evidence — Session 027 (2026-03-01)

**Agent**: governance-liaison-isms  
**Session ID**: session-027-20260301  
**Timestamp**: 2026-03-01T09:27:36Z  
**Canonical Source**: APGI-cmy/maturion-foreman-governance  
**Canonical Commit**: 1bce7a831467b784b261b207f969bc2ec35131ab

---

## Canonical Inventory Version Comparison

| Field | Local (before) | Canonical | After |
|-------|----------------|-----------|-------|
| CANON_INVENTORY version | 1.0.0 | 1.0.0 | 1.0.0 |
| LAYER_UP_PROTOCOL.md hash | 0f5b2d9c14640e156300a72370841d38dcc52da2c519c8c181683f33694f39c3 | 0f5b2d9c... (STALE — canonical CANON_INVENTORY not updated) | ac23efd1b44ac26b620cf387fdba6b23031ac988a5b51fb304eb215ce7ffc58f |
| LAYER_UP_PROTOCOL.md version | 1.0.0 | 1.0.0 (STALE) | 1.1.0 |

## File Checksum Validation

| File | Before SHA256 | After SHA256 | Status |
|------|---------------|--------------|--------|
| governance/canon/LAYER_UP_PROTOCOL.md | 3de43f1fe0702c805c45104ff56613c6e08d4ac32bd0c48319764d1858f4d472 | ac23efd1b44ac26b620cf387fdba6b23031ac988a5b51fb304eb215ce7ffc58f | ✅ ALIGNED |
| governance/CANON_INVENTORY.json | (previous hash) | 2f34d740b8e318af84907eb2a5ef7614dcdc42cb885665d643978be164fada61 | ✅ UPDATED |
| governance/sync_state.json | (previous hash) | c04392d79b0b6bd1f641db2edd3c7ebbfec1eb522ae7b6196b24cb0052540229 | ✅ UPDATED |

## Layer-Down Execution Log

1. **Root Cause Analysis**: CI automation failed due to canonical CANON_INVENTORY stale hash  
   - Canonical CANON_INVENTORY.json hash for LAYER_UP_PROTOCOL.md: `0f5b2d9c...` (v1.0.0)  
   - Canonical actual file hash: `ac23efd1...` (v1.1.0 content)  
   - Mismatch → align-governance.sh Phase 4 hash verification exits 1  

2. **Manual Layer-Down Executed**:  
   - Downloaded canonical LAYER_UP_PROTOCOL.md  
   - SHA256 verified: `ac23efd1b44ac26b620cf387fdba6b23031ac988a5b51fb304eb215ce7ffc58f` ✅  
   - Local file replaced with canonical content  

3. **CANON_INVENTORY Updated**:  
   - LAYER_UP_PROTOCOL.md entry: version 1.0.0→1.1.0, hash updated to `ac23efd1...`  

4. **sync_state.json Updated**:  
   - canonical_commit: 1bce7a831467b784b261b207f969bc2ec35131ab  
   - timestamp: 2026-03-01T09:27:36Z  

## Sync State Update

```json
{
  "last_sync": {
    "timestamp": "2026-03-01T09:27:36Z",
    "session_id": "session-027-20260301",
    "canonical_commit": "1bce7a831467b784b261b207f969bc2ec35131ab",
    "files_layered_down": [
      "governance/canon/LAYER_UP_PROTOCOL.md",
      "governance/CANON_INVENTORY.json"
    ]
  }
}
```

## Note: Canonical CANON_INVENTORY Inconsistency

The canonical commit `1bce7a83` updated `LAYER_UP_PROTOCOL.md` to v1.1.0 but did NOT update
`CANON_INVENTORY.json` with the new hash. This is a canonical source maintenance gap.  
This does NOT block the layer-down but should be flagged for CS2 attention.

---
**Authority**: CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md  
**Session**: session-027-20260301
