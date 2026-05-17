import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, CheckCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const features = [
  'ISO 27001 & NIST CSF alignment mapping',
  'Domain-level maturity scoring and gap analysis',
  'Evidence-based assessment workflows',
  'Remediation roadmap generation',
  'Multi-framework compliance coverage',
  'Historical trend tracking and benchmarking',
];

const benefits = [
  {
    title: 'Know Your Baseline',
    description:
      'Understand exactly where your organization stands against industry standards and frameworks.',
  },
  {
    title: 'Prioritize Improvements',
    description:
      'Get an actionable roadmap that prioritizes security investments by impact and effort.',
  },
  {
    title: 'Track Progress Over Time',
    description:
      'Measure maturity improvements across assessments and demonstrate value to stakeholders.',
  },
];

const MaturityRoadmapInfo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.HOME)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Button size="sm" onClick={() => navigate(ROUTES.SUBSCRIBE)}>
              Get Started
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
              <TrendingUp className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            Maturity Roadmap Module
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Build a Clear Path to Security Maturity
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            The Maturity Roadmap module gives your organization a structured, evidence-based journey
            from baseline assessment to continuous security improvement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate(ROUTES.FREE_ASSESSMENT)}>
              Start Free Assessment
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate(ROUTES.SUBSCRIBE)}>
              View Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Module Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-base">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Use the Maturity Roadmap?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-emerald-50 dark:bg-emerald-900/10">
        <div className="container mx-auto max-w-2xl text-center">
          <TrendingUp className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Map Your Maturity Journey?</h2>
          <p className="text-muted-foreground mb-8">
            Start with a free assessment and see where your organization stands today.
          </p>
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => navigate(ROUTES.SUBSCRIBE)}
          >
            Subscribe to Maturity Roadmap
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default MaturityRoadmapInfo;
