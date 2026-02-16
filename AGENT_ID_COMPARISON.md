# Agent ID Consistency Comparison

## Problem: Foreman Agent Missing from Copilot List

### Before Fix (PR #222)
```yaml
---
id: foreman-isms-agent          # ✅ Frontmatter
description: Foreman (FM) for...

agent:
  id: foreman-isms               # ❌ MISMATCH!
  class: foreman
```

**Filename**: `foreman-isms-agent.md` ✅

**Result**: 🔴 GitHub Copilot couldn't discover agent due to ID inconsistency

---

### After Fix (Constitutional Correction by CodexAdvisor)
```yaml
---
id: foreman-isms-agent          # ✅ Frontmatter
description: Foreman (FM) for...

agent:
  id: foreman-isms-agent         # ✅ FIXED!
  class: foreman
```

**Filename**: `foreman-isms-agent.md` ✅

**Result**: ✅ All three IDs now consistent → Agent should be discoverable

---

## All Other Agents (Already Correct)

### CodexAdvisor-agent.md
- Frontmatter: `id: CodexAdvisor-agent` ✅
- Agent: `id: CodexAdvisor-agent` ✅
- Filename: `CodexAdvisor-agent.md` ✅

### api-builder.md
- Frontmatter: `id: api-builder` ✅
- Agent: `id: api-builder` ✅
- Filename: `api-builder.md` ✅

### governance-liaison-isms-agent.md
- Frontmatter: `id: governance-liaison-isms` ✅
- Agent: `id: governance-liaison-isms` ✅
- Filename: `governance-liaison-isms-agent.md` ✅

*(Same pattern for integration-builder, qa-builder, schema-builder, ui-builder)*

---

## Key Lesson

**GitHub Copilot Agent Discovery Rule**:
```
frontmatter.id == agent.id == filename (minus .md)
```

Any mismatch → Agent not registered/discovered in Copilot UI

---

**Fix Applied**: Commit 04a5d8f  
**Authority**: CodexAdvisor-agent (Constitutional Correction)  
**Date**: 2026-02-16
