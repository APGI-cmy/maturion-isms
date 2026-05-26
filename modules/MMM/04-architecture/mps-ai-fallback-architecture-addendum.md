# MMM Architecture Addendum — MPS Generation Degradation Strategy

## Component Boundary

- **Primary path**: `MPSSelectionModal` -> `useAIMPSGeneration` -> `supabase.functions.invoke('mmm-ai-chat')`
- **Degradation path**: `useAIMPSGeneration` -> `LEGACY_DOMAIN_BLUEPRINTS` fallback pack

## Runtime Policy

1. AI invocation failure must not block Domain Step 1 workflow.
2. Fallback payload is considered a valid operational continuation state.
3. UI severity maps:
   - fallback success -> warning banner (`alert-warning`)
   - unrecoverable/save failure -> error banner (`alert-error`)

## Regression Invariant

If fallback payload is present, the modal must remain actionable (`Accept All`, item toggles, edits, `Confirm Selection`).
