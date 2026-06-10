import type { IsmsModuleKey } from './entitlements';

export type AskMaturionAudience = 'public' | 'authenticated';

export interface AskMaturionPromptSeed {
  moduleKey: IsmsModuleKey | 'general';
  audience: AskMaturionAudience;
  title: string;
  seed: string;
  deferred?: boolean;
}

export const askMaturionPromptSeeds: AskMaturionPromptSeed[] = [
  {
    moduleKey: 'general',
    audience: 'public',
    title: 'Understand the ISMS approach',
    seed: 'Explain how the ISMS maturity roadmap helps an organisation move from informal security practices to operational resilience. Keep the answer educational and do not provide private implementation instructions.',
  },
  {
    moduleKey: 'maturity-roadmap',
    audience: 'public',
    title: 'Learn about the maturity roadmap',
    seed: 'Explain the purpose of a maturity roadmap and why a structured baseline is useful before investing in operational improvement.',
  },
  {
    moduleKey: 'maturity-roadmap',
    audience: 'authenticated',
    title: 'Prepare maturity setup',
    seed: 'Use the filtered ISMS context to help the user prepare for maturity roadmap setup. Do not infer entitlements and do not expose backend, private MMM execution, or audit implementation details.',
  },
  {
    moduleKey: 'risk-management',
    audience: 'public',
    title: 'Understand security risk management',
    seed: 'Explain risk management as an educational concept for operational security maturity. Keep the answer high level and do not imply subscribed access.',
  },
  {
    moduleKey: 'project-implementation',
    audience: 'public',
    title: 'Understand project implementation',
    seed: 'Explain how governed project implementation supports security maturity without describing private project data or execution workflows.',
  },
  {
    moduleKey: 'data-analytics-assurance',
    audience: 'public',
    title: 'Understand data analytics and assurance',
    seed: 'Explain how analytics and assurance can strengthen evidence-led security maturity. Keep the answer educational and generic.',
  },
  {
    moduleKey: 'skills-development',
    audience: 'public',
    title: 'Understand skills development',
    seed: 'Explain why skills development matters for operational security maturity and resilience. Do not provide private training plans.',
  },
  {
    moduleKey: 'incident-intelligence',
    audience: 'public',
    title: 'Understand incident intelligence',
    seed: 'Explain how incidents and weak signals can become improvement intelligence. Keep the answer educational and non-case-specific.',
  },
  {
    moduleKey: 'systems-integration',
    audience: 'public',
    title: 'Understand systems integration',
    seed: 'Explain why systems integration and reliable data extraction matter for security maturity. Do not describe live integrations or backend functions.',
  },
];

export function findPromptSeed(moduleKey: IsmsModuleKey | 'general', audience: AskMaturionAudience): AskMaturionPromptSeed {
  return (
    askMaturionPromptSeeds.find((seed) => seed.moduleKey === moduleKey && seed.audience === audience) ??
    askMaturionPromptSeeds.find((seed) => seed.moduleKey === moduleKey && seed.audience === 'public') ??
    askMaturionPromptSeeds[0]
  );
}
