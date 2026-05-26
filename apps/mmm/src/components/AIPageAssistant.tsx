import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getEdgeInvokeHeaders, supabase } from '@/lib/supabase';

type ChatTurn = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function AIPageAssistant() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([]);

  const pageContext = useMemo(
    () => ({
      page_route: location.pathname,
      page_query: location.search,
      assistant_type: 'page_context',
    }),
    [location.pathname, location.search],
  );

  const sendMessage = async () => {
    const message = input.trim();
    if (!message || sending) return;

    setSending(true);
    setError(null);
    const userTurn: ChatTurn = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
    };
    setTurns((prev) => [...prev, userTurn]);
    setInput('');

    try {
      const headers = await getEdgeInvokeHeaders();
      const { data, error: invokeError } = await supabase.functions.invoke('mmm-ai-chat-user', {
        headers,
        body: {
          message,
          context: pageContext,
        },
      });

      if (invokeError) {
        throw new Error(invokeError.message || 'Unable to contact Maturion assistant.');
      }

      const reply = (data as { reply?: string })?.reply?.trim() || 'No response received.';
      setTurns((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply,
        },
      ]);
    } catch (sendError) {
      setError((sendError as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="ai-page-assistant" data-testid="ai-page-assistant">
      {open ? (
        <section className="ai-page-assistant__panel" aria-label="Ask Maturion assistant">
          <header className="ai-page-assistant__header">
            <h2>Ask Maturion</h2>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
            >
              Close
            </button>
          </header>

          <div className="ai-page-assistant__messages">
            {turns.length === 0 ? (
              <p className="ai-page-assistant__placeholder">
                Ask for help about this page, your current workflow, or next steps.
              </p>
            ) : (
              turns.map((turn) => (
                <article key={turn.id} className={`ai-page-assistant__turn ai-page-assistant__turn--${turn.role}`}>
                  <strong>{turn.role === 'user' ? 'You' : 'Maturion'}</strong>
                  <p>{turn.content}</p>
                </article>
              ))
            )}
          </div>

          {error ? (
            <div role="alert" className="alert alert-error">
              {error}
            </div>
          ) : null}

          <footer className="ai-page-assistant__composer">
            <textarea
              rows={3}
              className="form-control"
              value={input}
              placeholder="Type your question…"
              onChange={(event) => setInput(event.target.value)}
              disabled={sending}
            />
            <button type="button" className="btn btn-primary" onClick={sendMessage} disabled={sending || input.trim().length === 0}>
              {sending ? 'Sending…' : 'Send'}
            </button>
          </footer>
        </section>
      ) : (
        <button
          type="button"
          className="btn btn-primary ai-page-assistant__open"
          onClick={() => setOpen(true)}
          aria-label="Open Ask Maturion assistant"
        >
          Ask Maturion
        </button>
      )}
    </div>
  );
}

export default AIPageAssistant;
