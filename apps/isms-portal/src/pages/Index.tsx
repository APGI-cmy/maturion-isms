import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Clock,
  Bot,
  Eye,
  ChevronRight,
  LogIn,
  Shield,
  Settings,
  Users,
  Lock,
  BarChart,
  Rocket,
  TrendingUp,
  Database,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const OPERATIONAL_DOMAINS = [
  {
    name: 'Leadership & Governance',
    description: 'Strategic oversight, policy framework, and organizational accountability',
    icon: Shield,
    gradient: 'from-emerald-400 to-green-500',
    bgGradient: 'from-emerald-50 to-green-50',
    borderColor: 'border-emerald-200',
  },
  {
    name: 'Process Integrity',
    description: 'Systematic workflows, quality controls, and operational consistency',
    icon: Settings,
    gradient: 'from-orange-400 to-amber-500',
    bgGradient: 'from-orange-50 to-amber-50',
    borderColor: 'border-orange-200',
  },
  {
    name: 'People & Culture',
    description: 'Team development, organizational values, and collaborative excellence',
    icon: Users,
    gradient: 'from-red-400 to-pink-500',
    bgGradient: 'from-red-50 to-pink-50',
    borderColor: 'border-red-200',
  },
  {
    name: 'Protection',
    description: 'Risk mitigation, security measures, and asset safeguarding',
    icon: Lock,
    gradient: 'from-blue-400 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
  },
  {
    name: 'Proof it Works',
    description: 'Performance metrics, validation processes, and outcome measurement',
    icon: BarChart,
    gradient: 'from-purple-600 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-200',
  },
  {
    name: 'Enablement',
    description: 'Technology adoption, capability building, and innovation acceleration',
    icon: Rocket,
    gradient: 'from-violet-400 to-purple-500',
    bgGradient: 'from-violet-50 to-purple-50',
    borderColor: 'border-violet-200',
  },
];

const ISMS_MODULES = [
  {
    name: 'Maturity Roadmap',
    description: 'Build and assess your organizational security maturity with AI-driven insights',
    icon: TrendingUp,
    route: ROUTES.MARKETING_MATURITY_ROADMAP,
    gradient: 'from-emerald-400 to-green-500',
    bgGradient: 'from-emerald-50 to-green-50',
    borderColor: 'border-emerald-200',
    badge: 'Foundation',
    badgeVariant: 'default' as const,
  },
  {
    name: 'Risk Management',
    description: 'Comprehensive risk identification, assessment, and mitigation strategies',
    icon: Shield,
    route: ROUTES.MARKETING_RISK_MANAGEMENT,
    gradient: 'from-orange-400 to-amber-500',
    bgGradient: 'from-orange-50 to-amber-50',
    borderColor: 'border-orange-200',
    badge: 'Coming Soon',
    badgeVariant: 'secondary' as const,
  },
  {
    name: 'Project Implementation Tracking',
    description: 'Automated process testing, control effectiveness, and continuous monitoring',
    icon: Settings,
    route: ROUTES.MARKETING_PROJECT_IMPLEMENTATION,
    gradient: 'from-blue-400 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
    badge: 'Coming Soon',
    badgeVariant: 'secondary' as const,
  },
  {
    name: 'Data Analytics & Assurance',
    description: 'Real-time dashboards, predictive analytics, and AI-powered insights',
    icon: BarChart,
    route: ROUTES.MARKETING_DATA_ANALYTICS,
    gradient: 'from-purple-400 to-indigo-500',
    bgGradient: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-200',
    badge: 'Coming Soon',
    badgeVariant: 'secondary' as const,
  },
  {
    name: 'Systems Integration',
    description: 'Connect multiple data sources with automated extraction and transformation',
    icon: Database,
    route: ROUTES.MARKETING_SYSTEMS_INTEGRATION,
    gradient: 'from-cyan-400 to-teal-500',
    bgGradient: 'from-cyan-50 to-teal-50',
    borderColor: 'border-cyan-200',
    badge: 'Coming Soon',
    badgeVariant: 'secondary' as const,
  },
  {
    name: 'Skills Development',
    description: 'Globally recognized development track for the next generation of security professionals',
    icon: GraduationCap,
    route: ROUTES.MARKETING_SKILLS_DEVELOPMENT,
    gradient: 'from-teal-400 to-green-500',
    bgGradient: 'from-teal-50 to-green-50',
    borderColor: 'border-teal-200',
    badge: 'Coming Soon',
    badgeVariant: 'secondary' as const,
  },
  {
    name: 'Incident & Intelligence Hub',
    description: '24/7 incident tracking, automated escalation, root cause analysis, and response intelligence',
    icon: AlertCircle,
    route: ROUTES.MARKETING_INCIDENT_INTELLIGENCE,
    gradient: 'from-red-400 to-pink-500',
    bgGradient: 'from-red-50 to-pink-50',
    borderColor: 'border-red-200',
    badge: 'Coming Soon',
    badgeVariant: 'secondary' as const,
  },
];

