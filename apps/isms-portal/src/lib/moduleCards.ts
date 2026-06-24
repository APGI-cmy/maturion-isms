import {
  AlertCircle,
  BarChart,
  Database,
  GraduationCap,
  Settings,
  Shield,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export type IsmsModuleCard = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  route: string;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  badge: string;
  badgeVariant: 'default' | 'secondary' | 'outline';
};

export const ISMS_MODULE_CARDS: IsmsModuleCard[] = [
  {
    id: 'maturity-roadmap',
    name: 'Maturity Roadmap',
    shortName: 'Maturity Roadmap',
    description: 'Build and assess your organizational security maturity with AI-driven insights',
    icon: TrendingUp,
    route: ROUTES.MARKETING_MATURITY_ROADMAP,
    gradient: 'from-emerald-400 to-green-500',
    bgGradient: 'from-emerald-50 to-green-50',
    borderColor: 'border-emerald-200',
    badge: 'Foundation',
    badgeVariant: 'default',
  },
  {
    id: 'risk-management',
    name: 'Risk Management',
    shortName: 'Risk',
    description: 'Comprehensive risk identification, assessment, and mitigation strategies',
    icon: Shield,
    route: ROUTES.MARKETING_RISK_MANAGEMENT,
    gradient: 'from-orange-400 to-amber-500',
    bgGradient: 'from-orange-50 to-amber-50',
    borderColor: 'border-orange-200',
    badge: 'Coming Soon',
    badgeVariant: 'secondary',
  },
  {
    id: 'project-implementation',
    name: 'Project Implementation Tracker',
    shortName: 'PIT',
    description: 'Track security improvement projects, implementation activity, and evidence readiness',
    icon: Settings,
    route: ROUTES.MARKETING_PROJECT_IMPLEMENTATION,
    gradient: 'from-blue-400 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
    badge: 'Coming Soon',
    badgeVariant: 'secondary',
  },
  {
    id: 'data-analytics-assurance',
    name: 'Data Analytics & Assurance',
    shortName: 'Analytics',
    description: 'Real-time dashboards, predictive analytics, and AI-powered insights',
    icon: BarChart,
    route: ROUTES.MARKETING_DATA_ANALYTICS,
    gradient: 'from-purple-400 to-indigo-500',
    bgGradient: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-200',
    badge: 'Coming Soon',
    badgeVariant: 'secondary',
  },
  {
    id: 'systems-integration',
    name: 'Systems Integration',
    shortName: 'Integration',
    description: 'Connect multiple data sources with automated extraction and transformation',
    icon: Database,
    route: ROUTES.MARKETING_SYSTEMS_INTEGRATION,
    gradient: 'from-cyan-400 to-teal-500',
    bgGradient: 'from-cyan-50 to-teal-50',
    borderColor: 'border-cyan-200',
    badge: 'Coming Soon',
    badgeVariant: 'secondary',
  },
  {
    id: 'skills-development',
    name: 'Skills Development',
    shortName: 'Skills',
    description: 'Globally recognized development track for the next generation of security professionals',
    icon: GraduationCap,
    route: ROUTES.MARKETING_SKILLS_DEVELOPMENT,
    gradient: 'from-teal-400 to-green-500',
    bgGradient: 'from-teal-50 to-green-50',
    borderColor: 'border-teal-200',
    badge: 'Coming Soon',
    badgeVariant: 'secondary',
  },
  {
    id: 'incident-intelligence',
    name: 'Incident & Intelligence Hub',
    shortName: 'Incidents',
    description: '24/7 incident tracking, automated escalation, root cause analysis, and response intelligence',
    icon: AlertCircle,
    route: ROUTES.MARKETING_INCIDENT_INTELLIGENCE,
    gradient: 'from-red-400 to-pink-500',
    bgGradient: 'from-red-50 to-pink-50',
    borderColor: 'border-red-200',
    badge: 'Coming Soon',
    badgeVariant: 'secondary',
  },
];
