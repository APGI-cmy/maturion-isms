interface AIChatModalProps {
  isOpen?: boolean;
}

export function AIChatModal({ isOpen = false }: AIChatModalProps) {
  if (!isOpen) return null;

  return (
    <div>
      <input data-testid="ai-chat-input" type="text" />
    </div>
  );
}

export default AIChatModal;
