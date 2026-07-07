import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { isExternalModuleRoute } from '@/lib/moduleRuntimeRoutes';
import { ROUTES } from '@/lib/routes';

type LoginLocationState = {
  from?: string;
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');

  const from = (location.state as LoginLocationState | null)?.from || ROUTES.ONBOARDING;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) return;

    signIn(email.trim());

    if (isExternalModuleRoute(from)) {
      window.location.assign(from);
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Sign in to continue</CardTitle>
          <CardDescription>
            W3 mock authentication for the ISMS subscription and onboarding journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="space-y-2 block">
              <span className="text-sm font-medium">Work email</span>
              <input
                className="w-full rounded-md border bg-background px-3 py-2"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@organisation.com"
                required
              />
            </label>
            <Button className="w-full" type="submit">
              Continue
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            This is a non-production authentication shell. Provider-backed auth remains future scope.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export { LoginForm };
export default LoginForm;
