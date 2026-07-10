import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, KeyRound, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useIsms } from '@/context/IsmsContext';
import { ROUTES } from '@/lib/routes';

const pitSubscribePath = `${ROUTES.SUBSCRIBE}?modules=project-implementation&source=pit-entry`;

export const PitStandaloneEntry: React.FC = () => {
  const { user } = useAuth();
  const { hasEntitlement } = useIsms();
  const canOpenPit = hasEntitlement('project-implementation');

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white" data-testid="pit-standalone-entry">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">PIT standalone entry</p>
          <h1 className="mt-4 text-4xl font-bold">Project Implementation Tracker</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-200">
            Start from PIT while staying inside the governed Maturion access model.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {user && canOpenPit ? (
              <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-slate-200">
                <Link to={ROUTES.PIT_TRACKER}>Open PIT workspace<ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            ) : user ? (
              <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-slate-200">
                <Link to={pitSubscribePath}>Select PIT access<ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-slate-200">
                  <Link to={ROUTES.SIGNUP}>Create account<UserPlus className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/50 bg-transparent text-white hover:bg-white/10">
                  <Link to={ROUTES.LOGIN} state={{ from: ROUTES.PIT }}>Sign in<KeyRound className="ml-2 h-4 w-4" /></Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <Card className="border-white/10 bg-white/10 text-white">
          <CardHeader>
            <CardTitle>Access sequence</CardTitle>
            <CardDescription className="text-slate-300">Reviewer state panel for Slice 2.3 evidence.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 text-sm md:grid-cols-3" data-testid="pit-entry-state">
              <div className="rounded-xl bg-black/20 p-4">
                <dt className="font-semibold text-slate-300">User</dt>
                <dd>{user ? user.role : 'signed out'}</dd>
              </div>
              <div className="rounded-xl bg-black/20 p-4">
                <dt className="font-semibold text-slate-300">PIT access</dt>
                <dd>{canOpenPit ? 'ready' : 'required'}</dd>
              </div>
              <div className="rounded-xl bg-black/20 p-4">
                <dt className="font-semibold text-slate-300">Next step</dt>
                <dd>{user && canOpenPit ? 'workspace' : user ? 'select access' : 'account'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default PitStandaloneEntry;