const FEATURE_PROMISES = [
  {
    icon: Clock,
    title: '15-Minute Start',
    description: 'Begin with a quick assessment and get immediate insight',
    tooltip:
      'Complete our free operational maturity assessment in just 15 minutes and receive instant results showing your organization\'s current state across all domains.',
  },
  {
    icon: Bot,
    title: 'Expert Guidance',
    description: 'AI analysis + auditor escalation when needed',
    tooltip:
      'Our AI provides intelligent recommendations based on industry best practices, with the option to escalate complex issues to certified auditors.',
  },
  {
    icon: Eye,
    title: 'Complete Transparency',
    description: 'See every step, requirement, and benefit upfront',
    tooltip:
      'No hidden fees or surprise requirements. See exactly what\'s involved in your maturity journey from assessment to certification.',
  },
];

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredDomain, setHoveredDomain] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const handleStartAssessment = () => {
    navigate(ROUTES.FREE_ASSESSMENT);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/40">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Maturion</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.MODULES)}
              >
                Modules
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.JOURNEY)}
              >
                Journey
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.AUTH)}
                className="flex items-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Maturion ISMS
          </p>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Integrated Security Management System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            One platform to assess, govern, and continuously improve your organisation&apos;s
            security posture — from free maturity assessment to full operational excellence.
          </p>

          <div className="space-y-3">
            <Button
              size="lg"
              onClick={handleStartAssessment}
              className="text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
            >
              Start Your Free Assessment
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Powered by the Maturity Roadmap module
            </p>
          </div>
        </div>
      </section>

      {/* Feature Promises */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {FEATURE_PROMISES.map((feature, index) => (
            <Card
              key={index}
              className="relative transition-all duration-300 hover:shadow-lg cursor-pointer"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  {feature.description}
                </CardDescription>
                {hoveredFeature === index && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-2 p-4 bg-popover border rounded-lg shadow-lg">
                    <p className="text-sm text-popover-foreground">{feature.tooltip}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ISMS Modules Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-violet-50/50 to-blue-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              🌐 Your Integrated ISMS Platform
            </h2>
            <p className="text-lg text-muted-foreground">
              Seven integrated modules to build and maintain operational security maturity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {ISMS_MODULES.map((module, index) => (
              <Card
                key={index}
                className={`relative transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group border-2 ${module.borderColor} bg-gradient-to-br ${module.bgGradient}`}
                onClick={() => navigate(module.route)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-end mb-2">
                    <Badge variant={module.badgeVariant} className="text-xs">
                      {module.badge}
                    </Badge>
                  </div>
                  <div
                    className={`mx-auto mb-3 w-14 h-14 bg-gradient-to-r ${module.gradient} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <module.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-base font-semibold group-hover:scale-105 transition-transform">
                    {module.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs text-center leading-relaxed">
                    {module.description}
                  </CardDescription>
                  <div className="flex items-center justify-center mt-3 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn More <ChevronRight className="h-3 w-3 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Six Domains of Operational Excellence */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Six Domains of Operational Excellence</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive framework for organizational maturity and resilience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {OPERATIONAL_DOMAINS.map((domain, index) => (
              <Card
                key={index}
                className={`relative transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group border-2 ${domain.borderColor} bg-gradient-to-br ${domain.bgGradient}`}
                onMouseEnter={() => setHoveredDomain(index)}
                onMouseLeave={() => setHoveredDomain(null)}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto mb-4 w-16 h-16 bg-gradient-to-r ${domain.gradient} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <domain.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold group-hover:scale-105 transition-transform">
                    {domain.name}
                  </CardTitle>
                </CardHeader>
                {hoveredDomain === index && (
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm leading-relaxed">
                      {domain.description}
                    </CardDescription>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start with our free 15-minute assessment and discover your organization&#39;s current
            maturity level across all six domains.
          </p>
          <div className="space-y-3">
            <Button
              size="lg"
              onClick={handleStartAssessment}
              className="text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
            >
              Start Your Free Assessment
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Powered by the Maturity Roadmap module
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-secondary/5 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Maturion. Complete transparency in your operational maturity journey.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
