import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { AskMaturionButton } from '@/components/AskMaturionButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsms } from '@/context/IsmsContext';
import { allIsmsModules, hasModuleEntitlement, type IsmsModuleKey } from '@/lib/entitlements';
import { createMaturityRoadmapHandoff, storeMaturityRoadmapHandoff } from '@/lib/handoff';
import { ROUTES } from '@/lib/routes';

const moduleLabels: Record<IsmsModuleKey, { title: string; description: string; marketingRoute: string }> = {
  'maturity-roadmap': {
    title: 'Maturity Roadmap',
    description: 'Move from indicative assessment to a governed maturity improvement programme.',
    marketingRoute: ROUTES.MARKETING_MATURITY_ROADMAP,
  },
  'risk-management': {
    title: 'Risk Management',
    description: 'Structure operational security risk identification, control and monitoring.',
    marketingRoute: ROUTES.MARKETING_RISK_MANAGEMENT,
  },
  'project-implementation': {
    title: 'Project Implementation',
    description: 'Track security improvement projects and implementation evidence.',
    marketingRoute: ROUTES.MARKETING_PROJECT_IMPLEMENTATION,
  },
  'data-analytics-assurance': {
    title: 'Data Analytics and Assurance',
    description: 'Use analytical evidence to strengthen assurance and management review.',
    marketingRoute: ROUTES.MARKETING_DATA_ANALYTICS,
  },
  'skills-development': {
    title: 'Skills Development',
    description: 'Guide learning needs and capability development for security maturity.',
    marketingRoute: ROUTES.MARKETING_SKILLS_DEVELOPMENT,
  },
  'incident-intelligence': {
    title: 'Incident Intelligence',
    description: 'Turn incidents, weak signals and investigations into improvement intelligence.',
    marketingRoute: ROUTES.MARKETING_INCIDENT_INTELLIGENCE,
  },
  'systems-integration': {
    title: 'Systems Integration',
    description: 'Prepare systems and data extraction surfaces for future integration work.',
    marketingRoute: ROUTES.MARKETING_SYSTEMS_INTEGRATION,
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { entitlement } = useIsms();

  const openModule = (moduleKey: IsmsModuleKey) => {
    if (!hasModuleEntitlement(entitlement, moduleKey)) {
      navigate(`${ROUTES.SUBSCRIBE}?modules=${moduleKey}&source=dashboard-upgrade`);
      return;
    }

    if (moduleKey === 'maturity-roadmap') {
      const handoff = createMaturityRoadmapHandoff(entitlement);
      storeMaturityRoadmapHandoff(handoff);
      navigate(ROUTES.MATURITY_SETUP);
      return;
    }

    navigate(moduleLabels[moduleKey].marketingRoute);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">ISMS workspace</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            W5 adds a safe Ask Maturion preview. It prepares deterministic educational or filtered-context guidance without calling a live AI provider.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <AskMaturionButton moduleKey="maturity-roadmap" />
          <Button asChild variant="outline">
            <Link to={ROUTES.SUBSCRIBE}>Manage subscription</Link>
          </Button>
        </div>
      </div>

      <Card className="mb-6 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Current entitlement state
          </CardTitle>
          <CardDescription>
            {entitlement.isBundle
              ? 'Full mock bundle entitlement is active.'
              : entitlement.entitledModules.length > 0
                ? `${entitlement.entitledModules.length} mock module entitlement(s) active.`
                : 'No mock module entitlement is active yet.'}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {allIsmsModules.map((moduleKey) => {
          const module = moduleLabels[moduleKey];
          const allowed = hasModuleEntitlement(entitlement, moduleKey);

          return (
            <Card key={moduleKey} className={allowed ? 'border-primary/30' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  <span>{module.title}</span>
                  {!allowed && <Lock className="h-4 w-4 text-muted-foreground" />}
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant={allowed ? 'default' : 'outline'} onClick={() => openModule(moduleKey)}>
                  {allowed ? 'Open module' : 'View upgrade path'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
