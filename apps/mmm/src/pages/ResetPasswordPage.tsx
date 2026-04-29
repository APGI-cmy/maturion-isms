import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const isRecoveryFlow = () => {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const searchParams = new URLSearchParams(window.location.search);
      return hashParams.get('type') === 'recovery' || searchParams.get('type') === 'recovery';
    };

    const syncSessionReady = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (isMounted && session && isRecoveryFlow()) {
        setSessionReady(true);
      }
    };

    void syncSessionReady();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (session && isRecoveryFlow())) {
        setSessionReady(true);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); return; }
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-card__logo">
            <span className="auth-card__logo-text">Maturion <span>MMM</span></span>
          </div>
          <div data-testid="reset-password-success" role="status" className="alert alert-info">
            <strong>Password updated.</strong> You will be redirected to sign in shortly.
          </div>
          <p className="auth-card__footer"><Link to="/login">Sign in now</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">
          <span className="auth-card__logo-text">Maturion <span>MMM</span></span>
        </div>
        <h1 className="auth-card__title">Set a new password</h1>
        <p className="auth-card__subtitle">Enter your new password below.</p>
        {!sessionReady && (
          <p className="auth-card__subtitle">Verifying your reset link&hellip;</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reset-password">New password</label>
            <input
              id="reset-password"
              className="form-control"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={!sessionReady}
            />
          </div>
          {error && <p role="alert" className="alert alert-error">{error}</p>}
          <button className="btn btn-primary w-full" type="submit" disabled={!sessionReady}>
            Update Password
          </button>
        </form>
        <p className="auth-card__footer"><Link to="/login">Back to Sign In</Link></p>
      </div>
    </div>
  );
}
