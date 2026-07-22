import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { isExternalModuleRoute } from '@/lib/moduleRuntimeRoutes';
import { ROUTES } from '@/lib/routes';

type LoginLocationState = { from?: string };

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const from = (location.state as LoginLocationState | null)?.from || ROUTES.ONBOARDING;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) return;
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      if (isExternalModuleRoute(from)) window.location.assign(from);
      else navigate(from, { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Sign-in failed.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Sign in to continue</CardTitle>
          <CardDescription>Use your governed Maturion account and active organisation membership.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="space-y-2 block"><span className="text-sm font-medium">Work email</span><input className="w-full rounded-md border bg-background px-3 py-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@organisation.com" required /></label>
            <label className="space-y-2 block"><span className="text-sm font-medium">Password</span><input className="w-full rounded-md border bg-background px-3 py-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
            {(error || authError) && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900">{error || authError}</p>}
            <Button className="w-full" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">Access fails closed when no active organisation membership or PIT role exists.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export { LoginForm };
export default LoginForm;
