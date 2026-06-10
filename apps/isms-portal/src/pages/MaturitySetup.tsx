import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardCheck } from 'lucide-react';
import { AskMaturionButton } from '@/components/AskMaturionButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { readMaturityRoadmapHandoff } from '@/lib/handoff';
import { ROUTES } from '@/lib/routes';

const MaturitySetup = () => {
  const handoff = readMaturityRoadmapHandoff();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Maturity roadmap setup</h1>
          <p className="mt-2 text-muted-foreground">
            W5 adds safe Ask Maturion guidance for this protected handoff surface. The full MMM execution engine remains future scope.
          </p>
        </div>
        <AskMaturionButton
          moduleKey="maturity-roadmap"
          organisationName={handoff?.organisationName}
          sector={handoff?.sector}
          primaryGoal={handoff?.primaryGoal}
        />
      </div>

      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            Handoff context
          </CardTitle>
          <CardDescription>
            Context prepared by the ISMS workspace for future maturity roadmap execution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Organisation</p>
              <p className="font-semibold">{handoff?.organisationName ?? 'Not captured'}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Sector</p>
              <p className="font-semibold">{handoff?.sector ?? 'Not captured'}</p>
            </div>
            <div className="rounded-lg border p-4 md:col-span-2">
              <p className="text-sm text-muted-foreground">Primary goal</p>
              <p className="font-semibold">{handoff?.primaryGoal ?? 'Not captured'}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Responsible person</p>
              <p className="font-semibold">{handoff?.responsiblePerson ?? 'Not captured'}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="font-semibold">{handoff?.source ?? 'Workspace'}</p>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            This is a W5 protected guidance surface. Ask Maturion does not invoke a live AI provider, persist data to Supabase, emit audit events, bypass entitlements, or execute the private MMM engine.
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to={ROUTES.DASHBOARD}>Back to workspace</Link>
            </Button>
            <Button asChild>
              <Link to={ROUTES.MARKETING_MATURITY_ROADMAP}>
                Review roadmap approach
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaturitySetup;
