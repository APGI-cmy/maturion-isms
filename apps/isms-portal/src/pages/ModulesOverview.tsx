import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Settings, ChevronRight, Lock, Unlock } from 'lucide-react';
import { useIsms } from '@/context/IsmsContext';
import { MMM_APP_URL, isExternalModuleRoute } from '@/lib/moduleRuntimeRoutes';
import { ROUTES } from '@/lib/routes';
import { ISMS_MODULE_CARDS } from '@/lib/moduleCards';

const ModulesOverview: React.FC = () => {
  const navigate = useNavigate();
  const { hasEntitlement } = useIsms();

  const resolveModuleRoute = (moduleId: string, route: string) => {
    if (moduleId === 'maturity-roadmap' && hasEntitlement('maturity-roadmap')) {
      return MMM_APP_URL;
    }

    if (moduleId === 'project-implementation' && hasEntitlement('project-implementation')) {
      return ROUTES.PIT_TRACKER;
    }

    return route;
  };

  const openRoute = (route: string) => {
    if (isExternalModuleRoute(route)) {
      window.location.assign(route);
      return;
    }

    navigate(route);
  };

  const handleModuleKeyDown = (event: React.KeyboardEvent, route: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openRoute(route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Maturion</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.HOME)}>
                <Settings className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">ISMS Platform Modules</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the public overview of each Information Security Management System module before
            subscribing or entering a private workspace.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ISMS_MODULE_CARDS.map((module) => {
            const IconComponent = module.icon;
            const isEntitled = hasEntitlement(module.id as never);
            const isEntitledPit = module.id === 'project-implementation' && hasEntitlement('project-implementation');
            const isEntitledMmm = module.id === 'maturity-roadmap' && hasEntitlement('maturity-roadmap');
            const moduleRoute = resolveModuleRoute(module.id, module.route);
            const AccessIcon = isEntitledPit || isEntitledMmm ? Unlock : Lock;

            return (
              <Card
                key={module.id}
                role="button"
                tabIndex={0}
                aria-label={isEntitledPit || isEntitledMmm ? `Open ${module.name}` : `Open public overview for ${module.name}`}
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border-2 ${module.borderColor} bg-gradient-to-br ${module.bgGradient}`}
                onClick={() => openRoute(moduleRoute)}
                onKeyDown={(event) => handleModuleKeyDown(event, moduleRoute)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-r ${module.gradient} text-white shadow-sm`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <AccessIcon
                      className="h-5 w-5 text-muted-foreground"
                      aria-label={isEntitledPit || isEntitledMmm ? 'Private workspace available' : 'Private workspace gated'}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-xl">{module.name}</CardTitle>
                    <Badge variant={isEntitledPit || isEntitledMmm ? 'default' : module.badgeVariant}>
                      {isEntitledPit || isEntitledMmm ? 'Active' : module.badge}
                    </Badge>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {module.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-muted-foreground">
                      {isEntitledPit || isEntitledMmm ? 'Open workspace' : 'Public overview'}
                    </Badge>

                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-2">
                        {isEntitledPit ? 'Open Tracker' : isEntitledMmm ? 'Open MMM' : 'Learn More'}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5" />
                Need Help Getting Started?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Start with the free assessment or review subscription options when you are ready to
                move from public discovery into a private module workspace.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate(ROUTES.FREE_ASSESSMENT)}>
                  Start Free Assessment
                </Button>
                <Button variant="outline" onClick={() => navigate(ROUTES.SUBSCRIBE)}>
                  View Subscription Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ModulesOverview;
