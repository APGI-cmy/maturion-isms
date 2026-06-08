import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { ONBOARDING_PROFILE_STORAGE_KEY, type OnboardingProfile, isOnboardingProfileComplete } from '@/lib/subscription';
import { ROUTES } from '@/lib/routes';

const initialProfile: OnboardingProfile = {
  organisationName: '',
  sector: 'diamond mining, sorting, trading or high-value mineral operations',
  primaryGoal: '',
  responsiblePerson: '',
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<OnboardingProfile>(initialProfile);
  const [submitted, setSubmitted] = useState(false);

  const isComplete = isOnboardingProfileComplete(profile);

  const updateProfile = (field: keyof OnboardingProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isComplete) return;

    window.localStorage.setItem(
      ONBOARDING_PROFILE_STORAGE_KEY,
      JSON.stringify({ ...profile, email: user?.email ?? null, completedAt: new Date().toISOString() }),
    );
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl border-primary/30">
          <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" />
            <CardTitle>Onboarding baseline captured</CardTitle>
            <CardDescription>
              Your organisation context has been captured for the next private ISMS workspace step.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              W3 stops here by design. W4 will connect this context to entitlement checks and the private maturity setup handoff.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={() => navigate(ROUTES.HOME)}>
                Main ISMS page
              </Button>
              <Button onClick={() => navigate(ROUTES.DASHBOARD)}>
                Continue to protected dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted px-4 py-8">
      <div className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <div className="mb-3 flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Get to know your organisation</CardTitle>
                <CardDescription>
                  Capture the minimum context needed after subscription checkout.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="space-y-2 block">
                <span className="text-sm font-medium">Organisation name</span>
                <input
                  className="w-full rounded-md border bg-background px-3 py-2"
                  value={profile.organisationName}
                  onChange={(event) => updateProfile('organisationName', event.target.value)}
                  required
                />
              </label>
              <label className="space-y-2 block">
                <span className="text-sm font-medium">Sector or operating context</span>
                <input
                  className="w-full rounded-md border bg-background px-3 py-2"
                  value={profile.sector}
                  onChange={(event) => updateProfile('sector', event.target.value)}
                  required
                />
              </label>
              <label className="space-y-2 block">
                <span className="text-sm font-medium">Primary maturity goal</span>
                <textarea
                  className="min-h-24 w-full rounded-md border bg-background px-3 py-2"
                  value={profile.primaryGoal}
                  onChange={(event) => updateProfile('primaryGoal', event.target.value)}
                  placeholder="Example: strengthen chain of custody, improve surveillance analysis, or prepare ESCO motivation."
                  required
                />
              </label>
              <label className="space-y-2 block">
                <span className="text-sm font-medium">Responsible person</span>
                <input
                  className="w-full rounded-md border bg-background px-3 py-2"
                  value={profile.responsiblePerson}
                  onChange={(event) => updateProfile('responsiblePerson', event.target.value)}
                  placeholder="Name and role"
                  required
                />
              </label>
              <Button className="w-full" type="submit" disabled={!isComplete}>
                Complete onboarding
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
