import React from 'react';

interface AIChatModalProps {
  isOpen?: boolean;
}

export function AIChatModal({ isOpen }: AIChatModalProps) {
  return (
    <div>
      <input data-testid="ai-chat-input" type="text" />
    </div>
  );
}

export default AIChatModal;
