## Critical Incidents

### INC-002: LL-031 Platform Blocker — Missing Embedded AI in MAT Frontend (2026-02-20)
**Severity**: P0 — Platform Governance Failure  
**Status**: ✅ Resolved

**Root Cause**: Embedded AI assistant UI and agent/model selection logic were absent from the MAT frontend, violating the non-negotiable Maturion Platform AI Standard (LL-031).

**Resolution**:
- Added FR-072 (Embedded AI Assistant) to FRS v1.2.0
- Added TR-072 (Embedded AI Assistant Component) to TRS v1.2.0
- Implemented `EmbeddedAIAssistant` component at `modules/mat/frontend/src/components/common/EmbeddedAIAssistant.tsx`
- Added `'assistant'` task type to `AITaskType` and AI routing table (TR-040)
- Wired `EmbeddedAIAssistant` into `Layout.tsx` — accessible from every page
- Added QA tests CAT-FE-13 (MAT-FE-T-072 to MAT-FE-T-077) — all GREEN
- Updated app description §13 to reference LL-031 standard
- All 77 frontend tests GREEN; all 127 module tests GREEN

**Governance Learnings**: LL-031 (Maturion/Platform/AI-Standard)  
**Prevention**: Add embedded AI assistant check to Wave Completion Gate

---

### INC-001: Wave 6 Deployment Gate Failures (2026-02-18)
**Severity**: P0 — Catastrophic  
**Status**: 🔴 Active  
**Impact**: Wave 6 deployment blocked, multiple merge failures

**Timeline**:
- T0: PR #340 approved with PREHANDOVER proof (invalid deployment config)
- T1: First merge attempt failed (vercel.json regex error)
- T2: Incorrect corrective action provided (add named groups)
- T3: Second merge attempt failed (named groups not supported)
- T4: RCA initiated, correct fix identified

**Root Causes**:
1. No deployment config validation before handover
2. Incorrect technical advice (named capture groups)
3. No corrective action verification
4. Skipped tests not investigated

**Resolution**: 
- ⏳ Apply correct vercel.json fix (remove named groups)
- ⏳ Verify GitHub Actions checks GREEN
- ⏳ Document skipped tests
- ⏳ Update PREHANDOVER proof

**Governance Learnings**: BL-030 (Pre-Deployment Validation)  
**Prevention**: Update Foreman PREHANDOVER contract, implement Wait-for-CI policy

**Wave 6 Status**: 🔴 Blocked until resolution

