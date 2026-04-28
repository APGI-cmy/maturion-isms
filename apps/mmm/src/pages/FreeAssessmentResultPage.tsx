import { Link } from 'react-router-dom';
import { useFreeAssessmentStore } from '@/store/freeAssessmentStore';

function maturityLabel(score: number | null): string {
  if (score === null) return 'N/A';
  if (score < 1.5) return 'Reactive';
  if (score < 2.5) return 'Developing';
  if (score < 3.5) return 'Defined';
  if (score < 4.5) return 'Managed';
  return 'Optimising';
}

export default function FreeAssessmentResultPage() {
  const { baselineMaturity, domainScores } = useFreeAssessmentStore();

  return (
    <main className="result-page">
      <div className="container">
        <div className="page-header page-header--center">
          <h1 className="page-header__title">Your Maturity Score</h1>
          <p className="page-header__subtitle">
            Based on your diagnostic responses, here is your baseline maturity assessment.
            This is an indicative baseline, not a certified audit.
          </p>
        </div>

        <div className="result-card">
          <p className="result-card__label">Overall Baseline Maturity</p>
          <p className="result-card__score" data-testid="baseline-maturity">
            {baselineMaturity?.toFixed(1) ?? 'N/A'}
          </p>
          <p className="result-card__out-of">out of 5.0</p>
          <p className="result-card__maturity-label">{maturityLabel(baselineMaturity)}</p>
        </div>

        {domainScores && domainScores.length > 0 && (
          <div className="domain-breakdown" data-testid="domain-breakdown">
            <h2 className="domain-breakdown__title">Domain Breakdown</h2>
            <div className="domain-breakdown__list">
              {domainScores.map((ds) => (
                <div key={ds.domain_id} className="domain-score-row">
                  <span className="domain-score-row__name">{ds.domain_name}</span>
                  <span className="domain-score-row__score">{ds.score.toFixed(1)} / 5.0</span>
                  <div className="domain-score-row__bar" role="img"
                    aria-label={`${ds.domain_name}: ${ds.score.toFixed(1)} out of 5`}>
                    <div
                      className="domain-score-row__fill"
                      style={{ width: `${(ds.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="result-cta">
          <p className="result-cta__message">
            Unlock a full assessment with detailed domain and MPS insights, evidence requirements,
            and a step-by-step improvement roadmap.
          </p>
          <Link className="btn btn-primary" to="/signup">Sign up for a full assessment</Link>
        </div>
      </div>
    </main>
  );
}

