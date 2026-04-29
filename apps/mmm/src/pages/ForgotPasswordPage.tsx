import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

const RESET_REDIRECT_URL =
  (import.meta.env.VITE_APP_URL ?? 'https://maturity-model-management.vercel.app') +
  '/reset-password';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: RESET_REDIRECT_URL,
    });
    if (error) { setError(error.message); return; }
    setSubmitted(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">
          <span className="auth-card__logo-text">Maturion <span>MMM</span></span>
        </div>
        <h1 className="auth-card__title">Reset your password</h1>
        <p className="auth-card__subtitle">Enter your email and we&rsquo;ll send you a reset link.</p>
        {submitted ? (
          <div data-testid="forgot-password-success" role="status" className="alert alert-info">
            <strong>Check your email.</strong> If an account exists for <strong>{email}</strong>, a password reset link has been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="forgot-email">Email address</label>
              <input
                id="forgot-email"
                className="form-control"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p role="alert" className="alert alert-error">{error}</p>}
            <button className="btn btn-primary w-full" type="submit">Send Reset Link</button>
          </form>
        )}
        <p className="auth-card__footer"><Link to="/login">Back to Sign In</Link></p>
      </div>
    </div>
  );
}
