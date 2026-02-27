# MAT — Manual Audit Tool

**Module**: MAT (Manual Audit Tool)
**Status**: Active
**Architecture**: `modules/mat/02-architecture/`
**Implementation Plan**: `modules/mat/03-implementation-plan/implementation-plan.md`

---

## AIMC Gateway Compliance — Provider Model Name Ban

Per `ai-architecture.md` v2.0.0 and `AIMC_STRATEGY.md` v1.0.0, all AI model selection
is managed by the `@maturion/ai-centre` AIMC Gateway. No file under `modules/mat/src/`
may contain direct provider model name strings (e.g., `gpt-4`, `whisper-1`, `claude-3`,
`dall-e-3`).

This is enforced by CI workflow `.github/workflows/provider-model-ban.yml`. Violations
will fail the build.

**Correct pattern** — route through AIMC capability:
```typescript
import { AICentre, Capability } from '@maturion/ai-centre';

const result = await aiCentre.request({ capability: Capability.ANALYSIS, ... });
```

**Prohibited pattern** — direct provider model reference:
```typescript
// ❌ DO NOT DO THIS
const response = await openai.chat.completions.create({ model: 'gpt-4-turbo', ... });
```

---

## Key References

| Artifact | Location |
|----------|----------|
| App Description | `modules/mat/00-app-description/app-description.md` |
| FRS | `modules/mat/01-frs/functional-requirements.md` |
| TRS | `modules/mat/01.5-trs/technical-requirements-specification.md` |
| Architecture | `modules/mat/02-architecture/` |
| Implementation Plan | `modules/mat/03-implementation-plan/implementation-plan.md` |
| Build Progress Tracker | `modules/mat/BUILD_PROGRESS_TRACKER.md` |
| AI Architecture | `modules/mat/02-architecture/ai-architecture.md` (v2.0.0) |
| AIMC Strategy | `governance/canon/AIMC_STRATEGY.md` |
