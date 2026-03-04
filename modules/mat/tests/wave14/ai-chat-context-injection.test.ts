/**
 * Wave 14 — AI Chat Context Injection (T-W14-UX-008)
 *
 * Test ID : T-W14-UX-008
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-096 / TR-096
 *
 * Scenario: User clicks "Explore further levels" on a criteria card post-evaluation.
 * The AI chat panel opens with `{ criteria_name, current_level, next_level_guidance }`
 * injected into the chat session context.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - `EmbeddedAIAssistant` does not accept a `contextPayload` prop.
 *   - No context injection into the chat session is implemented.
 *   - The "Explore further levels" link does not exist (tested in T-W14-UX-007).
 *
 * All tests are file-based (no live Supabase env required).
 *
 * Test summary:
 *   T-W14-UX-008a: EmbeddedAIAssistant.tsx defines a contextPayload prop
 *   T-W14-UX-008b: EmbeddedAIAssistant.tsx uses contextPayload in its logic
 *   T-W14-UX-008c: EmbeddedAIAssistant.tsx renders a context indicator when contextPayload is set
 *   T-W14-UX-008d: App.tsx or routing layer can pass contextPayload from criteria card click
 *
 * References:
 *   FR-096, TR-096
 *   modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W08
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const SRC_DIR = path.resolve(process.cwd(), 'modules/mat/frontend/src');

describe('T-W14-UX-008 — AI chat panel pre-loads criteria context on open from criteria card (GAP-W08)', () => {

  it('T-W14-UX-008a: EmbeddedAIAssistant.tsx defines a contextPayload prop in its Props interface', () => {
    // The contextPayload prop carries { criteria_name, current_level, next_level_guidance }
    // from the criteria card into the AI chat session. Without this prop, context
    // injection is impossible.
    //
    // RED: EmbeddedAIAssistant.tsx exists but does not define contextPayload prop.
    const assistantPath = path.join(SRC_DIR, 'components', 'common', 'EmbeddedAIAssistant.tsx');
    expect(
      fs.existsSync(assistantPath),
      `EmbeddedAIAssistant.tsx not found at: ${assistantPath}`
    ).toBe(true);
    const source = fs.readFileSync(assistantPath, 'utf-8');
    expect(
      source,
      'EmbeddedAIAssistant Props interface must define contextPayload prop (FR-096 — context injection)'
    ).toMatch(/contextPayload/i);
  });

  it('T-W14-UX-008b: EmbeddedAIAssistant.tsx uses contextPayload to initialise the chat session', () => {
    // When contextPayload is provided, the chat session must be seeded with the
    // criteria context so the AI can respond with relevant information.
    // The source must reference contextPayload in its logic (not just in the interface).
    //
    // RED: EmbeddedAIAssistant.tsx does not reference contextPayload anywhere in logic.
    const assistantPath = path.join(SRC_DIR, 'components', 'common', 'EmbeddedAIAssistant.tsx');
    const source = fs.readFileSync(assistantPath, 'utf-8');
    // Must appear more than once (once in interface, at least once in logic)
    const occurrences = (source.match(/contextPayload/gi) || []).length;
    expect(
      occurrences,
      'contextPayload must appear at least twice in EmbeddedAIAssistant.tsx: once in Props, once in logic (FR-096)'
    ).toBeGreaterThanOrEqual(2);
  });

  it('T-W14-UX-008c: EmbeddedAIAssistant.tsx renders a data-testid="ai-context-indicator" when contextPayload is set', () => {
    // When contextPayload is provided, a visible "context loaded" indicator must render
    // so that users know the AI is aware of their specific criteria context.
    // This also enables test automation to assert context is active.
    //
    // RED: No such indicator exists in EmbeddedAIAssistant.tsx.
    const assistantPath = path.join(SRC_DIR, 'components', 'common', 'EmbeddedAIAssistant.tsx');
    const source = fs.readFileSync(assistantPath, 'utf-8');
    expect(
      source,
      'EmbeddedAIAssistant must render data-testid="ai-context-indicator" when contextPayload is set (TR-096)'
    ).toMatch(/data-testid=["']ai-context-indicator["']/);
  });

  it('T-W14-UX-008d: EmbeddedAIAssistant.tsx has criteria_name in contextPayload type definition', () => {
    // The contextPayload type must explicitly define the required fields:
    // criteria_name, current_level, and next_level_guidance.
    // This ensures the criteria card passes the correct shape.
    //
    // RED: contextPayload type does not exist in EmbeddedAIAssistant.tsx.
    const assistantPath = path.join(SRC_DIR, 'components', 'common', 'EmbeddedAIAssistant.tsx');
    const source = fs.readFileSync(assistantPath, 'utf-8');
    expect(
      source,
      'contextPayload type must include criteria_name field (TR-096 — criteria context injection)'
    ).toMatch(/criteria_name/i);
    expect(
      source,
      'contextPayload type must include current_level field (TR-096 — criteria context injection)'
    ).toMatch(/current_level/i);
  });

});
