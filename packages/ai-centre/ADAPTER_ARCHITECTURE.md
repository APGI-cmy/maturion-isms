# Provider Adapter Architecture — ai-centre Package

**Package**: `packages/ai-centre`  
**Version**: 1.0.0  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Governance reference**: AAWP adapter specs (GRS-006, AAD §7), parking station suggestion 2026-02-25  

---

## Overview

All provider adapters in `packages/ai-centre/src/adapters/` implement the `ProviderAdapter`
interface and follow a consistent set of mandatory patterns. This document codifies those
patterns so that future adapter implementations are consistent and test-compatible from
the first build.

---

## Mandatory Pattern: FetchFn Export

Every provider adapter MUST export a `FetchFn` type at the top of its file, before the
class declaration. This type is injected via the constructor and is the mechanism by which
tests replace the real `fetch` call with a mock.

### Definition

```typescript
export type FetchFn = (url: string, init: RequestInit) => Promise<Response>;
```

### Why this is mandatory

- The `ProviderAdapter.contract.test.ts` contract test imports `FetchFn` directly from
  each adapter under test to construct mock instances.
- Without the export, the contract test fails at module-load time with a compile error,
  turning a GREEN-gate test RED before any implementation is written.
- Omitting the export forces a corrective patch commit, breaking the
  Architecture → QA-to-Red → Build-to-Green → Validation build philosophy.

### Required placement

```typescript
// --- mandatory: export before class ---
export type FetchFn = (url: string, init: RequestInit) => Promise<Response>;

export class MyProviderAdapter implements ProviderAdapter {
  private readonly fetchFn: FetchFn;

  constructor(keyStore?: ProviderKeyStore, fetchFn?: FetchFn) {
    this.keyStore = keyStore ?? new ProviderKeyStore();
    this.fetchFn = fetchFn ?? ((url, init) => fetch(url, init));
  }
  // ...
}
```

### Constructor signature

Every adapter constructor MUST accept `fetchFn` as an optional second parameter with
global `fetch` as the default. This makes all adapters trivially testable without
network access.

---

## Existing Adapters Conforming to This Pattern

| Adapter | File | FetchFn exported | FetchFn injectable |
|---------|------|-----------------|-------------------|
| `OpenAIAdapter` | `src/adapters/OpenAIAdapter.ts` | ✅ | ✅ |
| `AnthropicAdapter` | `src/adapters/AnthropicAdapter.ts` | ✅ | ✅ |
| `GitHubModelsAdapter` | `src/adapters/GitHubModelsAdapter.ts` | ✅ | ✅ |
| `PerplexityAdapter` | `src/adapters/PerplexityAdapter.ts` | ✅ | ✅ |

---

## Non-Negotiable Checklist for New Adapters

Before opening a PR for any new provider adapter, confirm:

- [ ] `export type FetchFn = (url: string, init: RequestInit) => Promise<Response>;`
      is present at the top of the adapter file (before the class declaration)
- [ ] Constructor accepts `fetchFn?: FetchFn` as second parameter
- [ ] Constructor stores `this.fetchFn = fetchFn ?? ((url, init) => fetch(url, init));`
- [ ] All HTTP calls within the adapter use `this.fetchFn(...)` not `fetch(...)` directly
- [ ] Adapter is added to `ADAPTERS_UNDER_TEST` in `ProviderAdapter.contract.test.ts`
- [ ] Contract tests pass with mock `FetchFn` (no real network calls in unit tests)

---

## Contract Test Integration

The `ProviderAdapter.contract.test.ts` file tests all registered adapters against the
`ProviderAdapter` interface contract. To register a new adapter:

```typescript
// In ProviderAdapter.contract.test.ts
import { MyProviderAdapter, FetchFn } from '../adapters/MyProviderAdapter';

const ADAPTERS_UNDER_TEST = [
  // ...existing adapters...
  {
    name: 'MyProviderAdapter',
    factory: (fetch: FetchFn) => new MyProviderAdapter(undefined, fetch),
  },
];
```

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**First codified**: 2026-02-25 (derived from api-builder parking station suggestion, session-wave7)  
**Applies to**: All provider adapter implementations in `packages/ai-centre/src/adapters/`
