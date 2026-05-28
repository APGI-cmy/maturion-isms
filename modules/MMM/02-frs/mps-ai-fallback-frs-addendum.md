# MMM FRS Addendum — MPS AI Fallback UX Contract

**Scope**: Domain workspace, Step 1 (`Create MPSs`)  
**Reason**: Ensure AI-service instability does not present as a hard workflow failure.

## Functional Requirement (Addendum)

### FR-MMM-AI-FB-01 — Non-blocking fallback behavior

When MPS generation AI is unavailable (edge function non-2xx, timeout, or malformed payload), MMM must:

1. Load the legacy fallback MPS pack for the active domain.
2. Keep selection/edit/confirm actions fully available.
3. Show a **non-blocking warning** (not an error state) indicating fallback mode.

### FR-MMM-AI-FB-02 — User-safe messaging

Fallback-mode messaging must be operationally clear and non-technical:

- Do not expose low-level transport/internal status details in user-facing text.
- Present guidance that the system has switched to fallback content and can continue.
