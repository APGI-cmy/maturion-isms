import { Link } from 'react-router-dom';
import { useFreeAssessmentStore } from '@/store/freeAssessmentStore';
export default function FreeAssessmentResultPage() {
  const { baselineMaturity } = useFreeAssessmentStore();
  return (
    <main>
      <h1>Your Maturity Score</h1>
      <p data-testid="baseline-maturity">Level: {baselineMaturity?.toFixed(1) ?? 'N/A'} / 5.0</p>
      <Link to="/signup">Sign up for a full assessment</Link>
    </main>
  );
}
