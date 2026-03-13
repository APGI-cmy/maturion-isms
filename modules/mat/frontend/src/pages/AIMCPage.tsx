/**
 * AIMCPage — Wave 13 (T-W13-E2E-4)
 *
 * AIMC (AI Maturity Companion) chat page with graceful fallback
 * when the AI service is unavailable.
 *
 * Delegates to AIChatModal; shows a user-friendly message when
 * the AI endpoint is unreachable rather than crashing.
 *
 * FRS: AI-assisted maturity guidance (graceful degradation required)
 */
import { useState, useEffect } from 'react';
import { AIChatModal } from '../components/AIChatModal';

export function AIMCPage() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [aiUnavailable, setAiUnavailable] = useState(false);

  // Probe AI endpoint reachability; fall back gracefully if unavailable
  useEffect(() => {
    const aiUrl = import.meta.env.VITE_AI_GATEWAY_URL;
    if (!aiUrl) return;

    const controller = new AbortController();
    fetch(`${aiUrl}/health`, { signal: controller.signal, method: 'HEAD' })
      .then((res) => { if (!res.ok) setAiUnavailable(true); })
      .catch(() => setAiUnavailable(true));

    return () => controller.abort();
  }, []);

  return (
    <div data-testid="aimc-page">
      {aiUnavailable ? (
        <div data-testid="aimc-fallback-message">
          The AI assistant is temporarily unavailable. Please try again later.
        </div>
      ) : (
        <AIChatModal isOpen={isChatOpen} />
      )}
      <button
        onClick={() => setIsChatOpen((open) => !open)}
        data-testid="aimc-toggle-chat"
        style={{ marginTop: 8 }}
      >
        {isChatOpen ? 'Close' : 'Open'} AI Chat
      </button>
    </div>
  );
}

export default AIMCPage;
