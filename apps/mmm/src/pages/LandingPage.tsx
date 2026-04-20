import { Link } from 'react-router-dom';
export default function LandingPage() {
  return (
    <main>
      <h1>Maturion — Know Your Maturity</h1>
      <p>Assess your organisation's maturity level with our evidence-based framework.</p>
      <nav>
        <Link to="/free-assessment">Try Free Assessment</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/tutorial">Learn More</Link>
      </nav>
    </main>
  );
}
