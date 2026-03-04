/**
 * Embedded AI Assistant Component
 * Platform Standard: LL-031 (Maturion/Platform/AI-Standard)
 * FRS: FR-072 (Embedded AI Assistant)
 * TRS: TR-072
 *
 * Wave 7 (AIMC Advisory Integration): handleSend now calls the server-side
 * AIMC proxy at AI_GATEWAY_URL (/api/ai/request). On AIMC unavailability the
 * panel shows a graceful error notice (data-testid="ai-assistant-unavailable")
 * instead of crashing. No provider SDK imports — all AI traffic is server-side.
 */
import { useState, useRef, useEffect } from 'react';
import type { AIAgentOption, AIAssistantMessage } from './aiAssistantConfig';
import { AI_AGENT_OPTIONS, AI_GATEWAY_URL } from './aiAssistantConfig';

export type { AIAgentOption, AIAssistantMessage };
export { AI_AGENT_OPTIONS };

/**
 * ContextPayload — criteria context pre-injected into the AI chat session.
 * Passed from CriteriaCard when user clicks "Explore further levels" (FR-096).
 */
type ContextPayload = {
  criteria_name: string;
  current_level?: number;
  next_level_guidance?: string;
};

interface EmbeddedAIAssistantProps {
  /** Override the default agent selection */
  defaultAgentId?: string;
  /** Whether the panel starts open */
  initiallyOpen?: boolean;
  /** Criteria context payload — pre-seeds the AI session with evaluation context (FR-096) */
  contextPayload?: ContextPayload;
}

