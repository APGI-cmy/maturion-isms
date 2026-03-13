/**
 * EvidenceModal — Wave 13 (T-W13-WIRE-4)
 *
 * Modal wrapper for evidence submission against a selected criterion.
 * Opened when a user selects a criterion in the audit view.
 *
 * Wire: criterion selection → evidence modal opens (T-W13-WIRE-4)
 * FRS: FR-013 to FR-020 (Evidence Collection)
 */
import { EvidenceCollection } from './EvidenceCollection';

interface EvidenceModalProps {
  isOpen: boolean;
  criterionId: string | null;
  onClose: () => void;
}

export function EvidenceModal({ isOpen, criterionId, onClose }: EvidenceModalProps) {
  if (!isOpen || !criterionId) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-testid="evidence-modal"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          padding: 24,
          maxWidth: 600,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Submit Evidence</h2>
          <button
            onClick={onClose}
            aria-label="Close evidence modal"
            data-testid="evidence-modal-close"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <EvidenceCollection criterionId={criterionId} />
      </div>
    </div>
  );
}

export default EvidenceModal;
