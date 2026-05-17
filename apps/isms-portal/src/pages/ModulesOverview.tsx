import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  TrendingUp,
  Eye,
  FileText,
  Users,
  Settings,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const ismsModules = [
  {
    id: 'maturity-development',
    name: 'Maturity Development',
    description: 'Build and assess your organizational security maturity framework',
    icon: TrendingUp,
    isSubscribed: false,
    route: ROUTES.MARKETING_MATURITY_ROADMAP,
  },
  {
    id: 'risk-management',
    name: 'Risk Management Framework',
    description: 'Comprehensive risk identification and mitigation strategies',
    icon: Shield,
    isSubscribed: false,
    route: ROUTES.MARKETING_RISK_MANAGEMENT,
  },
  {
    id: 'action-management',
    name: 'Action Management System',
    description: 'Streamline corrective actions and tracking',
    icon: FileText,
    isSubscribed: false,
    route: ROUTES.MARKETING_PROJECT_IMPLEMENTATION,
  },
  {
    id: 'video-surveillance',
    name: 'Video Surveillance Analysis',
    description: 'AI-driven insights from video surveillance data',
    icon: Eye,
    isSubscribed: false,
    route: ROUTES.MARKETING_DATA_ANALYTICS,
  },
];

const ModulesOverview: React.FC = () => {
  const navigate = useNavigate();

  const handleModuleClick = (module: (typeof ismsModules)[0]) => {
    navigate(module.route);
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
            Choose from our comprehensive Information Security Management System modules to build
            and maintain your organization&#39;s security maturity.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {ismsModules.map((module) => {
            const IconComponent = module.icon;

            return (
              <Card
                key={module.id}
                className="relative cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={() => handleModuleClick(module)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-lg bg-muted text-muted-foreground">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl">{module.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {module.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="outline" className="text-muted-foreground">
                        Learn More
                      </Badge>
                    </div>

                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-2">View Details</span>
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
                Our team is ready to help you maximize the value of your ISMS investment.
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