export function EmbeddedAIAssistant({
  defaultAgentId = 'routine',
  initiallyOpen = false,
  contextPayload,
}: EmbeddedAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [selectedAgentId, setSelectedAgentId] = useState(defaultAgentId);
  const [messages, setMessages] = useState<AIAssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiUnavailable, setIsAiUnavailable] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedAgent =
    AI_AGENT_OPTIONS.find((a) => a.id === selectedAgentId) ?? AI_AGENT_OPTIONS[0];

  // Seed initial messages when contextPayload is provided (FR-096 — context injection).
  // When the user opens the chat from a criteria card, the AI session is pre-loaded
  // with { criteria_name, current_level, next_level_guidance } as a system context message.
  useEffect(() => {
    if (contextPayload) {
      const contextParts: string[] = [
        `Criteria: ${contextPayload.criteria_name}`,
      ];
      if (contextPayload.current_level !== undefined) {
        contextParts.push(`Current maturity level: ${contextPayload.current_level}`);
      }
      if (contextPayload.next_level_guidance) {
        contextParts.push(`Guidance to improve: ${contextPayload.next_level_guidance}`);
      }
      const contextMessage: AIAssistantMessage = {
        id: `ctx-${Date.now()}`,
        role: 'assistant',
        content: `I have context for this criteria session:\n${contextParts.join('\n')}\n\nHow can I help you explore further levels or understand what's needed to improve?`,
        timestamp: new Date(),
      };
      setMessages([contextMessage]);
    }
  }, [contextPayload]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  function handleToggle() {
    setIsOpen((prev) => !prev);
  }

  function handleAgentChange(agentId: string) {
    setSelectedAgentId(agentId);
  }

  async function handleSend() {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: AIAssistantMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(AI_GATEWAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          capability: 'advisory',
          agent: selectedAgent.agentId,
          input: { text },
          context: {
            organisationId: 'default', // TODO: wire real org context
            sessionId: `session-${Date.now()}`,
          },
        }),
      });

      if (!response.ok) {
        setIsAiUnavailable(true);
        return;
      }

      const data = (await response.json()) as Record<string, unknown>;

      // Check for AIMC error response (has errorCode field)
      if ('errorCode' in data) {
        setIsAiUnavailable(true);
        return;
      }

      // Success — extract advisory text from result
      const result = data.result as Record<string, unknown> | undefined;
      const advisoryText =
        typeof result?.text === 'string' ? result.text : 'Advisory response received.';

      const assistantMessage: AIAssistantMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: advisoryText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsAiUnavailable(false);
    } catch {
      setIsAiUnavailable(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <div
      className="embedded-ai-assistant"
      data-testid="embedded-ai-assistant"
      aria-label="Embedded AI Assistant"
    >
      {/* Toggle button */}
      <button
        type="button"
        className="ai-assistant-toggle"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls="ai-assistant-panel"
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        data-testid="ai-assistant-toggle"
      >
        <span aria-hidden="true">🤖</span>
        <span className="ai-assistant-toggle-label">AI Assistant</span>
      </button>

      {/* Collapsible panel */}
      {isOpen && (
        <div
          id="ai-assistant-panel"
          className="ai-assistant-panel"
          role="dialog"
          aria-label="AI Assistant panel"
          aria-modal="false"
          data-testid="ai-assistant-panel"
        >
          {/* Context indicator — shown when contextPayload is injected (FR-096) */}
          {contextPayload && (
            <div
              data-testid="ai-context-indicator"
              className="ai-context-indicator px-3 py-1.5 bg-blue-50 border-b border-blue-100 text-xs text-blue-700"
              aria-label="AI context loaded from criteria card"
            >
              📌 Context loaded: <strong>{contextPayload.criteria_name}</strong>
              {contextPayload.current_level !== undefined && (
                <span> — Level {contextPayload.current_level}</span>
              )}
            </div>
          )}

          {/* Header with agent/model selector */}
          <div className="ai-assistant-header">
            <span className="ai-assistant-title">AI Assistant</span>
            {/* Agent/model selection (FR-072 AC-2, TR-072 Constraint 2) */}
            <select
              className="ai-agent-selector"
              value={selectedAgentId}
              onChange={(e) => handleAgentChange(e.target.value)}
              aria-label="Select AI agent"
              data-testid="ai-agent-selector"
            >
              {AI_AGENT_OPTIONS.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="ai-assistant-close"
              onClick={handleToggle}
              aria-label="Close AI Assistant"
              data-testid="ai-assistant-close"
            >
              ✕
            </button>
          </div>

          {/* Agent description */}
          <div className="ai-agent-description" aria-live="polite">
            {selectedAgent.description}
          </div>

          {/* Message history */}
          <div
            className="ai-assistant-messages"
            role="log"
            aria-label="AI conversation history"
            aria-live="polite"
            data-testid="ai-assistant-messages"
          >
            {messages.length === 0 && !isAiUnavailable && (
              <p className="ai-assistant-empty">
                Ask the {selectedAgent.label} anything about your audit…
              </p>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ai-message ai-message--${msg.role}`}
                data-testid={`ai-message-${msg.role}`}
              >
                <span className="ai-message-role">
                  {msg.role === 'user' ? 'You' : selectedAgent.label}
                </span>
                <span className="ai-message-content">{msg.content}</span>
              </div>
            ))}
            {isAiUnavailable && (
              <div
                data-testid="ai-assistant-unavailable"
                className="ai-assistant-unavailable"
                role="alert"
              >
                AI assistant is temporarily unavailable. Please try again later.
              </div>
            )}
            {isLoading && (
              <div className="ai-message ai-message--loading" aria-label="AI is thinking">
                <span className="ai-message-role">{selectedAgent.label}</span>
                <span className="ai-message-content">…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="ai-assistant-input-area">
            <textarea
              className="ai-assistant-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the AI assistant… (Enter to send)"
              rows={2}
              disabled={isLoading}
              aria-label="Message to AI assistant"
              data-testid="ai-assistant-input"
            />
            <button
              type="button"
              className="ai-assistant-send"
              onClick={() => void handleSend()}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
              data-testid="ai-assistant-send"
            >
              {isLoading ? '…' : '➤'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
