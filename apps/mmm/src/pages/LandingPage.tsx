import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <nav className="nav">
            <span className="nav__logo">Maturion <span>MMM</span></span>
            <Link className="nav__link" to="/tutorial">Learn More</Link>
            <Link className="btn btn-outline" to="/free-assessment">Try Free</Link>
            <Link className="btn btn-outline" to="/login">Sign In</Link>
            <Link className="btn btn-primary" to="/signup">Sign Up</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <span className="hero__eyebrow">Maturity Model Management</span>
          <div className="hero__title">
            <h1>
              Maturion — Know Your <span>Maturity</span>.<br />Grow With Confidence.
            </h1>
          </div>
          <p className="hero__subtitle">
            Assess your organisation&rsquo;s maturity level with our evidence-based framework.
            Identify gaps, prioritise improvements, and track progress over time.
          </p>
          <div className="hero__actions">
            <Link className="btn btn-primary" to="/free-assessment">Try Free Assessment</Link>
            <Link className="btn btn-outline-light" to="/signup">Sign Up</Link>
            <Link className="btn btn-ghost-light" to="/login">Sign In</Link>
            <Link className="btn btn-ghost-light" to="/tutorial">Learn More</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features__header">
            <span className="features__label">Why Maturion MMM</span>
            <h2 className="features__title">Everything you need to assess &amp; grow</h2>
            <p className="features__subtitle">
              A complete platform for evidence-based organisational maturity management.
            </p>
          </div>
          <div className="features__grid">
            <div className="feature-card">
              <div className="feature-card__icon">📊</div>
              <h3 className="feature-card__title">Evidence-Based Scoring</h3>
              <p className="feature-card__body">
                Score your maturity across key domains using structured evidence — not guesswork.
                Our framework maps directly to industry standards.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">🗺️</div>
              <h3 className="feature-card__title">Improvement Roadmaps</h3>
              <p className="feature-card__body">
                Automatically generate prioritised roadmaps that guide your team from current
                state to target maturity level.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">🔒</div>
              <h3 className="feature-card__title">Compliance Ready</h3>
              <p className="feature-card__body">
                Built-in mappings to ISO 27001, NIST CSF, and other leading frameworks so
                your assessments count toward compliance objectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-strip">
        <div className="container">
          <h2 className="cta-strip__title">Ready to discover your maturity level?</h2>
          <p className="cta-strip__subtitle">
            Run a free five-domain assessment in under two minutes — no credit card required.
          </p>
          <div className="hero__actions">
            <Link className="btn btn-primary" to="/free-assessment">Try Free Assessment</Link>
            <Link className="btn btn-outline-light" to="/signup">Create Account</Link>
            <Link className="btn btn-ghost-light" to="/login">Sign In</Link>
          </div>
        </div>
      </section>
    </>
  );
}

