import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
export default function SignUpPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); return; }
    navigate('/onboarding');
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">
          <span className="auth-card__logo-text">Maturion <span>MMM</span></span>
        </div>
        <h1 className="auth-card__title">Create your account</h1>
        <p className="auth-card__subtitle">Start your maturity journey today — free.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              className="form-control"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              className="form-control"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p role="alert" className="alert alert-error">{error}</p>}
          <button className="btn btn-primary w-full" type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

