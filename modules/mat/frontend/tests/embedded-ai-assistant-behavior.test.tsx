/**
 * MAT Frontend — Behavior Tests: Embedded AI Assistant (LL-031)
 *
 * Validates runtime UI behavior of the EmbeddedAIAssistant component using
 * React Testing Library: toggle open/close, message submission, agent selection.
 *
 * Platform Standard: LL-031 (Maturion/Platform/AI-Standard)
 * FRS: FR-072 (Embedded AI Assistant)
 * TRS: TR-072
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  EmbeddedAIAssistant,
  AI_AGENT_OPTIONS,
} from '../src/components/common/EmbeddedAIAssistant';

// jsdom does not implement scrollIntoView; mock it globally
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = () => {};
});

describe('CAT-FE-13b: embedded AI assistant behavior (FR-072)', () => {
  it('MAT-FE-T-078: toggle button opens and closes the panel', () => {
    // FRS: FR-072 AC-1 (collapsible panel)
    // TRS: TR-072 Constraint 3
    // Type: behavior | Priority: P0

    render(<EmbeddedAIAssistant />);

    const toggle = screen.getByTestId('ai-assistant-toggle');

    // Panel is closed initially
    expect(screen.queryByTestId('ai-assistant-panel')).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(toggle);
    expect(screen.getByTestId('ai-assistant-panel')).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    fireEvent.click(toggle);
    expect(screen.queryByTestId('ai-assistant-panel')).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('MAT-FE-T-079: sending a message appends user and assistant messages to the log', async () => {
    // FRS: FR-072 AC-3 (chat UI functional)
    // TRS: TR-072 Constraint 3
    // Type: behavior | Priority: P0

    render(<EmbeddedAIAssistant initiallyOpen={true} />);

    const input = screen.getByTestId('ai-assistant-input');
    const sendBtn = screen.getByTestId('ai-assistant-send');
    const messages = screen.getByTestId('ai-assistant-messages');

    // Initially no messages
    expect(messages.querySelectorAll('[data-testid="ai-message-user"]')).toHaveLength(0);

    // Type and send a message
    fireEvent.change(input, { target: { value: 'What is maturity level 3?' } });
    fireEvent.click(sendBtn);

    // User message appears in log
    const userMessages = await screen.findAllByTestId('ai-message-user');
    expect(userMessages.length).toBeGreaterThanOrEqual(1);
    expect(userMessages[0]).toHaveTextContent('What is maturity level 3?');

    // Placeholder assistant response appears
    const assistantMessages = await screen.findAllByTestId('ai-message-assistant');
    expect(assistantMessages.length).toBeGreaterThanOrEqual(1);
  });

  it('MAT-FE-T-080: changing agent updates the displayed agent label', () => {
    // FRS: FR-072 AC-2 (agent/model selection)
    // TRS: TR-072 Constraint 2
    // Type: behavior | Priority: P0

    render(<EmbeddedAIAssistant initiallyOpen={true} defaultAgentId="routine" />);

    const selector = screen.getByTestId('ai-agent-selector') as HTMLSelectElement;

    // Default is 'routine'
    expect(selector.value).toBe('routine');

    // Switch to 'scoring'
    fireEvent.change(selector, { target: { value: 'scoring' } });
    expect(selector.value).toBe('scoring');

    // Description updates to reflect selected agent
    const scoringAgent = AI_AGENT_OPTIONS.find((a) => a.id === 'scoring')!;
    expect(screen.getByText(scoringAgent.description)).toBeInTheDocument();
  });
});
