import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
export default function LoginPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); return; }
    navigate('/dashboard');
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">
          <span className="auth-card__logo-text">Maturion <span>MMM</span></span>
        </div>
        <h1 className="auth-card__title">Sign in to your account</h1>
        <p className="auth-card__subtitle">Welcome back — continue your maturity journey.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              className="form-control"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-control"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p role="alert" className="alert alert-error">{error}</p>}
          <button className="btn btn-primary w-full" type="submit">Sign In</button>
        </form>
        <p className="auth-card__footer">Don&rsquo;t have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}
