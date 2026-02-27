# Integration Builder — Personal Patterns

## Pattern: AIMC Wiring Service Implementation

### Context
Creating module wiring services that route to AIMC gateway.

### Pattern
```typescript
export class <Module>AimcWiring {
  private readonly endpoint = '/api/ai/request';
  private readonly capability = '<capability>';  // must appear as literal for T-004 check
  private readonly agent = '<agent-id>';         // must appear as literal for T-005 check

  constructor(options?: { fetch?: FetchLike }) {
    this.fetchFn = options?.fetch ?? globalFetchOrFallback;
  }

  async requestAdvisory(request: AdvisoryRequest): Promise<AdvisoryResponse> {
    const response = await this.fetchFn(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        capability: '<capability>',  // literal required for regex check
        agent: '<agent-id>',        // literal required for regex check
        prompt: request.prompt,
        context: request.context ?? {},
      }),
    });
    // ...
  }
}
export default <Module>AimcWiring;
```

### Key Notes
- T-004/T-005 tests check SOURCE FILE with regex — use literals in JSON body, not just class properties
- T-007 needs `new WiringServiceClass()` (no args) — make options optional
- T-008 needs `new WiringServiceClass({ fetch: mockFetch })` — accept options.fetch
- Export default class to satisfy `wiringModule.default` in T-007/T-008
- Never import from 'openai', 'anthropic', '@anthropic-ai', 'perplexity'
