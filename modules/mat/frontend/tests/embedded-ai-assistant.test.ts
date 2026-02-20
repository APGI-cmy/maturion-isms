/**
 * MAT Frontend QA Test Suite — CAT-FE-13: Embedded AI Assistant (LL-031)
 *
 * Platform Standard: LL-031 (Maturion/Platform/AI-Standard)
 * Validates the presence and structure of the embedded AI assistant UI
 * and agent/model selection logic required by the Maturion platform.
 *
 * FRS: FR-072 (Embedded AI Assistant)
 * TRS: TR-072
 * Registry: governance/TEST_REGISTRY.json
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const SRC_DIR = resolve(__dirname, '..', 'src');
const APP_ROOT = resolve(__dirname, '..');

describe('CAT-FE-13: embedded AI assistant — LL-031 platform standard (FR-072)', () => {
  it('MAT-FE-T-072: EmbeddedAIAssistant component exists', () => {
    // Platform Standard: LL-031
    // FRS: FR-072 AC-1
    // TRS: TR-072
    // Type: structural | Priority: P0

    const candidates = [
      resolve(SRC_DIR, 'components/common/EmbeddedAIAssistant.tsx'),
      resolve(SRC_DIR, 'components/EmbeddedAIAssistant.tsx'),
      resolve(SRC_DIR, 'components/AIAssistant.tsx'),
    ];
    const exists = candidates.some((p) => existsSync(p));
    expect(exists).toBe(true);
  });

  it('MAT-FE-T-073: EmbeddedAIAssistant exposes AI_AGENT_OPTIONS for model selection', () => {
    // Platform Standard: LL-031
    // FRS: FR-072 AC-2 — agent/model selection must be present
    // TRS: TR-072 Constraint 2
    // Type: structural | Priority: P0

    const componentPath = resolve(SRC_DIR, 'components/common/EmbeddedAIAssistant.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const content = readFileSync(componentPath, 'utf-8');
    // Must export the agent options so they are testable and configurable
    expect(content).toMatch(/AI_AGENT_OPTIONS/);
    // Must include a selector/dropdown for agent/model selection
    expect(content).toMatch(/ai-agent-selector/);
  });

  it('MAT-FE-T-074: EmbeddedAIAssistant includes collapsible chat UI', () => {
    // Platform Standard: LL-031
    // FRS: FR-072 AC-3
    // TRS: TR-072 Constraint 3
    // Type: structural | Priority: P0

    const componentPath = resolve(SRC_DIR, 'components/common/EmbeddedAIAssistant.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const content = readFileSync(componentPath, 'utf-8');
    // Must have a toggle button (collapsible)
    expect(content).toMatch(/ai-assistant-toggle/);
    // Must have a messages/conversation area
    expect(content).toMatch(/ai-assistant-messages/);
    // Must have a message input
    expect(content).toMatch(/ai-assistant-input/);
    // Must have a send action
    expect(content).toMatch(/ai-assistant-send/);
  });

  it('MAT-FE-T-075: Layout includes EmbeddedAIAssistant (LL-031 wiring)', () => {
    // Platform Standard: LL-031
    // FRS: FR-072 AC-4 — assistant must be accessible from every page
    // TRS: TR-072 Constraint 4
    // Type: structural | Priority: P0

    const layoutCandidates = [
      resolve(SRC_DIR, 'components/Layout.tsx'),
      resolve(SRC_DIR, 'components/AppShell.tsx'),
    ];
    const layoutPath = layoutCandidates.find((p) => existsSync(p));
    expect(layoutPath).toBeDefined();

    const content = readFileSync(layoutPath!, 'utf-8');
    expect(content).toMatch(/EmbeddedAIAssistant/);
  });

  it('MAT-FE-T-076: assistant task type present in AI routing (TR-040)', () => {
    // Platform Standard: LL-031
    // FRS: FR-072 AC-5, FR-028
    // TRS: TR-040, TR-072
    // Type: structural | Priority: P0
    // Verifies the 'assistant' task type is registered in the AI routing table

    // Check types file
    const typesCandidates = [
      resolve(APP_ROOT, '../../src/types/index.ts'),
    ];
    const typesPath = typesCandidates.find((p) => existsSync(p));
    if (typesPath) {
      const content = readFileSync(typesPath, 'utf-8');
      expect(content).toMatch(/['"]assistant['"]/);
    }

    // Check the component itself exports routing-aware agent options
    const componentPath = resolve(SRC_DIR, 'components/common/EmbeddedAIAssistant.tsx');
    expect(existsSync(componentPath)).toBe(true);
    const content = readFileSync(componentPath, 'utf-8');
    // Must reference task types that correspond to AI_ROUTING_TABLE entries
    expect(content).toMatch(/taskType/);
    expect(content).toMatch(/primaryModel/);
  });

  it('MAT-FE-T-077: EmbeddedAIAssistant has accessibility attributes', () => {
    // FRS: FR-072 AC-6, FR-065 (WCAG 2.1 AA)
    // TRS: TR-035, TR-072
    // Type: structural | Priority: P1

    const componentPath = resolve(SRC_DIR, 'components/common/EmbeddedAIAssistant.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const content = readFileSync(componentPath, 'utf-8');
    // Must have ARIA attributes for accessibility
    expect(content).toMatch(/aria-label/);
    expect(content).toMatch(/aria-expanded/);
    expect(content).toMatch(/role=/);
  });
});
