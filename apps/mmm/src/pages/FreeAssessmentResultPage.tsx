import { Link } from 'react-router-dom';
import { useFreeAssessmentStore } from '@/store/freeAssessmentStore';
export default function FreeAssessmentResultPage() {
  const { baselineMaturity } = useFreeAssessmentStore();
  return (
    <main className="result-page">
      <div className="container">
        <div className="page-header page-header--center">
          <h1 className="page-header__title">Your Maturity Score</h1>
          <p className="page-header__subtitle">
            Based on your domain responses, here is your baseline maturity assessment.
          </p>
        </div>

        <div className="result-card">
          <p className="result-card__label">Baseline Maturity Level</p>
          <p className="result-card__score" data-testid="baseline-maturity">
            {baselineMaturity?.toFixed(1) ?? 'N/A'}
          </p>
          <p className="result-card__out-of">out of 5.0</p>
          <p className="result-card__cta">
            Unlock a full assessment with detailed domain insights and an improvement roadmap.
          </p>
          <Link className="btn btn-primary" to="/signup">Sign up for a full assessment</Link>
        </div>
      </div>
    </main>
  );
}

