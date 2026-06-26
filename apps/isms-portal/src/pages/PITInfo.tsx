import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useIsms } from '@/context/IsmsContext';
import { hasModuleEntitlement } from '@/lib/entitlements';
import { createCheckoutSearch } from '@/lib/subscription';
import { ROUTES } from '@/lib/routes';
import { Wrench, CheckCircle2, ArrowRight, Shield, Target, BarChart } from 'lucide-react';

/**
 * Project Implementation Tracker (PIT) - Marketing/Information Page
 * Pre-subscription page explaining the PIT module
 */
const PITInfo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { entitlement } = useIsms();
  const canOpenTracker = Boolean(user) && hasModuleEntitlement(entitlement, 'project-implementation');
  const pitCheckoutSearch = createCheckoutSearch({
    selectedModules: ['project-implementation'],
    isBundle: false,
    isYearly: false,
    source: 'pit-marketing',
  });

  const features = [
    "Project implementation tracking and validation",
    "Control effectiveness measurement",
    "Continuous project evidence monitoring",
    "Integration with audit frameworks",
    "Implementation deviation alerts",
    "Compliance tracking and reporting"
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Implementation Assurance",
      description: "Ensure your security improvement projects work as designed"
    },
    {
      icon: Target,
      title: "Control Effectiveness",
      description: "Measure and improve the effectiveness of implementation controls"
    },
    {
      icon: BarChart,
      title: "Audit Readiness",
      description: "Stay audit-ready with project evidence and implementation validation"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4" variant="secondary">
          Coming Soon
        </Badge>
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
          <Wrench className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Project Implementation Tracker (PIT)</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Track security improvement projects, implementation evidence, and operational consistency
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>
              Project implementation tracking capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why Project Implementation Tracker?</CardTitle>
            <CardDescription>
              Ensure operational excellence through systematic implementation tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            A systematic approach to project implementation validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Define", desc: "Map your critical projects and implementation controls" },
              { step: 2, title: "Track", desc: "Capture implementation activity and evidence" },
              { step: 3, title: "Monitor", desc: "Track project performance continuously" },
              { step: 4, title: "Improve", desc: "Optimize based on implementation results" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">
                {canOpenTracker ? 'Open Project Implementation Tracker' : 'Ready to Get Started?'}
              </h3>
              <p className="text-muted-foreground">
                {canOpenTracker
                  ? 'Open the protected Project Implementation Tracker workspace for your entitled module.'
                  : 'Subscribe to unlock Project Implementation Tracker and manage implementation evidence'}
              </p>
            </div>
            <Button
              size="lg"
              className="flex-shrink-0"
              onClick={() => navigate(canOpenTracker ? ROUTES.PIT_TRACKER : `${ROUTES.SUBSCRIBE_CHECKOUT}?${pitCheckoutSearch}`)}
            >
              {canOpenTracker ? 'Open Project Implementation Tracker' : 'Subscribe Now'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PITInfo;
