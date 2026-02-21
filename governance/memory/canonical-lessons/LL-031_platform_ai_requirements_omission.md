# LL-031: Platform-Wide AI Requirements Omission

**Date**: 2026-02-19  
**Status**: Canonical Lesson  
**Authority**: CS2 (Johan Ras)  
**Severity**: P0 - Catastrophic Oversight  
**Source**: MAT Frontend Deployment Failure  
**Lesson ID**: LL-031

---

## Executive Summary

**Incident**: MAT (Manual Audit Tool) frontend deployment failed platform governance standards due to complete omission of required embedded AI features. This represents a catastrophic governance gap where platform-wide mandatory requirements were not explicitly enforced, leading to apps being built without critical AI capabilities.

**Key Lesson**: Platform-wide mandatory requirements must be explicitly declared in canonical governance and enforced through merge gates, not assumed through precedent or implicit understanding.

---

## What Happened

### The Failure

MAT frontend was built and submitted for deployment with:
- ❌ No AI chat (assistant) UI component
- ❌ No AI scoring explanations or rationale features
- ❌ No human override enforcement with AI context
- ❌ No agent file for model selection and task routing
- ❌ No embedded AI features whatsoever

---

## Root Causes

1. **RC-1**: MANDATORY_CROSS_APP_COMPONENTS.md Section 13 scoped AI as optional ("for apps with AI chat interfaces") not universal
2. **RC-2**: No Platform Requirements Inheritance Protocol — FRS/TRS did not inherit platform-wide requirements
3. **RC-3**: No AI Feature Enforcement Gate in GATE_REQUIREMENTS_INDEX.json
4. **RC-4**: No Agent File Template with mandatory AI capabilities section

---

## Lessons for Future

### For Builders
1. Never assume features from precedent — check canonical governance
2. Platform requirements first — validate platform checklist before app-specific work
3. Red tests for platform features — test platform requirements before app features

### For Foreman
1. FRS approval gates on platform requirements — do not approve FRS without platform checklist
2. Builder alignment includes platform requirements — explicit handoff of platform checklist

### For Governance
1. Implicit requirements don't exist — if not in canon with enforcement, it's not a requirement
2. Precedent ≠ governance — legacy examples don't enforce future compliance
3. Conditional wording creates gaps — "for apps with X" makes X optional

---

## Canon Updates Required

1. ✅ Create this LL-031 canonical lesson
2. ✅ Create governance/canon/PLATFORM_AI_REQUIREMENTS.md
3. ✅ Create governance/checklists/PLATFORM_AI_REQUIREMENTS_CHECKLIST.md
4. ⏳ Update MANDATORY_CROSS_APP_COMPONENTS.md Section 13
5. ⏳ Update APP_STARTUP_REQUIREMENTS_DECLARATION.md
6. ⏳ Update GATE_REQUIREMENTS_INDEX.json

---

**Approved By**: CS2 (Johan Ras)  
**Canonized**: 2026-02-19  
**Authority**: CS2 (Johan Ras)
