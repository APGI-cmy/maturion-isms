/**
 * Evidence Capture Component
 * FRS: FR-013 (Multi-Format Evidence)
 * TRS: TR-047
 * 
 * Wave 5.6R Gap G-04: Delegates to EvidenceCollection for live Supabase data wiring
 */
import { EvidenceCollection } from './EvidenceCollection';

interface EvidenceCaptureProps {
  criterionId: string;
}

export function EvidenceCapture({ criterionId }: EvidenceCaptureProps) {
  return <EvidenceCollection criterionId={criterionId} />;
}
